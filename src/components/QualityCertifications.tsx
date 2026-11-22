"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { ShieldCheck, CheckCircle2, Award, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function QualityCertifications() {
  const { t } = useLanguage();

  const certs = [
    {
      title: t.quality.onssaTitle,
      desc: t.quality.onssaDesc,
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      tag: "Maroc & International",
    },
    {
      title: t.quality.haccpTitle,
      desc: t.quality.haccpDesc,
      icon: <CheckCircle2 className="w-8 h-8 text-cyanCustom-400" />,
      tag: "Codex Alimentarius",
    },
    {
      title: t.quality.isoTitle,
      desc: t.quality.isoDesc,
      icon: <Award className="w-8 h-8 text-sky-400" />,
      tag: "Food Safety Management",
    },
    {
      title: t.quality.halalTitle,
      desc: t.quality.halalDesc,
      icon: <FileCheck className="w-8 h-8 text-amber-400" />,
      tag: "Certifié 100%",
    },
  ];

  return (
    <section id="qualite" className="py-24 relative overflow-hidden bg-ocean-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-cyanCustom-500/10 border border-cyanCustom-500/30 text-cyanCustom-400 text-xs font-bold uppercase tracking-wider mb-3">
            {t.quality.sectionBadge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {t.quality.title}
          </h2>
          <p className="text-ocean-200 text-base sm:text-lg">
            {t.quality.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-ocean-800 flex flex-col justify-between hover:border-cyanCustom-500/50 hover:bg-ocean-900/60 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-xl bg-ocean-900 border border-ocean-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {c.icon}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-cyanCustom-400 bg-cyanCustom-500/10 px-2.5 py-1 rounded-full border border-cyanCustom-500/20">
                    {c.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
                <p className="text-xs sm:text-sm text-ocean-300 leading-relaxed">{c.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-ocean-800/80 flex items-center gap-2 text-xs text-ocean-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Norme Contrôlée & Validée</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
