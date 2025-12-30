
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// REMPLACEZ CES VALEURS PAR LES VÔTRES DEPUIS LA CONSOLE FIREBASE
const firebaseConfig = {
 apiKey: "AIzaSyCVKVZZCw87xrLyWkF1uJaqzJ1v_ZPCDf4 ",
  authDomain: "koblogix.firebaseapp.com ",
  projectId: "koblogix ",
  storageBucket: "koblogix.firebasestorage.app ",
  messagingSenderId: "1059133656016 ",
  appId: "1:1059133656016:web:684a56716bd086e6cc47d5"
};

// Vérifie si l'utilisateur a rempli les clés réelles
export const isFirebaseConfigured = 
  firebaseConfig.apiKey !== "VOTRE_API_KEY" && 
  firebaseConfig.projectId !== "VOTRE_PROJECT_ID" &&
  firebaseConfig.apiKey.length > 10;

let app;
if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (e) {
    console.error("Erreur d'initialisation Firebase:", e);
    app = { name: '[DEFAULT]', options: {}, automaticDataCollectionEnabled: false };
  }
} else {
  // Mock app pour éviter les erreurs d'importation
  app = { name: '[DEFAULT]', options: {}, automaticDataCollectionEnabled: false };
}

export const db = isFirebaseConfigured ? getFirestore(app as any) : null;
export const storage = isFirebaseConfigured ? getStorage(app as any) : null;

export default app;
