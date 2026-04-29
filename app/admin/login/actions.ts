"use server";

import { login } from "@/lib/auth";

export async function loginAction(input: { email: string; password: string }) {
  if (!input.email || !input.password) {
    return { ok: false as const, error: "กรุณากรอก email และรหัสผ่าน" };
  }
  return login(input.email, input.password);
}
