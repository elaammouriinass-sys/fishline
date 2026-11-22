"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { Product, Category } from "@/types";
import { getProducts } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, Send, Snowflake, Check, X, Layers, Fish } from "lucide-react";

export default function ProductsSection() {
  const { t, language, isRtl } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<Category | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProducts().then((data) => setProducts(data));
  }, []);

  const categories: Array<{ id: Category | 'all'; label: string }> = [
    { id: 'all', label: t.products.all },
    { id: 'pelagic', label: t.products.pelagic },
    { id: 'cephalopods', label: t.products.cephalopods },
    { id: 'fresh', label: t.products.fresh },
    { id: 'crustaceans', label: t.products.crustaceans },
  ];

  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter((p) => p.category === activeTab);

  return (
    <section id="produits" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-cyanCustom-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyanCustom-500/10 border border-cyanCustom-500/30 text-cyanCustom-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Fish className="w-3.5 h-3.5" />
            <span>{t.products.sectionBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {t.products.title}
          </h2>
          <p className="text-ocean-200 text-base sm:text-lg">
            {t.products.subtitle}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === cat.id
                  ? "bg-gradient-to-r from-cyanCustom-500 to-ocean-600 text-white shadow-lg shadow-cyanCustom-500/25 scale-105"
                  : "bg-ocean-900/60 hover:bg-ocean-800 text-ocean-200 border border-ocean-700/60 hover:border-cyanCustom-500/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const name = language === 'ar' ? product.name_ar : product.name_fr;
              const desc = language === 'ar' ? product.description_ar : product.description_fr;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  key={product.id}
                  className="glass-panel rounded-2xl overflow-hidden border border-ocean-800/80 flex flex-col group hover:border-cyanCustom-500/50 hover:bg-ocean-900/70 transition-all duration-300 shadow-xl"
                >
                  {/* Product Image */}
                  <div className="relative h-56 overflow-hidden bg-ocean-950">
                    <img
                      src={product.image_url}
                      alt={name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-transparent to-transparent opacity-80" />

                    {/* Preservation / Freezing Tag */}
                    <div className="absolute top-3 left-3 bg-ocean-950/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-cyanCustom-300 border border-cyanCustom-500/30 flex items-center gap-1 shadow">
                      <Snowflake className="w-3 h-3 text-cyanCustom-400" />
                      <span>{product.freezing_method || 'Frais'}</span>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 right-3">
                      {product.in_stock ? (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 backdrop-blur-md">
                          <Check className="w-3 h-3" />
                          <span>{t.products.inStock}</span>
                        </span>
                      ) : (
                        <span className="bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                          Rupture
                        </span>
                      )}
                    </div>

                    {/* FAO Zone */}
                    <div className="absolute bottom-3 left-3 text-[11px] text-ocean-300 font-medium">
                      {product.fao_zone}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] italic text-cyanCustom-400 block mb-1">
                        {product.scientific_name}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyanCustom-300 transition-colors">
                        {name}
                      </h3>
                      <p className="text-xs text-ocean-300 line-clamp-2 mb-4 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Calibers Preview */}
                    <div className="pt-3 border-t border-ocean-800/80 mb-4">
                      <span className="text-[11px] text-ocean-400 block mb-1.5 font-medium">
                        {t.products.calibers} :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {product.calibers?.slice(0, 3).map((cal, i) => (
                          <span
                            key={i}
                            className="bg-ocean-800/70 text-ocean-200 text-[10px] px-2 py-0.5 rounded border border-ocean-700/60"
                          >
                            {cal}
                          </span>
                        ))}
                        {product.calibers && product.calibers.length > 3 && (
                          <span className="text-[10px] text-cyanCustom-400 font-bold self-center">
                            +{product.calibers.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="py-2 px-3 rounded-lg bg-ocean-800/80 hover:bg-ocean-700 text-ocean-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-ocean-700/60 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyanCustom-400" />
                        <span>{t.products.viewSpecs}</span>
                      </button>
                      <a
                        href={`#contact`}
                        className="py-2 px-3 rounded-lg bg-gradient-to-r from-cyanCustom-500 to-ocean-600 hover:from-cyanCustom-400 hover:to-ocean-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition-all"
                      >
                        <Send className="w-3 h-3" />
                        <span>{t.products.orderQuote}</span>
                      </a>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Technical Specifications Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-ocean-900 border border-ocean-700 max-w-xl w-full rounded-2xl shadow-2xl overflow-hidden relative"
            >
              <div className="relative h-48 bg-ocean-950">
                <img
                  src={selectedProduct.image_url}
                  alt={language === 'ar' ? selectedProduct.name_ar : selectedProduct.name_fr}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-900 to-transparent" />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-ocean-950/80 hover:bg-ocean-800 text-white p-1.5 rounded-full border border-ocean-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <span className="text-xs italic text-cyanCustom-400 block mb-1">
                  {selectedProduct.scientific_name}
                </span>
                <h3 className="text-2xl font-black text-white mb-3">
                  {language === 'ar' ? selectedProduct.name_ar : selectedProduct.name_fr}
                </h3>
                <p className="text-sm text-ocean-200 mb-6 leading-relaxed">
                  {language === 'ar' ? selectedProduct.description_ar : selectedProduct.description_fr}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-6 bg-ocean-950/60 p-4 rounded-xl border border-ocean-800">
                  <div>
                    <span className="text-ocean-400 block mb-0.5">{t.products.origin} :</span>
                    <span className="font-bold text-white">{selectedProduct.origin}</span>
                  </div>
                  <div>
                    <span className="text-ocean-400 block mb-0.5">Zone FAO :</span>
                    <span className="font-bold text-cyanCustom-300">{selectedProduct.fao_zone}</span>
                  </div>
                  <div>
                    <span className="text-ocean-400 block mb-0.5">{t.products.preservation} :</span>
                    <span className="font-bold text-white">{selectedProduct.freezing_method}</span>
                  </div>
                  <div>
                    <span className="text-ocean-400 block mb-0.5">{t.products.packaging} :</span>
                    <span className="font-bold text-white">{selectedProduct.packaging}</span>
                  </div>
                </div>

                {/* Calibers list */}
                <div className="mb-6">
                  <span className="text-xs font-semibold text-ocean-300 block mb-2">
                    {t.products.calibers} :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.calibers.map((c, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-cyanCustom-500/10 border border-cyanCustom-500/30 text-cyanCustom-300 text-xs font-bold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 rounded-xl bg-ocean-800 text-ocean-300 hover:text-white text-xs font-semibold"
                  >
                    Fermer
                  </button>
                  <a
                    href="#contact"
                    onClick={() => setSelectedProduct(null)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyanCustom-500 to-ocean-600 text-white text-xs font-bold shadow hover:scale-105 transition-transform"
                  >
                    {t.products.orderQuote}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
