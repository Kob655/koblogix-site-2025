import React, { useState, useEffect } from 'react';
import { Mail, Phone, Users, ArrowUp } from 'lucide-react';
import { smoothScrollTo } from '../utils';

const Footer: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    smoothScrollTo(id);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <footer id="contact" className="bg-[#1E2A47] dark:bg-slate-950 text-white pt-20 pb-10 border-t-4 border-primary transition-colors duration-300 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
           {/* Brand */}
           <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center font-black font-serif text-xl">K</div>
                <span className="font-serif text-2xl font-bold">KOB<span className="text-secondary">LOGIX</span></span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                L'excellence en LaTeX et rédaction professionnelle. Basé à Lomé, Togo.
              </p>
           </div>

           {/* Links */}
           <div>
             <h4 className="font-bold text-lg mb-6 relative inline-block">
               Liens Rapides
               <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-accent"></span>
             </h4>
             <ul className="space-y-3 text-gray-400">
               <li><a href="#formation" onClick={(e) => handleNavClick(e, 'formation')} className="hover:text-white transition-colors cursor-pointer">Formation LaTeX</a></li>
               <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="hover:text-white transition-colors cursor-pointer">Services de rédaction</a></li>
               <li><a href="#calculateur" onClick={(e) => handleNavClick(e, 'calculateur')} className="hover:text-white transition-colors cursor-pointer">Demander un devis</a></li>
               <li><a href="#ressources" onClick={(e) => handleNavClick(e, 'ressources')} className="hover:text-white transition-colors cursor-pointer">Espace Ressources</a></li>
             </ul>
           </div>

           {/* Contact */}
           <div>
              <h4 className="font-bold text-lg mb-6 relative inline-block">
               Contactez-nous
               <span className="absolute -bottom-2 left-0 w-10 h-0.5 bg-accent"></span>
             </h4>
             <div className="space-y-4 text-gray-300">
               <div className="flex items-center gap-3">
                 <Phone size={18} className="text-accent" /> <span>+228 98 28 65 41 (WhatsApp)</span>
               </div>
               <div className="flex items-center gap-3">
                 <Mail size={18} className="text-accent" /> <span>Koblogixofficiel@gmail.com</span>
               </div>
                <div className="flex items-center gap-3">
                 <Users size={18} className="text-accent" /> 
                 <a href="https://chat.whatsapp.com/E4IbdUyvrVt6l0xwD7WE3n" target="_blank" rel="noreferrer" className="hover:text-white underline">
                   Rejoindre le groupe WhatsApp
                 </a>
               </div>
             </div>
           </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center text-gray-500 text-sm">
          <span>&copy; {new Date().getFullYear()} KOBLOGIX. Tous droits réservés.</span>
          <span className="opacity-50 text-[10px]">
            v1.2.1
          </span>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-20 right-4 z-40 p-3 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg transition-all duration-300 transform ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
        aria-label="Retour en haut"
      >
        <ArrowUp size={24} />
      </button>
    </footer>
  );
};

export default Footer;