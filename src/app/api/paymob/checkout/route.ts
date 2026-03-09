import { NextRequest, NextResponse } from "next/server";
import {
  getPaymobAuthToken,
  createPaymobOrder,
  getPaymentKey,
  getPaymobIframeUrl,
} from "@/lib/paymob";

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, items, billingData } = await req.json();

    const authToken = await getPaymobAuthToken();
    const paymobOrderId = await createPaymobOrder(
      authToken,
      Math.round(amount * 100),
      items.map((item: any) => ({
        name: item.name,
        amount_cents: Math.round(item.price * 100),
        quantity: item.quantity,
      }))
    );

    const paymentToken = await getPaymentKey(
      authToken,
      paymobOrderId,
      Math.round(amount * 100),
      billingData
    );

    const iframeUrl = getPaymobIframeUrl(paymentToken);

    return NextResponse.json({ iframeUrl, paymobOrderId });
  } catch (error: any) {
    console.error("Paymob error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
