"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

export function HomeHero({ locale }: { locale: string }) {
  const t = useTranslations();
  const isRTL = locale === "ar";
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch("/api/page-content?page=home_hero")
      .then((r) => r.json())
      .then((data) => {
        if (data) setContent(data);
      })
      .catch(() => {});
  }, []);

  const title = content
    ? isRTL
      ? content.titleAr
      : content.titleEn
    : t("home.hero.title");
  const subtitle = content
    ? isRTL
      ? content.contentAr
      : content.contentEn
    : t("home.hero.subtitle");

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background:
          "linear-gradient(135deg, #f0fdfd 0%, #ffffff 50%, #f0fdfd 100%)",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: "#0FADAD" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: "#0FADAD" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={isRTL ? "order-last md:order-first" : ""}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ backgroundColor: "#e6f9f9", color: "#0FADAD" }}
            >
              <Sparkles size={14} />
              <span>
                {isRTL ? "ديكور حوائط فريد" : "Unique Wall Decor"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
              {title.split(" ").map((word: string, i: number) => (
                <span key={i}>
                  {i === 1 ? (
                    <span style={{ color: "#0FADAD" }}>{word} </span>
                  ) : (
                    word + " "
                  )}
                </span>
              ))}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}#products`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#0FADAD]/30"
                style={{ backgroundColor: "#0FADAD" }}
              >
                {t("home.hero.cta")}
                {isRTL ? (
                  <ArrowLeft size={16} />
                ) : (
                  <ArrowRight size={16} />
                )}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 transition-all hover:bg-[#0FADAD] hover:text-white hover:border-[#0FADAD]"
                style={{ borderColor: "#0FADAD", color: "#0FADAD" }}
              >
                {t("home.hero.ctaSecondary")}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
              {[
                { value: "500+", label: isRTL ? "منتج" : "Products" },
                { value: "1k+", label: isRTL ? "عميل سعيد" : "Happy Customers" },
                { value: "100%", label: isRTL ? "جودة مضمونة" : "Quality Guaranteed" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-2xl font-extrabold"
                    style={{ color: "#0FADAD" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image Grid */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=400&h=300&fit=crop",
              "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=400&h=400&fit=crop",
            ].map((src, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden ${
                  i === 0 || i === 3 ? "row-span-1" : ""
                } ${i === 1 ? "-mt-4" : ""} ${i === 2 ? "mt-4" : ""}`}
              >
                <img
                  src={src}
                  alt="Wall decor"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  style={{ minHeight: i % 2 === 0 ? "220px" : "180px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
