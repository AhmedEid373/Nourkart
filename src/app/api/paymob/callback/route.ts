import { NextRequest, NextResponse } from "next/server";
import { verifyPaymobHmac } from "@/lib/paymob";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hmac = searchParams.get("hmac") || "";

  const data: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key !== "hmac") data[key] = value;
  });

  const isValid = verifyPaymobHmac(data, hmac);
  const success = searchParams.get("success") === "true";
  const orderId = searchParams.get("merchant_order_id");

  if (isValid && success && orderId) {
    await prisma.order
      .update({
        where: { id: orderId },
        data: {
          paymentStatus: "paid",
          status: "processing",
          paymobOrderId: searchParams.get("order"),
        },
      })
      .catch(() => {});
  }

  const locale = "en";
  const redirectUrl = success
    ? `/${locale}/checkout/success?orderId=${orderId}`
    : `/${locale}/checkout/failed`;

  return NextResponse.redirect(new URL(redirectUrl, req.url));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hmac, obj } = body;

    if (obj?.success && hmac) {
      const data = {
        amount_cents: String(obj.amount_cents),
        created_at: String(obj.created_at),
        currency: obj.currency,
        error_occured: String(obj.error_occured),
        has_parent_transaction: String(obj.has_parent_transaction),
        id: String(obj.id),
        integration_id: String(obj.integration_id),
        is_3d_secure: String(obj.is_3d_secure),
        is_auth: String(obj.is_auth),
        is_capture: String(obj.is_capture),
        is_refunded: String(obj.is_refunded),
        is_standalone_payment: String(obj.is_standalone_payment),
        is_voided: String(obj.is_voided),
        order: String(obj.order?.id),
        owner: String(obj.owner),
        pending: String(obj.pending),
        source_data_pan: String(obj.source_data?.pan || ""),
        source_data_sub_type: String(obj.source_data?.sub_type || ""),
        source_data_type: String(obj.source_data?.type || ""),
        success: String(obj.success),
      };

      verifyPaymobHmac(data, hmac);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
