
import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils';
import { X, Check, ArrowRight, Smartphone, Loader2, AlertCircle } from 'lucide-react';
import { CustomerInfo } from '../types';
import { WHATSAPP_SUPPORT } from '../constants';

const CheckoutModal: React.FC = () => {
  // --- HOOKS DOIVENT ÊTRE AU DÉBUT (Règle React #310) ---
  const { checkoutModalOpen, setCheckoutModalOpen, items, total, clearCart, checkoutItem, setCheckoutItem } = useCart();
  const { addTransaction, verifyCoupon, addNotification } = useStore();
  
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{valid: boolean, id?: string} | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '', phone: '', email: '', paymentMethod: 'tmoney', paymentRef: ''
  });

  const activeItems = useMemo(() => checkoutItem ? [checkoutItem] : items, [checkoutItem, items]);
  const activeTotal = useMemo(() => checkoutItem ? checkoutItem.price : total, [checkoutItem, total]);

  // Seuls les articles de type "formation_full" ou "ai_pack" sont éligibles au coupon
  const isCouponEligible = useMemo(() => {
    return activeItems.some(item => 
      item.type === 'formation_full' || 
      item.type === 'ai_pack'
    );
  }, [activeItems]);

  // --- FIN DES HOOKS, DÉBUT DES CONDITIONS DE RENDU ---
  if (!checkoutModalOpen) return null;

  const handleVerifyCoupon = async () => {
    if (!couponCode) return;
    if (!isCouponEligible) {
        addNotification("Le code promo n'est valable que pour les Formations Complètes et le Pack IA.", "info");
        return;
    }
    setIsVerifying(true);
    try {
        const result = await verifyCoupon(couponCode);
        setCouponStatus(result);
        if (!result.valid) addNotification("Code invalide.", "error");
    } catch (e) {
        setCouponStatus({ valid: false });
    } finally {
        setIsVerifying(false);
    }
  };

  const discount = (couponStatus?.valid && isCouponEligible) ? 1000 : 0;
  const finalTotal = Math.max(0, activeTotal - discount);

  const handleSubmit = async () => {
    if (!customer.name || !customer.phone || !customer.paymentRef) {
        addNotification("Veuillez remplir toutes les informations de paiement.", "error");
        return;
    }

    setIsSubmitting(true);
    try {
        const { paymentMethod, ...customerBase } = customer;
        // Nous lançons la transaction
        await addTransaction({
          ...customerBase,
          method: paymentMethod,
          amount: finalTotal,
          couponUsed: couponStatus?.valid ? couponCode : undefined,
          ambassadorId: couponStatus?.id,
          type: activeItems[0]?.type || 'service',
          items: activeItems
        });
        
        const message = `*COMMANDE KOBLOGIX*\nClient: ${customer.name}\nTotal: ${finalTotal}F\nRef: ${customer.paymentRef}\nArticles: ${activeItems.map(i => i.name).join(', ')}`;
        window.open(`https://wa.me/${WHATSAPP_SUPPORT}?text=${encodeURIComponent(message)}`, '_blank');
        
        if (!checkoutItem) clearCart();
        setStep(3);
    } catch (error) {
        console.error("Payment submission error:", error);
        addNotification("Erreur lors de l'envoi. Veuillez vérifier votre connexion.", "error");
    } finally {
        // Garantir que la roue de chargement s'arrête
        setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCheckoutModalOpen(false);
    setCheckoutItem(null);
    setStep(1);
    setCouponStatus(null);
    setCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fadeIn">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <h3 className="font-serif text-xl font-bold">Paiement {checkoutItem ? 'Unitaire' : 'Global'}</h3>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full"><X/></button>
        </div>

        <div className="p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl text-sm border border-gray-100 dark:border-slate-700">
                <p className="font-bold text-gray-400 uppercase text-[10px] mb-2">Résumé de la sélection :</p>
                {activeItems.map(i => (
                  <div key={i.id} className="flex justify-between items-center py-1">
                    <span className="text-gray-700 dark:text-gray-300 truncate pr-4">{i.name}</span>
                    <b className="whitespace-nowrap">{formatPrice(i.price)}</b>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <input placeholder="Votre Nom Complet" className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}/>
                <input placeholder="WhatsApp (9X XX XX XX)" className="w-full p-4 border rounded-xl dark:bg-slate-900 dark:border-slate-700 outline-none focus:ring-1 focus:ring-primary" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}/>
              </div>
              
              <div className="pt-4 border-t dark:border-slate-700">
                 <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Code Promo / Parrainage</label>
                 <div className="flex gap-2">
                    <input placeholder="KOB-XXX" className="flex-1 p-4 bg-gray-50 dark:bg-slate-900 rounded-xl font-mono uppercase border dark:border-slate-700" value={couponCode} onChange={e => setCouponCode(e.target.value)}/>
                    <button onClick={handleVerifyCoupon} disabled={isVerifying || !isCouponEligible} className="bg-slate-100 dark:bg-slate-700 px-6 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50">
                        {isVerifying ? <Loader2 className="animate-spin" size={18}/> : "Vérifier"}
                    </button>
                 </div>
                 {couponStatus?.valid && <p className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1"><Check size={14}/> Réduction de 1000F appliquée !</p>}
                 {!isCouponEligible && <p className="text-gray-400 text-[10px] mt-2 italic flex items-center gap-1"><AlertCircle size={12}/> Les codes promos sont réservés aux formations complètes & Packs IA.</p>}
              </div>
              <button onClick={() => setStep(2)} disabled={!customer.name || !customer.phone} className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50">
                Suivant : Paiement
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slideUp">
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl text-center border-2 border-primary/10">
                 <p className="text-xs text-gray-400 uppercase font-bold">Total à payer</p>
                 <p className="text-4xl font-black text-primary">{formatPrice(finalTotal)}</p>
                 {discount > 0 && <p className="text-xs text-green-500 font-bold line-through opacity-50 mt-1">{formatPrice(activeTotal)}</p>}
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <button onClick={() => setCustomer({...customer, paymentMethod: 'tmoney'})} className={`flex-1 p-4 border-2 rounded-xl font-bold transition-all ${customer.paymentMethod === 'tmoney' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700' : 'border-gray-100 dark:border-slate-700 text-gray-400'}`}>T-Money</button>
                  <button onClick={() => setCustomer({...customer, paymentMethod: 'flooz'})} className={`flex-1 p-4 border-2 rounded-xl font-bold transition-all ${customer.paymentMethod === 'flooz' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700' : 'border-gray-100 dark:border-slate-700 text-gray-400'}`}>Flooz</button>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">
                    Effectuez le transfert au <span className="font-bold">98 28 65 41</span>, puis saisissez la référence du SMS reçu ci-dessous.
                </div>

                <input placeholder="Référence du transfert (Ex: 2026...)" className="w-full p-4 border-2 border-primary rounded-xl font-mono text-center text-lg outline-none" value={customer.paymentRef} onChange={e => setCustomer({...customer, paymentRef: e.target.value})}/>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="p-4 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 transition-colors"><X size={24}/></button>
                <button onClick={handleSubmit} disabled={isSubmitting || !customer.paymentRef} className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50">
                  {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Validation...</> : "Confirmer le paiement"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate-bounce">
               <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"><Check size={40}/></div>
               <h4 className="text-2xl font-bold">Transaction Reçue !</h4>
               <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Nous vérifions votre paiement. Vous recevrez vos accès par WhatsApp sous peu.</p>
               <button onClick={handleClose} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-8 shadow-lg active:scale-95 transition-all">Retour au site</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
