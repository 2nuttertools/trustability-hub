"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bed, Bath, Maximize, Car, Home } from "lucide-react";
import type { HouseType } from "@/lib/data";

export function HouseTypesSection({
  projectSlug,
  houseTypes,
}: {
  projectSlug: string;
  houseTypes: HouseType[];
}) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold mb-2">
            แบบบ้านให้เลือก {houseTypes.length} แบบ
          </p>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-brand-500 to-accent rounded-full" />
            เลือกแบบบ้านที่ใช่สำหรับคุณ
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {houseTypes.map((h, i) => (
          <motion.div
            key={h.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              href={`/projects/${projectSlug}/${h.slug}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-border hover:shadow-2xl hover:shadow-brand-600/10 hover:-translate-y-1 transition-all duration-500"
            >
              {/* Cover */}
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <Image
                  src={h.cover}
                  alt={h.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Top gradient strip */}
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${h.color ?? "from-brand-500 to-accent"}`} />

                {/* CTA arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-white group-hover:rotate-45 transition-all">
                  <ArrowUpRight className="w-5 h-5 text-white group-hover:text-brand-700" />
                </div>

                {/* Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[10px] tracking-[0.25em] opacity-80 uppercase mb-0.5">House Type</p>
                  <h3 className="text-3xl font-bold tracking-tight leading-none mb-1">{h.name}</h3>
                  <p className="text-xs opacity-90 line-clamp-1">{h.tagline}</p>
                </div>
              </div>

              {/* Specs row */}
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-4 gap-2 py-3 px-1 rounded-xl bg-brand-50/50">
                  <Spec icon={Maximize} value={`${h.size}`} unit="ตร.ม." />
                  <Spec icon={Bed} value={`${h.bedrooms}`} unit="นอน" />
                  <Spec icon={Bath} value={`${h.bathrooms}`} unit="น้ำ" />
                  <Spec icon={Car} value={`${h.parking}`} unit="คัน" />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Home className="w-3.5 h-3.5" />
                    {h.units ? `${h.units} ยูนิต` : "พร้อมจอง"}
                  </span>
                  <span className="font-semibold text-brand-700 group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                    ดูรายละเอียด <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Spec({ icon: Icon, value, unit }: { icon: React.ElementType; value: string; unit: string }) {
  return (
    <div className="text-center">
      <Icon className="w-4 h-4 text-brand-600 mx-auto mb-1" />
      <p className="text-base font-bold leading-none">{value}</p>
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{unit}</p>
    </div>
  );
}
