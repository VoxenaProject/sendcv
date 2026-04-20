"use client";

import type { StructuredCV } from "@/types";
import { CVTemplateEngine, PRESETS, PALETTES, PALETTE_KEYS, type PaletteKey, type TemplatePreset } from "./engine";
import { useRef, useState } from "react";

export { PRESETS, PALETTE_KEYS, PALETTES };
export type { PaletteKey, TemplatePreset };

export function CVPreviewWithDownload({ cv, recommendedTemplate }: { cv: StructuredCV; recommendedTemplate?: string }) {
  const [selectedPreset, setSelectedPreset] = useState(
    PRESETS.find((p) => p.key === recommendedTemplate) || PRESETS[0]
  );
  const [palette, setPalette] = useState<PaletteKey>("indigo");
  const previewRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visiblePresets = showAll ? PRESETS : PRESETS.slice(0, 5);

  async function handleDownload() {
    if (!previewRef.current) return;
    setDownloading(true);
    const html2pdf = (await import("html2pdf.js")).default;
    await html2pdf().set({
      margin: 0,
      filename: `CV_${cv.full_name.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).from(previewRef.current).save();
    setDownloading(false);
  }

  return (
    <div className="space-y-5">
      {/* Template selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500">Template</p>
          {!showAll && <button onClick={() => setShowAll(true)} className="text-xs text-indigo-600 hover:underline cursor-pointer">Voir les 10 templates</button>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {visiblePresets.map((preset) => (
            <button
              key={preset.key}
              onClick={() => setSelectedPreset(preset)}
              className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                selectedPreset.key === preset.key
                  ? "border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-600/10"
                  : "border-gray-200 bg-white hover:border-indigo-300"
              }`}
            >
              <p className="text-xs font-bold truncate">{preset.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{preset.category}</p>
              {recommendedTemplate === preset.key && (
                <span className="inline-block mt-1 text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-bold">IA recommandé</span>
              )}
            </button>
          ))}
        </div>
        {showAll && <button onClick={() => setShowAll(false)} className="text-xs text-gray-400 hover:underline cursor-pointer mt-2">Réduire</button>}
      </div>

      {/* Color palette */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">Couleur</p>
        <div className="flex gap-2">
          {PALETTE_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setPalette(key)}
              className={`w-8 h-8 rounded-lg border-2 transition-all cursor-pointer ${
                palette === key ? "border-gray-900 scale-110" : "border-gray-200 hover:border-gray-400"
              }`}
              style={{ background: PALETTES[key].primary }}
              title={key}
            />
          ))}
        </div>
      </div>

      {/* Download */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15"
      >
        {downloading ? (
          <><Spinner /> Génération du PDF...</>
        ) : (
          <>📥 Télécharger en PDF — Template {selectedPreset.name}</>
        )}
      </button>

      {/* Preview */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xl" style={{ maxHeight: "800px", overflowY: "auto" }}>
        <div ref={previewRef}>
          <CVTemplateEngine cv={cv} preset={selectedPreset} palette={palette} />
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Le PDF généré est au format A4, prêt à envoyer. Compatible avec tous les systèmes ATS.
      </p>
    </div>
  );
}

function Spinner() {
  return <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>;
}
