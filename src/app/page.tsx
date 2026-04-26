"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function useTypewriter(text: string, speed = 20, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), startDelay); return () => clearTimeout(t); }, [startDelay]);
  useEffect(() => { if (!started) return; setDisplayed(""); let i = 0; const t = setInterval(() => { i++; setDisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(t); }, speed); return () => clearInterval(t); }, [text, speed, started]);
  return { displayed, done: displayed.length >= text.length };
}
function scoreColor(v: number) { return v >= 70 ? "#16a34a" : v >= 40 ? "#d97706" : "#dc2626"; }

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">sendcv<span className="text-orange-500">.ai</span></Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">Connexion</Link>
            <Link href="/signup" className="text-sm font-semibold bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Commencer</Link>
          </div>
        </div>
      </nav>

      {/* HERO — Direct, conversion */}
      <section className="px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-orange-600 font-semibold mb-4">59% des CV ne sont jamais vus par un humain</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Candidature personnalisée.<br />60 secondes.
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-md mx-auto">
            Colle une offre. Reçois ton CV sur-mesure, ta lettre et ta préparation d&apos;entretien.
          </p>
          <div className="mt-6">
            <EmailCapture />
          </div>
          <p className="mt-3 text-xs text-gray-400">3 candidatures gratuites. Sans carte bancaire.</p>
        </div>
      </section>

      {/* DEMO — Le WOW */}
      <section id="demo" className="px-6 pb-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-4">Essaie maintenant — colle une offre d&apos;emploi</p>
          <LiveDemo />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "1", t: "Colle l'offre", d: "Copie la description depuis n'importe quel site." },
              { n: "2", t: "Analyse gratuite", d: "Score ATS + Score Recruteur. Mots-clés. Salaire estimé." },
              { n: "3", t: "Candidature complète", d: "CV, lettre, 10 questions d'entretien. Export PDF." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">{s.n}</div>
                <h3 className="font-bold mb-1">{s.t}</h3>
                <p className="text-sm text-gray-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Ce que tu reçois</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { t: "CV réécrit avec les mots-clés ATS", d: "Pas un template rempli. Chaque ligne optimisée pour CE poste." },
              { t: "Lettre de motivation personnalisée", d: "Pour cette entreprise. Mentionne des éléments concrets de l'offre." },
              { t: "10 questions d'entretien + réponses", d: "Les plus probables pour ce poste. Méthode STAR." },
              { t: "Double scoring ATS + Recruteur", d: "Tu sais pourquoi ta candidature va marcher." },
              { t: "Simulation d'entretien", d: "L'IA joue le recruteur. Feedback en temps réel." },
              { t: "50 templates CV + export PDF", d: "10 designs × 5 couleurs. Télécharge en un clic." },
            ].map((f, i) => (
              <div key={i} className="p-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <h3 className="font-bold text-sm mb-1">{f.t}</h3>
                <p className="text-sm text-gray-500">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Pricing</h2>
          <p className="text-center text-gray-500 mb-10">Commence gratuitement. Upgrade quand tu veux.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl bg-white border border-gray-200 text-center">
              <p className="text-gray-500 font-semibold mb-2">Free</p>
              <p className="text-4xl font-extrabold">0€</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">3 candidatures complètes</p>
              <ul className="text-sm text-gray-500 space-y-1 mb-4 text-left">{["Analyses illimitées", "3 générations", "50 templates", "Double scoring"].map((f) => <li key={f}>✓ {f}</li>)}</ul>
              <Link href="/signup" className="block w-full py-2 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200">Commencer</Link>
            </div>
            <div className="p-6 rounded-xl bg-white border-2 border-orange-500 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">Recommandé</div>
              <p className="text-orange-600 font-semibold mb-2">Pro</p>
              <p className="text-4xl font-extrabold">19€<span className="text-base font-normal text-gray-400">/mois</span></p>
              <p className="text-sm text-gray-400 mt-1 mb-4">Tout illimité</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4 text-left">{["Générations illimitées", "Simulations illimitées", "Coach IA", "Support prioritaire"].map((f) => <li key={f}>✓ {f}</li>)}</ul>
              <Link href="/signup" className="block w-full py-2 rounded-lg bg-orange-500 text-white text-sm font-bold hover:bg-orange-600">Passer à Pro</Link>
            </div>
            <div className="p-6 rounded-xl bg-white border border-gray-200 text-center">
              <p className="text-gray-500 font-semibold mb-2">Lifetime</p>
              <p className="text-4xl font-extrabold">79€</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">Une fois, pour toujours</p>
              <ul className="text-sm text-gray-500 space-y-1 mb-4 text-left">{["Tout Pro inclus", "Accès à vie", "Futures features", "Zéro abo"].map((f) => <li key={f}>✓ {f}</li>)}</ul>
              <Link href="/signup" className="block w-full py-2 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200">Acheter</Link>
            </div>
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="px-6 py-12 bg-orange-500 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Garantie Entretien 30 Jours.</h2>
        <p className="text-orange-100 mb-6">10+ candidatures, zéro entretien ? On te rembourse.</p>
        <Link href="/signup" className="inline-block bg-white text-orange-600 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-50">Commencer</Link>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          {[
            { q: "C'est quoi les 3 candidatures gratuites ?", a: "CV + lettre + 10 questions d'entretien. Identiques aux utilisateurs payants." },
            { q: "C'est différent d'un générateur de CV ?", a: "Oui. L'IA analyse l'offre et réécrit tout ton profil avec les mots-clés ATS." },
            { q: "Ça marche en France et en Belgique ?", a: "C'est fait pour. Conventions locales, CECR, 13ème mois." },
            { q: "Comment fonctionne la garantie ?", a: "10+ candidatures en 30 jours. Zéro entretien = remboursement complet." },
          ].map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Prêt à décrocher des entretiens ?</h2>
        <p className="text-gray-500 mb-6">3 candidatures gratuites. Sans carte bancaire.</p>
        <EmailCapture />
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-6 border-t border-gray-100 text-center text-xs text-gray-400">
        <Link href="/legal" className="hover:text-gray-600">Mentions légales</Link> · Fondé en Belgique · © 2026 sendcv.ai
      </footer>
    </div>
  );
}

// EMAIL CAPTURE
function EmailCapture() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) router.push(`/signup?email=${encodeURIComponent(email)}`); }}
      className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Ton email"
        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-500" />
      <button type="submit" className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 cursor-pointer">
        Commencer
      </button>
    </form>
  );
}

// LIVE DEMO
function LiveDemo() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"input" | "loading" | "email" | "result">("input");
  const [demoEmail, setDemoEmail] = useState("");
  const [result, setResult] = useState<{ title: string; company: string; salary_estimate: string; keywords: { word: string; importance: string }[]; ats_score: number; recruiter_score: number; interview_probability: number; top_insight: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kwIdx, setKwIdx] = useState(0);
  const typed = useTypewriter(result?.top_insight || "", 20, 1200);

  useEffect(() => { if (!result || phase !== "result" || kwIdx >= result.keywords.length) return; const t = setTimeout(() => setKwIdx((i) => i + 1), 120); return () => clearTimeout(t); }, [result, kwIdx, phase]);

  async function analyze() {
    if (input.trim().length < 50) return;
    setPhase("loading"); setError(null); setResult(null); setKwIdx(0);
    const res = await fetch("/api/demo-analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobDescription: input }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setPhase("input"); return; }
    setResult(data); setPhase("email");
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} placeholder="Colle une offre d'emploi ici..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-500 resize-none" />
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${input.trim().length >= 50 ? "text-green-600" : "text-gray-400"}`}>{input.trim().length}/50</span>
              <button onClick={analyze} disabled={input.trim().length < 50}
                className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer ${input.trim().length >= 50 ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-100 text-gray-400"}`}>
                Analyser
              </button>
            </div>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-10 text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Analyse en cours...</p>
          </motion.div>
        )}

        {phase === "email" && result && (
          <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">✓</div>
            <p className="font-bold">{result.title}</p>
            <p className="text-sm text-gray-500 mb-1">{result.company}</p>
            <p className="text-sm text-gray-500 mb-4">ATS: <strong>{result.ats_score}%</strong> · Recruteur: <strong>{result.recruiter_score}%</strong></p>
            <p className="text-sm text-gray-600 mb-3">Entre ton email pour voir les résultats complets.</p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input type="email" value={demoEmail} onChange={(e) => setDemoEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && demoEmail.includes("@") && setPhase("result")}
                placeholder="ton@email.com" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-500" />
              <button onClick={() => demoEmail.includes("@") && setPhase("result")} disabled={!demoEmail.includes("@")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer ${demoEmail.includes("@") ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                Voir
              </button>
            </div>
          </motion.div>
        )}

        {phase === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div><p className="font-bold">{result.title}</p><p className="text-sm text-gray-500">{result.company}</p></div>
              <p className="text-sm font-semibold text-green-600">{result.salary_estimate}</p>
            </div>
            <div className="space-y-2 mb-4">
              {[{ l: "Score ATS", v: result.ats_score }, { l: "Score Recruteur", v: result.recruiter_score }, { l: "Probabilité entretien", v: result.interview_probability }].map((s) => (
                <div key={s.l}>
                  <div className="flex justify-between text-xs mb-0.5"><span className="text-gray-500">{s.l}</span><span className="font-bold" style={{ color: scoreColor(s.v) }}>{s.v}%</span></div>
                  <div className="h-1.5 bg-gray-100 rounded-full"><motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${s.v}%`, backgroundColor: scoreColor(s.v) }} transition={{ duration: 0.8 }} /></div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">Mots-clés</p>
              <div className="flex flex-wrap gap-1">{result.keywords.slice(0, kwIdx).map((kw, i) => (
                <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`px-2 py-0.5 rounded text-xs ${kw.importance === "critical" ? "bg-orange-50 text-orange-700" : "bg-gray-50 text-gray-600"}`}>{kw.word}</motion.span>
              ))}</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 mb-4">
              <p className="text-sm text-gray-700">{typed.displayed}<span className={`${typed.done ? "hidden" : ""} text-orange-500`}>|</span></p>
            </div>
            <Link href={`/signup?email=${encodeURIComponent(demoEmail)}`} className="block w-full py-2.5 rounded-lg bg-orange-500 text-white text-sm font-bold text-center hover:bg-orange-600">
              Créer mon compte — 3 candidatures gratuites
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// FAQ
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-4 text-left cursor-pointer">
        <span className="font-semibold text-sm">{q}</span>
        <span className={`text-gray-400 transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <p className="text-sm text-gray-500 pb-4">{a}</p>}
    </div>
  );
}
