"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PlanType } from "@/types";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanType>("free");

  useEffect(() => { (async () => {
    const sb = createClient(); const { data: { user } } = await sb.auth.getUser(); if (!user) return;
    const { data } = await sb.from("profiles").select("plan").eq("id", user.id).single();
    if (data) setCurrentPlan((data as { plan: PlanType }).plan || "free");
  })(); }, []);

  async function handleUpgrade(plan: "pro" | "lifetime") {
    setLoading(plan);
    const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
    const data = await res.json();
    if (data.url) window.location.href = data.url; else setLoading(null);
  }

  const isPaid = currentPlan === "pro" || currentPlan === "lifetime";

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Pricing</p>
        <h1 className="text-3xl font-extrabold">Simple. Pas d&apos;embrouille.</h1>
        <p className="text-gray-500 mt-2">Analyse gratuite. 1ère génération offerte. Upgrade quand tu veux.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <PlanCard name="Free" price="0€" sub="Pour découvrir" current={currentPlan === "free"}
          features={["Analyses illimitées", "1 génération complète offerte", "10 templates CV", "Export PDF", "Double scoring ATS + Recruteur"]}
          cta={currentPlan === "free" ? <Btn disabled label="Plan actuel" /> : <Btn disabled label="Inclus" muted />}
        />
        <PlanCard name="Pro" price="19€" priceSub="/mois" sub="Tout illimité" current={currentPlan === "pro"} popular
          features={["Générations illimitées", "50 templates × 5 couleurs", "Double scoring ATS + Recruteur", "Export PDF illimité", "Recruiter Insights", "Support prioritaire"]}
          highlights={[0, 1]}
          cta={currentPlan === "pro" ? <Btn disabled label="Plan actuel ✓" active /> : <Btn onClick={() => handleUpgrade("pro")} label={loading === "pro" ? "Redirection..." : "Passer à Pro"} disabled={!!loading || isPaid} primary />}
        />
        <PlanCard name="Lifetime" price="79€" priceSub=" une fois" sub="Pour toujours" current={currentPlan === "lifetime"}
          features={["Tout ce que Pro inclut", "Paiement unique", "Accès à vie", "Futures fonctionnalités incluses", "Zéro abonnement"]}
          highlights={[0, 1, 2]}
          cta={currentPlan === "lifetime" ? <Btn disabled label="Plan actuel ✓" active /> : <Btn onClick={() => handleUpgrade("lifetime")} label={loading === "lifetime" ? "Redirection..." : "Acheter Lifetime"} disabled={!!loading} dark />}
        />
      </div>

      {/* Vs Rezi */}
      <div className="text-center space-y-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Vs la concurrence</p>
        <div className="grid grid-cols-3 gap-4 text-sm max-w-xl mx-auto">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200"><p className="text-2xl font-extrabold text-gray-300">$29</p><p className="text-xs text-gray-400 mt-1">Rezi Pro / mois</p></div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200"><p className="text-2xl font-extrabold text-gray-300">$149</p><p className="text-xs text-gray-400 mt-1">Rezi Lifetime</p></div>
          <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200"><p className="text-2xl font-extrabold text-indigo-600">79€</p><p className="text-xs text-indigo-600 font-semibold mt-1">SendCV Lifetime</p></div>
        </div>
      </div>

      {/* Guarantee */}
      <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center">
        <div className="flex items-center justify-center gap-2 mb-2"><span className="text-xl">🛡️</span><p className="font-bold text-emerald-800">Garantie Entretien 30 Jours</p></div>
        <p className="text-sm text-emerald-700">10+ candidatures, zéro entretien ? Remboursement complet.</p>
      </div>

      {/* FAQ */}
      <div className="space-y-3 max-w-xl mx-auto">
        {[
          { q: "La génération gratuite, c'est vraiment complète ?", a: "Oui. CV + lettre + 10 questions d'entretien + tips LinkedIn. Exactement comme les payants." },
          { q: "Je peux annuler Pro à tout moment ?", a: "Oui. Annulation en 1 clic. Pas de frais cachés." },
          { q: "Lifetime, c'est vraiment pour toujours ?", a: "Oui. Paiement unique, accès illimité à vie. Futures fonctionnalités incluses." },
        ].map((f, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white border border-gray-100"><p className="font-semibold text-sm">{f.q}</p><p className="text-xs text-gray-500 mt-1">{f.a}</p></div>
        ))}
      </div>
    </div>
  );
}

function PlanCard({ name, price, priceSub, sub, current, popular, features, highlights, cta }: {
  name: string; price: string; priceSub?: string; sub: string; current: boolean; popular?: boolean;
  features: string[]; highlights?: number[]; cta: React.ReactNode;
}) {
  return (
    <div className={`rounded-3xl p-7 border-2 relative ${popular ? "border-indigo-600 shadow-xl shadow-indigo-600/10 md:scale-[1.04]" : current ? "border-gray-300 bg-gray-50/50" : "border-gray-200"} bg-white`}>
      {popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-full">Recommandé</div>}
      <p className={`font-semibold ${popular ? "text-indigo-600" : "text-gray-500"}`}>{name}</p>
      <div className="mt-3 mb-1"><span className="text-4xl font-extrabold">{price}</span>{priceSub && <span className="text-gray-400 text-sm">{priceSub}</span>}</div>
      <p className="text-sm text-gray-400 mb-6">{sub}</p>
      <ul className="space-y-2.5 mb-6">
        {features.map((f, i) => {
          const hl = highlights?.includes(i);
          return (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${hl ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}>✓</span>
              <span className={hl ? "text-gray-800 font-medium" : "text-gray-500"}>{f}</span>
            </li>
          );
        })}
      </ul>
      {cta}
    </div>
  );
}

function Btn({ label, onClick, disabled, primary, dark, active, muted }: {
  label: string; onClick?: () => void; disabled?: boolean; primary?: boolean; dark?: boolean; active?: boolean; muted?: boolean;
}) {
  const base = "w-full py-3.5 rounded-2xl font-bold text-sm text-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-default";
  const style = primary ? `${base} bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/15`
    : dark ? `${base} bg-gray-900 text-white hover:bg-gray-800 shadow-lg`
    : active ? `${base} bg-indigo-100 text-indigo-600`
    : muted ? `${base} bg-gray-100 text-gray-400`
    : `${base} bg-gray-100 text-gray-500`;
  return <button onClick={onClick} disabled={disabled} className={style}>{label}</button>;
}
