import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id } = await ctx.params;
    const leadId = Number(id);
    if (!Number.isFinite(leadId)) {
      return NextResponse.json({ ok: false, error: "bad id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));

    // разрешаем только эти поля
    const data: any = {};

    if (typeof body.status === "string") data.status = body.status;

    if (body.assignedToId === null) data.assignedToId = null;
    if (typeof body.assignedToId === "number") data.assignedToId = body.assignedToId;

    if (typeof body.isDuplicate === "boolean") data.isDuplicate = body.isDuplicate;
    if (body.duplicateOfId === null) data.duplicateOfId = null;
    if (typeof body.duplicateOfId === "number") data.duplicateOfId = body.duplicateOfId;

    if (body.price === null) data.price = null;
    if (typeof body.price === "number") data.price = body.price;

    if (body.comment === null) data.comment = null;
    if (typeof body.comment === "string") data.comment = body.comment;

    if (body.datetime === null) data.datetime = null;
    if (typeof body.datetime === "string") data.datetime = body.datetime;

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data,
      select: {
        id: true,
        status: true,
        assignedToId: true,
        isDuplicate: true,
        duplicateOfId: true,
        price: true,
        comment: true,
        datetime: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, lead: updated });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}
