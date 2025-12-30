import React, { useState } from 'react';
import { Gift, Users, Copy, Check, ArrowRight, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { WHATSAPP_SUPPORT } from '../constants';

const Ambassador: React.FC = () => {
  const { currentUser } = useStore();
  const [email, setEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const base = currentUser ? currentUser.name.substring(0, 3).toUpperCase() : (email.substring(0, 3).toUpperCase() || 'AMB');
    const random = Math.floor(100 + Math.random() * 900);
    setGeneratedCode(`${base}-${random}`);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-pink-500 rounded-full blur-3xl"></div>
        </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="lg:w-1/2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
                    <Star size={14} className="text-yellow-400 fill-yellow-400"/>
                    <span className="text-xs font-bold uppercase tracking-wider">Programme Partenaire</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black font-serif mb-6 leading-tight">
                    Devenez <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">Ambassadeur</span> KOBLOGIX
                </h2>
                <p className="text-indigo-200 text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Gagnez de l'argent en recommandant nos formations. Pour chaque étudiant inscrit avec votre code, vous recevez une commission et il reçoit une réduction.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-400"><Gift size={24}/></div>
                        <div className="text-left">
                            <div className="font-bold text-xl">-1000F</div>
                            <div className="text-xs text-indigo-200">Pour votre filleul</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400"><Users size={24}/></div>
                        <div className="text-left">
                            <div className="font-bold text-xl">1000F</div>
                            <div className="text-xs text-indigo-200">Cash pour vous</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:w-1/2 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
                    {!generatedCode ? (
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <h3 className="text-2xl font-bold text-center mb-2">Générez votre Code</h3>
                            <p className="text-center text-sm text-indigo-200 mb-6">Commencez à parrainer dès aujourd'hui.</p>
                            
                            {!currentUser && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-indigo-300 mb-2">Votre Email</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 outline-none focus:border-pink-500 transition-colors"
                                        placeholder="exemple@email.com"
                                    />
                                </div>
                            )}

                            <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                Obtenir mon code <ArrowRight size={20}/>
                            </button>
                        </form>
                    ) : (
                        <div className="text-center animate-fadeIn">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">Votre Code Ambassadeur</h3>
                                <p className="text-sm text-indigo-200">Partagez ce code avec vos amis.</p>
                            </div>

                            <div className="bg-black/30 border border-white/20 p-4 rounded-xl flex items-center justify-between gap-4 mb-6">
                                <span className="font-mono text-2xl font-bold tracking-widest text-yellow-400 select-all">{generatedCode}</span>
                                <button onClick={copyCode} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    {copied ? <Check size={20} className="text-green-400"/> : <Copy size={20}/>}
                                </button>
                            </div>

                            <p className="text-xs text-indigo-300 mb-6">
                                Contactez le support sur WhatsApp pour activer vos paiements.
                            </p>

                            <a 
                                href={`https://wa.me/${WHATSAPP_SUPPORT}?text=Bonjour,+je+souhaite+activer+mon+compte+Ambassadeur+avec+le+code+${generatedCode}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                Activer mon compte (WhatsApp)
                            </a>
                            
                            <button onClick={() => setGeneratedCode('')} className="mt-4 text-sm text-gray-400 hover:text-white underline">
                                Générer un autre code
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Ambassador;