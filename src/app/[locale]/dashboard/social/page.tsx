"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Facebook, Instagram, Twitter, Youtube, MessageCircle, Linkedin, Mail, Globe, Music2, Send } from "lucide-react";

interface SocialMedia {
  id: string;
  name: string;
  url: string;
  active: boolean;
  order: number;
}

const SOCIAL_PLATFORMS = [
  { name: "facebook", icon: Facebook, label: "Facebook" },
  { name: "instagram", icon: Instagram, label: "Instagram" },
  { name: "twitter", icon: Twitter, label: "Twitter / X" },
  { name: "youtube", icon: Youtube, label: "YouTube" },
  { name: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
  { name: "linkedin", icon: Linkedin, label: "LinkedIn" },
  { name: "tiktok", icon: Music2, label: "TikTok" },
  { name: "telegram", icon: Send, label: "Telegram" },
  { name: "email", icon: Mail, label: "Email" },
  { name: "other", icon: Globe, label: "Other" },
];

const iconMap: Record<string, any> = {
  facebook: Facebook, instagram: Instagram, twitter: Twitter, x: Twitter,
  youtube: Youtube, whatsapp: MessageCircle, linkedin: Linkedin,
  tiktok: Music2, telegram: Send, email: Mail,
};

function SocialIcon({ name }: { name: string }) {
  const Icon = iconMap[name.toLowerCase()] || Globe;
  return <Icon size={18} />;
}

export default function SocialMediaDashboard() {
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "facebook", url: "", active: true, order: 0 });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/social-media");
    const data = await res.json();
    setSocials(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ name: "facebook", url: "", active: true, order: socials.length });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (s: SocialMedia) => {
    setForm({ name: s.name, url: s.url, active: s.active, order: s.order });
    setEditId(s.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editId) {
      await fetch(`/api/social-media/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    await load();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this social link?")) return;
    await fetch(`/api/social-media/${id}`, { method: "DELETE" });
    await load();
  };

  const toggleActive = async (s: SocialMedia) => {
    await fetch(`/api/social-media/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    await load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Social Media Links
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Add social icons to the footer — auto-generated from name
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 shadow-lg shadow-[#0FADAD]/30"
          style={{ backgroundColor: "#0FADAD" }}
        >
          <Plus size={16} />
          Add Social
        </button>
      </div>

      {/* Info Banner */}
      <div
        className="rounded-xl p-4 mb-6 flex items-start gap-3 text-sm"
        style={{ backgroundColor: "#e6f9f9", color: "#0a6f6f" }}
      >
        <Globe size={18} className="flex-shrink-0 mt-0.5" />
        <p>
          Icons are automatically generated from the platform name. Just select the platform and add the URL — no manual icon setup needed!
        </p>
      </div>

      {/* Social Cards */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : socials.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Globe size={48} className="mx-auto mb-3 opacity-40" />
          <p>No social links yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socials.map((s) => {
            const platform = SOCIAL_PLATFORMS.find(
              (p) => p.name === s.name.toLowerCase()
            );
            return (
              <div
                key={s.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-4 border transition-all ${
                  s.active
                    ? "border-gray-100 dark:border-gray-700"
                    : "border-dashed border-gray-300 dark:border-gray-600 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: "#0FADAD" }}
                  >
                    <SocialIcon name={s.name} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {platform?.label || s.name}
                    </p>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-[#0FADAD] truncate block max-w-[140px]"
                    >
                      {s.url}
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleActive(s)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      s.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {s.active ? "Active" : "Hidden"}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white">
                {editId ? "Edit Social Link" : "Add Social Link"}
              </h2>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Platform *
                </label>
                <select
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.label}
                    </option>
                  ))}
                </select>

                {/* Preview Icon */}
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: "#0FADAD" }}
                  >
                    <SocialIcon name={form.name} />
                  </div>
                  <span>Icon preview</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  URL / Link *
                </label>
                <input
                  required
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) =>
                    setForm({ ...form, order: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-[#0FADAD]"
                />
                <span className="text-sm font-medium">Show in footer</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: "#0FADAD" }}
                >
                  {saving ? "Saving..." : editId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-600 font-semibold text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
