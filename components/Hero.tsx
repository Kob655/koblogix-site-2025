import React, { useEffect, useState } from 'react';
import { GraduationCap, Box, ChevronDown, Globe, Wifi } from 'lucide-react';
import { smoothScrollTo } from '../utils';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const targetId = id.replace('#', '');
    smoothScrollTo(targetId);
  };

  return (
    <section id="accueil" className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden min-h-screen flex flex-col justify-center bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
        
        {/* Animated Background Blobs & Grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-normal dark:bg-primary/10"></div>
           <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-normal"></div>
           <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-normal"></div>
           
           {/* Modern Grid Pattern */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] mask-image-gradient"></div>
        </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-900/50 backdrop-blur-md mb-8 shadow-sm animate-fadeIn cursor-default hover:scale-105 transition-transform select-none">
            <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Globe size={12} /> Formation 100% En Ligne
            </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-serif mb-8 text-dark dark:text-white leading-[1.1] tracking-tight drop-shadow-sm opacity-0 animate-slideUp [animation-delay:200ms]">
                L'Expertise LaTeX <br className="hidden md:block"/>
                <span className="relative inline-block mt-2">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl transform -skew-x-12"></span>
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-accent">
                    Depuis Chez Vous
                    </span>
                    <Wifi className="absolute -top-4 -right-8 text-blue-400 w-8 h-8 animate-pulse hidden md:block" />
                </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed opacity-0 animate-slideUp [animation-delay:400ms] font-light">
            Formez-vous aux standards internationaux de rédaction scientifique sans vous déplacer.
            <span className="hidden md:inline"> Cours en direct sur Zoom, replays illimités et suivi personnalisé.</span>
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto opacity-0 animate-slideUp [animation-delay:600ms]">
            <a 
                href="#formation" 
                onClick={(e) => handleNavClick(e, '#formation')}
                className="group relative px-8 py-4 bg-dark dark:bg-white text-white dark:text-dark rounded-xl font-bold text-lg shadow-xl shadow-dark/20 dark:shadow-white/10 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden flex items-center justify-center gap-3"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <GraduationCap size={24} /> 
                Voir les sessions
            </a>
            <a 
                href="#portfolio" 
                onClick={(e) => handleNavClick(e, '#portfolio')}
                className="px-8 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-gray-200 dark:border-slate-800 text-dark dark:text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:border-primary/50 transition-all flex items-center justify-center gap-3 group"
            >
                <Box size={24} className="text-primary group-hover:rotate-12 transition-transform"/> 
                Voir nos réalisations
            </a>
            </div>

            {/* Floating Glass Stats */}
            <div className="mt-20 md:mt-32 w-full grid grid-cols-2 md:grid-cols-4 gap-4 opacity-0 animate-slideUp [animation-delay:800ms]">
            {[
                { label: 'Format', val: 'Online', color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Participants', val: '500+', color: 'text-purple-600 dark:text-purple-400' },
                { label: 'Taux Réussite', val: '100%', color: 'text-green-600 dark:text-green-400' },
                { label: 'Replays', val: '24/7', color: 'text-orange-600 dark:text-orange-400' }
            ].map((stat, i) => (
                <div key={i} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/50 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center transform hover:scale-105 transition-transform duration-300">
                <div className={`text-2xl md:text-3xl font-black ${stat.color} mb-1`}>{stat.val}</div>
                <div className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</div>
                </div>
            ))}
            </div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hidden md:block">
        <ChevronDown size={32} className="text-gray-400" />
      </div>
    </section>
  );
};

export default Hero;