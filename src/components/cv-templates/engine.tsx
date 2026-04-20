"use client";

import type { StructuredCV } from "@/types";

// ━━━ PALETTES ━━━
export const PALETTES = {
  indigo:  { primary: "#4338ca", dark: "#312e81", light: "#eef2ff", accent: "#6366f1", muted: "#818cf8" },
  noir:    { primary: "#18181b", dark: "#09090b", light: "#f4f4f5", accent: "#3f3f46", muted: "#71717a" },
  emerald: { primary: "#047857", dark: "#064e3b", light: "#ecfdf5", accent: "#059669", muted: "#34d399" },
  marine:  { primary: "#1e3a5f", dark: "#0c1e33", light: "#eff6ff", accent: "#2563eb", muted: "#60a5fa" },
  bordeaux:{ primary: "#7f1d1d", dark: "#450a0a", light: "#fef2f2", accent: "#b91c1c", muted: "#f87171" },
} as const;
export type PaletteKey = keyof typeof PALETTES;
export const PALETTE_KEYS = Object.keys(PALETTES) as PaletteKey[];

// ━━━ PRESETS ━━━
export interface TemplatePreset {
  key: string;
  name: string;
  description: string;
  category: string;
}

export const PRESETS: TemplatePreset[] = [
  { key: "prestige", name: "Prestige", description: "Bandeau sombre, typographie premium. Postes de direction.", category: "Direction" },
  { key: "neon", name: "Néon", description: "Sidebar vibrante avec barres de compétences. Tech et créatif.", category: "Tech" },
  { key: "epure", name: "Épuré", description: "Minimalisme extrême. Beaucoup de blanc. Design et architecture.", category: "Design" },
  { key: "structure", name: "Structure", description: "Header en bloc couleur, grille rigoureuse. Finance et conseil.", category: "Finance" },
  { key: "bold", name: "Bold", description: "Nom en XXL, sections audacieuses. Commercial et marketing.", category: "Commercial" },
  { key: "terminal", name: "Terminal", description: "Esthétique dev. Fond sombre, monospace. Développeurs.", category: "Tech" },
  { key: "elegant", name: "Élégant", description: "Lignes fines, espacement généreux. Luxe et communication.", category: "Communication" },
  { key: "timeline", name: "Timeline", description: "Frise chronologique visuelle. RH, éducation, gestion de projet.", category: "RH" },
  { key: "grid", name: "Grid", description: "Bento-style, modules sur fond gris. Ingénierie et data.", category: "Ingénieur" },
  { key: "duo", name: "Duo", description: "Header gradient + deux colonnes. Polyvalent et moderne.", category: "Polyvalent" },
];

type P = typeof PALETTES[PaletteKey];
type Props = { cv: StructuredCV; p: P };

export function CVTemplateEngine({ cv, preset, palette }: { cv: StructuredCV; preset: TemplatePreset; palette: PaletteKey }) {
  const p = PALETTES[palette];
  const render: Record<string, (props: Props) => React.ReactNode> = { prestige: Prestige, neon: Neon, epure: Epure, structure: Structure, bold: Bold, terminal: Terminal, elegant: Elegant, timeline: Timeline, grid: Grid, duo: Duo };
  const Component = render[preset.key] || Prestige;
  return <>{Component({ cv, p })}</>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. PRESTIGE — Bandeau sombre premium
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Prestige({ cv, p }: Props) {
  return (
    <div style={{ width: "210mm", minHeight: "297mm", fontFamily: "'Palatino Linotype', Palatino, Georgia, serif", color: "#1a1a1a", background: "#fff" }}>
      <div style={{ background: p.dark, color: "#fff", padding: "28px 36px 24px" }}>
        <h1 style={{ fontSize: "28pt", fontWeight: 400, margin: 0, letterSpacing: "3px", textTransform: "uppercase" }}>{cv.full_name}</h1>
        <div style={{ width: "40px", height: "2px", background: p.muted, margin: "10px 0" }} />
        <p style={{ fontSize: "11pt", color: p.muted, letterSpacing: "1px", margin: 0 }}>{cv.headline}</p>
        <p style={{ fontSize: "8pt", color: "rgba(255,255,255,0.4)", margin: "8px 0 0" }}>{[cv.location, cv.email, cv.linkedin].filter(Boolean).join("  ·  ")}</p>
      </div>
      <div style={{ padding: "24px 36px" }}>
        {cv.summary && <p style={{ fontSize: "10pt", color: "#444", lineHeight: 1.6, borderLeft: `3px solid ${p.primary}`, paddingLeft: "14px", margin: "0 0 20px", fontStyle: "italic" }}>{cv.summary}</p>}
        {cv.experiences?.length > 0 && <><SH text="Expérience" color={p.primary} />
        {cv.experiences.map((exp, i) => (
          <div key={i} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: i < cv.experiences.length - 1 ? "1px solid #eee" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><h3 style={{ fontSize: "11pt", fontWeight: 700, margin: 0 }}>{exp.title}</h3><span style={{ fontSize: "8pt", color: "#999", fontStyle: "italic" }}>{exp.dates}</span></div>
            <p style={{ fontSize: "9pt", color: p.primary, margin: "2px 0 6px", fontWeight: 600 }}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
            {exp.bullets.map((b, j) => <p key={j} style={{ fontSize: "9pt", color: "#555", margin: "0 0 3px", paddingLeft: "12px" }}>— {b}</p>)}
          </div>))}</>}
        <div style={{ display: "flex", gap: "30px" }}>
          <div style={{ flex: 1 }}>{cv.education?.length > 0 && <><SH text="Formation" color={p.primary} />{cv.education.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><p style={{ fontSize: "9.5pt", fontWeight: 700, margin: 0 }}>{e.degree}</p><p style={{ fontSize: "8.5pt", color: "#777", margin: 0 }}>{e.school} — {e.dates}</p></div>)}</>}</div>
          <div style={{ flex: 1 }}>
            {cv.skills?.length > 0 && <><SH text="Compétences" color={p.primary} /><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{cv.skills.map((s, i) => <span key={i} style={{ fontSize: "8pt", padding: "3px 10px", border: `1px solid ${p.primary}30`, borderRadius: "2px", color: p.dark }}>{s}</span>)}</div></>}
            {cv.languages?.length > 0 && <div style={{ marginTop: "14px" }}><SH text="Langues" color={p.primary} />{cv.languages.map((l, i) => <p key={i} style={{ fontSize: "9pt", margin: "0 0 2px" }}>{l.language} <span style={{ color: "#999" }}>— {l.level}</span></p>)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━ 2. NÉON — Sidebar vibrante ━━━
function Neon({ cv, p }: Props) {
  return (
    <div style={{ width: "210mm", minHeight: "297mm", display: "flex", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1e293b", background: "#fff" }}>
      <div style={{ width: "72mm", background: p.dark, color: "#fff", padding: "28px 18px" }}>
        <h1 style={{ fontSize: "20pt", fontWeight: 800, margin: 0, lineHeight: 1.1 }}>{cv.full_name}</h1>
        <p style={{ fontSize: "9pt", color: p.muted, fontWeight: 600, margin: "6px 0 20px" }}>{cv.headline}</p>
        <ST text="Contact" color={p.muted} />
        <div style={{ fontSize: "8pt", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>{cv.location && <p style={{ margin: 0 }}>{cv.location}</p>}{cv.email && <p style={{ margin: 0 }}>{cv.email}</p>}{cv.linkedin && <p style={{ margin: 0 }}>{cv.linkedin}</p>}</div>
        {cv.skills?.length > 0 && <div style={{ marginTop: "20px" }}><ST text="Compétences" color={p.muted} />{cv.skills.slice(0, 8).map((s, i) => <div key={i} style={{ marginBottom: "8px" }}><p style={{ fontSize: "8pt", margin: "0 0 3px", color: "rgba(255,255,255,0.8)" }}>{s}</p><div style={{ height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}><div style={{ height: "3px", background: p.muted, borderRadius: "2px", width: `${90 - i * 7}%` }} /></div></div>)}</div>}
        {cv.languages?.length > 0 && <div style={{ marginTop: "20px" }}><ST text="Langues" color={p.muted} />{cv.languages.map((l, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "8pt", marginBottom: "4px" }}><span style={{ color: "rgba(255,255,255,0.8)" }}>{l.language}</span><span style={{ color: p.muted }}>{l.level}</span></div>)}</div>}
      </div>
      <div style={{ flex: 1, padding: "28px 24px" }}>
        {cv.summary && <div style={{ marginBottom: "20px", padding: "12px", background: p.light, borderRadius: "6px" }}><p style={{ fontSize: "9.5pt", color: "#475569", margin: 0, lineHeight: 1.5 }}>{cv.summary}</p></div>}
        {cv.experiences?.length > 0 && <><SH text="Expérience" color={p.primary} />{cv.experiences.map((exp, i) => <div key={i} style={{ marginBottom: "14px", paddingLeft: "12px", borderLeft: `2px solid ${p.primary}20` }}><div style={{ display: "flex", justifyContent: "space-between" }}><h3 style={{ fontSize: "10.5pt", fontWeight: 700, margin: 0 }}>{exp.title}</h3><span style={{ fontSize: "7.5pt", color: "#94a3b8" }}>{exp.dates}</span></div><p style={{ fontSize: "9pt", color: p.accent, fontWeight: 600, margin: "1px 0 5px" }}>{exp.company}</p>{exp.bullets.map((b, j) => <p key={j} style={{ fontSize: "9pt", color: "#64748b", margin: "0 0 2px" }}>• {b}</p>)}</div>)}</>}
        {cv.education?.length > 0 && <><SH text="Formation" color={p.primary} />{cv.education.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><p style={{ fontSize: "9.5pt", fontWeight: 700, margin: 0 }}>{e.degree}</p><p style={{ fontSize: "8.5pt", color: "#94a3b8", margin: 0 }}>{e.school} — {e.dates}</p></div>)}</>}
      </div>
    </div>
  );
}

// ━━━ 3. ÉPURÉ — Minimalisme ━━━
function Epure({ cv, p }: Props) {
  return (
    <div style={{ width: "210mm", minHeight: "297mm", padding: "36mm 28mm", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#1a1a1a", background: "#fff" }}>
      <h1 style={{ fontSize: "32pt", fontWeight: 200, margin: 0, letterSpacing: "4px" }}>{cv.full_name}</h1>
      <p style={{ fontSize: "10pt", color: p.primary, margin: "6px 0 0", fontWeight: 500, letterSpacing: "2px" }}>{cv.headline}</p>
      <p style={{ fontSize: "8pt", color: "#bbb", margin: "10px 0 0", letterSpacing: "1px" }}>{[cv.location, cv.email, cv.linkedin].filter(Boolean).join("  |  ")}</p>
      <div style={{ width: "100%", height: "1px", background: `${p.primary}20`, margin: "24px 0" }} />
      {cv.summary && <p style={{ fontSize: "10pt", color: "#666", lineHeight: 1.7, margin: "0 0 30px", maxWidth: "460px" }}>{cv.summary}</p>}
      {cv.experiences?.length > 0 && <><SH2 text="Expérience" color={p.primary} />{cv.experiences.map((exp, i) => <div key={i} style={{ marginBottom: "20px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: "10.5pt", fontWeight: 600 }}>{exp.title}</span><span style={{ fontSize: "8pt", color: "#ccc" }}>{exp.dates}</span></div><p style={{ fontSize: "9pt", color: p.muted, margin: "2px 0 8px" }}>{exp.company}</p>{exp.bullets.map((b, j) => <p key={j} style={{ fontSize: "9pt", color: "#777", margin: "0 0 3px", lineHeight: 1.5 }}>{b}</p>)}</div>)}</>}
      <div style={{ display: "flex", gap: "40px" }}>
        <div style={{ flex: 1 }}>{cv.education?.length > 0 && <><SH2 text="Formation" color={p.primary} />{cv.education.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><p style={{ fontSize: "9.5pt", fontWeight: 600, margin: 0 }}>{e.degree}</p><p style={{ fontSize: "8.5pt", color: "#aaa", margin: 0 }}>{e.school}, {e.dates}</p></div>)}</>}</div>
        <div style={{ flex: 1 }}>{cv.skills?.length > 0 && <><SH2 text="Compétences" color={p.primary} /><p style={{ fontSize: "9pt", color: "#777", lineHeight: 1.8 }}>{cv.skills.join("  ·  ")}</p></>}{cv.languages?.length > 0 && <div style={{ marginTop: "16px" }}><SH2 text="Langues" color={p.primary} />{cv.languages.map((l, i) => <p key={i} style={{ fontSize: "9pt", color: "#777", margin: "0 0 2px" }}>{l.language} — {l.level}</p>)}</div>}</div>
      </div>
    </div>
  );
}

// ━━━ 4. STRUCTURE — Header bloc ━━━
function Structure({ cv, p }: Props) {
  return (
    <div style={{ width: "210mm", minHeight: "297mm", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1e293b", background: "#fff" }}>
      <div style={{ background: p.primary, color: "#fff", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div><h1 style={{ fontSize: "24pt", fontWeight: 800, margin: 0 }}>{cv.full_name}</h1><p style={{ fontSize: "10pt", color: "rgba(255,255,255,0.7)", margin: "4px 0 0" }}>{cv.headline}</p></div>
        <div style={{ textAlign: "right", fontSize: "8pt", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{cv.location && <p style={{ margin: 0 }}>{cv.location}</p>}{cv.email && <p style={{ margin: 0 }}>{cv.email}</p>}</div>
      </div>
      <div style={{ padding: "20px 32px" }}>
        {cv.summary && <p style={{ fontSize: "9.5pt", color: "#475569", lineHeight: 1.6, margin: "0 0 18px", padding: "10px 14px", background: "#f8fafc", borderRadius: "4px" }}>{cv.summary}</p>}
        {cv.experiences?.length > 0 && <><SH text="Expérience professionnelle" color={p.primary} />{cv.experiences.map((exp, i) => <div key={i} style={{ marginBottom: "14px", display: "flex", gap: "16px" }}><div style={{ width: "90px", textAlign: "right", fontSize: "7.5pt", color: "#94a3b8", paddingTop: "2px", flexShrink: 0 }}>{exp.dates}</div><div style={{ flex: 1, paddingLeft: "16px", borderLeft: `2px solid ${p.primary}20` }}><h3 style={{ fontSize: "10pt", fontWeight: 700, margin: 0 }}>{exp.title}</h3><p style={{ fontSize: "8.5pt", color: p.accent, fontWeight: 600, margin: "1px 0 4px" }}>{exp.company}</p>{exp.bullets.map((b, j) => <p key={j} style={{ fontSize: "8.5pt", color: "#64748b", margin: "0 0 2px" }}>• {b}</p>)}</div></div>)}</>}
        <div style={{ display: "flex", gap: "24px", marginTop: "6px" }}>
          <div style={{ flex: 1 }}>{cv.education?.length > 0 && <><SH text="Formation" color={p.primary} />{cv.education.map((e, i) => <div key={i} style={{ marginBottom: "6px" }}><p style={{ fontSize: "9pt", fontWeight: 700, margin: 0 }}>{e.degree}</p><p style={{ fontSize: "8pt", color: "#94a3b8", margin: 0 }}>{e.school}, {e.dates}</p></div>)}</>}</div>
          <div style={{ flex: 1 }}>{cv.skills?.length > 0 && <><SH text="Compétences" color={p.primary} /><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{cv.skills.map((s, i) => <span key={i} style={{ fontSize: "7.5pt", padding: "2px 8px", background: p.light, color: p.dark, borderRadius: "3px" }}>{s}</span>)}</div></>}{cv.languages?.length > 0 && <div style={{ marginTop: "12px" }}><SH text="Langues" color={p.primary} />{cv.languages.map((l, i) => <p key={i} style={{ fontSize: "8.5pt", margin: "0 0 2px" }}>{l.language} — <span style={{ color: "#94a3b8" }}>{l.level}</span></p>)}</div>}</div>
        </div>
      </div>
    </div>
  );
}

// ━━━ 5. BOLD — Nom XXL ━━━
function Bold({ cv, p }: Props) {
  return (
    <div style={{ width: "210mm", minHeight: "297mm", padding: "24px 32px", fontFamily: "Arial, sans-serif", color: "#111", background: "#fff" }}>
      <h1 style={{ fontSize: "42pt", fontWeight: 900, margin: 0, lineHeight: 0.95, letterSpacing: "-1px" }}>{cv.full_name.toUpperCase()}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "8px 0 20px" }}><div style={{ height: "4px", width: "40px", background: p.primary, borderRadius: "2px" }} /><p style={{ fontSize: "11pt", color: p.primary, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "2px" }}>{cv.headline}</p></div>
      <p style={{ fontSize: "8pt", color: "#999", letterSpacing: "1px" }}>{[cv.location, cv.email, cv.linkedin].filter(Boolean).join("  ·  ")}</p>
      {cv.summary && <div style={{ margin: "20px 0", padding: "14px 18px", background: p.dark, color: "#fff", borderRadius: "6px" }}><p style={{ fontSize: "10pt", margin: 0, lineHeight: 1.5 }}>{cv.summary}</p></div>}
      {cv.experiences?.map((exp, i) => <div key={i} style={{ marginBottom: "16px" }}><div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}><h3 style={{ fontSize: "13pt", fontWeight: 900, margin: 0 }}>{exp.title}</h3><span style={{ fontSize: "8pt", color: p.primary, fontWeight: 700 }}>{exp.company}</span><span style={{ flex: 1, borderBottom: "1px dotted #ddd" }} /><span style={{ fontSize: "8pt", color: "#aaa" }}>{exp.dates}</span></div><div style={{ marginTop: "6px" }}>{exp.bullets.map((b, j) => <p key={j} style={{ fontSize: "9pt", color: "#555", margin: "0 0 2px", paddingLeft: "16px" }}>▸ {b}</p>)}</div></div>)}
      <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
        <div style={{ flex: 1 }}><SH text="Formation" color={p.primary} />{cv.education?.map((e, i) => <div key={i} style={{ marginBottom: "6px" }}><p style={{ fontSize: "9pt", fontWeight: 700, margin: 0 }}>{e.degree}</p><p style={{ fontSize: "8pt", color: "#888", margin: 0 }}>{e.school} · {e.dates}</p></div>)}</div>
        <div style={{ flex: 1 }}><SH text="Compétences" color={p.primary} /><p style={{ fontSize: "9pt", color: "#555", lineHeight: 1.7 }}>{cv.skills?.join(" · ")}</p>{cv.languages?.length > 0 && <div style={{ marginTop: "12px" }}><SH text="Langues" color={p.primary} />{cv.languages.map((l, i) => <p key={i} style={{ fontSize: "9pt", color: "#555", margin: "0 0 2px" }}>{l.language} — {l.level}</p>)}</div>}</div>
      </div>
    </div>
  );
}

// ━━━ 6. TERMINAL — Dev aesthetic ━━━
function Terminal({ cv, p }: Props) {
  return (
    <div style={{ width: "210mm", minHeight: "297mm", padding: "20px 28px", fontFamily: "'Cascadia Code', 'Fira Code', 'Courier New', monospace", fontSize: "8.5pt", color: "#e2e8f0", background: "#0f172a" }}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}><div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} /><div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#eab308" }} /><div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} /><span style={{ fontSize: "7pt", color: "#475569", marginLeft: "8px" }}>~/{cv.full_name.toLowerCase().replace(/\s+/g, "-")}/cv.md</span></div>
      <p style={{ color: "#22c55e", marginBottom: "2px" }}>$ cat profile.yml</p>
      <h1 style={{ fontSize: "22pt", fontWeight: 700, margin: "4px 0", color: "#fff" }}>{cv.full_name}</h1>
      <p style={{ color: p.muted, margin: "0 0 4px" }}>{cv.headline}</p>
      <p style={{ color: "#475569", fontSize: "7.5pt" }}>{[cv.location, cv.email].filter(Boolean).join(" | ")}</p>
      {cv.summary && <div style={{ margin: "14px 0", padding: "10px 12px", background: "#1e293b", borderRadius: "4px", borderLeft: `3px solid ${p.muted}` }}><p style={{ color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{cv.summary}</p></div>}
      <p style={{ color: "#22c55e", margin: "16px 0 6px" }}>$ cat experience.log</p>
      {cv.experiences?.map((exp, i) => <div key={i} style={{ marginBottom: "12px", paddingLeft: "12px", borderLeft: "1px solid #334155" }}><p style={{ color: "#fff", fontWeight: 700, margin: 0 }}>{exp.title} <span style={{ color: p.muted }}>@{exp.company}</span> <span style={{ color: "#475569" }}>[{exp.dates}]</span></p>{exp.bullets.map((b, j) => <p key={j} style={{ color: "#94a3b8", margin: "2px 0", paddingLeft: "8px" }}>→ {b}</p>)}</div>)}
      <p style={{ color: "#22c55e", margin: "16px 0 6px" }}>$ echo $SKILLS</p>
      <p style={{ color: "#fbbf24" }}>[{cv.skills?.map((s) => `"${s}"`).join(", ")}]</p>
      <p style={{ color: "#22c55e", margin: "16px 0 6px" }}>$ cat languages.yml</p>
      {cv.languages?.map((l, i) => <p key={i} style={{ color: "#94a3b8", margin: "0 0 2px" }}>- {l.language}: <span style={{ color: p.muted }}>{l.level}</span></p>)}
      <p style={{ color: "#22c55e", margin: "16px 0 6px" }}>$ cat education.md</p>
      {cv.education?.map((e, i) => <p key={i} style={{ color: "#94a3b8", margin: "0 0 4px" }}>## {e.degree} <span style={{ color: "#475569" }}>| {e.school} | {e.dates}</span></p>)}
    </div>
  );
}

// ━━━ 7. ÉLÉGANT — Raffinement ━━━
function Elegant({ cv, p }: Props) {
  return (
    <div style={{ width: "210mm", minHeight: "297mm", padding: "30mm 24mm", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#1a1a1a", background: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "26pt", fontWeight: 300, margin: 0, letterSpacing: "6px", textTransform: "uppercase" }}>{cv.full_name}</h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", margin: "12px 0" }}><div style={{ flex: 1, height: "1px", background: p.primary }} /><p style={{ fontSize: "9pt", color: p.primary, letterSpacing: "3px", margin: 0, fontWeight: 600 }}>{cv.headline.toUpperCase()}</p><div style={{ flex: 1, height: "1px", background: p.primary }} /></div>
        <p style={{ fontSize: "8pt", color: "#999", letterSpacing: "2px" }}>{[cv.location, cv.email, cv.linkedin].filter(Boolean).join("   ◆   ")}</p>
      </div>
      {cv.summary && <p style={{ fontSize: "10.5pt", color: "#555", lineHeight: 1.7, textAlign: "center", fontStyle: "italic", margin: "0 30px 24px", borderTop: `1px solid ${p.primary}30`, borderBottom: `1px solid ${p.primary}30`, padding: "14px 0" }}>{cv.summary}</p>}
      {cv.experiences?.length > 0 && <><SH3 text="Parcours professionnel" color={p.primary} />{cv.experiences.map((exp, i) => <div key={i} style={{ marginBottom: "16px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><h3 style={{ fontSize: "11pt", fontWeight: 600, margin: 0, fontStyle: "italic" }}>{exp.title}</h3><span style={{ fontSize: "8pt", color: "#bbb" }}>{exp.dates}</span></div><p style={{ fontSize: "9pt", color: p.accent, margin: "1px 0 6px", fontWeight: 600, letterSpacing: "1px" }}>{exp.company}</p>{exp.bullets.map((b, j) => <p key={j} style={{ fontSize: "9pt", color: "#666", margin: "0 0 3px", lineHeight: 1.5, paddingLeft: "14px" }}>— {b}</p>)}</div>)}</>}
      <div style={{ display: "flex", gap: "30px" }}>
        <div style={{ flex: 1 }}>{cv.education?.length > 0 && <><SH3 text="Formation" color={p.primary} />{cv.education.map((e, i) => <div key={i} style={{ marginBottom: "8px" }}><p style={{ fontSize: "9.5pt", fontWeight: 600, fontStyle: "italic", margin: 0 }}>{e.degree}</p><p style={{ fontSize: "8.5pt", color: "#999", margin: 0 }}>{e.school} — {e.dates}</p></div>)}</>}</div>
        <div style={{ flex: 1 }}>{cv.skills?.length > 0 && <><SH3 text="Compétences" color={p.primary} /><p style={{ fontSize: "9pt", color: "#666", lineHeight: 1.8, fontStyle: "italic" }}>{cv.skills.join("  ·  ")}</p></>}{cv.languages?.length > 0 && <div style={{ marginTop: "14px" }}><SH3 text="Langues" color={p.primary} />{cv.languages.map((l, i) => <p key={i} style={{ fontSize: "9pt", color: "#666", margin: "0 0 2px", fontStyle: "italic" }}>{l.language} — {l.level}</p>)}</div>}</div>
      </div>
    </div>
  );
}

// ━━━ 8. TIMELINE — Frise chrono ━━━
function Timeline({ cv, p }: Props) {
  return (
    <div style={{ width: "210mm", minHeight: "297mm", padding: "22mm 20mm", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1e293b", background: "#fff" }}>
      <h1 style={{ fontSize: "24pt", fontWeight: 800, margin: 0 }}>{cv.full_name}</h1>
      <p style={{ fontSize: "10pt", color: p.primary, fontWeight: 600, margin: "4px 0 0" }}>{cv.headline}</p>
      <p style={{ fontSize: "8pt", color: "#94a3b8", margin: "6px 0 20px" }}>{[cv.location, cv.email].filter(Boolean).join(" · ")}</p>
      {cv.summary && <p style={{ fontSize: "9.5pt", color: "#64748b", lineHeight: 1.5, margin: "0 0 22px", paddingBottom: "14px", borderBottom: "1px solid #e2e8f0" }}>{cv.summary}</p>}
      {cv.experiences?.length > 0 && <><SH text="Expérience" color={p.primary} />{cv.experiences.map((exp, i) => <div key={i} style={{ display: "flex", gap: "14px", marginBottom: "16px" }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20px", flexShrink: 0 }}><div style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.primary, border: `2px solid ${p.light}`, boxShadow: `0 0 0 2px ${p.primary}` }} />{i < cv.experiences.length - 1 && <div style={{ flex: 1, width: "2px", background: `${p.primary}20`, marginTop: "4px" }} />}</div><div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between" }}><h3 style={{ fontSize: "10pt", fontWeight: 700, margin: 0 }}>{exp.title}</h3><span style={{ fontSize: "7.5pt", color: "#94a3b8", background: "#f8fafc", padding: "2px 8px", borderRadius: "10px" }}>{exp.dates}</span></div><p style={{ fontSize: "9pt", color: p.accent, fontWeight: 600, margin: "1px 0 4px" }}>{exp.company}</p>{exp.bullets.map((b, j) => <p key={j} style={{ fontSize: "8.5pt", color: "#64748b", margin: "0 0 2px" }}>• {b}</p>)}</div></div>)}</>}
      <div style={{ display: "flex", gap: "24px" }}>
        <div style={{ flex: 1 }}>{cv.education?.length > 0 && <><SH text="Formation" color={p.primary} />{cv.education.map((e, i) => <div key={i} style={{ marginBottom: "6px" }}><p style={{ fontSize: "9pt", fontWeight: 700, margin: 0 }}>{e.degree}</p><p style={{ fontSize: "8pt", color: "#94a3b8", margin: 0 }}>{e.school} · {e.dates}</p></div>)}</>}</div>
        <div style={{ flex: 1 }}>{cv.skills?.length > 0 && <><SH text="Compétences" color={p.primary} /><div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>{cv.skills.map((s, i) => <span key={i} style={{ fontSize: "7.5pt", padding: "2px 8px", background: p.light, color: p.dark, borderRadius: "10px" }}>{s}</span>)}</div></>}{cv.languages?.length > 0 && <div style={{ marginTop: "10px" }}><SH text="Langues" color={p.primary} />{cv.languages.map((l, i) => <p key={i} style={{ fontSize: "8.5pt", margin: "0 0 2px" }}>{l.language} — {l.level}</p>)}</div>}</div>
      </div>
    </div>
  );
}

// ━━━ 9. GRID — Bento modules ━━━
function Grid({ cv, p }: Props) {
  return (
    <div style={{ width: "210mm", minHeight: "297mm", padding: "18mm 16mm", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", color: "#1e293b", background: "#f8fafc" }}>
      <div style={{ background: p.dark, color: "#fff", borderRadius: "12px", padding: "20px 24px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: "22pt", fontWeight: 800, margin: 0 }}>{cv.full_name}</h1><p style={{ fontSize: "10pt", color: p.muted, margin: "4px 0 0" }}>{cv.headline}</p></div>
        <div style={{ textAlign: "right", fontSize: "7.5pt", color: "rgba(255,255,255,0.4)" }}><p style={{ margin: 0 }}>{cv.location}</p><p style={{ margin: 0 }}>{cv.email}</p></div>
      </div>
      {cv.summary && <div style={{ background: "#fff", borderRadius: "12px", padding: "14px 18px", marginBottom: "8px", border: "1px solid #e2e8f0" }}><p style={{ fontSize: "9.5pt", color: "#64748b", margin: 0, lineHeight: 1.5 }}>{cv.summary}</p></div>}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
        {cv.experiences?.map((exp, i) => <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 18px", border: "1px solid #e2e8f0" }}><div style={{ display: "flex", justifyContent: "space-between" }}><h3 style={{ fontSize: "10pt", fontWeight: 700, margin: 0 }}>{exp.title} <span style={{ fontWeight: 400, color: p.accent }}>@ {exp.company}</span></h3><span style={{ fontSize: "7pt", color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: "6px" }}>{exp.dates}</span></div><div style={{ marginTop: "6px" }}>{exp.bullets.map((b, j) => <p key={j} style={{ fontSize: "8.5pt", color: "#64748b", margin: "0 0 2px" }}>• {b}</p>)}</div></div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #e2e8f0" }}><SH4 text="Formation" color={p.primary} />{cv.education?.map((e, i) => <div key={i} style={{ marginBottom: "6px" }}><p style={{ fontSize: "8.5pt", fontWeight: 700, margin: 0 }}>{e.degree}</p><p style={{ fontSize: "7.5pt", color: "#94a3b8", margin: 0 }}>{e.school}</p></div>)}</div>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #e2e8f0" }}><SH4 text="Compétences" color={p.primary} /><div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>{cv.skills?.map((s, i) => <span key={i} style={{ fontSize: "7pt", padding: "2px 6px", background: p.light, color: p.dark, borderRadius: "4px" }}>{s}</span>)}</div></div>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #e2e8f0" }}><SH4 text="Langues" color={p.primary} />{cv.languages?.map((l, i) => <p key={i} style={{ fontSize: "8.5pt", margin: "0 0 4px" }}><strong>{l.language}</strong> <span style={{ color: "#94a3b8" }}>{l.level}</span></p>)}</div>
      </div>
    </div>
  );
}

// ━━━ 10. DUO — Header gradient + 2 colonnes ━━━
function Duo({ cv, p }: Props) {
  return (
    <div style={{ width: "210mm", minHeight: "297mm", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1e293b", background: "#fff" }}>
      <div style={{ background: `linear-gradient(135deg, ${p.dark}, ${p.primary})`, color: "#fff", padding: "24px 28px", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22pt", fontWeight: 800, flexShrink: 0 }}>{cv.full_name.charAt(0)}</div>
        <div><h1 style={{ fontSize: "22pt", fontWeight: 700, margin: 0 }}>{cv.full_name}</h1><p style={{ fontSize: "10pt", color: "rgba(255,255,255,0.7)", margin: "2px 0 0" }}>{cv.headline}</p><p style={{ fontSize: "7.5pt", color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>{[cv.location, cv.email].filter(Boolean).join(" · ")}</p></div>
      </div>
      <div style={{ display: "flex", padding: "20px 0" }}>
        <div style={{ flex: 6, padding: "0 24px", borderRight: "1px solid #e2e8f0" }}>
          {cv.summary && <p style={{ fontSize: "9.5pt", color: "#64748b", lineHeight: 1.6, margin: "0 0 18px", padding: "10px 12px", background: "#f8fafc", borderRadius: "6px" }}>{cv.summary}</p>}
          {cv.experiences?.length > 0 && <><SH text="Expérience" color={p.primary} />{cv.experiences.map((exp, i) => <div key={i} style={{ marginBottom: "14px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><h3 style={{ fontSize: "10pt", fontWeight: 700, margin: 0 }}>{exp.title}</h3><span style={{ fontSize: "7.5pt", color: "#94a3b8" }}>{exp.dates}</span></div><p style={{ fontSize: "8.5pt", color: p.accent, fontWeight: 600, margin: "1px 0 4px" }}>{exp.company}</p>{exp.bullets.map((b, j) => <p key={j} style={{ fontSize: "8.5pt", color: "#64748b", margin: "0 0 2px" }}>• {b}</p>)}</div>)}</>}
        </div>
        <div style={{ flex: 4, padding: "0 24px" }}>
          {cv.skills?.length > 0 && <div style={{ marginBottom: "18px" }}><SH text="Compétences" color={p.primary} />{cv.skills.map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><div style={{ width: "4px", height: "4px", borderRadius: "50%", background: p.primary }} /><span style={{ fontSize: "8.5pt" }}>{s}</span></div>)}</div>}
          {cv.languages?.length > 0 && <div style={{ marginBottom: "18px" }}><SH text="Langues" color={p.primary} />{cv.languages.map((l, i) => <div key={i} style={{ marginBottom: "6px" }}><p style={{ fontSize: "8.5pt", fontWeight: 600, margin: "0 0 2px" }}>{l.language}</p><div style={{ height: "3px", background: "#e2e8f0", borderRadius: "2px" }}><div style={{ height: "3px", background: p.primary, borderRadius: "2px", width: l.level.includes("Natif") || l.level.includes("C2") ? "100%" : l.level.includes("C1") ? "85%" : l.level.includes("B2") ? "70%" : l.level.includes("B1") ? "55%" : "40%" }} /></div><p style={{ fontSize: "7pt", color: "#94a3b8", margin: "1px 0 0" }}>{l.level}</p></div>)}</div>}
          {cv.education?.length > 0 && <div><SH text="Formation" color={p.primary} />{cv.education.map((e, i) => <div key={i} style={{ marginBottom: "10px" }}><p style={{ fontSize: "9pt", fontWeight: 700, margin: 0 }}>{e.degree}</p><p style={{ fontSize: "7.5pt", color: "#94a3b8", margin: "1px 0 0" }}>{e.school}</p><p style={{ fontSize: "7pt", color: "#cbd5e1", margin: 0 }}>{e.dates}</p></div>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ━━━ Shared section headers ━━━
function SH({ text, color }: { text: string; color: string }) { return <h2 style={{ fontSize: "8pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", color, marginBottom: "10px", marginTop: "4px" }}>{text}</h2>; }
function SH2({ text, color }: { text: string; color: string }) { return <h2 style={{ fontSize: "7pt", fontWeight: 600, textTransform: "uppercase", letterSpacing: "5px", color, marginBottom: "14px" }}>{text}</h2>; }
function SH3({ text, color }: { text: string; color: string }) { return <h2 style={{ fontSize: "8pt", fontWeight: 600, textTransform: "uppercase", letterSpacing: "5px", color, textAlign: "center", marginBottom: "14px" }}>{text}</h2>; }
function SH4({ text, color }: { text: string; color: string }) { return <h2 style={{ fontSize: "7pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color, marginBottom: "8px" }}>{text}</h2>; }
function ST({ text, color }: { text: string; color: string }) { return <h3 style={{ fontSize: "7pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "3px", color, marginBottom: "8px", marginTop: "0" }}>{text}</h3>; }
