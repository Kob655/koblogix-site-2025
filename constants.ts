export const WHATSAPP_SUPPORT = '22898286541';
export const FLOOZ_NUMBER = '+228 98 28 65 41';
export const TMONEY_NUMBER = '+228 92 10 16 04';
export const USD_RATE = 600; // 1$ = 600 FCFA
export const EUR_RATE = 650;

export const formatPriceFCFA = (amount: number) => amount.toLocaleString('fr-FR') + ' FCFA';
export const formatPriceUSD = (amount: number) => (amount / USD_RATE).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// Fonction globale pour afficher les deux prix avec accent GÉANT sur le Dollar
export const formatDualPrice = (amount: number) => `${formatPriceUSD(amount)} / ${formatPriceFCFA(amount)}`;

export const SESSIONS_DATA = [
  { id: 'jan-1', title: 'SESSION 1', dates: '5-9 Janvier 2026', total: 15, available: 15 },
  { id: 'jan-2', title: 'SESSION 2', dates: '19-23 Janvier 2026', total: 15, available: 15 },
  { id: 'feb-1', title: 'SESSION 3', dates: '2-6 Février 2026', total: 15, available: 15 },
  { id: 'feb-2', title: 'SESSION 4', dates: '16-20 Février 2026', total: 15, available: 15 },
];

export const SERVICES_DATA = [
  {
    id: 'rapport',
    title: 'Rapports Scientifiques',
    description: 'Rapports de stage, projets de recherche, rapports techniques avec bibliographie complète.',
    price: 10000,
    minPriceLabel: '10 000 FCFA',
    iconName: 'FileText'
  },
  {
    id: 'cv',
    title: 'CV & Lettres',
    description: 'CV professionnel LaTeX moderne + Lettre de motivation personnalisée.',
    price: 5000,
    minPriceLabel: '5 000 FCFA',
    iconName: 'UserCheck'
  },
  {
    id: 'poster',
    title: 'Posters Scientifiques',
    description: 'Posters A0/A1 pour conférences, soutenances et événements académiques.',
    price: 15000,
    minPriceLabel: '15 000 FCFA',
    iconName: 'Image'
  },
  {
    id: 'projet',
    title: 'Projets Techniques',
    description: 'Dossiers techniques, chronogrammes, plannings détaillés, budgets.',
    price: 20000,
    minPriceLabel: '20 000 FCFA',
    iconName: 'FolderKanban'
  },
  {
    id: 'memoire',
    title: 'Mémoires & Thèses',
    description: 'Rédaction complète de mémoires de Master et thèses de Doctorat.',
    price: 30000,
    minPriceLabel: '30 000 FCFA',
    iconName: 'BookOpen'
  },
  {
    id: 'presentation',
    title: 'Présentations Beamer',
    description: 'Présentations PowerPoint professionnelles en LaTeX avec animations.',
    price: 8000,
    minPriceLabel: '8 000 FCFA',
    iconName: 'MonitorPlay'
  },
];

export const BASE_PRICES: Record<string, number> = {
  cv: 5000,
  rapport: 10000,
  poster: 15000,
  memoire: 30000,
  presentation: 8000,
  projet: 20000,
  tikz: 7500,
  traduction: 15000,
  plagiat: 25000,
  thesis_pack: 45000
};

export const PER_PAGE_PRICES: Record<string, number> = {
  cv: 0,
  rapport: 500,
  poster: 0,
  memoire: 1000,
  presentation: 300,
  projet: 700,
  traduction: 2000,
  plagiat: 1500,
  thesis_pack: 1000
};