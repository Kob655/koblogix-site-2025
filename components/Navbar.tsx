import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { smoothScrollTo } from '../utils';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, setIsOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logoutUser } = useStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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

  const handleScroll = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    smoothScrollTo(href.replace('#', ''));
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        {/* Logo KOB LOGIX */}
        <div className="flex items-center gap-4 group cursor-pointer" onClick={(e) => handleScroll(e as any, '#accueil')}>
          <div className="h-14 w-14 bg-[#2563EB] text-white flex items-center justify-center text-3xl font-black rounded-2xl font-serif shadow-xl group-hover:rotate-6 transition-transform">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight">
              KOB
            </span>
            <span className="text-[#F59E0B] text-xs tracking-[0.4em] font-black -mt-1 uppercase">
              LOGIX
            </span>
          </div>
        </div>

        {/* Menu Pillule Centré */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-100 dark:border-slate-800 px-4 py-2 rounded-full shadow-lg">
            <ul className="flex items-center">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className="px-6 py-2.5 rounded-full font-bold text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Account / Logout */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-black">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-black text-primary dark:text-blue-300 max-w-[100px] truncate">{currentUser.name}</span>
                <button 
                  onClick={logoutUser}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
                <button 
                    onClick={() => smoothScrollTo('formation')}
                    className="p-3 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors rounded-full bg-white dark:bg-slate-900 shadow-md border dark:border-slate-800"
                >
                    <UserIcon size={22} />
                </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-3 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors rounded-full bg-white dark:bg-slate-900 shadow-md border dark:border-slate-800"
            >
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>

            <button 
              onClick={() => setIsOpen(true)}
              className="relative p-3 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors rounded-full bg-white dark:bg-slate-900 shadow-md border dark:border-slate-800"
            >
              <ShoppingCart size={22} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Toggle Mobile */}
        <div className="flex lg:hidden items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="relative p-3 bg-white dark:bg-slate-900 rounded-xl shadow-md border dark:border-slate-800">
            <ShoppingCart size={24} className="text-slate-700 dark:text-slate-300" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-3 text-slate-900 dark:text-white bg-white dark:bg-slate-900 rounded-xl shadow-md border dark:border-slate-800">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-2xl rounded-3xl p-8 space-y-6 mt-4 animate-slideUp">
          {currentUser && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 mb-2">
               <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-xl font-black">
                  {currentUser.name.charAt(0)}
               </div>
               <div className="flex-1">
                 <p className="font-black text-slate-800 dark:text-white">{currentUser.name}</p>
                 <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
               </div>
               <button onClick={logoutUser} className="p-3 bg-red-50 text-red-500 rounded-xl">
                 <LogOut size={20}/>
               </button>
            </div>
          )}
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="block font-black text-xl text-slate-800 dark:text-slate-300 hover:text-blue-600"
              onClick={(e) => handleScroll(e, link.href)}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-6 border-t dark:border-slate-800 space-y-4">
            <button onClick={toggleTheme} className="w-full flex items-center justify-between font-black text-slate-600 dark:text-slate-400">
                <span>{theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}</span>
                {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;