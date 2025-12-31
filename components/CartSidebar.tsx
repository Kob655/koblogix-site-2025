
import React from 'react';
import { X, Trash2, ArrowRight, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils';
import { USD_RATE } from '../constants';

const CartSidebar: React.FC = () => {
  const { items, removeFromCart, clearCart, total, isOpen, setIsOpen, setCheckoutModalOpen, setCheckoutItem } = useCart();

  const handleCheckoutAll = () => {
    setCheckoutItem(null); // Signifie tout le panier
    setIsOpen(false);
    setCheckoutModalOpen(true);
  };

  const handleCheckoutSingle = (item: any) => {
    setCheckoutItem(item);
    setIsOpen(false);
    setCheckoutModalOpen(true);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-900">
           <h3 className="text-xl font-bold font-serif text-dark dark:text-white flex items-center gap-2">
             Votre Panier
             <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{items.length}</span>
           </h3>
           <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
             <X size={24} />
           </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-slate-900">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
               <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <Trash2 size={32} />
               </div>
               <p>Votre panier est vide</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 rounded-xl shadow-sm space-y-3">
                 <div className="flex justify-between items-start">
                   <div className="flex-1">
                     <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{item.name}</h4>
                     {item.details && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.details}</p>}
                     <div className="flex items-center gap-2 mt-1">
                        <p className="text-primary dark:text-blue-400 font-bold">{formatPrice(item.price)}</p>
                     </div>
                   </div>
                   <button 
                     onClick={() => removeFromCart(item.id)}
                     className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors ml-2"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
                 
                 <button 
                   onClick={() => handleCheckoutSingle(item)}
                   className="w-full py-2 bg-gray-50 dark:bg-slate-700 hover:bg-primary hover:text-white text-primary dark:text-blue-400 rounded-lg text-xs font-bold border border-primary/20 transition-all flex items-center justify-center gap-2"
                 >
                   <CreditCard size={14}/> Payer cet article uniquement
                 </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
            <div className="flex justify-between items-end mb-2">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Total Panier</span>
              <span className="text-3xl font-black text-primary dark:text-blue-400">{formatPrice(total)}</span>
            </div>
            <div className="text-right text-sm font-bold text-green-600 dark:text-green-400 mb-6">
                ≈ {Math.ceil(total / USD_RATE)} $ USD
            </div>
            
            <button 
              onClick={handleCheckoutAll}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 mb-3"
            >
              Tout payer <ArrowRight size={20} />
            </button>
            <button 
              onClick={clearCart}
              className="w-full text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-sm font-medium transition-colors"
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
