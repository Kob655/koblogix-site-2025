import React, { useState } from 'react';
import { BookOpen, Copy, Check, Quote } from 'lucide-react';

const BibtexGenerator: React.FC = () => {
  const [type, setType] = useState('article');
  const [fields, setFields] = useState({
    title: '',
    author: '',
    year: '',
    journal: '',
    publisher: '',
    url: ''
  });
  const [copied, setCopied] = useState(false);

  const generateBibtex = () => {
    const key = fields.author ? fields.author.split(' ')[0].toLowerCase() + fields.year : 'ref' + new Date().getFullYear();
    
    let bib = `@${type}{${key},\n`;
    if (fields.title) bib += `  title = {${fields.title}},\n`;
    if (fields.author) bib += `  author = {${fields.author}},\n`;
    if (fields.year) bib += `  year = {${fields.year}},\n`;
    
    if (type === 'article' && fields.journal) bib += `  journal = {${fields.journal}},\n`;
    if ((type === 'book' || type === 'misc') && fields.publisher) bib += `  publisher = {${fields.publisher}},\n`;
    if (fields.url) bib += `  url = {${fields.url}},\n`;
    
    bib += `}`;
    return bib;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateBibtex());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
            
            {/* Left Content */}
            <div className="md:w-1/2">
                <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Outil Gratuit</span>
                <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-slate-900 dark:text-white">
                    Générateur <span className="text-primary">BibTeX</span> Rapide
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                    Ne perdez plus de temps à formater vos bibliographies manuellement. 
                    Utilisez notre outil gratuit pour générer des citations compatibles LaTeX instantanément.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2"><Quote size={18}/> Astuce Pro</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                        Pour apprendre à gérer des bibliographies complexes (Zotero + LaTeX), inscrivez-vous à notre formation complète.
                    </p>
                </div>
            </div>

            {/* Right Tool */}
            <div className="md:w-1/2 w-full bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                    {['article', 'book', 'misc'].map(t => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${type === t ? 'bg-slate-900 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 hover:bg-gray-200'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <input className="input-field col-span-2" placeholder="Titre du document" value={fields.title} onChange={e => setFields({...fields, title: e.target.value})} />
                    <input className="input-field" placeholder="Auteur (Nom, Prénom)" value={fields.author} onChange={e => setFields({...fields, author: e.target.value})} />
                    <input className="input-field" placeholder="Année" value={fields.year} onChange={e => setFields({...fields, year: e.target.value})} />
                    
                    {type === 'article' && <input className="input-field col-span-2" placeholder="Nom du Journal" value={fields.journal} onChange={e => setFields({...fields, journal: e.target.value})} />}
                    {(type === 'book' || type === 'misc') && <input className="input-field col-span-2" placeholder="Éditeur / Institution" value={fields.publisher} onChange={e => setFields({...fields, publisher: e.target.value})} />}
                    
                    <input className="input-field col-span-2" placeholder="URL (Optionnel)" value={fields.url} onChange={e => setFields({...fields, url: e.target.value})} />
                </div>

                <div className="relative group">
                    <pre className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs md:text-sm font-mono overflow-x-auto min-h-[100px] border border-slate-700">
                        {generateBibtex()}
                    </pre>
                    <button 
                        onClick={copyToClipboard}
                        className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors backdrop-blur-sm"
                        title="Copier"
                    >
                        {copied ? <Check size={18} className="text-green-400"/> : <Copy size={18}/>}
                    </button>
                </div>
            </div>
        </div>
      </div>
      <style>{`
        .input-field {
            width: 100%;
            padding: 0.75rem;
            border-radius: 0.75rem;
            background-color: var(--bg-input, #f3f4f6);
            border: 1px solid transparent;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.2s;
        }
        .dark .input-field {
            --bg-input: #1e293b;
            color: white;
        }
        .input-field:focus {
            background-color: white;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .dark .input-field:focus {
            background-color: #0f172a;
        }
      `}</style>
    </section>
  );
};

export default BibtexGenerator;