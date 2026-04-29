"use server";

import { login } from "@/lib/auth";

export async function loginAction(input: { identifier: string; password: string }) {
  if (!input.identifier || !input.password) {
    return { ok: false as const, error: "กรุณากรอก username/email และรหัสผ่าน" };
  }
  return login(input.identifier, input.password);
}
