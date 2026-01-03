
import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatPriceFCFA, formatPriceUSD, WHATSAPP_SUPPORT, FLOOZ_NUMBER, TMONEY_NUMBER } from '../constants';
import { X, Check, ArrowRight, Smartphone, Loader2, ShieldCheck, Lock, CreditCard, Globe, Info, Fingerprint, ChevronLeft, ExternalLink } from 'lucide-react';

const CheckoutModal: React.FC = () => {
  const { checkoutModalOpen, setCheckoutModalOpen, items, total, clearCart, checkoutItem } = useCart();
  const { addTransaction, addNotification } = useStore();
  
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<'card' | 'mobile'>('card');
  const [mobileMethod, setMobileMethod] = useState<'tmoney' | 'flooz'>('tmoney');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', paymentRef: '' });

  const activeItems = useMemo(() => checkoutItem ? [checkoutItem] : items, [checkoutItem, items]);
  const activeTotal = useMemo(() => checkoutItem ? checkoutItem.price : total, [checkoutItem, total]);

  // LIEN DE PAIEMENT INTERNATIONAL (Stripe Payment Link ou PayPal.me)
  // À REMPLACER PAR VOTRE VRAI LIEN
  const PAYMENT_LINK_INTERNATIONAL = "https://www.paypal.com/paypalme/votrecompte"; 

  if (!checkoutModalOpen) return null;

  const handleFinalizePayment = async () => {
    if (!customer.name || !customer.email || !customer.phone) {
      addNotification("Veuillez remplir vos informations de contact.", "error");
      return;
    }

    if (paymentType === 'mobile' && !customer.paymentRef) {
      addNotification("Veuillez entrer la référence de votre transfert.", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Pour carte bancaire, on ouvre le lien de paiement
      if (paymentType === 'card') {
         window.open(PAYMENT_LINK_INTERNATIONAL, '_blank');
      }

      // Synchronisation Cloud directe
      await addTransaction({
        ...customer,
        method: paymentType === 'card' ? 'card' : mobileMethod,
        amount: activeTotal,
        type: activeItems[0]?.type || 'order',
        items: activeItems,
        paymentRef: paymentType === 'card' ? 'EN_ATTENTE_CHECK' : customer.paymentRef
      });
      
      const message = `*COMMANDE KOBLOGIX*\nClient: ${customer.name}\nMontant: ${formatPriceUSD(activeTotal)} (${formatPriceFCFA(activeTotal)})\nMode: ${paymentType === 'card' ? 'Carte Bancaire (Lien ouvert)' : mobileMethod.toUpperCase()}\nRéf: ${customer.paymentRef || 'N/A'}`;
      // On ouvre WhatsApp en arrière-plan pour notifier
      setTimeout(() => {
          window.open(`https://wa.me/${WHATSAPP_SUPPORT}?text=${encodeURIComponent(message)}`, '_blank');
      }, 1500);
      
      clearCart();
      setStep(3);
    } catch (error) {
      addNotification("Erreur de synchronisation Cloud. Vérifiez votre connexion.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-2xl animate-fadeIn border border-white/10 flex flex-col md:flex-row min-h-[650px]">
        
        {/* Sidebar Récapitulatif avec prix USD Géant */}
        <div className="w-full md:w-1/3 bg-slate-950 p-10 text-white relative flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-10">
              <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-3xl font-black mb-4 text-white">K</div>
              <h3 className="font-bold text-xl uppercase tracking-tighter">Votre Panier</h3>
            </div>
            
            <div className="space-y-4 mb-auto overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {activeItems.map(item => (
                <div key={item.id} className="flex justify-between items-start text-xs border-b border-white/5 pb-3">
                  <span className="opacity-60 max-w-[150px]">{item.name}</span>
                  <span className="font-bold">{formatPriceFCFA(item.price)}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10 mt-6">
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">TOTAL À RÉGLER</div>
              {/* PRIX USD GÉANT */}
              <div className="text-6xl lg:text-7xl font-black text-white leading-tight animate-pulse">{formatPriceUSD(activeTotal)}</div>
              <div className="text-xl font-bold opacity-30 mt-1">{formatPriceFCFA(activeTotal)}</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-14 space-y-8 overflow-y-auto relative">
          
          {/* Header avec Navigation (Bouton Retour/X) */}
          <div className="flex justify-between items-center mb-4">
            {step > 1 && step < 3 ? (
              <button 
                onClick={() => setStep(step - 1)} 
                className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary transition-all group"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> RETOUR
              </button>
            ) : <div/>}
            
            <button 
              onClick={() => setCheckoutModalOpen(false)} 
              className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full hover:rotate-90 transition-all text-slate-400 hover:text-red-500"
            >
              <X size={20}/>
            </button>
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-6">
                <h4 className="text-2xl font-black dark:text-white flex items-center gap-3"><Fingerprint className="text-primary"/> Informations Client</h4>
                <div className="grid gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom Complet</label>
                    <input 
                      placeholder="Ex: Jean Koffi" 
                      className="w-full p-5 rounded-2xl border-2 border-gray-100 dark:bg-slate-800 dark:border-slate-700 font-bold outline-none focus:border-primary transition-all text-lg" 
                      value={customer.name} 
                      onChange={e => setCustomer({...customer, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        type="email" 
                        placeholder="jean@mail.com" 
                        className="w-full p-5 rounded-2xl border-2 border-gray-100 dark:bg-slate-800 dark:border-slate-700 font-bold outline-none focus:border-primary transition-all" 
                        value={customer.email} 
                        onChange={e => setCustomer({...customer, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
                      <input 
                        placeholder="+228..." 
                        className="w-full p-5 rounded-2xl border-2 border-gray-100 dark:bg-slate-800 dark:border-slate-700 font-bold outline-none focus:border-primary transition-all" 
                        value={customer.phone} 
                        onChange={e => setCustomer({...customer, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setStep(2)} 
                disabled={!customer.name || !customer.email || !customer.phone}
                className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-6 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                MODE DE PAIEMENT <ArrowRight size={20}/>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-slideUp">
              <div className="space-y-6">
                <h4 className="text-2xl font-black dark:text-white flex items-center gap-3"><CreditCard className="text-primary"/> Choix du règlement</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPaymentType('card')} 
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${paymentType === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}
                  >
                    <Globe size={32}/>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Carte Bancaire / PayPal</span>
                  </button>
                  <button 
                    onClick={() => setPaymentType('mobile')} 
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${paymentType === 'mobile' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-slate-800 text-gray-400'}`}
                  >
                    <Smartphone size={32}/>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Mobile Money (Togo)</span>
                  </button>
                </div>

                {paymentType === 'card' ? (
                  <div className="p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border-2 border-blue-100 dark:border-blue-800 space-y-4">
                    <div className="flex items-center gap-3 text-primary font-bold"><Lock size={20}/> Redirection Sécurisée</div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                      En cliquant sur "Valider", une nouvelle page de paiement sécurisée (PayPal/Stripe) s'ouvrira. Une fois le paiement effectué, revenez ici.
                    </p>
                    <div className="flex gap-4 justify-center opacity-40">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-5" alt="Visa"/>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard"/>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setMobileMethod('tmoney')} 
                          className={`p-4 rounded-xl border-2 font-black text-xs transition-all ${mobileMethod === 'tmoney' ? 'border-primary bg-primary text-white' : 'text-gray-400 border-gray-100 dark:border-slate-800'}`}
                        >
                          T-MONEY
                        </button>
                        <button 
                          onClick={() => setMobileMethod('flooz')} 
                          className={`p-4 rounded-xl border-2 font-black text-xs transition-all ${mobileMethod === 'flooz' ? 'border-primary bg-primary text-white' : 'text-gray-400 border-gray-100 dark:border-slate-800'}`}
                        >
                          FLOOZ
                        </button>
                    </div>
                    <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-3xl border-2 border-orange-100 dark:border-orange-800 space-y-3">
                      <p className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">
                        Veuillez transférer <b>{formatPriceFCFA(activeTotal)}</b> sur le numéro suivant :<br/>
                        <span className="text-xl font-black block mt-1">{mobileMethod === 'tmoney' ? TMONEY_NUMBER : FLOOZ_NUMBER}</span>
                      </p>
                      <p className="text-[10px] text-orange-600 font-black uppercase">Destinataire : KOFFI M. / KOBLOGIX SERVICES</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ID / Référence de la transaction (SMS)</label>
                      <input 
                        placeholder="Ex: 928302" 
                        className="w-full p-5 border-2 border-primary dark:bg-slate-800 rounded-2xl font-mono text-center text-xl outline-none shadow-inner" 
                        value={customer.paymentRef} 
                        onChange={e => setCustomer({...customer, paymentRef: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleFinalizePayment} 
                disabled={isSubmitting} 
                className="w-full bg-primary text-white py-6 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : (paymentType === 'card' ? <ExternalLink size={24}/> : <ShieldCheck size={24}/>)}
                {isSubmitting ? "FINALISATION..." : (paymentType === 'card' ? "OUVRIR LA PAGE DE PAIEMENT" : "VALIDER MA COMMANDE")}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-20 animate-fadeIn space-y-6">
              <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <Check size={48} strokeWidth={3}/>
              </div>
              <h4 className="text-3xl font-black dark:text-white">Commande Enregistrée !</h4>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                Votre commande est en attente de validation. Notre équipe a été notifiée via WhatsApp et Cloud.
              </p>
              <button 
                onClick={() => setCheckoutModalOpen(false)} 
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-lg"
              >
                RETOUR AU SITE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
