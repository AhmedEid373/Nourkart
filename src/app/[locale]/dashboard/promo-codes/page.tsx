"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tag, Copy } from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  discountType: string;
  discount: number;
  minOrder: number;
  maxUses?: number | null;
  usedCount: number;
  active: boolean;
  expiresAt?: string | null;
}

const emptyForm = {
  code: "",
  discountType: "percentage",
  discount: "",
  minOrder: "0",
  maxUses: "",
  active: true,
  expiresAt: "",
};

export default function PromoCodesDashboard() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await fetch("/api/promo-codes").then((r) => r.json());
    setCodes(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (c: PromoCode) => {
    setForm({
      code: c.code,
      discountType: c.discountType,
      discount: String(c.discount),
      minOrder: String(c.minOrder),
      maxUses: c.maxUses ? String(c.maxUses) : "",
      active: c.active,
      expiresAt: c.expiresAt
        ? new Date(c.expiresAt).toISOString().split("T")[0]
        : "",
    });
    setEditId(c.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discount: parseFloat(form.discount),
      minOrder: parseFloat(form.minOrder) || 0,
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      active: form.active,
      expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
    };
    if (editId) {
      await fetch(`/api/promo-codes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setShowForm(false);
    await load();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo code?")) return;
    await fetch(`/api/promo-codes/${id}`, { method: "DELETE" });
    await load();
  };

  const toggleActive = async (c: PromoCode) => {
    await fetch(`/api/promo-codes/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    await load();
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const code = Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    setForm({ ...form, code });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Promo Codes
          </h1>
          <p className="text-gray-500 text-sm mt-1">{codes.length} codes</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 shadow-lg shadow-[#0FADAD]/30"
          style={{ backgroundColor: "#0FADAD" }}
        >
          <Plus size={16} />
          Add Code
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                {["Code", "Discount", "Min Order", "Uses", "Expires", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold text-gray-500 uppercase text-xs tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && codes.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No promo codes yet
                  </td>
                </tr>
              )}
              {codes.map((code) => (
                <tr
                  key={code.id}
                  className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "#e6f9f9" }}
                      >
                        <Tag size={14} style={{ color: "#0FADAD" }} />
                      </div>
                      <code className="font-bold font-mono text-sm">
                        {code.code}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(code.code)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-600">
                    {code.discountType === "percentage"
                      ? `${code.discount}%`
                      : `${code.discount} EGP`}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {code.minOrder > 0 ? `${code.minOrder} EGP` : "None"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {code.usedCount}
                    {code.maxUses && ` / ${code.maxUses}`}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {code.expiresAt
                      ? new Date(code.expiresAt).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(code)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        code.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {code.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(code)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(code.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white">
                {editId ? "Edit Promo Code" : "Add Promo Code"}
              </h2>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Code *
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                    className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      setForm({ ...form, discountType: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (EGP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.discount}
                    onChange={(e) =>
                      setForm({ ...form, discount: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Min Order (EGP)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.minOrder}
                    onChange={(e) =>
                      setForm({ ...form, minOrder: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Max Uses (blank = unlimited)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxUses}
                    onChange={(e) =>
                      setForm({ ...form, maxUses: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Expires At (optional)
                </label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) =>
                    setForm({ ...form, expiresAt: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
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
                <span className="text-sm font-medium">Active</span>
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
