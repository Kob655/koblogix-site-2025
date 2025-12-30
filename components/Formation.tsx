
import React, { useState } from 'react';
import { Calendar, Check, Loader2, Video, GraduationCap, ArrowRight, UserPlus, Mail, Lock, User, Eye, EyeOff, LogIn, Users, Wifi, Clock, FileText, Star, Award, ShieldCheck, Zap, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils';
import Modal from './ui/Modal';

const Formation: React.FC = () => {
  const { addToCart } = useCart();
  const { sessions, currentUser, registerUser, loginUser } = useStore(); 
  const [userType, setUserType] = useState<'pro' | 'student'>('pro'); 
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState('jan');

  // Authentification & Modal State
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [pendingAction, setPendingAction] = useState<{session: any, action: 'full' | 'inscription' | 'reservation'} | null>(null);
  
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FULL_PRICE = 15000;
  const INSCRIPTION_FEE = 2000;
  const RESERVATION_FEE = 3500;
  const USD_RATE = 600;

  const months = [{ id: 'jan', label: 'Janvier' }, { id: 'feb', label: 'Février' }, { id: 'mar', label: 'Mars' }, { id: 'apr', label: 'Avril' }];
  const filteredSessions = sessions.filter(s => s.id.startsWith(activeMonth));

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    if (isLoginMode) {
      const success = loginUser(authForm.email, authForm.password);
      if (success) {
        setAuthModalOpen(false);
        if (pendingAction) executeAddToCart(pendingAction.session, pendingAction.action);
      }
    } else {
      if (!authForm.name || !authForm.email || authForm.password.length < 4 || !isPolicyAccepted) {
        setAuthError('Veuillez remplir tous les champs et accepter la politique.');
        setIsSubmitting(false);
        return;
      }
      registerUser({ name: authForm.name, email: authForm.email, password: authForm.password });
      setAuthModalOpen(false);
      if (pendingAction) executeAddToCart(pendingAction.session, pendingAction.action);
    }
    setIsSubmitting(false);
  };

  const handleActionClick = (session: any, action: 'full' | 'inscription' | 'reservation') => {
    if (!currentUser) {
        setPendingAction({ session, action });
        setAuthModalOpen(true);
    } else {
        executeAddToCart(session, action);
    }
  };

  const executeAddToCart = async (session: any, action: 'full' | 'inscription' | 'reservation') => {
    const currentSession = sessions.find(s => s.id === session.id);
    if (!currentSession || currentSession.available <= 0) return alert("Désolé, cette session est complète.");

    setLoadingId(`${session.id}-${action}`);
    await new Promise(r => setTimeout(r, 600)); 

    let price = action === 'full' ? (FULL_PRICE + (userType === 'pro' ? INSCRIPTION_FEE : 0)) : (action === 'inscription' ? INSCRIPTION_FEE : RESERVATION_FEE);
    
    addToCart({ 
        name: `Formation LaTeX - ${session.title}`, 
        price, 
        type: action === 'full' ? 'formation_full' : action, 
        details: `${session.dates} (${action.toUpperCase()})`, 
        sessionId: session.id 
    });
    setLoadingId(null);
  };

  return (
    <section id="formation" className="py-24 bg-white dark:bg-slate-950 transition-colors relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black font-serif text-slate-900 dark:text-white mb-8">Nos Sessions LaTeX 2026</h2>
          <div className="inline-flex bg-gray-50 dark:bg-slate-800 p-1.5 rounded-2xl border dark:border-slate-700 shadow-sm">
             <button onClick={() => setUserType('pro')} className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${userType === 'pro' ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>Professionnel</button>
             <button onClick={() => setUserType('student')} className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${userType === 'student' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>Étudiant</button>
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-16 flex-wrap">
            {months.map(m => (
                <button key={m.id} onClick={() => setActiveMonth(m.id)} className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${activeMonth === m.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105' : 'bg-white dark:bg-slate-800 text-gray-400 border dark:border-slate-700 hover:border-primary'}`}>{m.label}</button>
            ))}
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-14">
          {filteredSessions.map((session, index) => {
            const isSecond = index % 2 !== 0;
            const headerGradient = isSecond ? "from-purple-600 to-pink-500" : "from-blue-600 to-blue-400";
            const dateParts = session.dates.split(' ');
            const dayRange = dateParts[0];
            const monthShort = dateParts[1].substring(0, 3).toUpperCase();

            return (
              <div key={session.id} className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden flex flex-col shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-slate-800">
                 {/* Header Style Premium Glass */}
                 <div className={`relative h-44 bg-gradient-to-br ${headerGradient} p-10 flex flex-col justify-end text-white`}>
                    <div className="absolute top-8 left-10 text-[10px] font-black uppercase tracking-[0.3em] opacity-80">{session.title}</div>
                    <h3 className="text-5xl font-black mb-0">{months.find(m => m.id === activeMonth)?.label}</h3>
                    
                    {/* Date Badge Glassmorphism */}
                    <div className="absolute top-8 right-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-5 py-3 text-center shadow-lg">
                        <div className="text-xl font-black">{dayRange}</div>
                        <div className="text-[10px] font-black opacity-80">{monthShort}.</div>
                    </div>
                 </div>

                 {/* Body content */}
                 <div className="p-10 space-y-8">
                    {/* Places Restantes */}
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PLACES RESTANTES</span>
                            <span className="text-sm font-black text-green-500">{session.available} / {session.total}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${(session.available / session.total) * 100}%` }}></div>
                        </div>
                    </div>

                    {/* Options de Paiement (Les Rectangles) */}
                    <div className="space-y-4">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                            <Zap size={14} className="text-primary"/> Choisissez votre formule
                        </p>

                        {/* Rectangle 1: Inscription */}
                        <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-primary/50 transition-all group/opt">
                            <div>
                                <h4 className="font-black text-xs text-slate-800 dark:text-white uppercase tracking-tight">Frais d'Inscription</h4>
                                <p className="text-[10px] text-gray-400 font-medium">Ouverture de dossier</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-black text-primary">{formatPrice(INSCRIPTION_FEE)}</span>
                                <button 
                                    onClick={() => handleActionClick(session, 'inscription')}
                                    disabled={loadingId === `${session.id}-inscription`}
                                    className="bg-white dark:bg-slate-700 p-2.5 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm hover:bg-primary hover:text-white transition-all active:scale-90"
                                >
                                    {loadingId === `${session.id}-inscription` ? <Loader2 size={18} className="animate-spin"/> : <UserPlus size={18}/>}
                                </button>
                            </div>
                        </div>

                        {/* Rectangle 2: Bloquer ma place */}
                        <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-primary/50 transition-all group/opt">
                            <div>
                                <h4 className="font-black text-xs text-slate-800 dark:text-white uppercase tracking-tight">Bloquer ma place</h4>
                                <p className="text-[10px] text-gray-400 font-medium">Garantie de participation</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-black text-primary">{formatPrice(RESERVATION_FEE)}</span>
                                <button 
                                    onClick={() => handleActionClick(session, 'reservation')}
                                    disabled={loadingId === `${session.id}-reservation`}
                                    className="bg-white dark:bg-slate-700 p-2.5 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm hover:bg-primary hover:text-white transition-all active:scale-90"
                                >
                                    {loadingId === `${session.id}-reservation` ? <Loader2 size={18} className="animate-spin"/> : <ShieldCheck size={18}/>}
                                </button>
                            </div>
                        </div>

                        {/* Rectangle 3: Full Payment (Important) */}
                        <div className="flex items-center justify-between p-6 bg-primary/5 dark:bg-primary/10 rounded-[2.5rem] border-2 border-primary/20 hover:border-primary transition-all relative overflow-hidden group/full">
                            <div className="relative z-10">
                                <h4 className="font-black text-sm text-primary dark:text-blue-400 uppercase tracking-tight">Formation Complète</h4>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">Tout inclus (Inscription offerte)</p>
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="text-right">
                                    <div className="text-2xl font-black text-primary">{(FULL_PRICE + (userType === 'pro' ? INSCRIPTION_FEE : 0)).toLocaleString()} F</div>
                                    <div className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-widest">≈ {Math.ceil((FULL_PRICE + (userType === 'pro' ? INSCRIPTION_FEE : 0)) / USD_RATE)}$</div>
                                </div>
                                <button 
                                    onClick={() => handleActionClick(session, 'full')}
                                    disabled={loadingId === `${session.id}-full`}
                                    className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                                >
                                    {loadingId === `${session.id}-full` ? <Loader2 size={24} className="animate-spin"/> : <GraduationCap size={24}/>}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-2 text-[10px] text-gray-400 font-bold italic">
                        <Info size={12}/> Les accès au Drive VIP sont envoyés après validation du paiement.
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auth Modal */}
      <Modal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        title={isLoginMode ? "Accès Élève" : "Création de Profil"} 
        headerColor="bg-slate-900" 
        maxWidth="max-w-md"
      >
          <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authError && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold text-center border border-red-100">{authError}</div>}
              {!isLoginMode && (
                <div className="relative">
                  <User className="absolute top-4 left-4 text-gray-400" size={18} />
                  <input type="text" placeholder="Nom Complet (pour certificat)" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} className="w-full pl-12 p-4 rounded-2xl border dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all"/>
                </div>
              )}
              <div className="relative">
                <Mail className="absolute top-4 left-4 text-gray-400" size={18} />
                <input type="email" placeholder="Adresse Email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="w-full pl-12 p-4 rounded-2xl border dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all"/>
              </div>
              <div className="relative">
                <Lock className="absolute top-4 left-4 text-gray-400" size={18} />
                <input type={showPassword ? "text" : "password"} placeholder="Mot de passe" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="w-full pl-12 pr-12 p-4 rounded-2xl border dark:border-slate-700 bg-gray-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary dark:text-white transition-all"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
              </div>
              {!isLoginMode && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
                    <input type="checkbox" id="policy" checked={isPolicyAccepted} onChange={e => setIsPolicyAccepted(e.target.checked)} className="mt-1 w-4 h-4 accent-primary"/>
                    <label htmlFor="policy" className="text-[10px] text-gray-500 font-bold leading-relaxed cursor-pointer">En m'inscrivant, j'accepte que mes données soient utilisées pour la gestion de ma formation.</label>
                </div>
              )}
              <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-5 rounded-[2rem] font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 text-lg uppercase">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : (isLoginMode ? <><LogIn size={20}/> Se Connecter</> : <><UserPlus size={20}/> Créer mon compte</>)}
              </button>
              <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setAuthError(''); }} className="w-full py-2 text-xs font-black text-primary hover:underline uppercase tracking-tight">
                  {isLoginMode ? "Nouveau ? Créer un compte élève" : "Déjà inscrit ? Connectez-vous ici"}
              </button>
          </form>
      </Modal>
    </section>
  );
};

export default Formation;
