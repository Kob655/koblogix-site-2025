
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils';
import { X, Check, ArrowRight, User, CreditCard, Smartphone, Loader2, Tag } from 'lucide-react';
import { CustomerInfo } from '../types';
import { WHATSAPP_SUPPORT, USD_RATE } from '../constants';

const CheckoutModal: React.FC = () => {
  const { checkoutModalOpen, setCheckoutModalOpen, items, total, clearCart } = useCart();
  const { addTransaction, verifyCoupon } = useStore();
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{valid: boolean, id?: string} | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '', phone: '', email: '', paymentMethod: 'tmoney', paymentRef: ''
  });

  if (!checkoutModalOpen) return null;

  const handleVerifyCoupon = async () => {
    if (!couponCode) return;
    setIsVerifying(true);
    const result = await verifyCoupon(couponCode);
    setCouponStatus(result);
    setIsVerifying(false);
  };

  const finalTotal = couponStatus?.valid ? Math.max(0, total - 1000) : total;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await addTransaction({
      ...customer,
      amount: finalTotal,
      couponUsed: couponCode,
      ambassadorId: couponStatus?.id,
      type: items[0]?.type || 'service',
      items: items
    });
    
    const message = `*COMMANDE KOBLOGIX*\nClient: ${customer.name}\nTotal: ${finalTotal}F\nRef: ${customer.paymentRef}`;
    window.open(`https://wa.me/${WHATSAPP_SUPPORT}?text=${encodeURIComponent(message)}`, '_blank');
    
    clearCart();
    setStep(3);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="bg-slate-900 p-6 text-white flex justify-between">
          <h3 className="font-serif text-xl font-bold">Paiement Sécurisé</h3>
          <button onClick={() => setCheckoutModalOpen(false)}><X/></button>
        </div>

        <div className="p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <input placeholder="Nom Complet" className="w-full p-4 border rounded-2xl" onChange={e => setCustomer({...customer, name: e.target.value})}/>
              <input placeholder="Téléphone WhatsApp" className="w-full p-4 border rounded-2xl" onChange={e => setCustomer({...customer, phone: e.target.value})}/>
              
              <div className="pt-4 border-t">
                 <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Code Promo / Parrainage</label>
                 <div className="flex gap-2">
                    <input 
                      placeholder="Ex: KOB-123" 
                      className="flex-1 p-4 bg-gray-50 rounded-xl font-mono uppercase"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                    />
                    <button 
                      onClick={handleVerifyCoupon}
                      className="bg-slate-100 px-6 rounded-xl font-bold text-sm hover:bg-slate-200"
                    >
                      {isVerifying ? <Loader2 className="animate-spin"/> : "Vérifier"}
                    </button>
                 </div>
                 {couponStatus?.valid && <p className="text-green-500 text-xs font-bold mt-2">Réduction de 1000F appliquée !</p>}
              </div>
              
              <button onClick={() => setStep(2)} className="w-full bg-primary text-white py-4 rounded-2xl font-bold">Suivant</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl text-center">
                 <p className="text-xs text-gray-400 uppercase font-bold">Total à payer</p>
                 <p className="text-4xl font-black text-primary">{formatPrice(finalTotal)}</p>
              </div>
              <input placeholder="Référence SMS du paiement" className="w-full p-4 border-2 border-primary rounded-2xl font-mono text-center" onChange={e => setCustomer({...customer, paymentRef: e.target.value})}/>
              <button onClick={handleSubmit} className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex justify-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin"/> : "Confirmer le paiement"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10">
               <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4"><Check size={40}/></div>
               <h4 className="text-2xl font-bold mb-2">Merci !</h4>
               <p className="text-gray-500 mb-6">Votre paiement est en cours de vérification.</p>
               <button onClick={() => setCheckoutModalOpen(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Retour au site</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
