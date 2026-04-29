import { redirect } from "next/navigation";
import Link from "next/link";
import { hasAnyAdmin, isDbConfigured, getSql } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { getProjects } from "@/lib/data";
import { Home, Inbox, Newspaper, Users, ArrowRight } from "lucide-react";

export const metadata = { title: "Dashboard — Trustability Hub Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!isDbConfigured) redirect("/admin/setup");

  // If user has a session, getCurrentAdmin() loading the row is enough proof
  // the admins table exists and has data — skip the extra hasAnyAdmin() round-trip.
  const admin = await getCurrentAdmin().catch(() => null);
  if (!admin) {
    if (!(await hasAnyAdmin().catch(() => false))) redirect("/admin/setup");
    redirect("/admin/login");
  }

  // Run all dashboard queries in parallel — saves ~3x round-trip latency.
  let leadStats = { total: 0, new: 0 };
  let adminCount = 1;
  let articleCount = 3;
  let projectCount = 0;
  try {
    const sql = getSql();
    const [leadRows, adminRows, articleRows, projectRows] = await Promise.all([
      sql<{ total: string; new_count: string }[]>`
        select count(*)::text as total, count(*) filter (where status = 'new')::text as new_count from leads
      `,
      sql<{ c: string }[]>`select count(*)::text as c from admins`,
      sql<{ c: string }[]>`select count(*)::text as c from articles`,
      sql<{ c: string }[]>`select count(*)::text as c from projects`,
    ]);
    leadStats = { total: Number(leadRows[0].total), new: Number(leadRows[0].new_count) };
    adminCount = Number(adminRows[0].c);
    articleCount = Number(articleRows[0].c);
    projectCount = Number(projectRows[0].c);
  } catch {
    // Tables may not have any rows yet — fall back to JSON-derived count
    const projects = await getProjects();
    projectCount = projects.length;
  }

  return (
    <AdminShell user={{ displayName: admin.display_name, username: admin.username, email: admin.email, role: admin.role }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">สวัสดี, {admin.display_name} 👋</h1>
        <p className="text-sm text-muted-foreground">ภาพรวม Trustability Hub Admin</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Home} label="โครงการ" value={`${projectCount}`} href="/admin/projects" color="from-brand-500 to-brand-700" />
        <StatCard icon={Inbox} label="Leads ใหม่" value={`${leadStats.new}`} hint={`รวม ${leadStats.total} รายการ`} href="/admin/leads" color="from-emerald-500 to-emerald-700" />
        <StatCard icon={Newspaper} label="บทความ" value={`${articleCount}`} href="/admin/articles" color="from-amber-500 to-orange-600" />
        <StatCard icon={Users} label="ผู้ดูแล" value={`${adminCount}`} href={admin.role === "super-admin" ? "/admin/users" : "#"} color="from-purple-500 to-pink-600" />
      </div>

      {/* Quick links */}
      <div className="grid lg:grid-cols-2 gap-4">
        <QuickLink
          href="/admin/projects"
          title="จัดการโครงการ"
          description="เพิ่ม / แก้ไข / ลบโครงการ พร้อมรูปภาพและรายละเอียดทั้งหมด"
        />
        <QuickLink
          href="/admin/leads"
          title="ตรวจสอบ Leads"
          description="ดูคำถามจากลูกค้าที่กรอก contact form"
        />
        {admin.role === "super-admin" && (
          <QuickLink
            href="/admin/users"
            title="จัดการผู้ดูแลระบบ"
            description="เพิ่ม / ลบ admin และจัดการสิทธิ์การเข้าถึง"
          />
        )}
        <QuickLink
          href="/"
          title="ดูเว็บหลัก"
          description="เปิดเว็บฝั่ง public ที่ลูกค้าเห็น"
          external
        />
      </div>

    </AdminShell>
  );
}

function StatCard({
  icon: Icon, label, value, hint, href, color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group p-5 rounded-2xl bg-white border border-border hover:shadow-xl hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-brand-700 transition-all" />
      </div>
      <p className="text-3xl font-bold leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
      {hint && <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>}
    </Link>
  );
}

function QuickLink({
  href, title, description, external = false,
}: {
  href: string;
  title: string;
  description: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="group p-5 rounded-2xl bg-white border border-border hover:border-brand-400 hover:shadow-lg transition-all flex items-center gap-4"
    >
      <div className="flex-1">
        <p className="font-bold text-sm mb-1 group-hover:text-brand-700 transition-colors">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-brand-700 transition-all flex-shrink-0" />
    </Link>
  );
}
