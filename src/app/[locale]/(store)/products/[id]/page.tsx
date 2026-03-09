"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Check, ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  discountPrice?: number | null;
  images: string;
  stock: number;
  category?: { id: string; nameEn: string; nameAr: string } | null;
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const { addItem } = useCart();
  const isRTL = locale === "ar";

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/products/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        });
    });
  }, [params]);

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

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Product not found</p>
        <Link
          href={`/${locale}`}
          className="mt-4 inline-block text-[#0FADAD] hover:underline"
        >
          {isRTL ? "العودة للمتجر" : "Back to Store"}
        </Link>
      </div>
    );
  }

  const name = isRTL ? product.nameAr : product.nameEn;
  const description = isRTL ? product.descriptionAr : product.descriptionEn;
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
  if (images.length === 0)
    images = [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop",
    ];

  const discountPercent =
    product.discountPrice && product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        price: product.price,
        discountPrice: product.discountPrice || undefined,
        image: images[0],
        stock: product.stock,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href={`/${locale}`} className="hover:text-[#0FADAD]">
          {t("nav.home")}
        </Link>
        <span>/</span>
        {categoryName && (
          <>
            <Link
              href={`/${locale}?category=${product.category?.id}`}
              className="hover:text-[#0FADAD]"
            >
              {categoryName}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-800 dark:text-gray-200">{name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4 shadow-lg">
            <Image
              src={images[selectedImage]}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {discountPercent && (
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discountPercent}%
                </span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-[#0FADAD] shadow-md"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {categoryName && (
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#0FADAD" }}
            >
              {categoryName}
            </p>
          )}
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
            {name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-extrabold text-red-500">
                  {formatPrice(product.discountPrice, locale)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.price, locale)}
                </span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-lg">
                  -{discountPercent}%
                </span>
              </>
            ) : (
              <span
                className="text-3xl font-extrabold"
                style={{ color: "#0FADAD" }}
              >
                {formatPrice(product.price, locale)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  {t("product.inStock")}{" "}
                  {product.stock <= 10 && `(${product.stock} ${isRTL ? "متبقي" : "left"})`}
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm text-red-500 font-medium">
                  {t("product.outOfStock")}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {t("product.description")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {t("product.quantity")}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:border-[#0FADAD] hover:text-[#0FADAD] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="w-9 h-9 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:border-[#0FADAD] hover:text-[#0FADAD] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold transition-all ${
                product.stock === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "hover:opacity-90 active:scale-95 shadow-lg shadow-[#0FADAD]/30"
              }`}
              style={
                product.stock > 0 ? { backgroundColor: "#0FADAD" } : {}
              }
            >
              {added ? (
                <>
                  <Check size={18} />
                  {isRTL ? "تمت الإضافة!" : "Added!"}
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  {product.stock === 0
                    ? t("home.outOfStock")
                    : t("product.addToCart")}
                </>
              )}
            </button>
            <Link
              href={`/${locale}/cart`}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold border-2 transition-all hover:bg-[#0FADAD] hover:text-white hover:border-[#0FADAD]"
              style={{ borderColor: "#0FADAD", color: "#0FADAD" }}
            >
              {isRTL ? "عرض السلة" : "View Cart"}
              {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
