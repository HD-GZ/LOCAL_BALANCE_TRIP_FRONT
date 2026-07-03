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
  gender: string;
  status: string;
  marketingAgreed: boolean;
};
