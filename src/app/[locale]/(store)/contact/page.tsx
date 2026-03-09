"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          {t("contact.title")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isRTL
            ? "نحن هنا للمساعدة. تواصل معنا في أي وقت"
            : "We're here to help. Reach out to us anytime"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div>
          <div className="space-y-6 mb-8">
            {[
              {
                icon: Phone,
                labelEn: "Phone",
                labelAr: "الهاتف",
                value: "+20 100 000 0000",
              },
              {
                icon: Mail,
                labelEn: "Email",
                labelAr: "البريد الإلكتروني",
                value: "info@nourkart.com",
              },
              {
                icon: MapPin,
                labelEn: "Address",
                labelAr: "العنوان",
                value: isRTL ? "القاهرة، مصر" : "Cairo, Egypt",
              },
              {
                icon: Clock,
                labelEn: "Working Hours",
                labelAr: "ساعات العمل",
                value: isRTL ? "السبت - الخميس، ٩ص - ٦م" : "Sat - Thu, 9am - 6pm",
              },
            ].map((item) => (
              <div key={item.labelEn} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#e6f9f9" }}
                >
                  <item.icon size={18} style={{ color: "#0FADAD" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    {isRTL ? item.labelAr : item.labelEn}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl overflow-hidden h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MapPin size={32} className="mx-auto mb-2" />
              <p className="text-sm">
                {isRTL ? "الخريطة قادمة قريباً" : "Map coming soon"}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          {status === "sent" ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("contact.success")}
              </h3>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 text-sm font-medium hover:underline"
                style={{ color: "#0FADAD" }}
              >
                {isRTL ? "إرسال رسالة أخرى" : "Send another message"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("contact.name")}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("contact.email")}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("contact.message")}
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD] text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: "#0FADAD" }}
              >
                <Send size={16} />
                {status === "sending"
                  ? isRTL
                    ? "جاري الإرسال..."
                    : "Sending..."
                  : t("contact.send")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
