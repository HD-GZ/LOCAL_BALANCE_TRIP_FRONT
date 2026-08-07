import type { Gender } from "@/features/auth/types";

export type EmailAvailabilityRequest = {
  email: string;
};

export type EmailAvailabilityResponse = {
  available: boolean;
};

export type UserUpdateRequest = {
  name: string;
  birthDate: string;
  gender: Gender;
  /** 비밀번호를 바꾸지 않을 때는 보내지 않는다. */
  password?: string;
  passwordConfirm?: string;
};

export type MeResponse = {
  userId: number;
  name: string;
  email: string;
  birthDate: string;
  gender: Gender;
  status: string;
  marketingAgreed?: boolean;
};
