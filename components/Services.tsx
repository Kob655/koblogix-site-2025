import React, { useState } from 'react';
import { FileText, UserCheck, Image, Spline, BookOpen, Languages, ShoppingCart, Loader2, Clock, UploadCloud, CheckCircle, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { SERVICES_DATA, USD_RATE, WHATSAPP_SUPPORT } from '../constants';
import { useCart } from '../context/CartContext';
import Modal from './ui/Modal';

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText size={32} />,
  UserCheck: <UserCheck size={32} />,
  Image: <Image size={32} />,
  Spline: <Spline size={32} />,
  BookOpen: <BookOpen size={32} />,
  Languages: <Languages size={32} />,
  ShieldAlert: <ShieldAlert size={32} />,
};

const SERVICE_DETAILS: Record<string, { prerequis: string[], delais: string, livrables: string[], conditions: string }> = {
    traduction: {
        prerequis: ["Document source complet", "Glossaire technique spécifique", "Domaine de recherche"],
        delais: "3 à 7 jours selon volume",
        livrables: ["Fichier LaTeX traduit", "PDF compilé", "Rapport de relecture"],
        conditions: "Expertise garantie par traducteurs certifiés."
    },
    tikz: {
        prerequis: ["Brouillon papier ou image basse résolution", "Légendes précises", "Dimensions souhaitées"],
        delais: "48h à 72h",
        livrables: ["Code source TikZ/LaTeX", "Fichier PDF/PNG HD"],
        conditions: "Modifications illimitées sur le schéma."
    },
    plagiat: {
        prerequis: ["Rapport de plagiat existant (Turnitin/Compilatio)", "Manuscrit original", "Consignes de l'université"],
        delais: "1 semaine environ",
        livrables: ["Nouveau manuscrit reformulé", "Nouveau rapport de similarité < 10%"],
        conditions: "Confidentialité absolue garantie."
    },
    cv: {
        prerequis: ["Infos personnelles", "Parcours académique", "Expériences", "Photo HD"],
        delais: "24h à 48h",
        livrables: ["PDF Haute Définition", "Fichier source .tex"],
        conditions: "Paiement 100% à la commande."
    },
    rapport: {
        prerequis: ["Texte brut", "Images/Figures", "Structure souhaitée"],
        delais: "3 à 5 jours",
        livrables: ["PDF formaté aux normes", "Bibliographie automatisée"],
        conditions: "Acompte de 50%."
    },
    memoire: {
        prerequis: ["Plan validé", "Chapitres rédigés", "Références"],
        delais: "10 à 15 jours",
        livrables: ["Mise en page LaTeX premium", "Fichiers sources complets"],
        conditions: "Suivi personnalisé par étape."
    }
};

const Services: React.FC = () => {
  const { addToCart } = useCart();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<typeof SERVICES_DATA[0] | null>(null);

  const handleOrder = (service: typeof SERVICES_DATA[0]) => {
     const message = `Bonjour KOBLOGIX,\n\nJe souhaite commander le service : ${service.title}.`;
     window.open(`https://wa.me/${WHATSAPP_SUPPORT}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = async (service: typeof SERVICES_DATA[0]) => {
    setLoadingId(service.id);
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart({ name: service.title, price: service.price, type: service.id });
    setLoadingId(null);
    setSelectedService(null);
  };

  return (
    <section id="services" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Solutions Globales</span>
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-dark dark:text-white">
            Services Académiques <span className="text-primary">Internationaux</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
            Des outils de pointe pour vos publications de rang mondial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service) => (
            <div 
                key={service.id} 
                onClick={() => setSelectedService(service)}
                className="group bg-gray-50 dark:bg-slate-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-700 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl cursor-pointer"
            >
              <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                {iconMap[service.iconName]}
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-white mb-3">{service.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 h-12 line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-slate-700 pt-6">
                <div className="text-2xl font-black text-dark dark:text-white">{service.minPriceLabel}</div>
                <div className="text-primary font-bold text-sm flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Détails <ArrowRight size={16}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selectedService} onClose={() => setSelectedService(null)} title={selectedService?.title || ''}>
        {selectedService && (
            <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 dark:bg-slate-700/50 p-6 rounded-2xl">
                        <h4 className="font-bold text-primary mb-4 flex items-center gap-2"><UploadCloud size={20}/> Pré-requis</h4>
                        <ul className="space-y-3">
                            {SERVICE_DETAILS[selectedService.id]?.prerequis.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
                                    <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-6">
                         <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-2xl border border-green-100 dark:border-green-800/30">
                            <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2"><CheckCircle size={20}/> Livrables</h4>
                             <ul className="space-y-2">
                                {SERVICE_DETAILS[selectedService.id]?.livrables.map((item, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 dark:text-gray-200 flex gap-2">
                                        <CheckCircle size={14} className="mt-1 text-green-500"/> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-200">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1"><Clock size={12} className="inline mr-1"/> Délais</div>
                            <div className="font-bold">{SERVICE_DETAILS[selectedService.id]?.delais}</div>
                        </div>
                    </div>
                </div>
                <div className="border-t pt-6 flex gap-4 flex-col md:flex-row">
                    <button onClick={() => handleOrder(selectedService)} className="flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">Commander via WhatsApp</button>
                    <button onClick={() => handleAddToCart(selectedService)} disabled={loadingId === selectedService.id} className="flex-1 bg-slate-100 dark:bg-slate-700 text-dark dark:text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                        {loadingId === selectedService.id ? <Loader2 className="animate-spin" size={20}/> : <ShoppingCart size={20}/>} Ajouter au Panier
                    </button>
                </div>
            </div>
        )}
      </Modal>
    </section>
  );
};

export default Services;