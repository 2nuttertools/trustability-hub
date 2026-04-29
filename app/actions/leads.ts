"use server";

import { ensureSchema, getSql, isDbConfigured } from "@/lib/db";

export interface LeadInput {
  name: string;
  phone: string;
  email?: string | null;
  budget?: string | null;
  message?: string | null;
  source?: string;
  project_slug?: string | null;
}

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitLead(payload: LeadInput): Promise<SubmitLeadResult> {
  if (!payload.name?.trim() || !payload.phone?.trim()) {
    return { ok: false, error: "กรุณากรอกชื่อและเบอร์โทร" };
  }

  if (!isDbConfigured) {
    console.log("[lead/no-db]", payload);
    return { ok: true };
  }

  try {
    await ensureSchema();
    const sql = getSql();
    await sql`
      insert into leads (name, phone, email, budget, message, project_slug, source)
      values (
        ${payload.name.trim()},
        ${payload.phone.trim()},
        ${payload.email?.trim() || null},
        ${payload.budget?.trim() || null},
        ${payload.message?.trim() || null},
        ${payload.project_slug ?? null},
        ${payload.source ?? "website"}
      )
    `;
    return { ok: true };
  } catch (e) {
    console.error("[lead/insert] error:", e);
    return { ok: false, error: "ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่" };
  }
}
