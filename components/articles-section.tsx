"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import type { Article } from "@/lib/data";

export function ArticlesSection({ articles }: { articles: Article[] }) {
  return (
    <section id="articles" className="py-20 lg:py-28 bg-gradient-to-b from-brand-50/40 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs text-brand-700 font-medium mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>บทความ & คู่มือ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              ความรู้ก่อนซื้อบ้าน<br />
              <span className="text-brand-700">ที่นักลงทุนต้องรู้</span>
            </h2>
          </motion.div>

          <Link
            href="#"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900 self-start lg:self-end"
          >
            <span>อ่านบทความทั้งหมด</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <motion.div
              key={a.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href="#"
                className="group block bg-white rounded-2xl overflow-hidden border border-border hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={a.cover}
                    alt={a.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur text-brand-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {a.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span>{a.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {a.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                    {a.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 group-hover:gap-2 transition-all">
                    อ่านต่อ <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
