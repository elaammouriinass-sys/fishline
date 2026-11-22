"use client";

import React, { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { submitQuote } from "@/lib/supabase";
import { Send, CheckCircle2, MessageSquare, Phone, Mail, Building, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function QuoteSection() {
  const { t, isRtl } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    country: "",
    product_name: "Sardine de l'Atlantique",
    estimated_quantity: "1 Conteneur (25 Tonnes)",
    incoterm: "CIF",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitQuote({
        ...formData,
        status: 'pending',
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-ocean-950/90 border-t border-ocean-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-cyanCustom-500/10 border border-cyanCustom-500/30 text-cyanCustom-400 text-xs font-bold uppercase tracking-wider mb-3">
            {t.quote.sectionBadge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {t.quote.title}
          </h2>
          <p className="text-ocean-200 text-base sm:text-lg">
            {t.quote.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-ocean-700/80">
              <h3 className="text-xl font-bold text-white mb-6">
                Bureau Commercial Export
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyanCustom-500/15 text-cyanCustom-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-ocean-400 block text-xs">Siège & Installations :</span>
                    <span className="text-white font-medium">Zone Industrielle Portuaire, Agadir / Casablanca, Maroc</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyanCustom-500/15 text-cyanCustom-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-ocean-400 block text-xs">Téléphone Direct :</span>
                    <span className="text-white font-medium">+212 5 28 84 XX XX / +212 6 61 23 XX XX</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyanCustom-500/15 text-cyanCustom-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-ocean-400 block text-xs">Email Export :</span>
                    <span className="text-white font-medium">contact@fishline.ma / export@fishline.ma</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="mt-8 pt-6 border-t border-ocean-800">
                <a
                  href="https://wa.me/212661234567?text=Bonjour%20Fishline,%20je%20souhaite%20un%20devis%20pour%20l'exportation%20de%20produits%20de%20la%20mer."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{t.quote.whatsappBtn}</span>
                </a>
              </div>
            </div>

            {/* Quality Commitment Box */}
            <div className="p-5 rounded-2xl bg-ocean-900/40 border border-ocean-800 text-xs text-ocean-300">
              💡 <span className="font-bold text-white">Engagement B2B :</span> Toutes nos cotations incluent le certificat d&apos;origine marocain, le certificat sanitaire officiel ONSSA, et le contrôle température certifié au départ.
            </div>
          </div>

          {/* Quote Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyanCustom-500/30 shadow-2xl">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">
                    {t.quote.successTitle}
                  </h3>
                  <p className="text-ocean-200 text-sm max-w-md mx-auto mb-6">
                    {t.quote.successDesc}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-white text-xs font-bold"
                  >
                    Envoyer une autre demande
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ocean-300 mb-1.5">
                        {t.quote.company} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-ocean-900/90 border border-ocean-700/80 text-white text-sm focus:outline-none focus:border-cyanCustom-400 transition-colors"
                        placeholder="Ex: EuroFish Imports SL"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ocean-300 mb-1.5">
                        {t.quote.contactName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contact_name}
                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-ocean-900/90 border border-ocean-700/80 text-white text-sm focus:outline-none focus:border-cyanCustom-400 transition-colors"
                        placeholder="Ex: Carlos Mendes"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ocean-300 mb-1.5">
                        {t.quote.email} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-ocean-900/90 border border-ocean-700/80 text-white text-sm focus:outline-none focus:border-cyanCustom-400 transition-colors"
                        placeholder="carlos@eurofish.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ocean-300 mb-1.5">
                        {t.quote.phone} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-ocean-900/90 border border-ocean-700/80 text-white text-sm focus:outline-none focus:border-cyanCustom-400 transition-colors"
                        placeholder="+34 600 000 000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ocean-300 mb-1.5">
                        {t.quote.country} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-ocean-900/90 border border-ocean-700/80 text-white text-sm focus:outline-none focus:border-cyanCustom-400 transition-colors"
                        placeholder="Espagne, Italie, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ocean-300 mb-1.5">
                        {t.quote.product}
                      </label>
                      <select
                        value={formData.product_name}
                        onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-ocean-900/90 border border-ocean-700/80 text-white text-sm focus:outline-none focus:border-cyanCustom-400 transition-colors"
                      >
                        <option value="Sardine de l'Atlantique">Sardines de l&apos;Atlantique</option>
                        <option value="Poulpe de Dakhla">Poulpe de Dakhla (T1-T8)</option>
                        <option value="Calmar Blanc">Calmar Blanc de l&apos;Atlantique</option>
                        <option value="Seiche Sauvage">Seiche Sauvage</option>
                        <option value="Maquereau">Maquereau</option>
                        <option value="Dorade & Bar Frais">Dorade & Bar Frais</option>
                        <option value="Crevettes Royales">Crevettes Royales</option>
                        <option value="Autre Espèce">Autre espèce marine...</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ocean-300 mb-1.5">
                        {t.quote.incoterm}
                      </label>
                      <select
                        value={formData.incoterm}
                        onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-ocean-900/90 border border-ocean-700/80 text-white text-sm focus:outline-none focus:border-cyanCustom-400 transition-colors"
                      >
                        <option value="CIF">CIF (Port Destination)</option>
                        <option value="FOB">FOB (Port Marocain)</option>
                        <option value="CFR">CFR (Coût et Fret)</option>
                        <option value="EXW">EXW (Départ Usine)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ocean-300 mb-1.5">
                      {t.quote.quantity} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.estimated_quantity}
                      onChange={(e) => setFormData({ ...formData, estimated_quantity: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-ocean-900/90 border border-ocean-700/80 text-white text-sm focus:outline-none focus:border-cyanCustom-400 transition-colors"
                      placeholder="Ex: 1 Conteneur 40ft (26 Tonnes) ou 5 Tonnes Frais"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ocean-300 mb-1.5">
                      {t.quote.message}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-ocean-900/90 border border-ocean-700/80 text-white text-sm focus:outline-none focus:border-cyanCustom-400 transition-colors resize-none"
                      placeholder="Détails : calibres demandés, type de congélation (IQF/Block), date de livraison souhaitée..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyanCustom-500 via-sky-500 to-ocean-600 hover:from-cyanCustom-400 hover:to-ocean-500 text-white font-bold text-sm shadow-xl shadow-cyanCustom-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? t.quote.submitting : t.quote.submitBtn}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
