export type PolicyDocumentType = "service" | "privacy" | "marketing";

export type PolicyDocumentResponse = {
  type: "SERVICE" | "PRIVACY" | "MARKETING";
  title: string;
  version: string;
  effectiveDate: string;
  content: string;
};
