"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, QuoteRequest, Category, GalleryItem } from "@/types";
import { 
  getProducts, saveProduct, deleteProduct, 
  getQuotes, 
  getGalleryImages, saveGalleryImage, deleteGalleryImage,
  fileToBase64,
  isSupabaseConfigured 
} from "@/lib/supabase";
import { 
  Anchor, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, 
  Database, ArrowLeft, Search, Eye, RefreshCw, LogOut, Package, 
  MailCheck, Image as ImageIcon, Upload, Copy, Check, ExternalLink, X, Images,
  Camera, Sparkles, SlidersHorizontal, CheckCheck
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'product-photos' | 'gallery' | 'quotes'>('product-photos');
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [photoCategoryFilter, setPhotoCategoryFilter] = useState<Category | 'all'>('all');

  // Product Add/Edit Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Gallery Add/Edit Modal
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<Partial<GalleryItem> | null>(null);

  // Quick Media Picker for Product
  const [pickerModalOpen, setPickerModalOpen] = useState(false);
  const [targetProductForPicker, setTargetProductForPicker] = useState<Product | null>(null);

  // Full Screen Image Preview Modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Inline URL inputs state for product-photos tab
  const [quickUrls, setQuickUrls] = useState<Record<string, string>>({});

  // File input refs
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

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
      const [pData, gData, qData] = await Promise.all([
        getProducts(),
        getGalleryImages(),
        getQuotes()
      ]);
      setProducts(pData);
      setGallery(gData);
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

  // ---------------- DIRECT PRODUCT PHOTO UPDATE ----------------

  const handleDirectProductPhotoUpload = async (product: Product, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP)");
      return;
    }
    try {
      toast.loading(`Mise à jour de la photo de ${product.name_fr}...`);
      const base64 = await fileToBase64(file);
      const updated = { ...product, image_url: base64 };
      await saveProduct(updated);
      await fetchData();
      toast.dismiss();
      toast.success(`Photo de "${product.name_fr}" modifiée avec succès ! 📸`);
    } catch (e) {
      toast.dismiss();
      toast.error("Erreur lors du chargement de l'image");
    }
  };

  const handleDirectProductPhotoUrl = async (product: Product, newUrl: string) => {
    if (!newUrl || !newUrl.trim()) return;
    try {
      toast.loading("Mise à jour de la photo...");
      const updated = { ...product, image_url: newUrl.trim() };
      await saveProduct(updated);
      await fetchData();
      toast.dismiss();
      toast.success(`Photo de "${product.name_fr}" mise à jour ! 📸`);
    } catch (e) {
      toast.dismiss();
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // ---------------- PRODUCTS HANDLERS ----------------

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
    setProductModalOpen(false);
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

  const handleProductFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP)");
      return;
    }

    try {
      toast.loading("Chargement de l'image...");
      const base64 = await fileToBase64(file);
      setEditingProduct(prev => prev ? { ...prev, image_url: base64 } : null);
      toast.dismiss();
      toast.success("Photo chargée avec succès !");
    } catch (err) {
      toast.dismiss();
      toast.error("Erreur lors de la lecture du fichier");
    }
  };

  // ---------------- GALLERY & PHOTOS HANDLERS ----------------

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem?.url || !editingGalleryItem?.title_fr) {
      toast.error("Veuillez ajouter une image et un titre");
      return;
    }

    const itemToSave: GalleryItem = {
      id: editingGalleryItem.id || `gal-${Date.now()}`,
      url: editingGalleryItem.url,
      title_fr: editingGalleryItem.title_fr,
      title_ar: editingGalleryItem.title_ar || editingGalleryItem.title_fr,
      category: editingGalleryItem.category || "Galerie",
      created_at: editingGalleryItem.created_at || new Date().toISOString()
    };

    await saveGalleryImage(itemToSave);
    toast.success("Photo enregistrée dans la médiathèque !");
    setGalleryModalOpen(false);
    setEditingGalleryItem(null);
    fetchData();
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (confirm("Supprimer cette photo de la galerie ?")) {
      await deleteGalleryImage(id);
      toast.success("Photo supprimée");
      fetchData();
    }
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    try {
      toast.loading("Traitement de l'image...");
      const base64 = await fileToBase64(file);
      setEditingGalleryItem(prev => ({
        ...prev,
        url: base64,
        title_fr: prev?.title_fr || file.name.replace(/\.[^/.]+$/, ""),
        id: prev?.id || `gal-${Date.now()}`
      }));
      toast.dismiss();
      toast.success("Image importée avec succès !");
    } catch (err) {
      toast.dismiss();
      toast.error("Erreur lors de la lecture du fichier");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Lien de l'image copié dans le presse-papier !");
  };

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name_fr.toLowerCase().includes(search.toLowerCase()) || 
      p.name_ar.toLowerCase().includes(search.toLowerCase()) || 
      p.scientific_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = photoCategoryFilter === 'all' || p.category === photoCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredGallery = gallery.filter(g =>
    g.title_fr.toLowerCase().includes(search.toLowerCase()) ||
    g.category?.toLowerCase().includes(search.toLowerCase())
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
                  ? "Base de données Supabase Connectée" 
                  : "Médiathèque & Base Locale Active"}
              </p>
              <p className="text-xs opacity-80">
                {isSupabaseConfigured 
                  ? "Vos produits, photos et devis sont synchronisés en direct avec votre base PostgreSQL." 
                  : "Modifications sauvegardées localement. Prêt pour synchronisation cloud via Vercel."}
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
          <div 
            onClick={() => setActiveTab('product-photos')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'product-photos'
                ? "bg-cyanCustom-500/15 border-cyanCustom-500/60 shadow-lg shadow-cyanCustom-500/10"
                : "glass-panel border-ocean-800 hover:border-cyanCustom-500/40"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-cyanCustom-300 uppercase font-bold">Photos Produits (Direct)</span>
              <Camera className="w-5 h-5 text-cyanCustom-400" />
            </div>
            <div className="text-3xl font-black text-white">{products.length}</div>
            <span className="text-[11px] text-cyanCustom-300">
              Modifier les photos en 1 clic
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('products')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'products'
                ? "bg-cyanCustom-500/15 border-cyanCustom-500/60 shadow-lg shadow-cyanCustom-500/10"
                : "glass-panel border-ocean-800 hover:border-cyanCustom-500/40"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ocean-300 uppercase font-semibold">Tableau Produits</span>
              <Package className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-3xl font-black text-white">{products.length}</div>
            <span className="text-[11px] text-emerald-400">
              {products.filter(p => p.in_stock).length} disponibles en stock
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('gallery')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'gallery'
                ? "bg-cyanCustom-500/15 border-cyanCustom-500/60 shadow-lg shadow-cyanCustom-500/10"
                : "glass-panel border-ocean-800 hover:border-cyanCustom-500/40"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ocean-300 uppercase font-semibold">Galerie du Site</span>
              <ImageIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">{gallery.length}</div>
            <span className="text-[11px] text-ocean-300">
              Photos dans la galerie
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('quotes')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'quotes'
                ? "bg-cyanCustom-500/15 border-cyanCustom-500/60 shadow-lg shadow-cyanCustom-500/10"
                : "glass-panel border-ocean-800 hover:border-cyanCustom-500/40"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ocean-300 uppercase font-semibold">Demandes de Devis</span>
              <MailCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">{quotes.length}</div>
            <span className="text-[11px] text-ocean-400">
              Demandes B2B reçues
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-ocean-800 pb-4 mb-6 gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('product-photos')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'product-photos'
                  ? "bg-gradient-to-r from-cyanCustom-500 to-ocean-600 text-white shadow-lg shadow-cyanCustom-500/25 scale-[1.02]"
                  : "text-cyanCustom-300 bg-ocean-900/60 hover:text-white hover:bg-ocean-900 border border-ocean-800"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>🖼️ Photos des Produits ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'products'
                  ? "bg-cyanCustom-500 text-white shadow-lg shadow-cyanCustom-500/20"
                  : "text-ocean-300 hover:text-white hover:bg-ocean-900"
              }`}
            >
              📦 Fiches & Textes ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'gallery'
                  ? "bg-cyanCustom-500 text-white shadow-lg shadow-cyanCustom-500/20"
                  : "text-ocean-300 hover:text-white hover:bg-ocean-900"
              }`}
            >
              📸 Galerie du Site ({gallery.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'quotes'
                  ? "bg-cyanCustom-500 text-white shadow-lg shadow-cyanCustom-500/20"
                  : "text-ocean-300 hover:text-white hover:bg-ocean-900"
              }`}
            >
              📩 Devis B2B ({quotes.length})
            </button>
          </div>

          {/* Action Button for Active Tab */}
          <div>
            {(activeTab === 'products' || activeTab === 'product-photos') && (
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
                  setProductModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyanCustom-500 to-ocean-600 hover:from-cyanCustom-400 hover:to-ocean-500 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Produit</span>
              </button>
            )}

            {activeTab === 'gallery' && (
              <button
                onClick={() => {
                  setEditingGalleryItem({
                    id: `gal-${Date.now()}`,
                    url: "",
                    title_fr: "",
                    title_ar: "",
                    category: "Galerie",
                  });
                  setGalleryModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyanCustom-500 to-ocean-600 hover:from-cyanCustom-400 hover:to-ocean-500 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* ----------------- TAB 1: DEDICATED PRODUCT PHOTOS STUDIO ----------------- */}
        {activeTab === 'product-photos' && (
          <div>
            {/* Studio Header Banner */}
            <div className="mb-8 p-6 rounded-3xl glass-panel border border-cyanCustom-500/30 bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyanCustom-500/20 border border-cyanCustom-500/40 text-cyanCustom-300 text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Espace Dédié : Photos des Produits</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Modifiez les photos de tous vos produits en 1 seul clic
                  </h3>
                  <p className="text-xs sm:text-sm text-ocean-300 mt-1 max-w-3xl leading-relaxed">
                    Toutes les photos des poissons et fruits de mer sont regroupées ici. Cliquez sur n&apos;importe quelle photo ou sur le bouton <span className="text-cyanCustom-300 font-bold">&quot;Téléverser&quot;</span> pour changer l&apos;image immédiatement depuis votre PC ou téléphone. La mise à jour est instantanée !
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="mt-6 pt-5 border-t border-ocean-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                  {(['all', 'pelagic', 'cephalopods', 'fresh', 'crustaceans'] as const).map((cat) => {
                    const labels: Record<string, string> = {
                      all: "Tous les produits",
                      pelagic: "Pélagiques (Sardine, Maquereau)",
                      cephalopods: "Céphalopodes (Poulpe, Calmar)",
                      fresh: "Poissons Frais (Dorade, Bar)",
                      crustaceans: "Crustacés (Crevettes)"
                    };
                    return (
                      <button
                        key={cat}
                        onClick={() => setPhotoCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          photoCategoryFilter === cat
                            ? "bg-cyanCustom-500 text-white shadow-md shadow-cyanCustom-500/20"
                            : "bg-ocean-900 text-ocean-300 hover:text-white hover:bg-ocean-800 border border-ocean-800"
                        }`}
                      >
                        {labels[cat]}
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ocean-400" />
                  <input
                    type="text"
                    placeholder="Chercher un produit..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-ocean-950 border border-ocean-700 text-white text-xs focus:outline-none focus:border-cyanCustom-400"
                  />
                </div>
              </div>
            </div>

            {/* Visual Photos Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                const inputId = `file-upload-${p.id}`;
                return (
                  <div
                    key={p.id}
                    className="glass-panel rounded-2xl border border-ocean-800 hover:border-cyanCustom-500/50 overflow-hidden flex flex-col group transition-all duration-300 shadow-xl bg-ocean-950/70"
                  >
                    {/* Hidden input for direct file upload */}
                    <input
                      type="file"
                      id={inputId}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDirectProductPhotoUpload(p, file);
                      }}
                    />

                    {/* Big Interactive Photo Container */}
                    <div
                      onClick={() => document.getElementById(inputId)?.click()}
                      className="relative h-56 bg-ocean-950 cursor-pointer overflow-hidden group/img"
                      title="Cliquez pour changer la photo"
                    >
                      <img
                        src={p.image_url}
                        alt={p.name_fr}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-transparent to-transparent opacity-80" />

                      {/* Hover Overlay with Camera Icon */}
                      <div className="absolute inset-0 bg-ocean-950/70 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-2 transition-all p-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-cyanCustom-500 text-white flex items-center justify-center shadow-lg transform group-hover/img:scale-110 transition-transform">
                          <Camera className="w-6 h-6" />
                        </div>
                        <span className="text-white font-bold text-xs">
                          Changer la photo
                        </span>
                        <span className="text-[10px] text-cyanCustom-300">
                          (Cliquez pour choisir un fichier)
                        </span>
                      </div>

                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-ocean-950/85 text-cyanCustom-300 border border-cyanCustom-500/30 backdrop-blur-md">
                        {p.category}
                      </span>

                      {/* Zoom Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(p.image_url);
                        }}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-ocean-950/80 text-ocean-300 hover:text-white hover:bg-ocean-800 transition-colors"
                        title="Voir en grand format"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Stock Pill */}
                      <div className="absolute bottom-3 left-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.in_stock 
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}>
                          {p.in_stock ? "En Stock" : "Rupture"}
                        </span>
                      </div>
                    </div>

                    {/* Card Content & Actions */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="mb-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-white line-clamp-1">
                            {p.name_fr}
                          </h4>
                          <span className="text-[10px] text-ocean-400 font-mono shrink-0">
                            {p.freezing_method || "IQF"}
                          </span>
                        </div>
                        <p className="text-xs text-cyanCustom-400 font-medium text-right mt-0.5">
                          {p.name_ar}
                        </p>
                        <p className="text-[11px] text-ocean-400 italic mt-0.5">
                          {p.scientific_name}
                        </p>
                      </div>

                      {/* Direct Upload & Replace Buttons */}
                      <div className="space-y-2 pt-2 border-t border-ocean-850">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => document.getElementById(inputId)?.click()}
                            className="py-2 px-2.5 rounded-xl bg-cyanCustom-500 hover:bg-cyanCustom-400 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md transition-all"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Téléverser</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setTargetProductForPicker(p);
                              setPickerModalOpen(true);
                            }}
                            className="py-2 px-2.5 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-ocean-200 hover:text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 border border-ocean-700 transition-all"
                            title="Choisir une photo depuis la médiathèque"
                          >
                            <Images className="w-3.5 h-3.5 text-cyanCustom-400" />
                            <span>Médiathèque</span>
                          </button>
                        </div>

                        {/* Inline Quick URL input */}
                        <div className="flex items-center gap-1 pt-1">
                          <input
                            type="text"
                            placeholder="Ou coller une URL..."
                            value={quickUrls[p.id] !== undefined ? quickUrls[p.id] : ""}
                            onChange={(e) => setQuickUrls({ ...quickUrls, [p.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleDirectProductPhotoUrl(p, quickUrls[p.id]);
                                setQuickUrls({ ...quickUrls, [p.id]: "" });
                              }
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-ocean-900 border border-ocean-750 text-white text-[11px] focus:outline-none focus:border-cyanCustom-400 placeholder:text-ocean-500"
                          />
                          {quickUrls[p.id] && (
                            <button
                              type="button"
                              onClick={() => {
                                handleDirectProductPhotoUrl(p, quickUrls[p.id]);
                                setQuickUrls({ ...quickUrls, [p.id]: "" });
                              }}
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 transition-colors"
                              title="Enregistrer cette URL"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Full Edit Link */}
                        <div className="pt-1 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(p);
                              setProductModalOpen(true);
                            }}
                            className="text-[11px] text-ocean-400 hover:text-cyanCustom-300 flex items-center justify-center gap-1 mx-auto transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Modifier toutes les infos du produit</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: TABLE PRODUCTS ----------------- */}
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
                      <th className="px-5 py-3">Photo & Produit</th>
                      <th className="px-5 py-3">Catégorie</th>
                      <th className="px-5 py-3">Zone / Conservation</th>
                      <th className="px-5 py-3">Calibres</th>
                      <th className="px-5 py-3">Statut</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ocean-800/60">
                    {filteredProducts.map((p) => {
                      const inputId = `table-file-${p.id}`;
                      return (
                        <tr key={p.id} className="hover:bg-ocean-900/40 transition-colors">
                          <td className="px-5 py-4">
                            <input
                              type="file"
                              id={inputId}
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleDirectProductPhotoUpload(p, file);
                              }}
                            />
                            <div className="flex items-center gap-3">
                              <div 
                                onClick={() => document.getElementById(inputId)?.click()}
                                className="relative group/pic cursor-pointer"
                                title="Cliquer pour changer la photo directement"
                              >
                                <img
                                  src={p.image_url}
                                  alt={p.name_fr}
                                  className="w-14 h-14 rounded-xl object-cover bg-ocean-950 border border-ocean-800 shadow group-hover/pic:border-cyanCustom-400 transition-colors"
                                />
                                <div className="absolute inset-0 bg-ocean-950/70 rounded-xl opacity-0 group-hover/pic:opacity-100 flex items-center justify-center transition-opacity">
                                  <Camera className="w-5 h-5 text-cyanCustom-400" />
                                </div>
                              </div>
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
                                  setProductModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-ocean-800 hover:bg-ocean-700 text-ocean-200 hover:text-white"
                                title="Modifier le produit et sa photo"
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: GALLERY & MEDIA MANAGER ----------------- */}
        {activeTab === 'gallery' && (
          <div>
            {/* Gallery Intro Banner */}
            <div className="mb-6 p-6 rounded-2xl glass-panel border border-cyanCustom-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-cyanCustom-400" />
                  <span>Gestionnaire d&apos;Images & Galerie du Site</span>
                </h3>
                <p className="text-xs text-ocean-300 mt-1 max-w-2xl">
                  Gérez, modifiez et téléversez les photos du site et de la galerie. Vous pouvez téléverser directement des photos depuis votre ordinateur ou téléphone, ou coller des URLs web.
                </p>
              </div>

              {/* Direct Quick Upload Button */}
              <div>
                <input
                  type="file"
                  ref={galleryFileInputRef}
                  onChange={handleGalleryFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => {
                    setEditingGalleryItem({
                      id: `gal-${Date.now()}`,
                      url: "",
                      title_fr: "",
                      title_ar: "",
                      category: "Galerie",
                    });
                    setGalleryModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyanCustom-500/20 hover:bg-cyanCustom-500/30 text-cyanCustom-300 border border-cyanCustom-500/40 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>Téléverser depuis l&apos;appareil</span>
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel rounded-2xl border border-ocean-800 overflow-hidden flex flex-col group hover:border-cyanCustom-500/50 transition-all shadow-xl"
                >
                  {/* Photo Display */}
                  <div className="relative h-48 bg-ocean-950 overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.title_fr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/90 via-transparent to-transparent" />

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-ocean-950/80 text-cyanCustom-300 border border-cyanCustom-500/30 backdrop-blur-md">
                      {item.category || "Galerie"}
                    </span>

                    {/* Full Preview Icon Button */}
                    <button
                      onClick={() => setPreviewImage(item.url)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-ocean-900/80 text-ocean-200 hover:text-white hover:bg-ocean-800 transition-colors"
                      title="Aperçu grand format"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body & Actions */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="mb-3">
                      <h4 className="font-bold text-sm text-white line-clamp-1">
                        {item.title_fr}
                      </h4>
                      {item.title_ar && (
                        <p className="text-xs text-cyanCustom-400 mt-0.5 text-right font-medium">
                          {item.title_ar}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-ocean-850 flex items-center justify-between text-xs">
                      <button
                        onClick={() => copyToClipboard(item.url)}
                        className="text-ocean-400 hover:text-white flex items-center gap-1 transition-colors"
                        title="Copier le lien de la photo"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier URL</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingGalleryItem(item);
                            setGalleryModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-ocean-800 hover:bg-ocean-700 text-ocean-200 hover:text-white"
                          title="Modifier la photo"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                          title="Supprimer la photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: QUOTES ----------------- */}
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

      {/* ================= MODAL: AJOUTER / MODIFIER PHOTO GALERIE ================= */}
      {galleryModalOpen && editingGalleryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-ocean-900 border border-ocean-700 max-w-lg w-full rounded-2xl shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyanCustom-400" />
                <span>{editingGalleryItem.id?.startsWith("gal-") ? "Ajouter une Photo" : "Modifier la Photo"}</span>
              </h3>
              <button
                onClick={() => setGalleryModalOpen(false)}
                className="text-ocean-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4 text-xs">
              
              {/* Photo Preview & Upload Box */}
              <div>
                <label className="block text-ocean-300 mb-2 font-semibold">Image *</label>
                
                {editingGalleryItem.url ? (
                  <div className="relative h-44 rounded-xl overflow-hidden border border-ocean-700 bg-ocean-950 mb-3 group">
                    <img
                      src={editingGalleryItem.url}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-ocean-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-cyanCustom-500 text-white font-bold text-xs"
                      >
                        Changer la photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingGalleryItem(prev => ({ ...prev, url: "" }))}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="border-2 border-dashed border-ocean-700 hover:border-cyanCustom-400 rounded-xl p-6 text-center cursor-pointer bg-ocean-950/60 hover:bg-ocean-900 transition-all mb-3"
                  >
                    <Upload className="w-8 h-8 text-cyanCustom-400 mx-auto mb-2" />
                    <p className="text-white font-bold">Cliquez pour téléverser depuis votre appareil</p>
                    <p className="text-ocean-400 text-[11px] mt-1">Formats acceptés : JPG, PNG, WebP</p>
                  </div>
                )}

                <input
                  type="file"
                  ref={galleryFileInputRef}
                  onChange={handleGalleryFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div>
                  <label className="block text-ocean-400 mb-1">Ou collez une URL d&apos;image :</label>
                  <input
                    type="text"
                    value={editingGalleryItem.url || ""}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ocean-300 mb-1 font-semibold">Titre de la photo (Français) *</label>
                <input
                  type="text"
                  required
                  value={editingGalleryItem.title_fr || ""}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title_fr: e.target.value })}
                  placeholder="Ex: Unité de calibrage et surgélation à Dakhla"
                  className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white"
                />
              </div>

              <div>
                <label className="block text-ocean-300 mb-1 font-semibold">Titre de la photo (Arabe)</label>
                <input
                  type="text"
                  value={editingGalleryItem.title_ar || ""}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title_ar: e.target.value })}
                  placeholder="وحدة التجميد وفرز الأسماك بالداخلة"
                  className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white text-right"
                />
              </div>

              <div>
                <label className="block text-ocean-300 mb-1 font-semibold">Catégorie / Emplacement</label>
                <select
                  value={editingGalleryItem.category || "Galerie"}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ocean-950 border border-ocean-700 text-white"
                >
                  <option value="Galerie">Galerie Générale</option>
                  <option value="Ports & Bateaux">Ports & Bateaux de Pêche</option>
                  <option value="Chambres Froides">Chambres Froides & Surgélation</option>
                  <option value="Conditionnement">Conditionnement & Emballage</option>
                  <option value="Océan & Côtes">Océan & Côtes Marocaines</option>
                  <option value="Logistique & Fret">Logistique & Fret Export</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-ocean-800">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-white text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyanCustom-500 hover:bg-cyanCustom-400 text-white text-xs font-bold shadow"
                >
                  Enregistrer la Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: AJOUTER / MODIFIER PRODUIT ================= */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-ocean-900 border border-ocean-700 max-w-2xl w-full rounded-2xl shadow-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                {editingProduct.id?.startsWith("prod-") ? "Ajouter un Produit Marin" : "Modifier le Produit"}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-ocean-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* Product Photo Upload Section */}
              <div className="p-4 rounded-xl bg-ocean-950/80 border border-ocean-800">
                <label className="block text-ocean-200 mb-2 font-bold text-xs">Photo du Produit</label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {editingProduct.image_url ? (
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-ocean-700 shrink-0 bg-ocean-900">
                      <img
                        src={editingProduct.image_url}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-xl border-2 border-dashed border-ocean-700 flex items-center justify-center text-ocean-400 shrink-0">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="file"
                      ref={productFileInputRef}
                      onChange={handleProductFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => productFileInputRef.current?.click()}
                        className="px-3 py-2 rounded-xl bg-cyanCustom-500/20 hover:bg-cyanCustom-500/30 text-cyanCustom-300 border border-cyanCustom-500/40 font-semibold flex items-center gap-1.5"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Téléverser depuis mon appareil</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTargetProductForPicker(null);
                          setPickerModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-ocean-200 font-semibold flex items-center gap-1.5"
                      >
                        <Images className="w-4 h-4 text-cyanCustom-400" />
                        <span>Choisir de la Médiathèque</span>
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={editingProduct.image_url || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                        placeholder="Ou collez une URL d'image (https://...)"
                        className="w-full px-3 py-2 rounded-xl bg-ocean-900 border border-ocean-700 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

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
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-ocean-800 hover:bg-ocean-700 text-white text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyanCustom-500 hover:bg-cyanCustom-400 text-white text-xs font-bold shadow"
                >
                  Enregistrer le Produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CHOISIR DEPUIS LA MÉDIATHÈQUE ================= */}
      {pickerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/90 backdrop-blur-md">
          <div className="bg-ocean-900 border border-ocean-700 max-w-3xl w-full rounded-2xl shadow-2xl p-6 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-ocean-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Images className="w-5 h-5 text-cyanCustom-400" />
                <span>
                  {targetProductForPicker 
                    ? `Choisir une photo pour "${targetProductForPicker.name_fr}"` 
                    : "Sélectionner une photo depuis la Médiathèque"}
                </span>
              </h3>
              <button
                onClick={() => {
                  setTargetProductForPicker(null);
                  setPickerModalOpen(false);
                }}
                className="text-ocean-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  onClick={async () => {
                    if (targetProductForPicker) {
                      await handleDirectProductPhotoUrl(targetProductForPicker, item.url);
                      setTargetProductForPicker(null);
                      setPickerModalOpen(false);
                    } else {
                      setEditingProduct(prev => prev ? { ...prev, image_url: item.url } : null);
                      setPickerModalOpen(false);
                      toast.success("Photo appliquée au produit !");
                    }
                  }}
                  className="group cursor-pointer rounded-xl overflow-hidden border border-ocean-800 hover:border-cyanCustom-400 transition-all bg-ocean-950 relative"
                >
                  <img
                    src={item.url}
                    alt={item.title_fr}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-2 bg-ocean-900/90">
                    <span className="text-[11px] font-bold text-white line-clamp-1 block">
                      {item.title_fr}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: APERÇU PHOTO GRAND FORMAT ================= */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/90 backdrop-blur-md cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-ocean-700 shadow-2xl">
            <img
              src={previewImage}
              alt="Aperçu Grand Format"
              className="max-w-full max-h-[85vh] object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-ocean-950/80 text-white hover:bg-ocean-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
