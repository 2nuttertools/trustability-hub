import { getSql } from "@/lib/db";
import type { Project } from "@/lib/data";
import projectsJson from "@/data/projects.json";

const seedProjects = projectsJson as Project[];

/**
 * Initialize the projects table from the JSON seed if empty.
 * Idempotent — safe to call from /admin/projects on every load.
 */
export async function seedProjectsIfEmpty(): Promise<{ seeded: number }> {
  const sql = getSql();
  const [{ count }] = await sql<{ count: string }[]>`select count(*)::text as count from projects`;
  if (Number(count) > 0) return { seeded: 0 };

  let seeded = 0;
  for (let i = 0; i < seedProjects.length; i++) {
    const p = seedProjects[i];
    await sql`
      insert into projects (slug, data, featured, sort_order)
      values (${p.slug}, ${sql.json(JSON.parse(JSON.stringify(p)))}, ${p.featured ?? false}, ${i})
      on conflict (slug) do nothing
    `;
    seeded++;
  }
  return { seeded };
}

export async function listProjectsAdmin(): Promise<{
  slug: string;
  data: Project;
  featured: boolean;
  sort_order: number;
  updated_at: string;
}[]> {
  const sql = getSql();
  return await sql`
    select slug, data, featured, sort_order, updated_at::text
    from projects
    order by featured desc, sort_order asc, updated_at desc
  ` as unknown as { slug: string; data: Project; featured: boolean; sort_order: number; updated_at: string }[];
}

export async function getProjectAdmin(slug: string): Promise<Project | null> {
  const sql = getSql();
  const rows = await sql<{ data: Project }[]>`select data from projects where slug = ${slug} limit 1`;
  return rows[0]?.data ?? null;
}

export async function upsertProject(
  project: Project,
  adminId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!project.slug?.trim()) return { ok: false, error: "Slug ห้ามว่าง" };
  if (!project.name?.trim()) return { ok: false, error: "ชื่อโครงการห้ามว่าง" };

  const sql = getSql();
  try {
    await sql`
      insert into projects (slug, data, featured, sort_order, updated_by, updated_at)
      values (${project.slug}, ${sql.json(JSON.parse(JSON.stringify(project)))}, ${project.featured ?? false}, 0, ${adminId}, now())
      on conflict (slug) do update set
        data = excluded.data,
        featured = excluded.featured,
        updated_by = excluded.updated_by,
        updated_at = now()
    `;
    return { ok: true };
  } catch (e) {
    console.error("[upsertProject]", e);
    return { ok: false, error: "บันทึกไม่สำเร็จ: " + (e as Error).message };
  }
}

export async function deleteProject(slug: string): Promise<void> {
  const sql = getSql();
  await sql`delete from projects where slug = ${slug}`;
}
