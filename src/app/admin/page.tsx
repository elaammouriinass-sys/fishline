"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, QuoteRequest, Category } from "@/types";
import { getProducts, saveProduct, deleteProduct, getQuotes, isSupabaseConfigured } from "@/lib/supabase";
import { 
  Anchor, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, 
  Database, ArrowLeft, Search, Eye, RefreshCw, LogOut, Package, MailCheck
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'quotes'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Product Edit/Add Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("fishline_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pData, qData] = await Promise.all([getProducts(), getQuotes()]);
      setProducts(pData);
      setQuotes(qData);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fishline_admin_auth");
    router.push("/admin/login");
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name_fr || !editingProduct?.id) {
      toast.error("Veuillez renseigner les champs obligatoires (ID et Nom FR)");
      return;
    }

    const prodToSave: Product = {
      id: editingProduct.id,
      name_fr: editingProduct.name_fr || "",
      name_ar: editingProduct.name_ar || editingProduct.name_fr || "",
      scientific_name: editingProduct.scientific_name || "",
      category: (editingProduct.category as Category) || "pelagic",
      description_fr: editingProduct.description_fr || "",
      description_ar: editingProduct.description_ar || "",
      calibers: Array.isArray(editingProduct.calibers)
        ? editingProduct.calibers
        : (editingProduct.calibers as unknown as string || "").split(",").map(s => s.trim()).filter(Boolean),
      freezing_method: editingProduct.freezing_method || "IQF",
      origin: editingProduct.origin || "Maroc",
      fao_zone: editingProduct.fao_zone || "Zone FAO 34",
      packaging: editingProduct.packaging || "Cartons de 10kg",
      image_url: editingProduct.image_url || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      in_stock: editingProduct.in_stock ?? true,
      featured: editingProduct.featured ?? false,
    };

    await saveProduct(prodToSave);
    toast.success("Produit enregistré avec succès !");
    setModalOpen(false);
    setEditingProduct(null);
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit marin ?")) {
      await deleteProduct(id);
      toast.success("Produit supprimé");
      fetchData();
    }
  };

  const filteredProducts = products.filter(p => 
    p.name_fr.toLowerCase().includes(search.toLowerCase()) || 
    p.scientific_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-ocean-950 text-white pb-20">
      {/* Top Header */}
      <header className="bg-ocean-900 border-b border-ocean-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyanCustom-500 to-ocean-700 flex items-center justify-center">
                <Anchor className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl tracking-wider">FISHLINE</span>
              <span className="text-xs bg-cyanCustom-500/20 text-cyanCustom-400 font-bold px-2 py-0.5 rounded border border-cyanCustom-500/30">
                ADMIN
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-ocean-300 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ocean-800 hover:bg-ocean-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voir le Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Supabase Status Banner */}
        <div className={`mb-8 p-4 rounded-2xl border flex items-center justify-between ${
          isSupabaseConfigured 
            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200" 
            : "bg-cyanCustom-950/40 border-cyanCustom-500/30 text-cyanCustom-200"
        }`}>
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-cyanCustom-400 shrink-0" />
            <div>
              <p className="text-sm font-bold">
                {isSupabaseConfigured 
                  ? "Connecté à la base Supabase PostgreSQL" 
                  : "Mode Stockage Local / Démo Actif"}
              </p>
              <p className="text-xs opacity-80">
                {isSupabaseConfigured 
                  ? "Toutes les modifications sont synchronisées avec votre base de données cloud." 
                  : "Vos données sont sauvegardées localement. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sur Vercel pour le cloud."}
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Rafraîchir les données"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-5 rounded-2xl border border-ocean-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ocean-300 uppercase font-semibold">Total Produits</span>
              <Package className="w-5 h-5 text-cyanCustom-400" />
            </div>
            <div className="text-3xl font-black text-white">{products.length}</div>
            <span className="text-[11px] text-emerald-400">
              {products.filter(p => p.in_stock).length} disponibles en stock
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-ocean-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ocean-300 uppercase font-semibold">Demandes de Devis</span>
              <MailCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-3xl font-black text-white">{quotes.length}</div>
            <span className="text-[11px] text-cyanCustom-300">
              Demandes B2B reçues
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-ocean-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ocean-300 uppercase font-semibold">Catégories Actives</span>
              <Anchor className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">4</div>
            <span className="text-[11px] text-ocean-400">
              Frais, Congelés, Céphalopodes, Pélagiques
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-ocean-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'products'
                  ? "bg-cyanCustom-500 text-white shadow-lg shadow-cyanCustom-500/20"
                  : "text-ocean-300 hover:text-white hover:bg-ocean-900"
              }`}
            >
              Gestion des Produits ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'quotes'
                  ? "bg-cyanCustom-500 text-white shadow-lg shadow-cyanCustom-500/20"
                  : "text-ocean-300 hover:text-white hover:bg-ocean-900"
              }`}
            >
              Demandes de Devis ({quotes.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={() => {
                setEditingProduct({
                  id: `prod-${Date.now()}`,
                  name_fr: "",
                  name_ar: "",
                  category: "pelagic",
                  scientific_name: "",
                  calibers: ["T1", "T2"],
                  freezing_method: "IQF",
                  origin: "Maroc",
                  fao_zone: "Zone FAO 34",
                  packaging: "Cartons de 10kg",
                  in_stock: true,
                  featured: false,
                  image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
                });
                setModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyanCustom-500 to-ocean-600 hover:from-cyanCustom-400 hover:to-ocean-500 text-white text-xs font-bold flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Produit</span>
            </button>
          )}
        </div>

        {/* Products Tab View */}
        {activeTab === 'products' && (
          <div>
            {/* Search Filter */}
            <div className="mb-6 relative max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ocean-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, espèce ou catégorie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-ocean-900/80 border border-ocean-800 text-white text-sm focus:outline-none focus:border-cyanCustom-400"
              />
            </div>

            {/* Table */}
            <div className="glass-panel rounded-2xl border border-ocean-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-ocean-900/90 text-ocean-300 text-xs uppercase border-b border-ocean-800">
                    <tr>
                      <th className="px-5 py-3">Produit</th>
                      <th className="px-5 py-3">Catégorie</th>
                      <th className="px-5 py-3">Zone / Conservation</th>
                      <th className="px-5 py-3">Calibres</th>
                      <th className="px-5 py-3">Statut</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ocean-800/60">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-ocean-900/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image_url}
                              alt={p.name_fr}
                              className="w-12 h-12 rounded-lg object-cover bg-ocean-950 border border-ocean-800"
                            />
                            <div>
                              <div className="font-bold text-white">{p.name_fr}</div>
                              <div className="text-xs text-ocean-400 italic">{p.scientific_name}</div>
                              <div className="text-[11px] text-cyanCustom-400">{p.name_ar}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-ocean-800 text-ocean-200 border border-ocean-700">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-ocean-300">
                          <div>{p.fao_zone}</div>
                          <div className="font-semibold text-white">{p.freezing_method}</div>
                        </td>
                        <td className="px-5 py-4 text-xs text-ocean-300">
                          {p.calibers?.join(", ") || "-"}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={async () => {
                              const updated = { ...p, in_stock: !p.in_stock };
                              await saveProduct(updated);
                              fetchData();
                            }}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                              p.in_stock
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}
                          >
                            {p.in_stock ? "En Stock" : "Rupture"}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-ocean-800 hover:bg-ocean-700 text-ocean-200 hover:text-white"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Quotes Tab View */}
        {activeTab === 'quotes' && (
          <div className="glass-panel rounded-2xl border border-ocean-800 overflow-hidden">
            {quotes.length === 0 ? (
              <div className="p-12 text-center text-ocean-400 text-sm">
                Aucune demande de devis reçue pour le moment.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-ocean-900/90 text-ocean-300 text-xs uppercase border-b border-ocean-800">
                    <tr>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Entreprise</th>
                      <th className="px-5 py-3">Contact</th>
                      <th className="px-5 py-3">Produit & Quantité</th>
                      <th className="px-5 py-3">Incoterm</th>
                      <th className="px-5 py-3">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ocean-800/60">
                    {quotes.map((q, idx) => (
                      <tr key={q.id || idx} className="hover:bg-ocean-900/40">
                        <td className="px-5 py-4 text-xs text-ocean-400 whitespace-nowrap">
                          {q.created_at ? new Date(q.created_at).toLocaleDateString() : "Récemment"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-white">{q.company_name}</div>
                          <div className="text-xs text-ocean-400">{q.country}</div>
                        </td>
                        <td className="px-5 py-4 text-xs">
                          <div className="text-white font-medium">{q.contact_name}</div>
                          <div className="text-cyanCustom-400">{q.email}</div>
                          <div className="text-ocean-300">{q.phone}</div>
                        </td>
                        <td className="px-5 py-4 text-xs">
                          <div className="font-semibold text-white">{q.product_name}</div>
                          <div className="text-ocean-300">{q.estimated_quantity}</div>
                        </td>
                        <td className="px-5 py-4 text-xs">
                          <span className="px-2 py-0.5 rounded bg-cyanCustom-500/20 text-cyanCustom-300 font-bold">
                            {q.incoterm || "CIF"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-ocean-300 max-w-xs truncate">
                          {q.message || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal Add / Edit Product */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-ocean-900 border border-ocean-700 max-w-2xl w-full rounded-2xl shadow-2xl p-6 my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingProduct.id?.startsWith("prod-") ? "Ajouter un Produit" : "Modifier le Produit"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-ocean-300 mb-1 font-semibold">Identifiant Unique (ID) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.id || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-ocean-300 mb-1 font-semibold">Catégorie *</label>
                  <select
                    value={editingProduct.category || "pelagic"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Category })}
                    className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white"
                  >
                    <option value="pelagic">Pélagiques (Sardine, Maquereau)</option>
                    <option value="cephalopods">Céphalopodes (Poulpe, Calmar, Seiche)</option>
                    <option value="fresh">Poissons Frais (Dorade, Bar)</option>
                    <option value="crustaceans">Crustacés (Crevettes)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-ocean-300 mb-1 font-semibold">Nom Français *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_fr || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_fr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-ocean-300 mb-1 font-semibold">Nom Arabe</label>
                  <input
                    type="text"
                    value={editingProduct.name_ar || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-ocean-300 mb-1 font-semibold">Nom Scientifique</label>
                  <input
                    type="text"
                    value={editingProduct.scientific_name || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, scientific_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-ocean-300 mb-1 font-semibold">Conservation / T°</label>
                  <input
                    type="text"
                    value={editingProduct.freezing_method || "IQF"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, freezing_method: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-ocean-300 mb-1 font-semibold">Zone FAO</label>
                  <input
                    type="text"
                    value={editingProduct.fao_zone || "Zone FAO 34"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fao_zone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ocean-300 mb-1 font-semibold">Calibres (séparés par des virgules)</label>
                <input
                  type="text"
                  value={Array.isArray(editingProduct.calibers) ? editingProduct.calibers.join(", ") : (editingProduct.calibers || "")}
                  onChange={(e) => setEditingProduct({ ...editingProduct, calibers: e.target.value.split(",").map(s => s.trim()) })}
                  className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white"
                  placeholder="Ex: T1, T2, T3 ou 16-20 pcs/kg"
                />
              </div>

              <div>
                <label className="block text-ocean-300 mb-1 font-semibold">URL de l&apos;Image</label>
                <input
                  type="text"
                  value={editingProduct.image_url || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-ocean-300 mb-1 font-semibold">Description (Français)</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description_fr || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_fr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-ocean-300 mb-1 font-semibold">Description (Arabe)</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description_ar || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_ar: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white text-right"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={editingProduct.in_stock ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, in_stock: e.target.checked })}
                    className="w-4 h-4 rounded text-cyanCustom-500"
                  />
                  <span>Disponible en Stock</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-ocean-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-white text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyanCustom-500 hover:bg-cyanCustom-400 text-white text-xs font-bold shadow"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
