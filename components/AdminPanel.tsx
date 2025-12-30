
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, LayoutDashboard, Calendar, Settings as SettingsIcon, LogOut, 
  Search, Download, Trash2, Check, Award, RefreshCw, UploadCloud, 
  Eye, EyeOff, DollarSign, Clock, Users, Save, FileCheck, Link as LinkIcon,
  XCircle, Globe, Lock
} from 'lucide-react';
import Modal from './ui/Modal';
import { formatPrice } from '../utils';
import { useStore } from '../context/StoreContext';
import { exportToExcel } from '../utils/exports';

const AdminPanel: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'sessions' | 'resources' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // États de brouillon pour les inputs (évite les lags au collage)
  const [draftLinks, setDraftLinks] = useState<any>(null);
  const [newAdminPass, setNewAdminPass] = useState('');

  const { 
    transactions, sessions, updateTransactionStatus, toggleCompletion, 
    deleteTransaction, clearTransactions, regenerateCode, isAdminOpen, 
    setAdminOpen, adminPassword, globalResources, saveAllGlobalResources,
    updateAdminPassword, updateSession, resetSessionSeats, updateServiceProgress
  } = useStore();

  useEffect(() => {
    if (currentTab === 'resources' && globalResources && !draftLinks) {
      setDraftLinks({ ...globalResources });
    }
  }, [currentTab, globalResources]);

  const handleLogin = () => {
    if (passwordInput === adminPassword) {
      setIsAuth(true);
      setLoginError('');
    } else {
      setLoginError("Mot de passe incorrect");
    }
  };

  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const term = searchTerm.toLowerCase();
      const matchSearch = (
        t.name.toLowerCase().includes(term) || 
        t.phone.includes(term) || 
        (t.paymentRef && t.paymentRef.toLowerCase().includes(term))
      );
      const matchStatus = (statusFilter === 'all' || t.status === statusFilter);
      return matchSearch && matchStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const approved = transactions.filter(t => t.status === 'approved');
    const revenue = approved.reduce((acc, t) => acc + t.amount, 0);
    return { revenue, pending: transactions.filter(t => t.status === 'pending').length, count: transactions.length, certified: approved.filter(t => t.isCompleted).length };
  }, [transactions]);

  const handleSaveLinks = async () => {
    if (draftLinks) await saveAllGlobalResources(draftLinks);
  };

  const handleUpdatePassword = async () => {
    if (newAdminPass.length < 4) return alert("Le mot de passe doit faire au moins 4 caractères.");
    await updateAdminPassword(newAdminPass);
    setNewAdminPass('');
  };

  if (!isAdminOpen) return null;

  return (
    <Modal 
      isOpen={isAdminOpen} onClose={() => setAdminOpen(false)} title="Console Administrative KOBLOGIX" 
      maxWidth="max-w-6xl" headerColor="bg-slate-900"
    >
      <div className="min-h-[60vh] text-slate-800 dark:text-gray-100 font-sans pb-8">
        {!isAuth ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
             <Shield size={64} className="text-slate-400 mb-8" />
             <h3 className="text-2xl font-black mb-8">Authentification Requise</h3>
             <div className="w-full max-w-sm relative mb-6">
                <input 
                    type={showPass ? "text" : "password"} value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className="w-full p-5 border-2 dark:border-slate-700 rounded-2xl text-center bg-white dark:bg-slate-800 outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-lg"
                    placeholder="Entrez le mot de passe..."
                />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
             </div>
             {loginError && <p className="text-red-500 font-bold mb-6 flex items-center gap-2"><XCircle size={16}/> {loginError}</p>}
             <button onClick={handleLogin} className="w-full max-w-sm bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">SE CONNECTER</button>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
             {/* Navigation par Onglets */}
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-100 dark:bg-slate-800 p-2 rounded-3xl">
                 <div className="flex gap-1 flex-wrap justify-center">
                     {[
                        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
                        { id: 'sessions', label: 'Inscriptions', icon: <Calendar size={18}/> },
                        { id: 'resources', label: 'Liens Drive', icon: <Globe size={18}/> },
                        { id: 'settings', label: 'Sécurité', icon: <Lock size={18}/> }
                     ].map(tab => (
                        <button key={tab.id} onClick={() => setCurrentTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${currentTab === tab.id ? 'bg-white dark:bg-slate-700 shadow-lg text-primary scale-105' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
                           {tab.icon} {tab.label}
                        </button>
                     ))}
                 </div>
                 <button onClick={() => setIsAuth(false)} className="px-6 py-3 bg-red-500 text-white rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg hover:bg-red-600">
                    <LogOut size={18}/> DÉCONNEXION
                 </button>
             </div>

             {/* DASHBOARD TAB */}
             {currentTab === 'dashboard' && (
                 <div className="space-y-6 text-left">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-primary p-6 rounded-[2rem] text-white shadow-xl">
                            <DollarSign className="opacity-50 mb-2" size={24}/>
                            <div className="text-3xl font-black">{formatPrice(stats.revenue)}</div>
                            <div className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Revenu Validé</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm border-b-4 border-orange-500">
                            <Clock className="text-orange-500 mb-2" size={24}/>
                            <div className="text-3xl font-black text-orange-500">{stats.pending}</div>
                            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">En attente</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm border-b-4 border-blue-500">
                            <Users className="text-blue-500 mb-2" size={24}/>
                            <div className="text-3xl font-black">{transactions.length}</div>
                            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Clients Totaux</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm border-b-4 border-purple-500">
                            <Award className="text-purple-500 mb-2" size={24}/>
                            <div className="text-3xl font-black text-purple-500">{stats.certified}</div>
                            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Certifiés</div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                            <input 
                              type="text" placeholder="Rechercher par nom, téléphone, réf..." value={searchTerm} 
                              onChange={e => setSearchTerm(e.target.value)} 
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none text-sm border-2 border-transparent focus:border-primary transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl text-xs font-black outline-none border border-gray-100 dark:border-slate-700">
                                <option value="all">TOUS STATUTS</option>
                                <option value="pending">EN ATTENTE</option>
                                <option value="approved">VALIDÉS</option>
                            </select>
                            <button onClick={() => exportToExcel(transactions)} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                                <Download size={18}/> EXPORTER EXCEL
                            </button>
                            <button onClick={() => { if(window.confirm("Voulez-vous vraiment vider tout l'historique ?")) clearTransactions(); }} className="bg-red-50 text-red-500 px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-red-100 transition-colors">
                                <Trash2 size={18}/> VIDER
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredData.map(t => (
                            <div key={t.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl transition-all group">
                                <div className="text-left flex-1 w-full">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`w-3 h-3 rounded-full ${t.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                        <h4 className="font-black text-lg">{t.name}</h4>
                                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase font-black">{t.type}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 font-medium">
                                        <div className="flex items-center gap-1"><Clock size={12}/> {t.date}</div>
                                        <div className="flex items-center gap-1 font-mono uppercase tracking-widest"><Shield size={12}/> {t.paymentRef || 'N/A'}</div>
                                    </div>
                                    {t.uploadedContractUrl && (
                                        <div className="mt-2 text-[10px] font-black text-purple-500 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full w-fit flex items-center gap-2 border border-purple-100 dark:border-purple-800">
                                            <FileCheck size={14}/> CONTRAT REÇU
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right mr-4 font-mono">
                                        <div className="text-xl font-black">{formatPrice(t.amount)}</div>
                                        <div className="text-[10px] font-bold text-gray-400">{t.code || 'NON VALIDÉ'}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        {t.status === 'pending' ? (
                                            <button onClick={() => updateTransactionStatus(t.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white p-3.5 rounded-2xl shadow-lg active:scale-90 transition-all"><Check size={22}/></button>
                                        ) : (
                                            <>
                                                <button onClick={() => toggleCompletion(t.id)} className={`p-3.5 rounded-2xl transition-all shadow-lg active:scale-90 ${t.isCompleted ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-purple-500'}`} title="Décerner Diplôme"><Award size={22}/></button>
                                                <button onClick={() => { const u = prompt("URL du Fichier Livrable (Drive) :"); if(u) updateServiceProgress(t.id, 100, { name: "Document Livré", url: u }); }} className={`p-3.5 rounded-2xl transition-all shadow-lg active:scale-90 ${t.deliveredFile ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-blue-500'}`} title="Livrer Travail"><UploadCloud size={22}/></button>
                                                <button onClick={() => regenerateCode(t.id)} className="p-3.5 bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-primary rounded-2xl transition-all" title="Régénérer Code"><RefreshCw size={22}/></button>
                                            </>
                                        )}
                                        <button onClick={() => { if(window.confirm("Supprimer cette transaction ?")) deleteTransaction(t.id); }} className="p-3.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"><Trash2 size={22}/></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             )}

             {/* SESSIONS TAB */}
             {currentTab === 'sessions' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {sessions.map(session => {
                        const participants = transactions.filter(t => t.status === 'approved' && t.items.some(i => i.sessionId === session.id));
                        return (
                            <div key={session.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col h-full hover:shadow-xl transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="font-black text-xl">{session.title}</h4>
                                        <p className="text-xs text-gray-500 font-bold">{session.dates}</p>
                                    </div>
                                    <button onClick={() => exportToExcel(participants)} className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Download size={20}/></button>
                                </div>
                                <div className="space-y-6 flex-1">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest text-gray-400">
                                            <span>Remplissage des places</span>
                                            <span className={session.available === 0 ? 'text-red-500' : 'text-green-600'}>{session.total - session.available} / {session.total}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full transition-all duration-1000 ${session.available === 0 ? 'bg-red-500' : 'bg-blue-600'}`} style={{width: `${((session.total - session.available) / session.total) * 100}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-gray-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-gray-100 dark:border-slate-700">
                                        <h5 className="text-[10px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2"><Users size={14}/> Participants Validés ({participants.length})</h5>
                                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                            {participants.length === 0 ? <p className="text-[10px] italic text-gray-400 py-4 text-center">Aucun inscrit pour le moment.</p> : 
                                                participants.map(p => (
                                                    <div key={p.id} className="text-[11px] font-black p-3 bg-white dark:bg-slate-800 rounded-xl flex justify-between items-center shadow-sm border border-gray-50 dark:border-slate-700">
                                                        <span className="truncate">{p.name}</span>
                                                        <div className="flex gap-2">
                                                          {p.uploadedContractUrl && <FileCheck size={14} className="text-purple-500"/>}
                                                          <Check size={14} className="text-green-500"/>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-6 border-t border-gray-100 dark:border-slate-700 mt-auto">
                                        <button onClick={() => resetSessionSeats(session.id)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black text-gray-500 hover:bg-gray-200 transition-colors uppercase tracking-widest">Reset Places</button>
                                        <input 
                                            type="number" value={session.available} 
                                            onChange={(e) => updateSession(session.id, { available: parseInt(e.target.value) || 0 })}
                                            className="w-20 bg-white dark:bg-slate-700 text-center py-3 rounded-2xl font-black text-sm border-2 border-transparent focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                 </div>
             )}

             {/* RESOURCES (LINKS) TAB */}
             {currentTab === 'resources' && draftLinks && (
                 <div className="max-w-4xl mx-auto space-y-8 text-left animate-slideUp">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-gray-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black flex items-center gap-3"><Globe size={32}/> Liens des Ressources Globales</h3>
                            <button onClick={handleSaveLinks} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-[2rem] font-black text-sm flex items-center gap-3 shadow-xl active:scale-95 transition-all">
                                <Save size={22}/> ENREGISTRER TOUS LES LIENS
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { label: "Fiche d'Inscription (Lien Drive)", key: "inscriptionUrl" },
                                { label: "Contrat Type PDF (Lien Drive)", key: "contractUrl" },
                                { label: "Pack Contenu Cours (Lien Drive)", key: "courseContentUrl" },
                                { label: "Invitation Canal WhatsApp VIP", key: "whatsappLink" },
                                { label: "Guide Installation Overleaf", key: "overleafGuideUrl" }
                            ].map(res => (
                                <div key={res.key} className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-gray-500 tracking-widest">{res.label}</label>
                                    <div className="relative">
                                      <input 
                                          type="text" value={draftLinks[res.key] || ''} 
                                          onChange={(e) => setDraftLinks({...draftLinks, [res.key]: e.target.value})}
                                          className="w-full p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all text-xs font-mono shadow-inner"
                                          placeholder="Collez le lien ici (Ctrl+V)..."
                                      />
                                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"><LinkIcon size={18}/></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
             )}

             {/* SETTINGS (SYSTEM) TAB */}
             {currentTab === 'settings' && (
                 <div className="max-w-xl mx-auto space-y-8 text-left animate-slideUp">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl">
                        <h3 className="text-2xl font-black flex items-center gap-3 mb-8"><Lock size={28}/> Paramètres du Système</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-black uppercase text-gray-500 mb-2 block">Nouveau Mot de Passe Administrateur</label>
                                <input 
                                    type="text" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)}
                                    placeholder="Ex: toujours plus haut"
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary outline-none transition-all font-bold"
                                />
                            </div>
                            <button onClick={handleUpdatePassword} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2">
                                <Save size={20}/> ENREGISTRER LE NOUVEAU MOT DE PASSE
                            </button>
                        </div>
                    </div>
                 </div>
             )}
          </div>
        )}
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>
    </Modal>
  );
};

export default AdminPanel;
