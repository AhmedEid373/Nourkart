import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock } from "lucide-react";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    redirect(`/${locale}/login`);
  }

  const [totalProducts, totalOrders, totalUsers, revenue, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "user" } }),
      prisma.order.aggregate({
        where: { paymentStatus: "paid" },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { nameEn: true } } } },
        },
      }),
    ]);

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "#0FADAD",
      bg: "#e6f9f9",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "#6366f1",
      bg: "#ede9fe",
    },
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "#f59e0b",
      bg: "#fef3c7",
    },
    {
      label: "Total Revenue",
      value: `${(revenue._sum.total || 0).toFixed(0)} EGP`,
      icon: DollarSign,
      color: "#10b981",
      bg: "#d1fae5",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening at Nourkart.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.bg }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <Clock size={18} className="text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="px-5 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">
                  Order
                </th>
                <th className="px-5 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">
                  Customer
                </th>
                <th className="px-5 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">
                  Items
                </th>
                <th className="px-5 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">
                  Total
                </th>
                <th className="px-5 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider text-xs">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-gray-400"
                  >
                    No orders yet
                  </td>
                </tr>
              )}
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">
                    #{order.id.slice(-8)}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {order.user?.name || order.guestName || "Guest"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.user?.email || order.guestEmail}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                    {order.items.length} items
                  </td>
                  <td className="px-5 py-3 font-bold" style={{ color: "#0FADAD" }}>
                    {order.total.toFixed(0)} EGP
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus === "paid" ? "Paid" : order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
