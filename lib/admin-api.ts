import { cookies } from "next/headers";
import { verifyAdminJwt } from "@/lib/auth";

export async function requireAdmin() {
  const name = process.env.ADMIN_COOKIE_NAME || "admin_token";
  const cookieStore = await cookies();
  const token = cookieStore.get(name)?.value;

  if (!token) throw new Error("UNAUTHORIZED");

  try {
    return await verifyAdminJwt(token);
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}
