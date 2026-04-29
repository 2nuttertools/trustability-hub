"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, KeyRound, Loader2, AlertCircle, Check, Shield, User as UserIcon } from "lucide-react";
import { createAdminAction, deleteAdminAction, resetPasswordAction } from "./actions";
import type { AdminRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface AdminListItem {
  id: string;
  username: string;
  email: string;
  display_name: string;
  role: AdminRole;
  created_at: string;
  last_login_at: string | null;
}

function fmtDate(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleString("th-TH", { day: "numeric", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function UsersClient({ admins, currentAdminId }: { admins: AdminListItem[]; currentAdminId: string }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          type="button" onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          เพิ่ม Admin
        </button>
      </div>

      {showAddForm && (
        <AddAdminForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            router.refresh();
          }}
        />
      )}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {admins.map((a, i) => (
          <AdminRowItem
            key={a.id}
            admin={a}
            isCurrent={a.id === currentAdminId}
            isLast={i === admins.length - 1}
            onChanged={() => router.refresh()}
          />
        ))}
      </div>
    </>
  );
}

function AddAdminForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="bg-white rounded-2xl border border-border p-5 mb-4 shadow-md">
      <h3 className="font-bold mb-3">เพิ่ม Admin ใหม่</h3>
      <form
        className="grid lg:grid-cols-2 gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          startTransition(async () => {
            const r = await createAdminAction({ displayName, username, email, password, role });
            if (r.ok) onSuccess();
            else setError(r.error ?? "Failed");
          });
        }}
      >
        <Field label="ชื่อแสดง">
          <input type="text" required value={displayName} disabled={pending} onChange={(e) => setDisplayName(e.target.value)} className="input" placeholder="เช่น Admin คุณ A" />
        </Field>
        <Field label="Username">
          <input
            type="text" required minLength={3} maxLength={32} value={username} disabled={pending}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
            className="input font-mono" placeholder="เช่น admin1, sales-a"
          />
        </Field>
        <Field label="Email">
          <input type="email" required value={email} disabled={pending} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="user@example.com" />
        </Field>
        <Field label="Password (อย่างน้อย 8 ตัว)">
          <input type="password" required minLength={8} value={password} disabled={pending} onChange={(e) => setPassword(e.target.value)} className="input" />
        </Field>
        <Field label="Role">
          <select value={role} disabled={pending} onChange={(e) => setRole(e.target.value as AdminRole)} className="input">
            <option value="admin">Admin (จัดการโครงการ + leads)</option>
            <option value="super-admin">Super Admin (เพิ่ม/ลบ admin ได้ด้วย)</option>
          </select>
        </Field>

        {error && (
          <div className="lg:col-span-2 flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        )}

        <div className="lg:col-span-2 flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} disabled={pending} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">
            ยกเลิก
          </button>
          <button type="submit" disabled={pending} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-50">
            {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            สร้าง Admin
          </button>
        </div>
      </form>
      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.55rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: white;
          font-size: 0.875rem;
        }
        :global(.input:focus) {
          outline: none;
          border-color: var(--brand-400);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
}

function AdminRowItem({
  admin, isCurrent, isLast, onChanged,
}: {
  admin: AdminListItem;
  isCurrent: boolean;
  isLast: boolean;
  onChanged: () => void;
}) {
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetMsg, setResetMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    if (isCurrent) return alert("ลบบัญชีตัวเองไม่ได้");
    if (!confirm(`ลบ ${admin.display_name} (${admin.email})?\nการกระทำนี้ไม่สามารถย้อนกลับได้`)) return;
    startTransition(async () => {
      const r = await deleteAdminAction(admin.id);
      if (r.ok) onChanged();
      else alert(r.error);
    });
  };

  const handleReset = () => {
    if (newPassword.length < 8) {
      setResetMsg({ type: "error", text: "รหัสผ่านต้องอย่างน้อย 8 ตัว" });
      return;
    }
    startTransition(async () => {
      const r = await resetPasswordAction(admin.id, newPassword);
      if (r.ok) {
        setResetMsg({ type: "success", text: "รีเซ็ตรหัสผ่านเรียบร้อย" });
        setNewPassword("");
        setTimeout(() => {
          setShowResetForm(false);
          setResetMsg(null);
        }, 2000);
      } else {
        setResetMsg({ type: "error", text: r.error ?? "Failed" });
      }
    });
  };

  return (
    <div className={cn(!isLast && "border-b border-border")}>
      <div className="flex items-center gap-3 p-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0",
          admin.role === "super-admin" ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-brand-500 to-brand-700",
        )}>
          {admin.role === "super-admin" ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold truncate">{admin.display_name}</span>
            {isCurrent && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider">
                You
              </span>
            )}
            <span className={cn(
              "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
              admin.role === "super-admin" ? "bg-amber-100 text-amber-800" : "bg-brand-100 text-brand-700",
            )}>
              {admin.role}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            <span className="font-mono text-brand-700">@{admin.username}</span>
            <span className="mx-1.5">·</span>
            {admin.email}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            สร้างเมื่อ {fmtDate(admin.created_at)} • Login ล่าสุด {fmtDate(admin.last_login_at)}
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button" onClick={() => setShowResetForm(!showResetForm)}
            title="Reset password"
            className="w-9 h-9 rounded-lg border border-border hover:bg-amber-50 hover:text-amber-700 flex items-center justify-center transition-colors"
          >
            <KeyRound className="w-4 h-4" />
          </button>
          <button
            type="button" onClick={handleDelete} disabled={isCurrent || pending}
            title={isCurrent ? "ลบบัญชีตัวเองไม่ได้" : "ลบ"}
            className="w-9 h-9 rounded-lg border border-border text-rose-600 hover:bg-rose-50 hover:border-rose-300 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {showResetForm && (
        <div className="px-4 pb-4 pt-0 -mt-1 bg-amber-50/30 border-t border-amber-100">
          <div className="flex items-center gap-2 mt-3">
            <input
              type="password" placeholder="รหัสผ่านใหม่ (≥ 8 ตัว)"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={pending}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              type="button" onClick={handleReset} disabled={pending || newPassword.length < 8}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 disabled:opacity-50"
            >
              {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              รีเซ็ต
            </button>
            <button
              type="button" onClick={() => { setShowResetForm(false); setResetMsg(null); setNewPassword(""); }}
              className="px-3 py-2 rounded-lg border border-border text-xs hover:bg-muted"
            >
              ยกเลิก
            </button>
          </div>
          {resetMsg && (
            <p className={cn("text-xs mt-2", resetMsg.type === "success" ? "text-emerald-700" : "text-rose-700")}>
              {resetMsg.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
