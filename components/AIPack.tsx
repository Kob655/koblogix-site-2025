
import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Check, ShoppingCart, Zap, Star, ShieldCheck, FileCode, Search, BookOpen, Layers, ArrowRight } from 'lucide-react';
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
    <section id="ai-pack" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 font-bold text-xs uppercase mb-4">
              <Sparkles size={14}/> Révolution Scientifique
            </div>
            <h2 className="text-4xl md:text-6xl font-black font-serif mb-6 dark:text-white">
              Le Pack IA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Ultime</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
              Ne travaillez plus dur, travaillez <span className="text-primary font-bold italic">intelligemment</span>. Nous avons réuni l'arsenal complet du chercheur moderne.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Content Preview */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
                {[
                    { icon: <Search className="text-blue-500"/>, title: "15+ IA Spécialisées", desc: "Consensus, Elicit, Claude... les meilleurs outils classés." },
                    { icon: <FileCode className="text-purple-500"/>, title: "Bibliothèque de Prompts", desc: "Copiez-collez nos prompts 'Persona' pour des résultats Q1." },
                    { icon: <BookOpen className="text-green-500"/>, title: "Stratégies de Rédaction", desc: "Guides pour structurer vos thèses et éviter le plagiat." },
                    { icon: <Layers className="text-orange-500"/>, title: "Analyse de PDF", desc: "Techniques pour extraire les limites d'un article en 1 clic." }
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-3">{item.icon}</div>
                        <h4 className="font-bold text-sm mb-1 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl shadow-blue-500/20">
                <h4 className="font-bold text-xl mb-4 flex items-center gap-2"><Star size={20} className="text-yellow-300 fill-yellow-300"/> Ce que vous allez recevoir :</h4>
                <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3"><Check size={18} className="text-blue-200 mt-0.5"/> <span>Dashboard interactif avec liens directs vers 15 IAs premium.</span></li>
                    <li className="flex items-start gap-3"><Check size={18} className="text-blue-200 mt-0.5"/> <span>10 Prompts 'Ultime' pour reformulation, résumé et critique.</span></li>
                    <li className="flex items-start gap-3"><Check size={18} className="text-blue-200 mt-0.5"/> <span>Guide vidéo : Installer et configurer Zotero avec l'IA.</span></li>
                    {option === 'accompagnement' && (
                        <li className="font-black text-yellow-300 flex items-start gap-3 bg-white/10 p-3 rounded-xl">
                            <Zap size={20} className="fill-yellow-300"/> 
                            <span>SESSION PRIVÉE (1H) : Coaching direct via Zoom pour configurer VOTRE workflow de recherche.</span>
                        </li>
                    )}
                </ul>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="h-full">
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl h-full flex flex-col justify-between border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-24 bg-blue-600/10 rounded-full -mr-12 -mt-12 blur-3xl group-hover:bg-blue-600/20 transition-colors"></div>
              
              <div>
                <div className="flex justify-between items-center mb-10">
                  <div className="p-4 bg-white/10 rounded-2xl text-blue-400"><BrainCircuit size={40}/></div>
                  <div className="text-right">
                    <div className="text-blue-400 font-bold uppercase text-[10px] tracking-widest mb-1">Offre de Lancement</div>
                    <div className="text-5xl font-black text-white">{currentPrice.toLocaleString()} F</div>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                   <button 
                    onClick={() => setOption('simple')}
                    className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${option === 'simple' ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-white/10 text-gray-500 hover:border-white/20'}`}
                   >
                     <div>
                         <div className="font-bold text-lg">Pack Essentiel</div>
                         <div className="text-xs opacity-60">Accès immédiat au Dashboard + Ressources</div>
                     </div>
                     {option === 'simple' && <div className="p-1 bg-blue-500 rounded-full"><Check size={14} className="text-white"/></div>}
                   </button>
                   <button 
                    onClick={() => setOption('accompagnement')}
                    className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${option === 'accompagnement' ? 'border-purple-500 bg-purple-500/10 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'border-white/10 text-gray-500 hover:border-white/20'}`}
                   >
                     <div>
                         <div className="font-bold text-lg">Pack + Coaching Privé</div>
                         <div className="text-xs opacity-60">Ressources + 1h de Direct avec un Expert</div>
                     </div>
                     {option === 'accompagnement' && <div className="p-1 bg-purple-500 rounded-full"><Check size={14} className="text-white"/></div>}
                   </button>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleAdd}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-black text-xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={24}/> Commander le Pack
                </button>
                <div className="flex items-center justify-center gap-6 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                   <div className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-500"/> Accès à vie</div>
                   <div className="flex items-center gap-1"><Star size={14} className="text-yellow-500"/> Mise à jour régulière</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AIPack;
