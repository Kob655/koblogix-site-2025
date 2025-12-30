import React from 'react';
import Modal from './ui/Modal';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyProps> = ({ isOpen, onClose }) => {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Politique de Confidentialité"
            maxWidth="max-w-2xl"
        >
            <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                    <h4 className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300 mb-2">
                        <ShieldCheck size={20}/> Engagement RGPD
                    </h4>
                    <p>
                        Chez KOBLOGIX, la protection de vos données personnelles est une priorité absolue. 
                        Cette politique décrit comment nous collectons, utilisons et protégeons vos informations.
                    </p>
                </div>

                <section>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><FileText size={16}/> 1. Collecte des données</h4>
                    <p>Nous collectons uniquement les données nécessaires au bon traitement de vos commandes et à votre suivi pédagogique :</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Nom et Prénoms (pour la certification).</li>
                        <li>Adresse Email (pour l'envoi des accès et supports).</li>
                        <li>Numéro de Téléphone (pour le support WhatsApp et la validation des paiements mobiles).</li>
                        <li>Documents académiques (CV, thèses) uniquement dans le cadre des services de rédaction.</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Lock size={16}/> 2. Utilisation et Sécurité</h4>
                    <p>Vos documents (mémoires, thèses, données de recherche) sont traités avec la plus stricte confidentialité.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Aucun document n'est partagé avec des tiers sans votre consentement explicite.</li>
                        <li>Les fichiers sont stockés de manière sécurisée et supprimés de nos serveurs 30 jours après la livraison finale, sauf demande contraire.</li>
                        <li>Nous n'utilisons pas vos travaux pour entraîner des modèles d'IA.</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Eye size={16}/> 3. Vos Droits</h4>
                    <p>Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
                    <p className="mt-2">Pour exercer ce droit, contactez-nous à : <span className="font-bold text-primary">Koblogixofficiel@gmail.com</span>.</p>
                </section>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onClose} className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-colors">
                        J'ai compris
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default PrivacyPolicyModal;
