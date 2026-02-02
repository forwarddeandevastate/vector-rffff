import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";
import { writeAudit } from "@/lib/audit";

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
    });

    return NextResponse.json({ ok: true, settings });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const admin = auth.payload;
    const actorId = Number(admin.sub);
    const actorEmail = admin.email;

    const body = await req.json().catch(() => ({}));

    // Разрешенные поля SiteSettings
    const data: any = {};
    const allow = [
      "brandName",
      "brandTagline",
      "phone",
      "whatsapp",
      "telegram",
      "email",
      "workHours",
      "regionNote",
      "companyName",
      "inn",
      "ogrn",
      "address",
      "notes",
    ] as const;

    for (const k of allow) {
      if (k in body) data[k] = body[k] ?? null;
    }

    const updated = await prisma.siteSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });

    await writeAudit({
      actorId: Number.isFinite(actorId) ? actorId : null,
      actorEmail,
      action: "settings.update",
      entity: "SiteSettings",
      entityId: 1,
      details: { changed: data },
    });

    return NextResponse.json({ ok: true, settings: updated });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}
