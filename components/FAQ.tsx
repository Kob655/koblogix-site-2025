import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { WHATSAPP_SUPPORT } from '../constants';

const FAQ_DATA = [
  {
    question: "Qu'est-ce que LaTeX et pourquoi l'utiliser ?",
    answer: "LaTeX est un système de préparation de documents haute qualité, largement utilisé dans le monde scientifique. Contrairement à Word, il sépare le fond de la forme, garantissant une mise en page professionnelle, une gestion parfaite des bibliographies et un rendu mathématique impeccable."
  },
  {
    question: "Comment se déroule le paiement ?",
    answer: "Le paiement se fait de manière sécurisée via T-Money (*145#) ou Flooz (*155#). Pour les commandes de rédaction, un acompte de 50% est demandé au démarrage, et le solde à la livraison du document final."
  },
  {
    question: "Acceptez-vous les travaux urgents ?",
    answer: "Oui, nous proposons une option 'Express' (+50%) pour des livraisons en 24h à 48h selon la complexité du projet. Vous pouvez sélectionner cette option dans notre calculateur de prix."
  },
  {
    question: "Mes documents sont-ils confidentiels ?",
    answer: "Absolument. Chez KOBLOGIX, la confidentialité est primordiale. Nous nous engageons à ne jamais divulguer, partager ou réutiliser vos données, manuscrits ou résultats de recherche."
  },
  {
    question: "Fournissez-vous le code source LaTeX ?",
    answer: "Oui, pour tous nos services de rédaction (Mémoire, CV, Poster), nous vous livrons le fichier PDF final ainsi que le dossier source complet (.tex) pour que vous puissiez effectuer des modifications futures."
  }
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-dark dark:text-white relative inline-block">
            <HelpCircle className="inline-block mr-2 text-primary" size={36} />
            Questions Fréquentes
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-primary to-primary-light rounded"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Nous répondons à vos interrogations les plus courantes</p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <span className={`font-bold text-lg ${activeIndex === index ? 'text-primary' : 'text-gray-800 dark:text-gray-200'}`}>
                  {item.question}
                </span>
                <ChevronDown 
                  className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-primary' : ''}`} 
                  size={24} 
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-slate-700 pt-4">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
          <p className="text-dark dark:text-gray-200 font-medium mb-4">Vous avez d'autres questions ?</p>
          <a 
            href={`https://wa.me/${WHATSAPP_SUPPORT}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <MessageCircle size={20} /> Discuter sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;