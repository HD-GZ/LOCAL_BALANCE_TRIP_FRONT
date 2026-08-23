"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
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
import type { MeResponse } from "@/features/user/types";
import { cn } from "@/lib/utils";
import AccountRow from "./AccountRow";
import { GENDER_OPTIONS, MONTHS, useAccountForm } from "./useAccountForm";
import WithdrawDialog from "./WithdrawDialog";

type AccountFormProps = {
  user: MeResponse;
};

const GENDER_LABEL_KEY: Record<(typeof GENDER_OPTIONS)[number], "male" | "female" | "notSpecified"> = {
  [GENDER.MALE]: "male",
  [GENDER.FEMALE]: "female",
  [GENDER.NOT_SPECIFIED]: "notSpecified",
};

export default function AccountForm({ user }: AccountFormProps) {
  const t = useTranslations();
  const accountForm = useAccountForm(user);
  const { errors, handleSubmit, register, setValue } = accountForm.form;
  const { selectedBirthMonth, selectedGender } = accountForm.fields;
  const { isSubmitting, isDirty } = accountForm.status;
  const { onSubmit } = accountForm.handlers;

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-6">
        <h1 className="text-title-1 text-ink sm:text-display-2">{t("account.title")}</h1>
        <p className="text-ink-3 text-cap font-normal">
          <span className="text-danger-ink">*</span> {t("account.requiredNote")}
        </p>
      </div>

      <AccountRow label={t("account.emailLabel")} required hint={t("account.emailHint")}>
        <Input value={user.email} readOnly disabled aria-label={t("account.emailLabel")} />
      </AccountRow>

      <AccountRow label={t("account.nameLabel")} required error={errors.name?.message}>
        <Input
          {...register("name")}
          type="text"
          placeholder={t("account.namePlaceholder")}
        />
      </AccountRow>

      <AccountRow
        label={t("account.passwordLabel")}
        optional
        optionalLabel={t("accountRow.optionalSuffix")}
        error={errors.password?.message}
      >
        <PasswordInput
          {...register("password")}
          autoComplete="new-password"
          placeholder={t("account.passwordPlaceholder")}
        />
      </AccountRow>

      <AccountRow
        label={t("account.confirmPasswordLabel")}
        optional
        optionalLabel={t("accountRow.optionalSuffix")}
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          {...register("confirmPassword")}
          autoComplete="new-password"
          placeholder={t("account.confirmPasswordPlaceholder")}
        />
      </AccountRow>

      <AccountRow
        label={t("account.birthDateLabel")}
        required
        error={errors.birthYear?.message ?? errors.birthMonth?.message ?? errors.birthDay?.message}
      >
        <div className="grid grid-cols-3 gap-2">
          <Input
            {...register("birthYear")}
            type="text"
            inputMode="numeric"
            maxLength={4}
            aria-label={t("account.birthYearAriaLabel")}
            placeholder={t("account.birthYearPlaceholder")}
          />
          <Select
            value={selectedBirthMonth || undefined}
            onValueChange={(value) =>
              setValue("birthMonth", value, { shouldValidate: true, shouldDirty: true })
            }
          >
            <SelectTrigger aria-label={t("account.birthMonthAriaLabel")}>
              <SelectValue placeholder={t("account.birthMonthPlaceholder")} />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-48 min-w-0">
              {MONTHS.map((month) => (
                <SelectItem key={month} value={String(month)}>
                  {t("signup.form.monthOption", { month })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            {...register("birthDay")}
            type="text"
            inputMode="numeric"
            maxLength={2}
            aria-label={t("account.birthDayAriaLabel")}
            placeholder={t("account.birthDayPlaceholder")}
          />
        </div>
      </AccountRow>

      <AccountRow
        label={t("account.genderLabel")}
        required
        error={errors.gender?.message}
        className="border-b"
      >
        <div className="grid grid-cols-3 gap-2">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={selectedGender === option}
              onClick={() =>
                setValue("gender", option, { shouldValidate: true, shouldDirty: true })
              }
              className={cn(
                "press text-body-sm h-11 cursor-pointer rounded-xs border font-semibold",
                selectedGender === option
                  ? "border-brand bg-brand-wash text-brand-ink"
                  : "border-line-control text-ink-2 hover:border-ink-3 hover:text-ink",
              )}
            >
              {t(`gender.${GENDER_LABEL_KEY[option]}`)}
            </button>
          ))}
        </div>
      </AccountRow>

      {errors.root?.message && (
        <p role="alert" className="text-danger-ink text-cap pt-4 font-medium">
          {errors.root.message}
        </p>
      )}

      <div className="flex gap-3 pt-8">
        <Button type="submit" size="lg" disabled={isSubmitting || !isDirty} className="flex-2">
          {isSubmitting ? t("account.saving") : t("account.submit")}
        </Button>
        <WithdrawDialog />
      </div>
    </form>
  );
}
