"use client";

import { FormEvent, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-[#4f5f63]">Invalid or missing password reset token.</p>
        <Link href="/auth/forgot-password" className="mt-4 inline-block font-semibold text-secondary hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error ?? "Could not reset password.");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center mt-4">
        <p className="text-sm text-[#4f5f63] mb-6">
          Your password has been successfully reset.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-on-primary transition hover:opacity-90"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-2 text-sm text-[#4f5f63]">
        Choose a new password for your account.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-on-surface-variant">New Password</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
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
          {status === "loading" ? "Working..." : "Reset password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
              A fresh start.
            </h1>
          </div>
          <p className="text-sm text-on-primary-container">
            Secure your account to keep building your profile.
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
              Set new password
            </h1>
          </div>

          <Suspense fallback={<div className="mt-6 animate-pulse h-32 w-full rounded-xl bg-surface-container"></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
