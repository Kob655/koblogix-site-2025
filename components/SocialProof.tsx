import React, { useState, useEffect } from 'react';
import { UserCheck, ShoppingBag, GraduationCap, MapPin, FileText, Download, Star } from 'lucide-react';

// Banques de données pour génération aléatoire
const NAMES = [
  "Jean", "Marie", "Koffi", "Afi", "Sarah", "Thomas", "Kodjo", "Aminata", 
  "Pierre", "Hervé", "Clarisse", "David", "Emmanuel", "Fatim", "Grace", 
  "Hélène", "Isaac", "Justine", "Kevin", "Latif", "Moussa", "Nadia", 
  "Olivier", "Paul", "Quentin", "Raïssa", "Samuel", "Thérèse", "Uriel", 
  "Viviane", "William", "Xavier", "Yannick", "Zoé"
];

const LAST_INITIALS = ["K.", "D.", "A.", "M.", "S.", "T.", "B.", "P.", "L.", "R.", "N.", "O.", "G.", "W."];

const CITIES = [
  "Lomé, Togo", "Dakar, Sénégal", "Abidjan, RCI", "Cotonou, Bénin", 
  "Paris, France", "Kara, Togo", "Kpalimé, Togo", "Ouaga, Burkina", 
  "Bamako, Mali", "Yaoundé, Cameroun", "Douala, Cameroun", "Libreville, Gabon",
  "Niamey, Niger", "Sokodé, Togo", "Atakpamé, Togo"
];

const ACTIONS = [
  { text: "a réservé sa place pour la Session de Janvier", icon: <GraduationCap size={16}/> },
  { text: "a réservé sa place pour la Session de Février", icon: <GraduationCap size={16}/> },
  { text: "a commandé une correction de Mémoire", icon: <FileText size={16}/> },
  { text: "a rejoint le groupe VIP WhatsApp", icon: <UserCheck size={16}/> },
  { text: "vient de générer son CV LaTeX", icon: <ShoppingBag size={16}/> },
  { text: "a téléchargé le certificat de formation", icon: <Download size={16}/> },
  { text: "a commandé un Rapport de Stage", icon: <FileText size={16}/> },
  { text: "vient de s'inscrire à la formation Pro", icon: <Star size={16}/> },
  { text: "a demandé un devis pour une Thèse", icon: <FileText size={16}/> }
];

const SocialProof: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentMsg, setCurrentMsg] = useState({
    name: "Jean K.",
    action: "a rejoint la formation",
    location: "Lomé",
    icon: <UserCheck size={16}/>
  });

  // Fonction pour générer un message unique aléatoire
  const generateRandomMessage = () => {
    const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
    const randomInitial = LAST_INITIALS[Math.floor(Math.random() * LAST_INITIALS.length)];
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const randomActionObj = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];

    return {
      name: `${randomName} ${randomInitial}`,
      action: randomActionObj.text,
      location: randomCity,
      icon: randomActionObj.icon
    };
  };

  useEffect(() => {
    // Premier affichage
    const initialTimeout = setTimeout(() => {
      setCurrentMsg(generateRandomMessage());
      setVisible(true);
    }, 4000);

    // Cycle infini
    const interval = setInterval(() => {
      setVisible(false); // Cacher l'ancien
      
      // Attendre la fin de l'animation de sortie avant de changer le texte et réafficher
      setTimeout(() => {
        setCurrentMsg(generateRandomMessage());
        setVisible(true);
      }, 1000); // 1s de pause invisible

    }, 25000); // Nouvelle notif toutes les 25s

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-[slideUp_0.5s_ease-out] hidden md:block transition-all duration-500">
      <div className="bg-white dark:bg-slate-800 border-l-4 border-green-500 rounded-lg shadow-xl p-4 max-w-sm flex items-start gap-3 hover:scale-105 transition-transform cursor-default">
        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
          {currentMsg.icon}
        </div>
        <div>
          <p className="text-sm text-gray-800 dark:text-gray-200 font-bold">
            {currentMsg.name} <span className="font-normal text-gray-600 dark:text-gray-400">{currentMsg.action}</span>
          </p>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <MapPin size={10} /> {currentMsg.location} • <span className="text-green-500 font-bold">À l'instant</span>
          </div>
        </div>
        <button 
            onClick={() => setVisible(false)} 
            className="absolute top-1 right-1 text-gray-300 hover:text-gray-500 p-1"
        >
            ×
        </button>
      </div>
    </div>
  );
};

export default SocialProof;