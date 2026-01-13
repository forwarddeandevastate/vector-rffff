import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status") || "all";
    const q = (searchParams.get("q") || "").trim();

    const unassigned = searchParams.get("unassigned") === "1";
    const duplicates = searchParams.get("duplicates") === "1";

    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(200, Math.max(10, Number(searchParams.get("pageSize") || "50")));
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (status !== "all") where.status = status;
    if (unassigned) where.assignedToId = null;
    if (duplicates) where.isDuplicate = true;

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
      ];
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          createdAt: true,
          name: true,
          phone: true,
          fromText: true,
          toText: true,
          carClass: true,
          roundTrip: true,
          price: true,
          status: true,
          isDuplicate: true,
          duplicateOfId: true,
          assignedToId: true,
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      meta: {
        page,
        pageSize,
        total,
        pages: Math.max(1, Math.ceil(total / pageSize)),
      },
      leads,
    });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}
