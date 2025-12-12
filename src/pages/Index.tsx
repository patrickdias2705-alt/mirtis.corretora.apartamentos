import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { HowItWorks } from "@/components/HowItWorks";
import { AboutSection } from "@/components/AboutSection";
import { StatsSection } from "@/components/StatsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const Index = () => {
  console.log("Index page rendering");
  return (
    <div className="min-h-screen bg-background animate-page-fade">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <HowItWorks />
        <AboutSection />
        <StatsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
