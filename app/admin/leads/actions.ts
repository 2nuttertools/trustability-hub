"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { updateLeadStatus, deleteLead, type LeadStatus } from "@/lib/admin/leads";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function updateLeadStatusAction(id: string, status: LeadStatus, notes?: string | null) {
  await requireAdmin();
  await updateLeadStatus(id, status, notes);
  revalidatePath("/admin/leads");
  return { ok: true as const };
}

export async function deleteLeadAction(id: string) {
  await requireAdmin();
  await deleteLead(id);
  revalidatePath("/admin/leads");
  return { ok: true as const };
}
