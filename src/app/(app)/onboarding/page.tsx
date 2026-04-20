"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { key: "welcome", title: "Bienvenue sur SendCV", subtitle: "Configurons ton profil pour générer des candidatures personnalisées.", icon: "👋" },
  { key: "identity", title: "Qui es-tu ?", subtitle: "Ton identité professionnelle.", icon: "👤" },
  { key: "experience", title: "Ton expérience", subtitle: "L'IA s'en sert pour rédiger ton CV.", icon: "💼" },
  { key: "skills", title: "Compétences & langues", subtitle: "Ce qui te différencie.", icon: "⚡" },
  { key: "ready", title: "Tu es prêt !", subtitle: "Ton profil est complet. Lance ta première candidature.", icon: "🚀" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    headline: "", experience: "", education: "", skills: "", languages: "", location: "",
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Charger le profil existant
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("headline, experience, education, skills, languages, location").eq("id", user.id).single();
      if (data) {
        setForm({
          headline: data.headline || "",
          experience: data.experience || "",
          education: data.education || "",
          skills: data.skills || "",
          languages: data.languages || "",
          location: data.location || "",
        });
      }
    }
    load();
  }, []);

  async function handleFinish() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update(form).eq("id", user.id);
    router.push("/dashboard");
    router.refresh();
  }

  function next() { if (step < STEPS.length - 1) setStep(step + 1); }
  function prev() { if (step > 0) setStep(step - 1); }
  function update(key: string, val: string) { setForm({ ...form, [key]: val }); }

  const progress = ((step + 1) / STEPS.length) * 100;
  const s = STEPS[step];

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Étape {step + 1}/{STEPS.length}</span>
          <span className="text-xs font-bold text-indigo-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-600 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <span className="text-4xl">{s.icon}</span>
            <h1 className="text-2xl font-extrabold mt-3">{s.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{s.subtitle}</p>
          </div>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="space-y-4">
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
              <p className="text-xs text-gray-400 text-center">Complète ton profil en 2 minutes pour des résultats personnalisés.</p>
            </div>
          )}

          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="space-y-4">
              <Field label="Titre professionnel" value={form.headline} onChange={(v) => update("headline", v)}
                placeholder="Ex: Développeur Full-Stack Senior, Marketing Manager, Data Analyst" hint="Ce qui apparaîtra en haut de ton CV" />
              <Field label="Localisation" value={form.location} onChange={(v) => update("location", v)}
                placeholder="Ex: Bruxelles, Belgique" hint="Pour adapter le CV aux conventions locales" />
            </div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <div className="space-y-4">
              <Field label="Expérience professionnelle" value={form.experience} onChange={(v) => update("experience", v)} multiline
                placeholder={"Décris tes expériences pro. L'IA les reformulera avec des chiffres et de l'impact.\n\nEx:\n- Full-Stack Developer chez TechCorp (2022-présent)\n  Développement React/Node.js, migration infra, mentoring juniors\n\n- Développeuse Web chez StartupBE (2019-2021)\n  Plateforme SaaS, optimisation performance, tests automatisés"}
                hint="Plus c'est détaillé, meilleur sera le CV. L'IA ajoutera les chiffres d'impact." />
              <Field label="Formation" value={form.education} onChange={(v) => update("education", v)} multiline
                placeholder={"Ex:\n- Master Informatique, ULB (2017-2019)\n- Bachelier Sciences Info, ULiège (2014-2017)"}
                hint="Diplômes, certifications, formations continues" />
            </div>
          )}

          {/* Step 3: Skills & Languages */}
          {step === 3 && (
            <div className="space-y-4">
              <Field label="Compétences" value={form.skills} onChange={(v) => update("skills", v)} multiline
                placeholder={"Tes compétences techniques et soft skills.\n\nEx: React, Node.js, TypeScript, PostgreSQL, Docker, AWS, Agile/Scrum, Leadership, Communication"}
                hint="Sépare par des virgules. L'IA sélectionnera les plus pertinentes par offre." />
              <Field label="Langues (avec niveau CECR)" value={form.languages} onChange={(v) => update("languages", v)}
                placeholder="Ex: Français (natif), Anglais (C1), Néerlandais (B1)"
                hint="Crucial en Belgique et pour les postes internationaux. Utilise les niveaux CECR (A1-C2)." />
            </div>
          )}

          {/* Step 4: Ready */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Check label="Titre" done={!!form.headline} />
                  <Check label="Localisation" done={!!form.location} />
                  <Check label="Expérience" done={!!form.experience} />
                  <Check label="Formation" done={!!form.education} />
                  <Check label="Compétences" done={!!form.skills} />
                  <Check label="Langues" done={!!form.languages} />
                </div>
              </div>
              {!form.experience && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
                  <strong>Conseil :</strong> Ajoute au moins ton expérience pour des résultats optimaux.
                  <button onClick={() => setStep(2)} className="block text-amber-600 font-medium mt-1 hover:underline cursor-pointer text-xs">← Retour à l&apos;expérience</button>
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
          <button onClick={next}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-600/15">
            {step === 0 ? "C'est parti" : "Suivant"} →
          </button>
        ) : (
          <button onClick={handleFinish} disabled={saving}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-600/15 disabled:opacity-50">
            {saving ? "Sauvegarde..." : "Lancer ma première candidature →"}
          </button>
        )}
      </div>

      {/* Skip */}
      {step > 0 && step < STEPS.length - 1 && (
        <p className="text-center mt-4">
          <button onClick={next} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">Passer cette étape</button>
        </p>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, hint, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; multiline?: boolean;
}) {
  const cls = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white";
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={6} placeholder={placeholder} className={cls + " resize-none"} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
      {hint && <p className="text-[11px] text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

function Check({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${done ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"}`}>
        {done ? "✓" : "·"}
      </div>
      <span className={`text-sm ${done ? "text-emerald-700 font-medium" : "text-gray-400"}`}>{label}</span>
    </div>
  );
}
