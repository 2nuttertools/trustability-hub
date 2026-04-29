"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Headphones, Award, Globe2, Calculator, FileSignature, BadgeCheck } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "ใบอนุญาตถูกต้อง 100%",
    desc: "ตัวแทนที่ได้รับอนุญาตจากกรมที่ดิน เป็นสมาชิกสมาคมตัวแทนนายหน้าอสังหาฯ ไทย",
    badge: "Licensed",
  },
  {
    icon: Headphones,
    title: "ที่ปรึกษาส่วนตัว 24/7",
    desc: "ทีมที่ปรึกษามืออาชีพ พร้อมตอบทุกคำถามทั้งภาษาไทย จีน อังกฤษ ตลอด 24 ชั่วโมง",
    badge: "TH / 中文 / EN",
  },
  {
    icon: Award,
    title: "Top Agency 5 ปีซ้อน",
    desc: "ได้รับการยอมรับจาก Developer ชั้นนำ คว้ารางวัล Best Real Estate Agency 5 ปีซ้อน",
    badge: "Award-winning",
  },
  {
    icon: Globe2,
    title: "บริการนานาชาติ",
    desc: "ให้คำปรึกษากฎหมาย, การโอน, ภาษี สำหรับชาวต่างชาติ พร้อมล่ามภาษาจีนเฉพาะกลุ่ม",
    badge: "Global Service",
  },
  {
    icon: Calculator,
    title: "เครื่องมือคำนวณครบ",
    desc: "Mortgage Calculator, Investment Analysis, Comparison Tool ช่วยตัดสินใจอย่างมืออาชีพ",
    badge: "Smart Tools",
  },
  {
    icon: FileSignature,
    title: "ดำเนินการครบวงจร",
    desc: "ตั้งแต่หาบ้าน พาชม จองห้อง ทำสัญญา สินเชื่อ จนถึงโอนกรรมสิทธิ์ — เราดูแลทุกขั้นตอน",
    badge: "End-to-end",
  },
];

export function WhyUs() {
  return (
    <section id="about" className="relative py-20 lg:py-28 bg-mesh-dark text-white overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-medium mb-4"
          >
            <BadgeCheck className="w-3.5 h-3.5 text-accent" />
            <span>ทำไมต้อง Trustability Hub</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4"
          >
            มากกว่าตัวแทนทั่วไป<br />
            <span className="bg-gradient-to-r from-accent to-brand-300 bg-clip-text text-transparent">
              เราคือพันธมิตรในการเลือกบ้าน
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg leading-relaxed"
          >
            เราเชื่อว่าการซื้อบ้านคือการตัดสินใจที่สำคัญที่สุดในชีวิต
            ทีมงานของเราจึงทุ่มเทอย่างเต็มที่เพื่อให้คุณได้บ้านที่ใช่ในราคาที่ดีที่สุด
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative p-7 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: "linear-gradient(135deg, rgba(96,165,250,0.15), transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-accent flex items-center justify-center shadow-xl shadow-brand-500/30">
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-accent border border-accent/40 rounded-full px-2.5 py-1 bg-accent/10">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
