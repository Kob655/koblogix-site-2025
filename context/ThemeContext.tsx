
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionInfo, Transaction, Notification, User } from '../types';
import { SESSIONS_DATA as INITIAL_SESSIONS } from '../constants';
import { db, isFirebaseConfigured } from '../firebase'; 
import { 
  collection, doc, addDoc, updateDoc, deleteDoc, setDoc, onSnapshot, query, orderBy, Timestamp, getDoc
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
  uploadContract: (transactionId: string, url: string) => Promise<void>;
  toggleCompletion: (id: string) => Promise<void>;
  updateServiceProgress: (id: string, progress: number, fileData?: { name: string, url: string }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearTransactions: () => Promise<void>;
  regenerateCode: (id: string) => Promise<void>;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  updateSession: (id: string, data: Partial<SessionInfo>) => Promise<void>;
  resetSessionSeats: (id: string) => Promise<void>;
  registerUser: (userData: Omit<User, 'id' | 'registeredAt'>) => void;
  loginUser: (email: string, pass: string) => boolean;
  logoutUser: () => void;
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
  const [globalResources, setGlobalResources] = useState<GlobalResources>(() => {
    const saved = localStorage.getItem('koblogix_resources');
    return saved ? JSON.parse(saved) : {};
  });
  const [isAdminOpen, setAdminOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    try {
      const unsubscribe = onSnapshot(collection(db, "sessions"), (snapshot) => {
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(doc => doc.data() as SessionInfo);
          setSessions(fetched.sort((a,b) => a.id.localeCompare(b.id)));
        }
      }, (err) => console.warn("Firestore sessions error (silent)"));
      return () => unsubscribe();
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      return onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
        setTransactions(fetched);
        localStorage.setItem('koblogix_transactions', JSON.stringify(fetched));
      }, (err) => console.warn("Firestore orders error (silent)"));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    try {
      return onSnapshot(doc(db, "settings", "global"), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as GlobalResources;
          setGlobalResources(data);
          if (data.adminPassword) setAdminPassword(data.adminPassword);
        }
      }, (err) => console.warn("Firestore settings error (silent)"));
    } catch (e) {}
  }, []);

  useEffect(() => localStorage.setItem('koblogix_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('koblogix_sessions', JSON.stringify(sessions)), [sessions]);
  useEffect(() => localStorage.setItem('koblogix_resources', JSON.stringify(globalResources)), [globalResources]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('koblogix_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('koblogix_current_user');
  }, [currentUser]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const removeNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const addTransaction = async (t: Omit<Transaction, 'id' | 'status' | 'date'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: Date.now().toString(),
      status: 'pending',
      isCompleted: false,
      date: new Date().toISOString().split('T')[0],
      serviceProgress: 0,
    };

    // Sauvegarde locale immédiate
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem('koblogix_transactions', JSON.stringify(updatedTransactions));

    // Tentative Firebase en arrière-plan (non bloquant)
    if (isFirebaseConfigured && db) {
      addDoc(collection(db, "orders"), {
        ...t,
        status: 'pending',
        isCompleted: false,
        date: new Date().toISOString().split('T')[0],
        createdAt: Timestamp.now(),
        serviceProgress: 0,
      }).catch(err => console.error("Erreur backup Firebase:", err));
    }
    
    addNotification('Commande enregistrée localement.', 'success');
  };

  const updateTransactionStatus = async (id: string, status: 'approved' | 'rejected') => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'KOB-';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status, code, codeExpiresAt: Date.now() + (48 * 60 * 60 * 1000) } : t));

    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, "orders", id), { status, code, codeExpiresAt: Date.now() + (48 * 60 * 60 * 1000) }).catch(() => {});
    }
  };

  const saveAllGlobalResources = async (data: GlobalResources) => {
    setGlobalResources(data);
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, "settings", "global"), data, { merge: true }).catch(() => {});
    }
  };

  const updateAdminPassword = async (newPass: string) => {
    setAdminPassword(newPass);
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, "settings", "global"), { adminPassword: newPass }, { merge: true }).catch(() => {});
    }
  };

  const loginUser = (email: string, pass: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (user) {
      setCurrentUser(user);
      addNotification(`Bienvenue, ${user.name} !`, 'success');
      return true;
    }
    return false;
  };

  const registerUser = (userData: Omit<User, 'id' | 'registeredAt'>) => {
    const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9), registeredAt: new Date().toISOString() };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const clearTransactions = async () => {
    setTransactions([]);
    localStorage.removeItem('koblogix_transactions');
  };

  return (
    <StoreContext.Provider value={{ 
      sessions, transactions, notifications, users, currentUser, isAdminOpen, adminPassword, globalResources, 
      setAdminOpen, updateAdminPassword, saveAllGlobalResources, addTransaction, updateTransactionStatus, 
      uploadContract: async (id, url) => { setTransactions(prev => prev.map(t => t.id === id ? {...t, uploadedContractUrl: url} : t)); }, 
      toggleCompletion: async (id) => { setTransactions(prev => prev.map(t => t.id === id ? {...t, isCompleted: !t.isCompleted} : t)); }, 
      updateServiceProgress: async (id, progress, fileData) => { setTransactions(prev => prev.map(t => t.id === id ? {...t, serviceProgress: progress, deliveredFile: fileData ? {...fileData, deliveredAt: new Date().toISOString()} : undefined} : t)); }, 
      deleteTransaction: async (id) => { setTransactions(prev => prev.filter(t => t.id !== id)); }, clearTransactions, 
      regenerateCode: async (id) => { updateTransactionStatus(id, 'approved'); }, 
      addNotification, removeNotification, 
      updateSession: async (id, d) => { setSessions(prev => prev.map(s => s.id === id ? {...s, ...d} : s)); }, 
      resetSessionSeats: async (id) => { setSessions(prev => prev.map(s => s.id === id ? {...s, available: s.total} : s)); }, 
      registerUser, loginUser, logoutUser
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
