export type AuthToken = {
  accessToken: string;
  refreshToken: string;
};

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING_EMAIL_VERIFICATION: "PENDING_EMAIL_VERIFICATION",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const GENDER = {
  FEMALE: "FEMALE",
  MALE: "MALE",
  NOT_SPECIFIED: "NOT_SPECIFIED",
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  birthDate: string;
  gender: Gender;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed?: boolean;
};

export type AuthUserResponse = {
  userId: number;
  email: string;
  status: UserStatus;
};

export type EmailVerificationPendingResponse = AuthUserResponse & {
  verificationCodeExpiresIn: number;
};

export type TokenRefreshRequest = {
  refreshToken: string;
};

export type EmailVerificationConfirmRequest = {
  code: string;
};

export type EmailVerificationResendRequest = {
  email: string;
};
