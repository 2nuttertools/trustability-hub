"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import {
  upsertProject,
  deleteProject as dbDeleteProject,
} from "@/lib/admin/projects";
import type { Project } from "@/lib/data";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function saveProjectAction(project: Project) {
  const admin = await requireAdmin();
  const result = await upsertProject(project, admin.id);
  if (!result.ok) return result;
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath(`/projects/${project.slug}`);
  return { ok: true as const };
}

export async function deleteProjectAction(slug: string) {
  await requireAdmin();
  await dbDeleteProject(slug);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { ok: true as const };
}
