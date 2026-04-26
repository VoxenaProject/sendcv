"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(heroProgress, [0, 0.5], [0, -50]);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] overflow-x-hidden">

      {/* ━━━ NAV ━━━ */}
      <nav role="navigation" aria-label="Navigation principale" className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f6]/60 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[17px] font-bold tracking-tight text-[#1a1a1a]">
            sendcv<span className="text-orange-400">.ai</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm text-gray-500 hover:text-[#1a1a1a] transition-colors">Connexion</Link>
            <Link href="/signup" className="text-sm font-semibold bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* ━━━ CHAPTER 1: THE PAIN — Full viewport ━━━ */}
      <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="text-center max-w-4xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-orange-600 font-bold text-sm tracking-widest uppercase mb-8">
            Le problème
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-extrabold leading-[0.95] tracking-[-0.03em]">
            Tu envoies le
            <br />
            même CV
            <br />
            <span className="text-orange-500">partout.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="mt-8 text-xl text-gray-500 max-w-md mx-auto leading-relaxed">
            Et 59% de tes candidatures ne sont jamais vues par un humain.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            className="mt-4 text-sm text-gray-400 animate-bounce">
            Scroll ↓
          </motion.div>
        </motion.div>
      </section>

      {/* ━━━ CHAPTER 2: THE SOLUTION ━━━ */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 relative">
        <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20%" }} transition={{ duration: 0.8 }}
          className="text-center max-w-3xl">
          <p className="text-orange-600 font-bold text-sm tracking-widest uppercase mb-6">La solution</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1] tracking-[-0.02em]">
            SendCV personnalise
            <br />
            <span className="text-orange-500">chaque candidature.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            Colle une offre. L&apos;IA crée ton CV sur-mesure, ta lettre de motivation et ta préparation d&apos;entretien. <strong className="text-[#1a1a1a]">En 60 secondes.</strong>
          </p>
          <div className="mt-8">
            <HeroEmailCapture />
          </div>
          <p className="mt-4 text-xs text-gray-400">3 candidatures offertes. Sans carte bancaire.</p>
          <div className="mt-3">
            <Link href="#demo" className="text-[14px] text-orange-600 font-medium hover:underline transition-all">
              Ou essaie la démo sans compte ↓
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ━━━ CHAPTER 3: TRY IT NOW ━━━ */}
      <section id="demo" className="px-6 py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-orange-600 font-bold text-sm tracking-widest uppercase mb-3">Essaie maintenant</p>
            <h2 className="text-3xl md:text-4xl font-extrabold">Colle une offre. Regarde ce qui se passe.</h2>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
              <div className="flex -space-x-1.5">
                {["bg-orange-400", "bg-rose-400", "bg-amber-400", "bg-red-300"].map((c, i) => (
                  <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-[#faf9f6]`} />
                ))}
              </div>
              <span>127+ candidatures analysées cette semaine</span>
            </div>
          </div>
          <LiveDemo />
        </motion.div>
      </section>

      {/* ━━━ CHAPTER 4: HOW IT WORKS ━━━ */}
      <section className="px-6 py-24 md:py-32 bg-[#f5f0eb]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={reveal} className="text-orange-600 font-bold text-sm tracking-widest uppercase mb-4">Comment ça marche</motion.p>
            <motion.h2 variants={reveal} className="text-4xl md:text-5xl font-extrabold tracking-[-0.02em] mb-16">
              1 offre. 60 secondes.<br /><span className="text-orange-500">Tout est fait.</span>
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
                <motion.div key={i} variants={reveal} className="group p-7 rounded-2xl bg-[#f5f0eb] hover:bg-[#efe8e0] transition-colors duration-300">
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
                <ul className="space-y-2 text-sm text-gray-600 mb-6">{["Analyses illimitées", "3 générations", "50 templates", "Double scoring"].map((f) => <li key={f} className="flex items-center gap-2"><span className="text-orange-400">✓</span>{f}</li>)}</ul>
                <Link href="/signup" className="block w-full py-3 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm text-center hover:bg-gray-200 transition-colors">Commencer</Link>
              </div>

              <div className="p-7 rounded-3xl bg-gray-900 text-white border-2 border-gray-900 md:scale-[1.04] shadow-2xl shadow-gray-900/20 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-full">Recommandé</div>
                <p className="text-gray-400 font-semibold text-sm">Pro</p>
                <p className="text-4xl font-extrabold mt-2">19€<span className="text-lg font-normal text-gray-500">/mois</span></p>
                <p className="text-sm text-gray-500 mt-1 mb-6">Tout illimité</p>
                <ul className="space-y-2 text-sm text-gray-300 mb-6">{["Générations illimitées", "Simulations illimitées", "Coach IA complet", "Support prioritaire"].map((f) => <li key={f} className="flex items-center gap-2"><span className="text-orange-400">✓</span>{f}</li>)}</ul>
                <Link href="/signup" className="block w-full py-3 rounded-full bg-white text-gray-900 font-bold text-sm text-center hover:bg-gray-100 transition-colors">Passer à Pro</Link>
              </div>

              <div className="p-7 rounded-3xl bg-white border border-gray-200">
                <p className="text-gray-500 font-semibold text-sm">Lifetime</p>
                <p className="text-4xl font-extrabold mt-2">79€</p>
                <p className="text-sm text-gray-400 mt-1 mb-6">Paiement unique, à vie</p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">{["Tout Pro inclus", "Accès à vie", "Futures features", "Zéro abonnement"].map((f) => <li key={f} className="flex items-center gap-2"><span className="text-orange-400">✓</span>{f}</li>)}</ul>
                <Link href="/signup" className="block w-full py-3 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm text-center hover:bg-gray-200 transition-colors">Acheter Lifetime</Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ GUARANTEE — Full width ━━━ */}
      <section className="px-6 py-20 bg-[#1a1a1a] text-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-6"><span className="text-2xl">🛡️</span></div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Garantie Entretien<br />30 Jours.</h2>
          <p className="text-gray-400 text-lg mb-8">10+ candidatures, zéro entretien ?<br /><strong className="text-white">On te rembourse. Point.</strong></p>
          <Link href="/signup" className="inline-flex items-center gap-3 bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f6] via-orange-50/30 to-[#faf9f6] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Prêt à décrocher<br />
            <span className="text-orange-500">des entretiens ?</span>
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
          <span className="text-sm font-black">send<span className="text-orange-500">cv</span><span className="text-gray-300 text-[10px]">.ai</span></span>
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
// Typewriter hook
function useTypewriter(text: string, speed = 25, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), startDelay); return () => clearTimeout(t); }, [startDelay]);
  useEffect(() => {
    if (!started) return;
    setDisplayed("");
    let i = 0;
    const t = setInterval(() => { i++; setDisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, [text, speed, started]);
  return { displayed, done: displayed.length >= text.length };
}

// Score bar color interpolation
function scoreColor(value: number): string {
  if (value >= 70) return "#34d399";
  if (value >= 40) return "#fbbf24";
  return "#f87171";
}

function LiveDemo() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"input" | "analyzing" | "email_gate" | "result">("input");
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [demoEmail, setDemoEmail] = useState("");
  const [result, setResult] = useState<{
    title: string; company: string; salary_estimate: string;
    keywords: { word: string; importance: string }[];
    ats_score: number; recruiter_score: number; interview_probability: number;
    top_insight: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [keywordIndex, setKeywordIndex] = useState(0);

  const insightTyped = useTypewriter(result?.top_insight || "", 20, 1500);

  useEffect(() => {
    if (!result || phase !== "result") return;
    if (keywordIndex >= result.keywords.length) return;
    const t = setTimeout(() => setKeywordIndex((i) => i + 1), 120);
    return () => clearTimeout(t);
  }, [result, keywordIndex, phase]);

  async function handleAnalyze() {
    if (!input.trim() || input.trim().length < 50) return;
    setPhase("analyzing");
    setError(null);
    setResult(null);
    setKeywordIndex(0);
    setAnalyzeStep(0);

    const stepInterval = setInterval(() => setAnalyzeStep((s) => Math.min(s + 1, 3)), 1200);

    const res = await fetch("/api/demo-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription: input }),
    });
    const data = await res.json();
    clearInterval(stepInterval);

    if (!res.ok) { setError(data.error); setPhase("input"); return; }
    setResult(data);
    setPhase("email_gate");
  }

  function handleEmailSubmit() {
    if (!demoEmail.trim() || !demoEmail.includes("@")) return;
    setPhase("result");
  }

  const charCount = input.trim().length;
  const isReady = charCount >= 50;
  const pct = Math.min(100, Math.round((charCount / 50) * 100));

  return (
    <motion.div layout className="rounded-2xl overflow-hidden bg-[#1a1a1a] text-white">
      <AnimatePresence mode="wait">
        {/* ━━━ INPUT ━━━ */}
        {phase === "input" && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 sm:p-8">
            <p className="text-[13px] text-gray-400 mb-4">Essaie maintenant. Sans compte. Sans carte.</p>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4}
              placeholder={"Colle une offre d'emploi ici.\nL'IA l'analyse en quelques secondes."}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[14px] text-white placeholder-gray-600 leading-relaxed focus:outline-none focus:border-white/20 transition-all resize-none" />
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" animate={{ width: `${pct}%`, backgroundColor: isReady ? "#34d399" : "#6366f1" }} transition={{ duration: 0.3 }} />
              </div>
              <span className={`text-[11px] font-mono ${isReady ? "text-emerald-400" : "text-gray-600"}`}>{charCount}/50</span>
            </div>
            {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
            <button onClick={handleAnalyze} disabled={!isReady}
              className={`mt-4 w-full py-3.5 rounded-xl font-medium text-[14px] transition-all cursor-pointer ${
                isReady ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-white/[0.04] text-gray-600 cursor-not-allowed"
              }`}>
              {isReady ? "Analyser gratuitement" : "Continue à coller l'offre..."}
            </button>
          </motion.div>
        )}

        {/* ━━━ ANALYZING ━━━ */}
        {phase === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 sm:p-12 flex flex-col items-center justify-center min-h-[300px]">
            <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            </motion.div>
            <p className="text-[14px] text-white font-medium mb-8">Analyse en cours</p>
            <div className="flex gap-10">
              {["Mots-clés", "ATS", "Recruteur", "Prédiction"].map((label, i) => (
                <motion.div key={i} animate={{ opacity: analyzeStep >= i ? 1 : 0.15 }} transition={{ duration: 0.4 }} className="text-center">
                  <div className={`w-2 h-2 rounded-full mx-auto mb-2 transition-colors duration-300 ${analyzeStep >= i ? "bg-orange-500" : "bg-gray-700"}`} />
                  <p className="text-[10px] text-gray-500">{label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ━━━ EMAIL GATE ━━━ */}
        {phase === "email_gate" && result && (
          <motion.div key="email_gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 sm:p-10 flex flex-col items-center justify-center min-h-[320px] text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <p className="text-[17px] font-semibold text-white mb-1">Analyse terminée</p>
            <p className="text-[13px] text-gray-400 mb-1">{result.title} — {result.company}</p>
            <p className="text-[13px] text-gray-500 mb-6">Score ATS : <span className="text-white font-semibold">{result.ats_score}%</span> · Recruteur : <span className="text-white font-semibold">{result.recruiter_score}%</span></p>

            <p className="text-[14px] text-gray-300 mb-4">Entre ton email pour voir les résultats complets.</p>

            <div className="flex w-full max-w-sm gap-2">
              <input type="email" value={demoEmail} onChange={(e) => setDemoEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                placeholder="ton@email.com"
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[14px] text-white placeholder-gray-600 focus:outline-none focus:border-white/25 transition-all" />
              <button onClick={handleEmailSubmit} disabled={!demoEmail.includes("@")}
                className={`px-5 py-3 rounded-xl font-medium text-[14px] transition-all cursor-pointer shrink-0 ${
                  demoEmail.includes("@") ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-white/[0.04] text-gray-600 cursor-not-allowed"
                }`}>
                Voir les résultats
              </button>
            </div>
            <p className="text-[11px] text-gray-600 mt-3">Pas de spam. Juste tes résultats.</p>
          </motion.div>
        )}

        {/* ━━━ RESULT ━━━ */}
        {phase === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-7">
              <div>
                <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[17px] font-semibold">{result.title}</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-[13px] text-gray-500">{result.company}</motion.p>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-500/10">
                <p className="text-[10px] text-emerald-400/60">Salaire</p>
                <p className="text-[13px] font-semibold text-emerald-400">{result.salary_estimate}</p>
              </motion.div>
            </div>

            {/* Scores — bars with dynamic color */}
            <div className="space-y-3.5 mb-7">
              {[
                { label: "Score ATS", value: result.ats_score, delay: 0.1 },
                { label: "Score Recruteur", value: result.recruiter_score, delay: 0.3 },
                { label: "Probabilité d'entretien", value: result.interview_probability, delay: 0.5 },
              ].map((s) => (
                <motion.div key={s.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: s.delay }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-gray-500">{s.label}</span>
                    <motion.span className="text-[12px] font-mono font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1, color: scoreColor(s.value) }} transition={{ delay: s.delay + 0.8 }}>
                      {s.value}%
                    </motion.span>
                  </div>
                  <div className="h-[5px] bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                      animate={{ width: `${s.value}%`, backgroundColor: scoreColor(s.value) }}
                      transition={{ delay: s.delay + 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Keywords */}
            <div className="mb-7">
              <p className="text-[11px] text-gray-600 mb-2.5">Mots-clés détectés dans l&apos;offre</p>
              <div className="flex flex-wrap gap-1.5 min-h-[36px]">
                {result.keywords.slice(0, keywordIndex).map((kw, i) => (
                  <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${
                      kw.importance === "critical" ? "bg-orange-500/15 text-[#5fa8ff]" :
                      kw.importance === "important" ? "bg-purple-500/10 text-purple-400" :
                      "bg-white/[0.04] text-gray-500"
                    }`}>
                    {kw.word}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Typewriter insight */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-5">
              <p className="text-[12px] text-gray-300 leading-relaxed">
                {insightTyped.displayed}<span className={`${insightTyped.done ? "hidden" : ""} text-orange-600 animate-pulse`}>|</span>
              </p>
            </motion.div>

            {/* Mini CV teaser */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Aperçu de ton CV optimisé</p>
              <div className="space-y-1.5 text-[12px] font-mono">
                <p className="text-white font-semibold">PROFIL</p>
                <p className="text-gray-400">Professionnel avec une expertise en {result.keywords.filter(k => k.importance === "critical").slice(0, 2).map(k => k.word).join(" et ") || "ce domaine"}.
                  Résultats mesurables et approche orientée impact.</p>
                <p className="text-gray-600 text-[10px] italic mt-2">→ Version complète avec ton expérience en créant un compte</p>
              </div>
            </motion.div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link href={`/signup?email=${encodeURIComponent(demoEmail)}`} className="flex-1 text-center py-3.5 rounded-xl bg-orange-500 text-white font-medium text-[14px] hover:bg-orange-600 transition-all">
                Créer mon compte et recevoir le CV
              </Link>
              <button onClick={() => { setResult(null); setInput(""); setPhase("input"); }}
                className="py-3 px-5 rounded-xl bg-white/[0.06] text-gray-400 text-[13px] hover:bg-white/[0.1] transition-all cursor-pointer">
                Réessayer
              </button>
            </div>
            <p className="text-[11px] text-gray-600 text-center mt-3">3 candidatures complètes gratuites · Sans carte bancaire</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ━━━ HERO EMAIL CAPTURE ━━━
function HeroEmailCapture() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    router.push(`/signup?email=${encodeURIComponent(email)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
        placeholder="Ton email"
        className="w-full sm:flex-1 px-5 py-3.5 rounded-full border border-gray-200 text-[15px] text-center sm:text-left focus:outline-none focus:border-gray-400 transition-all" />
      <button type="submit"
        className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-orange-500 text-white font-medium text-[15px] hover:bg-orange-600 transition-all shrink-0 cursor-pointer">
        Commencer
      </button>
    </form>
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
