
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  iconName: string;
  minPriceLabel: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: string;
  details?: string;
  sessionId?: string; 
  quantity?: number;
  option?: 'simple' | 'accompagnement'; 
}

export interface Transaction {
  id: string;
  name: string;
  phone: string;
  email: string;
  method: 'tmoney' | 'flooz';
  paymentRef?: string;
  amount: number;
  type: string; 
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  isCompleted?: boolean;
  date: string;
  code?: string;
  codeExpiresAt?: number;
  items: CartItem[];
  serviceProgress?: number;
  couponUsed?: string; // Code promo utilisé
  ambassadorId?: string; // ID de l'ambassadeur lié
  uploadedContractUrl?: string;
  deliveredFile?: {
    name: string;
    url: string;
    deliveredAt: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  registeredAt: string;
  isAmbassador?: boolean;
  ambassadorCode?: string;
  balance: number; // Solde des commissions
  withdrawals?: { amount: number, date: string, status: string }[];
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  paymentMethod: 'tmoney' | 'flooz';
  paymentRef: string;
}

// Fixed missing SessionInfo interface
export interface SessionInfo {
  id: string;
  title: string;
  dates: string;
  total: number;
  available: number;
}

// Fixed missing Notification interface
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
