"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { GENDER, type Gender } from "@/features/auth/types";
import { updateMe } from "@/features/user/api";
import { userQueryKeys } from "@/features/user/queries";
import type { MeResponse } from "@/features/user/types";
import { getApiErrorMessage, getFieldErrors, isApiError } from "@/lib/api/error";

export const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
export const GENDER_OPTIONS = [GENDER.MALE, GENDER.FEMALE, GENDER.NOT_SPECIFIED] as const;

function createSchema(t: ReturnType<typeof useTranslations>) {
  return z
    .object({
      name: z.string().min(1, t("account.validation.nameRequired")),
      password: z.string(),
      confirmPassword: z.string(),
      birthYear: z.string().regex(/^\d{4}$/, t("account.validation.birthYearInvalid")),
      birthMonth: z.string().min(1, t("account.validation.birthMonthRequired")),
      birthDay: z
        .string()
        .regex(/^\d{1,2}$/, t("account.validation.birthDayInvalid"))
        .refine((value) => {
          const day = Number(value);
          return day >= 1 && day <= 31;
        }, t("account.validation.birthDayInvalid")),
      gender: z.enum(GENDER_OPTIONS, { message: t("account.validation.genderRequired") }),
    })
    // 비밀번호는 변경할 때만 입력하므로, 값이 있을 때만 규칙을 검사한다.
    .refine((data) => !data.password || data.password.length >= 8, {
      message: t("account.validation.passwordMinLength"),
      path: ["password"],
    })
    .refine((data) => !data.password || /(?=.*[a-zA-Z])(?=.*\d)/.test(data.password), {
      message: t("account.validation.passwordPattern"),
      path: ["password"],
    })
    .refine((data) => !data.password || data.confirmPassword.length > 0, {
      message: t("account.validation.confirmPasswordRequired"),
      path: ["confirmPassword"],
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("account.validation.passwordMismatch"),
      path: ["confirmPassword"],
    });
}

type AccountFormValues = {
  name: string;
  password: string;
  confirmPassword: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: Gender;
};

const FORM_FIELDS = new Set<string>([
  "name",
  "password",
  "confirmPassword",
  "birthYear",
  "birthMonth",
  "birthDay",
  "gender",
]);

function toFormValues(user: MeResponse): AccountFormValues {
  const [year, month, day] = user.birthDate.split("-");

  return {
    name: user.name,
    password: "",
    confirmPassword: "",
    birthYear: year ?? "",
    birthMonth: month ? String(Number(month)) : "",
    birthDay: day ? String(Number(day)) : "",
    gender: user.gender ?? GENDER.NOT_SPECIFIED,
  };
}

export function useAccountForm(user: MeResponse) {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const tApiError = useTranslations("apiError");
  const schema = createSchema(t);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(user),
  });

  const {
    clearErrors,
    control,
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    formState: { errors, isDirty },
  } = form;

  const selectedBirthMonth = useWatch({ control, name: "birthMonth" });
  const selectedGender = useWatch({ control, name: "gender" });

  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(userQueryKeys.me(), updatedUser);
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
      reset(toFormValues(updatedUser));
      toast.success(t("account.saveSuccess"));
    },
    onError: (error) => {
      if (!isApiError(error)) {
        setError("root", { message: t("account.errors.generic") });
        return;
      }

      let hasMappedFieldError = false;

      getFieldErrors(error).forEach(({ field, message }) => {
        const formField = field === "passwordConfirm" ? "confirmPassword" : field;

        if (formField === "birthDate") {
          setError("birthYear", { message });
          hasMappedFieldError = true;
          return;
        }

        if (FORM_FIELDS.has(formField)) {
          setError(formField as keyof AccountFormValues, { message });
          hasMappedFieldError = true;
        }
      });

      if (!hasMappedFieldError) {
        setError("root", { message: getApiErrorMessage(error, tApiError) });
      }
    },
  });

  const onSubmit = (data: AccountFormValues) => {
    if (!isDirty) {
      return;
    }

    clearErrors("root");

    updateMutation.mutate({
      name: data.name.trim(),
      birthDate: `${data.birthYear}-${data.birthMonth.padStart(2, "0")}-${data.birthDay.padStart(2, "0")}`,
      gender: data.gender,
      ...(data.password
        ? { password: data.password, passwordConfirm: data.confirmPassword }
        : undefined),
    });
  };

  return {
    fields: {
      selectedBirthMonth,
      selectedGender,
    },
    form: {
      errors,
      handleSubmit,
      register,
      setValue,
    },
    handlers: {
      onSubmit,
    },
    status: {
      isSubmitting: updateMutation.isPending,
      isDirty,
    },
  };
}
