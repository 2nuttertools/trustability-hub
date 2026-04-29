"use client";

import { motion } from "framer-motion";
import { MessageCircle, Loader2, Check } from "lucide-react";
import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions/leads";

export function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="relative bg-white rounded-2xl p-7 shadow-2xl"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>ที่ปรึกษา 24 คน พร้อมตอบรับ</span>
      </div>
      <h3 className="text-xl font-bold mb-1">รับคำปรึกษาฟรี</h3>
      <p className="text-sm text-muted-foreground mb-5">
        กรอกข้อมูลของคุณ เราจะติดต่อกลับใน 15 นาที
      </p>

      {submitted ? (
        <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 flex items-center justify-center text-white mb-3">
            <Check className="w-6 h-6" />
          </div>
          <p className="font-semibold text-emerald-800 mb-1">ส่งข้อมูลเรียบร้อย!</p>
          <p className="text-sm text-emerald-700">
            ทีม Trustability Hub จะติดต่อกลับไปที่ {phone} ใน 15 นาที
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            startTransition(async () => {
              const result = await submitLead({
                name, phone,
                budget: budget || null,
                message: message || null,
                source: "homepage-cta",
              });
              if (result.ok) setSubmitted(true);
              else setError(result.error);
            });
          }}
          className="space-y-3"
        >
          <input
            type="text" required placeholder="ชื่อ-นามสกุล"
            value={name} onChange={(e) => setName(e.target.value)} disabled={pending}
            className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm disabled:opacity-50"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="tel" required placeholder="เบอร์โทร"
              value={phone} onChange={(e) => setPhone(e.target.value)} disabled={pending}
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm disabled:opacity-50"
            />
            <select
              value={budget} onChange={(e) => setBudget(e.target.value)} disabled={pending}
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm disabled:opacity-50"
            >
              <option value="">งบประมาณ</option>
              <option value="under-3M">ต่ำกว่า 3M</option>
              <option value="3M-8M">3M - 8M</option>
              <option value="8M-20M">8M - 20M</option>
              <option value="over-20M">มากกว่า 20M</option>
            </select>
          </div>
          <textarea
            placeholder="ความต้องการ (ไม่บังคับ)" rows={2}
            value={message} onChange={(e) => setMessage(e.target.value)} disabled={pending}
            className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm resize-none disabled:opacity-50"
          />
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <button
            type="submit" disabled={pending}
            className="w-full bg-gradient-to-r from-brand-700 to-brand-900 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
            ส่งคำขอติดต่อกลับ
          </button>
        </form>
      )}

      <p className="text-[10px] text-muted-foreground text-center mt-3">
        ✓ ฟรีไม่มีค่าใช้จ่าย • ✓ ไม่ผูกมัด • ✓ ข้อมูลปลอดภัย 100%
      </p>
    </motion.div>
  );
}
