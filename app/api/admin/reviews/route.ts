import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";

export async function GET() {
  await requireAdmin();

  const rows = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      name: true,
      rating: true,
      text: true,
      city: true,
      isPublic: true,
      createdAt: true,
      source: true,
    },
  });

  return NextResponse.json({ ok: true, reviews: rows });
}
