"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  Linkedin,
  Mail,
  Globe,
  Music2,
  Send,
  Phone,
  MapPin,
} from "lucide-react";

interface SocialMedia {
  id: string;
  name: string;
  url: string;
}

interface FooterSettings {
  footer_text?: string;
  footer_address?: string;
  footer_phone?: string;
  footer_email?: string;
}

const socialIconMap: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
  whatsapp: MessageCircle,
  linkedin: Linkedin,
  email: Mail,
  tiktok: Music2,
  telegram: Send,
  globe: Globe,
};

function SocialIcon({ name }: { name: string }) {
  const IconComponent = socialIconMap[name.toLowerCase()] || Globe;
  return <IconComponent size={18} />;
}

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [settings, setSettings] = useState<FooterSettings>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/social-media").then((r) => r.json()),
      fetch(
        "/api/settings?keys=footer_text,footer_address,footer_phone,footer_email"
      ).then((r) => r.json()),
    ])
      .then(([socialsData, settingsData]) => {
        setSocials(socialsData);
        setSettings(settingsData);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-gray-900 dark:bg-black text-white pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3
              className="text-2xl font-extrabold mb-3"
              style={{ color: "#0FADAD" }}
            >
              Nourkart
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {settings.footer_text ||
                "Transform your walls with unique decor pieces that reflect your personality and style."}
            </p>

            {/* Contact info */}
            <div className="mt-4 space-y-2">
              {settings.footer_phone && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Phone size={14} style={{ color: "#0FADAD" }} />
                  <span>{settings.footer_phone}</span>
                </div>
              )}
              {settings.footer_email && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail size={14} style={{ color: "#0FADAD" }} />
                  <span>{settings.footer_email}</span>
                </div>
              )}
              {settings.footer_address && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin size={14} style={{ color: "#0FADAD" }} />
                  <span>{settings.footer_address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2">
              {[
                { href: `/${locale}`, label: t("nav.home") },
                { href: `/${locale}/about`, label: t("nav.about") },
                { href: `/${locale}/contact`, label: t("nav.contact") },
                { href: `/${locale}/cart`, label: t("nav.cart") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#0FADAD] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              {t("footer.followUs")}
            </h4>
            {socials.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-800 hover:bg-[#0FADAD] transition-colors text-gray-300 hover:text-white"
                    title={social.name}
                  >
                    <SocialIcon name={social.name} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No social links yet</p>
            )}
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Nourkart. {t("footer.rights")}.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <span style={{ color: "#0FADAD" }}>♥</span>
            <span>in Egypt</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
