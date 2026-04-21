import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Application, Profile } from "@/types";
import { GenerateButton } from "./generate-button";
import { ContentTabs } from "./content-tabs";
import { StatusManager } from "./status-manager";
import Link from "next/link";

export default async function ApplicationDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [appRes, profileRes] = await Promise.all([
    supabase.from("applications").select("*").eq("id", id).eq("user_id", user.id).single(),
    supabase.from("profiles").select("plan, generation_count, experience").eq("id", user.id).single(),
  ]);

  if (!appRes.data) notFound();
  const app = appRes.data as unknown as Application;
  const profile = profileRes.data as unknown as { plan: string; generation_count: number; experience: string | null } | null;
  const plan = profile?.plan || "free";
  const genCount = profile?.generation_count || 0;
  const hasProfile = !!profile?.experience?.trim();
  const canGenerate = plan !== "free" || genCount < 3;
  const freeRemaining = Math.max(0, 3 - genCount);
  const a = app.analysis;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">&larr; Retour</Link>
          <h1 className="text-2xl font-extrabold mt-2">{app.job_title}</h1>
          <p className="text-gray-500">{app.company_name}{a?.location ? ` — ${a.location}` : ""}</p>
        </div>
        {app.status !== "analyzed" && <StatusManager applicationId={app.id} currentStatus={app.status} />}
      </div>

      {/* ━━━ DOUBLE SCORE : ATS + RECRUITER ━━━ */}
      {a && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* ATS Score */}
          <div className="p-5 rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score ATS</p>
                <p className="text-xs text-gray-500 mt-0.5">Compatibilité avec les filtres automatiques</p>
              </div>
              <ScoreCircle score={a.ats_breakdown?.overall ?? a.match_score ?? 0} color="indigo" />
            </div>
            {a.ats_breakdown && (
              <div className="space-y-2">
                <ScoreBar label="Mots-clés" score={a.ats_breakdown.keywords_score} />
                <ScoreBar label="Format" score={a.ats_breakdown.format_score} />
                <ScoreBar label="Complétude" score={a.ats_breakdown.completeness_score} />
              </div>
            )}
          </div>

          {/* Recruiter Score */}
          <div className="p-5 rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score Recruteur</p>
                <p className="text-xs text-gray-500 mt-0.5">Impact humain de ton profil</p>
              </div>
              <ScoreCircle score={a.recruiter_score?.overall ?? 0} color="emerald" />
            </div>
            {a.recruiter_score && (
              <div className="space-y-2">
                <ScoreBar label="Impact chiffré" score={a.recruiter_score.impact_score} />
                <ScoreBar label="Spécificité" score={a.recruiter_score.specificity_score} />
                <ScoreBar label="Niveau de séniorité" score={a.recruiter_score.seniority_score} />
                <ScoreBar label="Pertinence" score={a.recruiter_score.relevance_score} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ━━━ HIRING PROBABILITY ━━━ */}
      {a?.recruiter_insights?.hiring_probability != null && a.recruiter_insights.hiring_probability > 0 && (
        <div className={`p-4 rounded-2xl border text-center ${
          a.recruiter_insights.hiring_probability >= 60 ? "bg-emerald-50 border-emerald-200" :
          a.recruiter_insights.hiring_probability >= 35 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"
        }`}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Probabilité d&apos;obtenir un entretien</p>
          <p className={`text-4xl font-black mt-1 ${
            a.recruiter_insights.hiring_probability >= 60 ? "text-emerald-600" :
            a.recruiter_insights.hiring_probability >= 35 ? "text-amber-600" : "text-red-600"
          }`}>{a.recruiter_insights.hiring_probability}%</p>
          <p className="text-xs text-gray-400 mt-1">Estimation basée sur l&apos;adéquation profil/poste, l&apos;impact des réalisations et les exigences linguistiques</p>
        </div>
      )}

      {/* ━━━ KEYWORD MATCHES ━━━ */}
      {a?.keyword_matches && a.keyword_matches.length > 0 && (
        <div className="p-5 rounded-2xl border border-gray-200 bg-white">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Mots-clés de l&apos;offre</p>
          <div className="flex flex-wrap gap-2">
            {a.keyword_matches.map((kw, i) => (
              <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                kw.found
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : kw.importance === "critical"
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-gray-50 border-gray-200 text-gray-500"
              }`}>
                <span className="text-[10px]">{kw.found ? "✓" : kw.importance === "critical" ? "✕" : "○"}</span>
                {kw.keyword}
                {kw.importance === "critical" && !kw.found && <span className="text-[9px] text-red-400 ml-0.5">critique</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ━━━ RECRUITER INSIGHTS ━━━ */}
      {a?.recruiter_insights && (
        <div className="grid md:grid-cols-3 gap-4">
          {a.recruiter_insights.first_impression?.length > 0 && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-2">Ce que le recruteur verra en premier</p>
              <ul className="space-y-1.5">
                {a.recruiter_insights.first_impression.map((f, i) => (
                  <li key={i} className="text-xs text-indigo-800 flex items-start gap-1.5">
                    <span className="text-indigo-400 mt-0.5 shrink-0">→</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {a.recruiter_insights.weaknesses?.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">Points à compenser en entretien</p>
              <ul className="space-y-1.5">
                {a.recruiter_insights.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                    <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {a.recruiter_insights.salary_advice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Conseil négociation salariale</p>
              <p className="text-xs text-emerald-800 leading-relaxed">{a.recruiter_insights.salary_advice}</p>
            </div>
          )}
        </div>
      )}

      {/* ━━━ ANALYSIS DETAILS ━━━ */}
      {a && (
        <div className="grid md:grid-cols-2 gap-4">
          {a.key_requirements?.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Compétences requises</p>
              <div className="flex flex-wrap gap-1.5">
                {a.key_requirements.map((r, i) => (
                  <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md">{r}</span>
                ))}
              </div>
            </div>
          )}
          {a.strong_matches?.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Tes points forts</p>
              <div className="flex flex-wrap gap-1.5">
                {a.strong_matches.map((s, i) => (
                  <span key={i} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">✓ {s}</span>
                ))}
              </div>
            </div>
          )}
          {a.red_flags?.length > 0 && (
            <div className="p-4 rounded-xl bg-red-50/50 border border-red-100">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">Points d&apos;attention</p>
              <ul className="space-y-1">{a.red_flags.map((f, i) => (
                <li key={i} className="text-xs text-red-700">⚠ {f}</li>
              ))}</ul>
            </div>
          )}
          {a.salary_estimate && (
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Estimation salariale</p>
              <p className="text-sm font-semibold text-gray-800">{a.salary_estimate}</p>
            </div>
          )}
        </div>
      )}

      {/* ━━━ GENERATE CTA ━━━ */}
      {app.status === "analyzed" && (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border-2 border-indigo-200 text-center space-y-5">
          <div>
            <h2 className="text-xl font-extrabold">Générer la candidature optimisée</h2>
            <p className="text-sm text-gray-500 mt-1">Double optimisation ATS + Recruteur — powered by Claude Opus 4.7</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-full">📄 CV impact chiffré</span>
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-full">✉️ Lettre personnalisée</span>
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-full">🎯 10 questions d&apos;entretien</span>
            <span className="bg-white border border-gray-200 px-3 py-1.5 rounded-full">🔗 LinkedIn optimisé</span>
          </div>

          {plan === "free" && canGenerate && (
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
              <span className="text-emerald-600 text-xs font-bold">🎁 {freeRemaining} génération{freeRemaining > 1 ? "s" : ""} gratuite{freeRemaining > 1 ? "s" : ""} restante{freeRemaining > 1 ? "s" : ""}</span>
            </div>
          )}
          {plan !== "free" && (
            <p className="text-sm font-medium text-indigo-600">{plan === "pro" ? "Pro — Illimité" : "Lifetime — Illimité"}</p>
          )}

          {!hasProfile && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-sm max-w-md mx-auto">
              <p className="font-bold text-amber-700">Complète ton profil d&apos;abord</p>
              <p className="text-gray-500 text-xs mt-1">L&apos;IA a besoin de ton expérience pour générer un CV personnalisé.</p>
              <Link href="/settings" className="inline-block mt-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold">
                Compléter mon profil
              </Link>
            </div>
          )}

          {!canGenerate ? (
            <Link href="/pricing" className="inline-block bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
              Passer à Pro pour continuer
            </Link>
          ) : hasProfile ? (
            <GenerateButton applicationId={app.id} />
          ) : null}
        </div>
      )}

      {/* ━━━ COACH ACTIONS (Pro only) ━━━ */}
      {app.status !== "analyzed" && (plan === "pro" || plan === "lifetime") && (
        <div className="grid md:grid-cols-2 gap-3">
          <Link href={`/apply/${app.id}/simulate`}
            className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <span className="text-lg">🎤</span>
            </div>
            <div>
              <p className="font-bold text-sm text-indigo-800">Simuler l&apos;entretien</p>
              <p className="text-[11px] text-indigo-500">L&apos;IA joue le recruteur. Entraîne-toi.</p>
            </div>
          </Link>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-800">Conseil du coach</p>
              <p className="text-[11px] text-emerald-600">
                {a?.recruiter_insights?.first_impression?.[0] || "Personnalise bien ta candidature pour ce poste."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ━━━ UPGRADE CTA for free users ━━━ */}
      {app.status !== "analyzed" && plan === "free" && (
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎤</span>
            <div>
              <p className="font-bold text-sm">Simule ton entretien avec l&apos;IA coach</p>
              <p className="text-[11px] text-gray-400">Feature Pro — L&apos;IA joue le recruteur et te donne du feedback.</p>
            </div>
          </div>
          <Link href="/pricing" className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold shrink-0">
            Upgrade
          </Link>
        </div>
      )}

      {/* ━━━ GENERATED CONTENT ━━━ */}
      {app.status !== "analyzed" && <ContentTabs application={app} />}
    </div>
  );
}

// ━━━ Score Components ━━━

function ScoreCircle({ score, color }: { score: number; color: "indigo" | "emerald" }) {
  const c = score >= 70 ? "text-emerald-600 border-emerald-200 bg-emerald-50" :
            score >= 40 ? "text-amber-600 border-amber-200 bg-amber-50" :
            "text-red-600 border-red-200 bg-red-50";
  return (
    <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-lg ${c}`}>
      {score}
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-gray-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[11px] font-mono font-bold text-gray-600 w-8 text-right">{score}</span>
    </div>
  );
}
