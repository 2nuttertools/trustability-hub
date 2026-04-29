"use server";

import { ensureSchema, hasAnyAdmin } from "@/lib/db";
import { createAdmin } from "@/lib/auth";

export async function runSetup(input: {
  displayName: string;
  username: string;
  email: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  await ensureSchema();
  if (await hasAnyAdmin()) {
    return { ok: false, error: "ระบบตั้งค่าแล้ว — โปรดไปหน้า Login" };
  }
  const result = await createAdmin({
    username: input.username,
    email: input.email,
    password: input.password,
    displayName: input.displayName,
    role: "super-admin",
  });
  if (!result.ok) return result;
  return { ok: true };
}
