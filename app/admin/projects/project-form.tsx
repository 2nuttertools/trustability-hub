"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, AlertCircle, Check } from "lucide-react";
import { saveProjectAction } from "./actions";
import type { Project, ProjectType, ProjectStatus, HouseType } from "@/lib/data";

const PROJECT_TYPES: ProjectType[] = ["บ้านเดี่ยว", "ทาวน์โฮม", "คอนโด", "Luxury Villa", "Pool Villa"];
const PROJECT_STATUSES: ProjectStatus[] = ["พร้อมอยู่", "Pre-sale", "อยู่ระหว่างก่อสร้าง"];

export interface ProjectFormProps {
  initial?: Project;
  isEditing: boolean;
}

function emptyProject(): Project {
  return {
    slug: "",
    name: "",
    nameEn: "",
    developer: "",
    type: "บ้านเดี่ยว",
    status: "Pre-sale",
    location: "",
    district: "",
    province: "กรุงเทพมหานคร",
    priceFrom: 0,
    priceTo: 0,
    sizeFrom: 0,
    sizeTo: 0,
    bedrooms: [],
    bathrooms: [],
    parking: 1,
    units: 0,
    completionYear: new Date().getFullYear() + 1,
    cover: "",
    gallery: [],
    description: "",
    highlights: [],
    amenities: [],
    nearby: [],
    tags: [],
    rating: 5.0,
    reviews: 0,
    featured: false,
  };
}

export function ProjectForm({ initial, isEditing }: ProjectFormProps) {
  const [project, setProject] = useState<Project>(initial ?? emptyProject());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const update = <K extends keyof Project>(key: K, value: Project[K]) => {
    setProject((p) => ({ ...p, [key]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const r = await saveProjectAction(project);
          if (r.ok) {
            setSuccess(true);
            setTimeout(() => {
              if (!isEditing) router.push(`/admin/projects/${project.slug}/edit`);
              else router.refresh();
              setSuccess(false);
            }, 800);
          } else {
            setError(r.error);
          }
        });
      }}
      className="space-y-6"
    >
      {/* Basic Info */}
      <Section title="ข้อมูลพื้นฐาน">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug (URL)" required hint="ห้ามเปลี่ยนหลังจากสร้างแล้ว ใช้ในลิงก์ /projects/<slug>">
            <input
              type="text" required value={project.slug} disabled={isEditing}
              onChange={(e) => update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              placeholder="my-cool-project"
              className="input"
            />
          </Field>
          <Field label="Featured?" hint="แสดงโครงการเด่นในหน้าแรก">
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox" checked={project.featured ?? false}
                onChange={(e) => update("featured", e.target.checked)}
                className="w-4 h-4 rounded accent-brand-600"
              />
              <span className="text-sm">โครงการแนะนำ</span>
            </label>
          </Field>
          <Field label="ชื่อโครงการ (ไทย)" required>
            <input type="text" required value={project.name} onChange={(e) => update("name", e.target.value)} className="input" />
          </Field>
          <Field label="ชื่อโครงการ (English)" required>
            <input type="text" required value={project.nameEn} onChange={(e) => update("nameEn", e.target.value)} className="input" />
          </Field>
          <Field label="Developer" required>
            <input type="text" required value={project.developer} onChange={(e) => update("developer", e.target.value)} className="input" />
          </Field>
          <Field label="ประเภท" required>
            <select value={project.type} onChange={(e) => update("type", e.target.value as ProjectType)} className="input">
              {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="สถานะ" required>
            <select value={project.status} onChange={(e) => update("status", e.target.value as ProjectStatus)} className="input">
              {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="ปีที่สร้างเสร็จ">
            <input type="number" value={project.completionYear} onChange={(e) => update("completionYear", Number(e.target.value))} className="input" />
          </Field>
        </div>
      </Section>

      {/* Location */}
      <Section title="ทำเลที่ตั้ง">
        <div className="grid grid-cols-3 gap-4">
          <Field label="ทำเล" required>
            <input type="text" required value={project.location} onChange={(e) => update("location", e.target.value)} placeholder="เช่น สุขุมวิท 39" className="input" />
          </Field>
          <Field label="เขต/อำเภอ" required>
            <input type="text" required value={project.district} onChange={(e) => update("district", e.target.value)} className="input" />
          </Field>
          <Field label="จังหวัด" required>
            <input type="text" required value={project.province} onChange={(e) => update("province", e.target.value)} className="input" />
          </Field>
        </div>
      </Section>

      {/* Price & Size */}
      <Section title="ราคาและขนาด">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="ราคาเริ่มต้น (บาท)" required>
            <input type="number" required value={project.priceFrom} onChange={(e) => update("priceFrom", Number(e.target.value))} className="input" />
          </Field>
          <Field label="ราคาสูงสุด (บาท)">
            <input type="number" value={project.priceTo} onChange={(e) => update("priceTo", Number(e.target.value))} className="input" />
          </Field>
          <Field label="ขนาดเริ่ม (ตร.ม.)">
            <input type="number" value={project.sizeFrom} onChange={(e) => update("sizeFrom", Number(e.target.value))} className="input" />
          </Field>
          <Field label="ขนาดสูงสุด (ตร.ม.)">
            <input type="number" value={project.sizeTo} onChange={(e) => update("sizeTo", Number(e.target.value))} className="input" />
          </Field>
          <Field label="ห้องนอน (เช่น 1,2,3)">
            <input type="text" value={project.bedrooms.join(",")} onChange={(e) => update("bedrooms", parseNumberList(e.target.value))} className="input" />
          </Field>
          <Field label="ห้องน้ำ (เช่น 1,2,3)">
            <input type="text" value={project.bathrooms.join(",")} onChange={(e) => update("bathrooms", parseNumberList(e.target.value))} className="input" />
          </Field>
          <Field label="ที่จอดรถ (คัน)">
            <input type="number" value={project.parking} onChange={(e) => update("parking", Number(e.target.value))} className="input" />
          </Field>
          <Field label="จำนวนยูนิต">
            <input type="number" value={project.units} onChange={(e) => update("units", Number(e.target.value))} className="input" />
          </Field>
        </div>
      </Section>

      {/* Description */}
      <Section title="รายละเอียด">
        <Field label="คำอธิบายโครงการ" required>
          <textarea required rows={4} value={project.description} onChange={(e) => update("description", e.target.value)} className="input resize-y" />
        </Field>

        <Field label="โปรโมชั่น (ไม่บังคับ)">
          <input type="text" value={project.promotion ?? ""} onChange={(e) => update("promotion", e.target.value || undefined)} placeholder="เช่น ฟรีเฟอร์นิเจอร์ + ส่วนกลาง 5 ปี" className="input" />
        </Field>

        <Field label="Tags (คั่นด้วย ,)">
          <input type="text" value={project.tags.join(", ")} onChange={(e) => update("tags", parseStringList(e.target.value))} placeholder="Luxury, ใกล้ BTS, พร้อมเฟอร์" className="input" />
        </Field>
      </Section>

      {/* Images */}
      <Section title="รูปภาพ">
        <Field label="Cover image (URL)" required hint="รูปหลักที่แสดงในการ์ดและบนสุดของหน้า detail">
          <UrlField value={project.cover} onChange={(v) => update("cover", v)} required />
        </Field>

        <Field label="Gallery (URLs — แต่ละ URL คั่นด้วย enter)">
          <UrlList values={project.gallery} onChange={(v) => update("gallery", v)} />
        </Field>
      </Section>

      {/* Highlights, Amenities */}
      <Section title="จุดเด่น และสิ่งอำนวยความสะดวก">
        <Field label="จุดเด่น (แต่ละข้อคั่นด้วย enter)">
          <textarea rows={5} value={project.highlights.join("\n")} onChange={(e) => update("highlights", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))} className="input resize-y" />
        </Field>
        <Field label="สิ่งอำนวยความสะดวก (แต่ละข้อคั่นด้วย enter)">
          <textarea rows={5} value={project.amenities.join("\n")} onChange={(e) => update("amenities", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))} className="input resize-y" />
        </Field>
      </Section>

      {/* Nearby */}
      <Section title="สถานที่ใกล้เคียง">
        <NearbyEditor value={project.nearby} onChange={(v) => update("nearby", v)} />
      </Section>

      {/* House Types */}
      <Section title="แบบบ้าน (House Types)" hint="ถ้าโครงการมีหลายแบบบ้านให้เลือก จะสร้าง subpages อัตโนมัติที่ /projects/<slug>/<type-slug>">
        <HouseTypesEditor value={project.houseTypes ?? []} onChange={(v) => update("houseTypes", v.length === 0 ? undefined : v)} />
      </Section>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      <div className="sticky bottom-0 lg:bottom-4 -mx-6 lg:mx-0 px-6 lg:px-4 py-4 bg-white/95 backdrop-blur border-t border-border lg:border lg:rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {isEditing ? "การเปลี่ยนแปลงจะมีผลทันทีในเว็บหลัก" : "บันทึกแล้วจะไปที่หน้าแก้ไข"}
          </p>
          <button
            type="submit" disabled={pending}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {success ? "บันทึกแล้ว" : isEditing ? "บันทึกการเปลี่ยนแปลง" : "สร้างโครงการ"}
          </button>
        </div>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.625rem;
          border: 1px solid var(--border);
          background: rgba(241, 245, 249, 0.4);
          font-size: 0.875rem;
          transition: all 150ms;
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

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div className="mb-4">
        <h2 className="text-base font-bold">{title}</h2>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5 flex items-center gap-1">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
    </label>
  );
}

function UrlField({ value, onChange, required }: { value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div className="space-y-2">
      <input
        type="url" required={required} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="input"
      />
      {value && (
        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="w-16 h-12 object-cover rounded border border-border" onError={(e) => (e.currentTarget.style.display = "none")} />
          <span className="text-xs text-muted-foreground truncate flex-1">{value}</span>
        </div>
      )}
    </div>
  );
}

function UrlList({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {values.map((url, i) => (
        <div key={i} className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <input
            type="url" value={url}
            onChange={(e) => onChange(values.map((v, j) => (i === j ? e.target.value : v)))}
            className="input"
          />
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="w-12 h-9 object-cover rounded border border-border flex-shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />
          )}
          <button type="button" onClick={() => onChange(values.filter((_, j) => i !== j))}
            className="w-9 h-9 rounded-lg border border-border text-rose-600 hover:bg-rose-50 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...values, ""])}
        className="inline-flex items-center gap-1 text-xs text-brand-700 font-semibold hover:text-brand-900">
        <Plus className="w-3 h-3" /> เพิ่มรูป
      </button>
    </div>
  );
}

function NearbyEditor({ value, onChange }: { value: { name: string; distance: string; icon: string }[]; onChange: (v: { name: string; distance: string; icon: string }[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
          <input type="text" placeholder="ชื่อสถานที่" value={item.name}
            onChange={(e) => onChange(value.map((v, j) => i === j ? { ...v, name: e.target.value } : v))}
            className="input"
          />
          <input type="text" placeholder="ระยะ" value={item.distance}
            onChange={(e) => onChange(value.map((v, j) => i === j ? { ...v, distance: e.target.value } : v))}
            className="input w-32"
          />
          <select value={item.icon}
            onChange={(e) => onChange(value.map((v, j) => i === j ? { ...v, icon: e.target.value } : v))}
            className="input w-36"
          >
            <option value="train">train (BTS/MRT)</option>
            <option value="shopping-bag">shopping-bag (ห้าง)</option>
            <option value="school">school (โรงเรียน)</option>
            <option value="hospital">hospital (โรงพยาบาล)</option>
            <option value="tree">tree (สวน)</option>
            <option value="plane">plane (สนามบิน)</option>
            <option value="road">road (ทางด่วน)</option>
          </select>
          <button type="button" onClick={() => onChange(value.filter((_, j) => i !== j))}
            className="w-9 h-9 rounded-lg border border-border text-rose-600 hover:bg-rose-50 flex items-center justify-center">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, { name: "", distance: "", icon: "shopping-bag" }])}
        className="inline-flex items-center gap-1 text-xs text-brand-700 font-semibold hover:text-brand-900">
        <Plus className="w-3 h-3" /> เพิ่มสถานที่ใกล้เคียง
      </button>
    </div>
  );
}

function HouseTypesEditor({ value, onChange }: { value: HouseType[]; onChange: (v: HouseType[]) => void }) {
  return (
    <div className="space-y-3">
      {value.map((h, i) => (
        <div key={i} className="rounded-xl border border-border p-4 space-y-3 bg-muted/20">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold">แบบที่ {i + 1}: {h.name || "(ยังไม่ได้ตั้งชื่อ)"}</h4>
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> ลบแบบนี้
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label="Slug (URL)">
              <input type="text" value={h.slug} onChange={(e) => onChange(value.map((v, j) => j === i ? { ...v, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") } : v))} className="input" />
            </Field>
            <Field label="Name">
              <input type="text" value={h.name} onChange={(e) => onChange(value.map((v, j) => j === i ? { ...v, name: e.target.value } : v))} className="input" />
            </Field>
            <Field label="ขนาด (ตร.ม.)">
              <input type="number" value={h.size} onChange={(e) => onChange(value.map((v, j) => j === i ? { ...v, size: Number(e.target.value) } : v))} className="input" />
            </Field>
            <Field label="ยูนิต">
              <input type="number" value={h.units ?? 0} onChange={(e) => onChange(value.map((v, j) => j === i ? { ...v, units: Number(e.target.value) || undefined } : v))} className="input" />
            </Field>
            <Field label="ห้องนอน">
              <input type="number" value={h.bedrooms} onChange={(e) => onChange(value.map((v, j) => j === i ? { ...v, bedrooms: Number(e.target.value) } : v))} className="input" />
            </Field>
            <Field label="ห้องน้ำ">
              <input type="number" value={h.bathrooms} onChange={(e) => onChange(value.map((v, j) => j === i ? { ...v, bathrooms: Number(e.target.value) } : v))} className="input" />
            </Field>
            <Field label="ที่จอด">
              <input type="number" value={h.parking} onChange={(e) => onChange(value.map((v, j) => j === i ? { ...v, parking: Number(e.target.value) } : v))} className="input" />
            </Field>
            <Field label="Color theme">
              <select value={h.color ?? "from-brand-500 to-accent"} onChange={(e) => onChange(value.map((v, j) => j === i ? { ...v, color: e.target.value } : v))} className="input">
                <option value="from-brand-500 to-accent">น้ำเงิน (default)</option>
                <option value="from-emerald-500 to-teal-600">เขียว</option>
                <option value="from-blue-500 to-cyan-600">ฟ้า</option>
                <option value="from-amber-500 to-orange-600">ส้ม</option>
                <option value="from-purple-500 to-pink-600">ม่วง</option>
                <option value="from-rose-500 to-red-600">แดง</option>
              </select>
            </Field>
          </div>
          <Field label="Tagline">
            <input type="text" value={h.tagline} onChange={(e) => onChange(value.map((v, j) => j === i ? { ...v, tagline: e.target.value } : v))} className="input" />
          </Field>
          <Field label="คำอธิบาย">
            <textarea rows={2} value={h.description} onChange={(e) => onChange(value.map((v, j) => j === i ? { ...v, description: e.target.value } : v))} className="input resize-y" />
          </Field>
          <Field label="จุดเด่น (แต่ละข้อคั่น enter)">
            <textarea rows={3} value={h.highlights.join("\n")} onChange={(e) => onChange(value.map((v, j) => j === i ? { ...v, highlights: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) } : v))} className="input resize-y" />
          </Field>
          <Field label="Cover image (URL)">
            <UrlField value={h.cover} onChange={(val) => onChange(value.map((v, j) => j === i ? { ...v, cover: val } : v))} />
          </Field>
          <Field label="Floor plan (URL)">
            <UrlField value={h.floorPlan ?? ""} onChange={(val) => onChange(value.map((v, j) => j === i ? { ...v, floorPlan: val || undefined } : v))} />
          </Field>
          <Field label="Gallery">
            <UrlList values={h.gallery} onChange={(val) => onChange(value.map((v, j) => j === i ? { ...v, gallery: val } : v))} />
          </Field>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, {
        slug: "", name: "", tagline: "", size: 0, bedrooms: 4, bathrooms: 4, parking: 2,
        description: "", highlights: [], cover: "", gallery: [],
      }])}
        className="inline-flex items-center gap-1 text-sm text-brand-700 font-semibold hover:text-brand-900 px-3 py-2 border border-brand-200 rounded-lg hover:bg-brand-50">
        <Plus className="w-4 h-4" /> เพิ่มแบบบ้าน
      </button>
    </div>
  );
}

function parseNumberList(s: string): number[] {
  return s.split(",").map((x) => Number(x.trim())).filter((n) => !isNaN(n) && n > 0);
}

function parseStringList(s: string): string[] {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}
