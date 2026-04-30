import { getSql } from "@/lib/db";

export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "lost";

export interface LeadRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  budget: string | null;
  message: string | null;
  project_slug: string | null;
  source: string;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function listLeads(filter?: { status?: LeadStatus | "all"; search?: string }): Promise<LeadRow[]> {
  const sql = getSql();
  const status = filter?.status && filter.status !== "all" ? filter.status : null;
  const search = filter?.search?.trim() || null;

  if (status && search) {
    return (await sql`
      select id, name, phone, email, budget, message, project_slug, source,
        status, notes, created_at::text, updated_at::text
      from leads
      where status = ${status}
        and (name ilike ${"%" + search + "%"} or phone ilike ${"%" + search + "%"} or email ilike ${"%" + search + "%"})
      order by created_at desc
      limit 500
    `) as LeadRow[];
  }
  if (status) {
    return (await sql`
      select id, name, phone, email, budget, message, project_slug, source,
        status, notes, created_at::text, updated_at::text
      from leads
      where status = ${status}
      order by created_at desc
      limit 500
    `) as LeadRow[];
  }
  if (search) {
    return (await sql`
      select id, name, phone, email, budget, message, project_slug, source,
        status, notes, created_at::text, updated_at::text
      from leads
      where (name ilike ${"%" + search + "%"} or phone ilike ${"%" + search + "%"} or email ilike ${"%" + search + "%"})
      order by created_at desc
      limit 500
    `) as LeadRow[];
  }
  return (await sql`
    select id, name, phone, email, budget, message, project_slug, source,
      status, notes, created_at::text, updated_at::text
    from leads
    order by created_at desc
    limit 500
  `) as LeadRow[];
}

export async function getLeadStats(): Promise<Record<LeadStatus | "total", number>> {
  const sql = getSql();
  const rows = (await sql`
    select status, count(*)::text as c from leads group by status
  `) as { status: LeadStatus; c: string }[];
  const stats: Record<LeadStatus | "total", number> = {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    closed: 0,
    lost: 0,
  };
  for (const r of rows) {
    stats[r.status] = Number(r.c);
    stats.total += Number(r.c);
  }
  return stats;
}

export async function updateLeadStatus(id: string, status: LeadStatus, notes?: string | null): Promise<void> {
  const sql = getSql();
  if (notes !== undefined) {
    await sql`update leads set status = ${status}, notes = ${notes}, updated_at = now() where id = ${id}`;
  } else {
    await sql`update leads set status = ${status}, updated_at = now() where id = ${id}`;
  }
}

export async function deleteLead(id: string): Promise<void> {
  const sql = getSql();
  await sql`delete from leads where id = ${id}`;
}
