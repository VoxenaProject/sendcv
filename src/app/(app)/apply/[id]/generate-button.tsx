"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  "Analyse du profil...",
  "Génération du CV sur-mesure...",
  "Rédaction de la lettre de motivation...",
  "Préparation des questions d'entretien...",
  "Optimisation LinkedIn...",
  "Finalisation...",
];

export function GenerateButton({ applicationId }: { applicationId: string }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setStep(0);

    // Simulate step progression
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 5000);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
    });

    clearInterval(interval);
    const data = await response.json();

    if (!response.ok) {
      if (data.code === "NO_CREDITS" || data.code === "UPGRADE_REQUIRED") { router.push("/pricing"); return; }
      if (data.code === "PROFILE_INCOMPLETE") { router.push("/settings"); return; }
      setError(data.error || "Erreur lors de la génération");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  if (loading) {
    return (
      <div className="space-y-3 py-2">
        <div className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium text-primary">{STEPS[step]}</span>
        </div>
        <div className="w-full bg-border rounded-full h-1.5 max-w-xs mx-auto">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-1000"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted text-center">Claude Opus 4.7 travaille pour vous. ~30-60 secondes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleGenerate}
        className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        Générer ma candidature (1 crédit)
      </button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
