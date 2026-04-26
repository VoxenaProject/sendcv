"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// ━━━ Animated score circle ━━━
function ScoreRing({ value, label, color, delay = 0 }: { value: number; label: string; color: string; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      let n = 0;
      const step = value / 40;
      const interval = setInterval(() => { n += step; if (n >= value) { setCurrent(value); clearInterval(interval); } else setCurrent(Math.floor(n)); }, 25);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [visible, value, delay]);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (current / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#f1f5f9" strokeWidth="6" />
          <circle cx="48" cy="48" r="40" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-extrabold">{current}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 font-medium text-center">{label}</p>
    </div>
  );
}

// ━━━ Parallax wrapper ━━━
function Parallax({ children, offset = 30 }: { children: React.ReactNode; offset?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return <motion.div ref={ref} style={{ y }}>{children}</motion.div>;
}

const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
} as const;

const stagger = { visible: { transition: { staggerChildren: 0.1 } } } as const;

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-[#0f172a] overflow-x-hidden">

      {/* ━━━ NAV — Apple clean ━━━ */}
      <nav role="navigation" aria-label="Navigation principale" className="sticky top-0 z-50 bg-white/80 backdrop-blur-3xl border-b border-black/[0.04]">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-black">
            sendcv<span className="text-gray-400">.ai</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-xs text-gray-500 hover:text-black transition-colors">Connexion</Link>
            <Link href="/signup" className="text-xs font-medium bg-[#0071e3] text-white px-4 py-1.5 rounded-full hover:bg-[#0077ED] transition-all">
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* ━━━ HERO — Apple minimal ━━━ */}
      <section className="px-6 pt-20 pb-10 md:pt-32 md:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p variants={reveal} className="text-sm text-gray-500 mb-6">
              59% de tes candidatures ne sont jamais vues par un humain.
            </motion.p>

            <motion.h1 variants={reveal} className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] tracking-[-0.02em] text-black">
              Chaque candidature.
              <br />
              <span className="text-gray-300">Personnalisée par l&apos;IA.</span>
            </motion.h1>

            <motion.p variants={reveal} className="mt-6 text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
              Colle une offre d&apos;emploi. Reçois ton CV sur-mesure, ta lettre de motivation et ta préparation d&apos;entretien. En 60 secondes.
            </motion.p>

            <motion.div variants={reveal} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup" className="text-[15px] font-medium bg-[#0071e3] text-white px-7 py-3 rounded-full hover:bg-[#0077ED] transition-all">
                Commencer gratuitement
              </Link>
              <Link href="#demo" className="text-[15px] font-medium text-[#0071e3] hover:underline transition-all">
                Essayer la démo →
              </Link>
            </motion.div>
            <motion.p variants={reveal} className="mt-4 text-xs text-gray-400">3 candidatures offertes. Sans carte bancaire.</motion.p>
          </motion.div>
        </div>
      </section>

      {/* ━━━ LIVE DEMO ━━━ */}
      <section id="demo" className="px-6 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto">
          <LiveDemo />
        </div>
      </section>

      {/* ━━�� HOW IT WORKS — Apple clean ━━━ */}
      <section className="px-6 py-24 md:py-32 bg-[#f5f5f7]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={reveal} className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] mb-16">
              1 offre. 60 secondes.
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                { n: "1", t: "Colle l'offre", d: "Copie la description du poste depuis n'importe où. C'est tout." },
                { n: "2", t: "Analyse gratuite", d: "Score ATS et Recruteur. Mots-clés. Salaire estimé. Instantané." },
                { n: "3", t: "Candidature complète", d: "CV, lettre, 10 questions d'entretien. Télécharge en PDF." },
              ].map((s, i) => (
                <motion.div key={i} variants={reveal}>
                  <p className="text-5xl font-semibold text-gray-200 mb-3">{s.n}</p>
                  <h3 className="text-lg font-semibold mb-1">{s.t}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      {/* ━━━ FEATURES — Apple grid ━━━ */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.h2 variants={reveal} className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-center mb-6">
              Ce qu&apos;aucun autre outil ne fait.
            </motion.h2>
            <motion.p variants={reveal} className="text-center text-lg text-gray-400 mb-16 max-w-lg mx-auto">Chaque candidature est analysée, optimisée et personnalisée. Pas remplie dans un template.</motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={reveal} className="p-8 rounded-2xl bg-black text-white md:col-span-2">
                <p className="text-sm text-gray-400 font-medium mb-2">Exclusif</p>
                <h3 className="text-2xl font-semibold mb-2">Double scoring</h3>
                <p className="text-gray-400 max-w-lg">Score ATS (filtres automatiques) + Score Recruteur (impact humain). Tu sais pourquoi ta candidature va marcher — ou pas. Personne d&apos;autre ne fait les deux.</p>
              </motion.div>

              {[
                { t: "CV sur-mesure", d: "L'IA réécrit chaque ligne avec les mots-clés ATS de l'offre et des chiffres d'impact. Pas un template rempli." },
                { t: "Lettre de motivation", d: "Personnalisée pour cette entreprise et ce poste. Mentionne des éléments concrets de l'offre." },
                { t: "Simulation d'entretien", d: "L'IA joue le recruteur. Questions spécifiques au poste. Feedback après chaque réponse." },
                { t: "10 questions + réponses", d: "Les questions les plus probables avec les réponses optimales. Méthode STAR, chiffres de ton profil." },
                { t: "50 templates CV", d: "10 designs × 5 palettes. Du Prestige au Terminal. Export PDF en un clic." },
                { t: "France & Belgique", d: "Conventions CV locales, niveaux CECR, 13ème mois, ATS européens. Pas un outil US traduit." },
              ].map((f, i) => (
                <motion.div key={i} variants={reveal} className="group p-7 rounded-2xl bg-[#f5f5f7] hover:bg-[#ececee] transition-colors duration-300">
                  <h3 className="text-lg font-semibold mb-1.5">{f.t}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.d}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ BEFORE / AFTER — Clean ━━━ */}
      <section className="px-6 py-28 md:py-36">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={reveal} className="text-4xl md:text-5xl font-extrabold">
              Tu personnalises<br />chaque candidature ?
            </motion.h2>
            <motion.p variants={reveal} className="text-xl text-gray-400 mt-4">Ça prend 2 heures. À chaque fois.</motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="p-8 rounded-3xl border-2 border-red-100 bg-red-50/30 space-y-4">
              <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Aujourd&apos;hui</p>
              {["45 min pour adapter le CV", "30 min pour la lettre", "Aucune idée des mots-clés ATS", "Zéro préparation entretien", "~5% de taux de réponse"].map((t, i) => (
                <div key={i} className="flex items-center gap-3 text-[15px] text-red-800/50"><span className="text-red-300">✕</span>{t}</div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl border-2 border-emerald-100 bg-emerald-50/30 space-y-4">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Avec SendCV</p>
              {["CV avec les mots-clés exacts de l'offre", "Lettre pour cette entreprise", "Score ATS + Score Recruteur avant d'envoyer", "10 questions d'entretien + réponses", "Candidature optimisée à chaque fois"].map((t, i) => (
                <div key={i} className="flex items-center gap-3 text-[15px] text-emerald-800/70"><span className="text-emerald-500">✓</span>{t}</div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ PRICING — Minimal ━━━ */}
      <section className="px-6 py-28 bg-[#fafbfc]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={reveal} className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">Pricing</motion.p>
            <motion.h2 variants={reveal} className="text-4xl md:text-5xl font-extrabold mb-4">
              Commence gratuitement.
            </motion.h2>
            <motion.p variants={reveal} className="text-xl text-gray-400 mb-16">Upgrade quand tu veux. Annule quand tu veux.</motion.p>

            <motion.div variants={reveal} className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-7 rounded-3xl bg-white border border-gray-200">
                <p className="text-gray-500 font-semibold text-sm">Free</p>
                <p className="text-4xl font-extrabold mt-2">0€</p>
                <p className="text-sm text-gray-400 mt-1 mb-6">3 candidatures complètes</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">{["Analyses illimitées", "3 générations", "50 templates", "Double scoring"].map((f) => <li key={f} className="flex items-center gap-2"><span className="text-indigo-400">✓</span>{f}</li>)}</ul>
                <Link href="/signup" className="block w-full py-3 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm text-center hover:bg-gray-200 transition-colors">Commencer</Link>
              </div>

              <div className="p-7 rounded-3xl bg-gray-900 text-white border-2 border-gray-900 md:scale-[1.04] shadow-2xl shadow-gray-900/20 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-full">Recommandé</div>
                <p className="text-gray-400 font-semibold text-sm">Pro</p>
                <p className="text-4xl font-extrabold mt-2">19€<span className="text-lg font-normal text-gray-500">/mois</span></p>
                <p className="text-sm text-gray-500 mt-1 mb-6">Tout illimité</p>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">{["Générations illimitées", "Simulations illimitées", "Coach IA complet", "Support prioritaire"].map((f) => <li key={f} className="flex items-center gap-2"><span className="text-indigo-400">✓</span>{f}</li>)}</ul>
                <Link href="/signup" className="block w-full py-3 rounded-full bg-white text-gray-900 font-bold text-sm text-center hover:bg-gray-100 transition-colors">Passer à Pro</Link>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-gray-200">
                <p className="text-gray-500 font-semibold text-sm">Lifetime</p>
                <p className="text-4xl font-extrabold mt-2">79€</p>
                <p className="text-sm text-gray-400 mt-1 mb-6">Paiement unique, à vie</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">{["Tout Pro inclus", "Accès à vie", "Futures features", "Zéro abonnement"].map((f) => <li key={f} className="flex items-center gap-2"><span className="text-indigo-400">✓</span>{f}</li>)}</ul>
                <Link href="/signup" className="block w-full py-3 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm text-center hover:bg-gray-200 transition-colors">Acheter Lifetime</Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ GUARANTEE — Full width ━━━ */}
      <section className="px-6 py-20 bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-5xl mb-6">🛡️</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Garantie Entretien<br />30 Jours.</h2>
          <p className="text-gray-400 text-lg mb-8">10+ candidatures, zéro entretien ?<br /><strong className="text-white">Remboursement complet.</strong> Sans question.</p>
          <Link href="/signup" className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl">
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* ━━━ FAQ ━━━ */}
      <section className="px-6 py-28">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-14">Questions fréquentes</h2>
          {[
            { q: "C'est quoi les 3 candidatures gratuites ?", a: "3 générations complètes : CV personnalisé + lettre + 10 questions d'entretien + LinkedIn. Identiques aux utilisateurs payants." },
            { q: "C'est différent d'un générateur de CV ?", a: "Oui. Les générateurs remplissent un template. SendCV analyse l'offre et réécrit tout ton profil avec les mots-clés ATS et des métriques d'impact." },
            { q: "Ça marche en Belgique et en France ?", a: "C'est fait pour. Conventions CV locales, niveaux CECR, 13ème mois, ATS européens. Pas un outil américain traduit." },
            { q: "Comment fonctionne la garantie ?", a: "10+ candidatures en 30 jours. Zéro entretien ? Email, remboursement complet." },
          ].map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* ━━━ FINAL CTA ━━━ */}
      <section className="px-6 py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-white pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Prêt à décrocher<br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">des entretiens ?</span>
          </h2>
          <p className="text-gray-400 mt-6 mb-10 text-lg">3 candidatures gratuites. Pas de carte bancaire.</p>
          <Link href="/signup" className="group inline-flex items-center gap-3 bg-gray-900 text-white pl-8 pr-6 py-4 rounded-full font-semibold text-base hover:bg-gray-800 transition-all shadow-2xl shadow-gray-900/20 hover:-translate-y-0.5">
            Commencer gratuitement
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </div>
          </Link>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="px-6 py-10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-black">send<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">cv</span><span className="text-gray-300 text-[10px]">.ai</span></span>
          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <Link href="/legal" className="hover:text-gray-600 transition-colors">Mentions légales</Link>
            <span>·</span>
            <span>Fondé en Belgique 🇧🇪</span>
            <span>·</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ━━━ LIVE DEMO COMPONENT ━━━
function LiveDemo() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    title: string; company: string; salary_estimate: string;
    keywords: { word: string; importance: string }[];
    ats_score: number; recruiter_score: number; interview_probability: number;
    top_insight: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [keywordIndex, setKeywordIndex] = useState(0);

  // Animate keywords appearing one by one
  useEffect(() => {
    if (!result) return;
    if (keywordIndex >= result.keywords.length) return;
    const t = setTimeout(() => setKeywordIndex((i) => i + 1), 200);
    return () => clearTimeout(t);
  }, [result, keywordIndex]);

  async function handleAnalyze() {
    if (!input.trim() || input.trim().length < 50) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setKeywordIndex(0);

    const res = await fetch("/api/demo-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription: input }),
    });
    const data = await res.json();

    if (!res.ok) { setError(data.error); setLoading(false); return; }
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-200/60 p-2 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.12)]">
      <div className="rounded-2xl bg-[#fafbfc] p-6 sm:p-8">
        {!result ? (
          /* ━━━ Input state ━━━ */
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-200" /><div className="w-3 h-3 rounded-full bg-gray-200" /><div className="w-3 h-3 rounded-full bg-gray-200" /></div>
              <p className="text-xs text-gray-400 font-medium">Essaie maintenant — colle une offre d&apos;emploi</p>
            </div>
            <textarea
              value={input} onChange={(e) => setInput(e.target.value)} rows={5}
              placeholder={"Colle ici une description d'offre d'emploi.\nEx: \"Nous recherchons un Développeur Full-Stack Senior pour rejoindre notre équipe à Bruxelles...\""}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none bg-white"
            />
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
            <button onClick={handleAnalyze} disabled={loading || input.trim().length < 50}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                input.trim().length >= 50
                  ? "bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-900/15"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Analyse en cours...
                </span>
              ) : input.trim().length >= 50 ? "Analyser cette offre — gratuit, sans compte" : `${50 - input.trim().length} caractères de plus...`}
            </button>
          </div>
        ) : (
          /* ━━━ Result state — animated ━━━ */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">{result.title}</p>
                <p className="text-sm text-gray-500">{result.company} — {result.salary_estimate}</p>
              </div>
              <button onClick={() => { setResult(null); setInput(""); }} className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
                Nouvelle analyse
              </button>
            </div>

            {/* Animated scores */}
            <div className="flex justify-center gap-10 sm:gap-16">
              <ScoreRing value={result.ats_score} label="Score ATS" color="#4338ca" delay={0} />
              <ScoreRing value={result.recruiter_score} label="Score Recruteur" color="#7c3aed" delay={300} />
              <ScoreRing value={result.interview_probability} label="Prob. entretien" color="#059669" delay={600} />
            </div>

            {/* Keywords appearing one by one */}
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">Mots-clés détectés</p>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {result.keywords.slice(0, keywordIndex).map((kw, i) => (
                  <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      kw.importance === "critical" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                      kw.importance === "important" ? "bg-violet-50 text-violet-700 border border-violet-100" :
                      "bg-gray-50 text-gray-600 border border-gray-200"
                    }`}>
                    {kw.word}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Insight */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <p className="text-xs font-bold text-indigo-700 mb-1">💡 Conseil</p>
              <p className="text-sm text-indigo-800">{result.top_insight}</p>
            </div>

            {/* CTA */}
            <div className="text-center pt-2">
              <Link href="/signup" className="group inline-flex items-center gap-3 bg-gray-900 text-white pl-8 pr-6 py-4 rounded-full font-semibold text-base hover:bg-gray-800 transition-all shadow-2xl shadow-gray-900/20 hover:-translate-y-0.5">
                Recevoir le CV + lettre + entretien
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </div>
              </Link>
              <p className="text-xs text-gray-400 mt-3">3 candidatures complètes gratuites</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left cursor-pointer group">
        <span className="font-semibold text-[15px] text-gray-800 group-hover:text-indigo-600 transition-colors pr-4">{q}</span>
        <div className={`w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center shrink-0 transition-all ${open ? "bg-indigo-600 border-indigo-600 rotate-45" : "group-hover:border-indigo-300"}`}>
          <span className={`text-sm ${open ? "text-white" : "text-gray-400"}`}>+</span>
        </div>
      </button>
      {open && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-gray-500 leading-relaxed pb-5">{a}</motion.p>}
    </div>
  );
}
