
import React, { useState } from 'react';
import { Lock, Download, FileText, Video, CheckCircle, FileCheck, Copy, Check, Clock, LogOut, Award, ChevronRight, Briefcase, ExternalLink, AlertCircle, Laptop, Sparkles, BrainCircuit, Search, FileCode, Layers, BookOpen, UploadCloud, Link } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { generateReceipt } from '../utils/exports';
import { AI_PACK_CONTENT } from '../constants/aiContent';
import jsPDF from 'jspdf';

const Resources: React.FC = () => {
  const [code, setCode] = useState('');
  const [unlockedTransaction, setUnlockedTransaction] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { transactions, currentUser, globalResources, uploadContract } = useStore();

  const handleUnlock = (manualCode?: string) => {
    setError('');
    const codeToTest = (manualCode || code).trim().toUpperCase();
    const transaction = transactions.find(t => t.code === codeToTest && t.status === 'approved');

    if (transaction) {
      if (transaction.codeExpiresAt && Date.now() > transaction.codeExpiresAt) {
          setError("Ce code a expiré.");
          return;
      }
      setUnlockedTransaction(transaction);
    } else {
      setError("Code invalide ou expiré.");
    }
  };

  const handleContractUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !unlockedTransaction) return;
    
    setIsUploading(true);
    // Simuler un upload vers Firebase Storage
    // Dans une version réelle, on utiliserait ref() et uploadBytes()
    const fakeUrl = "https://firebasestorage.googleapis.com/v0/b/contract-signed.pdf";
    
    setTimeout(async () => {
      await uploadContract(unlockedTransaction.id, fakeUrl);
      setIsUploading(false);
    }, 1500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(id);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const generateCertificate = (name: string, date: string) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    doc.setDrawColor(0, 119, 182); doc.setLineWidth(2); doc.rect(10, 10, 277, 190);
    doc.setFont("helvetica", "bold"); doc.setTextColor(0, 119, 182); doc.setFontSize(40);
    doc.text("CERTIFICAT DE RÉUSSITE", 148.5, 50, { align: "center" });
    doc.setFontSize(16); doc.setTextColor(100); doc.text("Décerné à", 148.5, 75, { align: "center" });
    doc.setFontSize(32); doc.setTextColor(44, 62, 80); doc.text(name, 148.5, 95, { align: "center" });
    doc.text("KOBLOGIX", 220, 170, { align: "center" });
    doc.save(`Certificat_KOBLOGIX_${name.replace(' ', '_')}.pdf`);
  };

  const myTransactions = currentUser 
    ? transactions.filter(t => t.email === currentUser.email).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const renderAIPackDashboard = () => (
    <div className="space-y-10 animate-slideUp">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] text-white shadow-xl">
            <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                <BrainCircuit size={32}/> Votre Pack IA Premium
            </h3>
            <p className="text-blue-100 text-sm">Bienvenue dans votre nouvel arsenal de recherche. Utilisez ces ressources stratégiquement pour vos thèses et articles.</p>
        </div>

        {/* AI Tool Library */}
        <section>
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Search size={16}/> Bibliothèque d'Outils Sélectionnés
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
                {AI_PACK_CONTENT.tools.map((cat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-blue-500/30 transition-colors">
                        <h5 className="font-bold text-blue-400 mb-4 border-b border-white/5 pb-2 text-xs uppercase tracking-widest">{cat.category}</h5>
                        <div className="space-y-6">
                            {cat.items.map((tool, j) => (
                                <div key={j} className="group">
                                    <a href={tool.url} target="_blank" className="font-bold text-sm text-white hover:text-blue-400 flex items-center justify-between transition-colors">
                                        {tool.name} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                                    </a>
                                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{tool.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Ultimate Prompts */}
        <section>
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <FileCode size={16}/> Prompts Stratégiques "Copier-Coller"
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
                {AI_PACK_CONTENT.prompts.map((p, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col group hover:border-purple-500/30 transition-colors">
                        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                            <span className="font-bold text-sm text-gray-300">{p.title}</span>
                            <button 
                                onClick={() => copyToClipboard(p.prompt, `prompt-${i}`)}
                                className={`flex items-center gap-2 text-[10px] font-bold px-4 py-1.5 rounded-full transition-all ${copiedPrompt === `prompt-${i}` ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
                            >
                                {copiedPrompt === `prompt-${i}` ? <><Check size={12}/> Copié !</> : <><Copy size={12}/> Copier</>}
                            </button>
                        </div>
                        <div className="p-5 text-xs text-gray-500 font-mono italic leading-relaxed bg-black/20">
                            "{p.prompt.substring(0, 160)}..."
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </div>
  );

  const renderContent = () => {
    if (!unlockedTransaction) return null;

    if (unlockedTransaction.type === 'ai_pack') {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <button onClick={() => setUnlockedTransaction(null)} className="text-gray-400 hover:text-white text-sm mb-8 flex items-center gap-2">
                    <ChevronRight size={16} className="rotate-180"/> Retour à mes ressources
                </button>
                {renderAIPackDashboard()}
            </div>
        );
    }

    const isFull = unlockedTransaction.type === 'formation_full';
    const isInscription = unlockedTransaction.type === 'inscription' || isFull;
    const isReservation = unlockedTransaction.type === 'reservation' || isFull;
    const isCompleted = unlockedTransaction.isCompleted;

    return (
        <div className="animate-slideUp w-full max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <button onClick={() => setUnlockedTransaction(null)} className="text-gray-400 hover:text-white text-sm">← Retour</button>
                <div className="flex gap-2">
                    <button onClick={() => generateReceipt(unlockedTransaction)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-2">
                        <FileCheck size={16} /> Reçu de Paiement
                    </button>
                </div>
            </div>

            {/* Fichier livré par l'Admin (Travaux Finis) */}
            {unlockedTransaction.deliveredFile && (
                <div className="p-6 rounded-[2rem] border border-green-500/30 bg-green-500/10 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
                    <div className="flex items-center gap-4 text-center md:text-left">
                        <div className="p-4 bg-green-500 text-white rounded-2xl"><Download size={24}/></div>
                        <div>
                            <div className="font-black text-lg">Votre commande est prête !</div>
                            <div className="text-xs text-green-400 font-bold uppercase tracking-widest">{unlockedTransaction.deliveredFile.name}</div>
                        </div>
                    </div>
                    <a href={unlockedTransaction.deliveredFile.url} target="_blank" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-500/20">
                        Télécharger maintenant
                    </a>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Liens Ressources - INSCRIPTION & CONTRAT */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Documents Administratifs</h4>
                    <div className="grid gap-3">
                        <a href={globalResources.inscriptionUrl} target="_blank" className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3"><FileText size={20} className="text-blue-400"/> <span className="text-sm font-bold">Télécharger Fiche d'Inscription</span></div>
                            <Download size={16} className="text-gray-500"/>
                        </a>
                        <a href={globalResources.contractUrl} target="_blank" className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3"><Briefcase size={20} className="text-purple-400"/> <span className="text-sm font-bold">Télécharger Contrat de Formation</span></div>
                            <Download size={16} className="text-gray-500"/>
                        </a>

                        {/* ZONE UPLOAD CONTRAT */}
                        <div className="mt-4 p-5 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center text-center">
                            <UploadCloud size={32} className="text-primary mb-2" />
                            <h5 className="text-sm font-bold mb-1">Téléverser le Contrat Signé (PDF)</h5>
                            <p className="text-[10px] text-gray-500 mb-4">Obligatoire pour la validation finale du dossier.</p>
                            
                            {unlockedTransaction.uploadedContractUrl ? (
                                <div className="flex items-center gap-2 text-green-500 font-bold text-xs bg-green-500/10 px-4 py-2 rounded-full">
                                    <CheckCircle size={14}/> Reçu par l'administration
                                </div>
                            ) : (
                                <label className="cursor-pointer bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                                    {isUploading ? <><Clock size={14} className="animate-spin"/> Patientez...</> : <><UploadCloud size={14}/> Sélectionner le PDF</>}
                                    <input type="file" accept=".pdf" className="hidden" onChange={handleContractUpload} disabled={isUploading} />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* Liens Ressources - FORMATION FULL */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contenu Pédagogique</h4>
                    <div className="grid gap-3">
                        <a 
                          href={globalResources.courseContentUrl} 
                          target="_blank" 
                          className={`p-4 rounded-xl border border-white/10 flex items-center justify-between transition-colors ${isFull ? 'bg-purple-500/10 hover:bg-purple-500/20' : 'opacity-40 cursor-not-allowed pointer-events-none'}`}
                        >
                            <div className="flex items-center gap-3"><Video size={20} className="text-purple-400"/> <span className="text-sm font-bold">Pack Cours & Drive Premium</span></div>
                            {isFull ? <ExternalLink size={16}/> : <Lock size={16}/>}
                        </a>
                        <a 
                          href={globalResources.whatsappLink} 
                          target="_blank" 
                          className={`p-4 rounded-xl border border-white/10 flex items-center justify-between transition-colors ${isFull ? 'bg-green-500/10 hover:bg-green-500/20' : 'opacity-40 cursor-not-allowed pointer-events-none'}`}
                        >
                            <div className="flex items-center gap-3"><Link size={20} className="text-green-400"/> <span className="text-sm font-bold">Lien Canal WhatsApp VIP</span></div>
                            {isFull ? <ExternalLink size={16}/> : <Lock size={16}/>}
                        </a>
                        <a 
                          href={globalResources.overleafGuideUrl} 
                          target="_blank" 
                          className={`p-4 rounded-xl border border-white/10 flex items-center justify-between transition-colors ${isFull ? 'bg-blue-500/10 hover:bg-blue-500/20' : 'opacity-40 cursor-not-allowed pointer-events-none'}`}
                        >
                            <div className="flex items-center gap-3"><Laptop size={20} className="text-blue-400"/> <span className="text-sm font-bold">Guide Installation Overleaf</span></div>
                            {isFull ? <ExternalLink size={16}/> : <Lock size={16}/>}
                        </a>
                    </div>
                    {!isFull && (
                        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-3 mt-4">
                            <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-orange-400 leading-relaxed font-bold">
                                Note : Le contenu du cours et le canal WhatsApp sont réservés aux inscrits en formation complète. Régularisez votre paiement pour y accéder.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Certification */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[2.5rem] p-8 border border-white/10 text-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isCompleted ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-500'}`}><Award size={32} /></div>
                <h4 className="text-xl font-bold">Certification Professionnelle</h4>
                {isCompleted ? (
                    <button onClick={() => generateCertificate(unlockedTransaction.name, unlockedTransaction.date)} className="bg-white text-blue-900 px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto shadow-lg hover:scale-105 transition-all">
                        <Download size={20}/> Télécharger mon Certificat
                    </button>
                ) : <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">En attente de validation finale de votre formation par l'administration.</p>}
            </div>
        </div>
    );
  };

  return (
    <section id="ressources" className="py-24 bg-slate-950 text-white min-h-[700px] relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-serif mb-4">Espace Ressources <span className="text-primary">&</span> Travaux</h2>
          <p className="text-gray-400">Accédez à vos outils, cours et documents administratifs.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
           {unlockedTransaction ? renderContent() : (
               <div className="text-center space-y-8 py-10">
                   {currentUser ? (
                       <div className="grid gap-4">
                           {myTransactions.length === 0 ? (
                               <div className="text-gray-500 italic py-10">Vous n'avez pas encore de commande validée.</div>
                           ) : (
                               myTransactions.map(t => (
                                   <div key={t.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
                                       <div className="text-left">
                                           <div className="font-bold flex items-center gap-2">
                                               {t.items[0]?.name}
                                               {t.type === 'ai_pack' && <Sparkles size={14} className="text-purple-400"/>}
                                           </div>
                                           <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{t.date} • {t.status === 'approved' ? <span className="text-green-500">Validé</span> : 'Vérification...'}</div>
                                       </div>
                                       {t.status === 'approved' ? (
                                           <button onClick={() => handleUnlock(t.code)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/10 active:scale-95 transition-all">
                                               Ouvrir
                                           </button>
                                       ) : (
                                           <div className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-2">
                                               <Clock size={12}/> En attente
                                           </div>
                                       )}
                                   </div>
                               ))
                           )}
                       </div>
                   ) : (
                       <div className="max-w-sm mx-auto space-y-6">
                           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-6">
                               <Lock size={32} />
                           </div>
                           <p className="text-sm text-gray-400">Veuillez entrer le code d'accès reçu par WhatsApp après votre paiement.</p>
                           <div className="flex gap-2">
                               <input 
                                   type="text" 
                                   value={code} 
                                   onChange={e => setCode(e.target.value)} 
                                   placeholder="KOB-XXXX" 
                                   className="flex-1 bg-black/40 border border-white/20 p-4 rounded-xl text-center outline-none focus:border-blue-500 font-mono text-lg tracking-[0.2em] transition-all uppercase"
                               />
                               <button 
                                   onClick={() => handleUnlock()} 
                                   className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                               >
                                   <ChevronRight/>
                               </button>
                           </div>
                           {error && <p className="text-red-400 text-xs font-bold animate-bounce">{error}</p>}
                       </div>
                   )}
               </div>
           )}
        </div>
      </div>
    </section>
  );
};

export default Resources;
