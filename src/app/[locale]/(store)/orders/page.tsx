"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: Array<{
    quantity: number;
    price: number;
    product: { nameEn: string; nameAr: string };
  }>;
}

const STATUS_ICONS: Record<string, any> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
};

export default function OrdersPage() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
      return;
    }
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#0FADAD", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isRTL ? "طلباتي" : "My Orders"}
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">
            {isRTL ? "لا توجد طلبات بعد" : "No orders yet"}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold hover:opacity-90"
            style={{ backgroundColor: "#0FADAD" }}
          >
            {isRTL ? "تسوق الآن" : "Start Shopping"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = STATUS_ICONS[order.status] || Clock;
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-mono text-sm text-gray-400">
                      #{order.id.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus === "paid"
                        ? isRTL
                          ? "مدفوع"
                          : "Paid"
                        : isRTL
                        ? "في انتظار الدفع"
                        : "Pending Payment"}
                    </span>
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      <StatusIcon size={12} />
                      {order.status}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 mb-4">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-gray-600 dark:text-gray-300">
                      {isRTL ? item.product.nameAr : item.product.nameEn} ×
                      {item.quantity}
                    </p>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500">
                    {isRTL ? "الإجمالي:" : "Total:"}
                  </span>
                  <span className="font-bold" style={{ color: "#0FADAD" }}>
                    {formatPrice(order.total, locale)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
