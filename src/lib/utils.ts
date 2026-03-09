import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, locale: string = "en") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
  }).format(price);
}

export function getSocialIcon(name: string): string {
  const icons: Record<string, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    twitter: "Twitter",
    x: "Twitter",
    tiktok: "Music2",
    youtube: "Youtube",
    whatsapp: "MessageCircle",
    linkedin: "Linkedin",
    pinterest: "Pin",
    snapchat: "Ghost",
    telegram: "Send",
    email: "Mail",
  };
  return icons[name.toLowerCase()] || "Globe";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
