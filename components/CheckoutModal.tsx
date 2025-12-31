
import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils';
import { X, Check, ArrowRight, User, CreditCard, Smartphone, Loader2, Tag, AlertCircle } from 'lucide-react';
import { CustomerInfo, CartItem } from '../types';
import { WHATSAPP_SUPPORT, USD_RATE } from '../constants';

const CheckoutModal: React.FC = () => {
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

  if (!checkoutModalOpen) return null;

  // Déterminer les articles concernés (tout le panier ou un seul)
  const activeItems = checkoutItem ? [checkoutItem] : items;
  const activeTotal = checkoutItem ? checkoutItem.price : total;

  // Vérifier si le coupon est éligible pour les articles sélectionnés
  // Par exemple : Un coupon ne s'applique qu'aux formations et packs IA, pas aux services de rédaction simples.
  const isCouponEligible = useMemo(() => {
    return activeItems.some(item => 
      item.type.includes('formation') || 
      item.type === 'ai_pack' || 
      item.type === 'inscription' || 
      item.type === 'reservation'
    );
  }, [activeItems]);

  const handleVerifyCoupon = async () => {
    if (!couponCode) return;
    if (!isCouponEligible) {
        addNotification("Ce code n'est pas applicable aux services sélectionnés.", "info");
        return;
    }
    setIsVerifying(true);
    try {
        const result = await verifyCoupon(couponCode);
        setCouponStatus(result);
        if (!result.valid) {
            addNotification("Code promo invalide.", "error");
        }
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
        addNotification("Veuillez remplir tous les champs obligatoires.", "error");
        return;
    }

    setIsSubmitting(true);
    try {
        await addTransaction({
          ...customer,
          amount: finalTotal,
          couponUsed: couponStatus?.valid ? couponCode : undefined,
          ambassadorId: couponStatus?.id,
          type: activeItems[0]?.type || 'service',
          items: activeItems
        });
        
        const message = `*COMMANDE KOBLOGIX*\nClient: ${customer.name}\nTotal: ${finalTotal}F\nRef: ${customer.paymentRef}\nArticles: ${activeItems.map(i => i.name).join(', ')}`;
        window.open(`https://wa.me/${WHATSAPP_SUPPORT}?text=${encodeURIComponent(message)}`, '_blank');
        
        if (!checkoutItem) {
            clearCart();
        }
        setStep(3);
    } catch (error) {
        console.error("Submission error:", error);
        addNotification("Une erreur est survenue lors de la soumission. Réessayez.", "error");
    } finally {
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
          <div>
            <h3 className="font-serif text-xl font-bold">Paiement Sécurisé</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{checkoutItem ? "Article Unique" : "Panier Complet"}</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X/></button>
        </div>

        <div className="p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Résumé de la sélection</h4>
                <div className="space-y-1">
                   {activeItems.map(i => (
                     <div key={i.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300 truncate pr-4">{i.name}</span>
                        <span className="font-bold">{formatPrice(i.price)}</span>
                     </div>
                   ))}
                </div>
              </div>

              <input placeholder="Nom Complet" className="w-full p-4 border rounded-2xl dark:bg-slate-900 dark:border-slate-700 outline-none focus:border-primary transition-all" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}/>
              <input placeholder="Téléphone WhatsApp" className="w-full p-4 border rounded-2xl dark:bg-slate-900 dark:border-slate-700 outline-none focus:border-primary transition-all" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}/>
              
              <div className="pt-4 border-t dark:border-slate-700">
                 <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Code Promo / Parrainage</label>
                 <div className="flex gap-2">
                    <input 
                      placeholder="Ex: KOB-123" 
                      className="flex-1 p-4 bg-gray-50 dark:bg-slate-900 rounded-xl font-mono uppercase outline-none focus:ring-1 focus:ring-primary"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                    />
                    <button 
                      onClick={handleVerifyCoupon}
                      disabled={isVerifying || !isCouponEligible}
                      className="bg-slate-100 dark:bg-slate-700 px-6 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
                    >
                      {isVerifying ? <Loader2 className="animate-spin" size={18}/> : "Vérifier"}
                    </button>
                 </div>
                 {couponStatus?.valid && <p className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1"><Check size={14}/> Réduction de 1000F appliquée !</p>}
                 {!isCouponEligible && <p className="text-gray-400 text-[10px] mt-2 italic flex items-center gap-1"><AlertCircle size={12}/> Les codes promos sont réservés aux formations et packs IA.</p>}
              </div>
              
              <button 
                onClick={() => setStep(2)} 
                disabled={!customer.name || !customer.phone}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95"
              >
                Passer au paiement
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slideUp">
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl text-center border-2 border-primary/10">
                 <p className="text-xs text-gray-400 uppercase font-bold">Total Final à régler</p>
                 <p className="text-4xl font-black text-primary mt-1">{formatPrice(finalTotal)}</p>
                 {discount > 0 && <p className="text-xs text-green-500 font-bold mt-1 line-through opacity-50">{formatPrice(activeTotal)}</p>}
              </div>

              <div className="space-y-3">
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setCustomer({...customer, paymentMethod: 'tmoney'})}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold ${customer.paymentMethod === 'tmoney' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' : 'border-gray-100 dark:border-slate-700'}`}
                    >
                       <Smartphone size={18}/> T-Money
                    </button>
                    <button 
                      onClick={() => setCustomer({...customer, paymentMethod: 'flooz'})}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold ${customer.paymentMethod === 'flooz' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-gray-100 dark:border-slate-700'}`}
                    >
                       <Smartphone size={18}/> Flooz
                    </button>
                 </div>
                 
                 <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    <p className="font-bold mb-1 text-primary">Instructions :</p>
                    Effectuez le transfert au <span className="font-black">98 28 65 41</span>, puis saisissez la référence du message reçu ci-dessous.
                 </div>

                 <input 
                   placeholder="Référence SMS (Ex: 2026...)" 
                   className="w-full p-4 border-2 border-primary rounded-2xl font-mono text-center outline-none bg-white dark:bg-slate-900 dark:border-primary/30 focus:border-primary transition-all text-lg" 
                   value={customer.paymentRef}
                   onChange={e => setCustomer({...customer, paymentRef: e.target.value})}
                 />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="p-4 rounded-2xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 transition-all"><X size={24}/></button>
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !customer.paymentRef}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Validation...</> : "Confirmer le paiement"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate-bounce">
               <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/20"><Check size={40}/></div>
               <h4 className="text-2xl font-bold mb-2">Transaction Enregistrée</h4>
               <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Nous vérifions votre paiement. Vous recevrez un code d'accès par WhatsApp sous peu.</p>
               <button onClick={handleClose} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all">Retour au site</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
