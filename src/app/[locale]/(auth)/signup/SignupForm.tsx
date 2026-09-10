"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDER } from "@/features/auth/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { GENDER_OPTIONS, MONTHS, useSignupForm } from "./useSignupForm";

const GENDER_LABEL_KEY: Record<(typeof GENDER_OPTIONS)[number], "male" | "female" | "notSpecified"> = {
  [GENDER.MALE]: "male",
  [GENDER.FEMALE]: "female",
  [GENDER.NOT_SPECIFIED]: "notSpecified",
};

export default function SignupForm() {
  const t = useTranslations();
  const signupForm = useSignupForm();
  const { emailRegister, errors, handleSubmit, register, setValue } = signupForm.form;
  const { agreeAll, agreeMarketing, agreePrivacy, agreeService } = signupForm.agreements;
  const { selectedBirthMonth, selectedGender } = signupForm.fields;
  const { isCheckingEmail, isSubmitting } = signupForm.status;
  const { handleAgreeAllChange, handleEmailBlur, handleIndividualChange, onSubmit } =
    signupForm.handlers;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField label={t("signup.form.nameLabel")} required error={errors.name?.message}>
        <Input {...register("name")} type="text" placeholder={t("signup.form.namePlaceholder")} />
      </FormField>

      <FormField
        label={t("signup.form.emailLabel")}
        required
        error={errors.email?.message}
        hint={isCheckingEmail ? t("signup.form.emailChecking") : undefined}
      >
        <Input
          {...emailRegister}
          type="text"
          inputMode="email"
          placeholder={t("signup.form.emailPlaceholder")}
          onBlur={handleEmailBlur}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField
          label={t("signup.form.passwordLabel")}
          required
          error={errors.password?.message}
          hint={t("signup.form.passwordHint")}
        >
          <PasswordInput
            {...register("password")}
            placeholder={t("signup.form.passwordPlaceholder")}
          />
        </FormField>

        <FormField
          label={t("signup.form.confirmPasswordLabel")}
          required
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            {...register("confirmPassword")}
            placeholder={t("signup.form.confirmPasswordPlaceholder")}
          />
        </FormField>
      </div>

      <FormField
        label={t("signup.form.birthDateLabel")}
        required
        error={errors.birthYear?.message ?? errors.birthMonth?.message ?? errors.birthDay?.message}
      >
        <div className="grid grid-cols-[2fr_1.6fr_1.8fr] gap-2">
          <Input
            {...register("birthYear")}
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder={t("signup.form.birthYearPlaceholder")}
          />
          <Select
            value={selectedBirthMonth || undefined}
            onValueChange={(v) => setValue("birthMonth", v, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("signup.form.birthMonthPlaceholder")} />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-48 min-w-0">
              {MONTHS.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {t("signup.form.monthOption", { month: m })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            {...register("birthDay")}
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder={t("signup.form.birthDayPlaceholder")}
          />
        </div>
      </FormField>

      <FormField label={t("signup.form.genderLabel")} required error={errors.gender?.message}>
        <div className="grid grid-cols-3 gap-2">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setValue("gender", g, { shouldValidate: true })}
              aria-pressed={selectedGender === g}
              className={cn(
                "press text-body-sm h-11 cursor-pointer rounded-xs border font-semibold",
                selectedGender === g
                  ? "border-brand bg-brand-wash text-brand-ink"
                  : "border-line-control text-ink-2 hover:border-ink-3 hover:text-ink",
              )}
            >
              {t(`gender.${GENDER_LABEL_KEY[g]}`)}
            </button>
          ))}
        </div>
      </FormField>

      <div className="border-line bg-surface-2 flex flex-col gap-3 rounded-sm border p-3">
        <label className="border-line bg-surface flex cursor-pointer items-center gap-3 rounded-xs border px-3 py-3">
          <Checkbox
            checked={
              agreeAll
                ? true
                : agreeService || agreePrivacy || agreeMarketing
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(checked) => {
              handleAgreeAllChange(checked === true);
            }}
          />
          <span className="text-ink text-body-sm font-semibold">
            {t("signup.form.agreeAll")}
          </span>
        </label>

        <div className="flex flex-col gap-2 px-3">
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={agreeService}
              onCheckedChange={(checked) =>
                handleIndividualChange("agreeService", checked === true)
              }
            />
            <span className="text-ink-2 text-body-sm flex-1">{t("signup.form.agreeService")}</span>
            <Link
              href="/policy/terms"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("signup.form.agreeService")}
              className="text-ink-3 shrink-0"
              onClick={(event) => event.stopPropagation()}
            >
              <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
            </Link>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={agreePrivacy}
              onCheckedChange={(checked) =>
                handleIndividualChange("agreePrivacy", checked === true)
              }
            />
            <span className="text-ink-2 text-body-sm flex-1">{t("signup.form.agreePrivacy")}</span>
            <Link
              href="/policy/privacy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("signup.form.agreePrivacy")}
              className="text-ink-3 shrink-0"
              onClick={(event) => event.stopPropagation()}
            >
              <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
            </Link>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox
              checked={agreeMarketing}
              onCheckedChange={(checked) =>
                handleIndividualChange("agreeMarketing", checked === true)
              }
            />
            <span className="text-ink-2 text-body-sm flex-1">
              {t("signup.form.agreeMarketing")}
            </span>
          </label>
        </div>
      </div>
      {(errors.agreeService || errors.agreePrivacy) && (
        <p role="alert" className="text-danger-ink text-cap font-medium">
          {errors.agreeService?.message ?? errors.agreePrivacy?.message}
        </p>
      )}

      {errors.root?.message && (
        <p role="alert" className="text-danger-ink text-cap font-medium">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} size="lg" className="mt-2 w-full">
        {isSubmitting ? t("signup.form.submitting") : t("signup.form.submit")}
      </Button>
    </form>
  );
}
