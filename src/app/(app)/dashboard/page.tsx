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

  const needsOnboarding = !profile.experience?.trim();
  const apps = (appsRes.data || []) as unknown as Application[];
  const generated = apps.filter((a) => a.status !== "analyzed").length;
  const interviews = apps.filter((a) => a.status === "interview" || a.status === "hired").length;
  const firstName = profile.full_name.split(" ")[0];

  return (
    <div className="space-y-8">

      {/* ━━━ Hero card — Apple style ━━━ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-7 text-white">
        <div className="absolute top-[-40px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-[-30px] left-[20%] w-32 h-32 bg-violet-400/10 rounded-full blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-sm font-medium">Bonjour, {firstName} 👋</p>
            <h1 className="text-2xl font-extrabold mt-1">
              {apps.length === 0 ? "Prêt à décrocher ton prochain poste ?" : `${apps.length} candidature${apps.length > 1 ? "s" : ""} en cours`}
            </h1>
          </div>
          <Link href="/apply" className="bg-white text-indigo-700 px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg shrink-0">
            + Candidater
          </Link>
        </div>

        <div className="relative grid grid-cols-4 gap-3 mt-6">
          <PlanBadge plan={(profile as unknown as { plan: string }).plan || "free"} />
          <MiniStat value={apps.length} label="Analysées" />
          <MiniStat value={generated} label="Générées" />
          <MiniStat value={interviews} label="Entretiens" />
        </div>
      </div>

      {/* ━━━ Quick actions ━━━ */}
      <div className="grid grid-cols-3 gap-3">
        <QuickAction href="/apply" icon="📝" label="Nouvelle candidature" desc="Colle une offre" />
        <QuickAction href="/templates" icon="🎨" label="Templates CV" desc="50 combinaisons" />
        <QuickAction href="/pricing" icon="💎" label="Mon plan" desc={(profile as unknown as { plan: string }).plan === "free" ? "Upgrade" : (profile as unknown as { plan: string }).plan === "pro" ? "Pro actif" : "Lifetime ∞"} />
      </div>

      {/* ━━━ Onboarding banner ━━━ */}
      {needsOnboarding && (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0"><span className="text-lg">👋</span></div>
          <div className="flex-1">
            <p className="font-bold text-sm text-amber-900">Complète ton profil en 2 min</p>
            <p className="text-xs text-amber-700">Ajoute ton expérience pour des CV personnalisés.</p>
          </div>
          <Link href="/onboarding" className="text-xs bg-amber-500 text-white px-4 py-2 rounded-xl font-bold shrink-0 shadow shadow-amber-500/20">
            Compléter
          </Link>
        </div>
      )}

      {/* ━━━ Credits alert ━━━ */}
      {(profile as unknown as { plan: string }).plan === "free" && ((profile as unknown as { generation_count: number }).generation_count || 0) >= 3 && (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0"><span className="text-lg">⚡</span></div>
          <div className="flex-1">
            <p className="font-bold text-sm text-indigo-800">Passe à Pro pour continuer</p>
            <p className="text-xs text-indigo-600">Tes 3 générations gratuites sont utilisées. 19€/mois pour l&apos;illimité.</p>
          </div>
          <Link href="/pricing" className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold shrink-0 shadow shadow-indigo-600/20">Upgrade</Link>
        </div>
      )}

      {/* ━━━ Applications ━━━ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Candidatures récentes</h2>
          {apps.length > 0 && <span className="text-xs text-gray-300">{apps.length} total</span>}
        </div>

        {apps.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-5"><span className="text-3xl">📋</span></div>
            <p className="font-extrabold text-lg">Aucune candidature</p>
            <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">Colle une offre pour recevoir une analyse gratuite.</p>
            <Link href="/apply" className="inline-flex items-center gap-1.5 mt-6 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-600/20">
              + Analyser une offre
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {apps.map((app) => <AppCard key={app.id} app={app} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const label = plan === "pro" ? "Pro" : plan === "lifetime" ? "Lifetime" : "Free";
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
      <p className="text-lg font-extrabold">{label}</p>
      <p className="text-[10px] text-indigo-200 mt-0.5">Plan</p>
    </div>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-[10px] text-indigo-200 mt-0.5">{label}</p>
    </div>
  );
}

function QuickAction({ href, icon, label, desc }: { href: string; icon: string; label: string; desc: string }) {
  return (
    <Link href={href} className="p-4 rounded-2xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
      <span className="text-2xl">{icon}</span>
      <p className="font-bold text-sm mt-2 group-hover:text-indigo-700 transition-colors">{label}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
    </Link>
  );
}

function AppCard({ app }: { app: Application }) {
  const cfg: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    analyzed: { label: "Analysée", bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
    generated: { label: "Générée", bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
    applied: { label: "Postulé", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    interview: { label: "Entretien", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    rejected: { label: "Refusé", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
    hired: { label: "Embauché !", bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-600" },
  };
  const s = cfg[app.status] || cfg.analyzed;
  const score = app.match_score ?? 0;
  const d = new Date(app.created_at);
  const ago = (() => { const m = Math.floor((Date.now() - d.getTime()) / 60000); if (m < 60) return `${m}min`; const h = Math.floor(m / 60); if (h < 24) return `${h}h`; const days = Math.floor(h / 24); return `${days}j`; })();

  return (
    <Link href={`/apply/${app.id}`} className="flex items-center gap-3.5 p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-xs shrink-0 ${score >= 70 ? "bg-emerald-50 text-emerald-600" : score >= 40 ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-400"}`}>
        {score ? `${score}%` : "—"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate group-hover:text-indigo-700 transition-colors">{app.job_title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-gray-400 truncate">{app.company_name}</p>
          <span className="text-gray-200">·</span>
          <p className="text-xs text-gray-300 shrink-0">{ago}</p>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 ${s.bg}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        <span className={`text-[10px] font-bold ${s.text}`}>{s.label}</span>
      </div>
      <svg className="w-4 h-4 text-gray-200 group-hover:text-indigo-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
    </Link>
  );
}
