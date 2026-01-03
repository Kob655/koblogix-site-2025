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
  method: 'tmoney' | 'flooz' | 'card' | 'paypal';
  paymentRef?: string;
  amount: number;
  currency?: 'XOF' | 'USD' | 'EUR';
  type: string; 
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  isCompleted?: boolean;
  date: string;
  code?: string;
  codeExpiresAt?: number;
  items: CartItem[];
  serviceProgress?: number;
  couponUsed?: string; 
  ambassadorId?: string; 
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
  balance: number; 
  withdrawals?: { amount: number, date: string, status: string }[];
}

export interface SessionInfo {
  id: string;
  title: string;
  dates: string;
  total: number;
  available: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}