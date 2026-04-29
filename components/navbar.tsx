"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Menu, X, Globe, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "หน้าแรก", href: "/" },
  { label: "โครงการ", href: "/#projects" },
  { label: "ค้นหาบ้าน", href: "/#search" },
  { label: "บทความ", href: "/#articles" },
  { label: "เกี่ยวกับเรา", href: "/#about" },
];

const languages = [
  { code: "TH", label: "ไทย", flag: "🇹🇭" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "CN", label: "中文", flag: "🇨🇳" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("TH");
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 24);
    handle();
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center shadow-lg shadow-brand-600/30 group-hover:shadow-brand-600/50 transition-shadow">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base lg:text-lg tracking-tight bg-gradient-to-r from-brand-900 to-brand-600 bg-clip-text text-transparent">
                Trustability Hub
              </span>
              <span className="text-[9px] lg:text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                Premium Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-brand-700 transition-colors group"
              >
                {item.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-0.5 bg-gradient-to-r from-brand-500 to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-full hover:bg-brand-50 transition-colors"
              >
                <Globe className="w-4 h-4 text-brand-700" />
                <span>{lang}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", langOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-border shadow-xl overflow-hidden"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setLangOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand-50 transition-colors text-left",
                          lang === l.code && "bg-brand-50 text-brand-700 font-semibold"
                        )}
                      >
                        <span className="text-lg">{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <Link
              href="tel:+66800000000"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-brand-600 to-brand-800 shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 hover:-translate-y-0.5 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>ติดต่อเรา</span>
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg hover:bg-brand-50 transition-colors"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-border"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2 px-4">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={cn(
                      "flex-1 px-3 py-2 text-xs font-medium rounded-lg border",
                      lang === l.code
                        ? "bg-brand-600 text-white border-brand-600"
                        : "border-border"
                    )}
                  >
                    {l.flag} {l.code}
                  </button>
                ))}
              </div>
              <Link
                href="tel:+66800000000"
                className="flex items-center justify-center gap-2 mx-4 mt-3 px-4 py-3 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-brand-600 to-brand-800"
              >
                <Phone className="w-4 h-4" />
                ติดต่อเรา 080-000-0000
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
