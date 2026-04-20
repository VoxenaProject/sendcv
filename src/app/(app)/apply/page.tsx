"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyPage() {
  const [jobInput, setJobInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!jobInput.trim()) return;
    setLoading(true);
    setError(null);

    const isUrl = jobInput.trim().startsWith("http");

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobDescription: isUrl ? `Offre d'emploi disponible a: ${jobInput.trim()}` : jobInput.trim(),
        jobUrl: isUrl ? jobInput.trim() : null,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Erreur lors de l'analyse");
      setLoading(false);
      return;
    }

    router.push(`/apply/${data.application.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black">Nouvelle candidature</h1>
        <p className="text-sm text-muted mt-1">Collez la description de l&apos;offre d&apos;emploi. L&apos;analyse est gratuite.</p>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Description de l&apos;offre</label>
          <textarea
            value={jobInput}
            onChange={(e) => setJobInput(e.target.value)}
            rows={12}
            required
            className="w-full px-4 py-3 rounded-xl border border-border text-sm leading-relaxed focus:outline-none focus:border-primary transition-colors resize-none"
            placeholder={"Collez ici la description complete de l'offre d'emploi.\n\nOu collez directement l'URL de l'offre (Indeed, LinkedIn, etc.).\n\nPlus la description est complete, meilleure sera l'analyse."}
          />
        </div>

        {error && <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">{error}</p>}

        <button
          type="submit"
          disabled={loading || !jobInput.trim()}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Analyse en cours...
            </span>
          ) : (
            "Analyser l'offre (gratuit)"
          )}
        </button>

        <p className="text-xs text-center text-muted">
          L&apos;analyse est 100% gratuite. Vous ne payez que si vous generez la candidature complete.
        </p>
      </form>
    </div>
  );
}
