import { redirect } from "next/navigation";
import { getCurrentAdmin, listAdmins } from "@/lib/auth";
import { isDbConfigured, ensureSchema, hasAnyAdmin } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { UsersClient } from "./users-client";

export const metadata = { title: "Users — Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  if (!isDbConfigured) redirect("/admin/setup");
  await ensureSchema();
  if (!(await hasAnyAdmin())) redirect("/admin/setup");
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.role !== "super-admin") redirect("/admin");

  const admins = await listAdmins();

  return (
    <AdminShell user={{ displayName: admin.display_name, email: admin.email, role: admin.role }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">ผู้ดูแลระบบ ({admins.length})</h1>
        <p className="text-sm text-muted-foreground">
          จัดการ admin accounts — Super Admin เท่านั้นที่เห็นหน้านี้
        </p>
      </div>

      <UsersClient admins={admins} currentAdminId={admin.id} />
    </AdminShell>
  );
}
