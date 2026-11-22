export type Category = 'fresh' | 'frozen' | 'cephalopods' | 'pelagic' | 'crustaceans';

export interface Product {
  id: string;
  name_fr: string;
  name_ar: string;
  scientific_name: string;
  category: Category;
  description_fr: string;
  description_ar: string;
  calibers: string[];
  freezing_method?: 'IQF' | 'Block' | 'Frais' | 'Entier / Nettoyé';
  origin: string;
  fao_zone: string;
  packaging: string;
  image_url: string;
  in_stock: boolean;
  featured: boolean;
  created_at?: string;
}

export interface QuoteRequest {
  id?: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  country: string;
  product_id?: string;
  product_name?: string;
  estimated_quantity: string;
  incoterm: string;
  message: string;
  status: 'pending' | 'contacted' | 'completed';
  created_at?: string;
}

export interface StatItem {
  id: string;
  value: string;
  number: number;
  suffix: string;
  label_fr: string;
  label_ar: string;
  sub_fr: string;
  sub_ar: string;
}
