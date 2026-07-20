import { USER_STATUS, GENDER, type Gender, type UserStatus } from "@/features/auth/types";
import { assertNever } from "@/lib/assertNever";

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  [USER_STATUS.ACTIVE]: "활성",
  [USER_STATUS.PENDING_EMAIL_VERIFICATION]: "이메일 인증 대기",
};

export const GENDER_LABEL: Record<Gender, string> = {
  [GENDER.FEMALE]: "여성",
  [GENDER.MALE]: "남성",
  [GENDER.NOT_SPECIFIED]: "선택 안 함",
};

export function getUserStatusLabel(status: UserStatus) {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return USER_STATUS_LABEL[USER_STATUS.ACTIVE];
    case USER_STATUS.PENDING_EMAIL_VERIFICATION:
      return USER_STATUS_LABEL[USER_STATUS.PENDING_EMAIL_VERIFICATION];
    default:
      return assertNever(status);
  }
}

export function getGenderLabel(gender: Gender) {
  switch (gender) {
    case GENDER.FEMALE:
      return GENDER_LABEL[GENDER.FEMALE];
    case GENDER.MALE:
      return GENDER_LABEL[GENDER.MALE];
    case GENDER.NOT_SPECIFIED:
      return GENDER_LABEL[GENDER.NOT_SPECIFIED];
    default:
      return assertNever(gender);
  }
}
