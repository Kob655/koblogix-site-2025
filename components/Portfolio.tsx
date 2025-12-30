import React from 'react';
import { ZoomIn } from 'lucide-react';

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    category: 'Thèse & Mémoire',
    title: 'Thèse de Doctorat en Biologie',
    description: 'Mise en page complexe de 250 pages avec index, bibliographie BibLaTeX et figures vectorielles.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800', 
  },
  {
    id: 2,
    category: 'Présentation Académique',
    title: 'Soutenance Master Génie Civil',
    description: 'Présentation Beamer personnalisée avec animations TikZ pour schémas structurels.',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800', 
  },
  {
    id: 3,
    category: 'CV Professionnel',
    title: 'CV ModernCV Design',
    description: 'Refonte complète pour un profil ingénieur, optimisé pour les systèmes ATS.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800', 
  },
  {
    id: 4,
    category: 'Poster Scientifique',
    title: 'Conférence Internationale IEEE',
    description: 'Poster format A0 haute résolution, respectant la charte graphique de l\'événement.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800', 
  },
  {
    id: 5,
    category: 'Rapport Technique',
    title: 'Rapport de Projet Informatique',
    description: 'Intégration de code source (Listings), algorithmes et diagrammes UML.',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800', 
  },
  {
    id: 6,
    category: 'Livre & Typographie',
    title: 'Publication Ouvrage Scientifique',
    description: 'Préparation pré-presse (CMJN), gestion des césures et des veuves/orphelines.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800', 
  },
  {
    id: 7, // Ajout pour remplir la grille visuellement si besoin, ou on garde 6
    category: 'Article Scientifique',
    title: 'Template Revue Elsevier',
    description: 'Respect strict des guidelines auteurs, double colonnes, gestion des figures flottantes.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
  }
];

const Portfolio: React.FC = () => {
  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <span className="text-secondary font-bold uppercase tracking-wider text-sm">Notre Galerie</span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 text-dark dark:text-white">
            La Preuve par l'<span className="text-primary">Image</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Découvrez la qualité visuelle de nos productions LaTeX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PORTFOLIO_ITEMS.slice(0, 6).map((item) => (
            <div 
              key={item.id} 
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

              <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="mb-3">
                   <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                     {item.category}
                   </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-serif leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-3 mb-4">
                  {item.description}
                </p>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                   <span className="flex items-center gap-2 text-white font-bold text-xs hover:text-secondary transition-colors">
                      <ZoomIn size={16} /> Aperçu
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;