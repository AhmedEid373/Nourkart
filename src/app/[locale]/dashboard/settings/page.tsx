"use client";

import { useEffect, useState } from "react";
import { Save, Settings, Globe, Phone, Mail, MapPin, CreditCard } from "lucide-react";

const SETTING_FIELDS = [
  {
    section: "Store Branding",
    icon: Globe,
    fields: [
      { key: "logo_text", label: "Store Name / Logo Text", placeholder: "Nourkart" },
      { key: "logo_url", label: "Logo Image URL (optional)", placeholder: "https://..." },
      { key: "site_tagline_en", label: "Tagline (English)", placeholder: "Your home decor destination" },
      { key: "site_tagline_ar", label: "الشعار (عربي)", placeholder: "وجهتك لديكور المنزل" },
    ],
  },
  {
    section: "Contact Information",
    icon: Phone,
    fields: [
      { key: "footer_phone", label: "Phone Number", placeholder: "+20 100 000 0000" },
      { key: "footer_email", label: "Email Address", placeholder: "info@nourkart.com" },
      { key: "footer_address", label: "Address", placeholder: "Cairo, Egypt" },
      { key: "working_hours_en", label: "Working Hours (EN)", placeholder: "Sat–Thu, 9am–6pm" },
      { key: "working_hours_ar", label: "ساعات العمل (عربي)", placeholder: "السبت–الخميس، ٩ص–٦م" },
    ],
  },
  {
    section: "Footer",
    icon: Settings,
    fields: [
      { key: "footer_text", label: "Footer Description", placeholder: "Premium wall decor for every home..." },
    ],
  },
  {
    section: "Paymob Integration",
    icon: CreditCard,
    fields: [
      { key: "paymob_api_key", label: "Paymob API Key", placeholder: "ZXZRaGVm..." },
      { key: "paymob_integration_id", label: "Integration ID", placeholder: "123456" },
      { key: "paymob_iframe_id", label: "iFrame ID", placeholder: "78910" },
      { key: "paymob_hmac_secret", label: "HMAC Secret", placeholder: "abc123..." },
    ],
  },
];

export default function SettingsDashboard() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 text-gray-400">Loading settings...</div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Site Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure your store appearance and integrations
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {SETTING_FIELDS.map((section) => (
          <div
            key={section.section}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#e6f9f9" }}
              >
                <section.icon size={16} style={{ color: "#0FADAD" }} />
              </div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                {section.section}
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.key.includes("password") || field.key.includes("secret") || field.key.includes("key") ? "password" : "text"}
                    value={settings[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
                    dir={field.key.endsWith("_ar") ? "rtl" : "ltr"}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-lg shadow-[#0FADAD]/30"
            style={{ backgroundColor: "#0FADAD" }}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">
              ✓ Settings saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
