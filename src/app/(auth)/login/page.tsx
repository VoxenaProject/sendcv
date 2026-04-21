"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Renseigne ton email d'abord."); return; }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/callback`,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setResetSent(true);
    setLoading(false);
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
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-white leading-tight">Content de te revoir.</h2>
          <p className="text-indigo-200 text-sm leading-relaxed">Tes candidatures t&apos;attendent. Connecte-toi et continue à décrocher des entretiens.</p>
        </div>
        <p className="text-xs text-indigo-300">sendcv.ai — Powered by Claude Opus 4.7</p>
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
            <h1 className="text-2xl font-extrabold">{showReset ? "Réinitialiser le mot de passe" : "Se connecter"}</h1>
            <p className="text-sm text-gray-500 mt-1">{showReset ? "On t'envoie un lien par email." : "Accède à tes candidatures."}</p>
          </div>

          {resetSent ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-sm font-semibold text-emerald-800">Email envoyé !</p>
              <p className="text-xs text-emerald-600 mt-1">Vérifie ta boîte mail (et les spams) pour le lien de réinitialisation.</p>
              <button onClick={() => { setShowReset(false); setResetSent(false); }} className="text-xs text-indigo-600 font-medium mt-3 hover:underline cursor-pointer">
                Retour à la connexion
              </button>
            </div>
          ) : showReset ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ton@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
              </div>
              {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 cursor-pointer">
                {loading ? "Envoi..." : "Envoyer le lien"}
              </button>
              <button type="button" onClick={() => setShowReset(false)} className="w-full text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                Retour à la connexion
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ton@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-700">Mot de passe</label>
                  <button type="button" onClick={() => setShowReset(true)} className="text-xs text-indigo-600 hover:underline cursor-pointer">
                    Mot de passe oublié ?
                  </button>
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
              </div>

              {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-600/15">
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          )}

          {!showReset && !resetSent && (
            <p className="text-center text-sm text-gray-500">
              Pas de compte ? <Link href="/signup" className="text-indigo-600 font-medium hover:underline">Créer un compte</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
