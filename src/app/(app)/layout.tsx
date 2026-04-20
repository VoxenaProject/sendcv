import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MobileNav, DesktopNav } from "@/components/app/nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("full_name, plan").eq("id", user.id).single();
  const name = (profile as { full_name: string } | null)?.full_name ?? "";
  const plan = ((profile as { plan: string } | null)?.plan ?? "free") as "free" | "pro" | "lifetime";

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc]">
      <DesktopNav plan={plan} name={name} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-24 sm:pb-8">
        {children}
      </main>
      <MobileNav plan={plan} />
    </div>
  );
}
