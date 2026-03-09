import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, orderTotal } = await req.json();

  const promo = await prisma.promoCode.findUnique({ where: { code } });

  if (!promo || !promo.active) {
    return NextResponse.json({ valid: false, error: "Invalid promo code" });
  }

  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, error: "Promo code expired" });
  }

  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    return NextResponse.json({ valid: false, error: "Promo code limit reached" });
  }

  if (orderTotal < promo.minOrder) {
    return NextResponse.json({
      valid: false,
      error: `Minimum order is ${promo.minOrder} EGP`,
    });
  }

  let discountAmount = 0;
  if (promo.discountType === "percentage") {
    discountAmount = (orderTotal * promo.discount) / 100;
  } else {
    discountAmount = promo.discount;
  }

  return NextResponse.json({
    valid: true,
    discount: discountAmount,
    discountType: promo.discountType,
    discountValue: promo.discount,
  });
}
