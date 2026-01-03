import React, { useState, useMemo } from 'react';
import { Calculator as CalcIcon, ShoppingCart, Loader2, DollarSign, Check } from 'lucide-react';
import { BASE_PRICES, PER_PAGE_PRICES, USD_RATE, formatPriceFCFA, formatPriceUSD } from '../constants';
import { useCart } from '../context/CartContext';

const Calculator: React.FC = () => {
  const { addToCart } = useCart();
  const [serviceType, setServiceType] = useState('rapport');
  const [pages, setPages] = useState(10);
  const [delai, setDelai] = useState('normal');
  const [isLoading, setIsLoading] = useState(false);

  const breakdown = useMemo(() => {
    const base = BASE_PRICES[serviceType] || 0;
    const pageCost = Math.max(0, (PER_PAGE_PRICES[serviceType] || 0) * (pages - 1));
    const subtotal = base + pageCost;
    
    let multiplier = 1;
    if (delai === 'rapide') multiplier = 1.25;
    if (delai === 'express') multiplier = 1.5;
    
    const urgencyFee = (subtotal * multiplier) - subtotal;
    const totalRaw = subtotal + urgencyFee;
    const total = Math.round(totalRaw / 500) * 500;

    return { base, pageCost, urgencyFee, total };
  }, [serviceType, pages, delai]);

  const handleAddToCart = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    addToCart({
      name: `Devis ${serviceType.toUpperCase()}`,
      price: breakdown.total,
      type: 'custom',
      details: `${pages} pages - Délai ${delai}`
    });
    setIsLoading(false);
  };

  return (
    <section id="calculateur" className="py-24 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Estimation instantanée</span>
          <h2 className="text-4xl md:text-5xl font-black font-serif text-dark dark:text-white mb-4">
            Simulateur de <span className="text-primary">Tarification</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto italic">Obtenez un devis immédiat pour votre projet de rédaction scientifique.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 dark:border-slate-700">
          
          <div className="p-10 lg:p-16 lg:w-3/5 space-y-10">
            {/* Nature du projet */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Check size={14} className="text-primary"/> Type de service
              </label>
              <select 
                className="w-full p-5 bg-gray-50 dark:bg-slate-700 border-2 border-gray-100 dark:border-slate-600 rounded-2xl font-bold text-lg cursor-pointer transition-all focus:border-primary"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="rapport">Rapport de Stage</option>
                <option value="memoire">Mémoire de Master</option>
                <option value="presentation">Soutenance Beamer</option>
                <option value="tikz">Schéma TikZ / Graphique</option>
                <option value="cv">CV LaTeX Premium</option>
                <option value="traduction">Traduction Scientifique</option>
              </select>
            </div>

            {/* Volume */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Check size={14} className="text-primary"/> Volume estimé (Pages / Schémas)
                </label>
                <span className="bg-primary/10 text-primary px-6 py-2 rounded-full font-black text-xl">{pages}</span>
              </div>
              <input 
                type="range" min="1" max="100" 
                value={pages} 
                onChange={(e) => setPages(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Délai */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Check size={14} className="text-primary"/> Urgence de livraison
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['normal', 'rapide', 'express'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDelai(d)}
                    className={`py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${delai === d ? 'bg-primary text-white shadow-xl scale-105' : 'bg-gray-100 dark:bg-slate-700 text-gray-400 hover:bg-gray-200 border-2 border-transparent'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-10 lg:p-16 lg:w-2/5 flex flex-col justify-center items-center text-white relative">
             <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             
             <div className="relative z-10 text-center space-y-8 w-full">
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Total Estimé du Devis</p>
                    <div className="text-5xl lg:text-6xl font-black text-primary flex items-center justify-center gap-1">
                      {formatPriceFCFA(breakdown.total)}
                    </div>
                    <div className="text-lg font-bold text-white opacity-40">≈ {formatPriceUSD(breakdown.total)}</div>
                </div>

                <div className="py-6 border-y border-white/5 space-y-4">
                   <div className="flex justify-between text-[11px] font-medium text-gray-500">
                     <span>Frais de base</span>
                     <span className="text-white font-bold">{formatPriceFCFA(breakdown.base)}</span>
                   </div>
                   <div className="flex justify-between text-[11px] font-medium text-gray-500">
                     <span>Volume ({pages} p.)</span>
                     <span className="text-white font-bold">{formatPriceFCFA(breakdown.pageCost)}</span>
                   </div>
                   {breakdown.urgencyFee > 0 && (
                     <div className="flex justify-between text-[11px] font-black text-blue-400">
                       <span>Supplément {delai}</span>
                       <span>+ {formatPriceFCFA(breakdown.urgencyFee)}</span>
                     </div>
                   )}
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-light text-white py-6 rounded-2xl font-black shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.02] active:scale-95 group"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={24} /> : <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform"/>}
                  AJOUTER AU PANIER
                </button>
                <p className="text-[10px] text-gray-600 italic opacity-60">Paiement unique • Accès source LaTeX inclus</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;