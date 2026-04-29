import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import bcrypt from "bcryptjs";
import { getSql } from "./db";

export type AdminRole = "super-admin" | "admin";

export interface SessionData {
  userId?: string;
  email?: string;
  displayName?: string;
  role?: AdminRole;
}

export interface AdminRow {
  id: string;
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
  const rows = await sql<AdminRow[]>`
    select id, email, password_hash, display_name, role, created_at::text, last_login_at::text
    from admins where id = ${session.userId} limit 1
  `;
  return rows[0] ?? null;
}

export async function login(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const sql = getSql();
  const rows = await sql<AdminRow[]>`
    select id, email, password_hash, display_name, role, created_at::text, last_login_at::text
    from admins where email = ${email.toLowerCase().trim()} limit 1
  `;
  const admin = rows[0];
  if (!admin) return { ok: false, error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) return { ok: false, error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };

  const session = await getSession();
  session.userId = admin.id;
  session.email = admin.email;
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

export async function createAdmin(input: {
  email: string;
  password: string;
  displayName: string;
  role: AdminRole;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const email = input.email.toLowerCase().trim();
  if (!email || !input.password || !input.displayName) {
    return { ok: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }
  if (input.password.length < 8) {
    return { ok: false, error: "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร" };
  }
  const hash = await bcrypt.hash(input.password, 10);
  const sql = getSql();
  try {
    const rows = await sql<{ id: string }[]>`
      insert into admins (email, password_hash, display_name, role)
      values (${email}, ${hash}, ${input.displayName.trim()}, ${input.role})
      returning id
    `;
    return { ok: true, id: rows[0].id };
  } catch (e) {
    const err = e as { code?: string; message?: string };
    if (err.code === "23505") {
      return { ok: false, error: "อีเมลนี้มีในระบบอยู่แล้ว" };
    }
    console.error("[createAdmin]", err);
    return { ok: false, error: "สร้างไม่สำเร็จ กรุณาลองใหม่" };
  }
}

export async function listAdmins(): Promise<Omit<AdminRow, "password_hash">[]> {
  const sql = getSql();
  const rows = await sql<AdminRow[]>`
    select id, email, password_hash, display_name, role,
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
