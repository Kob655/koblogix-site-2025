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

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 border-b ${
        isScrolled 
          ? 'py-3 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-sm border-gray-200/50 dark:border-slate-800/50' 
          : 'py-5 bg-transparent border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={(e) => scrollToSection(e as any, '#accueil')}>
          <div className="h-10 w-10 md:h-11 md:w-11 bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center text-xl md:text-2xl font-black rounded-xl font-serif shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300">
            K
          </div>
          <a href="#accueil" className="font-serif text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight flex flex-col group-hover:opacity-80 transition-opacity">
            KOB<span className="text-secondary text-sm md:text-lg tracking-widest font-sans font-bold -mt-1">LOGIX</span>
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-1 bg-white/60 dark:bg-slate-900/40 p-1 rounded-full border border-gray-100 dark:border-slate-800/50 backdrop-blur-md shadow-sm">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="px-5 py-2 rounded-full font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 block cursor-pointer"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-yellow-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 border border-transparent"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button 
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 border border-transparent"
            >
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-slate-950 animate-bounce">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
           <button onClick={() => setIsOpen(true)} className="relative p-2 text-gray-600 dark:text-gray-300">
            <ShoppingCart size={24} />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-primary dark:text-white">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl border-t border-gray-100 dark:border-slate-800 flex flex-col p-6 gap-4 animate-[slideDown_0.3s_ease-out]">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="font-bold text-lg text-gray-700 dark:text-gray-300 hover:text-primary p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-900 border border-transparent hover:border-gray-100 dark:hover:border-slate-800 transition-all"
              onClick={(e) => scrollToSection(e, link.href)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;