import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalProducts, totalOrders, totalUsers, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "user" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { nameEn: true } } } },
      },
    }),
  ]);

  const revenue = await prisma.order.aggregate({
    where: { paymentStatus: "paid" },
    _sum: { total: true },
  });

  return NextResponse.json({
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: revenue._sum.total || 0,
    recentOrders,
  });
}
