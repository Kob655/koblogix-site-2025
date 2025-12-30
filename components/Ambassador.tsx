
import React, { useState } from 'react';
import { Gift, Users, Copy, Check, ArrowRight, Star, Wallet, History, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
// Fixed: formatPrice is exported from utils, not constants
import { WHATSAPP_SUPPORT } from '../constants';
import { formatPrice } from '../utils';

const Ambassador: React.FC = () => {
  const { currentUser, becomeAmbassador } = useStore();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert("Veuillez vous connecter d'abord.");
    const code = `${currentUser.name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    await becomeAmbassador(code);
  };

  const copyCode = () => {
    if (currentUser?.ambassadorCode) {
      navigator.clipboard.writeText(currentUser.ambassadorCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="lg:w-1/2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 mb-6">
                    <Star size={14} className="text-yellow-400 fill-yellow-400"/>
                    <span className="text-xs font-bold uppercase tracking-wider">Programme Ambassadeur Transparent</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black font-serif mb-6 leading-tight">
                    Gagnez <span className="text-yellow-400">1000 FCFA</span> par vente
                </h2>
                <p className="text-indigo-200 text-lg mb-8 max-w-xl">
                    Chaque fois qu'un étudiant utilise votre code, il économise 1000F et vous gagnez 1000F. 
                    Suivez vos gains en direct dans votre portefeuille.
                </p>
                
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h4 className="flex items-center gap-2 font-bold mb-4"><AlertCircle size={18} className="text-yellow-400"/> Comment ça marche ?</h4>
                    <ul className="text-sm space-y-3 text-indigo-100 text-left">
                        <li className="flex gap-2"><span>1.</span> Partagez votre code unique.</li>
                        <li className="flex gap-2"><span>2.</span> Le client paye 1000F de moins sur le site.</li>
                        <li className="flex gap-2"><span>3.</span> Dès validation du paiement par KOBLOGIX, votre solde est crédité.</li>
                        <li className="flex gap-2"><span>4.</span> Retirez vos gains via T-Money/Flooz dès 5000F accumulés.</li>
                    </ul>
                </div>
            </div>

            <div className="lg:w-1/2 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
                    {currentUser?.isAmbassador ? (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Wallet Display */}
                            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-2xl border border-yellow-500/30 text-center">
                                <Wallet className="mx-auto mb-2 text-yellow-400" size={32}/>
                                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Solde Actuel</p>
                                <p className="text-4xl font-black text-white mt-1">{formatPrice(currentUser.balance || 0)}</p>
                                <button className="mt-4 text-xs font-black bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-all">
                                    DEMANDER UN RETRAIT
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-center text-sm text-indigo-200">Votre Code de Parrainage :</p>
                                <div className="bg-black/30 border border-white/20 p-5 rounded-xl flex items-center justify-between">
                                    <span className="font-mono text-2xl font-bold tracking-widest text-yellow-400">{currentUser.ambassadorCode}</span>
                                    <button onClick={copyCode} className="p-2 hover:bg-white/10 rounded-lg">
                                        {copied ? <Check className="text-green-400"/> : <Copy size={20}/>}
                                    </button>
                                </div>
                            </div>

                            <a 
                                href={`https://wa.me/${WHATSAPP_SUPPORT}?text=Bonjour,+je+suis+l'ambassadeur+${currentUser.name}+et+je+souhaite+un+retrait+de+mon+solde.`}
                                target="_blank"
                                className="block w-full text-center bg-green-600 py-4 rounded-xl font-bold hover:bg-green-700 transition-all"
                            >
                                Contacter Support Retrait
                            </a>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Users className="mx-auto mb-4 text-indigo-300" size={64}/>
                            <h3 className="text-2xl font-bold mb-4">Prêt à commencer ?</h3>
                            <button 
                                onClick={handleGenerate}
                                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black py-5 rounded-2xl shadow-xl hover:scale-105 transition-all"
                            >
                                ACTIVER MON CODE AMBASSADEUR
                            </button>
                            <p className="mt-4 text-xs text-indigo-300">Nécessite d'être connecté à votre compte élève.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Ambassador;
