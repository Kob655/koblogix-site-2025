
import React, { useState, useEffect } from 'react';
import { Lock, Download, FileText, Video, FileCheck, Copy, Check, Clock, Award, ChevronRight, Briefcase, ExternalLink, BrainCircuit, Search, FileCode, Timer } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { generateReceipt } from '../utils/exports';
import { AI_PACK_CONTENT } from '../constants/aiContent';
import jsPDF from 'jspdf';

const Resources: React.FC = () => {
  const [code, setCode] = useState('');
  const [unlockedTransaction, setUnlockedTransaction] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const { transactions, currentUser, globalResources } = useStore();

  useEffect(() => {
    if (!unlockedTransaction?.codeExpiresAt) {
        setTimeLeft('');
        return;
    }

    const timer = setInterval(() => {
        const now = Date.now();
        const diff = unlockedTransaction.codeExpiresAt - now;

        if (diff <= 0) {
            setTimeLeft('EXPIRÉ');
            setUnlockedTransaction(null);
            setError('Code expiré.');
            clearInterval(timer);
        } else {
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${h}h ${m}m ${s}s`);
        }
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockedTransaction]);

  const handleUnlock = (manualCode?: string) => {
    setError('');
    const codeToTest = (manualCode || code).trim().toUpperCase();
    const transaction = transactions.find(t => t.code === codeToTest && t.status === 'approved');

    if (transaction) {
      if (transaction.codeExpiresAt && Date.now() > transaction.codeExpiresAt) {
          setError("Code expiré.");
          return;
      }
      setUnlockedTransaction(transaction);
    } else {
      setError("Code invalide ou non encore validé.");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(id);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const myTransactions = currentUser 
    ? transactions.filter(t => t.email === currentUser.email).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const renderContent = () => {
    if (!unlockedTransaction) return null;

    return (
        <div className="animate-slideUp w-full max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <button onClick={() => setUnlockedTransaction(null)} className="text-gray-400 hover:text-white text-sm">← Retour</button>
                <div className="flex gap-4 items-center">
                    {timeLeft && (
                         <div className="flex items-center gap-2 text-yellow-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <Timer size={14} className="animate-pulse"/>
                            <span className="text-[10px] font-black">{timeLeft}</span>
                         </div>
                    )}
                    <button onClick={() => generateReceipt(unlockedTransaction)} className="bg-white/10 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-2">
                        <FileCheck size={16} /> Reçu
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Administration</h4>
                    <div className="grid gap-3">
                        <a href={globalResources.inscriptionUrl} target="_blank" className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3"><FileText size={20} className="text-blue-400"/> <span className="text-sm font-bold">Fiche Inscription</span></div>
                            <Download size={16}/>
                        </a>
                        <a href={globalResources.contractUrl} target="_blank" className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3"><Briefcase size={20} className="text-purple-400"/> <span className="text-sm font-bold">Contrat</span></div>
                            <Download size={16}/>
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Formation</h4>
                    <div className="grid gap-3">
                        <a href={globalResources.courseContentUrl} target="_blank" className="p-4 rounded-xl border border-white/10 bg-purple-500/10 flex items-center justify-between">
                            <div className="flex items-center gap-3"><Video size={20} className="text-purple-400"/> <span className="text-sm font-bold">Cours Drive</span></div>
                            <ExternalLink size={16}/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <section id="ressources" className="py-24 bg-slate-950 text-white min-h-[700px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-serif mb-4 text-white">Ressources & Accès</h2>
        </div>

        <div className="max-w-4xl mx-auto bg-white/5 rounded-3xl p-8 border border-white/10">
           {unlockedTransaction ? renderContent() : (
               <div className="text-center space-y-8 py-10">
                   <div className="max-w-sm mx-auto space-y-6">
                       <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-400">
                           <Lock size={32} />
                       </div>
                       <div className="flex gap-2">
                           <input 
                               type="text" 
                               value={code} 
                               onChange={e => setCode(e.target.value)} 
                               placeholder="KOB-XXXX" 
                               className="flex-1 bg-black/40 border border-white/20 p-4 rounded-xl text-center outline-none focus:border-blue-500 font-mono text-lg uppercase"
                           />
                           <button onClick={() => handleUnlock()} className="bg-blue-600 p-4 rounded-xl"><ChevronRight/></button>
                       </div>
                       {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                   </div>
               </div>
           )}
        </div>
      </div>
    </section>
  );
};

export default Resources;
