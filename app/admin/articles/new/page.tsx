import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { isDbConfigured, ensureSchema, hasAnyAdmin } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleForm } from "../article-form";

export const metadata = { title: "New Article — Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  if (!isDbConfigured) redirect("/admin/setup");
  await ensureSchema();
  if (!(await hasAnyAdmin())) redirect("/admin/setup");
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <AdminShell user={{ displayName: admin.display_name, username: admin.username, email: admin.email, role: admin.role }}>
      <Link href="/admin/articles" className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-semibold hover:gap-2 transition-all mb-3">
        <ArrowLeft className="w-3.5 h-3.5" /> กลับสู่รายการบทความ
      </Link>
      <h1 className="text-2xl font-bold mb-6">เพิ่มบทความใหม่</h1>
      <ArticleForm isEditing={false} />
    </AdminShell>
  );
}
