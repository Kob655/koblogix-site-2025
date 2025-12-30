
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils';
import { X, Check, ArrowRight, User, CreditCard, Smartphone, Loader2 } from 'lucide-react';
import { CustomerInfo } from '../types';
import { WHATSAPP_SUPPORT, USD_RATE } from '../constants';
import { sendEmail, formatOrderForEmail } from '../utils/emailService';

const CheckoutModal: React.FC = () => {
  const { checkoutModalOpen, setCheckoutModalOpen, items, total, clearCart } = useCart();
  const { addTransaction } = useStore();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    paymentMethod: 'tmoney',
    paymentRef: ''
  });

  if (!checkoutModalOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!customer.name || !customer.phone) {
        setError('Veuillez remplir les champs obligatoires');
        return;
      }
      if (customer.email && !validateEmail(customer.email)) {
        setError('Format d\'email invalide');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (customer.paymentRef.length < 3) {
        setError("Veuillez entrer la référence du paiement (ID de transaction SMS)");
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
        // 1. Déterminer le type (Amélioré)
        let transactionType = 'service';
        
        const hasAIPack = items.some(i => i.type === 'ai_pack');
        const hasFullFormation = items.some(i => i.type === 'formation_full');
        const hasReservation = items.some(i => i.type === 'reservation');
        const hasInscription = items.some(i => i.type === 'inscription');

        if (hasAIPack) transactionType = 'ai_pack';
        else if (hasFullFormation) transactionType = 'formation_full';
        else if (hasReservation) transactionType = 'reservation';
        else if (hasInscription) transactionType = 'inscription';

        // 2. Sauvegarde (Locale + Tentative Online)
        addTransaction({
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            method: customer.paymentMethod,
            paymentRef: customer.paymentRef,
            amount: total,
            type: transactionType,
            items: items
        });

        // 3. Message WhatsApp
        let message = `*NOUVELLE COMMANDE KOBLOGIX*\n\n`;
        message += `👤 *Client:* ${customer.name}\n`;
        message += `📱 *Tel:* ${customer.phone}\n`;
        message += `💳 *Ref Paiement:* ${customer.paymentRef} (${customer.paymentMethod.toUpperCase()})\n`;
        message += `\n*ARTICLES :*\n`;
        items.forEach(item => {
          message += `- ${item.name} : ${formatPrice(item.price)}\n`;
        });
        message += `\n*TOTAL : ${formatPrice(total)}*\n`;
        message += `Je confirme avoir effectué le paiement.`;

        // 4. Email (Silencieux si erreur)
        sendEmail(formatOrderForEmail(customer, items, total)).catch(() => {});

        // 5. Finalisation
        setTimeout(() => {
          const url = `https://wa.me/${WHATSAPP_SUPPORT}?text=${encodeURIComponent(message)}`;
          window.open(url, '_blank');
          clearCart();
          setIsSubmitting(false);
          setStep(3);
        }, 800);

    } catch (err) {
        console.error(err);
        setIsSubmitting(false);
        setError("Une erreur critique est survenue. Veuillez nous contacter sur WhatsApp.");
    }
  };

  const close = () => {
    setCheckoutModalOpen(false);
    setStep(1);
    setError('');
    setCustomer(prev => ({...prev, paymentRef: ''}));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative transition-colors">
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <h3 className="font-serif text-xl font-bold">Validation du Paiement</h3>
          <button onClick={close} className="hover:bg-white/20 p-2 rounded-full"><X size={20}/></button>
        </div>

        {/* Progress Bar */}
        <div className="flex bg-gray-100 dark:bg-slate-700 h-1.5">
          <div className={`h-full bg-primary transition-all duration-300 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-4 animate-slideUp">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <div className="p-3 bg-blue-50 dark:bg-slate-700 rounded-2xl"><User size={24}/></div>
                <h4 className="font-black text-lg">Informations Client</h4>
              </div>
              
              {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-black text-center border border-red-100">{error}</div>}
              
              <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nom Complet *</label>
                    <input type="text" className="w-full p-4 border dark:border-slate-700 rounded-2xl outline-none bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary dark:text-white" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} placeholder="Ex: Koffi Mensah"/>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Téléphone WhatsApp *</label>
                    <input type="tel" className="w-full p-4 border dark:border-slate-700 rounded-2xl outline-none bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary dark:text-white" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} placeholder="Ex: 90000000"/>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email (Optionnel)</label>
                    <input type="email" className="w-full p-4 border dark:border-slate-700 rounded-2xl outline-none bg-gray-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary dark:text-white" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} placeholder="Ex: jean@gmail.com"/>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slideUp">
              <div className="flex items-center gap-3 mb-2 text-primary">
                <div className="p-3 bg-blue-50 dark:bg-slate-700 rounded-2xl"><CreditCard size={24}/></div>
                <h4 className="font-black text-lg">Détails du Paiement</h4>
              </div>
              
              {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-black text-center border border-red-100">{error}</div>}

              <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600 flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Montant à régler</span>
                    <span className="text-sm font-black text-green-600">≈ {Math.ceil(total / USD_RATE)} $ USD</span>
                 </div>
                 <span className="text-3xl font-black text-slate-900 dark:text-white">{formatPrice(total)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setCustomer({...customer, paymentMethod: 'tmoney'})} className={`p-5 rounded-2xl border-2 font-black transition-all text-center ${customer.paymentMethod === 'tmoney' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-100 dark:border-slate-700 text-gray-400'}`}>
                    <div className="text-xs mb-1 opacity-60">T-Money</div>
                    <div className="text-xl font-black">*145#</div>
                  </button>
                  <button onClick={() => setCustomer({...customer, paymentMethod: 'flooz'})} className={`p-5 rounded-2xl border-2 font-black transition-all text-center ${customer.paymentMethod === 'flooz' ? 'border-secondary bg-secondary/10 text-secondary' : 'border-gray-100 dark:border-slate-700 text-gray-400'}`}>
                    <div className="text-xs mb-1 opacity-60">Flooz</div>
                    <div className="text-xl font-black">*155#</div>
                  </button>
              </div>

              <div className="bg-primary/5 p-6 rounded-2xl border-2 border-primary/20">
                 <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-2 text-center">ID de Transaction SMS (Obligatoire)</label>
                 <input 
                  type="text" 
                  className="w-full p-4 bg-white dark:bg-slate-800 rounded-xl font-mono text-center tracking-widest text-xl uppercase outline-none focus:ring-4 focus:ring-primary/20 border-2 border-primary"
                  value={customer.paymentRef}
                  onChange={e => setCustomer({...customer, paymentRef: e.target.value.toUpperCase()})}
                  placeholder="ID SMS"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate-fadeIn">
              <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20">
                <Check size={48} />
              </div>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Commande Reçue !</h4>
              <p className="text-gray-500 dark:text-gray-400 mb-10 font-bold leading-relaxed px-4">
                Nous vérifions votre paiement. <br/>
                WhatsApp s'est ouvert pour envoyer votre preuve.
              </p>
              <button onClick={close} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black shadow-xl hover:bg-black transition-all active:scale-95">
                Retour au Site
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step < 3 && (
          <div className="p-6 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 flex justify-between items-center">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="text-gray-400 font-black text-xs uppercase hover:text-slate-900">Précédent</button>
            ) : <div/> }
            <button 
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-[2rem] font-black flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 transition-all text-sm uppercase"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : (step === 1 ? <>Suivant <ArrowRight size={18}/></> : <>Valider la commande <Check size={18}/></>)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
