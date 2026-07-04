import type { Gender } from "@/features/auth/types";

export type EmailAvailabilityRequest = {
  email: string;
};

export type EmailAvailabilityResponse = {
  available: boolean;
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
