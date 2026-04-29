import { redirect } from "next/navigation";
import { ensureSchema, hasAnyAdmin, isDbConfigured } from "@/lib/db";
import { SetupForm } from "./setup-form";
import { Building2 } from "lucide-react";

export const metadata = {
  title: "Setup — Trustability Hub Admin",
};

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  if (!isDbConfigured) {
    return <DbNotConfigured />;
  }

  // Ensure tables exist on first hit
  try {
    await ensureSchema();
  } catch (e) {
    console.error("[setup] schema init failed", e);
    return <SchemaError message={(e as Error).message} />;
  }

  // If admins already exist, setup is done — redirect to login
  if (await hasAnyAdmin()) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-50 via-white to-accent/10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center shadow-lg shadow-brand-600/30">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-left leading-none">
              <p className="font-bold text-lg bg-gradient-to-r from-brand-900 to-brand-600 bg-clip-text text-transparent">
                Trustability Hub
              </p>
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                Admin Console
              </p>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">ตั้งค่าระบบครั้งแรก</h1>
          <p className="text-sm text-muted-foreground">
            สร้างบัญชี Super Admin คนแรก เพื่อเริ่มใช้งาน Admin Console
          </p>
        </div>

        <SetupForm />

        <p className="text-xs text-center text-muted-foreground mt-6">
          ✓ ข้อมูลปลอดภัย • ✓ password เข้ารหัส bcrypt • ✓ session encrypted
        </p>
      </div>
    </div>
  );
}

function DbNotConfigured() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-rose-50">
      <div className="max-w-md p-8 bg-white rounded-2xl border border-rose-200 shadow-lg">
        <h1 className="text-xl font-bold text-rose-700 mb-3">⚠️ ยังไม่ได้ตั้ง Database</h1>
        <p className="text-sm text-foreground/80 mb-4">
          ต้องตั้งค่า <code className="bg-rose-100 px-1.5 py-0.5 rounded text-xs">DATABASE_URL</code> ก่อน — Admin Console ใช้ Postgres เก็บข้อมูลผู้ดูแลและ leads
        </p>
        <div className="text-xs text-foreground/70 space-y-2 bg-slate-50 rounded-lg p-3 mb-3">
          <p className="font-semibold">วิธีตั้งค่า (Vercel + Neon — ฟรี):</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>เปิด <a className="text-brand-700 underline" href="https://vercel.com/aidji13store-6706s-projects/trustability-hub/stores" target="_blank" rel="noreferrer">Vercel Storage</a></li>
            <li>คลิก "Create Database" → เลือก <b>Neon (Postgres)</b></li>
            <li>เลือก region ใกล้ไทย (เช่น Singapore)</li>
            <li>กด Connect — Vercel จะตั้ง <code>DATABASE_URL</code> ให้อัตโนมัติ</li>
            <li>Redeploy แล้วกลับมาที่หน้านี้</li>
          </ol>
        </div>
        <p className="text-xs text-muted-foreground">
          หรือใช้ Postgres ที่ไหนก็ได้ — ตั้ง env var <code>DATABASE_URL</code> เป็น connection string
        </p>
      </div>
    </div>
  );
}

function SchemaError({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-rose-50">
      <div className="max-w-md p-8 bg-white rounded-2xl border border-rose-200 shadow-lg">
        <h1 className="text-xl font-bold text-rose-700 mb-3">⚠️ เชื่อมต่อ Database ไม่สำเร็จ</h1>
        <p className="text-sm text-foreground/80 mb-3">
          ตั้งค่า <code>DATABASE_URL</code> แล้ว แต่เชื่อมต่อหรือสร้างตารางไม่สำเร็จ
        </p>
        <pre className="text-xs bg-rose-100 rounded p-3 overflow-auto whitespace-pre-wrap break-all">{message}</pre>
      </div>
    </div>
  );
}
