import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
await writeAudit({
  actorId,
  actorEmail,
  action: "user.update",
  entity: "User",
  entityId: userId,
  details: { data },
});

  try {
    await requireAdmin();

    const { id } = await ctx.params;
    const userId = Number(id);
    if (!Number.isFinite(userId)) {
      return NextResponse.json({ ok: false, error: "bad id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const data: any = {};

    if (typeof body.isActive === "boolean") data.isActive = body.isActive;

    // на всякий: запрещаем менять роль/пароль тут
    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}
