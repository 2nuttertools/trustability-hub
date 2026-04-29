"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Camera, Video } from "lucide-react";

export function ProjectGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const next = () => setActive((a) => (a + 1) % images.length);
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);

  return (
    <>
      <div className="grid grid-cols-4 gap-2 lg:gap-3 aspect-[2/1] lg:aspect-[2.4/1]">
        {/* Main */}
        <div
          className="col-span-4 lg:col-span-2 row-span-2 relative rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer group"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={images[0]}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button className="px-3 py-2 rounded-full bg-black/60 backdrop-blur text-white text-xs font-medium flex items-center gap-1.5 hover:bg-black/80">
              <Video className="w-3.5 h-3.5" /> Virtual Tour 360°
            </button>
            <button className="px-3 py-2 rounded-full bg-white/90 backdrop-blur text-foreground text-xs font-medium flex items-center gap-1.5 hover:bg-white">
              <Camera className="w-3.5 h-3.5" /> {images.length} ภาพ
            </button>
          </div>
        </div>

        {/* Side images */}
        {images.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="hidden lg:block col-span-1 relative rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setActive(i + 1);
              setLightbox(true);
            }}
          >
            <Image src={img} alt={`${name} ${i + 2}`} fill sizes="25vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-white text-center">
                  <Maximize2 className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-semibold">+{images.length - 5} ภาพ</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              onClick={() => setLightbox(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-6xl aspect-[16/10]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[active]} alt={name} fill sizes="90vw" className="object-contain" />
            </motion.div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm">
              {active + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
