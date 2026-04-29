import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import bcrypt from "bcryptjs";
import { getSql, ensureSchema } from "./db";

export type AdminRole = "super-admin" | "admin";

export interface SessionData {
  userId?: string;
  email?: string;
  username?: string;
  displayName?: string;
  role?: AdminRole;
}

export interface AdminRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  display_name: string;
  role: AdminRole;
  created_at: string;
  last_login_at: string | null;
}

const SESSION_PASSWORD =
  process.env.SESSION_SECRET ||
  process.env.IRON_SESSION_PASSWORD ||
  "dev-only-insecure-password-please-set-SESSION_SECRET-in-production-min-32-chars";

const sessionOptions: SessionOptions = {
  password: SESSION_PASSWORD,
  cookieName: "th_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function getCurrentAdmin(): Promise<AdminRow | null> {
  const session = await getSession();
  if (!session.userId) return null;
  const sql = getSql();
  try {
    const rows = await sql<AdminRow[]>`
      select id, username, email, password_hash, display_name, role,
        created_at::text, last_login_at::text
      from admins where id = ${session.userId} limit 1
    `;
    return rows[0] ?? null;
  } catch (e) {
    // Likely missing username column on freshly-deployed migration.
    // Run schema migration once and retry.
    const msg = (e as Error).message ?? "";
    if (msg.includes("column") && msg.includes("username")) {
      await ensureSchema();
      const rows = await sql<AdminRow[]>`
        select id, username, email, password_hash, display_name, role,
          created_at::text, last_login_at::text
        from admins where id = ${session.userId} limit 1
      `;
      return rows[0] ?? null;
    }
    throw e;
  }
}

/**
 * Login by username OR email — both work.
 * Identifier is matched case-insensitively.
 */
export async function login(identifier: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const id = identifier.toLowerCase().trim();
  if (!id || !password) {
    return { ok: false, error: "กรุณากรอก username/email และรหัสผ่าน" };
  }
  // Ensure the username column exists for tables created before that migration.
  // Idempotent — only does work the first time.
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<AdminRow[]>`
    select id, username, email, password_hash, display_name, role,
      created_at::text, last_login_at::text
    from admins
    where lower(username) = ${id} or lower(email) = ${id}
    limit 1
  `;
  const admin = rows[0];
  if (!admin) return { ok: false, error: "username หรือรหัสผ่านไม่ถูกต้อง" };
  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) return { ok: false, error: "username หรือรหัสผ่านไม่ถูกต้อง" };

  const session = await getSession();
  session.userId = admin.id;
  session.email = admin.email;
  session.username = admin.username;
  session.displayName = admin.display_name;
  session.role = admin.role;
  await session.save();

  await sql`update admins set last_login_at = now() where id = ${admin.id}`;
  return { ok: true };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}

const USERNAME_RE = /^[a-z0-9_.-]{3,32}$/;

export async function createAdmin(input: {
  username: string;
  email: string;
  password: string;
  displayName: string;
  role: AdminRole;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const username = input.username.toLowerCase().trim();
  const email = input.email.toLowerCase().trim();
  if (!username || !email || !input.password || !input.displayName) {
    return { ok: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }
  if (!USERNAME_RE.test(username)) {
    return { ok: false, error: "Username ใช้ได้แค่ a-z, 0-9, _ . - (3-32 ตัว)" };
  }
  if (input.password.length < 8) {
    return { ok: false, error: "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร" };
  }
  const hash = await bcrypt.hash(input.password, 10);
  const sql = getSql();
  try {
    const rows = await sql<{ id: string }[]>`
      insert into admins (username, email, password_hash, display_name, role)
      values (${username}, ${email}, ${hash}, ${input.displayName.trim()}, ${input.role})
      returning id
    `;
    return { ok: true, id: rows[0].id };
  } catch (e) {
    const err = e as { code?: string; message?: string; constraint_name?: string };
    if (err.code === "23505") {
      const which = err.constraint_name?.includes("username") ? "Username" : "Email";
      return { ok: false, error: `${which}นี้มีในระบบอยู่แล้ว` };
    }
    console.error("[createAdmin]", err);
    return { ok: false, error: "สร้างไม่สำเร็จ กรุณาลองใหม่" };
  }
}

export async function listAdmins(): Promise<Omit<AdminRow, "password_hash">[]> {
  const sql = getSql();
  const rows = await sql<AdminRow[]>`
    select id, username, email, password_hash, display_name, role,
      created_at::text, last_login_at::text
    from admins order by created_at asc
  `;
  return rows.map(({ password_hash: _ph, ...rest }) => rest);
}

export async function deleteAdmin(id: string): Promise<void> {
  const sql = getSql();
  await sql`delete from admins where id = ${id}`;
}

export async function resetAdminPassword(id: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
  if (newPassword.length < 8) {
    return { ok: false, error: "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร" };
  }
  const hash = await bcrypt.hash(newPassword, 10);
  const sql = getSql();
  await sql`update admins set password_hash = ${hash} where id = ${id}`;
  return { ok: true };
}
