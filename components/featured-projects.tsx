"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Project } from "@/lib/data";
import { ProjectCard } from "./project-card";
import Link from "next/link";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs text-brand-700 font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>โครงการแนะนำ Featured</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              โครงการพรีเมียม<br />
              <span className="bg-gradient-to-r from-brand-700 to-accent bg-clip-text text-transparent">
                ที่คัดสรรมาเพื่อคุณ
              </span>
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              คัดเลือกจากโครงการคุณภาพระดับ Top 1% ทั่วประเทศ —
              ทั้งคอนโดใจกลางเมือง บ้านลักชัวรี่ และวิลล่าริมทะเล
            </p>
          </motion.div>

          <Link
            href="#"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900 self-start lg:self-end"
          >
            <span>ดูทั้งหมด {projects.length * 100}+ โครงการ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-2">
          {["ทั้งหมด", "ใจกลางเมือง", "ใกล้รถไฟฟ้า", "Pool Villa", "Pre-sale", "พร้อมอยู่", "Investment", "Luxury"].map((f, i) => (
            <button
              key={f}
              className={`flex-shrink-0 px-5 py-2.5 text-sm font-medium rounded-full transition-all ${
                i === 0
                  ? "bg-brand-900 text-white shadow-lg shadow-brand-900/20"
                  : "bg-white border border-border hover:border-brand-400 hover:text-brand-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
