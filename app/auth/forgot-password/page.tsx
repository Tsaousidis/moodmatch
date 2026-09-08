"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error ?? "Could not request password reset.");
      }

      setStatus("success");
      // Since we don't have an email provider, we simulate it by giving the token in the UI
      setResetToken(body.token);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-primary lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url("/moodmatch-hero.png")' }}
        />
        <div className="absolute inset-0 bg-primary/65" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <p className="font-display text-2xl font-semibold">Moodmatch</p>
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-tertiary-fixed">
              Account Recovery
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">
              Get back to your Taste DNA.
            </h1>
          </div>
          <p className="text-sm text-on-primary-container">
            Reset your password and continue your journey.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="editorial-shadow w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest p-7">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-secondary">
              Moodmatch
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-primary">
              Forgot password
            </h1>
          </div>

          {status === "success" ? (
            <div className="mt-6">
              <p className="text-sm text-[#4f5f63] mb-4">
                In a real app, an email would be sent to you. Since this is a demo without an email provider, here is your reset link:
              </p>
              <div className="rounded-lg border border-outline-variant bg-surface p-4 break-all">
                <Link
                  href={`/auth/reset-password?token=${resetToken}`}
                  className="text-sm font-semibold text-secondary hover:underline"
                >
                  Click here to reset your password
                </Link>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-[#1f2428] hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-[#4f5f63]">
                Enter your email address and we&apos;ll help you reset your password.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-semibold text-on-surface-variant">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-2 h-12 w-full rounded-xl border border-outline-variant bg-surface px-3 text-sm transition focus:border-secondary"
                  />
                </label>

                {status === "error" && (
                  <p className="mt-4 rounded-lg bg-[#f8dfd7] px-3 py-2 text-sm text-[#7a2e1f]">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-6 h-12 w-full rounded-xl bg-primary px-4 text-sm font-semibold text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Working..." : "Send reset link"}
                </button>

                <p className="mt-5 text-center text-sm text-[#4f5f63]">
                  Remembered your password?{" "}
                  <Link href="/auth/login" className="font-semibold text-[#1f2428] hover:underline">
                    Log in
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
