import Header from "@/components/header";
import Hero from "@/components/hero";
import Stats from "@/components/stats";
import ProductCards from "@/components/product-cards";
import HowItWorks from "@/components/how-it-works";
import TelegramPreview from "@/components/telegram-preview";
import Cta from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-dvh">
      <Header />
      <Hero />
      <Stats />
      <ProductCards />
      <HowItWorks />
      <TelegramPreview />
      <Cta />
      <Footer />
    </main>
  );
}
