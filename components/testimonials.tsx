"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/data";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold mb-3">
              เสียงจากลูกค้าจริง
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
              12,000+ ครอบครัว<br />
              <span className="text-brand-700">ไว้วางใจให้เราดูแล</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              ทุกคำชมและคำติชมจากลูกค้าคือเชื้อเพลิงให้เราพัฒนาบริการที่ดีขึ้น
              เราภูมิใจที่ได้เป็นส่วนหนึ่งของช่วงเวลาสำคัญในชีวิตคุณ
            </p>

            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-3xl font-bold">4.9/5.0</p>
                <p className="text-xs text-muted-foreground">จาก 3,847 รีวิว</p>
              </div>
              <div className="h-16 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-brand-700 to-accent bg-clip-text text-transparent">
                  98%
                </p>
                <p className="text-xs text-muted-foreground mt-1">ลูกค้าแนะนำต่อ<br/>ให้คนรู้จัก</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl bg-white border border-border shadow-sm hover:shadow-xl transition-all ${
                  i === 1 ? "lg:translate-x-8" : ""
                }`}
              >
                <Quote className="absolute -top-3 -left-3 w-10 h-10 text-brand-600 fill-brand-600 rotate-180" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-brand-100">
                    <Image src={t.avatar} alt={t.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">"{t.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
