
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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Chargement des données initiales (LocalStorage ou Constants)
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

  // Sauvegarde automatique dans LocalStorage pour la persistance hors-ligne
  useEffect(() => {
    localStorage.setItem('koblogix_sessions', JSON.stringify(sessions));
    localStorage.setItem('koblogix_transactions', JSON.stringify(transactions));
    localStorage.setItem('koblogix_users', JSON.stringify(users));
    if (currentUser) localStorage.setItem('koblogix_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('koblogix_current_user');
  }, [sessions, transactions, users, currentUser]);

  // Sync avec Firebase si configuré
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

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
  }, []);

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const verifyCoupon = async (code: string) => {
    // Vérification d'abord en local pour la rapidité
    const localAmbassador = users.find(u => u.ambassadorCode === code.toUpperCase());
    if (localAmbassador) return { valid: true, ambassadorId: localAmbassador.id };

    if (!isFirebaseConfigured || !db) return { valid: false };
    const q = query(collection(db, "users"), where("ambassadorCode", "==", code.toUpperCase()));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { valid: true, ambassadorId: snap.docs[0].id };
    }
    return { valid: false };
  };

  const becomeAmbassador = async (code: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, isAmbassador: true, ambassadorCode: code.toUpperCase(), balance: 0 };
    
    // Mise à jour locale immédiate
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));

    // Mise à jour Firebase si possible
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, "users", currentUser.id), updated, { merge: true });
    }
    addNotification("Vous êtes maintenant ambassadeur !", "success");
  };

  const updateTransactionStatus = async (id: string, status: 'approved' | 'rejected') => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'KOB-';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    
    // Mise à jour locale
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, status, code: status === 'approved' ? code : undefined } : t
    );
    setTransactions(updatedTransactions);

    // Crédit commission
    if (status === 'approved' && transaction.ambassadorId) {
       setUsers(prev => prev.map(u => u.id === transaction.ambassadorId ? { ...u, balance: (u.balance || 0) + 1000 } : u));
       if (isFirebaseConfigured && db) {
         await updateDoc(doc(db, "users", transaction.ambassadorId), { balance: increment(1000) });
       }
    }

    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, "orders", id), { 
        status, 
        code: status === 'approved' ? code : null,
        codeExpiresAt: Date.now() + (48 * 60 * 60 * 1000)
      });
    }
    addNotification(`Commande ${status === 'approved' ? 'validée' : 'rejetée'}.`, "info");
  };

  const addTransaction = async (t: Omit<Transaction, 'id' | 'status' | 'date'>) => {
    const newT = { ...t, id: Date.now().toString(), status: 'pending' as const, date: new Date().toISOString().split('T')[0] };
    setTransactions(prev => [newT, ...prev]);

    if (isFirebaseConfigured && db) {
      await addDoc(collection(db, "orders"), {
        ...t,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        createdAt: Timestamp.now()
      });
    }
    addNotification("Commande envoyée. Validation en cours.", "success");
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

  return (
    <StoreContext.Provider value={{ 
      sessions, transactions, notifications, users, currentUser, isAdminOpen, adminPassword, globalResources,
      setAdminOpen, updateAdminPassword: async (p) => setAdminPassword(p), saveAllGlobalResources: async (d) => setGlobalResources(d),
      addTransaction, updateTransactionStatus, deleteTransaction: async (id) => setTransactions(prev => prev.filter(t => t.id !== id)), 
      addNotification, 
      removeNotification: (id) => setNotifications(n => n.filter(x => x.id !== id)),
      updateSession: async (id, data) => setSessions(prev => prev.map(s => s.id === id ? {...s, ...data} : s)), 
      registerUser, loginUser, logoutUser: () => setCurrentUser(null),
      becomeAmbassador, verifyCoupon
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
