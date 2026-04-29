"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MessageCircle, Phone, X, Plus } from "lucide-react";

const actions = [
  { label: "LINE", icon: MessageCircle, color: "bg-green-500", href: "#" },
  { label: "WhatsApp", icon: MessageCircle, color: "bg-emerald-500", href: "#" },
  { label: "WeChat", icon: MessageCircle, color: "bg-emerald-600", href: "#" },
  { label: "โทรเลย", icon: Phone, color: "bg-brand-600", href: "tel:+66800000000" },
];

export function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          actions.map((a, i) => (
            <motion.a
              key={a.label}
              href={a.href}
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 group"
            >
              <span className="bg-white shadow-lg px-3 py-1.5 rounded-full text-sm font-medium text-foreground group-hover:scale-105 transition-transform">
                {a.label}
              </span>
              <span className={`${a.color} w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                <a.icon className="w-5 h-5" />
              </span>
            </motion.a>
          ))}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-xl shadow-brand-600/40 flex items-center justify-center hover:scale-110 transition-transform pulse-ring"
        aria-label="ติดต่อเรา"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="plus" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Plus className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
