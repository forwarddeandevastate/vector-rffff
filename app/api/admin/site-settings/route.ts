import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SINGLETON_ID = 1;

export async function GET() {
  const row =
    (await prisma.siteSettings.findUnique({ where: { id: SINGLETON_ID } })) ??
    (await prisma.siteSettings.create({
      data: { id: SINGLETON_ID }, // создаст с дефолтами из схемы
    }));

  return NextResponse.json({ ok: true, settings: row });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    // Разрешаем обновлять только известные поля (безопаснее)
    const data = {
      brandName: body.brandName,
      brandTagline: body.brandTagline,
      phone: body.phone,
      whatsapp: body.whatsapp,
      telegram: body.telegram,
      email: body.email,
      workHours: body.workHours,
      regionNote: body.regionNote,
      companyName: body.companyName,
      inn: body.inn,
      ogrn: body.ogrn,
      address: body.address,
      notes: body.notes,
    };

    const updated = await prisma.siteSettings.upsert({
await writeAudit({
  actorId,
  actorEmail,
  action: "settings.update",
  entity: "SiteSettings",
  entityId: 1,
  details: { data },
});

      where: { id: SINGLETON_ID },
      create: { id: SINGLETON_ID, ...data },
      update: data,
    });

    return NextResponse.json({ ok: true, settings: updated });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status: 500 });
  }
}
