import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keys = searchParams.get("keys")?.split(",") || [];

  if (keys.length > 0) {
    const settings = await prisma.siteSettings.findMany({
      where: { key: { in: keys } },
    });
    const result: Record<string, string> = {};
    settings.forEach((s) => (result[s.key] = s.value));
    return NextResponse.json(result);
  }

  const settings = await prisma.siteSettings.findMany();
  const result: Record<string, string> = {};
  settings.forEach((s) => (result[s.key] = s.value));
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates: Record<string, string> = await req.json();

  const promises = Object.entries(updates).map(([key, value]) =>
    prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  );

  await Promise.all(promises);
  return NextResponse.json({ success: true });
}
