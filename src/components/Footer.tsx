"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { Anchor, ShieldCheck, Mail, Phone, MapPin, ChevronRight } from "lucide-react";

export default function Footer() {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="bg-ocean-950 border-t border-ocean-800/80 pt-16 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyanCustom-500 to-ocean-700 flex items-center justify-center">
                <Anchor className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-white">FISH</span>
                <span className="text-xl font-black text-cyanCustom-400">LINE</span>
              </div>
            </div>
            <p className="text-xs text-ocean-300 leading-relaxed mb-4">
              {t.footer.aboutText}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-ocean-900 border border-ocean-800 text-[11px] text-cyanCustom-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zone FAO 34 • ONSSA Agrément</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs text-ocean-300">
              <li><a href="#accueil" className="hover:text-cyanCustom-400 transition-colors">{t.nav.home}</a></li>
              <li><a href="#produits" className="hover:text-cyanCustom-400 transition-colors">{t.nav.products}</a></li>
              <li><a href="#apropos" className="hover:text-cyanCustom-400 transition-colors">{t.nav.about}</a></li>
              <li><a href="#qualite" className="hover:text-cyanCustom-400 transition-colors">{t.nav.quality}</a></li>
              <li><a href="#export" className="hover:text-cyanCustom-400 transition-colors">{t.nav.export}</a></li>
              <li><a href="#galerie" className="hover:text-cyanCustom-400 transition-colors">{t.nav.gallery}</a></li>
              <li><a href="#contact" className="hover:text-cyanCustom-400 transition-colors">{t.nav.contact}</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t.footer.productsTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-ocean-300">
              <li><a href="#produits" className="hover:text-cyanCustom-400 transition-colors">Sardines de l&apos;Atlantique</a></li>
              <li><a href="#produits" className="hover:text-cyanCustom-400 transition-colors">Poulpe de Dakhla (T1-T8)</a></li>
              <li><a href="#produits" className="hover:text-cyanCustom-400 transition-colors">Calmar Blanc & Seiche</a></li>
              <li><a href="#produits" className="hover:text-cyanCustom-400 transition-colors">Maquereau de l&apos;Atlantique</a></li>
              <li><a href="#produits" className="hover:text-cyanCustom-400 transition-colors">Dorade Royale & Bar Sauvage</a></li>
              <li><a href="#produits" className="hover:text-cyanCustom-400 transition-colors">Crevettes Rouges Royales</a></li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t.footer.contactTitle}
            </h4>
            <ul className="space-y-3 text-xs text-ocean-300 mb-6">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyanCustom-400 shrink-0" />
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyanCustom-400 shrink-0" />
                <span>{t.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyanCustom-400 shrink-0" />
                <span>{t.footer.email}</span>
              </li>
            </ul>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyanCustom-400 hover:text-white bg-ocean-900 px-3 py-2 rounded-lg border border-ocean-800 hover:border-cyanCustom-500/40 transition-colors"
            >
              <span>{t.footer.adminLink}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-ocean-900 flex flex-col sm:flex-row items-center justify-between text-xs text-ocean-400 gap-4">
          <p>© {new Date().getFullYear()} FISHLINE Maroc. {t.footer.rights}</p>
          <p className="text-[11px] text-ocean-400">
            Inspiré de l&apos;excellence maritime marocaine • Export B2B Zone FAO 34
          </p>
        </div>
      </div>
    </footer>
  );
}
