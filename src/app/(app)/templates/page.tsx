"use client";

import { useState } from "react";
import { CVTemplateEngine, PRESETS, PALETTES, PALETTE_KEYS, type PaletteKey } from "@/components/cv-templates/engine";
import type { StructuredCV } from "@/types";
import Link from "next/link";

// Données de démo pour prévisualiser les templates
const DEMO_CV: StructuredCV = {
  full_name: "Marie Dupont",
  headline: "Développeuse Full-Stack Senior",
  location: "Bruxelles, Belgique",
  email: "marie.dupont@email.com",
  linkedin: "linkedin.com/in/mariedupont",
  summary: "Développeuse Full-Stack avec 5 ans d'expérience en React et Node.js. Spécialisée dans les architectures TypeScript à haute performance. Track record de livraison en équipe agile avec réduction de 40% du time-to-market.",
  experiences: [
    {
      title: "Full-Stack Developer Senior",
      company: "TechCorp",
      location: "Bruxelles",
      dates: "Janv. 2022 — Présent",
      bullets: [
        "Piloté la migration React 18 → Next.js 15 pour 200K utilisateurs, +35% performance",
        "Architecturé le système de paiement (Stripe), 2M€ de transactions/mois",
        "Implémenté CI/CD (GitHub Actions), réduction de 60% des bugs en production",
        "Mentorat de 3 développeurs juniors, 100% promus en 12 mois",
      ],
    },
    {
      title: "Développeuse Web",
      company: "StartupBE",
      location: "Liège",
      dates: "Sept. 2019 — Déc. 2021",
      bullets: [
        "Développé 12 features majeures pour la plateforme SaaS (15K utilisateurs)",
        "Optimisé les requêtes PostgreSQL, temps de réponse API réduit de 70%",
        "Mis en place les tests automatisés (Jest + Cypress), couverture 85%",
      ],
    },
  ],
  education: [
    { degree: "Master en Informatique", school: "Université Libre de Bruxelles", dates: "2017 — 2019", details: "Spécialisation Intelligence Artificielle" },
    { degree: "Bachelier en Sciences Informatiques", school: "Université de Liège", dates: "2014 — 2017" },
  ],
  skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS", "CI/CD", "Agile/Scrum", "REST API"],
  languages: [
    { language: "Français", level: "Natif" },
    { language: "Anglais", level: "C1" },
    { language: "Néerlandais", level: "B1" },
  ],
  certifications: ["AWS Solutions Architect Associate", "Scrum Master Certified"],
};

const PROFESSIONS = [
  { label: "Tech & Développement", templates: ["moderne", "tech", "compact"] },
  { label: "Finance & Conseil", templates: ["corporate", "executive", "classique"] },
  { label: "Marketing & Créatif", templates: ["creatif", "sidebar-pro", "impact"] },
  { label: "Direction & Management", templates: ["executive", "classique", "corporate"] },
  { label: "Polyvalent", templates: ["minimal", "moderne", "sidebar-pro"] },
];

export default function TemplatesGalleryPage() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [palette, setPalette] = useState<PaletteKey>("indigo");
  const [filter, setFilter] = useState<string | null>(null);

  const filteredPresets = filter
    ? PRESETS.filter((p) => PROFESSIONS.find((pr) => pr.label === filter)?.templates.includes(p.key))
    : PRESETS;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Templates de CV</h1>
        <p className="text-sm text-gray-500 mt-1">
          10 templates professionnels × 5 palettes de couleurs = 50 combinaisons.
          L&apos;IA recommande le meilleur template pour chaque candidature.
        </p>
      </div>

      {/* Filter by profession */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            !filter ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tous
        </button>
        {PROFESSIONS.map((p) => (
          <button
            key={p.label}
            onClick={() => setFilter(filter === p.label ? null : p.label)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filter === p.label ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Template list */}
        <div className="space-y-3">
          {filteredPresets.map((preset) => (
            <button
              key={preset.key}
              onClick={() => setSelectedPreset(preset)}
              className={`w-full p-4 rounded-xl text-left transition-all cursor-pointer border ${
                selectedPreset.key === preset.key
                  ? "border-indigo-600 bg-indigo-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-indigo-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm">{preset.name}</p>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{preset.category}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
              <div className="flex gap-1 mt-2">
                {PALETTE_KEYS.map((k) => (
                  <div key={k} className="w-3 h-3 rounded-full" style={{ background: PALETTES[k].primary }} />
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="md:col-span-2 space-y-4">
          {/* Palette selector */}
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold text-gray-400">Couleur :</p>
            {PALETTE_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setPalette(key)}
                className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer ${
                  palette === key ? "border-gray-900 scale-110" : "border-gray-200"
                }`}
                style={{ background: PALETTES[key].primary }}
              />
            ))}
          </div>

          {/* CTA */}
          <Link href="/apply" className="block w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm text-center hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/15">
            Utiliser ce template — Analyser une offre
          </Link>

          {/* Preview frame */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xl" style={{ maxHeight: "700px", overflowY: "auto" }}>
            <CVTemplateEngine cv={DEMO_CV} preset={selectedPreset} palette={palette} />
          </div>
        </div>
      </div>
    </div>
  );
}
