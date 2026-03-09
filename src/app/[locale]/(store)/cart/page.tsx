"use client";

import { useTranslations, useLocale } from "next-intl";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function CartPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const isRTL = locale === "ar";
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoSuccess("");

    try {
      const res = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.toUpperCase(), orderTotal: subtotal }),
      });
      const data = await res.json();

      if (data.valid) {
        setPromoDiscount(data.discount);
        setPromoSuccess(t("cart.promoApplied"));
        setAppliedCode(promoCode.toUpperCase());
      } else {
        setPromoError(data.error || t("cart.invalidPromo"));
      }
    } catch {
      setPromoError(t("cart.invalidPromo"));
    } finally {
      setPromoLoading(false);
    }
  };

  const total = Math.max(0, subtotal - promoDiscount);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("cart.empty")}
        </h2>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#0FADAD" }}
        >
          <ShoppingBag size={18} />
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        {t("cart.title")} ({items.length})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const name = isRTL ? item.nameAr : item.nameEn;
            const price = item.discountPrice || item.price;
            return (
              <div
                key={item.id}
                className="flex gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700"
              >
                <Link
                  href={`/${locale}/products/${item.id}`}
                  className="flex-shrink-0"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${locale}/products/${item.id}`}
                    className="font-semibold text-sm text-gray-800 dark:text-gray-100 hover:text-[#0FADAD] line-clamp-2"
                  >
                    {name}
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      {item.discountPrice ? (
                        <>
                          <span className="font-bold text-red-500">
                            {formatPrice(item.discountPrice, locale)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(item.price, locale)}
                          </span>
                        </>
                      ) : (
                        <span
                          className="font-bold"
                          style={{ color: "#0FADAD" }}
                        >
                          {formatPrice(item.price, locale)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600 hover:border-[#0FADAD] hover:text-[#0FADAD] transition-colors text-xs"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600 hover:border-[#0FADAD] hover:text-[#0FADAD] transition-colors text-xs disabled:opacity-40"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {isRTL ? "المجموع:" : "Total:"}{" "}
                    <span className="font-bold">
                      {formatPrice(price * item.quantity, locale)}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-6">
              {isRTL ? "ملخص الطلب" : "Order Summary"}
            </h2>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <Tag size={14} className="inline mr-1" />
                {t("cart.promoCode")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder={isRTL ? "أدخل الكود" : "Enter code"}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
                  disabled={!!appliedCode}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoLoading || !!appliedCode}
                  className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                  style={{ backgroundColor: "#0FADAD" }}
                >
                  {promoLoading ? "..." : t("cart.applyPromo")}
                </button>
              </div>
              {promoError && (
                <p className="mt-1 text-xs text-red-500">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="mt-1 text-xs text-green-600">{promoSuccess}</p>
              )}
            </div>

            {/* Price Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("cart.subtotal")}</span>
                <span className="font-medium">
                  {formatPrice(subtotal, locale)}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">
                    {t("cart.discount")} ({appliedCode})
                  </span>
                  <span className="font-medium text-green-600">
                    -{formatPrice(promoDiscount, locale)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100 dark:border-gray-700">
                <span>{t("cart.total")}</span>
                <span style={{ color: "#0FADAD" }}>
                  {formatPrice(total, locale)}
                </span>
              </div>
            </div>

            <Link
              href={{
                pathname: `/${locale}/checkout`,
                query: appliedCode
                  ? { promo: appliedCode, discount: promoDiscount }
                  : {},
              }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#0FADAD]/30"
              style={{ backgroundColor: "#0FADAD" }}
            >
              <ShoppingBag size={18} />
              {t("cart.checkout")}
            </Link>

            <Link
              href={`/${locale}`}
              className="w-full flex items-center justify-center mt-3 py-3 text-sm font-medium text-gray-500 hover:text-[#0FADAD] transition-colors"
            >
              ← {t("cart.continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
