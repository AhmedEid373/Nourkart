"use client";

import { useEffect, useState } from "react";
import { Save, FileText } from "lucide-react";

const PAGES = [
  {
    key: "home_hero",
    labelEn: "Home Hero Section",
    descEn: "The big banner at the top of the home page",
  },
  {
    key: "about",
    labelEn: "About Page",
    descEn: "Content for the about page",
  },
  {
    key: "home_features",
    labelEn: "Home Features Section",
    descEn: "Features/benefits section on the home page",
  },
];

interface PageContent {
  page: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
}

export default function ContentDashboard() {
  const [contents, setContents] = useState<Record<string, PageContent>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/page-content")
      .then((r) => r.json())
      .then((data: PageContent[]) => {
        const map: Record<string, PageContent> = {};
        if (Array.isArray(data)) {
          data.forEach((item) => (map[item.page] = item));
        }
        setContents(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getContent = (page: string): PageContent => {
    return (
      contents[page] || {
        page,
        titleEn: "",
        titleAr: "",
        contentEn: "",
        contentAr: "",
      }
    );
  };

  const update = (page: string, field: string, value: string) => {
    setContents((prev) => ({
      ...prev,
      [page]: { ...getContent(page), [field]: value },
    }));
  };

  const handleSave = async (page: string) => {
    setSaving(page);
    await fetch("/api/page-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getContent(page)),
    });
    setSaving(null);
    setSaved(page);
    setTimeout(() => setSaved(null), 2000);
  };

  if (loading) {
    return <div className="p-6 lg:p-8 text-gray-400">Loading content...</div>;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Page Content
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Edit content for each page in both Arabic and English
        </p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {PAGES.map((pageInfo) => {
          const content = getContent(pageInfo.key);
          return (
            <div
              key={pageInfo.key}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#e6f9f9" }}
                  >
                    <FileText size={16} style={{ color: "#0FADAD" }} />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-sm">
                      {pageInfo.labelEn}
                    </h2>
                    <p className="text-xs text-gray-400">{pageInfo.descEn}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSave(pageInfo.key)}
                  disabled={saving === pageInfo.key}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-semibold hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: "#0FADAD" }}
                >
                  <Save size={12} />
                  {saving === pageInfo.key
                    ? "Saving..."
                    : saved === pageInfo.key
                    ? "Saved! ✓"
                    : "Save"}
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Title (English)
                    </label>
                    <input
                      type="text"
                      value={content.titleEn}
                      onChange={(e) => update(pageInfo.key, "titleEn", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      العنوان (عربي)
                    </label>
                    <input
                      type="text"
                      value={content.titleAr}
                      onChange={(e) => update(pageInfo.key, "titleAr", e.target.value)}
                      dir="rtl"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Content (English)
                    </label>
                    <textarea
                      rows={4}
                      value={content.contentEn}
                      onChange={(e) => update(pageInfo.key, "contentEn", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      المحتوى (عربي)
                    </label>
                    <textarea
                      rows={4}
                      value={content.contentAr}
                      onChange={(e) => update(pageInfo.key, "contentAr", e.target.value)}
                      dir="rtl"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
