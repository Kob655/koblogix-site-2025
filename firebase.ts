
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * ATTENTION : Pour que les commandes s'affichent sur tous les appareils,
 * vous devez créer un projet sur console.firebase.google.com et remplacer 
 * les valeurs ci-dessous par vos propres clés.
 */
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY", // Remplacez par votre clé réelle
  authDomain: "koblogix-platform.firebaseapp.com",
  projectId: "koblogix-platform",
  storageBucket: "koblogix-platform.appspot.com",
  messagingSenderId: "VOTRE_ID",
  appId: "VOTRE_APP_ID"
};

// Vérifie si l'utilisateur a configuré Firebase
export const isFirebaseConfigured = 
  firebaseConfig.apiKey !== "VOTRE_API_KEY" && 
  firebaseConfig.apiKey.length > 10;

let app;
if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    console.log("✅ Firebase connecté avec succès.");
  } catch (e) {
    console.error("❌ Erreur d'initialisation Firebase:", e);
    app = { name: '[MOCK]', options: {} };
  }
} else {
  console.warn("⚠️ Mode Hors-ligne : Firebase n'est pas configuré. Les données resteront locales à cet appareil.");
  app = { name: '[MOCK]', options: {} };
}

export const db = isFirebaseConfigured ? getFirestore(app as any) : null;
export const storage = isFirebaseConfigured ? getStorage(app as any) : null;

export default app;
