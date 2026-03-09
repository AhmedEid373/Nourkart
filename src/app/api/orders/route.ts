import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = (session.user as any).role === "admin";
  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId },
    include: {
      items: { include: { product: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const data = await req.json();

    const order = await prisma.order.create({
      data: {
        userId: session ? (session.user as any).id : null,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        subtotal: data.subtotal,
        discount: data.discount || 0,
        total: data.total,
        promoCode: data.promoCode,
        address: data.address,
        city: data.city,
        country: data.country || "Egypt",
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    // Update promo code usage
    if (data.promoCode) {
      await prisma.promoCode
        .update({
          where: { code: data.promoCode },
          data: { usedCount: { increment: 1 } },
        })
        .catch(() => {});
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
