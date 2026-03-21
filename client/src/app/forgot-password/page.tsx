"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { forgotPassword, verifyResetOtp, resetPassword } from "@/services/auth-service";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await forgotPassword(email);
      setMessage("An OTP has been sent to your email.");
      setStep("otp");
      setCountdown(300); // 5 minutes
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await verifyResetOtp({ email, token: otp });
      setStep("password");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await resetPassword({ email, token: otp, password });
      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Account recovery</p>
        <h1 className="mt-2 font-display text-4xl text-brand-900">
          {step === "email" && "Forgot password"}
          {step === "otp" && "Verify OTP"}
          {step === "password" && "Reset password"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          {step === "email" && "Enter your email to receive a 6-digit verification code."}
          {step === "otp" && "Enter the 6-digit OTP code sent to your email."}
          {step === "password" && "Enter your new password to secure your account."}
        </p>

        {step === "email" && (
          <form className="mt-8 grid gap-4" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-stone-800">Email Address <span className="text-brand-500">*</span></label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white disabled:opacity-60">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form className="mt-8 grid gap-4" onSubmit={handleOtpVerify}>
            <div>
              <label htmlFor="otp" className="mb-1.5 block text-sm font-semibold text-stone-800">6-Digit OTP <span className="text-brand-500">*</span></label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none text-center font-bold tracking-widest focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>
            {message && <p className="text-sm text-green-700">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white disabled:opacity-60">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="mt-2 text-center">
              {countdown > 0 ? (
                <p className="text-sm text-stone-500">
                  Resend OTP in {Math.floor(countdown / 60)}:
                  {(countdown % 60).toString().padStart(2, "0")}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleEmailSubmit(e as any)}
                  disabled={loading}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-500 disabled:opacity-60"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        {step === "password" && (
          <form className="mt-8 grid gap-4" onSubmit={handlePasswordReset}>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-stone-800">New Password <span className="text-brand-500">*</span></label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-semibold text-stone-800">Confirm Password <span className="text-brand-500">*</span></label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-700">{message}</p>}
            <button type="submit" disabled={loading} className="rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}

        {step === "email" && (
          <p className="mt-6 text-sm text-stone-600">
            Remembered your password? <Link href="/signin" className="font-semibold text-brand-600">Back to sign in</Link>
          </p>
        )}
      </div>
    </main>
  );
}
