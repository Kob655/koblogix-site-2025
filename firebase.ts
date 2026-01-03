import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * CONFIGURATION OFFICIELLE KOBLOGIX
 */
const firebaseConfig = {
  apiKey: "AIzaSyCVKVZZCw87xrLyWkF1uJaqzJ1v_ZPCDf4",
  authDomain: "koblogix.firebaseapp.com",
  projectId: "koblogix",
  storageBucket: "koblogix.firebasestorage.app",
  messagingSenderId: "1059133656016",
  appId: "1:1059133656016:web:684a56716bd086e6cc47d5"
};

// Vérification de configuration
export const isFirebaseConfigured = true; 

let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  console.log("🚀 [FIREBASE] Initialisé avec succès pour le projet : " + firebaseConfig.projectId);
} catch (e) {
  console.error("❌ [FIREBASE] Erreur d'initialisation:", e);
}

export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export default app;