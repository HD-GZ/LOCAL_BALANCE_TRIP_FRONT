"use client";

import { type FocusEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { signup } from "@/features/auth/api";
import { savePendingEmailVerification } from "@/features/auth/storage";
import { GENDER, type Gender } from "@/features/auth/types";
import { checkEmailAvailability } from "@/features/user/api";
import { getFieldErrors, isApiError } from "@/lib/api/error";

export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
export const GENDER_OPTIONS = ["남성", "여성", "선택안함"] as const;

const emailSchema = z.email("올바른 이메일 형식을 입력해 주세요.");
const DUPLICATE_EMAIL_ERROR_CODE = "DUPLICATE_EMAIL";
const GENDER_MAP = {
  남성: GENDER.MALE,
  여성: GENDER.FEMALE,
  선택안함: GENDER.NOT_SPECIFIED,
} as const satisfies Record<(typeof GENDER_OPTIONS)[number], Gender>;

const schema = z
  .object({
    name: z.string().min(1, "이름을 입력해 주세요."),
    email: emailSchema,
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 해요.")
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "영문·숫자를 포함해 주세요."),
    confirmPassword: z.string().min(1, "비밀번호를 다시 입력해 주세요."),
    birthYear: z.string().regex(/^\d{4}$/, "년도 4자리를 입력해 주세요."),
    birthMonth: z.string().min(1, "월을 선택해 주세요."),
    birthDay: z
      .string()
      .regex(/^\d{1,2}$/, "일을 입력해 주세요.")
      .refine((v) => {
        const n = Number(v);
        return n >= 1 && n <= 31;
      }, "올바른 일을 입력해 주세요."),
    gender: z.enum(GENDER_OPTIONS, {
      message: "성별을 선택해 주세요.",
    }),
    agreeService: z.boolean().refine((v) => v, "서비스 이용약관에 동의해 주세요."),
    agreePrivacy: z.boolean().refine((v) => v, "개인정보 수집·이용에 동의해 주세요."),
    agreeMarketing: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않아요.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof schema>;
type AgreementField = "agreeService" | "agreePrivacy" | "agreeMarketing";

export function useSignupForm() {
  const router = useRouter();
  const [agreeAll, setAgreeAll] = useState(false);

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
        setError("root", { message: "회원가입 중 오류가 발생했습니다." });
        return;
      }

      if (error.code === DUPLICATE_EMAIL_ERROR_CODE) {
        setError("email", { message: error.message }, { shouldFocus: true });
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
        setError("root", { message: error.message });
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
        setError("email", { message: "이미 사용 중인 이메일입니다." }, { shouldFocus });
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
      gender: GENDER_MAP[data.gender],
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
