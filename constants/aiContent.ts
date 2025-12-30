
export const AI_PACK_CONTENT = {
  tools: [
    {
      category: "Recherche Scientifique & Sources",
      items: [
        { name: "Consensus", desc: "Moteur de recherche IA qui répond à partir d'articles scientifiques réels (Q1/Q2).", url: "https://consensus.app" },
        { name: "Perplexity AI", desc: "L'alternative à Google : cite ses sources en temps réel avec une précision chirurgicale.", url: "https://perplexity.ai" },
        { name: "Elicit", desc: "Analyse des milliers de papiers pour extraire les données clés et les limites méthodologiques.", url: "https://elicit.com" },
        { name: "ResearchRabbit", desc: "Le 'Spotify' de la recherche : découvrez des articles similaires par mapping visuel.", url: "https://researchrabbit.ai" }
      ]
    },
    {
      category: "Rédaction Académique & Style",
      items: [
        { name: "Claude 3.5 Sonnet", desc: "Actuellement la meilleure IA pour la rédaction académique fluide et nuancée.", url: "https://claude.ai" },
        { name: "DeepL Write", desc: "Perfectionnez votre grammaire et votre ton sans dénaturer le sens technique.", url: "https://deepl.com/write" },
        { name: "Trinka AI", desc: "Correcteur spécialisé pour les publications scientifiques et médicales.", url: "https://trinka.ai" }
      ]
    },
    {
      category: "Analyse & Discussion de PDF",
      items: [
        { name: "ChatPDF", desc: "Discutez avec vos articles de recherche pour extraire les points clés en 5 secondes.", url: "https://chatpdf.com" },
        { name: "Humata AI", desc: "Analyse ultra-rapide de rapports techniques de plusieurs centaines de pages.", url: "https://humata.ai" },
        { name: "SciSpace", desc: "Expliqueur de formules mathématiques et de tableaux complexes dans les PDFs.", url: "https://typeset.io" }
      ]
    }
  ],
  prompts: [
    {
      title: "Introduction en Entonnoir (Standard Q1)",
      prompt: "Agis comme un expert en rédaction scientifique senior. Aide-moi à structurer l'introduction de mon travail sur [SUJET]. Applique la méthode CARS (Create a Research Space) : 1. Établis le territoire (contexte et importance), 2. Identifie la niche (manque ou controverse), 3. Occupe la niche (ma solution/objectif). Ton : formel, neutre, académique."
    },
    {
      title: "Reformulation pour Revue Impact Factor",
      prompt: "Voici un paragraphe de ma section Discussion : [COLLER TEXTE]. Reformule-le pour une revue à haut facteur d'impact. Utilise des verbes d'action précis, élimine les redondances, renforce les transitions logiques et assure-toi que l'argumentation est percutante mais prudente (hedging)."
    },
    {
      title: "Critique de Méthodologie",
      prompt: "Je te fournis la méthodologie suivante : [DESCRIPTION]. Identifie 3 faiblesses potentielles que les relecteurs pourraient soulever. Propose ensuite des arguments pour justifier ces choix ou des suggestions pour renforcer la rigueur de l'étude."
    },
    {
      title: "Génération de Résumé (Abstract) Percutant",
      prompt: "À partir des résultats suivants [RÉSULTATS], génère un résumé de 250 mots maximum respectant la structure : Contexte, Objectif, Méthodes, Résultats Clés, Conclusion/Implication. Le résumé doit être 'self-contained' et accrocheur."
    },
    {
      title: "Réponse aux Relecteurs (Reviewers)",
      prompt: "Agis comme un chercheur diplomate. Voici une critique d'un relecteur : [CRITIQUE]. Rédige une réponse polie qui : 1. Remercie le relecteur, 2. Accepte la suggestion (ou justifie poliment le maintien), 3. Explique les modifications apportées dans le manuscrit."
    }
  ],
  guides: [
    { title: "Configuration Workflow Zotero + Claude", desc: "Comment exporter vos annotations PDF pour générer une revue de littérature en un clic." },
    { title: "Stratégie Anti-Plagiat IA", desc: "Les méthodes pour utiliser l'IA comme assistant de pensée sans déclencher les détecteurs de contenu généré." },
    { title: "Maîtriser TikZ avec l'IA", desc: "Comment demander à ChatGPT de générer des schémas LaTeX complexes sans erreurs de compilation." }
  ]
};
