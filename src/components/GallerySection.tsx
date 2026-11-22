"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { galleryImages } from "@/lib/mock-data";
import { Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function GallerySection() {
  const { t, language } = useLanguage();

  return (
    <section id="galerie" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyanCustom-500/10 border border-cyanCustom-500/30 text-cyanCustom-400 text-xs font-bold uppercase tracking-wider mb-3">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t.gallery.sectionBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {t.gallery.title}
          </h2>
          <p className="text-ocean-200 text-base sm:text-lg">
            {t.gallery.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="relative h-72 rounded-2xl overflow-hidden glass-panel border border-ocean-800 group shadow-lg"
            >
              <img
                src={img.url}
                alt={language === 'ar' ? img.title_ar : img.title_fr}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-950/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-bold text-white block drop-shadow-md">
                  {language === 'ar' ? img.title_ar : img.title_fr}
                </span>
                <span className="text-[10px] text-cyanCustom-300 block">
                  Fishline Maroc • Industrie Halieutique
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
