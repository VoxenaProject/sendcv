import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic/client";
import { buildCVPrompt, buildCoverLetterPrompt, buildInterviewPrepPrompt, buildLinkedInTipsPrompt, buildStructuredCVPrompt } from "@/lib/anthropic/prompts";
import type { Profile, Application } from "@/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { applicationId } = await request.json();
  if (!applicationId) return Response.json({ error: "Application ID required" }, { status: 400 });

  const [profileRes, appRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("applications").select("*").eq("id", applicationId).eq("user_id", user.id).single(),
  ]);

  const profile = profileRes.data as unknown as Profile | null;
  const application = appRes.data as unknown as Application | null;

  if (!profile) return Response.json({ error: "Profile not found" }, { status: 404 });
  if (!application) return Response.json({ error: "Application not found" }, { status: 404 });
  if (application.status === "generated") return Response.json({ error: "Already generated" }, { status: 400 });
  if (!profile.experience?.trim()) return Response.json({ error: "Profile incomplete", code: "PROFILE_INCOMPLETE" }, { status: 400 });

  // Vérifier le droit de générer
  const plan = (profile as unknown as { plan: string }).plan || "free";
  const freeUsed = (profile as unknown as { free_generation_used: boolean }).free_generation_used || false;

  if (plan === "free" && freeUsed) {
    return Response.json({ error: "Free generation used", code: "UPGRADE_REQUIRED" }, { status: 402 });
  }

  const anthropic = getAnthropicClient();

  // Génération en parallèle — 5 appels Opus 4.7
  const [cvRes, structuredCvRes, letterRes, interviewRes, linkedinRes] = await Promise.all([
    anthropic.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 2500,
      messages: [{ role: "user", content: buildCVPrompt(application.job_description, profile) }],
    }),
    anthropic.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 3000,
      messages: [{ role: "user", content: buildStructuredCVPrompt(application.job_description, profile) }],
    }),
    anthropic.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1500,
      messages: [{ role: "user", content: buildCoverLetterPrompt(application.job_description, profile, application.company_name) }],
    }),
    anthropic.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 3000,
      messages: [{ role: "user", content: buildInterviewPrepPrompt(application.job_description, profile) }],
    }),
    anthropic.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1000,
      messages: [{ role: "user", content: buildLinkedInTipsPrompt(application.job_description, profile) }],
    }),
  ]);

  const getText = (res: typeof cvRes) => {
    const block = res.content.find((b) => b.type === "text");
    return block?.type === "text" ? block.text : "";
  };

  const cv = getText(cvRes);
  const coverLetter = getText(letterRes);
  const linkedinTips = getText(linkedinRes);

  let structuredCv = null;
  try {
    structuredCv = JSON.parse(getText(structuredCvRes));
  } catch {
    // Fallback: structured CV non parsé, on garde le texte
  }

  let interviewPrep;
  try {
    interviewPrep = JSON.parse(getText(interviewRes)).questions;
  } catch {
    interviewPrep = [{ question: "Erreur de génération", why_they_ask: "", optimal_answer: getText(interviewRes) }];
  }

  // Update application
  await supabase.from("applications").update({
    generated_cv: cv,
    structured_cv: structuredCv,
    generated_cover_letter: coverLetter,
    generated_interview_prep: interviewPrep,
    generated_linkedin_tips: linkedinTips,
    status: "generated",
  }).eq("id", applicationId);

  // Tracker l'usage
  const genCount = ((profile as unknown as { generation_count: number }).generation_count || 0) + 1;
  const updateData: Record<string, unknown> = { generation_count: genCount };
  if (plan === "free") updateData.free_generation_used = true;

  await supabase.from("profiles").update(updateData).eq("id", user.id);

  // Log
  await supabase.from("credit_transactions").insert({
    user_id: user.id,
    amount: -1,
    type: "usage",
    description: `Candidature: ${application.job_title} @ ${application.company_name}`,
  });

  return Response.json({ success: true });
}
