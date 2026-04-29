import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getHouseType, getHouseTypeParams } from "@/lib/data";
import { formatPriceFull } from "@/lib/utils";
import { ProjectGallery } from "@/components/project-gallery";
import { ProjectDetailClient } from "@/components/project-detail-client";
import {
  Bed, Bath, Maximize, Car, Home, ChevronRight, Sparkles,
  ArrowLeft, Star, Building2,
} from "lucide-react";

export const revalidate = 60;

export async function generateStaticParams() {
  return await getHouseTypeParams();
}

export default async function HouseTypePage(props: PageProps<"/projects/[slug]/[type]">) {
  const { slug, type } = await props.params;
  const result = await getHouseType(slug, type);
  if (!result) notFound();
  const { project, houseType: h } = result;

  // Sibling house types for the "explore other types" section
  const siblings = (project.houseTypes ?? []).filter((t) => t.slug !== h.slug);

  return (
    <div className="bg-gradient-to-b from-brand-50/30 to-white">
      <div className="pt-24 lg:pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-brand-700 flex items-center gap-1 flex-shrink-0">
            <Home className="w-3.5 h-3.5" /> หน้าแรก
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href="/#projects" className="hover:text-brand-700 flex-shrink-0">โครงการ</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href={`/projects/${project.slug}`} className="hover:text-brand-700 truncate">
            {project.name}
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-foreground font-medium flex-shrink-0">แบบบ้าน {h.name}</span>
        </nav>

        {/* Title */}
        <div className="mb-6">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-semibold hover:gap-2 transition-all mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            กลับสู่โครงการ {project.name}
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${h.color ?? "from-brand-500 to-accent"} text-white text-xs font-bold uppercase tracking-wider shadow-md`}>
              <Sparkles className="w-3 h-3" />
              House Type
            </span>
            <span className="text-xs text-muted-foreground">โดย {project.developer}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none mb-3">
            {h.name}
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground italic">"{h.tagline}"</p>
        </div>

        {/* Gallery */}
        <ProjectGallery images={h.gallery} name={`${project.name} ${h.name}`} />

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-10 mb-12 pb-32 lg:pb-12">
          {/* Left: Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Specs */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <SpecCard icon={Maximize} label="ขนาด" value={`${h.size}`} unit="ตร.ม." />
              <SpecCard icon={Bed} label="ห้องนอน" value={`${h.bedrooms}`} unit="ห้อง" />
              <SpecCard icon={Bath} label="ห้องน้ำ" value={`${h.bathrooms}`} unit="ห้อง" />
              <SpecCard icon={Car} label="ที่จอดรถ" value={`${h.parking}`} unit="คัน" />
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
                เกี่ยวกับแบบบ้าน {h.name}
              </h2>
              <p className="text-foreground/80 leading-relaxed text-base">{h.description}</p>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
                จุดเด่นของแบบนี้
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {h.highlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-border">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${h.color ?? "from-brand-500 to-accent"} text-white flex items-center justify-center flex-shrink-0 font-bold text-sm`}>
                      {i + 1}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{hl}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Floor Plan */}
            {h.floorPlan && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
                  ผังพื้น (Floor Plan)
                </h2>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-white border border-border shadow-sm">
                  <Image
                    src={h.floorPlan}
                    alt={`${h.name} floor plan`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-contain"
                  />
                </div>
              </section>
            )}

            {/* Configuration table */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
                การจัดสรรพื้นที่
              </h2>
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <InfoRow label="ขนาดพื้นที่ใช้สอย" value={`${h.size} ตร.ม.`} />
                <InfoRow label="ห้องนอน" value={`${h.bedrooms} ห้อง`} />
                <InfoRow label="ห้องน้ำ" value={`${h.bathrooms} ห้อง`} />
                {h.livingRooms && <InfoRow label="ห้องนั่งเล่น" value={`${h.livingRooms} ห้อง`} />}
                {h.kitchens && <InfoRow label="ครัว" value={`${h.kitchens} ห้อง`} />}
                <InfoRow label="ที่จอดรถ" value={`${h.parking} คัน`} />
                {h.units && <InfoRow label="จำนวนยูนิต (ทั้งโครงการ)" value={`${h.units} ยูนิต`} last />}
              </div>
            </section>

            {/* Sibling house types */}
            {siblings.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
                  เปรียบเทียบกับแบบอื่น
                </h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {siblings.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/projects/${project.slug}/${s.slug}`}
                      className="group relative block rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image src={s.cover} alt={s.name} fill sizes="33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${s.color ?? "from-brand-500 to-accent"}`} />
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <p className="text-xl font-bold leading-none">{s.name}</p>
                          <p className="text-xs opacity-80 mt-1">{s.size} ตร.ม.</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Sticky sidebar */}
          <aside className="lg:sticky lg:top-28 self-start space-y-4">
            <div className="bg-white rounded-3xl border border-border shadow-xl overflow-hidden">
              <div className={`p-6 bg-gradient-to-br ${h.color ?? "from-brand-500 to-brand-700"} text-white relative overflow-hidden`}>
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-80 font-semibold relative">โครงการ</p>
                <p className="text-sm font-medium opacity-90 relative">{project.name}</p>
                <h3 className="text-3xl font-bold mt-2 leading-none relative">{h.name}</h3>
                <p className="text-xs opacity-80 mt-1 relative">{h.size} ตร.ม. • {h.bedrooms} ห้องนอน • ที่จอด {h.parking} คัน</p>
              </div>

              <div className="p-6 border-b border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">ราคาเริ่มต้นโครงการ</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent leading-none">
                  {formatPriceFull(project.priceFrom)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ติดต่อเจ้าหน้าที่เพื่อรับราคาแบบ {h.name}
                </p>
              </div>

              <div className="p-6 space-y-3">
                <ProjectDetailClient
                  projectName={`${project.name} - แบบ ${h.name}`}
                  projectSlug={`${project.slug}/${h.slug}`}
                />
              </div>
            </div>

            {/* Trust */}
            <div className="bg-gradient-to-br from-brand-700 to-brand-950 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent/30 blur-2xl" />
              <Building2 className="w-8 h-8 mb-3 text-accent relative" />
              <p className="font-bold mb-1 relative">Trustability Verified</p>
              <p className="text-xs text-white/70 leading-relaxed relative">
                แบบบ้านนี้ได้รับการตรวจสอบจากทีมเรา
                ยืนยันข้อมูลล่าสุดจาก {project.developer} แล้ว
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border p-3 z-30 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase">แบบ {h.name}</p>
            <p className="text-base font-bold text-brand-700">{h.size} ตร.ม.</p>
          </div>
          <Link
            href="tel:+66800000000"
            className="px-4 py-2.5 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold border border-brand-200"
          >
            โทร
          </Link>
          <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-800 text-white text-sm font-semibold shadow-lg">
            นัดชม
          </button>
        </div>
      </div>
    </div>
  );
}

function SpecCard({ icon: Icon, label, value, unit }: { icon: React.ElementType; label: string; value: string; unit: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-border text-center">
      <Icon className="w-5 h-5 text-brand-600 mx-auto mb-2" />
      <p className="text-2xl font-bold leading-none">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{unit}</p>
      <p className="text-xs text-foreground/60 mt-0.5">{label}</p>
    </div>
  );
}

function InfoRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-5 py-3.5 ${!last ? "border-b border-border" : ""}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-right">{value}</span>
    </div>
  );
}
