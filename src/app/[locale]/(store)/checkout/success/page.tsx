"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ backgroundColor: "#e6f9f9" }}
      >
        <CheckCircle size={40} style={{ color: "#0FADAD" }} />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
        {isRTL ? "تم الطلب بنجاح! 🎉" : "Order Placed Successfully! 🎉"}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        {isRTL
          ? "شكراً لطلبك! سيتم التواصل معك في أقرب وقت لتأكيد الطلب والتوصيل."
          : "Thank you for your order! We will contact you soon to confirm your order and arrange delivery."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={`/${locale}`}
          className="px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#0FADAD" }}
        >
          {isRTL ? "متابعة التسوق" : "Continue Shopping"}
        </Link>
        <Link
          href={`/${locale}/orders`}
          className="px-6 py-3 rounded-full font-semibold border-2 transition-all hover:bg-[#0FADAD] hover:text-white hover:border-[#0FADAD]"
          style={{ borderColor: "#0FADAD", color: "#0FADAD" }}
        >
          {isRTL ? "طلباتي" : "My Orders"}
        </Link>
      </div>
    </div>
  );
}
