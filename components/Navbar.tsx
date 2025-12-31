import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Moon, Sun } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, setIsOpen } = useCart();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'Formation', href: '#formation' },
    { name: 'Services', href: '#services' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={(e) => scrollToSection(e as any, '#accueil')}>
          <div className="h-10 w-10 md:h-11 md:w-11 bg-blue-600 text-white flex items-center justify-center text-xl md:text-2xl font-black rounded-xl font-serif shadow-lg group-hover:rotate-6 transition-transform">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight">
              KOB
            </span>
            <span className="text-secondary text-[10px] md:text-xs tracking-[0.2em] font-bold -mt-1">
              LOGIX
            </span>
          </div>
        </div>

        {/* Pill Menu (Centré et stylisé comme sur l'image) */}
        <div className="hidden md:flex items-center gap-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 px-2 py-2 rounded-full shadow-sm">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="px-5 py-2 rounded-full font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-3 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors rounded-full"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button 
              onClick={() => setIsOpen(true)}
              className="relative p-3 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors rounded-full"
            >
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute top-1 right-1 bg-secondary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setIsOpen(true)} className="relative p-3">
            <ShoppingCart size={22} className="text-slate-600 dark:text-slate-300" />
            {items.length > 0 && (
              <span className="absolute top-1 right-1 bg-secondary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-3 text-slate-900 dark:text-white">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 shadow-xl p-6 space-y-4 animate-slideUp">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="block font-bold text-lg text-slate-800 dark:text-slate-300 hover:text-blue-600"
              onClick={(e) => scrollToSection(e, link.href)}
            >
              {link.name}
            </a>
          ))}
          <button onClick={toggleTheme} className="w-full flex items-center justify-between py-4 border-t border-slate-50 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold">
            <span>{theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}</span>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;