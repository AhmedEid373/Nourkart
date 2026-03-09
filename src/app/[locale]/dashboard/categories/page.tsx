"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  _count?: { products: number };
}

export default function CategoriesDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nameEn: "", nameAr: "", slug: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await fetch("/api/categories").then((r) => r.json());
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ nameEn: "", nameAr: "", slug: "" });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (c: Category) => {
    setForm({ nameEn: c.nameEn, nameAr: c.nameAr, slug: c.slug });
    setEditId(c.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      nameEn: form.nameEn,
      nameAr: form.nameAr,
      slug: form.slug || slugify(form.nameEn),
    };
    if (editId) {
      await fetch(`/api/categories/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/categories", {
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
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#0FADAD]/30"
          style={{ backgroundColor: "#0FADAD" }}
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase text-xs tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase text-xs tracking-wider">
                Arabic
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase text-xs tracking-wider">
                Slug
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase text-xs tracking-wider">
                Products
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-500 uppercase text-xs tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No categories yet
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#e6f9f9" }}
                    >
                      <FolderOpen size={14} style={{ color: "#0FADAD" }} />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {cat.nameEn}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400" dir="rtl">
                  {cat.nameAr}
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-gray-600 dark:text-gray-400">
                    {cat.slug}
                  </code>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {cat._count?.products || 0}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white">
                {editId ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Name (English) *
                </label>
                <input
                  required
                  value={form.nameEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({
                      ...form,
                      nameEn: val,
                      slug: !editId ? slugify(val) : form.slug,
                    });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  الاسم (عربي) *
                </label>
                <input
                  required
                  value={form.nameAr}
                  onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                  dir="rtl"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Slug
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#0FADAD]/30 focus:border-[#0FADAD] font-mono"
                />
              </div>
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
