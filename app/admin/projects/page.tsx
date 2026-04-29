import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getCurrentAdmin } from "@/lib/auth";
import { isDbConfigured, ensureSchema, hasAnyAdmin } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { listProjectsAdmin, seedProjectsIfEmpty } from "@/lib/admin/projects";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, ExternalLink, Star } from "lucide-react";
import { DeleteProjectButton } from "./delete-button";

export const metadata = { title: "Projects — Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  if (!isDbConfigured) redirect("/admin/setup");
  await ensureSchema();
  if (!(await hasAnyAdmin())) redirect("/admin/setup");
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const seedResult = await seedProjectsIfEmpty();
  const projects = await listProjectsAdmin();

  return (
    <AdminShell user={{ displayName: admin.display_name, email: admin.email, role: admin.role }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">โครงการ ({projects.length})</h1>
          <p className="text-sm text-muted-foreground">จัดการรายการโครงการทั้งหมด</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          เพิ่มโครงการ
        </Link>
      </div>

      {seedResult.seeded > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          ✓ Imported {seedResult.seeded} project(s) from JSON seed on first run
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground mb-4">ยังไม่มีโครงการ</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> เพิ่มโครงการแรก
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((row) => {
            const p = row.data;
            return (
              <div
                key={row.slug}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border hover:shadow-md transition-shadow"
              >
                <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {p.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <Image src={p.cover} alt={p.name} fill sizes="96px" className="object-cover" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <h3 className="font-bold text-base leading-tight truncate">{p.name}</h3>
                    {row.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {p.developer} • {p.type} • {p.location}, {p.province}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-foreground/70">
                    <span>💰 {formatPrice(p.priceFrom)}</span>
                    <span>📐 {p.sizeFrom}-{p.sizeTo} ตร.ม.</span>
                    {p.houseTypes && (
                      <span className="text-brand-700 font-medium">
                        🏠 {p.houseTypes.length} แบบบ้าน
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${row.slug}`}
                    target="_blank"
                    className="w-9 h-9 rounded-lg border border-border hover:bg-brand-50 hover:text-brand-700 flex items-center justify-center transition-colors"
                    title="ดูในเว็บจริง"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/projects/${row.slug}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    แก้ไข
                  </Link>
                  <DeleteProjectButton slug={row.slug} name={p.name} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
