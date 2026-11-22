"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { Anchor, ShieldCheck, ThermometerSnowflake, Waves } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutSection() {
  const { t, isRtl } = useLanguage();

  return (
    <section id="apropos" className="py-24 relative bg-ocean-950/60 border-t border-ocean-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Images Grid Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-2xl overflow-hidden h-64 shadow-xl border border-ocean-700/60"
              >
                <img
                  src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80"
                  alt="Moroccan Fishing Port"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-2xl overflow-hidden h-64 mt-8 shadow-xl border border-ocean-700/60"
              >
                <img
                  src="https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80"
                  alt="Seafood Cold Storage"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-6 right-6 bg-gradient-to-br from-cyanCustom-500 to-ocean-700 p-4 rounded-2xl shadow-2xl text-white">
              <span className="text-3xl font-black block">Zone FAO 34</span>
              <span className="text-xs uppercase tracking-wider text-ocean-100 font-semibold">
                Surgélation IQF & Traçabilité
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyanCustom-500/10 border border-cyanCustom-500/30 text-cyanCustom-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Waves className="w-3.5 h-3.5" />
              <span>{t.about.sectionBadge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              {t.about.title}
            </h2>

            <p className="text-ocean-200 text-base sm:text-lg leading-relaxed mb-5">
              {t.about.description1}
            </p>

            <p className="text-ocean-300 text-sm sm:text-base leading-relaxed mb-8">
              {t.about.description2}
            </p>

            {/* 3 Pillars */}
            <div className="space-y-4">
              <div className="glass-panel p-4 rounded-xl border border-ocean-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyanCustom-500/20 text-cyanCustom-400 flex items-center justify-center shrink-0">
                  <ThermometerSnowflake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1">{t.about.point1Title}</h4>
                  <p className="text-ocean-300 text-xs sm:text-sm">{t.about.point1Desc}</p>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-ocean-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Anchor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1">{t.about.point2Title}</h4>
                  <p className="text-ocean-300 text-xs sm:text-sm">{t.about.point2Desc}</p>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-ocean-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-1">{t.about.point3Title}</h4>
                  <p className="text-ocean-300 text-xs sm:text-sm">{t.about.point3Desc}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
