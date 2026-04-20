"use client";

import { useState } from "react";
import { CREDIT_PACKS, type PackKey } from "@/types";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleBuy(pack: PackKey) {
    setLoading(pack);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pack }),
    });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
    else setLoading(null);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Crédits</p>
        <h1 className="text-3xl font-extrabold">Un cabinet facture 500€ par candidature.</h1>
        <p className="text-gray-500 mt-2 text-lg">Toi tu paies à partir de <strong className="text-gray-900">3,30€</strong>.</p>
      </div>

      {/* What 1 credit gives */}
      <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
        <p className="font-bold text-sm text-indigo-800 text-center mb-3">1 crédit = 1 candidature complète</p>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-indigo-700">
          <span className="bg-white px-3 py-1.5 rounded-full border border-indigo-100">📄 CV sur-mesure ATS</span>
          <span className="bg-white px-3 py-1.5 rounded-full border border-indigo-100">✉️ Lettre de motivation</span>
          <span className="bg-white px-3 py-1.5 rounded-full border border-indigo-100">🎯 10 questions d&apos;entretien</span>
          <span className="bg-white px-3 py-1.5 rounded-full border border-indigo-100">🔗 Tips LinkedIn</span>
          <span className="bg-white px-3 py-1.5 rounded-full border border-indigo-100">📊 Double score ATS + Recruteur</span>
          <span className="bg-white px-3 py-1.5 rounded-full border border-indigo-100">📥 PDF téléchargeable</span>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {(Object.entries(CREDIT_PACKS) as [PackKey, typeof CREDIT_PACKS[PackKey]][]).map(([key, pack]) => {
          const isPopular = key === "pro";
          const perCredit = (pack.price / 100 / pack.credits).toFixed(2);
          return (
            <div key={key} className={`rounded-2xl p-7 text-center relative ${
              isPopular
                ? "border-2 border-indigo-600 bg-white shadow-xl shadow-indigo-600/10 md:scale-[1.04]"
                : "border border-gray-200 bg-white"
            }`}>
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-full">
                  Le + populaire
                </div>
              )}
              <p className={`font-semibold text-lg ${isPopular ? "text-indigo-600" : "text-gray-500"}`}>{pack.label}</p>

              <div className="mt-4 mb-1">
                <span className="text-5xl font-extrabold">{pack.priceDisplay.replace("€", "")}</span>
                <span className="text-xl font-bold text-gray-400">€</span>
              </div>
              <p className="text-sm text-gray-500"><strong className="text-gray-800">{pack.credits}</strong> candidatures complètes</p>
              <p className={`text-xs font-semibold mt-1 ${isPopular ? "text-indigo-600" : "text-gray-400"}`}>{perCredit}€ par candidature</p>

              {key === "ultra" && (
                <div className="mt-3 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                  Meilleur rapport qualité/prix
                </div>
              )}

              <button
                onClick={() => handleBuy(key)}
                disabled={loading === key}
                className={`mt-5 block w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:opacity-50 ${
                  isPopular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/15"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {loading === key ? "Redirection vers Stripe..." : `Acheter ${pack.label}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Guarantee */}
      <div className="text-center p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">🛡️</span>
          <p className="font-bold text-emerald-800">Garantie Entretien 30 Jours</p>
        </div>
        <p className="text-sm text-emerald-700">
          10+ candidatures envoyées, zéro entretien en 30 jours ? Remboursement complet, sans question.
        </p>
      </div>

      {/* Comparison */}
      <div className="text-center space-y-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Comparaison</p>
        <div className="grid grid-cols-3 gap-4 text-sm max-w-xl mx-auto">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-2xl font-extrabold text-gray-300">~29€</p>
            <p className="text-xs text-gray-400 mt-1">Rezi / mois</p>
            <p className="text-[10px] text-gray-400">CV seul, pas de lettre</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-2xl font-extrabold text-gray-300">~50€</p>
            <p className="text-xs text-gray-400 mt-1">Jobscan / mois</p>
            <p className="text-[10px] text-gray-400">Score ATS seul</p>
          </div>
          <div className="p-4 rounded-xl bg-indigo-50 border-2 border-indigo-200">
            <p className="text-2xl font-extrabold text-indigo-600">4,90€</p>
            <p className="text-xs text-indigo-600 font-semibold mt-1">SendCV.ai</p>
            <p className="text-[10px] text-indigo-500">Tout compris, par candidature</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4 max-w-xl mx-auto">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold text-center">Questions sur les crédits</p>
        {[
          { q: "Mes crédits expirent ?", a: "Non. Tes crédits n'ont pas de date d'expiration. Utilise-les quand tu veux." },
          { q: "C'est un abonnement ?", a: "Non. Paiement unique. Tu achètes un pack de crédits et tu les utilises à ton rythme." },
          { q: "Je peux me faire rembourser ?", a: "Oui. Garantie 30 jours : 10+ candidatures envoyées sans entretien = remboursement complet." },
        ].map((f, i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="font-semibold text-sm">{f.q}</p>
            <p className="text-xs text-gray-500 mt-1">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
