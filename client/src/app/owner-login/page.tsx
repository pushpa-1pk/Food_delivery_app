"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { fetchCurrentUser, loginUser } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export default function OwnerLoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser({ email, password });
      const currentUser = await fetchCurrentUser().catch(() => null);
      const resolvedRole = currentUser?.role || data.user.role;

      if (resolvedRole !== "SELLER") {
        setError("Only the restaurant owner can access this dashboard.");
        return;
      }

      setUser({
        id: currentUser?.id || data.user.id,
        name: currentUser?.name || "Jay Malhar Owner",
        email: currentUser?.email || data.user.email,
        role: resolvedRole
      });
      router.push("/seller");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Owner sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Private owner access</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900">Owner login</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          This login page is only for the Jay Malhar restaurant owner. Customers should use the normal sign-in page.
        </p>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Owner email"
            className="rounded-2xl border border-stone-200 px-4 py-3"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="rounded-2xl border border-stone-200 px-4 py-3"
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" disabled={loading} className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white disabled:opacity-60">
            {loading ? "Signing in..." : "Open owner dashboard"}
          </button>
        </form>

        <p className="mt-6 text-sm text-stone-600">
          Customer account? <Link href="/signin" className="font-semibold text-brand-600">Go to customer sign in</Link>
        </p>
      </div>
    </main>
  );
}
