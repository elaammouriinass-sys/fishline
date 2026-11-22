"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { initialStats } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Users, Award, Globe, CheckCircle2 } from "lucide-react";

export default function StatsSection() {
  const { t, language } = useLanguage();

  const icons = [
    <Globe key="1" className="w-6 h-6 text-cyanCustom-400" />,
    <Award key="2" className="w-6 h-6 text-sky-400" />,
    <Users key="3" className="w-6 h-6 text-emerald-400" />,
    <CheckCircle2 key="4" className="w-6 h-6 text-amber-400" />,
  ];

  return (
    <section id="chiffres" className="py-20 relative bg-ocean-950/80 border-y border-ocean-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-cyanCustom-500/10 border border-cyanCustom-500/30 text-cyanCustom-400 text-xs font-bold uppercase tracking-wider mb-3">
            {t.stats.sectionBadge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t.stats.title}
          </h2>
          <p className="text-ocean-300 text-base sm:text-lg">
            {t.stats.subtitle}
          </p>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialStats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-ocean-800/80 relative overflow-hidden group hover:border-cyanCustom-500/40 hover:bg-ocean-900/60 transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-ocean-900/90 border border-ocean-700/60 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {icons[idx]}
              </div>

              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyanCustom-200 to-sky-400 mb-2">
                {stat.value}
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                {language === 'ar' ? stat.label_ar : stat.label_fr}
              </h3>

              <p className="text-xs sm:text-sm text-ocean-300">
                {language === 'ar' ? stat.sub_ar : stat.sub_fr}
              </p>

              {/* Decorative background circle */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-cyanCustom-500/5 rounded-full blur-xl group-hover:bg-cyanCustom-500/15 transition-all" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
