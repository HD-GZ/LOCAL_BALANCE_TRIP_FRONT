"use client";

import { type FocusEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { signup } from "@/features/auth/api";
import { savePendingEmailVerification } from "@/features/auth/storage";
import { GENDER, type Gender } from "@/features/auth/types";
import { checkEmailAvailability } from "@/features/user/api";
import { useRouter } from "@/i18n/navigation";
import { getApiErrorMessage, getFieldErrors, isApiError } from "@/lib/api/error";

export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
export const GENDER_OPTIONS = [GENDER.MALE, GENDER.FEMALE, GENDER.NOT_SPECIFIED] as const;

const DUPLICATE_EMAIL_ERROR_CODE = "DUPLICATE_EMAIL";

function createSchema(t: ReturnType<typeof useTranslations>) {
  const emailSchema = z.email(t("validation.emailInvalid"));

  return {
    emailSchema,
    schema: z
      .object({
        name: z.string().min(1, t("validation.nameRequired")),
        email: emailSchema,
        password: z
          .string()
          .min(8, t("validation.passwordMinLength"))
          .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, t("validation.passwordPattern")),
        confirmPassword: z.string().min(1, t("validation.confirmPasswordRequired")),
        birthYear: z.string().regex(/^\d{4}$/, t("validation.birthYearInvalid")),
        birthMonth: z.string().min(1, t("validation.birthMonthRequired")),
        birthDay: z
          .string()
          .regex(/^\d{1,2}$/, t("validation.birthDayInvalid"))
          .refine((v) => {
            const n = Number(v);
            return n >= 1 && n <= 31;
          }, t("validation.birthDayInvalid")),
        gender: z.enum(GENDER_OPTIONS, {
          message: t("validation.genderRequired"),
        }),
        agreeService: z.boolean().refine((v) => v, t("validation.agreeServiceRequired")),
        agreePrivacy: z.boolean().refine((v) => v, t("validation.agreePrivacyRequired")),
        agreeMarketing: z.boolean(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t("validation.passwordMismatch"),
        path: ["confirmPassword"],
      }),
  };
}

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: Gender;
  agreeService: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
};
type AgreementField = "agreeService" | "agreePrivacy" | "agreeMarketing";

export function useSignupForm() {
  const router = useRouter();
  const t = useTranslations();
  const tApiError = useTranslations("apiError");
  const [agreeAll, setAgreeAll] = useState(false);
  const { emailSchema, schema } = createSchema(t);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      gender: undefined,
      agreeService: false,
      agreePrivacy: false,
      agreeMarketing: false,
    },
  });

  const {
    clearErrors,
    control,
    getValues,
    handleSubmit,
    register,
    setError,
    setValue,
    formState: { errors },
  } = form;

  const emailRegister = register("email");
  const selectedGender = useWatch({ control, name: "gender" });
  const selectedBirthMonth = useWatch({ control, name: "birthMonth" });
  const agreeService = useWatch({ control, name: "agreeService" });
  const agreePrivacy = useWatch({ control, name: "agreePrivacy" });
  const agreeMarketing = useWatch({ control, name: "agreeMarketing" });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: ({ email, verificationCodeExpiresIn }) => {
      savePendingEmailVerification({ email, verificationCodeExpiresIn });
      router.push("/verify-email");
    },
    onError: (error) => {
      if (!isApiError(error)) {
        setError("root", { message: t("signup.errors.generic") });
        return;
      }

      if (error.code === DUPLICATE_EMAIL_ERROR_CODE) {
        setError("email", { message: getApiErrorMessage(error, tApiError) }, { shouldFocus: true });
        return;
      }

      let hasMappedFieldError = false;

      getFieldErrors(error).forEach(({ field, message }) => {
        const formField = field === "passwordConfirm" ? "confirmPassword" : field;

        if (formField in schema.shape) {
          setError(formField as keyof SignupFormValues, { message });
          hasMappedFieldError = true;
        }
      });

      if (!hasMappedFieldError) {
        setError("root", { message: getApiErrorMessage(error, tApiError) });
      }
    },
  });

  const emailAvailabilityMutation = useMutation({
    mutationFn: checkEmailAvailability,
  });

  const verifyEmailAvailability = async (email: string, shouldFocus = false) => {
    const trimmedEmail = email.trim();

    if (!emailSchema.safeParse(trimmedEmail).success) {
      return false;
    }

    try {
      const { available } = await emailAvailabilityMutation.mutateAsync({ email: trimmedEmail });

      if (getValues("email").trim() !== trimmedEmail) {
        return false;
      }

      if (!available) {
        setError("email", { message: t("signup.errors.emailTaken") }, { shouldFocus });
        return false;
      }

      clearErrors("email");
      return true;
    } catch {
      if (shouldFocus) {
        clearErrors("email");
      }

      return true;
    }
  };

  const handleEmailBlur = (event: FocusEvent<HTMLInputElement>) => {
    emailRegister.onBlur(event);
    void verifyEmailAvailability(event.target.value);
  };

  const handleAgreeAllChange = (value: boolean) => {
    setAgreeAll(value);
    setValue("agreeService", value, { shouldValidate: true });
    setValue("agreePrivacy", value, { shouldValidate: true });
    setValue("agreeMarketing", value);
  };

  const handleIndividualChange = (field: AgreementField, value: boolean) => {
    setValue(field, value, { shouldValidate: true });
    const next = {
      agreeService,
      agreePrivacy,
      agreeMarketing,
      [field]: value,
    };
    setAgreeAll(next.agreeService && next.agreePrivacy && next.agreeMarketing);
  };

  const onSubmit = async (data: SignupFormValues) => {
    clearErrors("root");

    const isEmailAvailable = await verifyEmailAvailability(data.email, true);

    if (!isEmailAvailable) {
      return;
    }

    signupMutation.mutate({
      name: data.name,
      email: data.email.trim(),
      password: data.password,
      passwordConfirm: data.confirmPassword,
      birthDate: `${data.birthYear}-${data.birthMonth.padStart(2, "0")}-${data.birthDay.padStart(2, "0")}`,
      gender: data.gender,
      termsAgreed: data.agreeService,
      privacyAgreed: data.agreePrivacy,
      marketingAgreed: data.agreeMarketing,
    });
  };

  return {
    agreements: {
      agreeAll,
      agreeMarketing,
      agreePrivacy,
      agreeService,
    },
    fields: {
      selectedBirthMonth,
      selectedGender,
    },
    form: {
      emailRegister,
      errors,
      handleSubmit,
      register,
      setValue,
    },
    handlers: {
      handleAgreeAllChange,
      handleEmailBlur,
      handleIndividualChange,
      onSubmit,
    },
    status: {
      isCheckingEmail: emailAvailabilityMutation.isPending,
      isSubmitting: signupMutation.isPending,
    },
  };
}
