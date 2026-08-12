"use client";

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
import type { MeResponse } from "@/features/user/types";
import { cn } from "@/lib/utils";
import AccountRow from "./AccountRow";
import { GENDER_OPTIONS, MONTHS, useAccountForm } from "./useAccountForm";
import WithdrawDialog from "./WithdrawDialog";

type AccountFormProps = {
  user: MeResponse;
};

export default function AccountForm({ user }: AccountFormProps) {
  const accountForm = useAccountForm(user);
  const { errors, handleSubmit, register, setValue } = accountForm.form;
  const { selectedBirthMonth, selectedGender } = accountForm.fields;
  const { isSubmitting } = accountForm.status;
  const { onSubmit } = accountForm.handlers;

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-6">
        <h1 className="text-title-1 text-ink sm:text-display-2">정보 변경</h1>
        <p className="text-ink-3 text-cap font-normal">
          <span className="text-danger-ink">*</span> 필수 입력사항
        </p>
      </div>

      <AccountRow label="이메일" required hint="계정 이메일은 변경하실 수 없어요.">
        <Input value={user.email} readOnly disabled aria-label="이메일" />
      </AccountRow>

      <AccountRow label="이름" required error={errors.name?.message}>
        <Input {...register("name")} type="text" placeholder="홍길동" />
      </AccountRow>

      <AccountRow label="비밀번호 변경" optional error={errors.password?.message}>
        <PasswordInput
          {...register("password")}
          autoComplete="new-password"
          placeholder="변경할 때만 입력해 주세요. 영문·숫자 포함 8자 이상"
        />
      </AccountRow>

      <AccountRow label="비밀번호 확인" optional error={errors.confirmPassword?.message}>
        <PasswordInput
          {...register("confirmPassword")}
          autoComplete="new-password"
          placeholder="비밀번호를 한번 더 입력해 주세요."
        />
      </AccountRow>

      <AccountRow
        label="생년월일"
        required
        error={errors.birthYear?.message ?? errors.birthMonth?.message ?? errors.birthDay?.message}
        hint="청년 여행 혜택 판별에 사용돼요."
      >
        <div className="grid grid-cols-3 gap-2">
          <Input
            {...register("birthYear")}
            type="text"
            inputMode="numeric"
            maxLength={4}
            aria-label="생년"
            placeholder="년 (4자리)"
          />
          <Select
            value={selectedBirthMonth || undefined}
            onValueChange={(value) => setValue("birthMonth", value, { shouldValidate: true })}
          >
            <SelectTrigger aria-label="생월">
              <SelectValue placeholder="월" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-48 min-w-0">
              {MONTHS.map((month) => (
                <SelectItem key={month} value={String(month)}>
                  {month}월
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            {...register("birthDay")}
            type="text"
            inputMode="numeric"
            maxLength={2}
            aria-label="생일"
            placeholder="일"
          />
        </div>
      </AccountRow>

      <AccountRow label="성별" required error={errors.gender?.message} className="border-b">
        <div className="grid grid-cols-3 gap-2">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={selectedGender === option}
              onClick={() => setValue("gender", option, { shouldValidate: true })}
              className={cn(
                "press text-body-sm h-11 cursor-pointer rounded-xs border font-semibold",
                selectedGender === option
                  ? "border-brand bg-brand-wash text-brand-ink"
                  : "border-line-control text-ink-2 hover:border-ink-3 hover:text-ink",
              )}
            >
              {option === "선택안함" ? "선택 안 함" : option}
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
        <Button type="submit" size="lg" disabled={isSubmitting} className="flex-2">
          {isSubmitting ? "저장 중..." : "정보수정"}
        </Button>
        <WithdrawDialog />
      </div>
    </form>
  );
}
