import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Check, ShoppingCart, Zap, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const AIPack: React.FC = () => {
  const cart = useCart();
  const [option, setOption] = useState<'simple' | 'accompagnement'>('simple');

  const PRICE_SIMPLE = 5000;
  const PRICE_FULL = 15000;
  const currentPrice = option === 'simple' ? PRICE_SIMPLE : PRICE_FULL;

  const handleAdd = () => {
    cart.addToCart({
      name: `Pack IA Premium (${option === 'simple' ? 'Essentiel' : 'Accompagné'})`,
      price: currentPrice,
      type: 'ai_pack',
      details: option === 'simple' ? 'Outils + Prompts + Guides' : 'Pack complet + 1h de Coaching privé (Zoom)',
      option: option
    });
  };

  return (
    <section id="ai-pack" className="py-20 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
          <div className="flex flex-col md:flex-row">
            {/* Info Side */}
            <div className="md:w-3/5 p-8 md:p-12">
              <div className="flex items-center gap-2 text-primary font-bold mb-4">
                <Sparkles size={20} />
                <span className="uppercase tracking-widest text-xs">Innovation</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-dark dark:text-white">
                Le Pack IA Scientifique
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Optimisez votre rédaction avec les meilleurs outils d'intelligence artificielle. Une sélection rigoureuse pour les chercheurs et étudiants.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Accès à une liste de 15+ IA spécialisées",
                  "Prompts exclusifs pour LaTeX et rédaction",
                  "Guide d'utilisation éthique de l'IA",
                  "Mise à jour régulière des outils"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <Check size={18} className="text-accent" /> {item}
                  </li>
                ))}
              </ul>

              <div className="flex gap-4">
                <button 
                  onClick={() => setOption('simple')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${option === 'simple' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-slate-700 text-gray-400'}`}
                >
                  <div className="font-bold">Pack Essentiel</div>
                  <div className="text-xs">Ressources uniquement</div>
                </button>
                <button 
                  onClick={() => setOption('accompagnement')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${option === 'accompagnement' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-slate-700 text-gray-400'}`}
                >
                  <div className="font-bold">Pack + Coaching</div>
                  <div className="text-xs">Accompagnement 1h</div>
                </button>
              </div>
            </div>

            {/* Price Side */}
            <div className="md:w-2/5 bg-primary text-white p-8 md:p-12 flex flex-col justify-center items-center text-center">
              <div className="bg-white/10 p-4 rounded-full mb-6">
                <BrainCircuit size={48} />
              </div>
              <div className="text-4xl font-bold mb-2">{currentPrice.toLocaleString()} F</div>
              <p className="text-blue-100 text-sm mb-8">Accès à vie • Paiement unique</p>
              
              <button 
                onClick={handleAdd}
                className="w-full bg-white text-primary hover:bg-gray-100 py-4 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} /> Commander le Pack
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIPack;