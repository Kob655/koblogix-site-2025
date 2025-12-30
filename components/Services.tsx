import React, { useState } from 'react';
import { FileText, UserCheck, Image, FolderKanban, BookOpen, MonitorPlay, ShoppingCart, Loader2, Clock, UploadCloud, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { SERVICES_DATA, USD_RATE, WHATSAPP_SUPPORT } from '../constants';
import { useCart } from '../context/CartContext';
import Modal from './ui/Modal';

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText size={32} />,
  UserCheck: <UserCheck size={32} />,
  Image: <Image size={32} />,
  FolderKanban: <FolderKanban size={32} />,
  BookOpen: <BookOpen size={32} />,
  MonitorPlay: <MonitorPlay size={32} />,
};

// Contenu détaillé scrupuleux pour chaque service
const SERVICE_DETAILS: Record<string, { prerequis: string[], delais: string, livrables: string[], conditions: string }> = {
    cv: {
        prerequis: [
            "Informations personnelles complètes (Nom, Prénom, Adresse, Contact).",
            "Parcours académique détaillé (Années, Diplômes, Établissements).",
            "Expériences professionnelles (Dates, Postes, Missions réalisées).",
            "Compétences techniques et linguistiques.",
            "Photo professionnelle (Optionnelle, fond neutre recommandé)."
        ],
        delais: "24h à 48h ouvrables.",
        livrables: ["Fichier PDF Haute Définition (Prêt à l'impression/envoi)", "Fichier source .tex (sur demande)"],
        conditions: "Paiement 100% à la commande pour les petits volumes (-10.000F)."
    },
    rapport: {
        prerequis: [
            "Texte brut finalisé au format Word ou texte (sans mise en page).",
            "Images/Figures fournies séparément (Format JPG/PNG haute qualité).",
            "Légendes des figures et tableaux clairement indiquées.",
            "Structure du document (Titres, Sous-titres) bien définie."
        ],
        delais: "3 à 5 jours selon le volume (Option Express disponible).",
        livrables: ["Document PDF formaté (Marge, Police, Interligne aux normes)", "Table des matières, Liste des figures/tableaux automatiques", "Bibliographie normalisée"],
        conditions: "Acompte de 50% au démarrage. Solde à la livraison du PDF filigrané pour validation."
    },
    memoire: {
        prerequis: [
            "Validation du plan de rédaction par votre encadreur.",
            "Chapitres rédigés (même brouillon) au fur et à mesure.",
            "Références bibliographiques (Liste ou fichiers BibTeX).",
            "Consignes spécifiques de votre université (Marges, Police...)."
        ],
        delais: "1 à 2 semaines selon le nombre de pages.",
        livrables: ["Mise en page professionnelle LaTeX", "Gestion complexe des annexes", "Index et Glossaire (si nécessaire)", "Fichiers sources complets"],
        conditions: "Suivi itératif. Acompte 50%. Modifications mineures gratuites après livraison."
    },
    poster: {
        prerequis: [
            "Résumé du contenu (Intro, Méthode, Résultats, Conclusion).",
            "Logos des affiliations (Université, Labo, Partenaires) en HD.",
            "Graphiques et photos à intégrer.",
            "Format souhaité (A0, A1, Paysage/Portrait)."
        ],
        delais: "48h à 72h.",
        livrables: ["PDF Haute Résolution pour impression grand format", "Design respectant la charte graphique de l'événement"],
        conditions: "Paiement à la commande."
    },
    presentation: {
        prerequis: [
            "Plan de la soutenance.",
            "Texte résumé pour chaque slide (éviter les pavés de texte).",
            "Images et schémas à intégrer."
        ],
        delais: "3 à 5 jours.",
        livrables: ["Présentation Beamer (PDF interactif)", "Animations et transitions sobres", "Thème personnalisé"],
        conditions: "Acompte 50%."
    },
    projet: {
        prerequis: [
            "Cahier des charges ou description du projet.",
            "Données techniques (Algorithmes, Schémas blocs...).",
            "Besoins spécifiques en diagrammes (Gantt, Pert, UML)."
        ],
        delais: "Sur devis uniquement.",
        livrables: ["Dossier technique structuré", "Schémas vectoriels"],
        conditions: "Sur devis."
    }
};

const Services: React.FC = () => {
  const { addToCart } = useCart();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<typeof SERVICES_DATA[0] | null>(null);

  const handleOrder = (service: typeof SERVICES_DATA[0]) => {
     // Rediriger vers WhatsApp après lecture des conditions
     const message = `Bonjour KOBLOGIX,\n\nJ'ai lu les conditions et je souhaite commander le service : ${service.title}.\n\nPrix estimatif: ${service.minPriceLabel}`;
     const url = `https://wa.me/${WHATSAPP_SUPPORT}?text=${encodeURIComponent(message)}`;
     window.open(url, '_blank');
     setSelectedService(null);
  };

  const handleAddToCart = async (service: typeof SERVICES_DATA[0]) => {
    setLoadingId(service.id);
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart({ name: service.title, price: service.price, type: service.id });
    setLoadingId(null);
    setSelectedService(null);
  };

  return (
    <section id="services" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 relative">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Expertise Professionnelle</span>
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-dark dark:text-white">
            Nos Services <span className="text-primary">Premium</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
            Confiez vos travaux à une équipe d'experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service) => (
            <div 
                key={service.id} 
                onClick={() => setSelectedService(service)}
                className="group bg-gray-50 dark:bg-slate-800 rounded-3xl p-8 border border-gray-100 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 pointer-events-none"> {/* Pointer events none to let parent click handle modal */}
                <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary dark:text-blue-400 mb-6 shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {iconMap[service.iconName]}
                </div>

                <h3 className="text-xl font-bold text-dark dark:text-white mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed h-12 line-clamp-2">{service.description}</p>

                <div className="flex items-end justify-between mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                  <div>
                    <span className="text-xs text-gray-400 uppercase font-bold">À partir de</span>
                    <div className="text-2xl font-black text-dark dark:text-white">{service.minPriceLabel}</div>
                  </div>
                  {/* USD Price Tag - More Visible */}
                  <div className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
                    ≈ {Math.ceil(service.price / USD_RATE)} $ USD
                  </div>
                </div>
                
                <div className="text-primary font-bold text-sm flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Voir les détails <ArrowRight size={16}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICE DETAILS MODAL */}
      <Modal 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
        title={selectedService?.title || ''}
        maxWidth="max-w-3xl"
      >
        {selectedService && (
            <div className="space-y-8 animate-fadeIn">
                <p className="text-gray-600 dark:text-gray-300 text-lg border-l-4 border-primary pl-4 italic">
                    {selectedService.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Colonne Gauche: Pré-requis */}
                    <div className="bg-blue-50 dark:bg-slate-700/50 p-6 rounded-2xl">
                        <h4 className="flex items-center gap-2 font-bold text-primary dark:text-blue-300 mb-4">
                            <UploadCloud size={20}/> Ce que vous devez fournir
                        </h4>
                        <ul className="space-y-3">
                            {SERVICE_DETAILS[selectedService.id]?.prerequis.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
                                    <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                                    {item}
                                </li>
                            )) || <li>Détails sur demande.</li>}
                        </ul>
                    </div>

                    {/* Colonne Droite: Livrables & Délais */}
                    <div className="space-y-6">
                         <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-2xl border border-green-100 dark:border-green-800/30">
                            <h4 className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 mb-3">
                                <CheckCircle size={20}/> Livrables
                            </h4>
                             <ul className="space-y-2">
                                {SERVICE_DETAILS[selectedService.id]?.livrables.map((item, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 dark:text-gray-200 flex gap-2">
                                        <CheckCircle size={14} className="mt-1 text-green-500"/> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><Clock size={12}/> Délais Moyens</div>
                                <div className="font-bold text-dark dark:text-white">{SERVICE_DETAILS[selectedService.id]?.delais}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conditions & Footer */}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                    <div className="flex items-start gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl mb-6">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0"/>
                        <p><strong>Conditions :</strong> {SERVICE_DETAILS[selectedService.id]?.conditions}</p>
                    </div>

                    <div className="flex gap-4 flex-col md:flex-row">
                        <button 
                            onClick={() => handleOrder(selectedService)}
                            className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={20}/> Commander via WhatsApp
                        </button>
                        <button 
                            onClick={() => handleAddToCart(selectedService)}
                            disabled={loadingId === selectedService.id}
                            className="flex-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-dark dark:text-white py-4 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                        >
                             {loadingId === selectedService.id ? <Loader2 className="animate-spin" size={20}/> : <ShoppingCart size={20}/>}
                             Ajouter au Panier
                        </button>
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </section>
  );
};

export default Services;