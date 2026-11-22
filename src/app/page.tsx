import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ProductsSection from "@/components/ProductsSection";
import AboutSection from "@/components/AboutSection";
import QualityCertifications from "@/components/QualityCertifications";
import ExportMap from "@/components/ExportMap";
import GallerySection from "@/components/GallerySection";
import QuoteSection from "@/components/QuoteSection";
import Footer from "@/components/Footer";
import WaveBackground from "@/components/WaveBackground";

export default function HomePage() {
  return (
    <main className="min-h-screen relative ocean-gradient">
      <WaveBackground />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ProductsSection />
      <AboutSection />
      <QualityCertifications />
      <ExportMap />
      <GallerySection />
      <QuoteSection />
      <Footer />
    </main>
  );
}
