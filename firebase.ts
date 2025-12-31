
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * CONFIGURATION OBLIGATOIRE POUR VOIR LES COMMANDES PARTOUT
 * 1. Allez sur https://console.firebase.google.com/
 * 2. Créez un projet nommé "Koblogix"
 * 3. Allez dans "Paramètres du projet" > "Applications" > "Ajouter une application Web"
 * 4. Copiez l'objet firebaseConfig ci-dessous.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCVKVZZCw87xrLyWkF1uJaqzJ1v_ZPCDf4",
  authDomain: "koblogix.firebaseapp.com",
  projectId: "koblogix",
  storageBucket: "koblogix.firebasestorage.app",
  messagingSenderId: "1059133656016",
  appId: "1:1059133656016:web:684a56716bd086e6cc47d5"
};

// Détection automatique : Si la clé commence par "VOTRE_", le mode cloud est désactivé
export const isFirebaseConfigured = 
  firebaseConfig.apiKey !== "VOTRE_API_KEY" && 
  firebaseConfig.apiKey.trim().length > 10;

let app;
if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    console.log("✅ [SYNC CLOUD] Connecté au serveur KOBLOGIX.");
  } catch (e) {
    console.error("❌ [SYNC CLOUD] Erreur de connexion:", e);
    app = { name: '[MOCK]', options: {} };
  }
} else {
  console.warn("⚠️ [SYNC LOCAL] Les données restent sur cet appareil car Firebase n'est pas configuré.");
  app = { name: '[MOCK]', options: {} };
}

export const db = isFirebaseConfigured ? getFirestore(app as any) : null;
export const storage = isFirebaseConfigured ? getStorage(app as any) : null;

export default app;
