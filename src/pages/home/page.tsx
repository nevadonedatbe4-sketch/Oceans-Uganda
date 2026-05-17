import { useState, useEffect } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroSection from './components/HeroSection';
import NeighborhoodsSection from './components/NeighborhoodsSection';
import PropertiesSection from './components/PropertiesSection';
import ContactSection from './components/ContactSection';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import { HomeSEO } from '@/components/feature/PageSEO';

function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center text-white shadow-lg cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-110 hover:shadow-xl"
      style={{ backgroundColor: '#0D5959' }}
    >
      <i className="ri-arrow-up-line text-xl" />
    </button>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <HomeSEO />
      <Navbar />
      <main>
        <div className="pb-8 md:pb-12">
          <HeroSection />
        </div>
        <NeighborhoodsSection />
        <PropertiesSection />
        <ContactSection />
      </main>
      <GlobalContactStrip />
      <Footer />
      <BackToTopButton />
    </div>
  );
}
