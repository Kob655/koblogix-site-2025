
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, LayoutDashboard, Calendar, Settings as SettingsIcon, LogOut, 
  Search, Download, Trash2, Check, Award, RefreshCw, UploadCloud, 
  Eye, EyeOff, DollarSign, Clock, Users, Save, FileCheck, Link as LinkIcon,
  XCircle, Globe, Lock, Wifi, WifiOff, RefreshCcw
} from 'lucide-react';
import Modal from './ui/Modal';
import { formatPrice } from '../utils';
import { useStore } from '../context/StoreContext';
import { exportToExcel } from '../utils/exports';

const AdminPanel: React.FC = () => {
  const { 
    transactions, sessions, updateTransactionStatus, toggleCompletion, 
    deleteTransaction, isAdminOpen, setAdminOpen, adminPassword, 
    globalResources, isCloudSync, updateSession, resetSessionSeats, updateServiceProgress,
    saveAllGlobalResources, updateAdminPassword, regenerateCode
  } = useStore();

  const [isAuth, setIsAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'sessions' | 'resources' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [draftLinks, setDraftLinks] = useState<any>(null);
  const [newAdminPass, setNewAdminPass] = useState('');

  useEffect(() => {
    if (currentTab === 'resources' && globalResources) {
      setDraftLinks({ ...globalResources });
    }
  }, [currentTab, globalResources]);

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

  if (!isAdminOpen) return null;

  const handleLogin = () => {
    if (passwordInput === adminPassword) {
      setIsAuth(true);
      setLoginError('');
    } else {
      setLoginError("Mot de passe incorrect");
    }
  };

  return (
    <Modal 
      isOpen={isAdminOpen} onClose={() => setAdminOpen(false)} title="Console Admin KOBLOGIX" 
      maxWidth="max-w-6xl" headerColor="bg-slate-900"
    >
      <div className="min-h-[60vh] text-slate-800 dark:text-gray-100 font-sans pb-8">
        {!isAuth ? (
          <div className="flex flex-col items-center justify-center py-16">
             <Shield size={64} className="text-slate-400 mb-8" />
             <h3 className="text-2xl font-black mb-8">Authentification</h3>
             <div className="w-full max-w-sm relative mb-6">
                <input 
                    type={showPass ? "text" : "password"} value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className="w-full p-5 border-2 dark:border-slate-700 rounded-2xl text-center bg-white dark:bg-slate-800 outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-lg"
                    placeholder="Code secret..."
                />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
             </div>
             {loginError && <p className="text-red-500 font-bold mb-6">{loginError}</p>}
             <button onClick={handleLogin} className="w-full max-w-sm bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">SE CONNECTER</button>
          </div>
        ) : (
          <div className="space-y-6">
             {/* Status Header */}
             <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl border dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isCloudSync ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {isCloudSync ? <Wifi size={14}/> : <WifiOff size={14}/>}
                        {isCloudSync ? 'Cloud Sync Actif' : 'Mode Local (Offline)'}
                    </div>
                    {!isCloudSync && <span className="text-[10px] text-gray-400 font-medium">Configurez Firebase pour voir les commandes de tous les appareils.</span>}
                </div>
                <button onClick={() => window.location.reload()} className="p-2 text-gray-400 hover:text-primary transition-colors"><RefreshCcw size={18}/></button>
             </div>

             <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-100 dark:bg-slate-800 p-2 rounded-3xl">
                 <div className="flex gap-1 flex-wrap justify-center">
                     {[
                        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
                        { id: 'sessions', label: 'Sessions', icon: <Calendar size={18}/> },
                        { id: 'resources', label: 'Liens Drive', icon: <Globe size={18}/> },
                        { id: 'settings', label: 'Sécurité', icon: <Lock size={18}/> }
                     ].map(tab => (
                        <button key={tab.id} onClick={() => setCurrentTab(tab.id as any)} className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${currentTab === tab.id ? 'bg-white dark:bg-slate-700 shadow-md text-primary' : 'text-gray-500 hover:bg-gray-200'}`}>
                           {tab.icon} {tab.label}
                        </button>
                     ))}
                 </div>
                 <button onClick={() => setIsAuth(false)} className="px-6 py-3 bg-red-500 text-white rounded-2xl text-sm font-black flex items-center gap-2">
                    <LogOut size={18}/> DÉCONNEXION
                 </button>
             </div>

             {currentTab === 'dashboard' && (
                 <div className="space-y-6 text-left">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-primary p-6 rounded-[2rem] text-white shadow-xl">
                            <DollarSign className="opacity-50 mb-2" size={24}/>
                            <div className="text-3xl font-black">{formatPrice(stats.revenue)}</div>
                            <div className="text-[10px] uppercase font-bold opacity-70">Total Validé</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm">
                            <Clock className="text-orange-500 mb-2" size={24}/>
                            <div className="text-3xl font-black text-orange-500">{stats.pending}</div>
                            <div className="text-[10px] uppercase font-bold text-gray-500">En attente</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm">
                            <Users className="text-blue-500 mb-2" size={24}/>
                            <div className="text-3xl font-black">{transactions.length}</div>
                            <div className="text-[10px] uppercase font-bold text-gray-500">Commandes Totales</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm">
                            <Award className="text-purple-500 mb-2" size={24}/>
                            <div className="text-3xl font-black text-purple-500">{stats.certified}</div>
                            <div className="text-[10px] uppercase font-bold text-gray-500">Certifiés</div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                            <input 
                              type="text" placeholder="Rechercher un client ou une réf..." value={searchTerm} 
                              onChange={e => setSearchTerm(e.target.value)} 
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none text-sm border-2 border-transparent focus:border-primary transition-all"
                            />
                        </div>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl text-xs font-black border dark:border-slate-700">
                            <option value="all">TOUS STATUTS</option>
                            <option value="pending">EN ATTENTE</option>
                            <option value="approved">VALIDÉS</option>
                        </select>
                        <button onClick={() => exportToExcel(transactions)} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg">
                            <Download size={18}/> EXCEL
                        </button>
                    </div>

                    <div className="space-y-3">
                        {filteredData.length === 0 ? (
                            <div className="py-20 text-center text-gray-400 italic">Aucune commande trouvée.</div>
                        ) : filteredData.map(t => (
                            <div key={t.id} className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary/50 transition-all">
                                <div className="text-left flex-1 w-full">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`w-3 h-3 rounded-full ${t.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                        <h4 className="font-black text-lg">{t.name}</h4>
                                        <span className="text-[10px] bg-blue-50 dark:bg-blue-900/40 text-blue-600 px-2 py-0.5 rounded-full font-black uppercase">{t.type}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1"><Clock size={12}/> {t.date}</div>
                                        <div className="font-mono uppercase font-bold text-gray-500">Réf: {t.paymentRef || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right mr-4 font-mono">
                                        <div className="text-xl font-black">{formatPrice(t.amount)}</div>
                                        <div className="text-[10px] font-bold text-primary">{t.code || 'EN ATTENTE'}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        {t.status === 'pending' ? (
                                            <button onClick={() => updateTransactionStatus(t.id, 'approved')} className="bg-green-600 text-white p-3.5 rounded-2xl shadow-lg active:scale-90"><Check size={22}/></button>
                                        ) : (
                                            <>
                                                <button onClick={() => toggleCompletion(t.id)} className={`p-3.5 rounded-2xl transition-all shadow-lg ${t.isCompleted ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`} title="Certifié"><Award size={22}/></button>
                                                <button onClick={() => { const u = prompt("URL du Document :"); if(u) updateServiceProgress(t.id, 100, { name: "Lien Drive", url: u }); }} className={`p-3.5 rounded-2xl transition-all shadow-lg ${t.deliveredFile ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`} title="Livrer"><UploadCloud size={22}/></button>
                                                <button onClick={() => regenerateCode(t.id)} className="p-3.5 bg-gray-100 text-gray-400 hover:text-primary rounded-2xl transition-all"><RefreshCw size={22}/></button>
                                            </>
                                        )}
                                        <button onClick={() => { if(window.confirm("Supprimer définitivement ?")) deleteTransaction(t.id); }} className="p-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={22}/></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             )}

             {currentTab === 'sessions' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {sessions.map(session => {
                        const participants = transactions.filter(t => t.status === 'approved' && t.items.some(i => i.sessionId === session.id));
                        return (
                            <div key={session.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border dark:border-slate-800 shadow-sm flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="font-black text-xl">{session.title}</h4>
                                        <p className="text-xs text-gray-500 font-bold">{session.dates}</p>
                                    </div>
                                    <button onClick={() => exportToExcel(participants)} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Download size={20}/></button>
                                </div>
                                <div className="space-y-6 flex-1">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest text-gray-400">
                                            <span>Inscriptions</span>
                                            <span className={session.available === 0 ? 'text-red-500' : 'text-green-600'}>{session.total - session.available} / {session.total}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-1000 ${session.available === 0 ? 'bg-red-500' : 'bg-blue-600'}`} style={{width: `${((session.total - session.available) / session.total) * 100}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border dark:border-slate-700">
                                        <h5 className="text-[10px] font-black uppercase text-gray-400 mb-3 flex items-center gap-2"><Users size={14}/> Élèves ({participants.length})</h5>
                                        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                            {participants.length === 0 ? <p className="text-[10px] italic text-gray-400 text-center py-4">Aucun inscrit validé.</p> : 
                                                participants.map(p => (
                                                    <div key={p.id} className="text-[11px] font-black p-2.5 bg-white dark:bg-slate-800 rounded-xl flex justify-between items-center shadow-sm">
                                                        <span className="truncate">{p.name}</span>
                                                        <Check size={14} className="text-green-500 flex-shrink-0"/>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-4 mt-auto">
                                        <button onClick={() => resetSessionSeats(session.id)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-widest">Reset</button>
                                        <input 
                                            type="number" value={session.available} 
                                            onChange={(e) => updateSession(session.id, { available: parseInt(e.target.value) || 0 })}
                                            className="w-16 bg-white dark:bg-slate-700 text-center py-3 rounded-2xl font-black text-sm border-2 border-transparent focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                 </div>
             )}

             {currentTab === 'resources' && draftLinks && (
                 <div className="max-w-4xl mx-auto space-y-8 text-left animate-slideUp">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border dark:border-slate-800 shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black flex items-center gap-3"><Globe size={32}/> Paramètres Cloud</h3>
                            <button onClick={() => saveAllGlobalResources(draftLinks)} className="bg-green-600 text-white px-8 py-4 rounded-[2rem] font-black text-sm flex items-center gap-3 shadow-xl active:scale-95 transition-all">
                                <Save size={22}/> ENREGISTRER
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { label: "Drive Inscription", key: "inscriptionUrl" },
                                { label: "Modèle Contrat", key: "contractUrl" },
                                { label: "Contenu Cours", key: "courseContentUrl" },
                                { label: "Lien WhatsApp VIP", key: "whatsappLink" },
                                { label: "Guide Overleaf", key: "overleafGuideUrl" }
                            ].map(res => (
                                <div key={res.key} className="space-y-2">
                                    <label className="text-[11px] font-black uppercase text-gray-500 tracking-widest">{res.label}</label>
                                    <div className="relative">
                                      <input 
                                          type="text" value={draftLinks[res.key] || ''} 
                                          onChange={(e) => setDraftLinks({...draftLinks, [res.key]: e.target.value})}
                                          className="w-full p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary outline-none text-xs font-mono"
                                          placeholder="URL publique..."
                                      />
                                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"><LinkIcon size={18}/></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
             )}

             {currentTab === 'settings' && (
                 <div className="max-w-xl mx-auto text-left animate-slideUp">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border dark:border-slate-800 shadow-xl">
                        <h3 className="text-2xl font-black flex items-center gap-3 mb-8"><Lock size={28}/> Admin Security</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-black uppercase text-gray-500 mb-2 block">Nouveau Code d'accès Admin</label>
                                <input 
                                    type="text" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)}
                                    placeholder="Ex: koblogix2026"
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold"
                                />
                            </div>
                            <button onClick={() => { if(newAdminPass) updateAdminPassword(newAdminPass); }} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
                                <Save size={20}/> METTRE À JOUR LE CODE
                            </button>
                        </div>
                    </div>
                 </div>
             )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AdminPanel;
