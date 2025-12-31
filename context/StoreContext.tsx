
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

  useEffect(() => {
    localStorage.setItem('koblogix_sessions', JSON.stringify(sessions));
    localStorage.setItem('koblogix_transactions', JSON.stringify(transactions));
    localStorage.setItem('koblogix_users', JSON.stringify(users));
    if (currentUser) localStorage.setItem('koblogix_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('koblogix_current_user');
  }, [sessions, transactions, users, currentUser]);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    try {
      const unsubOrders = onSnapshot(collection(db, "orders"), (s) => {
        if (!s.empty) setTransactions(s.docs.map(d => ({id: d.id, ...d.data()} as Transaction)));
      });

      const unsubSessions = onSnapshot(collection(db, "sessions"), (s) => {
        if (!s.empty) setSessions(s.docs.map(d => d.data() as SessionInfo));
      });

      const unsubSettings = onSnapshot(doc(db, "settings", "global"), (d) => {
        if(d.exists()) setGlobalResources(d.data());
      });

      return () => { unsubOrders(); unsubSessions(); unsubSettings(); };
    } catch (e) {
      console.error("Firebase sync error:", e);
    }
  }, []);

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const verifyCoupon = async (code: string) => {
    const localAmbassador = users.find(u => u.ambassadorCode === code.toUpperCase());
    if (localAmbassador) return { valid: true, ambassadorId: localAmbassador.id };

    if (!isFirebaseConfigured || !db) return { valid: false };
    try {
      const q = query(collection(db, "users"), where("ambassadorCode", "==", code.toUpperCase()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { valid: true, ambassadorId: snap.docs[0].id };
      }
    } catch (e) { console.error(e); }
    return { valid: false };
  };

  const becomeAmbassador = async (code: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, isAmbassador: true, ambassadorCode: code.toUpperCase(), balance: 0 };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));

    if (isFirebaseConfigured && db) {
      try { await setDoc(doc(db, "users", currentUser.id), updated, { merge: true }); } catch(e){}
    }
    addNotification("Programme ambassadeur activé !", "success");
  };

  const updateTransactionStatus = async (id: string, status: 'approved' | 'rejected') => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'KOB-';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, status, code: status === 'approved' ? code : undefined } : t
    ));

    if (status === 'approved' && transaction.ambassadorId) {
       setUsers(prev => prev.map(u => u.id === transaction.ambassadorId ? { ...u, balance: (u.balance || 0) + 1000 } : u));
       if (isFirebaseConfigured && db) {
         try { await updateDoc(doc(db, "users", transaction.ambassadorId), { balance: increment(1000) }); } catch(e){}
       }
    }

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, "orders", id), { 
          status, 
          code: status === 'approved' ? code : null,
          codeExpiresAt: Date.now() + (48 * 60 * 60 * 1000)
        });
      } catch(e){}
    }
    addNotification(`Commande ${status === 'approved' ? 'validée' : 'rejetée'}.`, "info");
  };

  const addTransaction = async (t: Omit<Transaction, 'id' | 'status' | 'date'>) => {
    const newT: Transaction = { 
      ...t as any, 
      id: Date.now().toString(), 
      status: 'pending' as const, 
      date: new Date().toISOString().split('T')[0] 
    };
    
    // Mise à jour locale immédiate pour réactivité de l'UI
    setTransactions(prev => [newT, ...prev]);

    // Envoi vers Firebase avec un délai maximum pour ne pas bloquer l'UI
    if (isFirebaseConfigured && db) {
      try {
        const docPromise = addDoc(collection(db, "orders"), {
          ...t,
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
          createdAt: Timestamp.now()
        });
        
        // Timeout de 3 secondes pour ne pas bloquer l'utilisateur si Firebase est lent
        await Promise.race([
            docPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Timeout")), 3000))
        ]);
      } catch (error) {
        console.warn("Firebase addDoc deferred or timed out, transaction kept locally.");
      }
    }
    addNotification("Paiement envoyé. Vérification en cours.", "success");
  };

  const loginUser = (email: string, pass: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (user) {
      setCurrentUser(user);
      addNotification(`Bienvenue, ${user.name} !`, "success");
      return true;
    }
    addNotification("Identifiants incorrects.", "error");
    return false;
  };

  const registerUser = (u: any) => {
    const newUser = { ...u, id: Date.now().toString(), registeredAt: new Date().toISOString(), balance: 0 };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    addNotification("Compte créé avec succès !", "success");
  };

  const toggleCompletion = async (id: string) => {
    const t = transactions.find(x => x.id === id);
    if (!t) return;
    const newStatus = !t.isCompleted;
    setTransactions(prev => prev.map(item => item.id === id ? { ...item, isCompleted: newStatus } : item));
    if (isFirebaseConfigured && db) {
      try { await updateDoc(doc(db, "orders", id), { isCompleted: newStatus }); } catch(e){}
    }
  };

  const clearTransactions = async () => {
    setTransactions([]);
    addNotification("Historique vidé localement.", "info");
  };

  const regenerateCode = async (id: string) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'KOB-';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, code } : t));
    if (isFirebaseConfigured && db) {
      try { await updateDoc(doc(db, "orders", id), { code }); } catch(e){}
    }
  };

  const resetSessionSeats = async (id: string) => {
    const session = INITIAL_SESSIONS.find(s => s.id === id);
    if (session) {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, available: session.total } : s));
      if (isFirebaseConfigured && db) {
        try { await updateDoc(doc(db, "sessions", id), { available: session.total }); } catch(e){}
      }
    }
  };

  const updateServiceProgress = async (id: string, progress: number, deliveredFile?: any) => {
    const updateData: any = { serviceProgress: progress };
    if (deliveredFile) {
      updateData.deliveredFile = { ...deliveredFile, deliveredAt: new Date().toISOString() };
    }
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updateData } : t));
    if (isFirebaseConfigured && db) {
      try { await updateDoc(doc(db, "orders", id), updateData); } catch(e){}
    }
    addNotification("Statut de livraison mis à jour.", "success");
  };

  return (
    <StoreContext.Provider value={{ 
      sessions, transactions, notifications, users, currentUser, isAdminOpen, adminPassword, globalResources,
      setAdminOpen, updateAdminPassword: async (p) => setAdminPassword(p), saveAllGlobalResources: async (d) => setGlobalResources(d),
      addTransaction, updateTransactionStatus, deleteTransaction: async (id) => setTransactions(prev => prev.filter(t => t.id !== id)), 
      addNotification, 
      removeNotification: (id) => setNotifications(n => n.filter(x => x.id !== id)),
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
