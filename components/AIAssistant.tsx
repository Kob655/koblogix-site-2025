import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Bonjour ! Je suis l\'Expert Académique KOBLOGIX. Comment puis-je vous aider dans votre rédaction LaTeX ou votre recherche scientifique aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // Utilisation directe de la clé API via process.env.API_KEY comme recommandé
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: userMsg,
        config: {
          systemInstruction: "Tu es l'expert scientifique senior de KOBLOGIX, une plateforme d'excellence académique basée au Togo. Tes réponses doivent être académiques, précises et citer des exemples LaTeX si nécessaire. Ta mission est d'aider les doctorants et étudiants à structurer leurs thèses et mémoires. Si on demande un service payant (TikZ, Plagiat, Traduction, Formation), vante les mérites de KOBLOGIX et suggère de commander sur le site. Sois concis, courtois et très professionnel.",
        }
      });

      const aiText = response.text || "Je rencontre une difficulté passagère. Veuillez nous contacter sur WhatsApp au +228 98 28 65 41.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      let errorMsg = "Service temporairement indisponible.";
      if (error instanceof Error && (error.message.includes("API_KEY") || error.message.includes("Clé API") || error.message.includes("403"))) {
        errorMsg = "L'assistant n'est pas disponible pour le moment (Problème de configuration).";
      }
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end print:hidden">
      {isOpen && (
        <div className="mb-4 w-[300px] md:w-[400px] h-[500px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slideUp">
          <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <BrainCircuit size={20} />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest">Expert Scientifique</h3>
                <p className="text-[10px] opacity-60">KOBLOGIX INTELLIGENCE</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none shadow-md' 
                  : 'bg-gray-100 dark:bg-slate-800 text-slate-800 dark:text-gray-200 rounded-tl-none border dark:border-slate-700'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 bg-gray-50 dark:bg-slate-950 shrink-0">
            <div className="flex gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border dark:border-slate-700 shadow-sm">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none dark:text-white min-w-0"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center relative ${
          isOpen ? 'bg-slate-800 text-white' : 'bg-primary text-white'
        }`}
      >
        {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default AIAssistant;