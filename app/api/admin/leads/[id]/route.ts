import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";
import { writeAudit } from "@/lib/audit";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const actorId = Number(admin.sub);
    const actorEmail = admin.email;

    const { id } = await ctx.params;
    const leadId = Number(id);
    if (!Number.isFinite(leadId)) {
      return NextResponse.json({ ok: false, error: "bad id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));

    const data: any = {};
    if (typeof body.status === "string") data.status = body.status;

    if (body.assignedToId === null) data.assignedToId = null;
    if (typeof body.assignedToId === "number") data.assignedToId = body.assignedToId;

    if (typeof body.isDuplicate === "boolean") data.isDuplicate = body.isDuplicate;

    if (body.duplicateOfId === null) data.duplicateOfId = null;
    if (typeof body.duplicateOfId === "number") data.duplicateOfId = body.duplicateOfId;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: false, error: "no fields to update" }, { status: 400 });
    }

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data,
      select: {
        id: true,
        status: true,
        assignedToId: true,
        isDuplicate: true,
        duplicateOfId: true,
      },
    });

    await writeAudit({
      actorId: Number.isFinite(actorId) ? actorId : null,
      actorEmail,
      action: "lead.update",
      entity: "Lead",
      entityId: leadId,
      details: { changed: data, result: updated },
    });

    return NextResponse.json({ ok: true, lead: updated });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json(
      { ok: false, error: e?.message || "server error" },
      { status }
    );
  }
}
