"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const reveal = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } } as const;
const stagger = { visible: { transition: { staggerChildren: 0.08 } } } as const;

function Parallax({ children, offset = 30 }: { children: React.ReactNode; offset?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return <motion.div ref={ref} style={{ y }}>{children}</motion.div>;
}

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ━━━ NAV ━━━ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/60 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-[16px] font-bold tracking-tight">
            sendcv<span className="text-orange-400">.ai</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="#demo" className="hidden sm:block text-[13px] text-gray-500 hover:text-white transition-colors">Démo</Link>
            <Link href="#pricing" className="hidden sm:block text-[13px] text-gray-500 hover:text-white transition-colors">Pricing</Link>
            <Link href="/login" className="text-[13px] text-gray-500 hover:text-white transition-colors">Connexion</Link>
            <Link href="/signup" className="text-[13px] font-medium bg-orange-500 text-white px-4 py-1.5 rounded-full hover:bg-orange-600 transition-all">
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* ━━━ 001 — HERO ━━━ */}
      <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center px-6 pt-14">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="text-center max-w-4xl">
          {/* Metric badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-3 mb-10 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] text-gray-400 font-mono">60s par candidature</span>
            <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] text-gray-400 font-mono">Double scoring ATS + Recruteur</span>
            <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-400 font-mono">3 candidatures gratuites</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-[-0.03em]">
            Tu postules,
            <br />
            <span className="text-orange-500">on optimise.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-8 text-[17px] text-gray-500 max-w-lg mx-auto leading-relaxed">
            59% des CV sont filtrés par des robots. SendCV personnalise chaque candidature pour passer les filtres <em className="text-gray-400 not-italic">et</em> convaincre le recruteur.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-10">
            <HeroEmailCapture />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-6 flex items-center justify-center gap-2 text-[12px] text-gray-600">
            <div className="flex -space-x-1.5">
              {["bg-orange-500", "bg-rose-500", "bg-amber-500", "bg-red-400"].map((c, i) => (
                <div key={i} className={`w-4 h-4 rounded-full ${c} border-2 border-[#0a0a0a]`} />
              ))}
            </div>
            <span>127+ analyses cette semaine</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ━━━ 002 — DEMO ━━━ */}
      <SectionHeader num="002" title="Essaie maintenant" subtitle="Colle une offre. Regarde ce qui se passe." />
      <section id="demo" className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <LiveDemo />
        </div>
      </section>

      {/* ━━━ 003 — PROCESS : Timeline horizontale ━━━ */}
      <section className="py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-start gap-8 mb-16">
            <span className="font-mono text-[12px] text-orange-500/60 shrink-0 pt-1">003</span>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em]">Comment ça marche</h2>
              <p className="text-[15px] text-gray-500 mt-2">Un seul input. Trois résultats. 60 secondes.</p>
            </div>
          </div>

          {/* Horizontal timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                { step: "01", t: "Colle l'offre", d: "Copie-colle la description depuis Indeed, LinkedIn, ou n'importe où.", metric: "1 seul input", icon: "📋" },
                { step: "02", t: "Analyse instantanée", d: "Double scoring ATS + Recruteur. Mots-clés, salaire estimé, probabilité d'entretien.", metric: "Gratuit", icon: "📊" },
                { step: "03", t: "Candidature complète", d: "CV sur-mesure, lettre de motivation, 10 questions d'entretien avec réponses.", metric: "60 secondes", icon: "⚡" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  {/* Dot */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/30" />
                    <span className="font-mono text-[11px] text-orange-500">{s.metric}</span>
                  </div>
                  <span className="text-4xl mb-4 block">{s.icon}</span>
                  <h3 className="text-[18px] font-bold mb-2">{s.t}</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed">{s.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 004 — PRODUCT MOCKUP : Dashboard parallax ━━━ */}
      <section className="py-20 px-6">
        <Parallax offset={25}>
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1 shadow-[0_0_80px_-20px_rgba(249,115,22,0.08)]">
            <div className="rounded-xl bg-[#0f0f0f] p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-gray-700" /><div className="w-2.5 h-2.5 rounded-full bg-gray-700" /><div className="w-2.5 h-2.5 rounded-full bg-gray-700" /></div>
                <span className="text-[10px] text-gray-600 ml-2 font-mono">app.sendcv.ai — Analyse en cours</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                  <p className="text-[10px] text-gray-600 mb-1">Score ATS</p>
                  <p className="text-2xl font-bold text-orange-500">82%</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                  <p className="text-[10px] text-gray-600 mb-1">Score Recruteur</p>
                  <p className="text-2xl font-bold text-purple-400">74%</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                  <p className="text-[10px] text-gray-600 mb-1">Entretien</p>
                  <p className="text-2xl font-bold text-emerald-400">78%</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["React ✓", "TypeScript ✓", "Node.js ✓", "Agile ✓", "CI/CD ✓"].map((k) => (
                  <span key={k} className="px-2.5 py-1 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">{k}</span>
                ))}
                {["PostgreSQL ✕", "AWS ✕"].map((k) => (
                  <span key={k} className="px-2.5 py-1 rounded text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/10">{k}</span>
                ))}
              </div>
            </div>
          </div>
        </Parallax>
        <p className="text-center text-[12px] text-gray-600 mt-4">Double optimisation : filtres ATS + impact recruteur</p>
      </section>

      {/* ━━━ 005 — FEATURES : Bento grid asymétrique ━━━ */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-8 mb-14">
            <span className="font-mono text-[12px] text-orange-500/60 shrink-0 pt-1">005</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em]">Ce qui est inclus.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {/* Large */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="md:col-span-4 p-8 rounded-2xl bg-gradient-to-br from-orange-500/[0.08] to-transparent border border-orange-500/10">
              <span className="font-mono text-[11px] text-orange-500">Exclusif</span>
              <h3 className="text-2xl font-bold mt-3 mb-2">Double scoring ATS + Recruteur</h3>
              <p className="text-gray-500 max-w-md">Tu sais exactement pourquoi ta candidature va marcher — ou pas. Personne d&apos;autre ne fait les deux.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="md:col-span-2 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-[15px] font-semibold mb-1">Simulation d&apos;entretien</h3>
              <p className="text-[13px] text-gray-500">L&apos;IA joue le recruteur. Feedback en temps réel.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
              className="md:col-span-2 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-[15px] font-semibold mb-1">CV réécrit avec impact</h3>
              <p className="text-[13px] text-gray-500">Mots-clés ATS + chiffres de résultat.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="md:col-span-2 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-[15px] font-semibold mb-1">Lettre personnalisée</h3>
              <p className="text-[13px] text-gray-500">Pour cette entreprise. Pas un template.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
              className="md:col-span-2 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-[15px] font-semibold mb-1">France & Belgique</h3>
              <p className="text-[13px] text-gray-500">CECR, 13ème mois. Natif.</p>
            </motion.div>

            {/* Full width dark */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="md:col-span-6 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-[17px] font-bold mb-1">50 templates × 5 palettes = 250 combinaisons</h3>
                <p className="text-[13px] text-gray-500">Du Prestige au Terminal. Export PDF en un clic.</p>
              </div>
              <Link href="/signup" className="shrink-0 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-[13px] font-semibold hover:bg-orange-600 transition-colors">
                Voir les templates
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ━━━ 006 — PRICING ━━━ */}
      <section id="pricing" className="py-28 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-8 mb-14">
            <span className="font-mono text-[12px] text-orange-500/60 shrink-0 pt-1">006</span>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em]">Pricing</h2>
              <p className="text-[15px] text-gray-500 mt-2">Commence gratuitement. Upgrade quand tu veux.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.06]">
              <p className="font-mono text-[11px] text-gray-600 mb-4">Free</p>
              <p className="text-4xl font-bold">0€</p>
              <p className="text-[13px] text-gray-500 mt-1 mb-6">3 candidatures</p>
              <ul className="space-y-2 text-[13px] text-gray-400 mb-6">{["Analyses illimitées", "3 générations", "50 templates", "Double scoring"].map((f) => <li key={f} className="flex items-center gap-2"><span className="text-orange-500 text-[10px]">✓</span>{f}</li>)}</ul>
              <Link href="/signup" className="block w-full py-2.5 rounded-xl bg-white/[0.06] text-center text-[13px] font-medium text-gray-300 hover:bg-white/[0.1] transition-colors">Commencer</Link>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-b from-orange-500/[0.08] to-[#0a0a0a] border border-orange-500/20 relative">
              <div className="absolute -top-2.5 left-4 px-3 py-0.5 rounded-full bg-orange-500 text-[10px] font-bold text-white">Recommandé</div>
              <p className="font-mono text-[11px] text-orange-500 mb-4">Pro</p>
              <p className="text-4xl font-bold">19€<span className="text-lg font-normal text-gray-600">/mois</span></p>
              <p className="text-[13px] text-gray-500 mt-1 mb-6">Tout illimité</p>
              <ul className="space-y-2 text-[13px] text-gray-300 mb-6">{["Générations illimitées", "Simulations illimitées", "Coach IA complet", "Support prioritaire"].map((f) => <li key={f} className="flex items-center gap-2"><span className="text-orange-500 text-[10px]">✓</span>{f}</li>)}</ul>
              <Link href="/signup" className="block w-full py-2.5 rounded-xl bg-orange-500 text-center text-[13px] font-bold text-white hover:bg-orange-600 transition-colors">Passer à Pro</Link>
            </div>
            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.06]">
              <p className="font-mono text-[11px] text-gray-600 mb-4">Lifetime</p>
              <p className="text-4xl font-bold">79€</p>
              <p className="text-[13px] text-gray-500 mt-1 mb-6">Une fois, pour toujours</p>
              <ul className="space-y-2 text-[13px] text-gray-400 mb-6">{["Tout Pro inclus", "Accès à vie", "Futures features", "Zéro abo"].map((f) => <li key={f} className="flex items-center gap-2"><span className="text-orange-500 text-[10px]">✓</span>{f}</li>)}</ul>
              <Link href="/signup" className="block w-full py-2.5 rounded-xl bg-white/[0.06] text-center text-[13px] font-medium text-gray-300 hover:bg-white/[0.1] transition-colors">Acheter Lifetime</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 007 — GUARANTEE : Full-width orange ━━━ */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-3">Garantie Entretien 30 Jours.</h2>
          <p className="text-orange-100 text-[16px] mb-8">10+ candidatures, zéro entretien ? On te rembourse. Point.</p>
          <Link href="/signup" className="inline-flex bg-white text-orange-600 px-7 py-3 rounded-full font-bold text-[14px] hover:bg-orange-50 transition-all shadow-xl">
            Commencer sans risque
          </Link>
        </div>
      </section>

      {/* ━━━ 008 — FAQ ━━━ */}
      <div className="flex items-start gap-8 mb-12 max-w-4xl mx-auto px-6 pt-28">
        <span className="font-mono text-[12px] text-orange-500/60 shrink-0 pt-1">008</span>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em]">Questions & Réponses</h2>
          <p className="text-[15px] text-gray-500 mt-2">Simple. Direct.</p>
        </div>
      </div>
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          {[
            { q: "C'est quoi les 3 candidatures gratuites ?", a: "3 générations complètes : CV + lettre + 10 questions d'entretien + LinkedIn. Identiques aux utilisateurs payants." },
            { q: "C'est différent d'un générateur de CV ?", a: "Oui. Les générateurs remplissent un template. SendCV analyse l'offre et réécrit tout ton profil avec les mots-clés ATS et des métriques d'impact." },
            { q: "Ça marche en France et en Belgique ?", a: "C'est fait pour. Conventions locales, niveaux CECR, 13ème mois, ATS européens. Pas un outil US traduit." },
            { q: "Comment fonctionne la garantie ?", a: "10+ candidatures en 30 jours. Zéro entretien ? Email, remboursement complet." },
            { q: "Mes données sont en sécurité ?", a: "Données hébergées en Europe, RGPD compliant. Suppression du compte à tout moment." },
          ].map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* ━━━ FINAL CTA — Full viewport bookend ━━━ */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/[0.03] to-transparent pointer-events-none" />
        <div className="relative text-center max-w-2xl">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold leading-[0.95] tracking-[-0.02em]">
            Prêt à décrocher
            <br />
            <span className="text-orange-500">des entretiens ?</span>
          </motion.h2>
          <p className="text-gray-500 mt-8 mb-10 text-[17px]">3 candidatures gratuites. Sans carte bancaire.</p>
          <HeroEmailCapture />
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="px-6 py-10 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[14px] font-bold">sendcv<span className="text-orange-400">.ai</span></span>
          <div className="flex items-center gap-4 text-[11px] text-gray-600">
            <Link href="/legal" className="hover:text-gray-400 transition-colors">Mentions légales</Link>
            <span>·</span>
            <span>Fondé en Belgique</span>
            <span>·</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ━━━ SECTION HEADER — Platform® style ━━━
function SectionHeader({ num, title, subtitle }: { num: string; title: string; subtitle: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}
      className="px-6 pb-12 max-w-4xl mx-auto">
      <div className="flex items-start gap-8">
        <motion.span variants={reveal} className="font-mono text-[12px] text-orange-500/60 shrink-0 pt-1">{num}</motion.span>
        <div>
          <motion.h2 variants={reveal} className="text-3xl md:text-4xl font-bold tracking-[-0.02em]">{title}</motion.h2>
          <motion.p variants={reveal} className="text-[15px] text-gray-500 mt-2">{subtitle}</motion.p>
        </div>
      </div>
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
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Ton email"
        className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white/[0.06] border border-white/[0.1] text-[14px] text-white placeholder-gray-600 text-center sm:text-left focus:outline-none focus:border-orange-500/40 transition-all" />
      <button type="submit"
        className="w-full sm:w-auto px-6 py-3 rounded-full bg-orange-500 text-white font-semibold text-[14px] hover:bg-orange-600 transition-all shrink-0 cursor-pointer shadow-lg shadow-orange-500/15">
        Commencer
      </button>
    </form>
  );
}

// ━━━ TYPEWRITER ━━━
function useTypewriter(text: string, speed = 25, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), startDelay); return () => clearTimeout(t); }, [startDelay]);
  useEffect(() => { if (!started) return; setDisplayed(""); let i = 0; const t = setInterval(() => { i++; setDisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(t); }, speed); return () => clearInterval(t); }, [text, speed, started]);
  return { displayed, done: displayed.length >= text.length };
}

function scoreColor(v: number) { return v >= 70 ? "#34d399" : v >= 40 ? "#fbbf24" : "#f87171"; }

// ━━━ LIVE DEMO ━━━
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

  useEffect(() => { if (!result || phase !== "result") return; if (keywordIndex >= result.keywords.length) return; const t = setTimeout(() => setKeywordIndex((i) => i + 1), 120); return () => clearTimeout(t); }, [result, keywordIndex, phase]);

  async function handleAnalyze() {
    if (!input.trim() || input.trim().length < 50) return;
    setPhase("analyzing"); setError(null); setResult(null); setKeywordIndex(0); setAnalyzeStep(0);
    const si = setInterval(() => setAnalyzeStep((s) => Math.min(s + 1, 3)), 1200);
    const res = await fetch("/api/demo-analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobDescription: input }) });
    const data = await res.json(); clearInterval(si);
    if (!res.ok) { setError(data.error); setPhase("input"); return; }
    setResult(data); setPhase("email_gate");
  }

  function handleEmailSubmit() { if (!demoEmail.trim() || !demoEmail.includes("@")) return; setPhase("result"); }

  const charCount = input.trim().length;
  const isReady = charCount >= 50;
  const pct = Math.min(100, Math.round((charCount / 50) * 100));

  return (
    <div className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 sm:p-8">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4}
              placeholder={"Colle une offre d'emploi ici.\nL'IA l'analyse en quelques secondes."}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[14px] text-white placeholder-gray-600 leading-relaxed focus:outline-none focus:border-white/15 transition-all resize-none" />
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" animate={{ width: `${pct}%`, backgroundColor: isReady ? "#f97316" : "#374151" }} transition={{ duration: 0.3 }} />
              </div>
              <span className={`text-[11px] font-mono ${isReady ? "text-orange-400" : "text-gray-700"}`}>{charCount}/50</span>
            </div>
            {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
            <button onClick={handleAnalyze} disabled={!isReady}
              className={`mt-4 w-full py-3 rounded-xl font-medium text-[14px] transition-all cursor-pointer ${isReady ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-white/[0.03] text-gray-700 cursor-not-allowed"}`}>
              {isReady ? "Analyser gratuitement" : "Continue à coller l'offre..."}
            </button>
          </motion.div>
        )}

        {phase === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-10 flex flex-col items-center justify-center min-h-[280px]">
            <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            </motion.div>
            <p className="text-[14px] text-white font-medium mb-6">Analyse en cours</p>
            <div className="flex gap-8">
              {["Mots-clés", "ATS", "Recruteur", "Prédiction"].map((l, i) => (
                <motion.div key={i} animate={{ opacity: analyzeStep >= i ? 1 : 0.15 }} className="text-center">
                  <div className={`w-1.5 h-1.5 rounded-full mx-auto mb-1.5 ${analyzeStep >= i ? "bg-orange-500" : "bg-gray-800"}`} />
                  <p className="text-[10px] text-gray-600">{l}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "email_gate" && result && (
          <motion.div key="email_gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 sm:p-10 text-center min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <p className="text-[16px] font-semibold mb-1">{result.title}</p>
            <p className="text-[13px] text-gray-500 mb-4">ATS : <span className="text-white font-mono">{result.ats_score}%</span> · Recruteur : <span className="text-white font-mono">{result.recruiter_score}%</span></p>
            <p className="text-[14px] text-gray-400 mb-5">Entre ton email pour voir les résultats complets.</p>
            <div className="flex w-full max-w-sm gap-2">
              <input type="email" value={demoEmail} onChange={(e) => setDemoEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                placeholder="ton@email.com" className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[14px] text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/30 transition-all" />
              <button onClick={handleEmailSubmit} disabled={!demoEmail.includes("@")}
                className={`px-5 py-3 rounded-xl font-medium text-[14px] shrink-0 cursor-pointer transition-all ${demoEmail.includes("@") ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-white/[0.03] text-gray-700 cursor-not-allowed"}`}>
                Voir
              </button>
            </div>
          </motion.div>
        )}

        {phase === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div><p className="text-[16px] font-semibold">{result.title}</p><p className="text-[13px] text-gray-500">{result.company}</p></div>
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10"><p className="text-[10px] text-emerald-400/60">Salaire</p><p className="text-[13px] font-semibold text-emerald-400">{result.salary_estimate}</p></div>
            </div>
            <div className="space-y-3 mb-6">
              {[{ l: "Score ATS", v: result.ats_score, d: 0.1 }, { l: "Score Recruteur", v: result.recruiter_score, d: 0.3 }, { l: "Probabilité entretien", v: result.interview_probability, d: 0.5 }].map((s) => (
                <motion.div key={s.l} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: s.d }}>
                  <div className="flex items-center justify-between mb-1"><span className="text-[12px] text-gray-500">{s.l}</span><span className="text-[12px] font-mono" style={{ color: scoreColor(s.v) }}>{s.v}%</span></div>
                  <div className="h-[4px] bg-white/[0.04] rounded-full overflow-hidden"><motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${s.v}%`, backgroundColor: scoreColor(s.v) }} transition={{ delay: s.d + 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }} /></div>
                </motion.div>
              ))}
            </div>
            <div className="mb-6"><p className="text-[11px] text-gray-600 mb-2">Mots-clés détectés</p><div className="flex flex-wrap gap-1.5 min-h-[32px]">
              {result.keywords.slice(0, keywordIndex).map((kw, i) => (
                <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${kw.importance === "critical" ? "bg-orange-500/10 text-orange-400" : kw.importance === "important" ? "bg-white/[0.06] text-gray-300" : "bg-white/[0.03] text-gray-500"}`}>{kw.word}</motion.span>
              ))}
            </div></div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-5">
              <p className="text-[13px] text-gray-300 leading-relaxed">{insightTyped.displayed}<span className={`${insightTyped.done ? "hidden" : ""} text-orange-500 animate-pulse`}>|</span></p>
            </motion.div>
            <Link href={`/signup?email=${encodeURIComponent(demoEmail)}`} className="block w-full py-3 rounded-xl bg-orange-500 text-center text-[14px] font-semibold text-white hover:bg-orange-600 transition-all">
              Créer mon compte et recevoir le CV
            </Link>
            <p className="text-[11px] text-gray-600 text-center mt-3">3 candidatures complètes gratuites</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ━━━ FAQ ━━━
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.06]">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left cursor-pointer group">
        <span className="text-[15px] text-gray-300 group-hover:text-white transition-colors pr-4">{q}</span>
        <div className={`w-6 h-6 rounded-full border border-white/[0.1] flex items-center justify-center shrink-0 transition-all ${open ? "bg-orange-500 border-orange-500 rotate-45" : "group-hover:border-white/20"}`}>
          <span className={`text-sm ${open ? "text-white" : "text-gray-600"}`}>+</span>
        </div>
      </button>
      {open && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[14px] text-gray-500 leading-relaxed pb-5">{a}</motion.p>}
    </div>
  );
}
