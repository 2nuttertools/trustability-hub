import { getSql } from "@/lib/db";
import type { Article } from "@/lib/data";
import articlesJson from "@/data/articles.json";

const seed = articlesJson as Article[];

export async function seedArticlesIfEmpty(): Promise<{ seeded: number }> {
  const sql = getSql();
  const [{ count }] = await sql<{ count: string }[]>`select count(*)::text as count from articles`;
  if (Number(count) > 0) return { seeded: 0 };
  let seeded = 0;
  for (const a of seed) {
    await sql`
      insert into articles (slug, data)
      values (${a.slug}, ${sql.json(JSON.parse(JSON.stringify(a)))})
      on conflict (slug) do nothing
    `;
    seeded++;
  }
  return { seeded };
}

export async function listArticlesAdmin(): Promise<{ slug: string; data: Article; updated_at: string }[]> {
  const sql = getSql();
  return await sql`
    select slug, data, updated_at::text
    from articles
    order by published_at desc, updated_at desc
  ` as unknown as { slug: string; data: Article; updated_at: string }[];
}

export async function getArticleAdmin(slug: string): Promise<Article | null> {
  const sql = getSql();
  const rows = await sql<{ data: Article }[]>`select data from articles where slug = ${slug} limit 1`;
  return rows[0]?.data ?? null;
}

export async function upsertArticle(article: Article, adminId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!article.slug?.trim()) return { ok: false, error: "Slug ห้ามว่าง" };
  if (!article.title?.trim()) return { ok: false, error: "Title ห้ามว่าง" };
  const sql = getSql();
  try {
    await sql`
      insert into articles (slug, data, updated_by, updated_at)
      values (${article.slug}, ${sql.json(JSON.parse(JSON.stringify(article)))}, ${adminId}, now())
      on conflict (slug) do update set
        data = excluded.data, updated_by = excluded.updated_by, updated_at = now()
    `;
    return { ok: true };
  } catch (e) {
    console.error("[upsertArticle]", e);
    return { ok: false, error: "บันทึกไม่สำเร็จ: " + (e as Error).message };
  }
}

export async function deleteArticle(slug: string): Promise<void> {
  const sql = getSql();
  await sql`delete from articles where slug = ${slug}`;
}
