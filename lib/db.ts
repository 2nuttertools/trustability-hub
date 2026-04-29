import postgres from "postgres";

const url = process.env.DATABASE_URL;

let _sql: postgres.Sql | null = null;

export function getSql(): postgres.Sql {
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Provision a Postgres database (Neon recommended) and add the URL to your environment.",
    );
  }
  if (!_sql) {
    _sql = postgres(url, {
      ssl: "require",
      max: 5,
      idle_timeout: 30,
      connect_timeout: 10,
    });
  }
  return _sql;
}

export const isDbConfigured = Boolean(url);

/**
 * Idempotent schema setup. Safe to call multiple times.
 * Triggered automatically on first /admin/setup hit.
 */
export async function ensureSchema(): Promise<void> {
  const sql = getSql();
  await sql`
    create table if not exists admins (
      id           uuid primary key default gen_random_uuid(),
      email        text unique not null,
      password_hash text not null,
      display_name text not null,
      role         text not null default 'admin',
      created_at   timestamptz not null default now(),
      last_login_at timestamptz
    );
  `;
  await sql`
    create table if not exists leads (
      id           uuid primary key default gen_random_uuid(),
      name         text not null,
      phone        text not null,
      email        text,
      budget       text,
      message      text,
      project_slug text,
      source       text default 'website',
      status       text not null default 'new',
      notes        text,
      created_at   timestamptz not null default now(),
      updated_at   timestamptz not null default now()
    );
  `;
  await sql`create index if not exists leads_status_idx on leads (status);`;
  await sql`create index if not exists leads_created_idx on leads (created_at desc);`;
}

export async function hasAnyAdmin(): Promise<boolean> {
  const sql = getSql();
  const rows = await sql<{ count: string }[]>`select count(*)::text as count from admins`;
  return Number(rows[0]?.count ?? 0) > 0;
}
