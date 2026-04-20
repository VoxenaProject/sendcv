"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

// ━━━ Types ━━━
interface Experience { title: string; company: string; dates: string; description: string; }
interface Education { degree: string; school: string; dates: string; }
interface Language { language: string; level: string; }

const CECR_LEVELS = ["Natif", "C2", "C1", "B2", "B1", "A2", "A1"];
const COMMON_LANGUAGES = ["Français", "Anglais", "Néerlandais", "Allemand", "Espagnol", "Italien", "Portugais", "Arabe", "Turc", "Polonais", "Russe", "Chinois"];

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  "Tech": ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "Git", "Docker", "AWS", "API REST", "CI/CD", "Agile/Scrum"],
  "Marketing": ["SEO", "Google Ads", "Meta Ads", "Content Marketing", "Email Marketing", "Analytics", "CRM", "Copywriting", "Social Media", "Branding"],
  "Finance": ["Excel avancé", "Analyse financière", "Comptabilité", "SAP", "Power BI", "Audit", "Contrôle de gestion", "Reporting", "IFRS", "Budget"],
  "RH": ["Recrutement", "Gestion des talents", "Droit social", "Paie", "Formation", "GPEC", "Entretiens", "Onboarding", "SIRH", "Relations sociales"],
  "Design": ["Figma", "Adobe Creative Suite", "UI Design", "UX Research", "Prototypage", "Design System", "Webflow", "Illustration", "Motion Design"],
  "Commercial": ["Prospection", "Négociation", "CRM Salesforce", "Closing", "B2B", "B2C", "Account Management", "Pipeline", "KPI", "Relation client"],
  "Général": ["Gestion de projet", "Communication", "Leadership", "Problem-solving", "Travail en équipe", "Autonomie", "Adaptabilité", "Organisation"],
};

const STEPS = [
  { key: "welcome", title: "Bienvenue sur SendCV", subtitle: "Configure ton profil en 2 minutes.", icon: "👋" },
  { key: "identity", title: "Qui es-tu ?", subtitle: "Ton identité professionnelle.", icon: "👤" },
  { key: "experience", title: "Ton parcours", subtitle: "Ajoute tes expériences. L'IA les optimisera.", icon: "💼" },
  { key: "education", title: "Ta formation", subtitle: "Diplômes et certifications.", icon: "🎓" },
  { key: "skills", title: "Tes compétences", subtitle: "Sélectionne ou ajoute tes skills.", icon: "⚡" },
  { key: "languages", title: "Tes langues", subtitle: "Crucial en Belgique et pour les postes internationaux.", icon: "🌍" },
  { key: "ready", title: "Tu es prêt !", subtitle: "Lance ta première candidature.", icon: "🚀" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setHeadline((data as { headline: string | null }).headline || "");
        setLocation((data as { location: string | null }).location || "");
      }
    }
    load();
  }, []);

  function addExperience() { setExperiences([...experiences, { title: "", company: "", dates: "", description: "" }]); }
  function updateExp(i: number, field: keyof Experience, val: string) { const copy = [...experiences]; copy[i] = { ...copy[i], [field]: val }; setExperiences(copy); }
  function removeExp(i: number) { setExperiences(experiences.filter((_, j) => j !== i)); }

  function addEducation() { setEducations([...educations, { degree: "", school: "", dates: "" }]); }
  function updateEdu(i: number, field: keyof Education, val: string) { const copy = [...educations]; copy[i] = { ...copy[i], [field]: val }; setEducations(copy); }
  function removeEdu(i: number) { setEducations(educations.filter((_, j) => j !== i)); }

  function toggleSkill(s: string) { skills.includes(s) ? setSkills(skills.filter((x) => x !== s)) : setSkills([...skills, s]); }
  function addCustomSkill() { if (customSkill.trim() && !skills.includes(customSkill.trim())) { setSkills([...skills, customSkill.trim()]); setCustomSkill(""); } }

  function addLanguage(lang: string) { if (!languages.find((l) => l.language === lang)) setLanguages([...languages, { language: lang, level: "B2" }]); }
  function updateLangLevel(i: number, level: string) { const copy = [...languages]; copy[i] = { ...copy[i], level }; setLanguages(copy); }
  function removeLang(i: number) { setLanguages(languages.filter((_, j) => j !== i)); }

  async function handleFinish() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const expText = experiences.map((e) => `${e.title} chez ${e.company} (${e.dates})\n${e.description}`).join("\n\n");
    const eduText = educations.map((e) => `${e.degree}, ${e.school} (${e.dates})`).join("\n");
    const skillsText = skills.join(", ");
    const langsText = languages.map((l) => `${l.language} (${l.level})`).join(", ");

    await supabase.from("profiles").update({
      headline, location,
      experience: expText || null,
      education: eduText || null,
      skills: skillsText || null,
      languages: langsText || null,
    }).eq("id", user.id);

    router.push("/onboarding/preview");
    router.refresh();
  }

  function next() { if (step < STEPS.length - 1) setStep(step + 1); }
  function prev() { if (step > 0) setStep(step - 1); }

  const progress = ((step + 1) / STEPS.length) * 100;
  const s = STEPS[step];

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Étape {step + 1}/{STEPS.length}</span>
          <span className="text-xs font-bold text-indigo-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div className="h-full bg-indigo-600 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <span className="text-4xl">{s.icon}</span>
            <h1 className="text-2xl font-extrabold mt-3">{s.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{s.subtitle}</p>
          </div>

          {/* ━━━ Step 0: Welcome ━━━ */}
          {step === 0 && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "📄", t: "CV sur-mesure", d: "Optimisé ATS + Recruteur" },
                { icon: "✉️", t: "Lettre de motivation", d: "Personnalisée par offre" },
                { icon: "🎯", t: "Préparation entretien", d: "10 questions + réponses" },
                { icon: "📊", t: "Double scoring", d: "ATS + Recruteur" },
              ].map((f, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <span className="text-xl">{f.icon}</span>
                  <p className="text-xs font-bold mt-1">{f.t}</p>
                  <p className="text-[10px] text-gray-400">{f.d}</p>
                </div>
              ))}
            </div>
          )}

          {/* ━━━ Step 1: Identity ━━━ */}
          {step === 1 && (
            <div className="space-y-4">
              <Input label="Titre professionnel" value={headline} onChange={setHeadline} placeholder="Ex: Développeur Full-Stack Senior" hint="Ce qui apparaît en haut de ton CV." />
              <Input label="Localisation" value={location} onChange={setLocation} placeholder="Ex: Bruxelles, Belgique" hint="Pour adapter aux conventions locales." />
            </div>
          )}

          {/* ━━━ Step 2: Experience ━━━ */}
          {step === 2 && (
            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3 relative">
                  <button onClick={() => removeExp(i)} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-xs cursor-pointer">✕</button>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Poste" value={exp.title} onChange={(v) => updateExp(i, "title", v)} placeholder="Ex: Full-Stack Developer" small />
                    <Input label="Entreprise" value={exp.company} onChange={(v) => updateExp(i, "company", v)} placeholder="Ex: TechCorp" small />
                  </div>
                  <Input label="Période" value={exp.dates} onChange={(v) => updateExp(i, "dates", v)} placeholder="Ex: Janv. 2022 — Présent" small />
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Ce que tu as fait</label>
                    <textarea value={exp.description} onChange={(e) => updateExp(i, "description", e.target.value)} rows={3}
                      placeholder="Décris tes réalisations. L'IA ajoutera les chiffres d'impact."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none" />
                  </div>
                </div>
              ))}
              <button onClick={addExperience} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer font-medium">
                + Ajouter une expérience
              </button>
              {experiences.length === 0 && <p className="text-xs text-gray-400 text-center">Ajoute au moins une expérience pour des résultats optimaux.</p>}
            </div>
          )}

          {/* ━━━ Step 3: Education ━━━ */}
          {step === 3 && (
            <div className="space-y-4">
              {educations.map((edu, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3 relative">
                  <button onClick={() => removeEdu(i)} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-xs cursor-pointer">✕</button>
                  <Input label="Diplôme" value={edu.degree} onChange={(v) => updateEdu(i, "degree", v)} placeholder="Ex: Master en Informatique" small />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="École / Université" value={edu.school} onChange={(v) => updateEdu(i, "school", v)} placeholder="Ex: ULB" small />
                    <Input label="Années" value={edu.dates} onChange={(v) => updateEdu(i, "dates", v)} placeholder="Ex: 2017 — 2019" small />
                  </div>
                </div>
              ))}
              <button onClick={addEducation} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer font-medium">
                + Ajouter une formation
              </button>
            </div>
          )}

          {/* ━━━ Step 4: Skills ━━━ */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Selected skills */}
              {skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Sélectionnées ({skills.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <button key={s} onClick={() => toggleSkill(s)} className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-medium cursor-pointer hover:bg-indigo-700 transition-colors flex items-center gap-1">
                        {s} <span className="text-indigo-300">✕</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom skill input */}
              <div className="flex gap-2">
                <input value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                  placeholder="Ajouter une compétence..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                <button onClick={addCustomSkill} className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 cursor-pointer">Ajouter</button>
              </div>

              {/* Suggestions by category */}
              {Object.entries(SKILL_SUGGESTIONS).map(([cat, suggestions]) => (
                <div key={cat}>
                  <p className="text-xs font-semibold text-gray-400 mb-2">{cat}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s) => (
                      <button key={s} onClick={() => toggleSkill(s)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                          skills.includes(s)
                            ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                            : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                        }`}
                      >
                        {skills.includes(s) ? "✓ " : ""}{s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ━━━ Step 5: Languages ━━━ */}
          {step === 5 && (
            <div className="space-y-5">
              {/* Selected languages with level */}
              {languages.length > 0 && (
                <div className="space-y-2">
                  {languages.map((l, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200">
                      <span className="text-sm font-semibold flex-1">{l.language}</span>
                      <select value={l.level} onChange={(e) => updateLangLevel(i, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
                        {CECR_LEVELS.map((lv) => <option key={lv} value={lv}>{lv}</option>)}
                      </select>
                      <button onClick={() => removeLang(i)} className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-xs cursor-pointer">✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Language picker */}
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2">Ajouter une langue</p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_LANGUAGES.filter((l) => !languages.find((x) => x.language === l)).map((lang) => (
                    <button key={lang} onClick={() => addLanguage(lang)}
                      className="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 text-xs font-medium border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-all">
                      + {lang}
                    </button>
                  ))}
                </div>
              </div>

              {languages.length === 0 && <p className="text-xs text-gray-400 text-center">Les langues sont cruciales pour le marché belge et les postes internationaux.</p>}
            </div>
          )}

          {/* ━━━ Step 6: Ready ━━━ */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="grid grid-cols-2 gap-3">
                  <Check label="Titre" done={!!headline} />
                  <Check label="Localisation" done={!!location} />
                  <Check label="Expérience" done={experiences.length > 0} detail={`${experiences.length} poste${experiences.length > 1 ? "s" : ""}`} />
                  <Check label="Formation" done={educations.length > 0} detail={`${educations.length} diplôme${educations.length > 1 ? "s" : ""}`} />
                  <Check label="Compétences" done={skills.length > 0} detail={`${skills.length} skill${skills.length > 1 ? "s" : ""}`} />
                  <Check label="Langues" done={languages.length > 0} detail={`${languages.length} langue${languages.length > 1 ? "s" : ""}`} />
                </div>
              </div>
              {experiences.length === 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
                  <strong>Conseil :</strong> Ajoute au moins une expérience pour des CV personnalisés.
                  <button onClick={() => setStep(2)} className="block text-amber-600 font-medium mt-1 hover:underline cursor-pointer text-xs">← Retour au parcours</button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        {step > 0 ? (
          <button onClick={prev} className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">← Retour</button>
        ) : <div />}

        {step < STEPS.length - 1 ? (
          <button onClick={next} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-600/15">
            {step === 0 ? "C'est parti →" : "Suivant →"}
          </button>
        ) : (
          <button onClick={handleFinish} disabled={saving} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-600/15 disabled:opacity-50">
            {saving ? "Sauvegarde..." : "Lancer ma première candidature →"}
          </button>
        )}
      </div>

      {step > 0 && step < STEPS.length - 1 && (
        <p className="text-center mt-4"><button onClick={next} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">Passer</button></p>
      )}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, hint, small }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; small?: boolean;
}) {
  return (
    <div>
      <label className={`block font-semibold text-gray-700 mb-1 ${small ? "text-xs" : "text-sm"}`}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-3 ${small ? "py-2 text-xs" : "py-2.5 text-sm"} rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`} />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Check({ label, done, detail }: { label: string; done: boolean; detail?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${done ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"}`}>
        {done ? "✓" : "·"}
      </div>
      <div>
        <span className={`text-sm ${done ? "text-emerald-700 font-medium" : "text-gray-400"}`}>{label}</span>
        {done && detail && <span className="text-[10px] text-emerald-500 ml-1">({detail})</span>}
      </div>
    </div>
  );
}
