import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { hasAnyAdmin, isDbConfigured } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Login — Trustability Hub Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!isDbConfigured) redirect("/admin/setup");

  // Already logged in?
  const admin = await getCurrentAdmin().catch(() => null);
  if (admin) redirect("/admin");

  // No admin yet? Go to setup
  if (!(await hasAnyAdmin().catch(() => true))) redirect("/admin/setup");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-50 via-white to-accent/10">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
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
        </Link>

        <div className="bg-white rounded-2xl border border-border p-7 shadow-xl">
          <h1 className="text-xl font-bold mb-1">เข้าสู่ระบบ</h1>
          <p className="text-sm text-muted-foreground mb-5">
            เข้าใช้งาน Admin Console
          </p>
          <LoginForm />
        </div>

        <p className="text-xs text-center text-muted-foreground mt-5">
          ลืมรหัสผ่าน? ติดต่อ Super Admin ของคุณเพื่อรีเซ็ต
        </p>
      </div>
    </div>
  );
}
