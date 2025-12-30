import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Thomas D.",
    role: "Étudiant en Licence 3",
    content: "Franchement, je galérais avec Word pour mon rapport de stage. Les images bougeaient tout le temps. Après la formation, j'ai tout refait en LaTeX et le rendu est juste hyper propre. Merci pour la patience !",
    rating: 5
  },
  {
    id: 2,
    name: "Clarisse A.",
    role: "Étudiante Master 1",
    content: "J'avais besoin d'un CV urgent pour une demande de stage. Le service a été rapide (reçu en 24h) et le design sort vraiment du lot par rapport à mes camarades. Je recommande.",
    rating: 5
  },
  {
    id: 3,
    name: "Eric Mensah",
    role: "Doctorant (Débutant)",
    content: "Je ne connaissais rien au code. La formation part vraiment de zéro, ce qui est top. J'ai maintenant une base solide pour commencer la rédaction de ma thèse sans stresser sur la mise en page.",
    rating: 4
  },
  {
    id: 4,
    name: "Sarah K.",
    role: "Étudiante fin de cycle",
    content: "J'ai confié la correction de mon mémoire car je n'avais plus le temps avec mon stage. Le travail a été livré dans les délais et la bibliographie était enfin aux normes. Ouf !",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="py-24 bg-primary dark:bg-blue-900 text-white overflow-hidden relative transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl"></div>
         <Quote size={400} className="absolute -top-20 -right-20 rotate-12 text-white/5" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">Avis Étudiants</h2>
          <div className="w-24 h-1.5 bg-accent mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-500 min-h-[300px] flex flex-col justify-center items-center text-center relative">
               <div className="flex gap-1 mb-6">
                 {[...Array(5)].map((_, i) => (
                   <Star 
                      key={i} 
                      size={20} 
                      className={`${i < TESTIMONIALS[current].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} drop-shadow-md`} 
                   />
                 ))}
               </div>
               
               <p className="text-lg md:text-2xl font-serif italic mb-8 leading-relaxed font-light">
                 "{TESTIMONIALS[current].content}"
               </p>

               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-white text-primary flex items-center justify-center font-bold text-lg">
                    {TESTIMONIALS[current].name.charAt(0)}
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-white">{TESTIMONIALS[current].name}</h4>
                   <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">{TESTIMONIALS[current].role}</p>
                 </div>
               </div>
            </div>

            <div className="flex justify-center mt-8 gap-4">
               <button onClick={prev} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 border border-white/10">
                 <ChevronLeft size={20} />
               </button>
               <button onClick={next} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110 border border-white/10">
                 <ChevronRight size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;