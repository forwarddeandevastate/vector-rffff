import { cookies } from "next/headers";
import { verifyAdminJwt } from "@/lib/auth";

export async function requireAdmin() {
  const name = process.env.ADMIN_COOKIE_NAME || "admin_token";
  const cookieStore = await cookies();
  const token = cookieStore.get(name)?.value;

  if (!token) {
    return { ok: false as const, error: "UNAUTHORIZED" };
  }

  try {
    const payload = await verifyAdminJwt(token);
    return { ok: true as const, payload };
  } catch {
    return { ok: false as const, error: "UNAUTHORIZED" };
  }
}
