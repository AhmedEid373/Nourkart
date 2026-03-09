const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY!;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID!;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID!;
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET!;

export async function getPaymobAuthToken(): Promise<string> {
  const res = await fetch("https://accept.paymob.com/api/auth/tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  });
  const data = await res.json();
  return data.token;
}

export async function createPaymobOrder(
  authToken: string,
  amountCents: number,
  items: Array<{ name: string; amount_cents: number; quantity: number }>
): Promise<string> {
  const res = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: "EGP",
      items,
    }),
  });
  const data = await res.json();
  return data.id;
}

export async function getPaymentKey(
  authToken: string,
  orderId: string,
  amountCents: number,
  billingData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  }
): Promise<string> {
  const res = await fetch(
    "https://accept.paymob.com/api/acceptance/payment_keys",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          ...billingData,
          apartment: "NA",
          floor: "NA",
          street: "NA",
          building: "NA",
          shipping_method: "NA",
          postal_code: "NA",
          city: "Cairo",
          country: "EG",
          state: "Cairo",
        },
        currency: "EGP",
        integration_id: parseInt(PAYMOB_INTEGRATION_ID),
        lock_order_when_paid: true,
      }),
    }
  );
  const data = await res.json();
  return data.token;
}

export function getPaymobIframeUrl(paymentToken: string): string {
  return `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;
}

export function verifyPaymobHmac(
  data: Record<string, string>,
  hmac: string
): boolean {
  const crypto = require("crypto");
  const concatenatedString = [
    data.amount_cents,
    data.created_at,
    data.currency,
    data.error_occured,
    data.has_parent_transaction,
    data.id,
    data.integration_id,
    data.is_3d_secure,
    data.is_auth,
    data.is_capture,
    data.is_refunded,
    data.is_standalone_payment,
    data.is_voided,
    data.order,
    data.owner,
    data.pending,
    data.source_data_pan,
    data.source_data_sub_type,
    data.source_data_type,
    data.success,
  ].join("");

  const hash = crypto
    .createHmac("sha512", PAYMOB_HMAC_SECRET)
    .update(concatenatedString)
    .digest("hex");

  return hash === hmac;
}
