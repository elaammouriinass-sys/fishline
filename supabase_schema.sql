-- ========================================================
-- Schema SQL pour Fishline (Supabase)
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase
-- ========================================================

-- 1. Table des produits de la mer
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name_fr TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    scientific_name TEXT,
    category TEXT NOT NULL CHECK (category IN ('fresh', 'frozen', 'cephalopods', 'pelagic', 'crustaceans')),
    description_fr TEXT,
    description_ar TEXT,
    calibers TEXT[] DEFAULT '{}',
    freezing_method TEXT,
    origin TEXT DEFAULT 'Maroc',
    fao_zone TEXT DEFAULT 'Zone FAO 34',
    packaging TEXT,
    image_url TEXT,
    in_stock BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des demandes de devis B2B (RFQ)
CREATE TABLE IF NOT EXISTS public.quotes (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT NOT NULL,
    product_id TEXT,
    product_name TEXT,
    estimated_quantity TEXT NOT NULL,
    incoterm TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activation de la sécurité Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS (Lecture publique des produits, Insertion publique des devis)
CREATE POLICY "Lecture publique des produits" 
    ON public.products FOR SELECT 
    USING (true);

CREATE POLICY "Écriture publique des devis" 
    ON public.quotes FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Admin full access products" 
    ON public.products FOR ALL 
    USING (true);

CREATE POLICY "Admin full access quotes" 
    ON public.quotes FOR ALL 
    USING (true);
