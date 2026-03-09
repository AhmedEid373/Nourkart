"use client";

import { useEffect, useState } from "react";
import { Eye, Package } from "lucide-react";

interface Order {
  id: string;
  guestName?: string;
  guestEmail?: string;
  user?: { name: string; email: string } | null;
  total: number;
  subtotal: number;
  discount: number;
  status: string;
  paymentStatus: string;
  promoCode?: string;
  city?: string;
  createdAt: string;
  items: Array<{
    quantity: number;
    price: number;
    product: { nameEn: string };
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    const data = await fetch("/api/orders").then((r) => r.json());
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(true);
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    if (selected?.id === orderId) {
      setSelected((prev) => prev ? { ...prev, status } : null);
    }
    setUpdating(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-500 uppercase text-xs tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td>
                </tr>
              )}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    <Package size={40} className="mx-auto mb-2 opacity-30" />
                    No orders yet
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    #{order.id.slice(-8)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                      {order.user?.name || order.guestName || "Guest"}
                    </p>
                    <p className="text-xs text-gray-400">{order.user?.email || order.guestEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{order.items.length}</td>
                  <td className="px-4 py-3 font-bold text-xs" style={{ color: "#0FADAD" }}>
                    {order.total.toFixed(0)} EGP
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${PAYMENT_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updating}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0FADAD] ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(order)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="font-bold">Order #{selected.id.slice(-8)}</h2>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Customer</p>
                  <p className="font-medium">{selected.user?.name || selected.guestName || "Guest"}</p>
                  <p className="text-gray-500 text-xs">{selected.user?.email || selected.guestEmail}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Payment</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${PAYMENT_COLORS[selected.paymentStatus] || ""}`}>
                    {selected.paymentStatus}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">City</p>
                  <p className="font-medium">{selected.city || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">Promo Code</p>
                  <p className="font-medium font-mono">{selected.promoCode || "—"}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Items</p>
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-50 dark:border-gray-700/50">
                    <span>{item.product.nameEn} x{item.quantity}</span>
                    <span className="font-medium">{(item.price * item.quantity).toFixed(0)} EGP</span>
                  </div>
                ))}
              </div>

              <div className="text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{selected.subtotal.toFixed(0)} EGP</span>
                </div>
                {selected.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{selected.discount.toFixed(0)} EGP</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-100 dark:border-gray-700 mt-2">
                  <span>Total</span>
                  <span style={{ color: "#0FADAD" }}>{selected.total.toFixed(0)} EGP</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selected.status === s
                          ? "border-transparent text-white"
                          : "border-gray-200 hover:border-[#0FADAD] hover:text-[#0FADAD]"
                      }`}
                      style={selected.status === s ? { backgroundColor: "#0FADAD" } : {}}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
