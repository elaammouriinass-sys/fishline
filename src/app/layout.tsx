import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Fishline Maroc | Pêche & Exportation de Produits de la Mer",
  description: "Leader marocain dans la capture, la surgélation de pointe et l'exportation internationale de poissons frais, poulpe de Dakhla, sardines et céphalopodes (Zone FAO 34).",
  keywords: ["seafood morocco", "export poisson maroc", "sardine maroc", "poulpe dakhla", "marseafood", "fishline", "fao 34", "fruits de mer maroc"],
  openGraph: {
    title: "Fishline Maroc | Pêche & Exportation de Produits de la Mer",
    description: "Exportation internationale de produits de la mer d'exception - Origine Maroc Zone FAO 34.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Fishline Maroc",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr">
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
          <Toaster richColors position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
