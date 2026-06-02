"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

type AuthFormMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthFormMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/today";
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "");

    try {
      if (mode === "signup") {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          const body = (await response.json()) as { error?: string };
          throw new Error(body.error ?? "Could not create account.");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        throw new Error("Invalid email or password.");
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border border-[#ded6c7] bg-white/75 p-6 shadow-sm"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3c6e71]">
          Moodmatch
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#1f2428]">
          {isSignup ? "Create your account" : "Log in"}
        </h1>
      </div>

      <div className="mt-6 space-y-4">
        {isSignup ? (
          <label className="block">
            <span className="text-sm font-medium text-[#354247]">Name</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              className="mt-2 h-11 w-full rounded-lg border border-[#cfc7b9] bg-white px-3 text-sm outline-none transition focus:border-[#3c6e71]"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="text-sm font-medium text-[#354247]">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 h-11 w-full rounded-lg border border-[#cfc7b9] bg-white px-3 text-sm outline-none transition focus:border-[#3c6e71]"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#354247]">Password</span>
          <input
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            minLength={8}
            required
            className="mt-2 h-11 w-full rounded-lg border border-[#cfc7b9] bg-white px-3 text-sm outline-none transition focus:border-[#3c6e71]"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-[#f8dfd7] px-3 py-2 text-sm text-[#7a2e1f]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-11 w-full rounded-lg bg-[#1f2428] px-4 text-sm font-semibold text-white transition hover:bg-[#343b40] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Working..."
          : isSignup
            ? "Create account"
            : "Log in"}
      </button>

      <p className="mt-5 text-center text-sm text-[#4f5f63]">
        {isSignup ? "Already have an account?" : "New to Moodmatch?"}{" "}
        <Link
          href={isSignup ? "/auth/login" : "/auth/signup"}
          className="font-semibold text-[#1f2428]"
        >
          {isSignup ? "Log in" : "Create account"}
        </Link>
      </p>
    </form>
  );
}
