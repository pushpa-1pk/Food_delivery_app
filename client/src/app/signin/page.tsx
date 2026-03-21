"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { fetchCurrentUser, loginUser } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function parseLoginError(err: any): string {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message;

    if (err?.code === "ERR_NETWORK") return "Cannot connect to the server. Please check your internet connection.";
    if (status === 401) return "Invalid email or password. Please try again.";
    if (status === 403) return "Your account is not verified. Please check your email for a verification link.";
    if (status === 404) return "No account found with this email. Please sign up first.";
    if (status === 429) return "Too many login attempts. Please wait a moment and try again.";
    if (msg) return msg;
    return "Unable to sign in. Please check your details and try again.";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });
      const currentUser = await fetchCurrentUser().catch(() => null);
      const resolvedRole = currentUser?.role || data.user.role;

      setUser({
        id: currentUser?.id || data.user.id,
        name: currentUser?.name || email.split("@")[0],
        email: currentUser?.email || data.user.email,
        role: resolvedRole
      });

      if (resolvedRole === "ADMIN" || resolvedRole === "SELLER") {
        router.push("/admin/dashboard");
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(parseLoginError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Account access</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Customers can place and track orders here. If the restaurant owner signs in with owner credentials, the admin dashboard opens automatically.
        </p>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="signin-email" className="mb-1.5 block text-sm font-semibold text-stone-800">
              Email Address <span className="text-brand-500">*</span>
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              required
            />
          </div>
          <div>
            <label htmlFor="signin-password" className="mb-1.5 block text-sm font-semibold text-stone-800">
              Password <span className="text-brand-500">*</span>
            </label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              required
            />
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-stone-500">Secure login with role-based access</span>
            <Link href="/forgot-password" className="font-semibold text-brand-600">Forgot password?</Link>
          </div>

          {/* Error display */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-red-500">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-stone-600">
          New here? <Link href="/signup" className="font-semibold text-brand-600">Create a customer account</Link>
        </p>
      </div>
    </main>
  );
}
