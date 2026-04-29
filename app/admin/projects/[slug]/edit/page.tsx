import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { isDbConfigured, ensureSchema, hasAnyAdmin } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { getProjectAdmin, seedProjectsIfEmpty } from "@/lib/admin/projects";
import { ProjectForm } from "../../project-form";

export const metadata = { title: "Edit Project — Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditProjectPage(props: PageProps<"/admin/projects/[slug]/edit">) {
  if (!isDbConfigured) redirect("/admin/setup");
  await ensureSchema();
  if (!(await hasAnyAdmin())) redirect("/admin/setup");
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await seedProjectsIfEmpty();

  const { slug } = await props.params;
  const project = await getProjectAdmin(slug);
  if (!project) notFound();

  return (
    <AdminShell user={{ displayName: admin.display_name, email: admin.email, role: admin.role }}>
      <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-semibold hover:gap-2 transition-all mb-3">
        <ArrowLeft className="w-3.5 h-3.5" />
        กลับสู่รายการโครงการ
      </Link>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">แก้ไขโครงการ</h1>
          <p className="text-sm text-muted-foreground">{project.name} · {project.developer}</p>
        </div>
        <Link
          href={`/projects/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-brand-50 hover:text-brand-700 transition-colors flex-shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          ดูในเว็บจริง
        </Link>
      </div>

      <ProjectForm initial={project} isEditing />
    </AdminShell>
  );
}
