"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { upsertArticle, deleteArticle as dbDeleteArticle } from "@/lib/admin/articles";
import type { Article } from "@/lib/data";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function saveArticleAction(article: Article) {
  const admin = await requireAdmin();
  const result = await upsertArticle(article, admin.id);
  if (!result.ok) return result;
  revalidatePath("/");
  revalidatePath("/admin/articles");
  return { ok: true as const };
}

export async function deleteArticleAction(slug: string) {
  await requireAdmin();
  await dbDeleteArticle(slug);
  revalidatePath("/");
  revalidatePath("/admin/articles");
  return { ok: true as const };
}
