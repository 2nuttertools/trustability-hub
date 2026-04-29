"use server";

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

/**
 * NOTE: email/notification not wired yet. Submissions are logged to the server
 * console only. To deliver leads, wire up Resend (or similar) inside this
 * function — call sites and return shape stay the same.
 */
export async function submitLead(payload: LeadInput): Promise<SubmitLeadResult> {
  if (!payload.name?.trim() || !payload.phone?.trim()) {
    return { ok: false, error: "กรุณากรอกชื่อและเบอร์โทร" };
  }

  console.log("[lead]", {
    at: new Date().toISOString(),
    ...payload,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
  });

  return { ok: true };
}
