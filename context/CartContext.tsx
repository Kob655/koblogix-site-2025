
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  checkoutModalOpen: boolean;
  setCheckoutModalOpen: (isOpen: boolean) => void;
  checkoutItem: CartItem | null;
  setCheckoutItem: (item: CartItem | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('koblogix_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState<CartItem | null>(null);

  useEffect(() => {
    localStorage.setItem('koblogix_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const item: CartItem = {
      ...newItem,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
    };
    setItems(prev => [...prev, item]);
    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      total, 
      isOpen, 
      setIsOpen,
      checkoutModalOpen,
      setCheckoutModalOpen,
      checkoutItem,
      setCheckoutItem
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
