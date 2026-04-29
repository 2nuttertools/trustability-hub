"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin, createAdmin, deleteAdmin, resetAdminPassword, type AdminRole } from "@/lib/auth";

async function requireSuperAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.role !== "super-admin") {
    return { error: "เฉพาะ Super Admin เท่านั้น" };
  }
  return { admin };
}

export async function createAdminAction(input: {
  username: string;
  email: string;
  password: string;
  displayName: string;
  role: AdminRole;
}) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return { ok: false as const, error: guard.error };
  const result = await createAdmin(input);
  if (!result.ok) return result;
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true as const, id: result.id };
}

export async function deleteAdminAction(id: string) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return { ok: false as const, error: guard.error };
  if (guard.admin.id === id) {
    return { ok: false as const, error: "ลบบัญชีตัวเองไม่ได้" };
  }
  await deleteAdmin(id);
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function resetPasswordAction(id: string, newPassword: string) {
  const guard = await requireSuperAdmin();
  if ("error" in guard) return { ok: false as const, error: guard.error };
  const result = await resetAdminPassword(id, newPassword);
  if (!result.ok) return { ok: false as const, error: result.error ?? "Failed" };
  return { ok: true as const };
}
