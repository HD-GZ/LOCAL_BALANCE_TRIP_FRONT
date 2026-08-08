"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { GENDER, type Gender } from "@/features/auth/types";
import { updateMe } from "@/features/user/api";
import { userQueryKeys } from "@/features/user/queries";
import type { MeResponse } from "@/features/user/types";
import { getFieldErrors, isApiError } from "@/lib/api/error";

export const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
export const GENDER_OPTIONS = ["남성", "여성", "선택안함"] as const;

type GenderOption = (typeof GENDER_OPTIONS)[number];

const GENDER_MAP = {
  남성: GENDER.MALE,
  여성: GENDER.FEMALE,
  선택안함: GENDER.NOT_SPECIFIED,
} as const satisfies Record<GenderOption, Gender>;

const GENDER_OPTION_MAP = {
  [GENDER.MALE]: "남성",
  [GENDER.FEMALE]: "여성",
  [GENDER.NOT_SPECIFIED]: "선택안함",
} as const satisfies Record<Gender, GenderOption>;

const schema = z
  .object({
    name: z.string().min(1, "이름을 입력해 주세요."),
    password: z.string(),
    confirmPassword: z.string(),
    birthYear: z.string().regex(/^\d{4}$/, "년도 4자리를 입력해 주세요."),
    birthMonth: z.string().min(1, "월을 선택해 주세요."),
    birthDay: z
      .string()
      .regex(/^\d{1,2}$/, "일을 입력해 주세요.")
      .refine((value) => {
        const day = Number(value);
        return day >= 1 && day <= 31;
      }, "올바른 일을 입력해 주세요."),
    gender: z.enum(GENDER_OPTIONS, { message: "성별을 선택해 주세요." }),
  })
  // 비밀번호는 변경할 때만 입력하므로, 값이 있을 때만 규칙을 검사한다.
  .refine((data) => !data.password || data.password.length >= 8, {
    message: "비밀번호는 8자 이상이어야 해요.",
    path: ["password"],
  })
  .refine((data) => !data.password || /(?=.*[a-zA-Z])(?=.*\d)/.test(data.password), {
    message: "영문·숫자를 포함해 주세요.",
    path: ["password"],
  })
  .refine((data) => !data.password || data.confirmPassword.length > 0, {
    message: "비밀번호를 다시 입력해 주세요.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

type AccountFormValues = z.infer<typeof schema>;

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
    gender: GENDER_OPTION_MAP[user.gender] ?? "선택안함",
  };
}

export function useAccountForm(user: MeResponse) {
  const queryClient = useQueryClient();

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
    formState: { errors },
  } = form;

  const selectedBirthMonth = useWatch({ control, name: "birthMonth" });
  const selectedGender = useWatch({ control, name: "gender" });

  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(userQueryKeys.me(), updatedUser);
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.me() });
      reset(toFormValues(updatedUser));
      toast.success("변경한 정보를 저장했어요.");
    },
    onError: (error) => {
      if (!isApiError(error)) {
        setError("root", { message: "정보 수정 중 오류가 발생했습니다." });
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
        setError("root", { message: error.message });
      }
    },
  });

  const onSubmit = (data: AccountFormValues) => {
    clearErrors("root");

    updateMutation.mutate({
      name: data.name.trim(),
      birthDate: `${data.birthYear}-${data.birthMonth.padStart(2, "0")}-${data.birthDay.padStart(2, "0")}`,
      gender: GENDER_MAP[data.gender],
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
    },
  };
}
