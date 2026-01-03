import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement depuis le fichier .env
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    base: './', // Assure que les chemins sont relatifs pour GitHub Pages
    define: {
      // Injection sécurisée uniquement de la clé API, sans casser 'process' globalement
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});