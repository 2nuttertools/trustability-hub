"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Search, MapPin, Building2, DollarSign, Sparkles, ArrowRight, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "buy", label: "ซื้อ" },
  { id: "rent", label: "เช่า" },
  { id: "invest", label: "ลงทุน" },
  { id: "newproject", label: "โครงการใหม่" },
];

const propertyTypes = ["ทั้งหมด", "บ้านเดี่ยว", "ทาวน์โฮม", "คอนโด", "Pool Villa", "ที่ดิน"];
const popularSearches = ["สุขุมวิท", "พร้อมพงษ์", "ภูเก็ต", "เชียงใหม่", "Pool Villa", "ใกล้ BTS"];

export function Hero() {
  const [tab, setTab] = useState("buy");
  const [type, setType] = useState("ทั้งหมด");

  return (
    <section className="relative min-h-screen pt-20 lg:pt-24 overflow-hidden bg-mesh">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-brand-300/30 to-accent/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-brand-500/20 to-brand-900/10 blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #1e3a8a 1px, transparent 1px), linear-gradient(to bottom, #1e3a8a 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-sm text-brand-700 font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>ตัวแทนอสังหาริมทรัพย์อันดับ 1 ของประเทศไทย</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
            >
              <span className="block text-foreground">ค้นหา</span>
              <span className="block shine-text">บ้านในฝัน</span>
              <span className="block text-foreground">ของคุณวันนี้</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed"
            >
              เชื่อมต่อโครงการคุณภาพระดับพรีเมียมจากทั่วประเทศไทย
              ด้วยบริการที่ปรึกษาส่วนตัวที่เข้าใจคุณ —
              <span className="text-foreground font-medium"> ทั้งภาษาไทย จีน และอังกฤษ</span>
            </motion.p>

            {/* Search Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl shadow-brand-900/10 border border-border/60 overflow-hidden"
              id="search"
            >
              {/* Tabs */}
              <div className="flex border-b border-border bg-brand-50/30">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "flex-1 px-4 py-3.5 text-sm font-semibold transition-all relative",
                      tab === t.id
                        ? "text-brand-700"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t.label}
                    {tab === t.id && (
                      <motion.span
                        layoutId="tabIndicator"
                        className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="ค้นหา ทำเล โครงการ หรือ Developer..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all text-sm"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <Filter icon={Building2} label="ประเภท" value={type} />
                  <Filter icon={MapPin} label="ทำเล" value="กรุงเทพฯ" />
                  <Filter icon={DollarSign} label="ราคา" value="3-15M" />
                </div>

                {/* Property type chips */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {propertyTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={cn(
                        "px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all",
                        type === t
                          ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                          : "bg-muted text-foreground/70 hover:bg-brand-100"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* CTA */}
                <button className="w-full bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 hover:from-brand-700 hover:to-brand-900 text-white font-semibold py-4 rounded-xl shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 transition-all flex items-center justify-center gap-2 group">
                  <Search className="w-4 h-4" />
                  <span>ค้นหาโครงการ</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Popular searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-5 flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-muted-foreground">คำค้นยอดฮิต:</span>
              {popularSearches.map((s) => (
                <button
                  key={s}
                  className="text-xs px-3 py-1 rounded-full bg-white border border-border hover:border-brand-400 hover:text-brand-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5] max-w-lg ml-auto">
              {/* Main image */}
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-900/30">
                <Image
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=85&auto=format&fit=crop"
                  alt="Modern luxury home"
                  fill
                  priority
                  sizes="600px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-950/40 via-transparent to-transparent" />
              </div>

              {/* Play button overlay */}
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/90 backdrop-blur-xl flex items-center justify-center shadow-2xl pulse-ring hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-brand-700 text-brand-700 ml-1" />
              </button>

              {/* Floating badge - Stats */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-8 bg-white rounded-2xl p-4 shadow-2xl border border-border/50 max-w-[180px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex -space-x-2">
                    {[
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&auto=format&fit=crop",
                    ].map((src, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden relative">
                        <Image src={src} alt="" fill sizes="40px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold">+12K</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  ลูกค้าที่เลือกใช้บริการเรา
                </p>
              </motion.div>

              {/* Floating badge - Featured */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-4 bg-white rounded-2xl p-4 shadow-2xl border border-border/50 max-w-[220px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">โครงการแนะนำ</p>
                    <p className="text-[10px] text-muted-foreground">อัพเดททุกวัน</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=80&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=80&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=200&q=80&auto=format&fit=crop",
                  ].map((src, i) => (
                    <div key={i} className="aspect-square rounded-md overflow-hidden relative">
                      <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating badge - Price */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-1/3 -right-6 bg-gradient-to-br from-brand-600 to-brand-900 text-white rounded-2xl p-4 shadow-2xl"
              >
                <p className="text-[10px] uppercase tracking-wide opacity-80">ผลตอบแทนเฉลี่ย</p>
                <p className="text-2xl font-bold">7.2%</p>
                <p className="text-[10px] opacity-80">ต่อปี (Rental Yield)</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Filter({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-muted/30 hover:bg-white hover:border-brand-300 transition-all text-left">
      <Icon className="w-4 h-4 text-brand-600 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-xs font-semibold truncate">{value}</p>
      </div>
    </button>
  );
}
