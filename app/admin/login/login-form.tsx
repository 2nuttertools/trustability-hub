"use client";

import { useState, useTransition } from "react";
import { Loader2, AlertCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await loginAction({ identifier, password });
          if (result.ok) {
            router.push("/admin");
            router.refresh();
          } else {
            setError(result.error);
          }
        });
      }}
    >
      <label className="block">
        <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5 block">Username หรือ Email</span>
        <input
          type="text" required value={identifier} disabled={pending}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
          placeholder="ใส่ username หรือ email"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm disabled:opacity-50"
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5 block">Password</span>
        <input
          type="password" required value={password} disabled={pending}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm disabled:opacity-50"
        />
      </label>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-rose-700">{error}</p>
        </div>
      )}

      <button
        type="submit" disabled={pending}
        className="w-full bg-gradient-to-r from-brand-600 to-brand-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
        เข้าสู่ระบบ
      </button>
    </form>
  );
}
