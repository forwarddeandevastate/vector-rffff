import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";
import { writeAudit } from "@/lib/audit";

type RequireAdminResult =
  | { ok: true; payload: { sub: string | number; email: string } }
  | { ok: false; error: string };

async function getAdminOrThrow() {
  const res = (await requireAdmin()) as RequireAdminResult;

  // Если requireAdmin у тебя кидает — этот код тоже ок (просто не дойдёт сюда)
  if (!res || (typeof res === "object" && "ok" in res)) {
    if (!res.ok) throw new Error("UNAUTHORIZED");
    return res.payload;
  }

  // На случай если requireAdmin возвращает payload напрямую (старое поведение)
  return res as any;
}

export async function GET() {
  try {
    await getAdminOrThrow();

    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
    });

    return NextResponse.json({ ok: true, settings });
  } catch (e: any) {
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminOrThrow();
    const actorId = Number(admin.sub);
    const actorEmail = admin.email;

    const body = await req.json().catch(() => ({}));

    // Разрешенные поля SiteSettings (под твою prisma/schema.prisma)
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
    const status = e?.message === "UNAUTHORIZED" ? 401 : 500;
    return NextResponse.json({ ok: false, error: e?.message || "server error" }, { status });
  }
}
