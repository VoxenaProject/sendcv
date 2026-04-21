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

      {/* ━━━ NAV — Glass ━━━ */}
      <nav role="navigation" aria-label="Navigation principale" className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-0.5">
            <span className="text-[22px] font-black tracking-tight">send</span>
            <span className="text-[22px] font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">cv</span>
            <span className="text-[9px] text-gray-300 font-semibold">.ai</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 px-3 py-2 transition-colors">Connexion</Link>
            <Link href="/signup" className="text-sm font-semibold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* ━━━ HERO — Dramatic ━━━ */}
      <section className="relative px-6 pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
            {/* Badge */}
            <motion.div variants={reveal} className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-5 py-2 mb-10">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              <span className="text-xs font-semibold text-red-800">59% de tes candidatures ne sont jamais vues par un humain</span>
            </motion.div>

            {/* Headline — DRAMATIC */}
            <motion.h1 variants={reveal} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight">
              Arrête d&apos;envoyer
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                le même CV.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={reveal} className="mt-8 text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
              SendCV personnalise <strong className="text-gray-900 font-semibold">chaque candidature</strong> en 60 secondes.
              CV, lettre, entretien — optimisés pour les robots <em>et</em> les recruteurs.
            </motion.p>

            {/* CTA */}
            <motion.div variants={reveal} className="mt-10 flex flex-col items-center gap-4">
              <Link href="/signup" className="group inline-flex items-center gap-3 bg-gray-900 text-white pl-8 pr-6 py-4 rounded-full font-semibold text-base hover:bg-gray-800 transition-all shadow-2xl shadow-gray-900/20 hover:-translate-y-0.5">
                Commencer gratuitement
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </div>
              </Link>
              <p className="text-sm text-gray-400">3 candidatures complètes offertes · Pas de carte bancaire</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ PRODUCT — Floating glass card ━━━ */}
      <section className="px-6 pb-24 -mt-8">
        <Parallax offset={20}>
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-200/60 p-2 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.12)]">
              <div className="rounded-2xl bg-[#fafbfc] p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-200" /><div className="w-3 h-3 rounded-full bg-gray-200" /><div className="w-3 h-3 rounded-full bg-gray-200" /></div>
                  <div className="h-8 flex-1 rounded-lg bg-white border border-gray-200 flex items-center px-3"><span className="text-[11px] text-gray-400">Développeur Full-Stack — TechCorp Brussels</span></div>
                </div>

                {/* Scores */}
                <div className="flex justify-center gap-12 sm:gap-20">
                  <ScoreRing value={82} label="Score ATS" color="#4338ca" delay={200} />
                  <ScoreRing value={74} label="Score Recruteur" color="#7c3aed" delay={500} />
                  <ScoreRing value={78} label="Probabilité entretien" color="#059669" delay={800} />
                </div>

                {/* Keywords */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {["React", "TypeScript", "Node.js", "Agile", "CI/CD"].map((k) => (
                    <span key={k} className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">✓ {k}</span>
                  ))}
                  {["PostgreSQL", "AWS"].map((k) => (
                    <span key={k} className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">✕ {k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Parallax>
      </section>

      {/* ━━━ HOW IT WORKS — Numbered ━━━ */}
      <section className="px-6 py-28 md:py-36">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <motion.p variants={reveal} className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] text-center mb-3">Comment ça marche</motion.p>
            <motion.h2 variants={reveal} className="text-4xl md:text-5xl font-extrabold text-center leading-tight mb-20">
              1 offre. 60 secondes.<br /><span className="text-gray-300">Tout est fait.</span>
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { n: "01", t: "Colle l'offre", d: "Copie la description depuis n'importe quel site d'emploi. C'est le seul input nécessaire." },
                { n: "02", t: "Double analyse", d: "Score ATS (robots) + Score Recruteur (humain). Mots-clés matchés, salaire estimé, red flags. Gratuit." },
                { n: "03", t: "Tout est généré", d: "CV sur-mesure, lettre de motivation, 10 questions d'entretien, tips LinkedIn. Télécharge en PDF." },
              ].map((step, i) => (
                <motion.div key={i} variants={reveal}>
                  <span className="text-6xl font-extrabold text-gray-100">{step.n}</span>
                  <h3 className="text-xl font-bold mt-2 mb-3">{step.t}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.d}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ BENTO GRID FEATURES ━━━ */}
      <section className="px-6 py-28 bg-[#fafbfc]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.p variants={reveal} className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] text-center mb-3">Tout compris</motion.p>
            <motion.h2 variants={reveal} className="text-4xl md:text-5xl font-extrabold text-center mb-16">
              Ce qu&apos;aucun autre outil<br /><span className="text-gray-300">ne fait.</span>
            </motion.h2>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {/* Large card */}
              <motion.div variants={reveal} className="md:col-span-4 group p-8 rounded-3xl bg-white border border-gray-200/60 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                <span className="text-3xl">📊</span>
                <h3 className="text-xl font-bold mt-4 mb-2 group-hover:text-indigo-700 transition-colors">Double scoring unique</h3>
                <p className="text-gray-500 leading-relaxed max-w-md">Score ATS (robots) + Score Recruteur (humain). Tu sais exactement pourquoi ta candidature va marcher — ou pas. Aucun concurrent ne fait ça.</p>
              </motion.div>

              {/* Small card */}
              <motion.div variants={reveal} className="md:col-span-2 group p-8 rounded-3xl bg-white border border-gray-200/60 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                <span className="text-3xl">🎤</span>
                <h3 className="text-lg font-bold mt-4 mb-2">Simulation d&apos;entretien</h3>
                <p className="text-sm text-gray-500">L&apos;IA joue le recruteur. Feedback en temps réel.</p>
              </motion.div>

              <motion.div variants={reveal} className="md:col-span-2 group p-8 rounded-3xl bg-white border border-gray-200/60 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                <span className="text-3xl">📄</span>
                <h3 className="text-lg font-bold mt-4 mb-2">CV réécrit, pas rempli</h3>
                <p className="text-sm text-gray-500">Chaque bullet point avec des chiffres d&apos;impact.</p>
              </motion.div>

              <motion.div variants={reveal} className="md:col-span-2 group p-8 rounded-3xl bg-white border border-gray-200/60 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                <span className="text-3xl">✉️</span>
                <h3 className="text-lg font-bold mt-4 mb-2">Lettre personnalisée</h3>
                <p className="text-sm text-gray-500">Pour CETTE entreprise. Pas un template.</p>
              </motion.div>

              <motion.div variants={reveal} className="md:col-span-2 group p-8 rounded-3xl bg-white border border-gray-200/60 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                <span className="text-3xl">🇫🇷🇧🇪</span>
                <h3 className="text-lg font-bold mt-4 mb-2">France & Belgique</h3>
                <p className="text-sm text-gray-500">CECR, 13ème mois, conventions locales natives.</p>
              </motion.div>

              {/* Full width card */}
              <motion.div variants={reveal} className="md:col-span-6 group p-8 rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:shadow-2xl hover:shadow-gray-900/20 transition-all duration-500">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-1">
                    <span className="text-3xl">🎯</span>
                    <h3 className="text-xl font-bold mt-3 mb-2">10 questions d&apos;entretien + réponses optimales</h3>
                    <p className="text-gray-400">Basées sur TON profil et CE poste. Méthode STAR, chiffres concrets, adaptées au marché local.</p>
                  </div>
                  <Link href="/signup" className="shrink-0 bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                    Essayer →
                  </Link>
                </div>
              </motion.div>
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
