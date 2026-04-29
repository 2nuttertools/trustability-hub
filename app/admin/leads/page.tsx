import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { isDbConfigured, ensureSchema, hasAnyAdmin } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { listLeads, getLeadStats, type LeadStatus } from "@/lib/admin/leads";
import { LeadsTable } from "./leads-table";

export const metadata = { title: "Leads — Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

const validStatuses: (LeadStatus | "all")[] = ["all", "new", "contacted", "qualified", "closed", "lost"];

export default async function AdminLeadsPage(props: PageProps<"/admin/leads">) {
  if (!isDbConfigured) redirect("/admin/setup");
  await ensureSchema();
  if (!(await hasAnyAdmin())) redirect("/admin/setup");
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const sp = await props.searchParams;
  const rawStatus = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const rawSearch = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const status = (validStatuses.includes(rawStatus as LeadStatus | "all") ? rawStatus : "all") as LeadStatus | "all";
  const search = typeof rawSearch === "string" ? rawSearch : "";

  const [leads, stats] = await Promise.all([
    listLeads({ status, search }),
    getLeadStats(),
  ]);

  return (
    <AdminShell user={{ displayName: admin.display_name, username: admin.username, email: admin.email, role: admin.role }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Leads ({stats.total})</h1>
        <p className="text-sm text-muted-foreground">รายชื่อลูกค้าที่กรอก contact form</p>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 mb-5">
        <StatPill label="ทั้งหมด" value={stats.total} active={status === "all"} href="/admin/leads" />
        <StatPill label="ใหม่" value={stats.new} active={status === "new"} href="/admin/leads?status=new" color="emerald" />
        <StatPill label="ติดต่อแล้ว" value={stats.contacted} active={status === "contacted"} href="/admin/leads?status=contacted" color="blue" />
        <StatPill label="Qualified" value={stats.qualified} active={status === "qualified"} href="/admin/leads?status=qualified" color="violet" />
        <StatPill label="ปิดดีล" value={stats.closed} active={status === "closed"} href="/admin/leads?status=closed" color="amber" />
        <StatPill label="Lost" value={stats.lost} active={status === "lost"} href="/admin/leads?status=lost" color="slate" />
      </div>

      <LeadsTable leads={leads} initialSearch={search} initialStatus={status} />
    </AdminShell>
  );
}

function StatPill({
  label, value, active, href, color = "brand",
}: {
  label: string;
  value: number;
  active?: boolean;
  href: string;
  color?: "brand" | "emerald" | "blue" | "violet" | "amber" | "slate";
}) {
  const colorMap: Record<string, string> = {
    brand: "from-brand-500 to-brand-700",
    emerald: "from-emerald-500 to-emerald-700",
    blue: "from-blue-500 to-blue-700",
    violet: "from-violet-500 to-purple-700",
    amber: "from-amber-500 to-orange-600",
    slate: "from-slate-400 to-slate-600",
  };
  return (
    <a
      href={href}
      className={`block rounded-xl p-3 border transition-all ${
        active
          ? `bg-gradient-to-br ${colorMap[color]} text-white border-transparent shadow-md`
          : "bg-white border-border hover:border-brand-300"
      }`}
    >
      <p className={`text-2xl font-bold leading-none ${active ? "text-white" : ""}`}>{value}</p>
      <p className={`text-[11px] mt-1 ${active ? "text-white/80" : "text-muted-foreground"}`}>{label}</p>
    </a>
  );
}
