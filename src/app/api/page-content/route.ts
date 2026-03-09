import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  if (page) {
    const content = await prisma.pageContent.findUnique({ where: { page } });
    return NextResponse.json(content);
  }

  const contents = await prisma.pageContent.findMany();
  return NextResponse.json(contents);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const content = await prisma.pageContent.upsert({
    where: { page: data.page },
    update: data,
    create: data,
  });
  return NextResponse.json(content);
}
