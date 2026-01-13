import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.setting.findMany({
    orderBy: { key: "asc" },
    select: { key: true, value: true },
  });
  return NextResponse.json({ ok: true, settings: rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const key = body?.key?.toString();
    const value = body?.value?.toString();

    if (!key) return NextResponse.json({ ok: false, error: "key required" }, { status: 400 });

    await prisma.setting.upsert({
      where: { key },
      create: { key, value: value ?? "" },
      update: { value: value ?? "" },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}
