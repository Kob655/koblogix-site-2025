import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionInfo, Transaction, Notification, User } from '../types';
import { SESSIONS_DATA as INITIAL_SESSIONS } from '../constants';
import { db } from '../firebase'; 
import { 
  collection, doc, addDoc, updateDoc, setDoc, onSnapshot, query, orderBy, Timestamp, deleteDoc
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

  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
  const [isCloudSync, setIsCloudSync] = useState(false);

  // ÉCOUTE EN TEMPS RÉEL (CRITIQUE pour le Panel Admin multi-appareil)
  useEffect(() => {
    if (!db) return;
    
    // On écoute la collection "orders" en temps réel sur tout le Cloud
    const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setIsCloudSync(true);
      const cloudData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        date: doc.data().createdAt?.toDate().toISOString().split('T')[0] || doc.data().date
      } as Transaction));
      
      console.log("🔥 [CloudSync] Mise à jour des commandes :", cloudData.length);
      setTransactions(cloudData);
    }, (error) => {
      console.error("❌ Erreur de synchronisation Cloud :", error);
      setIsCloudSync(false);
    });

    const unsubSettings = onSnapshot(doc(db, "settings", "global"), (d) => {
      if(d.exists()) setGlobalResources(d.data());
    });

    return () => { unsubOrders(); unsubSettings(); };
  }, []);

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const addTransaction = async (t: Omit<Transaction, 'id' | 'status' | 'date'>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    if (db) {
      try {
        await addDoc(collection(db, "orders"), {
          ...t,
          status: 'pending',
          date: dateStr,
          createdAt: Timestamp.now(),
          isCompleted: false
        });
        addNotification("Transaction envoyée au Cloud !", "success");
      } catch (error: any) {
        console.error("Firebase Add Error:", error);
        addNotification("Erreur Cloud. Commande non enregistrée.", "error");
        throw error;
      }
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('koblogix_current_user');
  };

  const loginUser = (e: string, p: string) => {
    const u = users.find(x => x.email.toLowerCase() === e.toLowerCase() && x.password === p);
    if (u) { 
      setCurrentUser(u); 
      localStorage.setItem('koblogix_current_user', JSON.stringify(u));
      return true; 
    }
    return false;
  };

  const registerUser = (u: any) => {
    const newUser = { ...u, id: Date.now().toString(), registeredAt: new Date().toISOString(), balance: 0 };
    setUsers(prev => {
        const updated = [...prev, newUser];
        localStorage.setItem('koblogix_users', JSON.stringify(updated));
        return updated;
    });
    setCurrentUser(newUser);
    localStorage.setItem('koblogix_current_user', JSON.stringify(newUser));
  };

  return (
    <StoreContext.Provider value={{ 
      sessions, transactions, notifications, users, currentUser, isAdminOpen, adminPassword, globalResources, isCloudSync,
      setAdminOpen, updateAdminPassword: async (p) => setAdminPassword(p), 
      saveAllGlobalResources: async (d) => {
        if (db) await setDoc(doc(db, "settings", "global"), d);
        setGlobalResources(d);
      },
      addTransaction, 
      updateTransactionStatus: async (id, status) => {
        if (db) await updateDoc(doc(db, "orders", id), { status });
      }, 
      deleteTransaction: async (id) => {
        if (db) await deleteDoc(doc(db, "orders", id));
      }, 
      addNotification, 
      removeNotification: (id) => setNotifications(n => n.filter(x => x.id !== id)),
      updateSession: async (id, data) => setSessions(prev => prev.map(s => s.id === id ? {...s, ...data} : s)), 
      registerUser, loginUser, logoutUser,
      becomeAmbassador: async (code) => {
        if (!currentUser) return;
        const updated = { ...currentUser, isAmbassador: true, ambassadorCode: code, balance: 0 };
        setCurrentUser(updated);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
      }, 
      verifyCoupon: async (code) => {
        const ambassador = users.find(u => u.ambassadorCode === code.toUpperCase());
        return { valid: !!ambassador, ambassadorId: ambassador?.id };
      }, 
      toggleCompletion: async (id) => {
        const t = transactions.find(x => x.id === id);
        if (t && db) await updateDoc(doc(db, "orders", id), { isCompleted: !t.isCompleted });
      }, 
      clearTransactions: async () => {}, 
      regenerateCode: async (id) => {}, 
      resetSessionSeats: async (id) => {}, 
      updateServiceProgress: async (id, p, f) => {
        if (db) await updateDoc(doc(db, "orders", id), { serviceProgress: p, deliveredFile: f });
      }
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