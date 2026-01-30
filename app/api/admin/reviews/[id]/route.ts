import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const reviewId = Number(id);

  if (!Number.isFinite(reviewId)) {
    return NextResponse.json({ ok: false, error: "bad id" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));

  const data: any = {};
  if (typeof body.isPublic === "boolean") data.isPublic = body.isPublic;

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data,
    select: { id: true, isPublic: true },
  });

  return NextResponse.json({ ok: true, review: updated });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const reviewId = Number(id);

  if (!Number.isFinite(reviewId)) {
    return NextResponse.json({ ok: false, error: "bad id" }, { status: 400 });
  }

  await prisma.review.delete({ where: { id: reviewId } });

  return NextResponse.json({ ok: true });
}
