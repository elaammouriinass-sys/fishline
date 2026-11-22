"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { Globe2, Navigation, Ship, Plane, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function ExportMap() {
  const { t } = useLanguage();

  const corridors = [
    { name: t.export.europe, delay: "24-48h", type: "Maritime & Route (Reefer)" },
    { name: t.export.asia, delay: "Direct Shipping", type: "Conteneurs FCL -18°C" },
    { name: t.export.americas, delay: "Lignes Régulières", type: "Fret Aérien & Maritime" },
    { name: t.export.africa, delay: "Express", type: "Transport Isotherme" },
  ];

  const hubs = ["Tanger Med Port", "Casablanca Port", "Agadir Fishing Port", "Dakhla Airport & Port"];

  return (
    <section id="export" className="py-24 relative bg-ocean-950/70 border-t border-ocean-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-cyanCustom-500/10 border border-cyanCustom-500/30 text-cyanCustom-400 text-xs font-bold uppercase tracking-wider mb-3">
            {t.export.sectionBadge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {t.export.title}
          </h2>
          <p className="text-ocean-200 text-base sm:text-lg">
            {t.export.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Corridors List */}
          <div className="lg:col-span-6 space-y-4">
            {corridors.map((c, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-panel p-5 rounded-xl border border-ocean-800 flex items-center justify-between hover:border-cyanCustom-500/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-cyanCustom-500/15 text-cyanCustom-400 flex items-center justify-center shrink-0">
                    <Ship className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm sm:text-base">{c.name}</h4>
                    <span className="text-xs text-ocean-300">{c.type}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-ocean-900 border border-ocean-700 text-cyanCustom-300">
                  {c.delay}
                </span>
              </motion.div>
            ))}

            <div className="p-4 rounded-xl bg-ocean-900/60 border border-ocean-800 text-xs text-ocean-300 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyanCustom-400 shrink-0" />
              <span>{t.export.ports}</span>
            </div>
          </div>

          {/* Hub Visual Map Card */}
          <div className="lg:col-span-6">
            <div className="glass-panel p-6 rounded-3xl border border-cyanCustom-500/30 relative overflow-hidden">
              <div className="relative h-80 rounded-2xl overflow-hidden bg-ocean-900 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80"
                  alt="Port logistics"
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-950/60 to-transparent" />

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-cyanCustom-500 text-white text-xs font-bold uppercase tracking-wider">
                      Hub Logistique Marocain
                    </span>
                    <Globe2 className="w-7 h-7 text-cyanCustom-400 animate-spin" style={{ animationDuration: '25s' }} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      Liaisons Maritimes & Aériennes Quotidiennes
                    </h3>
                    <p className="text-xs text-ocean-200 mb-4">
                      Expédition en conteneurs Reefer (-18°C) ou en caisses isothermes par avion pour les poissons ultra-frais du jour.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {hubs.map((h, i) => (
                        <span key={i} className="text-[11px] bg-ocean-950/80 border border-ocean-700/80 text-white px-2.5 py-1 rounded-lg">
                          📍 {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
