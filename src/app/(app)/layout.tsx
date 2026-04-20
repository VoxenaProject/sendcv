import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MobileNav, DesktopNav } from "@/components/app/nav";
import { headers } from "next/headers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("credits, full_name, experience").eq("id", user.id).single();
  const credits = (profile as { credits: number } | null)?.credits ?? 0;
  const name = (profile as { full_name: string } | null)?.full_name ?? "";
  const hasExperience = !!(profile as { experience: string | null } | null)?.experience?.trim();

  // Rediriger vers onboarding si profil incomplet (sauf si déjà sur /onboarding)
  const headersList = await headers();
  const url = headersList.get("x-url") || headersList.get("x-invoke-path") || "";
  const isOnboarding = url.includes("/onboarding");

  if (!hasExperience && !isOnboarding) {
    // Check via pathname from referer as fallback
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      <DesktopNav credits={credits} name={name} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-24 sm:pb-8">
        {children}
      </main>
      <MobileNav credits={credits} />
    </div>
  );
}
