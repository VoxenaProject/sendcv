"use client";

import { useState } from "react";
import type { Application, StructuredCV } from "@/types";
import { CVPreviewWithDownload } from "@/components/cv-templates";

type Tab = "cv" | "letter" | "interview" | "linkedin";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "cv", label: "CV", icon: "📄" },
  { key: "letter", label: "Lettre", icon: "✉️" },
  { key: "interview", label: "Entretien", icon: "🎯" },
  { key: "linkedin", label: "LinkedIn", icon: "🔗" },
];

export function ContentTabs({ application }: { application: Application }) {
  const [activeTab, setActiveTab] = useState<Tab>("cv");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  function copy(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  function download(text: string, filename: string) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const structuredCv = application.structured_cv as StructuredCV | null;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.key ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* CV Tab — Templates + PDF */}
      {activeTab === "cv" && (
        <div className="space-y-6">
          {/* Structured CV with templates */}
          {structuredCv && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">CV personnalisé</h3>
                  <p className="text-xs text-gray-500">Choisis un template et télécharge en PDF</p>
                </div>
              </div>
              <CVPreviewWithDownload cv={structuredCv} />
            </div>
          )}

          {/* Raw text fallback + copy */}
          {application.generated_cv && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Version texte (pour copier-coller)</p>
                <div className="flex gap-2">
                  <Btn label={copiedField === "cv" ? "Copié !" : "Copier"} onClick={() => copy(application.generated_cv!, "cv")} active={copiedField === "cv"} />
                  <Btn label="Télécharger .txt" onClick={() => download(application.generated_cv!, `CV_${application.company_name.replace(/\s+/g, "_")}.txt`)} />
                </div>
              </div>
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200">
                <pre className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700">{application.generated_cv}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Letter Tab */}
      {activeTab === "letter" && application.generated_cover_letter && (
        <ContentBlock
          title="Lettre de motivation"
          subtitle={`Personnalisée pour ${application.company_name}`}
          content={application.generated_cover_letter}
          filename={`Lettre_${application.company_name.replace(/\s+/g, "_")}.txt`}
          copied={copiedField === "letter"}
          onCopy={() => copy(application.generated_cover_letter!, "letter")}
          onDownload={() => download(application.generated_cover_letter!, `Lettre_${application.company_name.replace(/\s+/g, "_")}.txt`)}
        />
      )}

      {/* Interview Tab */}
      {activeTab === "interview" && application.generated_interview_prep && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Préparation entretien</h3>
              <p className="text-xs text-gray-500">{application.generated_interview_prep.length} questions probables avec réponses</p>
            </div>
            <Btn
              label={copiedField === "interview" ? "Copié !" : "Tout copier"}
              active={copiedField === "interview"}
              onClick={() => {
                const text = application.generated_interview_prep!.map((q, i) =>
                  `Q${i + 1}: ${q.question}\nPourquoi : ${q.why_they_ask}\nRéponse : ${q.optimal_answer}`
                ).join("\n\n---\n\n");
                copy(text, "interview");
              }}
            />
          </div>
          {application.generated_interview_prep.map((q, i) => (
            <div key={i} className="p-5 rounded-xl bg-white border border-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <p className="font-semibold text-sm text-gray-800">{q.question}</p>
                </div>
                <Btn label={copiedField === `q${i}` ? "!" : "📋"} small onClick={() => copy(`Q: ${q.question}\n\nR: ${q.optimal_answer}`, `q${i}`)} active={copiedField === `q${i}`} />
              </div>
              <p className="text-xs text-gray-400 italic ml-9 mt-1 mb-2">Ce qu&apos;ils évaluent : {q.why_they_ask}</p>
              <div className="ml-9 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Réponse optimale</p>
                <p className="text-sm text-gray-700 leading-relaxed">{q.optimal_answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LinkedIn Tab */}
      {activeTab === "linkedin" && application.generated_linkedin_tips && (
        <ContentBlock
          title="Optimisation LinkedIn"
          subtitle="Headline, résumé et mots-clés pour ce type de poste"
          content={application.generated_linkedin_tips}
          filename="LinkedIn_Tips.txt"
          copied={copiedField === "linkedin"}
          onCopy={() => copy(application.generated_linkedin_tips!, "linkedin")}
          onDownload={() => download(application.generated_linkedin_tips!, "LinkedIn_Tips.txt")}
        />
      )}
    </div>
  );
}

function ContentBlock({ title, subtitle, content, filename, copied, onCopy, onDownload }: {
  title: string; subtitle: string; content: string; filename: string;
  copied: boolean; onCopy: () => void; onDownload: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div><h3 className="font-bold text-lg">{title}</h3><p className="text-xs text-gray-500">{subtitle}</p></div>
        <div className="flex gap-2">
          <Btn label={copied ? "Copié !" : "Copier"} onClick={onCopy} active={copied} />
          <Btn label="Télécharger" onClick={onDownload} />
        </div>
      </div>
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        <pre className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700">{content}</pre>
      </div>
    </div>
  );
}

function Btn({ label, onClick, active, small }: { label: string; onClick: () => void; active?: boolean; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`transition-colors cursor-pointer ${
        small
          ? "w-8 h-8 text-xs rounded-lg flex items-center justify-center"
          : "px-3 py-1.5 text-xs rounded-lg font-medium"
      } ${
        active
          ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
          : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}
