import { callBackend } from "@/lib/auth/bffHandler";

export async function GET() {
  return callBackend({ method: "GET", path: "/home/profile-types" });
}
