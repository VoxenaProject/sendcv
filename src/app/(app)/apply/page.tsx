"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const TIPS = [
  "Colle la description complète, pas juste le titre",
  "Plus l'offre est détaillée, meilleure sera l'analyse",
  "Les mots-clés de l'offre seront utilisés pour l'ATS",
];

const ANALYSIS_STEPS = [
  { text: "Extraction des mots-clés...", icon: "🔍" },
  { text: "Calcul du match score...", icon: "📊" },
  { text: "Analyse recruteur...", icon: "🧠" },
  { text: "Estimation salariale...", icon: "💰" },
];

export default function ApplyPage() {
  const [jobInput, setJobInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!jobInput.trim()) return;
    setLoading(true);
    setError(null);
    setLoadingStep(0);

    // Step animation
    const interval = setInterval(() => setLoadingStep((s) => Math.min(s + 1, ANALYSIS_STEPS.length - 1)), 1500);

    const isUrl = jobInput.trim().startsWith("http");
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobDescription: isUrl ? `Offre d'emploi disponible à: ${jobInput.trim()}` : jobInput.trim(),
        jobUrl: isUrl ? jobInput.trim() : null,
      }),
    });

    clearInterval(interval);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Erreur lors de l'analyse");
      setLoading(false);
      return;
    }

    router.push(`/apply/${data.application.id}`);
  }

  const charCount = jobInput.length;
  const isReady = charCount >= 50;

  return (
    <div className="max-w-2xl mx-auto">
      {!loading ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h1 className="text-2xl font-extrabold">Nouvelle candidature</h1>
            <p className="text-sm text-gray-400 mt-1">Colle la description de l&apos;offre. L&apos;analyse est <strong className="text-indigo-600">gratuite</strong>.</p>
          </div>

          {/* Input */}
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="relative">
              <textarea
                value={jobInput}
                onChange={(e) => setJobInput(e.target.value)}
                rows={10}
                required
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none bg-white"
                placeholder={"Colle ici la description complète de l'offre d'emploi.\n\nExemple :\n\"Nous recherchons un Développeur Full-Stack Senior pour rejoindre notre équipe à Bruxelles. CDI, 3-5 ans d'expérience, React/Node.js...\"\n\nPlus c'est complet, meilleure sera l'analyse."}
              />
              <div className="absolute bottom-3 right-4 flex items-center gap-2">
                <span className={`text-xs font-mono ${isReady ? "text-emerald-500" : "text-gray-300"}`}>{charCount}</span>
                {isReady && <span className="text-[10px] text-emerald-500 font-medium">✓ Prêt</span>}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" disabled={!isReady}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isReady
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 hover:-translate-y-0.5"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isReady ? (
                <>Analyser cette offre <span className="text-indigo-300 text-xs">(gratuit)</span></>
              ) : (
                <>Colle au moins 50 caractères pour analyser</>
              )}
            </button>
          </form>

          {/* Tips */}
          <div className="grid grid-cols-3 gap-3">
            {TIPS.map((tip, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <p className="text-[11px] text-gray-500 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>

          {/* What you'll get */}
          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">Analyse gratuite inclut</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {["Match score", "Mots-clés ATS", "Score recruteur", "Salaire estimé", "Red flags", "Compétences manquantes"].map((f) => (
                <span key={f} className="px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 font-medium">{f}</span>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        /* ━━━ Loading state ━━━ */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30"
          >
            <span className="text-3xl">🔍</span>
          </motion.div>

          <div className="text-center">
            <h2 className="text-lg font-extrabold">Analyse en cours...</h2>
            <p className="text-xs text-gray-400 mt-1">Powered by Claude Opus 4.7</p>
          </div>

          <div className="space-y-3 w-full max-w-xs">
            {ANALYSIS_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={loadingStep >= i ? { opacity: 1 } : {}}
                className="flex items-center gap-3"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                  loadingStep > i ? "bg-emerald-100 text-emerald-600" : loadingStep === i ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {loadingStep > i ? "✓" : step.icon}
                </div>
                <span className={`text-sm ${loadingStep >= i ? "text-gray-800 font-medium" : "text-gray-400"}`}>{step.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
