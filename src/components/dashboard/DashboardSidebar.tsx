"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  FileText,
  Share2,
  LogOut,
  Menu,
  X,
  ChevronRight,
  FolderOpen,
  Globe,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelEn: "Overview", labelAr: "نظرة عامة", exact: true },
  { href: "/dashboard/products", icon: Package, labelEn: "Products", labelAr: "المنتجات" },
  { href: "/dashboard/categories", icon: FolderOpen, labelEn: "Categories", labelAr: "الفئات" },
  { href: "/dashboard/orders", icon: ShoppingCart, labelEn: "Orders", labelAr: "الطلبات" },
  { href: "/dashboard/users", icon: Users, labelEn: "Users", labelAr: "المستخدمون" },
  { href: "/dashboard/promo-codes", icon: Tag, labelEn: "Promo Codes", labelAr: "أكواد الخصم" },
  { href: "/dashboard/content", icon: FileText, labelEn: "Page Content", labelAr: "محتوى الصفحات" },
  { href: "/dashboard/social", icon: Share2, labelEn: "Social Media", labelAr: "التواصل الاجتماعي" },
  { href: "/dashboard/settings", icon: Settings, labelEn: "Settings", labelAr: "الإعدادات" },
];

export function DashboardSidebar() {
  const locale = useLocale();
  const pathname = usePathname();
  const isRTL = locale === "ar";
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    const fullHref = `/${locale}${href}`;
    if (exact) return pathname === fullHref;
    return pathname.startsWith(fullHref);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <Globe size={20} style={{ color: "#0FADAD" }} />
          <span className="font-extrabold text-lg" style={{ color: "#0FADAD" }}>
            Nourkart
          </span>
        </Link>
        <p className="text-xs text-gray-500 mt-1">
          {isRTL ? "لوحة تحكم المدير" : "Admin Dashboard"}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const label = isRTL ? item.labelAr : item.labelEn;
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
              style={active ? { backgroundColor: "#0FADAD" } : {}}
            >
              <item.icon size={18} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 mb-1"
        >
          <Globe size={18} />
          {isRTL ? "عرض المتجر" : "View Store"}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={18} />
          {isRTL ? "تسجيل الخروج" : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
