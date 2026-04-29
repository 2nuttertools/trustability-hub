import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getProjects, getProjectSlugs } from "@/lib/data";
import { formatPriceFull } from "@/lib/utils";
import { ProjectGallery } from "@/components/project-gallery";
import { MortgageCalculator } from "@/components/mortgage-calculator";
import { ProjectDetailClient } from "@/components/project-detail-client";
import { HouseTypesSection } from "@/components/house-types-section";
import {
  MapPin, Bed, Bath, Maximize, Car, Calendar, Building2,
  Star, ArrowLeft, Share2, Heart, Home, Sparkles, ChevronRight,
} from "lucide-react";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getProjects();
  const related = all.filter((p) => p.slug !== slug && p.type === project.type).slice(0, 3);

  return (
    <div className="bg-gradient-to-b from-brand-50/30 to-white">
      {/* Breadcrumb / Back */}
      <div className="pt-24 lg:pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand-700 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> หน้าแรก
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/#projects" className="hover:text-brand-700">โครงการ</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate">{project.name}</span>
          </nav>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-brand-50 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center hover:bg-brand-50 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-brand-600">
                {project.developer}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                {project.status}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 font-semibold">
                {project.type}
              </span>
              {project.tags.map((t) => (
                <span key={t} className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-foreground/70">
                  #{t}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-2">
              {project.name}
            </h1>
            <p className="text-sm text-muted-foreground italic">{project.nameEn}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-foreground/70">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600" /> {project.location}, {project.district}, {project.province}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{project.rating}</span>
                <span className="text-muted-foreground">({project.reviews} รีวิว)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <ProjectGallery images={project.gallery} name={project.name} />

        {/* Promotion banner */}
        {project.promotion && (
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 p-1">
            <div className="rounded-[14px] bg-white p-4 lg:p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0">
                🎁
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider font-semibold text-orange-700 mb-0.5">
                  โปรโมชั่นพิเศษ Limited Offer
                </p>
                <p className="text-sm lg:text-base font-bold text-foreground">{project.promotion}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-10 mb-12 pb-32 lg:pb-12">
          {/* Left: Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick specs */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <SpecCard icon={Bed} label="ห้องนอน" value={`${project.bedrooms[0]}-${project.bedrooms[project.bedrooms.length-1]}`} unit="ห้อง" />
              <SpecCard icon={Bath} label="ห้องน้ำ" value={`${project.bathrooms[0]}-${project.bathrooms[project.bathrooms.length-1]}`} unit="ห้อง" />
              <SpecCard icon={Maximize} label="ขนาด" value={`${project.sizeFrom}-${project.sizeTo}`} unit="ตร.ม." />
              <SpecCard icon={Car} label="ที่จอดรถ" value={`${project.parking}+`} unit="คัน" />
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
                เกี่ยวกับโครงการ
              </h2>
              <p className="text-foreground/80 leading-relaxed">{project.description}</p>
            </section>

            {/* House Types — only for projects with multiple house variants */}
            {project.houseTypes && project.houseTypes.length > 0 && (
              <HouseTypesSection projectSlug={project.slug} houseTypes={project.houseTypes} />
            )}

            {/* Highlights */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
                จุดเด่นของโครงการ
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {project.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-border">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {i + 1}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{h}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
                สิ่งอำนวยความสะดวก
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 p-3 rounded-xl bg-white border border-border hover:border-brand-300 transition-colors">
                    <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span className="text-sm text-foreground/80">{a}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Nearby */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
                สถานที่ใกล้เคียง
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {project.nearby.map((n) => (
                  <div key={n.name} className="flex items-center justify-between p-4 rounded-xl bg-white border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{n.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                      {n.distance}
                    </span>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-4 aspect-[2/1] rounded-2xl bg-gradient-to-br from-brand-100 via-brand-50 to-accent/20 border border-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 50%, #3b82f6 0px, transparent 80px)," +
                      "radial-gradient(circle at 70% 30%, #06b6d4 0px, transparent 80px)," +
                      "linear-gradient(to right, #93c5fd 1px, transparent 1px)," +
                      "linear-gradient(to bottom, #93c5fd 1px, transparent 1px)",
                    backgroundSize: "auto, auto, 32px 32px, 32px 32px",
                  }}
                />
                <div className="relative text-center z-10">
                  <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto mb-3 shadow-2xl shadow-brand-600/40 pulse-ring">
                    <MapPin className="w-7 h-7 fill-white" />
                  </div>
                  <p className="font-semibold mb-1">{project.location}</p>
                  <p className="text-xs text-muted-foreground">เชื่อมต่อ Google Maps API ในเวอร์ชันจริง</p>
                </div>
              </div>
            </section>

            {/* Mortgage Calculator */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
                คำนวณสินเชื่อ
              </h2>
              <MortgageCalculator defaultPrice={project.priceFrom} />
            </section>

            {/* Project info table */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
                ข้อมูลโครงการ
              </h2>
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <InfoRow label="Developer" value={project.developer} />
                <InfoRow label="ประเภท" value={project.type} />
                <InfoRow label="จำนวนยูนิต" value={`${project.units} ยูนิต`} />
                <InfoRow label="ปีที่สร้างเสร็จ" value={`${project.completionYear}`} />
                <InfoRow label="ที่ตั้ง" value={`${project.location}, ${project.district}, ${project.province}`} />
                <InfoRow label="สถานะ" value={project.status} last />
              </div>
            </section>
          </div>

          {/* Right: Sticky sidebar */}
          <aside className="lg:sticky lg:top-28 self-start space-y-4">
            <div className="bg-white rounded-3xl border border-border shadow-xl overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-brand-50 to-white border-b border-border">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">ราคาเริ่มต้น</p>
                <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent leading-none">
                  {formatPriceFull(project.priceFrom)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ถึง {formatPriceFull(project.priceTo)}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 pt-3 border-t border-border/60">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">≈ CNY</p>
                    <p className="text-sm font-semibold">¥{((project.priceFrom * 0.21) / 10000).toFixed(0)}万</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">≈ USD</p>
                    <p className="text-sm font-semibold">${((project.priceFrom * 0.029) / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <ProjectDetailClient projectName={project.name} projectSlug={project.slug} />
              </div>
            </div>

            {/* Agent card */}
            <div className="bg-white rounded-3xl border border-border p-6 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">ที่ปรึกษาของคุณ</p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-bold text-xl">
                  ส
                </div>
                <div className="flex-1">
                  <p className="font-semibold">คุณสุชาติ ธีระวงศ์</p>
                  <p className="text-xs text-muted-foreground">Senior Property Consultant</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-1">4.95 (302 รีวิว)</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="font-bold text-brand-700">8</p>
                  <p className="text-[10px] text-muted-foreground">ปีประสบการณ์</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="font-bold text-brand-700">450+</p>
                  <p className="text-[10px] text-muted-foreground">ดีลที่ปิด</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="font-bold text-brand-700">TH/中文</p>
                  <p className="text-[10px] text-muted-foreground">ภาษา</p>
                </div>
              </div>
            </div>

            {/* Trust */}
            <div className="bg-gradient-to-br from-brand-700 to-brand-950 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-accent/30 blur-2xl" />
              <Building2 className="w-8 h-8 mb-3 text-accent relative" />
              <p className="font-bold mb-1 relative">Trustability Verified</p>
              <p className="text-xs text-white/70 leading-relaxed relative">
                โครงการนี้ได้รับการตรวจสอบจากทีมเรา ยืนยันข้อมูลและสถานะปัจจุบันแล้ว
                การันตี 100% โดย Trustability Hub
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="bg-gradient-to-b from-white to-brand-50/40 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8">โครงการที่คล้ายกัน</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-border hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-lg leading-tight">{p.name}</p>
                      <p className="text-white/80 text-xs">{p.location}</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">เริ่มต้น</p>
                      <p className="font-bold text-brand-700">{formatPriceFull(p.priceFrom)}</p>
                    </div>
                    <ArrowLeft className="w-5 h-5 rotate-180 text-brand-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile sticky CTA bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border p-3 z-30 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground uppercase">เริ่มต้น</p>
            <p className="text-lg font-bold text-brand-700">{formatPriceFull(project.priceFrom)}</p>
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
