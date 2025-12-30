import React, { useState, useMemo } from 'react';
import { Calculator as CalcIcon, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { BASE_PRICES, PER_PAGE_PRICES, USD_RATE } from '../constants';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils';

const Calculator: React.FC = () => {
  const { addToCart } = useCart();
  const [serviceType, setServiceType] = useState('rapport');
  const [pages, setPages] = useState(10);
  const [delai, setDelai] = useState('normal');
  const [correction, setCorrection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const breakdown = useMemo(() => {
    const base = BASE_PRICES[serviceType] || 0;
    const pageCost = Math.max(0, (PER_PAGE_PRICES[serviceType] || 0) * (pages - 1));
    const subtotal = base + pageCost;
    
    let multiplier = 1;
    if (delai === 'rapide') multiplier = 1.25;
    if (delai === 'express') multiplier = 1.5;
    
    const urgencyFee = (subtotal * multiplier) - subtotal;
    const correctionFee = correction ? 3000 : 0;
    
    const totalRaw = subtotal + urgencyFee + correctionFee;
    const total = Math.round(totalRaw / 500) * 500; // Rounding

    return { base, pageCost, urgencyFee, correctionFee, total };
  }, [serviceType, pages, delai, correction]);

  const handleAddToCart = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network
    
    addToCart({
      name: `Devis ${serviceType.toUpperCase()}`,
      price: breakdown.total,
      type: 'custom',
      details: `${pages} pages - Délai ${delai} - ${correction ? 'Avec Correction' : 'Sans Correction'}`
    });
    setIsLoading(false);
  };

  return (
    <section id="calculateur" className="py-20 bg-bg dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-dark dark:text-white relative inline-block">
            <CalcIcon className="inline-block mr-2 text-primary" size={36} />
            Simulateur de Devis
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Estimation précise et immédiate</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors duration-300">
          
          {/* Form Side */}
          <div className="p-8 md:p-12 md:w-3/5 space-y-6">
            <div>
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Type de document</label>
              <select 
                className="w-full p-4 bg-gray-50 dark:bg-slate-700 border-none rounded-xl font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary outline-none transition-colors"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="cv">CV Professionnel</option>
                <option value="rapport">Rapport de Stage</option>
                <option value="memoire">Mémoire de Master</option>
                <option value="poster">Poster Scientifique</option>
                <option value="presentation">Présentation Beamer</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">Volume</label>
                <span className="font-bold text-primary">{pages} Pages/Slides</span>
              </div>
              <input 
                type="range" min="1" max="100" 
                value={pages} 
                onChange={(e) => setPages(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

             <div>
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Urgence</label>
              <div className="grid grid-cols-3 gap-3">
                {['normal', 'rapide', 'express'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDelai(d)}
                    className={`py-3 rounded-lg text-sm font-bold capitalize transition-colors ${delai === d ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            
            <div 
              onClick={() => setCorrection(!correction)}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${correction ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-600'}`}
            >
               <span className="font-bold text-gray-700 dark:text-gray-300">Option Correction (+3000F)</span>
               <div className={`w-6 h-6 rounded border flex items-center justify-center ${correction ? 'bg-primary border-primary text-white' : 'border-gray-400 dark:border-gray-500'}`}>
                 {correction && <Check size={14} />}
               </div>
            </div>
          </div>

          {/* Result Side */}
          <div className="bg-primary dark:bg-blue-900 text-white p-8 md:p-12 md:w-2/5 flex flex-col justify-center items-center relative overflow-hidden transition-colors">
             <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
             
             <h3 className="text-white/80 font-serif text-lg mb-4 text-center">Estimation Totale</h3>
             <div className="text-5xl font-black mb-2 tracking-tight text-center">
               {breakdown.total.toLocaleString('fr-FR')}
             </div>
             <div className="text-xl text-white/60 font-light mb-2 text-center">FCFA</div>
             
             {/* USD Display */}
             <div className="bg-white/10 px-4 py-1.5 rounded-lg text-sm font-bold text-white mb-8">
                ≈ {Math.ceil(breakdown.total / USD_RATE)} $ USD
             </div>

             {/* Detailed Breakdown */}
             <div className="w-full text-sm text-white/80 space-y-2 mb-8 bg-black/10 p-4 rounded-xl backdrop-blur-sm">
               <div className="flex justify-between">
                 <span>Prix de base</span>
                 <span>{formatPrice(breakdown.base)}</span>
               </div>
               {breakdown.pageCost > 0 && (
                 <div className="flex justify-between">
                   <span>Pages supp.</span>
                   <span>+ {formatPrice(breakdown.pageCost)}</span>
                 </div>
               )}
               {breakdown.urgencyFee > 0 && (
                  <div className="flex justify-between text-yellow-300">
                    <span>Majoration Urgence</span>
                    <span>+ {formatPrice(breakdown.urgencyFee)}</span>
                  </div>
               )}
               {breakdown.correctionFee > 0 && (
                  <div className="flex justify-between">
                    <span>Correction</span>
                    <span>+ {formatPrice(breakdown.correctionFee)}</span>
                  </div>
               )}
             </div>

             <div className="space-y-4 w-full relative z-10">
               <button 
                 onClick={handleAddToCart}
                 disabled={isLoading}
                 className="w-full bg-white text-primary dark:text-blue-900 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
               >
                 {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
                 {isLoading ? 'Ajout...' : 'Ajouter au devis'}
               </button>
               <p className="text-xs text-white/50 px-4 text-center">
                 *Ce montant est une estimation. Le prix final sera confirmé après analyse.
               </p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;