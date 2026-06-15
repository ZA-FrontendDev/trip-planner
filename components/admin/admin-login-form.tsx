"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck, User2 } from "lucide-react";

export function AdminLoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
          const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
          });

          const result = (await response.json()) as { success: boolean; error?: string };

          if (!response.ok || !result.success) {
            setError(result.error ?? "Login failed.");
            return;
          }

          router.push("/admin");
          router.refresh();
        } catch {
          setError("Unable to sign in right now. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <div className="grid gap-5">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-900">Admin username</span>
          <div className="relative">
            <User2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-13 w-full rounded-[20px] border border-slate-200 bg-white/90 pl-11 pr-4 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-primary"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-900">Password</span>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-13 w-full rounded-[20px] border border-slate-200 bg-white/90 pl-11 pr-4 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-primary"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
        </label>
      </div>

      {error ? (
        <div className="rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-[20px] bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:opacity-60"
        disabled={isSubmitting}
      >
        <ShieldCheck className="size-4" />
        {isSubmitting ? "Signing in..." : "Open Admin Dashboard"}
      </button>
    </form>
  );
}
