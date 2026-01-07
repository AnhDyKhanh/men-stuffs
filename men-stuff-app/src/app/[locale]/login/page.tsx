"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { loginAsAdmin, setUserRole, MOCK_ADMIN } from "@/lib/auth";

/**
 * Login page - mock authentication
 * Supports admin login with credentials
 */
export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (loginAsAdmin(email, password)) {
      const redirect = new URLSearchParams(window.location.search).get(
        "redirect"
      );
      router.push(redirect || `/${locale}/admin/dashboard`);
      router.refresh();
    } else {
      setError("Invalid credentials. Use admin@menstuff.local / admin123");
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: "user" | "admin") => {
    if (role === "admin") {
      // Use mock admin credentials
      if (loginAsAdmin(MOCK_ADMIN.email, MOCK_ADMIN.password)) {
        router.push(`/${locale}/admin/dashboard`);
        router.refresh();
      }
    } else {
      setUserRole("user");
      const redirect = new URLSearchParams(window.location.search).get(
        "redirect"
      );
      router.push(redirect || `/${locale}`);
      router.refresh();
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>

        <div className="border rounded-lg p-8 bg-white shadow-sm">
          {/* Admin Login Form */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@menstuff.local"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin123"
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isLoading ? "Logging in..." : "Login as Admin"}
              </button>
            </form>
          </div>

          <div className="border-t pt-6">
            <p className="text-gray-600 mb-4 text-center text-sm">
              Quick login (mock):
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleQuickLogin("admin")}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Quick Login as Admin
              </button>
              <button
                onClick={() => handleQuickLogin("user")}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm"
              >
                Quick Login as User
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href={`/${locale}`}
              className="text-gray-600 hover:text-black text-sm"
            >
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
