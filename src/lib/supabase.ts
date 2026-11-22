import { createClient } from '@supabase/supabase-js';
import { Product, QuoteRequest, StatItem, GalleryItem } from '@/types';
import { initialProducts, initialStats, initialGallery } from './mock-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback store using localStorage for when Supabase is not yet connected
const LOCAL_STORAGE_PRODUCTS_KEY = 'fishline_products';
const LOCAL_STORAGE_QUOTES_KEY = 'fishline_quotes';
const LOCAL_STORAGE_GALLERY_KEY = 'fishline_gallery';

// ---------------- PRODUCTS ----------------

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Product[];
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local:", e);
    }
  }

  // Fallback to localStorage or mock data
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return initialProducts;
}

export async function saveProduct(product: Product): Promise<Product> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').upsert(product).select().single();
      if (!error && data) return data as Product;
    } catch (e) {
      console.warn("Supabase upsert failed:", e);
    }
  }

  // Local storage save
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    let list: Product[] = cached ? JSON.parse(cached) : [...initialProducts];
    const index = list.findIndex(p => p.id === product.id);
    if (index >= 0) {
      list[index] = product;
    } else {
      list.unshift(product);
    }
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(list));
  }
  return product;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase delete failed:", e);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    let list: Product[] = cached ? JSON.parse(cached) : [...initialProducts];
    list = list.filter(p => p.id !== productId);
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(list));
  }
  return true;
}

// ---------------- GALLERY & PHOTOS ----------------

export async function getGalleryImages(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as GalleryItem[];
    } catch (e) {
      console.warn("Supabase fetch gallery failed, falling back to local:", e);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return initialGallery;
}

export async function saveGalleryImage(item: GalleryItem): Promise<GalleryItem> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('gallery').upsert(item).select().single();
      if (!error && data) return data as GalleryItem;
    } catch (e) {
      console.warn("Supabase upsert gallery failed:", e);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
    let list: GalleryItem[] = cached ? JSON.parse(cached) : [...initialGallery];
    const index = list.findIndex(g => g.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }
    localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(list));
  }
  return item;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase delete gallery failed:", e);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
    let list: GalleryItem[] = cached ? JSON.parse(cached) : [...initialGallery];
    list = list.filter(g => g.id !== id);
    localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(list));
  }
  return true;
}

// Helper to convert an uploaded image file into an optimized Data URL
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// ---------------- QUOTES (RFQ) ----------------

export async function submitQuote(quote: QuoteRequest): Promise<boolean> {
  const quoteWithDate = {
    ...quote,
    id: quote.id || `quote-${Date.now()}`,
    status: 'pending' as const,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('quotes').insert([quoteWithDate]);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase quote insert failed:", e);
    }
  }

  // Local storage save
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_QUOTES_KEY);
    const list: QuoteRequest[] = cached ? JSON.parse(cached) : [];
    list.unshift(quoteWithDate);
    localStorage.setItem(LOCAL_STORAGE_QUOTES_KEY, JSON.stringify(list));
  }
  return true;
}

export async function getQuotes(): Promise<QuoteRequest[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as QuoteRequest[];
    } catch (e) {
      console.warn("Supabase fetch quotes failed:", e);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_STORAGE_QUOTES_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return [];
}
