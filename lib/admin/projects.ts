import { getSql } from "@/lib/db";
import type { Project } from "@/lib/data";
import projectsJson from "@/data/projects.json";

const seedProjects = projectsJson as Project[];

/**
 * Initialize the projects table from the JSON seed if empty.
 * Cached per Lambda lifetime — once we've checked and the table is non-empty,
 * subsequent calls return immediately without hitting the database.
 */
let _seedChecked = false;
export async function seedProjectsIfEmpty(): Promise<{ seeded: number }> {
  if (_seedChecked) return { seeded: 0 };
  const sql = getSql();
  const countRows = (await sql`select count(*)::text as count from projects`) as { count: string }[];
  if (Number(countRows[0]?.count ?? 0) > 0) {
    _seedChecked = true;
    return { seeded: 0 };
  }

  let seeded = 0;
  for (let i = 0; i < seedProjects.length; i++) {
    const p = seedProjects[i];
    await sql`
      insert into projects (slug, data, featured, sort_order)
      values (
        ${p.slug},
        ${JSON.stringify(p)}::jsonb,
        ${p.featured ?? false},
        ${i}
      )
      on conflict (slug) do nothing
    `;
    seeded++;
  }
  _seedChecked = true;
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
  return (await sql`
    select slug, data, featured, sort_order, updated_at::text
    from projects
    order by featured desc, sort_order asc, updated_at desc
  `) as { slug: string; data: Project; featured: boolean; sort_order: number; updated_at: string }[];
}

export async function getProjectAdmin(slug: string): Promise<Project | null> {
  const sql = getSql();
  const rows = (await sql`select data from projects where slug = ${slug} limit 1`) as { data: Project }[];
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
      values (
        ${project.slug},
        ${JSON.stringify(project)}::jsonb,
        ${project.featured ?? false},
        0,
        ${adminId},
        now()
      )
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
