"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Package,
} from "lucide-react";

interface HeaderSettings {
  logo_text?: string;
  logo_url?: string;
  phone?: string;
  email?: string;
}

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settings, setSettings] = useState<HeaderSettings>({});
  const [scrolled, setScrolled] = useState(false);

  const isRTL = locale === "ar";
  const otherLocale = locale === "en" ? "ar" : "en";

  useEffect(() => {
    fetch("/api/settings?keys=logo_text,logo_url,phone,email")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("nav.home") },
    { href: `/${locale}/about`, label: t("nav.about") },
    { href: `/${locale}/contact`, label: t("nav.contact") },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md"
          : "bg-white dark:bg-gray-900"
      } border-b border-gray-100 dark:border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 font-bold text-xl"
          >
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-8 w-auto" />
            ) : (
              <span
                className="text-2xl font-extrabold"
                style={{ color: "#0FADAD" }}
              >
                {settings.logo_text || "Nourkart"}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#0FADAD] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <Link
              href={`/${otherLocale}`}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-700 hover:border-[#0FADAD] hover:text-[#0FADAD] transition-colors"
            >
              {otherLocale === "ar" ? "عربي" : "EN"}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-gray-600" />
              )}
            </button>

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart size={20} className="text-gray-700 dark:text-gray-300" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs font-bold text-white rounded-full flex items-center justify-center px-1"
                  style={{ backgroundColor: "#0FADAD" }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: "#0FADAD" }}
                  >
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    {(session.user as any)?.role === "admin" && (
                      <Link
                        href={`/${locale}/dashboard`}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={14} />
                        {t("nav.dashboard")}
                      </Link>
                    )}
                    <Link
                      href={`/${locale}/orders`}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Package size={14} />
                      {t("nav.myOrders")}
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: `/${locale}` });
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <LogOut size={14} />
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href={`/${locale}/login`}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#0FADAD] transition-colors"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className="text-sm font-medium text-white px-4 py-2 rounded-full transition-all hover:opacity-90"
                  style={{ backgroundColor: "#0FADAD" }}
                >
                  {t("nav.signup")}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#0FADAD]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 px-4 pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
              <Link
                href={`/${otherLocale}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#0FADAD] hover:text-[#0FADAD] transition-colors"
              >
                {otherLocale === "ar" ? "عربي" : "EN"}
              </Link>
              {!session && (
                <Link
                  href={`/${locale}/login`}
                  className="text-sm font-medium text-gray-600 hover:text-[#0FADAD]"
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
