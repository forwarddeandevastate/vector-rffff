import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrThrow } from "@/lib/admin-api";

export async function GET() {
  try {
    await requireAdminOrThrow();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 6 * 86_400_000);

    // Все агрегации — один запрос к БД через groupBy + count
    const [byStatus, todayCount, weekCount, recent] = await Promise.all([
      prisma.lead.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.lead.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true, name: true, phone: true,
          fromText: true, toText: true,
          status: true, createdAt: true, carClass: true,
        },
      }),
    ]);

    const byStatusMap: Record<string, number> = {};
    for (const row of byStatus) {
      byStatusMap[row.status] = row._count.id;
    }

    const total = Object.values(byStatusMap).reduce((a, b) => a + b, 0);

    return NextResponse.json({
      ok: true,
      stats: {
        total,
        new: byStatusMap["new"] ?? 0,
        in_progress: byStatusMap["in_progress"] ?? 0,
        done: byStatusMap["done"] ?? 0,
        canceled: byStatusMap["canceled"] ?? 0,
        today: todayCount,
        week: weekCount,
      },
      recent,
    });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}
