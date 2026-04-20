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
  const [typed, setTyped] = useState("");
  const txt = "Nous recherchons un Développeur Full-Stack Senior (React/Node.js) pour notre équipe tech à Bruxelles. Contrat CDI, 3 à 5 ans d'expérience requis. Maîtrise TypeScript, PostgreSQL. Français et anglais courants exigés. Package salarial attractif + avantages...";
  useEffect(() => { let i = 0; const t = setInterval(() => { setTyped(txt.slice(0, i)); i++; if (i > txt.length) clearInterval(t); }, 25); return () => clearInterval(t); }, []);
  const c1 = useCounter(60); const c2 = useCounter(5);

  return (
    <div className="min-h-screen bg-white text-[#0f172a]">

      {/* ━━━ NAV ━━━ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-0.5">
            <span className="text-[22px] font-black tracking-tight">send</span>
            <span className="text-[22px] font-black tracking-tight text-indigo-600">cv</span>
            <span className="text-[9px] text-gray-300 font-semibold">.ai</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 px-3 py-2 transition-colors">Se connecter</Link>
            <Link href="/signup" className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/20">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* ━━━ 1. HERO ━━━ */}
      <section className="px-6 pt-20 pb-8 md:pt-28 md:pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={st}>
            <motion.div variants={fu} className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Entretien en 30 jours ou 100% remboursé</span>
            </motion.div>
            <motion.h1 variants={fu} className="text-[2.75rem] sm:text-[3.25rem] md:text-[3.75rem] font-extrabold leading-[1.08] tracking-tight">
              La candidature parfaite.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">En 60 secondes.</span>
            </motion.h1>
            <motion.p variants={fu} className="mt-6 text-[17px] md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              Colle une offre d&apos;emploi. L&apos;IA analyse le poste et génère ton CV sur-mesure, ta lettre de motivation et ta préparation d&apos;entretien. Tout personnalisé pour <strong className="text-gray-700">ce</strong> poste.
            </motion.p>
            <motion.div variants={fu} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-[15px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:-translate-y-0.5">
                Analyser une offre gratuitement
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </Link>
            </motion.div>
            <motion.p variants={fu} className="mt-3 text-xs text-gray-400">Analyse gratuite — pas de carte bancaire requise</motion.p>
          </motion.div>
        </div>
      </section>

      {/* ━━━ 2. TECH TRUST BAR ━━━ */}
      <section className="px-6 py-5 border-y border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><span className="text-indigo-500">●</span> Powered by Claude Opus 4.7</span>
          <span className="flex items-center gap-1.5"><span className="text-emerald-500">●</span> Données RGPD — serveurs européens</span>
          <span className="flex items-center gap-1.5"><span className="text-amber-500">●</span> Garanti 30 jours ou remboursé</span>
          <span className="flex items-center gap-1.5"><span className="text-violet-500">●</span> Adapté au marché français et belge</span>
        </div>
      </section>

      {/* ━━━ 3. PRODUCT DEMO ━━━ */}
      <section className="px-6 py-14 md:py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-2 shadow-2xl shadow-gray-200/50">
            <div className="rounded-xl bg-white p-5 sm:p-7 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-300" /><div className="w-2.5 h-2.5 rounded-full bg-amber-300" /><div className="w-2.5 h-2.5 rounded-full bg-green-300" /></div>
                <div className="flex-1 mx-3 h-7 rounded-md bg-gray-50 flex items-center px-3"><span className="text-[11px] text-gray-400">app.sendcv.ai/apply</span></div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Description de l&apos;offre d&apos;emploi</p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 min-h-[90px]">
                  <p className="text-[13px] text-gray-600 leading-relaxed">{typed}<span className="animate-pulse text-indigo-500 font-bold">|</span></p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { d: 2.0, bg: "bg-indigo-50", border: "border-indigo-100", color: "text-indigo-600", label: "MATCH SCORE", value: "87%" },
                  { d: 2.3, bg: "bg-emerald-50", border: "border-emerald-100", color: "text-emerald-600", label: "CV", value: "Généré ✓" },
                  { d: 2.6, bg: "bg-violet-50", border: "border-violet-100", color: "text-violet-600", label: "LETTRE", value: "Générée ✓" },
                  { d: 2.9, bg: "bg-amber-50", border: "border-amber-100", color: "text-amber-600", label: "ENTRETIEN", value: "10 questions ✓" },
                ].map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: c.d }}
                    className={`rounded-xl ${c.bg} border ${c.border} p-3 text-center`}
                  >
                    <p className={`text-[9px] font-bold ${c.color} uppercase tracking-wider`}>{c.label}</p>
                    <p className={`text-sm font-bold ${c.color} mt-1`}>{c.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ━━━ 4. STATS ━━━ */}
      <section className="px-6 py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div ref={c1.ref}><p className="text-3xl font-extrabold">{c1.c}s</p><p className="text-xs text-gray-400 mt-1">par candidature</p></div>
          <div ref={c2.ref}><p className="text-3xl font-extrabold">{c2.c}</p><p className="text-xs text-gray-400 mt-1">documents générés</p></div>
          <div><p className="text-3xl font-extrabold">4.90€</p><p className="text-xs text-gray-400 mt-1">par candidature</p></div>
          <div><p className="text-3xl font-extrabold text-indigo-600">30j</p><p className="text-xs text-gray-400 mt-1">garantie entretien</p></div>
        </div>
      </section>

      {/* ━━━ 5. BEFORE / AFTER ━━━ */}
      <Section label="Le problème" title={<>Tu passes <span className="text-red-500">2 heures</span> par candidature.<br /><span className="text-gray-400">Pour 5% de taux de réponse.</span></>}>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-red-100 bg-red-50/40">
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-4">Sans SendCV</p>
            {["45 min pour adapter le CV", "30 min pour la lettre de motivation", "20 min de recherche entreprise", "0 min de préparation entretien", "→ Taux de réponse : ~5%"].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-red-700/60 mb-2.5"><span className="text-red-400 text-xs">✕</span>{t}</div>
            ))}
          </Card>
          <Card className="border-emerald-100 bg-emerald-50/40">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4">Avec SendCV</p>
            {["CV sur-mesure ATS en 20 secondes", "Lettre personnalisée en 15 secondes", "Analyse complète du poste incluse", "10 questions d'entretien avec réponses", "→ Candidature parfaite. À chaque fois."].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-emerald-700/80 mb-2.5"><span className="text-emerald-500 text-xs">✓</span>{t}</div>
            ))}
          </Card>
        </div>
      </Section>

      {/* ━━━ 6. HOW IT WORKS ━━━ */}
      <Section label="Comment ça marche" title="3 étapes. Un seul input." bg>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={st} className="grid md:grid-cols-3 gap-10">
          {[
            { n: "1", t: "Colle l'offre", d: "Copie-colle la description du poste depuis Indeed, LinkedIn, Stepstone ou n'importe quel site d'emploi.", c: "bg-indigo-600" },
            { n: "2", t: "Analyse gratuite", d: "L'IA analyse le poste, calcule ton match score, identifie les mots-clés ATS et les red flags. 100% gratuit.", c: "bg-violet-600" },
            { n: "3", t: "Génère tout", d: "CV sur-mesure + lettre de motivation + 10 questions d'entretien + tips LinkedIn. 1 crédit = 1 candidature complète.", c: "bg-amber-500" },
          ].map((s, i) => (
            <motion.div key={i} variants={fu}>
              <div className={`w-12 h-12 ${s.c} text-white rounded-xl font-bold text-lg flex items-center justify-center mb-4`}>{s.n}</div>
              <h3 className="text-lg font-bold mb-2">{s.t}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-12">
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/15">
            Essayer gratuitement <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </Section>

      {/* ━━━ 7. OUTPUT PREVIEW ━━━ */}
      <Section label="Exemple de résultat" title={<>Voilà ce que SendCV génère.<br /><span className="text-gray-400">Pour chaque candidature.</span></>}>
        <div className="grid md:grid-cols-2 gap-5">
          <Card className="border-gray-200">
            <div className="flex items-center gap-2 mb-3"><span className="text-lg">📄</span><p className="font-bold text-sm">CV généré — Développeur Full-Stack</p></div>
            <div className="rounded-lg bg-gray-50 p-4 text-xs text-gray-600 leading-relaxed space-y-2 font-mono">
              <p className="font-bold text-gray-900 text-sm">Marie Dupont</p>
              <p className="text-gray-500">Bruxelles, Belgique • FR (natif), EN (C1), NL (B1)</p>
              <p className="border-t border-gray-200 pt-2 font-bold text-gray-800">PROFIL</p>
              <p>Développeuse Full-Stack avec 4 ans d&apos;expérience en React et Node.js. Spécialisée dans les architectures TypeScript/PostgreSQL. Track record de delivery en équipe agile, réduction de 40% du time-to-market sur le dernier projet.</p>
              <p className="font-bold text-gray-800">EXPERIENCE</p>
              <p className="font-semibold text-gray-700">Full-Stack Developer — TechCorp, Bruxelles (2022-present)</p>
              <p>• Migration frontend React 18 → Next.js 15, +35% performance</p>
              <p>• Implémentation CI/CD, réduction bugs production de 60%</p>
              <p className="text-gray-400 italic">... généré pour CE poste, avec les mots-clés ATS exacts</p>
            </div>
          </Card>
          <Card className="border-gray-200">
            <div className="flex items-center gap-2 mb-3"><span className="text-lg">🎯</span><p className="font-bold text-sm">Préparation entretien — Question #3</p></div>
            <div className="rounded-lg bg-gray-50 p-4 text-xs leading-relaxed space-y-2">
              <p className="font-bold text-gray-900">Q: Décrivez un projet complexe où vous avez dû faire des choix d&apos;architecture.</p>
              <p className="text-gray-500 italic">Ce qu&apos;ils évaluent : capacité de décision technique, communication, impact business.</p>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Réponse optimale</p>
                <p className="text-gray-700">Chez TechCorp, j&apos;ai piloté la migration de notre monolithe PHP vers une architecture microservices Next.js/Node.js. L&apos;enjeu : 200K utilisateurs actifs, zéro downtime. J&apos;ai proposé une migration progressive par domaine métier. Résultat : 35% de gain de performance, 60% de réduction des incidents...</p>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* ━━━ 8. FEATURES ━━━ */}
      <Section label="Ce que tu recois" title={<>Un cabinet facture 500€.<br /><span className="text-gray-400">Tu paies 4.90€.</span></>} bg>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={st} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "📄", t: "CV sur-mesure ATS", d: "Réécrit pour CE poste avec les mots-clés exacts. Optimisé pour les ATS utilisés en France et Belgique.", tag: "FR / BE" },
            { icon: "✉️", t: "Lettre de motivation", d: "Personnalisée pour cette entreprise. Éléments spécifiques de l'offre. Prête à envoyer.", tag: "Sur-mesure" },
            { icon: "🎯", t: "Préparation entretien", d: "10 questions probables + réponses optimales basées sur ton profil. Méthode STAR, chiffres concrets.", tag: "10 questions" },
            { icon: "📊", t: "Analyse du poste", d: "Salaire estimé (brut mensuel, 13ème mois en BE), red flags, culture, compétences manquantes.", tag: "Match score" },
            { icon: "🔗", t: "Optimisation LinkedIn", d: "Headline et résumé optimisés pour ce type de poste. Mots-clés du secteur pour les recruteurs.", tag: "Headline + bio" },
            { icon: "🇫🇷🇧🇪", t: "Fait pour la France et la Belgique", d: "Compétences-first en France, bilingue en Belgique, niveaux CECR, 13ème mois. Pas un outil US traduit.", tag: "FR / BE" },
          ].map((f, i) => (
            <motion.div key={i} variants={fu} className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5 shrink-0">{f.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap"><h3 className="font-bold text-[15px]">{f.t}</h3><span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">{f.tag}</span></div>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.d}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ━━━ 9. PROFESSIONS ━━━ */}
      <Section label="Ça marche pour tous les métiers" title="Quel que soit ton secteur.">
        <div className="flex flex-wrap justify-center gap-2.5">
          {[
            "Développeur", "Marketing", "Finance", "Ressources Humaines", "Design", "Commercial",
            "Santé", "Ingénieur", "Juridique", "Data & IA", "Gestion de projet", "Communication",
            "Logistique", "Éducation", "Consulting",
          ].map((p) => (
            <span key={p} className="px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all cursor-default">{p}</span>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">L&apos;IA s&apos;adapte à chaque secteur et chaque niveau d&apos;expérience, en France et en Belgique.</p>
      </Section>

      {/* ━━━ 10. COMPARISON TABLE ━━━ */}
      <Section label="Comparaison" title={<>&laquo; Il existe déjà des outils pour ça ? &raquo;</>} bg>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden max-w-3xl mx-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium w-28"></th>
              <th className="py-3 px-3 text-xs text-gray-400 font-medium text-center">CV builders<br /><span className="font-normal">(Rezi, Zety...)</span></th>
              <th className="py-3 px-3 text-xs text-gray-400 font-medium text-center">ATS scanners<br /><span className="font-normal">(Jobscan, Teal)</span></th>
              <th className="py-3 px-3 text-xs font-bold text-indigo-600 text-center bg-indigo-50/50">SendCV.ai</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {[
                ["Input", "Formulaire", "Upload + offre", "1 offre d'emploi"],
                ["Output", "1 CV", "Score ATS", "CV+Lettre+Entretien+LinkedIn"],
                ["Personnalisation", "Template rempli", "Keywords highlights", "Tout réécrit pour CE poste"],
                ["Marché FR/BE", "US traduit", "English only", "Natif français et belge"],
                ["IA", "GPT-3.5", "GPT-4", "Claude Opus 4.7"],
                ["Temps", "15-30 min", "10 min", "60 secondes"],
                ["Garantie", "—", "—", "Entretien 30j ✓"],
                ["Prix", "~$29/mois", "~$50/mois", "4.90€/candidature"],
              ].map((r, i) => (
                <tr key={i}><td className="py-2.5 px-4 font-medium text-xs text-gray-700">{r[0]}</td><td className="py-2.5 px-3 text-xs text-gray-400 text-center">{r[1]}</td><td className="py-2.5 px-3 text-xs text-gray-400 text-center">{r[2]}</td><td className="py-2.5 px-3 text-xs text-indigo-600 font-semibold text-center bg-indigo-50/20">{r[3]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ━━━ 11. TRUST & SECURITY ━━━ */}
      <Section label="Sécurité & confiance" title="Tes données sont entre de bonnes mains.">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🧠", t: "Claude Opus 4.7", d: "Le modèle IA le plus puissant du marché. Sorti le 16 avril 2026 par Anthropic." },
            { icon: "🇪🇺", t: "RGPD compliant", d: "Données hébergées en Europe. Rien n'est revendu. Tu peux supprimer ton compte à tout moment." },
            { icon: "🛡️", t: "Garantie 30 jours", d: "10+ candidatures, zéro entretien ? Remboursement complet, sans question." },
            { icon: "🇫🇷🇧🇪", t: "France & Belgique", d: "Compétences-first en France, bilingue en Belgique, niveaux CECR, 13ème mois. Adapté à ton marché." },
          ].map((t, i) => (
            <div key={i} className="text-center p-5 rounded-2xl border border-gray-200 bg-white">
              <span className="text-3xl">{t.icon}</span>
              <h3 className="font-bold text-sm mt-3 mb-1">{t.t}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{t.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ━━━ 12. TESTIMONIALS ━━━ */}
      <Section label="Premiers retours" title="Ce qu'en pensent nos bêta-testeurs." bg>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: "Sophie M.", role: "Marketing Manager, Bruxelles", quote: "J'ai envoyé 8 candidatures en un après-midi. Avant, ça me prenait une semaine. Et la lettre de motivation est vraiment personnalisée, pas un template." },
            { name: "Thomas L.", role: "Développeur, Paris", quote: "Le match score m'a évité de postuler à des offres où j'avais aucune chance. Et les questions d'entretien étaient quasi les mêmes que celles qu'on m'a posées." },
            { name: "Elena K.", role: "Business Analyst, Liège", quote: "Enfin un outil qui comprend le marché belge. Le CV généré mentionnait les langues avec les niveaux CECR et le 13ème mois dans l'estimation salariale." },
          ].map((t, i) => (
            <div key={i} className="p-5 rounded-2xl border border-gray-200 bg-white">
              <p className="text-sm text-gray-600 leading-relaxed italic mb-4">&laquo; {t.quote} &raquo;</p>
              <div><p className="font-bold text-sm">{t.name}</p><p className="text-xs text-gray-400">{t.role}</p></div>
            </div>
          ))}
        </div>
      </Section>

      {/* ━━━ 13. PRICING ━━━ */}
      <Section label="Prix" title={<>Simple. Transparent.<br /><span className="text-gray-400">Pas d&apos;abonnement. Crédits sans expiration.</span></>}>
        <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {[
            { name: "Starter", price: "19", n: 3, per: "6.33", pop: false },
            { name: "Pro", price: "49", n: 10, per: "4.90", pop: true },
            { name: "Ultra", price: "99", n: 30, per: "3.30", pop: false },
          ].map((p) => (
            <div key={p.name} className={`rounded-2xl p-6 text-center space-y-4 relative ${p.pop ? "border-2 border-indigo-600 shadow-xl shadow-indigo-600/10 bg-white md:scale-[1.03]" : "border border-gray-200 bg-white"}`}>
              {p.pop && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">Le + populaire</div>}
              <p className={`font-semibold ${p.pop ? "text-indigo-600" : "text-gray-500"}`}>{p.name}</p>
              <p className="text-4xl font-extrabold">{p.price}€</p>
              <p className="text-sm text-gray-500"><strong className="text-gray-800">{p.n}</strong> candidatures complètes</p>
              <p className={`text-xs font-semibold ${p.pop ? "text-indigo-600" : "text-gray-400"}`}>{p.per}€ / candidature</p>
              <Link href="/signup" className={`block w-full py-3 rounded-xl font-semibold text-sm transition-colors ${p.pop ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {p.pop ? "Choisir Pro" : "Commencer"}
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* ━━━ 14. GUARANTEE ━━━ */}
      <section className="px-6 py-16 bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5"><span className="text-2xl">🛡️</span></div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Garantie Entretien 30 Jours</h2>
          <p className="text-indigo-100 leading-relaxed mb-6">Envoie 10+ candidatures avec SendCV. Zéro entretien en 30 jours ? <strong className="text-white">Remboursement complet.</strong> Sans question.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg">
            Commencer sans risque <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
        </div>
      </section>

      {/* ━━━ 15. FAQ ━━━ */}
      <Section label="" title="Questions fréquentes">
        <div className="max-w-2xl mx-auto">
          {[
            { q: "L'analyse est vraiment gratuite ?", a: "Oui. Tu colles une offre, tu reçois l'analyse complète — match score, compétences, salaire, red flags. Tu ne paies que pour générer le CV + lettre + préparation entretien." },
            { q: "C'est différent d'un générateur de CV classique ?", a: "Complètement. Les générateurs remplissent un template. SendCV analyse l'offre spécifique et réécrit tout ton profil pour matcher ce poste. CV + lettre + entretien + LinkedIn en une action." },
            { q: "Ça marche pour le marché belge et français ?", a: "C'est fait pour ça. Conventions CV adaptées, langues avec niveaux CECR, salaires brut mensuel avec 13ème mois en Belgique. Pas un outil américain traduit." },
            { q: "Quelle IA est utilisée ?", a: "Claude Opus 4.7 d'Anthropic — le modèle le plus puissant du marché, sorti le 16 avril 2026. Les concurrents utilisent GPT-3.5 ou GPT-4. On utilise le meilleur." },
            { q: "Comment fonctionne la garantie ?", a: "10+ candidatures en 30 jours via SendCV. Zéro entretien ? Envoie-nous un email, remboursement complet. Pas de conditions cachées." },
            { q: "Mes crédits expirent ?", a: "Non. Utilise-les quand tu veux. Pas d'abonnement." },
            { q: "Mes données sont en sécurité ?", a: "Oui. Données hébergées en Europe, RGPD compliant. Tu peux supprimer ton compte et toutes tes données à tout moment." },
          ].map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
        </div>
      </Section>

      {/* ━━━ 16. FINAL CTA ━━━ */}
      <section className="px-6 py-20 md:py-28 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-[2.5rem] font-extrabold leading-tight">Ta prochaine candidature<br />prend 60 secondes.</h2>
          <p className="text-gray-400 mt-4 mb-8 text-lg">Pendant que tu hésites, quelqu&apos;un d&apos;autre décroche le poste.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-9 py-4 rounded-xl font-bold text-base hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:-translate-y-0.5">
            Creer mon compte gratuitement <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </Link>
          <p className="text-xs text-gray-400 mt-3">Analyse gratuite. Pas de carte bancaire.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-black">send<span className="text-indigo-600">cv</span><span className="text-gray-300 text-[10px]">.ai</span></span>
          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <Link href="/legal" className="hover:text-gray-600 transition-colors">Mentions légales & CGV</Link>
            <span>·</span>
            <span>Powered by Claude Opus 4.7</span>
            <span>·</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ━━━ Reusable components ━━━

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

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border-2 p-6 ${className}`}>{children}</div>;
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
