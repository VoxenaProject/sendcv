"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function useTypewriter(text: string, speed = 20, delay = 0) {
  const [d, setD] = useState(""); const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => { if (!go) return; setD(""); let i = 0; const t = setInterval(() => { i++; setD(text.slice(0, i)); if (i >= text.length) clearInterval(t); }, speed); return () => clearInterval(t); }, [text, speed, go]);
  return { d, done: d.length >= text.length };
}
function sc(v: number) { return v >= 70 ? "#16a34a" : v >= 40 ? "#d97706" : "#dc2626"; }

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* 1. NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">sendcv<span className="text-orange-500">.ai</span></Link>
          <div className="flex items-center gap-4">
            <Link href="#demo" className="hidden sm:block text-sm text-gray-500 hover:text-gray-900">Démo</Link>
            <Link href="#pricing" className="hidden sm:block text-sm text-gray-500 hover:text-gray-900">Pricing</Link>
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">Connexion</Link>
            <Link href="/signup" className="text-sm font-semibold bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 shadow-sm">Commencer</Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO — Douleur + email capture */}
      <section className="px-6 pt-16 pb-10 md:pt-24 md:pb-14">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-block bg-red-50 text-red-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              59% des CV ne sont jamais vus par un humain
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Marre de postuler
              <br />
              <span className="text-orange-500">dans le vide ?</span>
            </h1>
            <p className="mt-5 text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
              SendCV analyse chaque offre et crée ton CV sur-mesure, ta lettre de motivation et ta préparation d&apos;entretien. Le tout en 60 secondes.
            </p>
            <div className="mt-8"><EmailCapture /></div>
            <p className="mt-3 text-xs text-gray-400">3 candidatures gratuites · Sans carte bancaire</p>
          </motion.div>
        </div>
      </section>

      {/* 3. SOCIAL PROOF BAR */}
      <section className="px-6 py-4 border-y border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">{["bg-orange-400","bg-rose-400","bg-amber-400","bg-red-300"].map((c,i) => <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-white`} />)}</div>
            <span>127+ analyses cette semaine</span>
          </div>
          <span>·</span>
          <span>Double scoring ATS + Recruteur</span>
          <span>·</span>
          <span>France & Belgique</span>
          <span>·</span>
          <span>Garantie 30 jours</span>
        </div>
      </section>

      {/* 4. DÉMO LIVE */}
      <section id="demo" className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Essaie maintenant</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Colle une offre d&apos;emploi. Regarde ce qui se passe. Gratuit, sans compte.</p>
          <LiveDemo />
        </div>
      </section>

      {/* 5. BEFORE / AFTER */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Avant vs Après SendCV</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-white border-2 border-red-100">
              <p className="text-xs font-bold text-red-500 uppercase mb-4">Sans SendCV</p>
              {["45 min pour adapter ton CV à chaque offre","30 min pour écrire la lettre de motivation","Aucune idée si ton CV passe les filtres ATS","Zéro préparation pour l'entretien","Tu envoies le même CV partout","Taux de réponse : ~5%"].map((t,i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-800/60 mb-2"><span className="text-red-400 mt-0.5">✕</span>{t}</div>
              ))}
            </div>
            <div className="p-6 rounded-xl bg-white border-2 border-green-100">
              <p className="text-xs font-bold text-green-600 uppercase mb-4">Avec SendCV</p>
              {["CV réécrit avec les mots-clés de l'offre en 20s","Lettre personnalisée pour cette entreprise en 15s","Score ATS + Score Recruteur avant d'envoyer","10 questions d'entretien probables + réponses","Chaque candidature est unique et optimisée","Candidature parfaite à chaque fois"].map((t,i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-green-800/70 mb-2"><span className="text-green-500 mt-0.5">✓</span>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[{n:"1",t:"Colle l'offre",d:"Copie la description du poste. C'est le seul truc à faire."},{n:"2",t:"L'IA analyse",d:"Double scoring ATS + Recruteur. Mots-clés, salaire, red flags. Gratuit."},{n:"3",t:"Tout est généré",d:"CV, lettre, 10 questions d'entretien, tips LinkedIn. PDF en 1 clic."}].map((s,i) => (
              <div key={i}>
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">{s.n}</div>
                <h3 className="font-bold mb-1">{s.t}</h3>
                <p className="text-sm text-gray-500">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/signup" className="inline-block bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-600">Commencer gratuitement</Link>
          </div>
        </div>
      </section>

      {/* 7. MOCKUP #1 — Double Score */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Double scoring : ATS + Recruteur</h2>
          <p className="text-center text-gray-500 text-sm mb-8">Les autres outils ne vérifient que l&apos;ATS. Nous, on optimise aussi pour l&apos;humain qui lit ton CV.</p>
          <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-lg">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">Score ATS (robots)</p>
                <div className="space-y-2">{[{l:"Mots-clés",v:85},{l:"Format",v:92},{l:"Complétude",v:78}].map(s => (
                  <div key={s.l}><div className="flex justify-between text-xs mb-0.5"><span className="text-gray-500">{s.l}</span><span className="font-bold" style={{color:sc(s.v)}}>{s.v}%</span></div><div className="h-2 bg-gray-100 rounded-full"><div className="h-full rounded-full transition-all" style={{width:`${s.v}%`,backgroundColor:sc(s.v)}} /></div></div>
                ))}</div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">Score Recruteur (humain)</p>
                <div className="space-y-2">{[{l:"Impact chiffré",v:72},{l:"Spécificité",v:80},{l:"Pertinence",v:88}].map(s => (
                  <div key={s.l}><div className="flex justify-between text-xs mb-0.5"><span className="text-gray-500">{s.l}</span><span className="font-bold" style={{color:sc(s.v)}}>{s.v}%</span></div><div className="h-2 bg-gray-100 rounded-full"><div className="h-full rounded-full transition-all" style={{width:`${s.v}%`,backgroundColor:sc(s.v)}} /></div></div>
                ))}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-1.5">
              {["React ✓","TypeScript ✓","Node.js ✓","Agile ✓","CI/CD ✓"].map(k => <span key={k} className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-[11px] font-medium">{k}</span>)}
              {["PostgreSQL ✕","AWS ✕"].map(k => <span key={k} className="px-2 py-0.5 rounded bg-red-50 text-red-600 text-[11px] font-medium">{k}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FEATURES */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Tout ce qui est inclus</h2>
          <p className="text-center text-gray-500 text-sm mb-10">Chaque candidature. Pas juste un CV.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {t:"CV réécrit avec impact",d:"L'IA réécrit chaque ligne avec les mots-clés ATS et des chiffres de résultat."},
              {t:"Lettre de motivation",d:"Personnalisée pour cette entreprise. Pas un template. Prête à envoyer."},
              {t:"10 questions d'entretien",d:"Les plus probables pour ce poste. Méthode STAR. Réponses optimales."},
              {t:"Simulation d'entretien",d:"L'IA joue le recruteur. Tu réponds. Feedback en temps réel."},
              {t:"50 templates CV + PDF",d:"10 designs × 5 couleurs. Du Prestige au Terminal. Export PDF en 1 clic."},
              {t:"France & Belgique",d:"Conventions CV locales, niveaux CECR, 13ème mois. Pas un outil US traduit."},
            ].map((f,i) => (
              <div key={i} className="p-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <h3 className="font-bold text-sm mb-1">{f.t}</h3>
                <p className="text-sm text-gray-500">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. MOCKUP #2 — CV généré */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Le CV que l&apos;IA génère pour toi</h2>
          <p className="text-center text-gray-500 text-sm mb-8">Pas un template rempli. Un CV réécrit pour CE poste, avec tes mots-clés ATS surlignés.</p>
          <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-lg font-mono text-sm leading-relaxed">
            <p className="font-bold text-base text-gray-900 mb-0.5">Marie Dupont</p>
            <p className="text-gray-500 text-xs mb-3">Bruxelles, Belgique · FR (natif), EN (C1), NL (B1)</p>
            <p className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1 mt-3">Profil</p>
            <p className="text-gray-600">Développeuse Full-Stack avec 4 ans d&apos;expérience en <mark className="bg-green-100 text-green-800 px-0.5 rounded">React</mark> et <mark className="bg-green-100 text-green-800 px-0.5 rounded">Node.js</mark>. Spécialisée dans les architectures <mark className="bg-green-100 text-green-800 px-0.5 rounded">TypeScript</mark>/PostgreSQL. Réduction de 40% du time-to-market.</p>
            <p className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1 mt-3">Expérience</p>
            <p className="font-semibold text-gray-700">Full-Stack Developer — TechCorp, Bruxelles</p>
            <p className="text-gray-600">• Migration <mark className="bg-green-100 text-green-800 px-0.5 rounded">React</mark> 18 → Next.js 15, <strong>+35% performance</strong></p>
            <p className="text-gray-600">• Implémentation <mark className="bg-green-100 text-green-800 px-0.5 rounded">CI/CD</mark>, <strong>réduction bugs production -60%</strong></p>
            <p className="text-gray-600">• Mentorat de 3 développeurs juniors, <strong>100% promus en 12 mois</strong></p>
            <p className="text-gray-400 text-xs italic mt-2">↑ Les mots-clés ATS de l&apos;offre sont surlignés en vert</p>
          </div>
        </div>
      </section>

      {/* 10. PROFESSIONS */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Ça marche pour tous les métiers</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {["Développeur","Marketing","Finance","RH","Design","Commercial","Santé","Ingénieur","Juridique","Data & IA","Gestion de projet","Communication","Consulting","Logistique","Éducation"].map(p => (
              <span key={p} className="px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all cursor-default">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 11. MOCKUP #3 — Dashboard */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Ton dashboard</h2>
          <p className="text-center text-gray-500 text-sm mb-8">Toutes tes candidatures au même endroit. Scores, statuts, historique.</p>
          <div className="rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden">
            {/* Fake nav */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50 text-xs">
              <span className="font-bold">sendcv<span className="text-orange-500">.ai</span></span>
              <span className="text-gray-400">Dashboard</span>
              <span className="text-gray-400">Offres</span>
              <span className="text-gray-400">Templates</span>
              <span className="ml-auto bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold">Pro ✓</span>
            </div>
            {/* Content */}
            <div className="p-5">
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[{v:"Pro",l:"Plan"},{v:"12",l:"Analysées"},{v:"8",l:"Générées"},{v:"3",l:"Entretiens"}].map(s => (
                  <div key={s.l} className="p-3 rounded-lg bg-gray-50 text-center"><p className="text-lg font-bold">{s.v}</p><p className="text-[10px] text-gray-400">{s.l}</p></div>
                ))}
              </div>
              <div className="space-y-2">
                {[{t:"Développeur Full-Stack",c:"TechCorp",s:87,st:"Entretien"},{t:"Product Manager",c:"StartupBE",s:62,st:"Postulé"},{t:"Lead Dev React",c:"FinTech Paris",s:91,st:"Générée"}].map((a,i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${a.s >= 70 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>{a.s}%</div>
                    <div className="flex-1"><p className="font-semibold text-sm">{a.t}</p><p className="text-xs text-gray-400">{a.c}</p></div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${a.st === "Entretien" ? "bg-green-50 text-green-600" : a.st === "Postulé" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}>{a.st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. PRICING */}
      <section id="pricing" className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Pricing simple</h2>
          <p className="text-center text-gray-500 text-sm mb-10">Commence gratuitement. Upgrade quand tu veux. Annule quand tu veux.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <PriceCard name="Free" price="0€" sub="3 candidatures" features={["Analyses illimitées","3 générations","50 templates","Double scoring","1 simulation"]} />
            <PriceCard name="Pro" price="19€" priceSub="/mois" sub="Tout illimité" popular features={["Générations illimitées","Simulations illimitées","Coach IA complet","Support prioritaire"]} cta="Passer à Pro" />
            <PriceCard name="Lifetime" price="79€" sub="Une fois, pour toujours" features={["Tout Pro inclus","Accès à vie","Futures features","Zéro abonnement"]} cta="Acheter" />
          </div>
        </div>
      </section>

      {/* 13. TESTIMONIALS */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Ce qu&apos;en pensent nos premiers utilisateurs</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {name:"Sophie M.",role:"Marketing Manager, Bruxelles",quote:"J'ai envoyé 8 candidatures en un après-midi. Avant, ça me prenait une semaine. Et la lettre est vraiment personnalisée, pas un template."},
              {name:"Thomas L.",role:"Développeur, Paris",quote:"Le match score m'a évité de postuler à des offres où j'avais aucune chance. Et les questions d'entretien étaient quasi les mêmes que celles qu'on m'a posées."},
              {name:"Elena K.",role:"Business Analyst, Liège",quote:"Enfin un outil qui comprend le marché belge. Le CV mentionnait les langues avec les niveaux CECR et le 13ème mois dans l'estimation salariale."},
            ].map((t,i) => (
              <div key={i} className="p-5 rounded-xl bg-white border border-gray-200">
                <p className="text-sm text-gray-600 italic mb-4">&laquo; {t.quote} &raquo;</p>
                <p className="font-bold text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. GUARANTEE */}
      <section className="px-6 py-12 bg-orange-500 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Garantie Entretien 30 Jours</h2>
        <p className="text-orange-100 mb-6">10+ candidatures, zéro entretien ? On te rembourse. Sans question.</p>
        <Link href="/signup" className="inline-block bg-white text-orange-600 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-50">Commencer sans risque</Link>
      </section>

      {/* 15. FAQ */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          {[
            {q:"C'est quoi les 3 candidatures gratuites ?",a:"CV personnalisé + lettre + 10 questions d'entretien + LinkedIn. Identiques aux utilisateurs payants. Pas de version limitée."},
            {q:"C'est différent d'un générateur de CV ?",a:"Complètement. Les générateurs remplissent un template. SendCV analyse l'offre et réécrit tout ton profil avec les mots-clés ATS et des métriques d'impact."},
            {q:"Ça marche en France et en Belgique ?",a:"C'est fait pour. Conventions CV locales, langues avec niveaux CECR, salaires brut mensuel avec 13ème mois en Belgique."},
            {q:"Quelle IA est utilisée ?",a:"La plus puissante du marché. Les concurrents utilisent GPT-3.5. Nous utilisons un modèle de dernière génération pour chaque génération."},
            {q:"Comment fonctionne la garantie ?",a:"10+ candidatures en 30 jours via SendCV. Zéro entretien ? Email-nous, remboursement complet. Pas de conditions cachées."},
            {q:"Mes données sont en sécurité ?",a:"Données hébergées en Europe, RGPD compliant. Suppression du compte et de toutes les données à tout moment."},
            {q:"Je peux annuler l'abonnement Pro ?",a:"Oui. En 1 clic dans les paramètres. Pas de frais cachés. Tu repasses en Free."},
          ].map((f,i) => <FAQ key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* 16. FINAL CTA */}
      <section className="px-6 py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-extrabold mb-2">Prêt à décrocher des entretiens ?</h2>
        <p className="text-gray-500 mb-6">3 candidatures gratuites. Sans carte bancaire.</p>
        <EmailCapture />
      </section>

      {/* 17. FOOTER */}
      <footer className="px-6 py-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span className="font-bold text-sm text-gray-600">sendcv<span className="text-orange-500">.ai</span></span>
          <div className="flex gap-3">
            <Link href="/legal" className="hover:text-gray-600">Mentions légales</Link>
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

// ━━━ EMAIL CAPTURE ━━━
function EmailCapture() {
  const [email, setEmail] = useState(""); const router = useRouter();
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) router.push(`/signup?email=${encodeURIComponent(email)}`); }}
      className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Ton email"
        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-500" />
      <button type="submit" className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 cursor-pointer shadow-sm">Commencer</button>
    </form>
  );
}

// ━━━ PRICE CARD ━━━
function PriceCard({name,price,priceSub,sub,features,popular,cta}:{name:string;price:string;priceSub?:string;sub:string;features:string[];popular?:boolean;cta?:string}) {
  return (
    <div className={`p-6 rounded-xl text-center ${popular ? "bg-white border-2 border-orange-500 shadow-lg relative" : "bg-white border border-gray-200"}`}>
      {popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">Recommandé</div>}
      <p className={`font-semibold mb-2 ${popular ? "text-orange-600" : "text-gray-500"}`}>{name}</p>
      <p className="text-4xl font-extrabold">{price}{priceSub && <span className="text-base font-normal text-gray-400">{priceSub}</span>}</p>
      <p className="text-sm text-gray-400 mt-1 mb-4">{sub}</p>
      <ul className="text-sm text-gray-600 space-y-1.5 mb-4 text-left">{features.map(f => <li key={f} className="flex gap-2"><span className="text-orange-500">✓</span>{f}</li>)}</ul>
      <Link href="/signup" className={`block w-full py-2.5 rounded-lg text-sm font-semibold ${popular ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{cta || "Commencer"}</Link>
    </div>
  );
}

// ━━━ LIVE DEMO ━━━
function LiveDemo() {
  const [input,setInput] = useState(""); const [phase,setPhase] = useState<"input"|"loading"|"email"|"result">("input");
  const [demoEmail,setDemoEmail] = useState(""); const [error,setError] = useState<string|null>(null);
  const [result,setResult] = useState<{title:string;company:string;salary_estimate:string;keywords:{word:string;importance:string}[];ats_score:number;recruiter_score:number;interview_probability:number;top_insight:string}|null>(null);
  const [kwIdx,setKwIdx] = useState(0);
  const typed = useTypewriter(result?.top_insight||"",20,1200);
  useEffect(() => { if (!result||phase!=="result"||kwIdx>=result.keywords.length) return; const t = setTimeout(() => setKwIdx(i=>i+1),120); return ()=>clearTimeout(t); },[result,kwIdx,phase]);

  async function analyze() {
    if (input.trim().length<50) return; setPhase("loading"); setError(null); setResult(null); setKwIdx(0);
    const res = await fetch("/api/demo-analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jobDescription:input})});
    const data = await res.json(); if(!res.ok){setError(data.error);setPhase("input");return;} setResult(data); setPhase("email");
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <AnimatePresence mode="wait">
        {phase==="input" && (
          <motion.div key="i" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-5">
            <textarea value={input} onChange={e=>setInput(e.target.value)} rows={4} placeholder="Colle une offre d'emploi ici. L'IA l'analyse instantanément."
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-500 resize-none" />
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs ${input.trim().length>=50?"text-green-600":"text-gray-400"}`}>{input.trim().length}/50</span>
              <button onClick={analyze} disabled={input.trim().length<50}
                className={`px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer ${input.trim().length>=50?"bg-orange-500 text-white hover:bg-orange-600":"bg-gray-100 text-gray-400"}`}>Analyser</button>
            </div>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </motion.div>
        )}
        {phase==="loading" && (
          <motion.div key="l" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-10 text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Analyse en cours...</p>
          </motion.div>
        )}
        {phase==="email" && result && (
          <motion.div key="e" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3 font-bold">✓</div>
            <p className="font-bold">{result.title}</p>
            <p className="text-sm text-gray-500 mb-1">{result.company}</p>
            <p className="text-sm text-gray-500 mb-4">ATS: <strong>{result.ats_score}%</strong> · Recruteur: <strong>{result.recruiter_score}%</strong></p>
            <p className="text-sm text-gray-600 mb-3">Entre ton email pour voir tous les détails.</p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input type="email" value={demoEmail} onChange={e=>setDemoEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&demoEmail.includes("@")&&setPhase("result")}
                placeholder="ton@email.com" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-500" />
              <button onClick={()=>demoEmail.includes("@")&&setPhase("result")} disabled={!demoEmail.includes("@")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer ${demoEmail.includes("@")?"bg-orange-500 text-white":"bg-gray-100 text-gray-400"}`}>Voir</button>
            </div>
          </motion.div>
        )}
        {phase==="result" && result && (
          <motion.div key="r" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div><p className="font-bold">{result.title}</p><p className="text-sm text-gray-500">{result.company}</p></div>
              <p className="text-sm font-semibold text-green-600">{result.salary_estimate}</p>
            </div>
            <div className="space-y-2 mb-4">
              {[{l:"Score ATS",v:result.ats_score},{l:"Score Recruteur",v:result.recruiter_score},{l:"Probabilité entretien",v:result.interview_probability}].map(s=>(
                <div key={s.l}><div className="flex justify-between text-xs mb-0.5"><span className="text-gray-500">{s.l}</span><span className="font-bold" style={{color:sc(s.v)}}>{s.v}%</span></div>
                <div className="h-1.5 bg-gray-100 rounded-full"><motion.div className="h-full rounded-full" initial={{width:0}} animate={{width:`${s.v}%`,backgroundColor:sc(s.v)}} transition={{duration:0.8}} /></div></div>
              ))}
            </div>
            <div className="mb-4"><p className="text-xs text-gray-400 mb-1">Mots-clés</p><div className="flex flex-wrap gap-1">{result.keywords.slice(0,kwIdx).map((kw,i)=>(
              <motion.span key={i} initial={{opacity:0}} animate={{opacity:1}} className={`px-2 py-0.5 rounded text-xs ${kw.importance==="critical"?"bg-orange-50 text-orange-700":"bg-gray-50 text-gray-600"}`}>{kw.word}</motion.span>
            ))}</div></div>
            <div className="p-3 rounded-lg bg-gray-50 mb-4"><p className="text-sm text-gray-700">{typed.d}<span className={`${typed.done?"hidden":""} text-orange-500`}>|</span></p></div>
            <Link href={`/signup?email=${encodeURIComponent(demoEmail)}`} className="block w-full py-2.5 rounded-lg bg-orange-500 text-white text-sm font-bold text-center hover:bg-orange-600">
              Créer mon compte — 3 candidatures gratuites
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ━━━ FAQ ━━━
function FAQ({q,a}:{q:string;a:string}) {
  const [open,setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button onClick={()=>setOpen(!open)} className="w-full flex justify-between items-center py-4 text-left cursor-pointer">
        <span className="font-semibold text-sm pr-4">{q}</span>
        <span className={`text-gray-400 transition-transform ${open?"rotate-45":""}`}>+</span>
      </button>
      {open && <p className="text-sm text-gray-500 pb-4">{a}</p>}
    </div>
  );
}
