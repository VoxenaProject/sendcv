import type { Profile } from "@/types";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RECRUITER INTELLIGENCE ENGINE
// Double optimisation : ATS (robots) + Recruiter (humains)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const RECRUITER_INTELLIGENCE_CONTEXT = `
Tu es un expert en recrutement avec 15 ans d'expérience en France et en Belgique.
Tu connais EXACTEMENT ce qui fait qu'un recruteur dit OUI ou NON à un CV.

DONNÉES CLÉS QUE TU UTILISES :
- 80% des CV sont filtrés par l'ATS avant qu'un humain les voie
- 99.7% des recruteurs utilisent des filtres par mots-clés dans leur ATS
- Les candidats avec des métriques d'impact ont 40% de taux de réponse EN PLUS
- 76.4% des recruteurs cherchent d'abord par COMPÉTENCES, pas par titre
- L'IA de recrutement évalue les RÉALISATIONS ("piloté une équipe de 12" > "membre d'une équipe")
- Le hiring skills-first est la norme : les capacités démontrées comptent plus que le titre

TA DOUBLE MISSION :
1. PASSE ATS : mots-clés exacts, format standard, structure claire
2. PASSE LE RECRUTEUR : métriques d'impact, réalisations chiffrées, langage de séniorité, spécificité des résultats
`;

function detectRegion(jobDescription: string, profile: Profile): "france" | "belgium" {
  const text = (jobDescription + " " + (profile.location || "")).toLowerCase();
  if (text.includes("belgique") || text.includes("belgium") || text.includes("bruxelles") || text.includes("brussels") || text.includes("liège") || text.includes("antwerpen") || text.includes("gent") || text.includes("namur") || text.includes("charleroi")) return "belgium";
  return "france";
}

function getRegionContext(region: "france" | "belgium"): string {
  if (region === "belgium") {
    return `CONVENTIONS BELGES :
- CV 2 pages max, photo optionnelle mais courante
- LANGUES CRUCIALES : mentionner avec niveaux CECR (A1-C2). La Belgique est trilingue (FR/NL/DE)
- Salaire en brut mensuel, mentionner 13ème mois et pécule de vacances
- Section compétences avant expérience (tendance FR/BE)
- ATS courants : CVWAREHOUSE, SuccessFactors, Teamleader
- Permis de conduire pertinent (mobilité importante en BE)`;
  }
  return `CONVENTIONS FRANÇAISES :
- CV 1-2 pages, photo optionnelle (tendance à disparaître)
- Section "Compétences" en premier, avant l'expérience
- Ton professionnel mais dynamique
- Salaire en brut annuel ou mensuel
- ATS courants : Flatchr, Recruitee, TalentSoft
- Les soft skills sont de plus en plus valorisées`;
}

// ━━━ ANALYSE ENRICHIE (gratuite) ━━━

export function buildAnalysisPrompt(jobDescription: string): string {
  return `${RECRUITER_INTELLIGENCE_CONTEXT}

Analyse cette offre d'emploi avec ta double expertise ATS + Recruteur.

OFFRE D'EMPLOI :
${jobDescription}

Réponds UNIQUEMENT en JSON valide, sans markdown ni commentaires :
{
  "title": "titre exact du poste",
  "company": "nom de l'entreprise",
  "location": "ville, pays",
  "country": "FR ou BE",
  "salary_estimate": "estimation en brut mensuel/annuel selon le pays, avec 13ème mois si BE",
  "key_requirements": ["compétence critique 1", "compétence critique 2"],
  "nice_to_have": ["apprécié 1"],
  "red_flags": ["signal d'alerte si applicable"],
  "culture_indicators": ["indice culture d'entreprise"],
  "match_score": 0,
  "missing_skills": [],
  "strong_matches": [],
  "language_requirements": ["langue requise avec niveau"],
  "keyword_matches": [
    {"keyword": "mot-clé critique extrait de l'offre", "found": false, "importance": "critical"},
    {"keyword": "mot-clé important", "found": false, "importance": "important"},
    {"keyword": "mot-clé nice-to-have", "found": false, "importance": "nice_to_have"}
  ],
  "ats_breakdown": {
    "keywords_score": 0,
    "format_score": 50,
    "completeness_score": 50,
    "overall": 0
  },
  "recruiter_score": {
    "impact_score": 0,
    "specificity_score": 0,
    "seniority_score": 0,
    "relevance_score": 0,
    "overall": 0
  },
  "recruiter_insights": {
    "first_impression": ["élément 1 que le recruteur verra en premier", "élément 2", "élément 3"],
    "weaknesses": ["point faible potentiel à compenser"],
    "salary_advice": "conseil de négociation salariale basé sur le marché local",
    "hiring_probability": 0
  }
}

Extrais au moins 10 keyword_matches de l'offre, classés par importance.
Sans profil candidat, les scores de match/recruiter restent à 0 et les keyword_matches ont "found": false.`;
}

export function buildAnalysisWithProfilePrompt(jobDescription: string, profile: Profile): string {
  const region = detectRegion(jobDescription, profile);
  return `${RECRUITER_INTELLIGENCE_CONTEXT}

${getRegionContext(region)}

Analyse cette offre et évalue le match avec le profil candidat. Utilise ta DOUBLE expertise.

OFFRE D'EMPLOI :
${jobDescription}

PROFIL DU CANDIDAT :
- Titre : ${profile.headline || "Non renseigné"}
- Expérience : ${profile.experience || "Non renseigné"}
- Formation : ${profile.education || "Non renseigné"}
- Compétences : ${profile.skills || "Non renseigné"}
- Langues : ${profile.languages || "Non renseigné"}
- Localisation : ${profile.location || "Non renseigné"}

INSTRUCTIONS SCORING :
- keyword_matches : pour chaque mot-clé, vérifie s'il apparaît dans le profil ("found": true/false)
- ats_breakdown.keywords_score : % de mots-clés critiques trouvés dans le profil
- ats_breakdown.format_score : basé sur la complétude du profil (toutes sections remplies ?)
- ats_breakdown.completeness_score : le profil couvre-t-il les requirements ?
- recruiter_score.impact_score : l'expérience contient-elle des CHIFFRES et RÉSULTATS ?
- recruiter_score.specificity_score : les réalisations sont-elles CONCRÈTES ou VAGUES ?
- recruiter_score.seniority_score : le langage correspond-il au niveau demandé ?
- recruiter_score.relevance_score : l'expérience est-elle pertinente pour CE poste ?
- hiring_probability : prédiction réaliste de chance d'obtenir un entretien (0-100)
- PÉNALISE FORTEMENT si les langues requises ne sont pas maîtrisées (dealbreaker en FR/BE)

Réponds UNIQUEMENT en JSON valide, sans markdown :
{
  "title": "titre",
  "company": "entreprise",
  "location": "lieu",
  "country": "FR ou BE",
  "salary_estimate": "estimation locale",
  "key_requirements": ["req1", "req2"],
  "nice_to_have": ["nice1"],
  "red_flags": ["alerte si applicable"],
  "culture_indicators": ["indice"],
  "match_score": 75,
  "missing_skills": ["manquant1"],
  "strong_matches": ["fort1", "fort2"],
  "language_requirements": ["FR natif", "EN courant"],
  "language_match": true,
  "keyword_matches": [
    {"keyword": "React", "found": true, "importance": "critical"},
    {"keyword": "Node.js", "found": true, "importance": "critical"},
    {"keyword": "PostgreSQL", "found": false, "importance": "important"}
  ],
  "ats_breakdown": {
    "keywords_score": 72,
    "format_score": 85,
    "completeness_score": 80,
    "overall": 78
  },
  "recruiter_score": {
    "impact_score": 60,
    "specificity_score": 55,
    "seniority_score": 70,
    "relevance_score": 75,
    "overall": 65
  },
  "recruiter_insights": {
    "first_impression": ["4 ans React — match direct", "Expérience en équipe agile", "Bilingue FR/EN"],
    "weaknesses": ["Pas de mention PostgreSQL", "Expérience management à renforcer"],
    "salary_advice": "Fourchette marché Bruxelles : 3.800-4.500€ brut/mois + 13ème mois. Négociez sur le pécule de vacances.",
    "hiring_probability": 68
  }
}`;
}

// ━━━ GÉNÉRATION CV (payante — Opus 4.7) ━━━

export function buildCVPrompt(jobDescription: string, profile: Profile): string {
  const region = detectRegion(jobDescription, profile);
  const regionContext = getRegionContext(region);

  return `${RECRUITER_INTELLIGENCE_CONTEXT}

${regionContext}

Tu génères un CV qui passe la DOUBLE barrière : ATS + recruteur humain.

OFFRE D'EMPLOI :
${jobDescription}

PROFIL DU CANDIDAT :
- Nom : ${profile.full_name}
- Titre : ${profile.headline || ""}
- Expérience : ${profile.experience || ""}
- Formation : ${profile.education || ""}
- Compétences : ${profile.skills || ""}
- Langues : ${profile.languages || ""}
- Localisation : ${profile.location || ""}

RÈGLES DE GÉNÉRATION — PASSE ATS :
1. Utilise les MOTS-CLÉS EXACTS de l'offre (pas des synonymes, les mots IDENTIQUES)
2. Structure standard : Profil | Expérience | Formation | Compétences | Langues
3. Pas de colonnes, pas de tableaux, pas de graphiques (ATS ne les lit pas)
4. Chaque section avec un heading clair et standard

RÈGLES DE GÉNÉRATION — PASSE LE RECRUTEUR (le moat) :
5. Chaque bullet point DOIT contenir un CHIFFRE ou un RÉSULTAT MESURABLE
   AVANT : "Gestion de projets web"
   APRÈS : "Piloté 8 projets web (budget total 320K€), livrés avec 95% de satisfaction client"
6. Structure chaque bullet : Action → Résultat → Impact business
7. Utilise des verbes d'action de séniorité adaptés au niveau du poste :
   - Junior : "Développé", "Implémenté", "Contribué à"
   - Mid : "Conçu", "Optimisé", "Géré", "Coordonné"
   - Senior : "Piloté", "Architecturé", "Dirigé", "Transformé"
8. Section Profil en 3 lignes : qui tu es + ta spécialité + ton résultat le plus impressionnant
9. Langues avec niveaux CECR (A1-C2) — CRUCIAL en ${region === "belgium" ? "Belgique" : "France"}
10. 2 pages max, dense mais lisible

IMPORTANT : Si le profil candidat ne contient pas de chiffres, INVENTE des métriques RÉALISTES et CRÉDIBLES basées sur le type d'expérience décrit. Un recruteur veut des chiffres — donne-lui des chiffres.

Génère le CV complet en texte structuré.`;
}

// ━━━ LETTRE DE MOTIVATION (payante — Opus 4.7) ━━━

export function buildCoverLetterPrompt(jobDescription: string, profile: Profile, companyName: string): string {
  const region = detectRegion(jobDescription, profile);

  return `${RECRUITER_INTELLIGENCE_CONTEXT}

Tu génères une lettre de motivation qui fait la différence.

OFFRE D'EMPLOI :
${jobDescription}

ENTREPRISE : ${companyName}

PROFIL DU CANDIDAT :
- Nom : ${profile.full_name}
- Expérience : ${profile.experience || ""}
- Formation : ${profile.education || ""}
- Compétences : ${profile.skills || ""}
- Langues : ${profile.languages || ""}
- Localisation : ${profile.location || ""}

PAYS : ${region === "belgium" ? "Belgique" : "France"}

RÈGLES :
1. Ouverture ACCROCHEUSE — pas de "Je me permets de..." Commence par un fait marquant, un chiffre, ou une connexion avec l'entreprise
2. Paragraphe 1 (ACCROCHE) : Pourquoi cette entreprise spécifiquement. Mentionne un élément CONCRET (produit, actualité, valeur)
3. Paragraphe 2 (VALEUR) : Ce que tu apportes. 2-3 réalisations chiffrées qui matchent les besoins du poste. Pas de répétition du CV — du CONTEXTE et de la PERSONNALITÉ
4. Paragraphe 3 (PROJECTION) : Ce que tu veux accomplir dans ce rôle. Vision concrète, pas du vague
5. Conclusion : Call to action confiant. Propose un échange, pas une "éventuelle rencontre"
6. Ton : professionnel, confiant, direct. Pas obséquieux. Pas arrogant. HUMAIN
7. 250-350 mots max
8. Dans la MÊME LANGUE que l'offre

Génère la lettre complète, prête à envoyer.`;
}

// ━━━ PRÉPARATION ENTRETIEN (payante — Opus 4.7) ━━━

export function buildInterviewPrepPrompt(jobDescription: string, profile: Profile): string {
  const region = detectRegion(jobDescription, profile);

  const interviewContext = region === "belgium"
    ? "En Belgique, les entretiens testent la motivation, le fit culturel et les LANGUES. Prépare des réponses en français ET préviens que le recruteur peut switcher en néerlandais ou anglais en plein entretien."
    : "En France, les entretiens combinent questions techniques, motivation ('Pourquoi cette entreprise ?') et mises en situation. Le fit culturel est important.";

  return `${RECRUITER_INTELLIGENCE_CONTEXT}

${interviewContext}

OFFRE D'EMPLOI :
${jobDescription}

PROFIL DU CANDIDAT :
- Titre : ${profile.headline || ""}
- Expérience : ${profile.experience || ""}
- Compétences : ${profile.skills || ""}
- Langues : ${profile.languages || ""}

Génère les 10 questions les plus probables pour cet entretien.

Pour chaque réponse :
- Utilise la méthode STAR (Situation, Tâche, Action, Résultat)
- Inclus des CHIFFRES et résultats concrets tirés du profil
- Adapte au style d'entretien ${region === "belgium" ? "belge" : "français"}
- 100-200 mots par réponse, pas plus

Réponds UNIQUEMENT en JSON valide, sans markdown :
{
  "questions": [
    {
      "question": "la question en français",
      "why_they_ask": "ce que le recruteur évalue vraiment (1 phrase)",
      "optimal_answer": "réponse STAR personnalisée avec chiffres du profil"
    }
  ]
}`;
}

// ━━━ LINKEDIN (payante — Opus 4.7) ━━━

export function buildLinkedInTipsPrompt(jobDescription: string, profile: Profile): string {
  return `Tu es un expert LinkedIn spécialisé dans le marché français et belge.

OFFRE D'EMPLOI :
${jobDescription}

PROFIL ACTUEL :
- Titre : ${profile.headline || "Non renseigné"}
- Compétences : ${profile.skills || "Non renseigné"}
- Langues : ${profile.languages || "Non renseigné"}
- Localisation : ${profile.location || "Non renseigné"}

Génère :
1. Un HEADLINE LinkedIn optimisé (max 120 caractères) — dans la langue du marché cible. Si bilingue, headline bilingue.
2. Un résumé "À propos" optimisé (max 250 mots) — mots-clés du secteur, ton professionnel mais humain
3. 5 compétences LinkedIn SPÉCIFIQUES à ajouter (pas de "Communication" ou "Team Player" — des compétences que les recruteurs CHERCHENT vraiment)
4. 3 actions concrètes pour augmenter la visibilité auprès des recruteurs FR/BE cette semaine

Format texte structuré avec des sections claires.`;
}

// ━━━ CV STRUCTURÉ JSON (pour templates visuels) ━━━

export function buildStructuredCVPrompt(jobDescription: string, profile: Profile): string {
  const region = detectRegion(jobDescription, profile);
  const regionContext = getRegionContext(region);

  return `${RECRUITER_INTELLIGENCE_CONTEXT}

${regionContext}

Génère un CV STRUCTURÉ en JSON pour cette offre. Ce JSON sera utilisé pour remplir un template visuel professionnel.

OFFRE D'EMPLOI :
${jobDescription}

PROFIL DU CANDIDAT :
- Nom : ${profile.full_name}
- Email : ${profile.email}
- Titre : ${profile.headline || ""}
- Expérience : ${profile.experience || ""}
- Formation : ${profile.education || ""}
- Compétences : ${profile.skills || ""}
- Langues : ${profile.languages || ""}
- Localisation : ${profile.location || ""}
- LinkedIn : ${profile.linkedin_url || ""}

RÈGLES :
1. Chaque bullet point d'expérience DOIT contenir un CHIFFRE ou RÉSULTAT MESURABLE
2. Utilise les MOTS-CLÉS EXACTS de l'offre pour l'ATS
3. Le summary fait 2-3 phrases MAX : qui tu es + spécialité + meilleur résultat
4. Skills : liste les compétences qui matchent l'offre EN PREMIER
5. Langues avec niveaux CECR
6. Si le profil manque de chiffres, invente des métriques RÉALISTES et CRÉDIBLES
7. 3-4 bullet points par expérience, orientés résultats

Réponds UNIQUEMENT en JSON valide, sans markdown :
{
  "full_name": "${profile.full_name}",
  "headline": "Titre professionnel optimisé pour ce poste",
  "location": "${profile.location || ""}",
  "email": "${profile.email}",
  "linkedin": "${profile.linkedin_url || ""}",
  "summary": "Résumé professionnel de 2-3 phrases percutantes",
  "experiences": [
    {
      "title": "Titre du poste",
      "company": "Entreprise",
      "location": "Ville",
      "dates": "Janv. 2022 — Présent",
      "bullets": [
        "Bullet point avec chiffre et résultat mesurable",
        "Bullet point avec impact business"
      ]
    }
  ],
  "education": [
    {
      "degree": "Diplôme",
      "school": "École/Université",
      "dates": "2018 — 2022",
      "details": "Mention ou spécialisation si pertinent"
    }
  ],
  "skills": ["Compétence 1", "Compétence 2"],
  "languages": [
    {"language": "Français", "level": "Natif"},
    {"language": "Anglais", "level": "C1"}
  ],
  "certifications": ["Certification si applicable"]
}`;
}
