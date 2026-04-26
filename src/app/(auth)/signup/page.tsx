"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>;
}

function SignupForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Pré-remplir l'email depuis l'URL (landing page capture)
  useEffect(() => {
    const urlEmail = searchParams.get("email");
    if (urlEmail) setEmail(urlEmail);
  }, [searchParams]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: fullName, email },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    // Auto-login après signup
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) { setError(signInError.message); setLoading(false); return; }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 to-violet-700 p-12 flex-col justify-between">
        <Link href="/" className="flex items-baseline gap-0.5">
          <span className="text-xl font-black text-white">send</span>
          <span className="text-xl font-black text-indigo-200">cv</span>
          <span className="text-[9px] text-indigo-300">.ai</span>
        </Link>
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-white leading-tight">La candidature parfaite.<br />En 60 secondes.</h2>
          <div className="space-y-3">
            {["Analyse gratuite de chaque offre", "CV sur-mesure optimisé ATS + Recruteur", "Lettre + préparation entretien + LinkedIn", "Powered by Claude Opus 4.7"].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-indigo-100 text-sm">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-indigo-300">Entretien en 30 jours ou 100% remboursé.</p>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <Link href="/" className="lg:hidden flex items-baseline gap-0.5 mb-8">
              <span className="text-xl font-black">send</span>
              <span className="text-xl font-black text-indigo-600">cv</span>
              <span className="text-[9px] text-gray-300">.ai</span>
            </Link>
            <h1 className="text-2xl font-extrabold">Créer mon compte</h1>
            <p className="text-sm text-gray-500 mt-1">Analyse d&apos;offres gratuite. Pas de carte bancaire.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Nom complet</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Marie Dupont"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="marie@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Min. 6 caractères"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
            </div>

            {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-600/15">
              {loading ? "Création du compte..." : "Commencer gratuitement"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Déjà un compte ? <Link href="/login" className="text-indigo-600 font-medium hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
