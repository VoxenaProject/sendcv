"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

function useCounter(end: number, dur = 2000) {
  const [c, setC] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = ref.current; if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.3 }); o.observe(el); return () => o.disconnect(); }, []);
  useEffect(() => { if (!go) return; let n = 0; const s = end / (dur / 16); const t = setInterval(() => { n += s; if (n >= end) { setC(end); clearInterval(t); } else setC(Math.floor(n)); }, 16); return () => clearInterval(t); }, [go, end, dur]);
  return { c, ref };
}

const fu = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } } as const;
const st = { visible: { transition: { staggerChildren: 0.07 } } } as const;

export default function Landing() {
  const c1 = useCounter(59);
  const c2 = useCounter(22);
  const c3 = useCounter(3);

  return (
    <div className="min-h-screen bg-white text-[#0f172a]">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-0.5">
            <span className="text-[22px] font-black tracking-tight">send</span>
            <span className="text-[22px] font-black tracking-tight text-indigo-600">cv</span>
            <span className="text-[9px] text-gray-300 font-semibold">.ai</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 px-3 py-2">Connexion</Link>
            <Link href="/signup" className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/20">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* ━━━ HERO — PAIN FIRST ━━━ */}
      <section className="px-6 pt-16 pb-6 md:pt-24 md:pb-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={st}>
            <motion.div variants={fu} className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-8">
              <span className="text-xs font-semibold text-red-700">59% de tes candidatures ne sont jamais vues par un humain</span>
            </motion.div>

            <motion.h1 variants={fu} className="text-[2.75rem] sm:text-[3.25rem] md:text-[3.75rem] font-extrabold leading-[1.08] tracking-tight">
              Arrête d&apos;envoyer
              <br />
              <span className="text-red-500 line-through decoration-red-300/50">le même CV partout</span>
            </motion.h1>

            <motion.p variants={fu} className="mt-6 text-xl md:text-2xl font-bold text-gray-800">
              SendCV personnalise <span className="text-indigo-600 underline decoration-indigo-300 underline-offset-4">chaque candidature</span> en 60 secondes.
            </motion.p>

            <motion.p variants={fu} className="mt-4 text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
              Colle une offre. L&apos;IA génère ton CV sur-mesure, ta lettre de motivation et ta préparation d&apos;entretien — optimisés pour passer les filtres automatiques ET convaincre le recruteur.
            </motion.p>

            <motion.div variants={fu} className="mt-8">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-[15px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:-translate-y-0.5">
                3 candidatures gratuites — Créer mon compte
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
              <p className="mt-3 text-xs text-gray-400">Pas de carte bancaire. 3 candidatures complètes offertes.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━ PRODUCT MOCKUP — REAL UI ━━━ */}
      <section className="px-6 pb-16">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-2 shadow-2xl shadow-gray-200/50">
            <div className="rounded-xl bg-white overflow-hidden">
              {/* Fake app header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-[#fafbfc]">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-300" /><div className="w-2.5 h-2.5 rounded-full bg-amber-300" /><div className="w-2.5 h-2.5 rounded-full bg-green-300" /></div>
                <div className="flex gap-4 text-[11px]">
                  <span className="text-indigo-600 font-semibold">Dashboard</span>
                  <span className="text-gray-400 font-medium">Candidature</span>
                  <span className="text-gray-400 font-medium">Templates</span>
                </div>
              </div>
              {/* Double score */}
              <div className="p-5 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div><p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Score ATS</p><p className="text-[10px] text-gray-400">Filtres automatiques</p></div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 font-extrabold text-lg">82</div>
                  </div>
                  <div className="space-y-1.5">
                    <ScoreBar label="Mots-clés" pct={85} color="bg-emerald-500" />
                    <ScoreBar label="Format" pct={90} color="bg-emerald-500" />
                    <ScoreBar label="Complétude" pct={72} color="bg-amber-500" />
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div><p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Score Recruteur</p><p className="text-[10px] text-gray-400">Impact humain</p></div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 font-extrabold text-lg">74</div>
                  </div>
                  <div className="space-y-1.5">
                    <ScoreBar label="Impact chiffré" pct={68} color="bg-indigo-500" />
                    <ScoreBar label="Spécificité" pct={75} color="bg-indigo-500" />
                    <ScoreBar label="Pertinence" pct={80} color="bg-indigo-500" />
                  </div>
                </div>
              </div>
              {/* Keywords */}
              <div className="px-5 pb-5">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Mots-clés de l&apos;offre</p>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "TypeScript", "Node.js", "Agile", "CI/CD"].map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-700">✓ {k}</span>
                  ))}
                  {["PostgreSQL", "AWS"].map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 border border-red-200 text-red-600">✕ {k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">L&apos;IA analyse chaque offre et double-optimise : pour les robots (ATS) ET pour le recruteur humain.</p>
        </motion.div>
      </section>

      {/* ━━━ STAT BAR — REAL DATA ━━━ */}
      <section className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div ref={c1.ref}><p className="text-3xl md:text-4xl font-extrabold">{c1.c}%</p><p className="text-xs text-gray-400 mt-1">des CV filtrés par les robots avant un humain</p></div>
          <div ref={c2.ref}><p className="text-3xl md:text-4xl font-extrabold">{c2.c}%</p><p className="text-xs text-gray-400 mt-1">d&apos;offres fictives en Belgique</p></div>
          <div ref={c3.ref}><p className="text-3xl md:text-4xl font-extrabold">{c3.c}</p><p className="text-xs text-gray-400 mt-1">candidatures gratuites pour tester</p></div>
        </div>
      </section>

      {/* ━━━ BEFORE / AFTER ━━━ */}
      <Section label="Le problème" title={<>Tu personnalises chaque candidature ?<br /><span className="text-gray-400">Ça prend 2 heures. À chaque fois.</span></>}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-red-100 bg-red-50/40 p-6 space-y-3">
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Aujourd&apos;hui</p>
            {["45 min pour adapter le CV à chaque offre", "30 min pour la lettre de motivation", "Aucune idée des mots-clés ATS à utiliser", "Zéro préparation pour l'entretien", "→ Taux de réponse : ~5%"].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-red-700/60"><span className="text-red-400 text-xs">✕</span>{t}</div>
            ))}
          </div>
          <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/40 p-6 space-y-3">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Avec SendCV</p>
            {["CV réécrit avec les mots-clés exacts de l'offre", "Lettre personnalisée pour cette entreprise", "Score ATS + Score Recruteur avant d'envoyer", "10 questions d'entretien probables + réponses", "→ Candidature optimisée. À chaque fois."].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-emerald-700/80"><span className="text-emerald-500 text-xs">✓</span>{t}</div>
            ))}
          </div>
        </div>
      </Section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <Section label="Comment ça marche" title="1 offre. 60 secondes. Tout est fait." bg>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={st} className="grid md:grid-cols-3 gap-10">
          {[
            { n: "1", t: "Colle l'offre", d: "Copie la description depuis Indeed, LinkedIn, StepStone ou n'importe où. C'est le seul input.", c: "bg-indigo-600" },
            { n: "2", t: "L'IA analyse", d: "Double scoring ATS + Recruteur. Mots-clés matchés. Salaire estimé. Red flags détectés. Gratuit.", c: "bg-violet-600" },
            { n: "3", t: "Tout est généré", d: "CV sur-mesure + lettre + 10 questions d'entretien + tips LinkedIn. Télécharge en PDF.", c: "bg-amber-500" },
          ].map((s, i) => (
            <motion.div key={i} variants={fu}>
              <div className={`w-12 h-12 ${s.c} text-white rounded-xl font-bold text-lg flex items-center justify-center mb-4`}>{s.n}</div>
              <h3 className="text-lg font-bold mb-2">{s.t}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-12">
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/15">
            Essayer gratuitement — 3 candidatures offertes <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </Section>

      {/* ━━━ WHAT YOU GET — CV MOCKUP ━━━ */}
      <Section label="Ce que tu reçois" title={<>Pas un template.<br /><span className="text-gray-400">Un CV réécrit pour CE poste.</span></>}>
        <div className="grid md:grid-cols-2 gap-5">
          {/* CV preview */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-lg">
            <div className="flex items-center gap-2 mb-3"><span className="text-lg">📄</span><p className="font-bold text-sm">CV généré — Développeur Full-Stack</p></div>
            <div className="rounded-lg bg-gray-50 p-4 text-xs text-gray-600 leading-relaxed space-y-2 font-mono">
              <p className="font-bold text-gray-900 text-sm">Marie Dupont</p>
              <p className="text-gray-500">Bruxelles • FR (natif), EN (C1), NL (B1)</p>
              <p className="border-t border-gray-200 pt-2 font-bold text-gray-800">PROFIL</p>
              <p>Développeuse Full-Stack avec 4 ans d&apos;expérience en <span className="bg-emerald-100 text-emerald-700 px-0.5 rounded">React</span> et <span className="bg-emerald-100 text-emerald-700 px-0.5 rounded">Node.js</span>. Réduction de 40% du time-to-market.</p>
              <p className="font-bold text-gray-800">EXPÉRIENCE</p>
              <p>• Migration <span className="bg-emerald-100 text-emerald-700 px-0.5 rounded">React</span> 18 → Next.js 15, <strong>+35% performance</strong></p>
              <p>• <span className="bg-emerald-100 text-emerald-700 px-0.5 rounded">CI/CD</span> implémenté, <strong>réduction bugs -60%</strong></p>
              <p className="text-gray-400 italic text-[10px]">Mots-clés ATS surlignés en vert</p>
            </div>
          </div>
          {/* Interview preview */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-lg">
            <div className="flex items-center gap-2 mb-3"><span className="text-lg">🎯</span><p className="font-bold text-sm">Préparation entretien</p></div>
            <div className="rounded-lg bg-gray-50 p-4 text-xs leading-relaxed space-y-3">
              <div>
                <p className="font-bold text-gray-900">Q3: Décrivez un projet complexe.</p>
                <p className="text-gray-400 italic text-[10px] mt-0.5">Évalue : décision technique, impact business</p>
                <div className="bg-emerald-50 rounded-lg p-2.5 border border-emerald-100 mt-2">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Réponse suggérée</p>
                  <p className="text-gray-700 mt-1">Chez TechCorp, j&apos;ai piloté la migration vers Next.js pour 200K utilisateurs. Résultat : +35% perf, -60% incidents...</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="font-bold text-gray-900">🎤 Simulation d&apos;entretien</p>
                <p className="text-gray-500 mt-1">L&apos;IA joue le recruteur. Tu t&apos;entraînes en conditions réelles.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ━━━ FEATURES GRID ━━━ */}
      <Section label="Tout compris" title="Ce qu'aucun autre outil ne fait." bg>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={st} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "📊", t: "Double scoring", d: "Score ATS (robots) + Score Recruteur (humain). Tu sais exactement pourquoi ta candidature va marcher — ou pas." },
            { icon: "📄", t: "CV réécrit, pas rempli", d: "L'IA réécrit CHAQUE bullet point avec des chiffres d'impact. Pas un template. Un CV fait pour CE poste." },
            { icon: "✉️", t: "Lettre qui se démarque", d: "Personnalisée pour cette entreprise. Mentionne des éléments spécifiques de l'offre. Prête à envoyer." },
            { icon: "🎯", t: "10 questions d'entretien", d: "Les questions les plus probables + les réponses optimales basées sur TON profil." },
            { icon: "🎤", t: "Simulation d'entretien", d: "L'IA joue le recruteur. Tu réponds en conditions réelles. Feedback instantané." },
            { icon: "🇫🇷🇧🇪", t: "Fait pour la France et la Belgique", d: "Compétences-first en France. Bilingue en Belgique. Niveaux CECR. 13ème mois. Pas un outil US traduit." },
          ].map((f, i) => (
            <motion.div key={i} variants={fu} className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="font-bold text-[15px] mt-3 mb-1.5 group-hover:text-indigo-700 transition-colors">{f.t}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ━━━ PROFESSIONS ━━━ */}
      <Section label="Tous les métiers" title="Quel que soit ton secteur.">
        <div className="flex flex-wrap justify-center gap-2.5">
          {["Développeur", "Marketing", "Finance", "RH", "Design", "Commercial", "Santé", "Ingénieur", "Juridique", "Data & IA", "Gestion de projet", "Communication", "Logistique", "Éducation", "Consulting"].map((p) => (
            <span key={p} className="px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all cursor-default">{p}</span>
          ))}
        </div>
      </Section>

      {/* ━━━ PRICING ━━━ */}
      <Section label="Prix" title={<>Commence gratuitement.<br /><span className="text-gray-400">Upgrade quand tu veux.</span></>} bg>
        <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          <PriceCard name="Free" price="0€" sub="Pour tester" features={["3 candidatures complètes", "1 simulation d'entretien", "50 templates CV", "Export PDF", "Double scoring"]} />
          <PriceCard name="Pro" price="19€" priceSub="/mois" sub="Tout illimité" popular features={["Générations illimitées", "Simulations illimitées", "Coach IA complet", "Support prioritaire"]} cta="Passer à Pro" />
          <PriceCard name="Lifetime" price="79€" priceSub=" une fois" sub="Pour toujours" features={["Tout Pro inclus", "Paiement unique", "Accès à vie", "Futures features incluses"]} cta="Acheter Lifetime" dark />
        </div>
      </Section>

      {/* ━━━ GUARANTEE ━━━ */}
      <section className="px-6 py-16 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5"><span className="text-2xl">🛡️</span></div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Garantie Entretien 30 Jours</h2>
          <p className="text-indigo-100 leading-relaxed mb-6">Envoie 10+ candidatures avec SendCV. Zéro entretien en 30 jours ? <strong className="text-white">Remboursement complet.</strong></p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg">
            Commencer sans risque <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </section>

      {/* ━━━ FAQ ━━━ */}
      <Section label="" title="Questions fréquentes">
        <div className="max-w-2xl mx-auto">
          {[
            { q: "C'est quoi les 3 candidatures gratuites ?", a: "Tu reçois 3 générations complètes : CV personnalisé + lettre de motivation + 10 questions d'entretien + tips LinkedIn. Exactement comme les utilisateurs payants. Pas de version limitée." },
            { q: "C'est différent d'un générateur de CV ?", a: "Complètement. Les générateurs remplissent un template. SendCV analyse l'offre spécifique et réécrit tout ton profil pour matcher ce poste. CV + lettre + entretien en une action." },
            { q: "Ça marche pour le marché belge et français ?", a: "C'est fait pour ça. Conventions CV adaptées, langues avec niveaux CECR, salaires brut mensuel avec 13ème mois en Belgique. Pas un outil américain traduit." },
            { q: "Comment fonctionne la garantie ?", a: "10+ candidatures en 30 jours via SendCV. Zéro entretien ? Envoie-nous un email, remboursement complet." },
            { q: "Mes données sont en sécurité ?", a: "Oui. Données hébergées en Europe, RGPD compliant. Tu peux supprimer ton compte et toutes tes données à tout moment." },
          ].map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
        </div>
      </Section>

      {/* ━━━ FINAL CTA ━━━ */}
      <section className="px-6 py-20 md:py-28 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-[2.5rem] font-extrabold leading-tight">Prêt à décrocher des entretiens ?</h2>
          <p className="text-gray-400 mt-4 mb-8 text-lg">3 candidatures gratuites. Pas de carte bancaire.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-9 py-4 rounded-xl font-bold text-base hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:-translate-y-0.5">
            Créer mon compte gratuitement <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-black">send<span className="text-indigo-600">cv</span><span className="text-gray-300 text-[10px]">.ai</span></span>
          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <Link href="/legal" className="hover:text-gray-600 transition-colors">Mentions légales & CGV</Link>
            <span>·</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ━━━ Components ━━━

function Section({ label, title, children, bg }: { label: string; title: React.ReactNode; children: React.ReactNode; bg?: boolean }) {
  return (
    <section className={`px-6 py-20 md:py-28 ${bg ? "bg-gray-50 border-y border-gray-100" : ""}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={st} className="text-center mb-14">
          {label && <motion.p variants={fu} className="text-xs font-bold text-indigo-600 uppercase tracking-[0.15em] mb-2">{label}</motion.p>}
          <motion.h2 variants={fu} className="text-3xl md:text-[2.5rem] font-extrabold leading-tight">{title}</motion.h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function ScoreBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} /></div>
      <span className="text-[10px] font-mono text-gray-500 w-6 text-right">{pct}</span>
    </div>
  );
}

function PriceCard({ name, price, priceSub, sub, features, popular, cta, dark }: {
  name: string; price: string; priceSub?: string; sub: string; features: string[]; popular?: boolean; cta?: string; dark?: boolean;
}) {
  return (
    <div className={`rounded-3xl p-7 text-center relative ${popular ? "border-2 border-indigo-600 shadow-xl shadow-indigo-600/10 bg-white md:scale-[1.04]" : "border border-gray-200 bg-white"}`}>
      {popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-full">Recommandé</div>}
      <p className={`font-semibold ${popular ? "text-indigo-600" : "text-gray-500"}`}>{name}</p>
      <div className="mt-3 mb-1"><span className="text-4xl font-extrabold">{price}</span>{priceSub && <span className="text-gray-400 text-sm">{priceSub}</span>}</div>
      <p className="text-sm text-gray-400 mb-5">{sub}</p>
      <ul className="space-y-2 mb-6 text-left">
        {features.map((f, i) => <li key={i} className="flex items-center gap-2 text-sm"><span className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center text-[9px] text-indigo-600 shrink-0">✓</span><span className="text-gray-600">{f}</span></li>)}
      </ul>
      <Link href="/signup" className={`block w-full py-3 rounded-2xl font-bold text-sm transition-all ${
        popular ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/15" :
        dark ? "bg-gray-900 text-white hover:bg-gray-800" :
        "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}>
        {cta || "Commencer gratuitement"}
      </Link>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left cursor-pointer group">
        <span className="font-semibold text-sm text-gray-800 group-hover:text-indigo-600 transition-colors pr-4">{q}</span>
        <span className={`text-gray-300 text-xl transition-transform duration-200 shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-500 leading-relaxed pb-4">{a}</motion.p>}
    </div>
  );
}
