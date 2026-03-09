"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, UserX } from "lucide-react";

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [signupEnabled, setSignupEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [usersData, settings] = await Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/settings?keys=signup_enabled").then((r) => r.json()),
    ]);
    setUsers(Array.isArray(usersData) ? usersData : []);
    setSignupEnabled(settings.signup_enabled !== "false");
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleSignup = async () => {
    setSaving(true);
    const newValue = !signupEnabled;
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signup_enabled: String(newValue) }),
    });
    setSignupEnabled(newValue);
    setSaving(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
        </div>
      </div>

      {/* Signup Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
              User Registration
            </h3>
            <p className="text-sm text-gray-500">
              {signupEnabled
                ? "Users can currently create accounts"
                : "Sign up is disabled — new users cannot register"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-medium ${signupEnabled ? "text-green-600" : "text-red-500"}`}
            >
              {signupEnabled ? "Enabled" : "Disabled"}
            </span>
            <button
              onClick={toggleSignup}
              disabled={saving}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                signupEnabled ? "" : "bg-gray-300 dark:bg-gray-600"
              }`}
              style={signupEnabled ? { backgroundColor: "#0FADAD" } : {}}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                  signupEnabled ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
        {!signupEnabled && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm text-red-600">
            ⚠️ Registration is currently disabled. Existing users can still login.
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                {["User", "Email", "Role", "Orders", "Joined"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-500 uppercase text-xs tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    <Users size={40} className="mx-auto mb-2 opacity-30" />
                    No users yet
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: "#0FADAD" }}
                      >
                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {user.name || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {user._count.orders}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
