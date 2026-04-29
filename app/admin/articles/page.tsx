import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { isDbConfigured, ensureSchema, hasAnyAdmin } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { listArticlesAdmin, seedArticlesIfEmpty } from "@/lib/admin/articles";
import { Plus, Pencil, ExternalLink, Clock } from "lucide-react";
import { DeleteArticleButton } from "./delete-button";

export const metadata = { title: "Articles — Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  if (!isDbConfigured) redirect("/admin/setup");
  await ensureSchema();
  if (!(await hasAnyAdmin())) redirect("/admin/setup");
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const seedResult = await seedArticlesIfEmpty();
  const articles = await listArticlesAdmin();

  return (
    <AdminShell user={{ displayName: admin.display_name, email: admin.email, role: admin.role }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">บทความ ({articles.length})</h1>
          <p className="text-sm text-muted-foreground">จัดการบทความบนหน้า Articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          เพิ่มบทความ
        </Link>
      </div>

      {seedResult.seeded > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          ✓ Imported {seedResult.seeded} article(s) from JSON seed on first run
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground mb-4">ยังไม่มีบทความ</p>
          <Link href="/admin/articles/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold">
            <Plus className="w-4 h-4" /> เพิ่มบทความแรก
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((row) => {
            const a = row.data;
            return (
              <div key={row.slug} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border hover:shadow-md transition-shadow">
                <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {a.cover && (
                    <Image src={a.cover} alt={a.title} fill sizes="96px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base leading-tight line-clamp-1">{a.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{a.excerpt}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-semibold">{a.category}</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" />{a.readTime}</span>
                    <span className="text-muted-foreground">{a.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href="/#articles"
                    target="_blank"
                    className="w-9 h-9 rounded-lg border border-border hover:bg-brand-50 hover:text-brand-700 flex items-center justify-center transition-colors"
                    title="ดูในเว็บจริง"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/articles/${row.slug}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    แก้ไข
                  </Link>
                  <DeleteArticleButton slug={row.slug} title={a.title} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
