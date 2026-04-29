"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Check, AlertCircle } from "lucide-react";
import { saveArticleAction } from "./actions";
import type { Article } from "@/lib/data";

const categories = ["คู่มือลงทุน", "Foreign Buyer", "รีวิวโครงการ", "ข่าวอสังหาฯ", "Tips & Guide"];

function emptyArticle(): Article {
  return {
    slug: "",
    title: "",
    excerpt: "",
    cover: "",
    category: "คู่มือลงทุน",
    readTime: "5 นาที",
    date: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }),
  };
}

export function ArticleForm({ initial, isEditing }: { initial?: Article; isEditing: boolean }) {
  const [a, setA] = useState<Article>(initial ?? emptyArticle());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const update = <K extends keyof Article>(k: K, v: Article[K]) => setA((p) => ({ ...p, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const r = await saveArticleAction(a);
          if (r.ok) {
            setSuccess(true);
            setTimeout(() => {
              if (!isEditing) router.push(`/admin/articles/${a.slug}/edit`);
              else router.refresh();
              setSuccess(false);
            }, 800);
          } else setError(r.error);
        });
      }}
      className="space-y-5"
    >
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <Field label="Slug (URL)" required hint="ห้ามเปลี่ยนหลังสร้างแล้ว">
          <input type="text" required disabled={isEditing} value={a.slug} onChange={(e) => update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} className="input" placeholder="my-cool-article" />
        </Field>
        <Field label="Title" required>
          <input type="text" required value={a.title} onChange={(e) => update("title", e.target.value)} className="input" />
        </Field>
        <Field label="Excerpt (ข้อความสั้นๆ ที่แสดงในการ์ด)" required>
          <textarea required rows={3} value={a.excerpt} onChange={(e) => update("excerpt", e.target.value)} className="input resize-y" />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="หมวดหมู่" required>
            <input type="text" required list="categories" value={a.category} onChange={(e) => update("category", e.target.value)} className="input" />
            <datalist id="categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </Field>
          <Field label="Read time">
            <input type="text" value={a.readTime} onChange={(e) => update("readTime", e.target.value)} className="input" placeholder="8 นาที" />
          </Field>
          <Field label="Date">
            <input type="text" value={a.date} onChange={(e) => update("date", e.target.value)} className="input" placeholder="25 เม.ย. 2026" />
          </Field>
        </div>
        <Field label="Cover image (URL)" required>
          <input type="url" required value={a.cover} onChange={(e) => update("cover", e.target.value)} className="input" />
          {a.cover && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.cover} alt="" className="w-48 aspect-[16/10] object-cover rounded-lg border border-border" onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
          )}
        </Field>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50">
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {success ? "บันทึกแล้ว" : isEditing ? "บันทึกการเปลี่ยนแปลง" : "สร้างบทความ"}
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.625rem;
          border: 1px solid var(--border);
          background: rgba(241, 245, 249, 0.4);
          font-size: 0.875rem;
        }
        :global(.input:focus) {
          outline: none;
          background: white;
          border-color: var(--brand-400);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        :global(.input:disabled) { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </form>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5 flex items-center gap-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
    </label>
  );
}
