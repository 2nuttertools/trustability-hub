"use client";

import { motion } from "framer-motion";
import { Calculator, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { formatPriceFull } from "@/lib/utils";

export function MortgageCalculator({ defaultPrice = 8_900_000 }: { defaultPrice?: number }) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(3.5);

  const { monthly, total, interest, loan } = useMemo(() => {
    const loan = price * (1 - downPct / 100);
    const r = rate / 100 / 12;
    const n = years * 12;
    const monthly = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - loan;
    return { monthly, total, interest, loan };
  }, [price, downPct, years, rate]);

  const minIncome = monthly * 3; // rough rule of thumb

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl border border-border p-6 lg:p-8 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold">เครื่องคำนวณสินเชื่อ</h3>
          <p className="text-xs text-muted-foreground">ประมาณการค่างวดและภาระดอกเบี้ย</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="space-y-5">
          <Slider
            label="ราคาบ้าน"
            value={price}
            min={1_000_000}
            max={150_000_000}
            step={100_000}
            display={formatPriceFull(price)}
            onChange={setPrice}
          />
          <Slider
            label="เงินดาวน์"
            value={downPct}
            min={0}
            max={50}
            step={5}
            display={`${downPct}% (${formatPriceFull(price * downPct / 100)})`}
            onChange={setDownPct}
          />
          <Slider
            label="ระยะเวลาผ่อน"
            value={years}
            min={5}
            max={40}
            step={1}
            display={`${years} ปี`}
            onChange={setYears}
          />
          <Slider
            label="ดอกเบี้ย"
            value={rate}
            min={1}
            max={8}
            step={0.1}
            display={`${rate.toFixed(1)}% ต่อปี`}
            onChange={setRate}
          />
        </div>

        {/* Result */}
        <div className="space-y-3">
          <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-950 p-6 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/20 blur-2xl" />
            <p className="text-xs uppercase tracking-wider text-white/70 mb-1 relative">
              ค่างวดต่อเดือน (ประมาณ)
            </p>
            <p className="text-4xl lg:text-5xl font-bold relative">
              {monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="text-base font-normal text-white/70 ml-1">บาท/เดือน</span>
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 relative">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/60">วงเงินกู้</p>
                <p className="text-sm font-semibold">{formatPriceFull(Math.round(loan))}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/60">ดอกเบี้ยรวม</p>
                <p className="text-sm font-semibold">{formatPriceFull(Math.round(interest))}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-900 mb-0.5">รายได้ขั้นต่ำที่แนะนำ</p>
              <p className="text-lg font-bold text-amber-900">
                {minIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })} บาท/เดือน
              </p>
              <p className="text-[10px] text-amber-700 mt-1">
                * ตามหลักธนาคาร ค่างวด ≤ 1/3 ของรายได้
              </p>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-brand-600 to-brand-800 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl">
            ขอสินเชื่อกับเรา (ฟรีค่าบริการ)
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Slider({
  label, value, min, max, step, display, onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-foreground/80">{label}</label>
        <span className="text-sm font-bold text-brand-700">{display}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-brand-600"
          style={{
            background: `linear-gradient(to right, #1d4ed8 0%, #3b82f6 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`,
          }}
        />
      </div>
    </div>
  );
}
