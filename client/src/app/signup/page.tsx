"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { fetchCurrentUser, loginUser, registerUser } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

function parseServerError(err: any): string {
  const data = err?.response?.data;
  const status = err?.response?.status;

  // Network error
  if (err?.code === "ERR_NETWORK") return "Cannot connect to the server. Please check your internet connection.";

  // Status-code-specific errors
  if (status === 409) return "An account with this email already exists. Please sign in instead.";
  if (status === 429) return "Too many registration attempts. Please wait a moment and try again.";
  if (status === 500) return "Account may have been created but the server encountered an error. Try signing in with your details.";

  // Zod validation errors (400)
  if (data?.errors?.fieldErrors) {
    const fieldErrors = data.errors.fieldErrors as Record<string, string[]>;
    const messages: string[] = [];
    for (const [field, errs] of Object.entries(fieldErrors)) {
      for (const msg of errs) {
        const label = field === "name" ? "Name" : field === "email" ? "Email" : field === "password" ? "Password" : field === "phone" ? "Phone" : field;
        messages.push(`${label}: ${msg}`);
      }
    }
    if (messages.length > 0) return messages.join("\n");
  }

  // Simple message from server
  if (data?.message) return data.message;

  return "Unable to create account right now. Please try again.";
}

const passwordRules = [
  { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "One uppercase letter (A-Z)" },
  { test: (p: string) => /[a-z]/.test(p), label: "One lowercase letter (a-z)" },
  { test: (p: string) => /\d/.test(p), label: "One number (0-9)" },
];

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const allPasswordRulesMet = passwordRules.every((r) => r.test(password));

  function validateForm(): string | null {
    if (name.trim().length < 2) return "Name must be at least 2 characters.";
    if (!email.includes("@") || !email.includes(".")) return "Please enter a valid email address.";
    if (!allPasswordRulesMet) return "Password does not meet the requirements below.";
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await registerUser({ name, email, phone, password, role: "CUSTOMER" });
      const loginData = await loginUser({ email, password });
      const currentUser = await fetchCurrentUser().catch(() => null);
      setUser({
        id: currentUser?.id || loginData.user.id,
        name: currentUser?.name || name,
        email: currentUser?.email || loginData.user.email,
        role: "CUSTOMER"
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(parseServerError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Customer account</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900">Sign up</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Create a customer account to order food, save your details, and track your Jay Malhar orders.
        </p>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="signup-name" className="mb-1.5 block text-sm font-semibold text-stone-800">
              Full Name <span className="text-brand-500">*</span>
            </label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              required
            />
            {touched && name.trim().length > 0 && name.trim().length < 2 && (
              <p className="mt-1 text-xs text-red-500">Name must be at least 2 characters</p>
            )}
          </div>

          <div>
            <label htmlFor="signup-email" className="mb-1.5 block text-sm font-semibold text-stone-800">
              Email Address <span className="text-brand-500">*</span>
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              required
            />
          </div>

          <div>
            <label htmlFor="signup-phone" className="mb-1.5 block text-sm font-semibold text-stone-800">
              Phone Number
            </label>
            <input
              id="signup-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone number (optional)"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="mb-1.5 block text-sm font-semibold text-stone-800">
              Password <span className="text-brand-500">*</span>
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) => { setPassword(event.target.value); setTouched(true); }}
              placeholder="Create a strong password"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              required
            />
            {/* Password strength indicators */}
            {password.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                {passwordRules.map((rule) => {
                  const passed = rule.test(password);
                  return (
                    <div key={rule.label} className="flex items-center gap-1.5">
                      {passed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-green-500">
                          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-stone-300">
                          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-1-5a1 1 0 1 0 2 0V9a1 1 0 1 0-2 0v4Zm1-8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`text-xs ${passed ? "text-green-600" : "text-stone-400"}`}>{rule.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-red-500">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              <p className="whitespace-pre-line text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-stone-600">
          Already have an account? <Link href="/signin" className="font-semibold text-brand-600">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
