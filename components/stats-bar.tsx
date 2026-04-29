"use client";

import { motion } from "framer-motion";
import { Building2, Users, Award, TrendingUp } from "lucide-react";

const stats = [
  { value: "2,500+", label: "โครงการพันธมิตร", icon: Building2 },
  { value: "12,000+", label: "ลูกค้าที่ไว้วางใจ", icon: Users },
  { value: "15+", label: "รางวัลระดับชาติ", icon: Award },
  { value: "98%", label: "ความพึงพอใจ", icon: TrendingUp },
];

const developers = [
  "Sansiri", "AP Thailand", "Pruksa", "Land & Houses", "SC Asset",
  "MQDC", "Origin", "Supalai", "Quality Houses", "LPN Development",
];

export function StatsBar() {
  return (
    <section className="relative bg-white border-y border-border">
      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 flex-shrink-0">
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-900 to-brand-600 bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Developer Marquee */}
      <div className="border-t border-border bg-brand-50/30 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center font-medium">
            พันธมิตรอย่างเป็นทางการกับนักพัฒนาชั้นนำ
          </p>
        </div>
        <div className="flex animate-marquee">
          {[...developers, ...developers].map((d, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-8 text-2xl lg:text-3xl font-bold text-brand-900/30 hover:text-brand-700 transition-colors whitespace-nowrap"
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
