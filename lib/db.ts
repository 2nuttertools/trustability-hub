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
 * Idempotent schema setup. Cached per Lambda lifetime — once a function instance
 * has run it, subsequent calls are free.
 *
 * Note: Vercel cold-start spawns a fresh instance, so the first request after
 * inactivity still pays the schema-init cost. The DDL statements are no-ops
 * once tables exist, so the cost is mostly Postgres round-trips (~100-300ms).
 */
let _schemaPromise: Promise<void> | null = null;
export function ensureSchema(): Promise<void> {
  if (_schemaPromise) return _schemaPromise;
  _schemaPromise = (async () => {
    try {
      await runSchemaSetup();
    } catch (e) {
      _schemaPromise = null; // allow retry on transient failures
      throw e;
    }
  })();
  return _schemaPromise;
}

async function runSchemaSetup(): Promise<void> {
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
  // Backfill: add username column to existing tables. For existing admins, default
  // username = part of email before "@", or whole email if no @.
  await sql`alter table admins add column if not exists username text`;
  await sql`
    update admins set username = lower(split_part(email, '@', 1))
    where username is null
  `;
  // Make non-null + unique only after backfill so first migration works.
  await sql`alter table admins alter column username set not null`;
  await sql`create unique index if not exists admins_username_idx on admins (lower(username))`;
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

  await sql`
    create table if not exists projects (
      slug         text primary key,
      data         jsonb not null,
      featured     boolean not null default false,
      sort_order   int not null default 0,
      created_at   timestamptz not null default now(),
      updated_at   timestamptz not null default now(),
      updated_by   uuid references admins(id) on delete set null
    );
  `;
  await sql`create index if not exists projects_featured_idx on projects (featured) where featured;`;
  await sql`create index if not exists projects_sort_idx on projects (sort_order, updated_at desc);`;

  await sql`
    create table if not exists articles (
      slug         text primary key,
      data         jsonb not null,
      published_at date not null default current_date,
      created_at   timestamptz not null default now(),
      updated_at   timestamptz not null default now(),
      updated_by   uuid references admins(id) on delete set null
    );
  `;
  await sql`create index if not exists articles_pub_idx on articles (published_at desc);`;
}

export async function hasAnyProject(): Promise<boolean> {
  const sql = getSql();
  const rows = await sql<{ count: string }[]>`select count(*)::text as count from projects`;
  return Number(rows[0]?.count ?? 0) > 0;
}

export async function hasAnyAdmin(): Promise<boolean> {
  const sql = getSql();
  const rows = await sql<{ count: string }[]>`select count(*)::text as count from admins`;
  return Number(rows[0]?.count ?? 0) > 0;
}
