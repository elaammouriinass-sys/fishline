"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { Anchor, Menu, X, Globe, ShieldCheck, ChevronRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#accueil", label: t.nav.home },
    { href: "#produits", label: t.nav.products },
    { href: "#apropos", label: t.nav.about },
    { href: "#qualite", label: t.nav.quality },
    { href: "#export", label: t.nav.export },
    { href: "#galerie", label: t.nav.gallery },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ocean-950/90 backdrop-blur-md shadow-xl border-b border-ocean-800/50 py-3"
          : "bg-gradient-to-b from-ocean-950/80 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="#accueil" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyanCustom-500 to-ocean-700 flex items-center justify-center shadow-lg shadow-cyanCustom-500/20 group-hover:scale-105 transition-transform">
              <Anchor className="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-wider text-white">FISH</span>
                <span className="text-2xl font-black tracking-wider text-cyanCustom-500">LINE</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-ocean-300 block font-semibold">
                Maroc • Seafood Export
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ocean-100 hover:text-cyanCustom-500 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyanCustom-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions & Language Switcher */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-ocean-900/80 border border-ocean-700/60 rounded-full p-1 text-xs font-semibold">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'fr'
                    ? "bg-cyanCustom-500 text-white shadow-sm"
                    : "text-ocean-300 hover:text-white"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'ar'
                    ? "bg-cyanCustom-500 text-white shadow-sm"
                    : "text-ocean-300 hover:text-white"
                }`}
              >
                العربية
              </button>
            </div>

            {/* Admin link */}
            <Link
              href="/admin"
              className="text-xs text-ocean-300 hover:text-white px-2.5 py-1 rounded-md border border-ocean-800 hover:border-ocean-600 transition-colors"
            >
              Admin
            </Link>

            {/* CTA Button */}
            <a
              href="#contact"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold rounded-full group bg-gradient-to-br from-cyanCustom-500 to-ocean-600 group-hover:from-cyanCustom-500 group-hover:to-ocean-500 hover:text-white text-white shadow-lg shadow-cyanCustom-500/25 active:scale-95 transition-all"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-ocean-950/40 rounded-full group-hover:bg-transparent flex items-center gap-1.5">
                <span>{t.nav.quoteBtn}</span>
                <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center bg-ocean-900 border border-ocean-700/60 rounded-full p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="px-2 py-1 text-cyanCustom-400 font-bold"
              >
                {language === 'fr' ? 'عربي' : 'FR'}
              </button>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ocean-200 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-ocean-950/95 border-b border-ocean-800 backdrop-blur-xl px-4 pt-3 pb-6"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-ocean-100 hover:text-cyanCustom-400 hover:bg-ocean-900/50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-ocean-800/80 flex flex-col gap-2">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-ocean-300 hover:text-white"
                >
                  {t.nav.admin}
                </Link>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyanCustom-500 to-ocean-600 text-white font-semibold text-sm shadow-md"
                >
                  {t.nav.quoteBtn}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
