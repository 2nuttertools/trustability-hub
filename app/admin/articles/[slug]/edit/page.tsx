import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { isDbConfigured, ensureSchema, hasAnyAdmin } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { getArticleAdmin, seedArticlesIfEmpty } from "@/lib/admin/articles";
import { ArticleForm } from "../../article-form";

export const metadata = { title: "Edit Article — Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditArticlePage(props: PageProps<"/admin/articles/[slug]/edit">) {
  if (!isDbConfigured) redirect("/admin/setup");
  await ensureSchema();
  if (!(await hasAnyAdmin())) redirect("/admin/setup");
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await seedArticlesIfEmpty();
  const { slug } = await props.params;
  const article = await getArticleAdmin(slug);
  if (!article) notFound();

  return (
    <AdminShell user={{ displayName: admin.display_name, username: admin.username, email: admin.email, role: admin.role }}>
      <Link href="/admin/articles" className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-semibold hover:gap-2 transition-all mb-3">
        <ArrowLeft className="w-3.5 h-3.5" /> กลับสู่รายการบทความ
      </Link>
      <h1 className="text-2xl font-bold mb-1">แก้ไขบทความ</h1>
      <p className="text-sm text-muted-foreground mb-6">{article.title}</p>
      <ArticleForm initial={article} isEditing />
    </AdminShell>
  );
}
