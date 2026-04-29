"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { runSetup } from "./actions";
import { useRouter } from "next/navigation";

export function SetupForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-7 text-center shadow-xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4">
          <Check className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold mb-1">ตั้งค่าสำเร็จ!</h2>
        <p className="text-sm text-muted-foreground mb-5">
          คุณคือ Super Admin คนแรกของระบบแล้ว — กำลังพาไปหน้า Login...
        </p>
        <button
          onClick={() => router.push("/admin/login")}
          className="text-sm font-semibold text-brand-700 hover:text-brand-900"
        >
          ไปหน้า Login →
        </button>
      </div>
    );
  }

  return (
    <form
      className="bg-white rounded-2xl border border-border p-7 shadow-xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
          setError("รหัสผ่านไม่ตรงกัน");
          return;
        }
        startTransition(async () => {
          const result = await runSetup({ displayName, email, password });
          if (result.ok) {
            setDone(true);
            setTimeout(() => router.push("/admin/login"), 1500);
          } else {
            setError(result.error);
          }
        });
      }}
    >
      <Field label="ชื่อแสดง (Display Name)">
        <input
          type="text" required value={displayName} disabled={pending}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="เช่น Mac Tee"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm disabled:opacity-50"
        />
      </Field>

      <Field label="Email">
        <input
          type="email" required value={email} disabled={pending}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm disabled:opacity-50"
        />
      </Field>

      <Field label="รหัสผ่าน (อย่างน้อย 8 ตัว)">
        <input
          type="password" required minLength={8} value={password} disabled={pending}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm disabled:opacity-50"
        />
      </Field>

      <Field label="ยืนยันรหัสผ่าน">
        <input
          type="password" required minLength={8} value={confirmPassword} disabled={pending}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm disabled:opacity-50"
        />
      </Field>

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
        {pending && <Loader2 className="w-4 h-4 animate-spin" />}
        สร้างบัญชี Super Admin
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}
