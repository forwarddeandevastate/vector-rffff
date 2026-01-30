import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";
import { writeAudit } from "@/lib/audit";

type AdminPayload = {
  sub: string | number;
  email: string;
  role?: string;
};

type RequireAdminResult =
  | { ok: true; payload: AdminPayload }
  | { ok: false; error: string; payload?: undefined };

async function getAdminPayloadOrThrow(): Promise<AdminPayload> {
  const res = (await requireAdmin()) as any;

  // Новый формат: { ok, payload }
  if (res && typeof res === "object" && "ok" in res) {
    if (!res.ok) throw new Error("UNAUTHORIZED");
    return res.payload as AdminPayload;
  }

  // Старый формат (если когда-то был): payload напрямую
  if (res && typeof res === "object" && "sub" in res && "email" in res) {
    return res as AdminPayload;
  }

  throw new Error("UNAUTHORIZED");
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdminPayloadOrThrow();
    const actorId = Number(admin.sub);
    const actorEmail = admin.email;

    const { id } = await ctx.params;
    const userId = Number(id);
    if (!Number.isFinite(userId)) {
      return NextResponse.json({ ok: false, error: "bad id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const data: any = {};

    if (typeof body.isActive === "boolean") data.isActive = body.isActive;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: false, error: "no fields to update" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
    });

    await writeAudit({
      actorId: Number.isFinite(actorId) ? actorId : null,
      actorEmail,
      action: "user.update",
      entity: "User",
      entityId: userId,
      details: { changed: data, result: updated },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}
