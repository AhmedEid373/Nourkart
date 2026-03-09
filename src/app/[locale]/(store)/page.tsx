import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/store/ProductCard";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { HomeHero } from "@/components/store/HomeHero";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { locale } = await params;
  const { category, search } = await searchParams;
  const t = await getTranslations();

  const where: any = { active: true };
  if (category) where.categoryId = category;
  if (search) {
    where.OR = [
      { nameEn: { contains: search } },
      { nameAr: { contains: search } },
    ];
  }

  const [products, categories, featuredProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
    !search && !category
      ? prisma.product.findMany({
          where: { active: true, featured: true },
          include: { category: true },
          take: 4,
        })
      : Promise.resolve([]),
  ]);

  const isRTL = locale === "ar";

  return (
    <div>
      {/* Hero Section */}
      {!search && !category && <HomeHero locale={locale} />}

      {/* Featured Products */}
      {!search && !category && featuredProducts.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("home.featured")}
              </h2>
              <Link
                href={`/${locale}?scroll=products`}
                className="text-sm font-medium hover:underline"
                style={{ color: "#0FADAD" }}
              >
                {t("common.viewAll")} →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      <section id="products" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header + Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {search
                ? `${t("common.search")}: "${search}"`
                : t("home.allProducts")}
            </h2>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/${locale}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !category
                    ? "text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                style={!category ? { backgroundColor: "#0FADAD" } : {}}
              >
                {t("common.viewAll")}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}?category=${cat.id}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat.id
                      ? "text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  style={category === cat.id ? { backgroundColor: "#0FADAD" } : {}}
                >
                  {isRTL ? cat.nameAr : cat.nameEn}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <form method="get" className="mb-8">
            <div className="relative max-w-md">
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder={isRTL ? "ابحث عن منتج..." : "Search products..."}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0FADAD]"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg text-gray-500">{t("home.noProducts")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
