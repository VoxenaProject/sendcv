"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Exp { title: string; company: string; dates: string; description: string; }
interface Edu { degree: string; school: string; dates: string; }
interface Lang { language: string; level: string; }

const CECR = ["Natif", "C2", "C1", "B2", "B1", "A2", "A1"];
const COMMON_LANGS = ["Français", "Anglais", "Néerlandais", "Allemand", "Espagnol", "Italien", "Portugais", "Arabe", "Turc", "Polonais", "Russe", "Chinois"];
const SKILL_CATS: Record<string, string[]> = {
  "Tech": ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "Git", "Docker", "AWS", "CI/CD", "Agile/Scrum"],
  "Marketing": ["SEO", "Google Ads", "Meta Ads", "Content Marketing", "Analytics", "CRM", "Copywriting", "Social Media"],
  "Finance": ["Excel avancé", "Analyse financière", "Comptabilité", "SAP", "Power BI", "Audit", "Reporting"],
  "Général": ["Gestion de projet", "Communication", "Leadership", "Problem-solving", "Travail en équipe", "Organisation"],
};

export default function SettingsPage() {
  const [fullName, setFullName] = useState(""); const [headline, setHeadline] = useState(""); const [location, setLocation] = useState(""); const [linkedinUrl, setLinkedinUrl] = useState("");
  const [exps, setExps] = useState<Exp[]>([]); const [edus, setEdus] = useState<Edu[]>([]); const [skills, setSkills] = useState<string[]>([]); const [customSkill, setCustomSkill] = useState(""); const [langs, setLangs] = useState<Lang[]>([]);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false); const [deleting, setDeleting] = useState(false); const [showDelete, setShowDelete] = useState(false);
  const [openSec, setOpenSec] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => { (async () => {
    const sb = createClient(); const { data: { user } } = await sb.auth.getUser(); if (!user) return;
    const { data } = await sb.from("profiles").select("*").eq("id", user.id).single(); if (!data) return;
    const p = data as Record<string, string | null>;
    setFullName(p.full_name || ""); setHeadline(p.headline || ""); setLocation(p.location || ""); setLinkedinUrl(p.linkedin_url || "");
    setExps((p.experience || "").split("\n\n").filter(Boolean).map((b) => { const l = b.split("\n"); const m = l[0]?.match(/^(.+?) chez (.+?) \((.+?)\)$/); return { title: m?.[1] || l[0] || "", company: m?.[2] || "", dates: m?.[3] || "", description: l.slice(1).join("\n") }; }).filter((e) => e.title));
    setEdus((p.education || "").split("\n").filter(Boolean).map((l) => { const m = l.match(/^(.+?),\s*(.+?)\s*\((.+?)\)$/); return { degree: m?.[1] || l, school: m?.[2] || "", dates: m?.[3] || "" }; }));
    setSkills((p.skills || "").split(",").map((s) => s.trim()).filter(Boolean));
    setLangs((p.languages || "").split(",").map((s) => s.trim()).filter(Boolean).map((l) => { const m = l.match(/^(.+?)\s*\((.+?)\)$/); return { language: m?.[1] || l, level: m?.[2] || "B2" }; }));
    setLoading(false);
  })(); }, []);

  async function handleSave() {
    setSaving(true); setSaved(false);
    const sb = createClient(); const { data: { user } } = await sb.auth.getUser(); if (!user) return;
    await sb.from("profiles").update({
      full_name: fullName, headline, location, linkedin_url: linkedinUrl,
      experience: exps.map((e) => `${e.title} chez ${e.company} (${e.dates})\n${e.description}`).join("\n\n") || null,
      education: edus.map((e) => `${e.degree}, ${e.school} (${e.dates})`).join("\n") || null,
      skills: skills.join(", ") || null,
      languages: langs.map((l) => `${l.language} (${l.level})`).join(", ") || null,
    }).eq("id", user.id);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch("/api/account/delete", { method: "POST" });
    const sb = createClient(); await sb.auth.signOut();
    router.push("/"); router.refresh();
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">Chargement...</div>;

  const done = [!!headline, !!location, exps.length > 0, edus.length > 0, skills.length > 0, langs.length > 0];
  const pct = Math.round((done.filter(Boolean).length / done.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-extrabold">Mon profil</h1><p className="text-xs text-gray-400 mt-0.5">Profil complet = CV personnalisé.</p></div>
        <div className="text-right"><p className={`text-2xl font-extrabold ${pct === 100 ? "text-emerald-600" : "text-indigo-600"}`}>{pct}%</p><p className="text-[10px] text-gray-400">complet</p></div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-emerald-500" : "bg-indigo-600"}`} style={{ width: `${pct}%` }} /></div>

      {/* Identity */}
      <Sec title="Identité" icon="👤" open={openSec === "id"} toggle={() => setOpenSec(openSec === "id" ? null : "id")} ok={!!headline && !!location}>
        <div className="space-y-3">
          <In label="Nom complet" value={fullName} set={setFullName} ph="Marie Dupont" />
          <In label="Titre professionnel" value={headline} set={setHeadline} ph="Développeur Full-Stack Senior" />
          <div className="grid grid-cols-2 gap-3">
            <In label="Localisation" value={location} set={setLocation} ph="Bruxelles, Belgique" sm />
            <In label="LinkedIn" value={linkedinUrl} set={setLinkedinUrl} ph="linkedin.com/in/..." sm />
          </div>
        </div>
      </Sec>

      {/* Experience */}
      <Sec title="Expérience" icon="💼" open={openSec === "exp"} toggle={() => setOpenSec(openSec === "exp" ? null : "exp")} ok={exps.length > 0} count={exps.length}>
        <div className="space-y-3">
          {exps.map((exp, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3 relative">
              <button onClick={() => setExps(exps.filter((_, j) => j !== i))} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-xs cursor-pointer">✕</button>
              <div className="grid grid-cols-2 gap-3">
                <In label="Poste" value={exp.title} set={(v) => { const c = [...exps]; c[i] = { ...c[i], title: v }; setExps(c); }} ph="Full-Stack Developer" sm />
                <In label="Entreprise" value={exp.company} set={(v) => { const c = [...exps]; c[i] = { ...c[i], company: v }; setExps(c); }} ph="TechCorp" sm />
              </div>
              <In label="Période" value={exp.dates} set={(v) => { const c = [...exps]; c[i] = { ...c[i], dates: v }; setExps(c); }} ph="Janv. 2022 — Présent" sm />
              <div><label className="block text-xs font-semibold text-gray-700 mb-1">Réalisations</label>
              <textarea value={exp.description} onChange={(e) => { const c = [...exps]; c[i] = { ...c[i], description: e.target.value }; setExps(c); }} rows={3} placeholder="Décris ce que tu as fait." className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none" /></div>
            </div>
          ))}
          <Dashed onClick={() => setExps([...exps, { title: "", company: "", dates: "", description: "" }])} label="+ Ajouter une expérience" />
        </div>
      </Sec>

      {/* Education */}
      <Sec title="Formation" icon="🎓" open={openSec === "edu"} toggle={() => setOpenSec(openSec === "edu" ? null : "edu")} ok={edus.length > 0} count={edus.length}>
        <div className="space-y-3">
          {edus.map((edu, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3 relative">
              <button onClick={() => setEdus(edus.filter((_, j) => j !== i))} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-xs cursor-pointer">✕</button>
              <In label="Diplôme" value={edu.degree} set={(v) => { const c = [...edus]; c[i] = { ...c[i], degree: v }; setEdus(c); }} ph="Master en Informatique" sm />
              <div className="grid grid-cols-2 gap-3">
                <In label="École" value={edu.school} set={(v) => { const c = [...edus]; c[i] = { ...c[i], school: v }; setEdus(c); }} ph="ULB" sm />
                <In label="Années" value={edu.dates} set={(v) => { const c = [...edus]; c[i] = { ...c[i], dates: v }; setEdus(c); }} ph="2017 — 2019" sm />
              </div>
            </div>
          ))}
          <Dashed onClick={() => setEdus([...edus, { degree: "", school: "", dates: "" }])} label="+ Ajouter une formation" />
        </div>
      </Sec>

      {/* Skills */}
      <Sec title="Compétences" icon="⚡" open={openSec === "sk"} toggle={() => setOpenSec(openSec === "sk" ? null : "sk")} ok={skills.length > 0} count={skills.length}>
        <div className="space-y-4">
          {skills.length > 0 && <div className="flex flex-wrap gap-2">{skills.map((s) => <button key={s} onClick={() => setSkills(skills.filter((x) => x !== s))} className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-medium cursor-pointer hover:bg-indigo-700 flex items-center gap-1">{s} <span className="text-indigo-300">✕</span></button>)}</div>}
          <div className="flex gap-2">
            <input value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (customSkill.trim() && !skills.includes(customSkill.trim())) { setSkills([...skills, customSkill.trim()]); setCustomSkill(""); } } }} placeholder="Ajouter..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            <button onClick={() => { if (customSkill.trim() && !skills.includes(customSkill.trim())) { setSkills([...skills, customSkill.trim()]); setCustomSkill(""); } }} className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 cursor-pointer">+</button>
          </div>
          {Object.entries(SKILL_CATS).map(([cat, items]) => <div key={cat}><p className="text-xs font-semibold text-gray-400 mb-1.5">{cat}</p><div className="flex flex-wrap gap-1.5">{items.map((s) => <button key={s} onClick={() => skills.includes(s) ? setSkills(skills.filter((x) => x !== s)) : setSkills([...skills, s])} className={`px-2.5 py-1 rounded-full text-xs cursor-pointer transition-all ${skills.includes(s) ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-indigo-200"}`}>{skills.includes(s) ? "✓ " : ""}{s}</button>)}</div></div>)}
        </div>
      </Sec>

      {/* Languages */}
      <Sec title="Langues" icon="🌍" open={openSec === "lg"} toggle={() => setOpenSec(openSec === "lg" ? null : "lg")} ok={langs.length > 0} count={langs.length}>
        <div className="space-y-4">
          {langs.map((l, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200">
              <span className="text-sm font-semibold flex-1">{l.language}</span>
              <select value={l.level} onChange={(e) => { const c = [...langs]; c[i] = { ...c[i], level: e.target.value }; setLangs(c); }} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
                {CECR.map((lv) => <option key={lv} value={lv}>{lv}</option>)}
              </select>
              <button onClick={() => setLangs(langs.filter((_, j) => j !== i))} className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-xs cursor-pointer">✕</button>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">{COMMON_LANGS.filter((l) => !langs.find((x) => x.language === l)).map((lang) => <button key={lang} onClick={() => setLangs([...langs, { language: lang, level: "B2" }])} className="px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 text-xs font-medium border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-all">+ {lang}</button>)}</div>
        </div>
      </Sec>

      {/* Save */}
      <button onClick={handleSave} disabled={saving} className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all cursor-pointer shadow-lg shadow-indigo-600/15 disabled:opacity-50">
        {saving ? "Sauvegarde..." : saved ? "✓ Sauvegardé" : "Sauvegarder les modifications"}
      </button>

      {/* Danger zone */}
      <div className="pt-4 border-t border-gray-100 space-y-2">
        <button onClick={async () => { const sb = createClient(); await sb.auth.signOut(); router.push("/"); router.refresh(); }} className="w-full py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Se déconnecter</button>
        <button onClick={() => setShowDelete(!showDelete)} className="w-full py-2.5 rounded-xl text-sm text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer">Supprimer mon compte</button>
        {showDelete && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
            <p className="text-sm font-bold text-red-800">Tu es sûr ?</p>
            <p className="text-xs text-red-600">Toutes tes données seront supprimées définitivement. Irréversible.</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer disabled:opacity-50">{deleting ? "Suppression..." : "Oui, supprimer"}</button>
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 rounded-xl bg-white text-gray-600 text-xs border border-gray-200 cursor-pointer">Annuler</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Sec({ title, icon, open, toggle, ok, count, children }: { title: string; icon: string; open: boolean; toggle: () => void; ok: boolean; count?: number; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border transition-all ${open ? "border-indigo-200 shadow-lg shadow-indigo-500/5" : "border-gray-100"}`}>
      <button onClick={toggle} className="w-full flex items-center gap-3 p-4 cursor-pointer">
        <span className="text-xl">{icon}</span><span className="flex-1 text-left font-semibold text-sm">{title}</span>
        {count !== undefined && count > 0 && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{count}</span>}
        {ok && <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center"><span className="text-[10px] text-emerald-600">✓</span></div>}
        <svg className={`w-4 h-4 text-gray-300 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function In({ label, value, set, ph, sm }: { label: string; value: string; set: (v: string) => void; ph?: string; sm?: boolean }) {
  return (<div><label className={`block font-semibold text-gray-700 mb-1 ${sm ? "text-xs" : "text-sm"}`}>{label}</label><input type="text" value={value} onChange={(e) => set(e.target.value)} placeholder={ph} className={`w-full px-3 ${sm ? "py-2 text-xs" : "py-2.5 text-sm"} rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`} /></div>);
}

function Dashed({ onClick, label }: { onClick: () => void; label: string }) {
  return <button onClick={onClick} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer font-medium">{label}</button>;
}
