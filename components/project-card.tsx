"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Maximize, Heart, Star } from "lucide-react";
import { type Project } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

const statusColors: Record<string, string> = {
  "พร้อมอยู่": "bg-emerald-500",
  "Pre-sale": "bg-amber-500",
  "อยู่ระหว่างก่อสร้าง": "bg-blue-500",
};

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-border/60 shadow-sm hover:shadow-2xl hover:shadow-brand-600/10 transition-all duration-500"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={project.cover}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <span className={`${statusColors[project.status]} text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg`}>
                {project.status}
              </span>
              {project.promotion && (
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg max-w-[160px] truncate">
                  🎁 โปรพิเศษ
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                setLiked(!liked);
              }}
              className="w-9 h-9 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-rose-500 text-rose-500" : "text-white"}`} />
            </button>
          </div>

          {/* Bottom info on image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="flex items-center gap-1 text-xs text-white">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{project.rating}</span>
              <span className="text-white/70">({project.reviews})</span>
            </div>
            <span className="text-[10px] text-white/80 font-medium px-2 py-1 rounded-full glass-dark">
              {project.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <p className="text-[11px] tracking-wider uppercase text-brand-600 font-semibold mb-1">
              {project.developer}
            </p>
            <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-brand-700 transition-colors">
              {project.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{project.location}, {project.province}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-4 text-xs text-foreground/70 py-2 border-y border-border/60">
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-brand-600" />
              <span>{project.bedrooms[0]}-{project.bedrooms[project.bedrooms.length - 1]} นอน</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-brand-600" />
              <span>{project.bathrooms[0]}+ น้ำ</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-3.5 h-3.5 text-brand-600" />
              <span>{project.sizeFrom}-{project.sizeTo} ตร.ม.</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">เริ่มต้น</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
                {formatPrice(project.priceFrom)}
              </p>
            </div>
            <div className="text-right text-[10px] text-muted-foreground">
              <p>≈ {formatPrice(project.priceFrom, "CNY")}</p>
              <p>≈ {formatPrice(project.priceFrom, "USD")}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
