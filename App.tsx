
import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Formation from './components/Formation';
import Services from './components/Services';
import AIPack from './components/AIPack';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Calculator from './components/Calculator';
import Resources from './components/Resources';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import AdminPanel from './components/AdminPanel';
import CheckoutModal from './components/CheckoutModal';
import Notifications from './components/Notifications';
import SocialProof from './components/SocialProof';
import BibtexGenerator from './components/BibtexGenerator';
import Ambassador from './components/Ambassador';
import RevealOnScroll from './components/ui/RevealOnScroll';
import ScrollProgress from './components/ui/ScrollProgress';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { StoreProvider, useStore } from './context/StoreContext';

const AppContent: React.FC = () => {
  const { setAdminOpen } = useStore();

  // Raccourci clavier ALT + A pour l'admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAdminOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setAdminOpen]);

  return (
    <div className="font-sans text-[#2c3e50] dark:text-gray-100 antialiased scroll-smooth transition-colors duration-300 bg-[#fdfbf7] dark:bg-slate-900">
      <ScrollProgress />
      <Navbar />
      <Notifications />
      <SocialProof />
      <main>
        <Hero />
        
        <RevealOnScroll>
          <Portfolio />
        </RevealOnScroll>

        <RevealOnScroll>
          <Formation />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <AIPack />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <Ambassador />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <Services />
        </RevealOnScroll>

        <RevealOnScroll>
          <BibtexGenerator />
        </RevealOnScroll>

        <RevealOnScroll>
          <Calculator />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <Testimonials />
        </RevealOnScroll>

        <RevealOnScroll>
           <FAQ />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <Resources />
        </RevealOnScroll>
      </main>
      <Footer />
      
      <CartSidebar />
      <CheckoutModal />
      <AdminPanel />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <StoreProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default App;
