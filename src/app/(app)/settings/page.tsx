"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data as unknown as Profile);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    await supabase.from("profiles").update({
      full_name: profile.full_name,
      headline: profile.headline,
      experience: profile.experience,
      education: profile.education,
      skills: profile.skills,
      languages: profile.languages,
      location: profile.location,
      linkedin_url: profile.linkedin_url,
    }).eq("id", profile.id);
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) return <div className="text-center py-12 text-muted">Chargement...</div>;
  if (!profile) return null;

  function update(field: keyof Profile, value: string) {
    setProfile((p) => p ? { ...p, [field]: value } : p);
    setSaved(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-black">Mon profil</h1>
      <p className="text-sm text-muted -mt-4">Plus votre profil est complet, plus les candidatures seront personnalisees.</p>

      <form onSubmit={handleSave} className="space-y-5">
        <Field label="Nom complet" value={profile.full_name} onChange={(v) => update("full_name", v)} />
        <Field label="Titre / Headline" value={profile.headline || ""} onChange={(v) => update("headline", v)} placeholder="Ex: Developpeur Full-Stack Senior" />
        <Field label="Experience" value={profile.experience || ""} onChange={(v) => update("experience", v)} multiline placeholder="Decrivez vos experiences professionnelles (postes, entreprises, dates, realisations cles)" />
        <Field label="Formation" value={profile.education || ""} onChange={(v) => update("education", v)} multiline placeholder="Diplomes, formations, certifications" />
        <Field label="Competences" value={profile.skills || ""} onChange={(v) => update("skills", v)} multiline placeholder="Vos competences techniques et soft skills (separees par des virgules)" />
        <Field label="Langues" value={profile.languages || ""} onChange={(v) => update("languages", v)} placeholder="Ex: Francais (natif), Anglais (courant), Neerlandais (B2)" />
        <Field label="Localisation" value={profile.location || ""} onChange={(v) => update("location", v)} placeholder="Ex: Bruxelles, Belgique" />
        <Field label="LinkedIn URL" value={profile.linkedin_url || ""} onChange={(v) => update("linkedin_url", v)} placeholder="https://linkedin.com/in/votre-profil" />

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer">
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
          {saved && <span className="text-sm text-success font-medium">Sauvegarde !</span>}
        </div>
      </form>

      <hr className="border-border" />
      <button onClick={handleLogout} className="text-sm text-danger hover:underline cursor-pointer">Se deconnecter</button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const cls = "w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary transition-colors";
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} placeholder={placeholder} className={cls + " resize-none"} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}
