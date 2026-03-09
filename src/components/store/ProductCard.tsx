"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/providers/CartProvider";
import { ShoppingCart, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  discountPrice?: number | null;
  images: string;
  stock: number;
  category?: { nameEn: string; nameAr: string } | null;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations();
  const { addItem } = useCart();

  const isRTL = locale === "ar";
  const name = isRTL ? product.nameAr : product.nameEn;
  const categoryName = product.category
    ? isRTL
      ? product.category.nameAr
      : product.category.nameEn
    : null;

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = [product.images].filter(Boolean);
  }

  const mainImage = images[0] || "/placeholder-product.jpg";
  const discountPercent =
    product.discountPrice && product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      discountPrice: product.discountPrice || undefined,
      image: mainImage,
      stock: product.stock,
    });
  };

  return (
    <Link href={`/${locale}/products/${product.id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 card-hover">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
          <Image
            src={mainImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discountPercent && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discountPercent}% {t("home.discount")}
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {t("home.outOfStock")}
              </span>
            )}
          </div>

          {/* Add to cart button on hover */}
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
              style={{ backgroundColor: "#0FADAD" }}
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {categoryName && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">
              {categoryName}
            </p>
          )}
          <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100 line-clamp-2 mb-2">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.discountPrice ? (
                <>
                  <span className="font-bold text-red-500">
                    {formatPrice(product.discountPrice, locale)}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.price, locale)}
                  </span>
                </>
              ) : (
                <span
                  className="font-bold text-base"
                  style={{ color: "#0FADAD" }}
                >
                  {formatPrice(product.price, locale)}
                </span>
              )}
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-xs text-orange-500">
                Only {product.stock} left!
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
