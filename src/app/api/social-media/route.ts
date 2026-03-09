import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const socials = await prisma.socialMedia.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(socials);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const social = await prisma.socialMedia.create({ data });
  return NextResponse.json(social, { status: 201 });
}
