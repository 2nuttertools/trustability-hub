"use client";

import { Calendar, MessageCircle, Phone, FileDown, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions/leads";

export function ProjectDetailClient({ projectName, projectSlug }: { projectName: string; projectSlug?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button className="w-full bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 text-white font-semibold py-3.5 rounded-xl shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
        <Calendar className="w-4 h-4" />
        นัดชมโครงการ ฟรี
      </button>

      <div className="grid grid-cols-2 gap-2">
        <a
          href="tel:+66800000000"
          className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border hover:border-brand-400 hover:bg-brand-50 text-sm font-semibold transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-brand-600" />
          โทร
        </a>
        <button className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border hover:border-emerald-400 hover:bg-emerald-50 text-sm font-semibold transition-colors">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          แชต
        </button>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/50 hover:bg-muted text-sm font-semibold transition-colors">
        <FileDown className="w-4 h-4" />
        ดาวน์โหลด Brochure
      </button>

      {/* Mini lead form */}
      <div className="mt-4 pt-5 border-t border-border">
        <p className="text-sm font-semibold mb-3">หรือกรอกข้อมูลให้เราติดต่อกลับ</p>
        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-sm font-semibold text-emerald-800 mb-1">✓ ส่งข้อมูลเรียบร้อย</p>
            <p className="text-xs text-emerald-700">ทีมงานจะติดต่อกลับใน 15 นาที</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              startTransition(async () => {
                const result = await submitLead({
                  name,
                  phone,
                  project_slug: projectSlug ?? null,
                  source: "project-detail",
                  message: `สนใจโครงการ ${projectName}`,
                });
                if (result.ok) setSubmitted(true);
                else setError(result.error);
              });
            }}
            className="space-y-2"
          >
            <input
              type="text" required placeholder="ชื่อ-นามสกุล"
              value={name} onChange={(e) => setName(e.target.value)}
              disabled={pending}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm disabled:opacity-50"
            />
            <input
              type="tel" required placeholder="เบอร์โทรศัพท์"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              disabled={pending}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm disabled:opacity-50"
            />
            {error && <p className="text-xs text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-2.5 rounded-lg bg-foreground text-white text-sm font-semibold hover:bg-brand-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              ขอข้อมูลโครงการ
            </button>
          </form>
        )}
      </div>
    </>
  );
}
