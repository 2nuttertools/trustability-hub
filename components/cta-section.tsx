"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { LeadForm } from "./lead-form";

export function CtaSection() {
  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 p-10 lg:p-16"
        >
          {/* Decorative shapes */}
          <div className="absolute inset-0 opacity-50">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-brand-400/20 blur-3xl" />
          </div>
          <div className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                เริ่มต้นวันนี้ ฟรี ไม่มีค่าใช้จ่าย
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
                พร้อมหาบ้านในฝัน<br />
                <span className="bg-gradient-to-r from-accent to-brand-200 bg-clip-text text-transparent">
                  ที่ใช่สำหรับคุณ?
                </span>
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg">
                ปรึกษาที่ปรึกษาผู้เชี่ยวชาญของเราฟรี
                เราจะช่วยคุณค้นหา เปรียบเทียบ และตัดสินใจอย่างมั่นใจ
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-brand-900 font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  <span>นัดที่ปรึกษาฟรี</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="tel:+66800000000"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>080-000-0000</span>
                </Link>
              </div>
            </div>

            {/* Right side - Lead form */}
            <LeadForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
