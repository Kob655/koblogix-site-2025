
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionInfo, Transaction, Notification, User } from '../types';
import { SESSIONS_DATA as INITIAL_SESSIONS } from '../constants';
import { db, isFirebaseConfigured } from '../firebase'; 
import { 
  collection, doc, addDoc, updateDoc, setDoc, onSnapshot, query, orderBy, Timestamp, getDocs, where, increment
} from 'firebase/firestore';

interface GlobalResources {
  inscriptionUrl?: string;
  contractUrl?: string;
  courseContentUrl?: string;
  whatsappLink?: string;
  overleafGuideUrl?: string;
  adminPassword?: string;
}

interface StoreContextType {
  sessions: SessionInfo[];
  transactions: Transaction[];
  notifications: Notification[];
  users: User[];
  currentUser: User | null;
  isAdminOpen: boolean;
  adminPassword: string;
  globalResources: GlobalResources; 
  isCloudSync: boolean;
  setAdminOpen: (isOpen: boolean) => void;
  updateAdminPassword: (newPass: string) => Promise<void>;
  saveAllGlobalResources: (data: GlobalResources) => Promise<void>;
  addTransaction: (t: Omit<Transaction, 'id' | 'status' | 'date'>) => Promise<void>;
  updateTransactionStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  updateSession: (id: string, data: Partial<SessionInfo>) => Promise<void>;
  registerUser: (userData: Omit<User, 'id' | 'registeredAt' | 'balance'>) => void;
  loginUser: (email: string, pass: string) => boolean;
  logoutUser: () => void;
  becomeAmbassador: (code: string) => Promise<void>;
  verifyCoupon: (code: string) => Promise<{valid: boolean, ambassadorId?: string}>;
  toggleCompletion: (id: string) => Promise<void>;
  clearTransactions: () => Promise<void>;
  regenerateCode: (id: string) => Promise<void>;
  resetSessionSeats: (id: string) => Promise<void>;
  updateServiceProgress: (id: string, progress: number, deliveredFile?: any) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<SessionInfo[]>(() => {
    const saved = localStorage.getItem('koblogix_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('koblogix_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('koblogix_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('koblogix_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminPassword, setAdminPassword] = useState('toujours plus haut');
  const [globalResources, setGlobalResources] = useState<GlobalResources>({});
  const [isAdminOpen, setAdminOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCloudSync, setIsCloudSync] = useState(isFirebaseConfigured);

  useEffect(() => {
    localStorage.setItem('koblogix_sessions', JSON.stringify(sessions));
    localStorage.setItem('koblogix_transactions', JSON.stringify(transactions));
    localStorage.setItem('koblogix_users', JSON.stringify(users));
    if (currentUser) localStorage.setItem('koblogix_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('koblogix_current_user');
  }, [sessions, transactions, users, currentUser]);

  // Synchronisation en temps réel avec Firebase
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    try {
      // Écouter les commandes (Transactions)
      const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const unsubOrders = onSnapshot(qOrders, (s) => {
        const cloudData = s.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
        if (cloudData.length > 0) setTransactions(cloudData);
      });

      const unsubSessions = onSnapshot(collection(db, "sessions"), (s) => {
        if (!s.empty) setSessions(s.docs.map(d => d.data() as SessionInfo));
      });

      const unsubSettings = onSnapshot(doc(db, "settings", "global"), (d) => {
        if(d.exists()) setGlobalResources(d.data());
      });

      return () => { unsubOrders(); unsubSessions(); unsubSettings(); };
    } catch (e) {
      console.error("Erreur de synchronisation Cloud:", e);
      setIsCloudSync(false);
    }
  }, []);

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const addTransaction = async (t: Omit<Transaction, 'id' | 'status' | 'date'>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, "orders"), {
          ...t,
          status: 'pending',
          date: dateStr,
          createdAt: Timestamp.now(),
          isCompleted: false
        });
        addNotification("Commande enregistrée sur le cloud.", "success");
      } catch (error) {
        console.error("Erreur d'envoi Cloud:", error);
        addNotification("Erreur Cloud. Commande enregistrée localement uniquement.", "error");
        // Fallback local en cas d'erreur cloud
        const newT = { ...t as any, id: Date.now().toString(), status: 'pending', date: dateStr };
        setTransactions(prev => [newT, ...prev]);
      }
    } else {
      // Mode 100% Local
      const newT = { ...t as any, id: Date.now().toString(), status: 'pending', date: dateStr };
      setTransactions(prev => [newT, ...prev]);
      addNotification("Enregistré sur cet appareil (Mode Hors-ligne).", "info");
    }
  };

  const updateTransactionStatus = async (id: string, status: 'approved' | 'rejected') => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'KOB-';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    
    if (isFirebaseConfigured && db) {
      try {
        const orderRef = doc(db, "orders", id);
        await updateDoc(orderRef, { 
          status, 
          code: status === 'approved' ? code : null,
          codeExpiresAt: Date.now() + (48 * 60 * 60 * 1000)
        });
      } catch(e) { console.error(e); }
    } else {
      setTransactions(prev => prev.map(t => 
        t.id === id ? { ...t, status, code: status === 'approved' ? code : undefined } : t
      ));
    }
    addNotification(`Commande mise à jour.`, "info");
  };

  const toggleCompletion = async (id: string) => {
    const t = transactions.find(x => x.id === id);
    if (!t) return;
    const newStatus = !t.isCompleted;

    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, "orders", id), { isCompleted: newStatus });
    } else {
      setTransactions(prev => prev.map(item => item.id === id ? { ...item, isCompleted: newStatus } : item));
    }
  };

  const deleteTransaction = async (id: string) => {
    if (isFirebaseConfigured && db) {
        // Optionnel : supprimer aussi sur Firebase, mais souvent on préfère garder une trace
        // Pour cet exemple on filtre simplement le state local
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const verifyCoupon = async (code: string) => {
    const localAmbassador = users.find(u => u.ambassadorCode === code.toUpperCase());
    if (localAmbassador) return { valid: true, ambassadorId: localAmbassador.id };
    return { valid: false };
  };

  const becomeAmbassador = async (code: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, isAmbassador: true, ambassadorCode: code.toUpperCase(), balance: 0 };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    addNotification("Programme ambassadeur activé !", "success");
  };

  const registerUser = (u: any) => {
    const newUser = { ...u, id: Date.now().toString(), registeredAt: new Date().toISOString(), balance: 0 };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    addNotification("Profil créé !", "success");
  };

  const loginUser = (email: string, pass: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (user) {
      setCurrentUser(user);
      addNotification(`Heureux de vous revoir !`, "success");
      return true;
    }
    return false;
  };

  const clearTransactions = async () => { setTransactions([]); };
  const regenerateCode = async (id: string) => { 
     const code = 'KOB-' + Math.random().toString(36).substring(2, 10).toUpperCase();
     if (isFirebaseConfigured && db) await updateDoc(doc(db, "orders", id), { code });
  };
  const resetSessionSeats = async (id: string) => { 
     if (isFirebaseConfigured && db) await updateDoc(doc(db, "sessions", id), { available: 15 });
  };
  const updateServiceProgress = async (id: string, progress: number, file?: any) => {
     if (isFirebaseConfigured && db) await updateDoc(doc(db, "orders", id), { serviceProgress: progress, deliveredFile: file });
  };

  return (
    <StoreContext.Provider value={{ 
      sessions, transactions, notifications, users, currentUser, isAdminOpen, adminPassword, globalResources, isCloudSync,
      setAdminOpen, updateAdminPassword: async (p) => setAdminPassword(p), saveAllGlobalResources: async (d) => setGlobalResources(d),
      addTransaction, updateTransactionStatus, deleteTransaction, 
      addNotification, removeNotification: (id) => setNotifications(n => n.filter(x => x.id !== id)),
      updateSession: async (id, data) => setSessions(prev => prev.map(s => s.id === id ? {...s, ...data} : s)), 
      registerUser, loginUser, logoutUser: () => setCurrentUser(null),
      becomeAmbassador, verifyCoupon, toggleCompletion, clearTransactions, regenerateCode, resetSessionSeats, updateServiceProgress
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
