import { callBackendWithJsonBody } from "@/lib/auth/bffHandler";

export async function POST(request: Request) {
  return callBackendWithJsonBody(request, "/auth/password-reset/confirm");
}
