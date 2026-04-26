import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic/client";
import { buildAnalysisPrompt, buildAnalysisWithProfilePrompt } from "@/lib/anthropic/prompts";
import type { Profile } from "@/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { jobDescription, jobUrl } = await request.json();
  if (!jobDescription?.trim()) return Response.json({ error: "Job description required" }, { status: 400 });

  // Charger profil
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const typedProfile = profile as unknown as Profile | null;

  const anthropic = getAnthropicClient();
  const prompt = typedProfile?.experience
    ? buildAnalysisWithProfilePrompt(jobDescription, typedProfile)
    : buildAnalysisPrompt(jobDescription);

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") return Response.json({ error: "AI error" }, { status: 500 });

  let analysis;
  try {
    // Nettoyer le texte (parfois l'IA ajoute des backticks markdown)
    let cleaned = textBlock.text.trim();
    if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
    if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
    if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
    analysis = JSON.parse(cleaned.trim());
  } catch {
    console.error("Analyze JSON parse error:", textBlock.text.slice(0, 200));
    return Response.json({ error: "L'analyse a échoué. Réessaie avec une description plus détaillée." }, { status: 500 });
  }

  // Sauvegarder l'application
  const { data: app, error } = await supabase.from("applications").insert({
    user_id: user.id,
    job_url: jobUrl || null,
    job_title: analysis.title || "Poste",
    company_name: analysis.company || "Entreprise",
    job_description: jobDescription,
    analysis,
    match_score: analysis.match_score || null,
    status: "analyzed",
  }).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ application: app, analysis });
}
