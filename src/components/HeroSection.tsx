"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { motion } from "framer-motion";
import { Compass, ShieldCheck, Snowflake, Globe2, ChevronDown, Sparkles, PhoneCall } from "lucide-react";

export default function HeroSection() {
  const { t, isRtl } = useLanguage();

  return (
    <section id="accueil" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyanCustom-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-ocean-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 text-center lg:text-start">
            
            {/* Origin & Quality Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocean-900/80 border border-cyanCustom-500/30 text-cyanCustom-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md shadow-lg shadow-cyanCustom-500/10"
            >
              <Sparkles className="w-4 h-4 text-cyanCustom-400 animate-pulse" />
              <span>{t.hero.badge}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight mb-6"
            >
              {t.hero.titleMain}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyanCustom-400 via-sky-300 to-ocean-300">
                {t.hero.titleSub}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-ocean-200/90 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 font-normal"
            >
              {t.hero.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <a
                href="#produits"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyanCustom-500 via-sky-500 to-ocean-600 hover:from-cyanCustom-400 hover:to-ocean-500 text-white font-bold text-base shadow-xl shadow-cyanCustom-500/30 hover:shadow-cyanCustom-500/50 transition-all hover:scale-[1.02] text-center"
              >
                {t.hero.exploreBtn}
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-ocean-900/80 hover:bg-ocean-800 text-white border border-ocean-700/80 hover:border-cyanCustom-500/50 font-bold text-base transition-all hover:scale-[1.02] text-center backdrop-blur-md"
              >
                {t.hero.quoteBtn}
              </a>
            </motion.div>

            {/* Key Value Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-ocean-800/60"
            >
              <div className="flex items-center gap-2.5 justify-center lg:justify-start text-xs sm:text-sm text-ocean-300">
                <Snowflake className="w-4 h-4 text-cyanCustom-400 shrink-0" />
                <span>{t.hero.coldChain}</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start text-xs sm:text-sm text-ocean-300">
                <Compass className="w-4 h-4 text-cyanCustom-400 shrink-0" />
                <span>{t.hero.faoZone}</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start text-xs sm:text-sm text-ocean-300">
                <Globe2 className="w-4 h-4 text-cyanCustom-400 shrink-0" />
                <span>{t.hero.worldwideDelivery}</span>
              </div>
            </motion.div>

          </div>

          {/* Hero Visual Card / Floating Elements */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl border border-cyanCustom-500/30 group"
            >
              {/* Hero Image Showcase */}
              <div className="relative h-[420px] sm:h-[480px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
                  alt="Fishline Moroccan Seafood"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-950/30 to-transparent" />
                
                {/* Floating Freshness Badge */}
                <div className="absolute top-4 left-4 bg-ocean-950/85 backdrop-blur-md border border-cyanCustom-500/40 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-white shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONSSA & HACCP Agrément</span>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-ocean-900/90 backdrop-blur-md rounded-xl p-4 border border-ocean-700/60 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-cyanCustom-400 font-bold block">
                        Zone FAO 34 • Atlantic Ocean
                      </span>
                      <h4 className="text-white font-bold text-sm sm:text-base">
                        Sardines, Poulpe de Dakhla & Calmar
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-cyanCustom-500/20 text-cyanCustom-300 text-xs font-bold border border-cyanCustom-500/30">
                      IQF & Fresh
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ambient Floating Decorative Pill */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 bg-ocean-900/95 border border-cyanCustom-500/40 py-3 px-4 rounded-2xl shadow-xl backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-cyanCustom-500/20 flex items-center justify-center text-cyanCustom-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-ocean-300 block">Standard Export UE</span>
                <span className="text-sm font-bold text-white">Traçabilité 100%</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Down Scroll Arrow */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#chiffres" className="text-ocean-400 hover:text-cyanCustom-400 p-2 block" aria-label="Scroll down">
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
