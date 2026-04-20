import { createClient } from "@/lib/supabase/server";
import type { Application, Profile } from "@/types";
import Link from "next/link";

// Données de démo pour le dev local
const DEMO_PROFILE: Profile = {
  id: "demo", email: "demo@sendcv.ai", full_name: "Dejvi", credits: 5,
  headline: "Fondateur", experience: null, education: null, skills: null,
  languages: null, location: "Bruxelles", linkedin_url: null,
  stripe_customer_id: null, subscription_id: null, subscription_status: null,
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
};

const DEMO_APPLICATIONS: Application[] = [
  {
    id: "demo-1", user_id: "demo", job_url: null,
    job_title: "Développeur Full-Stack Senior", company_name: "TechCorp Brussels",
    job_description: "...", analysis: null, match_score: 87,
    generated_cv: null, structured_cv: null, generated_cover_letter: null,
    generated_interview_prep: null, generated_linkedin_tips: null,
    status: "generated", created_at: new Date().toISOString(),
  },
  {
    id: "demo-2", user_id: "demo", job_url: null,
    job_title: "Product Manager", company_name: "StartupBE",
    job_description: "...", analysis: null, match_score: 62,
    generated_cv: null, structured_cv: null, generated_cover_letter: null,
    generated_interview_prep: null, generated_linkedin_tips: null,
    status: "analyzed", created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "demo-3", user_id: "demo", job_url: null,
    job_title: "Lead Developer React", company_name: "FinTech Paris",
    job_description: "...", analysis: null, match_score: 91,
    generated_cv: null, structured_cv: null, generated_cover_letter: null,
    generated_interview_prep: null, generated_linkedin_tips: null,
    status: "interview", created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default async function DashboardPage() {
  let profile: Profile = DEMO_PROFILE;
  let applications: Application[] = DEMO_APPLICATIONS;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (p) profile = p as unknown as Profile;
      const { data: apps } = await supabase.from("applications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
      if (apps) applications = apps as unknown as Application[];
    }
  } catch {
    // Dev mode — utilise les données de démo
  }

  const generated = applications.filter((a) => a.status !== "analyzed").length;

  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    analyzed: { label: "Analysée", bg: "bg-gray-100", text: "text-gray-600" },
    generated: { label: "Générée", bg: "bg-indigo-50", text: "text-indigo-700" },
    applied: { label: "Postulé", bg: "bg-amber-50", text: "text-amber-700" },
    interview: { label: "Entretien", bg: "bg-emerald-50", text: "text-emerald-700" },
    rejected: { label: "Refusé", bg: "bg-red-50", text: "text-red-600" },
    hired: { label: "Embauché !", bg: "bg-emerald-100", text: "text-emerald-800" },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Dashboard</h1>
          <p className="text-sm text-gray-500">Bienvenue, {profile.full_name}</p>
        </div>
        <Link href="/apply" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/15">
          + Nouvelle candidature
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 text-center">
          <p className="text-3xl font-extrabold text-indigo-600">{profile.credits}</p>
          <p className="text-xs text-gray-400 mt-1">Crédits restants</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-gray-200 text-center">
          <p className="text-3xl font-extrabold">{applications.length}</p>
          <p className="text-xs text-gray-400 mt-1">Offres analysées</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-gray-200 text-center">
          <p className="text-3xl font-extrabold text-emerald-600">{generated}</p>
          <p className="text-xs text-gray-400 mt-1">Candidatures générées</p>
        </div>
      </div>

      {/* Profile warning */}
      {!profile.experience && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-sm text-amber-800">Complète ton profil</p>
            <p className="text-xs text-amber-600">Ajoute ton expérience et tes compétences pour des CV personnalisés.</p>
          </div>
          <Link href="/settings" className="text-xs bg-amber-500 text-white px-4 py-2 rounded-lg font-bold shrink-0">
            Compléter
          </Link>
        </div>
      )}

      {/* Credits warning */}
      {profile.credits === 0 && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-sm text-indigo-800">Plus de crédits</p>
            <p className="text-xs text-indigo-600">Achète un pack pour générer tes candidatures.</p>
          </div>
          <Link href="/pricing" className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shrink-0">
            Acheter
          </Link>
        </div>
      )}

      {/* Applications */}
      <div>
        <h2 className="text-lg font-bold mb-4">Mes candidatures</h2>
        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-bold">Aucune candidature</p>
            <p className="text-sm text-gray-400 mt-1">Colle une offre d&apos;emploi pour commencer.</p>
            <Link href="/apply" className="inline-block mt-4 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/15">
              Analyser une offre
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const s = statusConfig[app.status] || statusConfig.analyzed;
              return (
                <Link key={app.id} href={`/apply/${app.id}`}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all"
                >
                  {/* Match score */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                    (app.match_score ?? 0) >= 70 ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                    (app.match_score ?? 0) >= 40 ? "bg-amber-50 text-amber-600 border border-amber-200" :
                    "bg-gray-50 text-gray-400 border border-gray-200"
                  }`}>
                    {app.match_score ? `${app.match_score}%` : "—"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{app.job_title}</p>
                    <p className="text-xs text-gray-400">{app.company_name}</p>
                  </div>

                  {/* Status */}
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold shrink-0 ${s.bg} ${s.text}`}>
                    {s.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
