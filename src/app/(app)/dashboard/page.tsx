import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Application, Profile } from "@/types";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, appsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("applications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
  ]);

  const profile = profileRes.data as unknown as Profile | null;
  if (!profile) redirect("/login");

  // Redirect to onboarding if no experience
  if (!profile.experience?.trim()) redirect("/onboarding");

  const applications = (appsRes.data || []) as unknown as Application[];
  const generated = applications.filter((a) => a.status !== "analyzed").length;
  const interviews = applications.filter((a) => a.status === "interview" || a.status === "hired").length;

  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    analyzed: { label: "Analysée", bg: "bg-gray-100", text: "text-gray-600" },
    generated: { label: "Générée", bg: "bg-indigo-50", text: "text-indigo-700" },
    applied: { label: "Postulé", bg: "bg-amber-50", text: "text-amber-700" },
    interview: { label: "Entretien", bg: "bg-emerald-50", text: "text-emerald-700" },
    rejected: { label: "Refusé", bg: "bg-red-50", text: "text-red-600" },
    hired: { label: "Embauché !", bg: "bg-emerald-100", text: "text-emerald-800" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold">Bonjour, {profile.full_name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-gray-400 mt-0.5">{applications.length === 0 ? "Prêt à décrocher ton prochain poste ?" : `${applications.length} candidature${applications.length > 1 ? "s" : ""} en cours`}</p>
        </div>
        <Link href="/apply" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/15 flex items-center gap-1.5">
          <span className="text-base">+</span> Candidater
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard value={profile.credits} label="Crédits" color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard value={applications.length} label="Analysées" color="text-gray-800" bg="bg-gray-50" />
        <StatCard value={generated} label="Générées" color="text-violet-600" bg="bg-violet-50" />
        <StatCard value={interviews} label="Entretiens" color="text-emerald-600" bg="bg-emerald-50" />
      </div>

      {/* Credits warning */}
      {profile.credits === 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-sm text-indigo-800">Plus de crédits</p>
            <p className="text-xs text-indigo-600">Achète un pack pour continuer à générer.</p>
          </div>
          <Link href="/pricing" className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shrink-0 shadow shadow-indigo-600/20">
            Acheter
          </Link>
        </div>
      )}

      {/* Applications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Mes candidatures</h2>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p className="font-bold">Aucune candidature</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">Colle une offre d&apos;emploi pour recevoir une analyse gratuite et générer ta candidature.</p>
            <Link href="/apply" className="inline-flex items-center gap-1.5 mt-5 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/15">
              <span>+</span> Analyser une offre
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {applications.map((app) => {
              const s = statusConfig[app.status] || statusConfig.analyzed;
              const score = app.match_score ?? 0;
              return (
                <Link key={app.id} href={`/apply/${app.id}`}
                  className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all group"
                >
                  {/* Score */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                    score >= 70 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                    score >= 40 ? "bg-amber-50 text-amber-600 border border-amber-100" :
                    "bg-gray-50 text-gray-400 border border-gray-100"
                  }`}>
                    {score ? `${score}%` : "—"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate group-hover:text-indigo-700 transition-colors">{app.job_title}</p>
                    <p className="text-xs text-gray-400 truncate">{app.company_name}</p>
                  </div>

                  {/* Status */}
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold shrink-0 ${s.bg} ${s.text}`}>
                    {s.label}
                  </span>

                  {/* Arrow */}
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ value, label, color, bg }: { value: number; label: string; color: string; bg: string }) {
  return (
    <div className={`p-4 rounded-2xl ${bg} border border-gray-100 text-center`}>
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{label}</p>
    </div>
  );
}
