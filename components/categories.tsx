"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    title: "คอนโดมิเนียม",
    titleEn: "Condominium",
    count: "1,240+ โครงการ",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&auto=format&fit=crop",
    accent: "from-brand-500 to-brand-700",
  },
  {
    title: "บ้านเดี่ยว",
    titleEn: "Single House",
    count: "680+ โครงการ",
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80&auto=format&fit=crop",
    accent: "from-emerald-500 to-emerald-700",
  },
  {
    title: "ทาวน์โฮม",
    titleEn: "Townhome",
    count: "420+ โครงการ",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&auto=format&fit=crop",
    accent: "from-amber-500 to-orange-600",
  },
  {
    title: "Pool Villa",
    titleEn: "Luxury Villa",
    count: "180+ โครงการ",
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80&auto=format&fit=crop",
    accent: "from-cyan-500 to-blue-700",
  },
];

export function Categories() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-brand-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-brand-600 font-semibold mb-3">
            ค้นหาตามประเภท
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            เลือกบ้านที่ใช่<br />
            <span className="text-brand-700">ให้กับชีวิตของคุณ</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href="#"
                className="group relative block aspect-[3/4] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <Image
                  src={cat.img}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent} opacity-30 group-hover:opacity-50 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white group-hover:rotate-45 transition-all">
                  <ArrowUpRight className="w-5 h-5 text-white group-hover:text-brand-700" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-[10px] tracking-[0.2em] uppercase opacity-80 mb-1">
                    {cat.titleEn}
                  </p>
                  <h3 className="text-xl lg:text-2xl font-bold mb-1">{cat.title}</h3>
                  <p className="text-xs opacity-80">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
