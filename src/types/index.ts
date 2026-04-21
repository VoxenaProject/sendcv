export interface Profile {
  id: string;
  email: string;
  full_name: string;
  credits: number;
  plan: PlanType;
  free_generation_used: boolean;
  generation_count: number;
  headline: string | null;
  experience: string | null;
  education: string | null;
  skills: string | null;
  languages: string | null;
  location: string | null;
  linkedin_url: string | null;
  stripe_customer_id: string | null;
  subscription_id: string | null;
  subscription_status: string | null;
  created_at: string;
  updated_at: string;
}

// ━━━ Analyse enrichie (gratuite) ━━━

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: "critical" | "important" | "nice_to_have";
}

export interface ATSBreakdown {
  keywords_score: number;     // 0-100 : mots-clés matchés
  format_score: number;       // 0-100 : structure ATS-compatible
  completeness_score: number; // 0-100 : toutes les sections présentes
  overall: number;            // 0-100 : score global ATS
}

export interface RecruiterScore {
  impact_score: number;       // 0-100 : bullet points avec métriques chiffrées
  specificity_score: number;  // 0-100 : résultats concrets vs descriptions vagues
  seniority_score: number;    // 0-100 : langage de séniorité adapté au poste
  relevance_score: number;    // 0-100 : pertinence de l'expérience pour CE poste
  overall: number;            // 0-100 : score global recruteur
}

export interface RecruiterInsight {
  first_impression: string[];   // 3 éléments que le recruteur verra en premier
  weaknesses: string[];         // Points faibles à compenser en entretien
  salary_advice: string;        // Conseil de négociation salariale
  hiring_probability: number;   // 0-100 : prédiction de chance d'entretien
}

export interface JobAnalysis {
  title: string;
  company: string;
  location: string;
  country: string;
  salary_estimate: string;
  key_requirements: string[];
  nice_to_have: string[];
  red_flags: string[];
  culture_indicators: string[];
  match_score: number;
  missing_skills: string[];
  strong_matches: string[];
  language_requirements: string[];
  language_match?: boolean;
  // Recruiter Intelligence (moat)
  keyword_matches: KeywordMatch[];
  ats_breakdown: ATSBreakdown;
  recruiter_score: RecruiterScore;
  recruiter_insights: RecruiterInsight;
}

// ━━━ CV structuré (pour templates) ━━━

export interface CVExperience {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface CVEducation {
  degree: string;
  school: string;
  dates: string;
  details?: string;
}

export interface CVLanguage {
  language: string;
  level: string;
}

export interface StructuredCV {
  full_name: string;
  headline: string;
  location: string;
  email: string;
  phone?: string;
  linkedin?: string;
  summary: string;
  experiences: CVExperience[];
  education: CVEducation[];
  skills: string[];
  languages: CVLanguage[];
  certifications?: string[];
}

export type CVTemplate = "classique" | "moderne" | "compact" | "creatif";

// ━━━ Génération (payante) ━━━

export interface InterviewQuestion {
  question: string;
  why_they_ask: string;
  optimal_answer: string;
}

export interface Application {
  id: string;
  user_id: string;
  job_url: string | null;
  job_title: string;
  company_name: string;
  job_description: string;
  analysis: JobAnalysis | null;
  match_score: number | null;
  generated_cv: string | null;
  structured_cv: StructuredCV | null;
  generated_cover_letter: string | null;
  generated_interview_prep: InterviewQuestion[] | null;
  generated_linkedin_tips: string | null;
  status: "analyzed" | "generated" | "applied" | "interview" | "rejected" | "hired";
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "purchase" | "usage" | "refund" | "bonus";
  description: string | null;
  stripe_session_id: string | null;
  created_at: string;
}

// ━━━ Subscription model ━━━

export type PlanType = "free" | "pro" | "lifetime";

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceDisplay: "0€",
    description: "3 candidatures gratuites pour tester",
    maxGenerations: 3,
    maxSimulations: 1,
    features: ["Analyses illimitées", "3 générations complètes", "1 simulation d'entretien", "50 templates CV", "Export PDF", "Double scoring ATS + Recruteur"],
  },
  pro: {
    name: "Pro",
    price: 1900,
    priceDisplay: "19€/mois",
    description: "Tout illimité",
    maxGenerations: Infinity,
    maxSimulations: Infinity,
    features: ["Générations illimitées", "Simulations d'entretien illimitées", "Coach IA — Analyse de refus", "50 templates × 5 couleurs", "Export PDF illimité", "Support prioritaire"],
  },
  lifetime: {
    name: "Lifetime",
    price: 7900,
    priceDisplay: "79€",
    description: "Tout illimité, pour toujours",
    maxGenerations: Infinity,
    maxSimulations: Infinity,
    features: ["Tout ce que Pro inclut", "Paiement unique", "Accès à vie", "Futures fonctionnalités incluses"],
  },
} as const;
