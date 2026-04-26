import { getAnthropicClient } from "@/lib/anthropic/client";
import { headers } from "next/headers";

// Rate limit basique en mémoire (reset au redeploy)
const rateLimitMap = new Map<string, number>();

export async function POST(request: Request) {
  // Rate limit par IP — 3 par heure
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
  const now = Date.now();
  const lastCall = rateLimitMap.get(ip) || 0;
  if (now - lastCall < 20 * 60 * 1000) { // 20 min entre chaque appel
    return Response.json({ error: "Crée un compte gratuit pour continuer les analyses." }, { status: 429 });
  }
  rateLimitMap.set(ip, now);

  const { jobDescription } = await request.json();
  if (!jobDescription?.trim() || jobDescription.trim().length < 50) {
    return Response.json({ error: "Colle au moins 50 caractères." }, { status: 400 });
  }

  const anthropic = getAnthropicClient();

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `Analyse cette offre d'emploi et extrais les informations clés.

OFFRE :
${jobDescription.slice(0, 2000)}

Réponds UNIQUEMENT en JSON valide, sans markdown :
{
  "title": "titre du poste",
  "company": "entreprise",
  "location": "lieu",
  "salary_estimate": "estimation salariale locale (brut mensuel si FR/BE)",
  "keywords": [
    {"word": "mot-clé 1", "importance": "critical"},
    {"word": "mot-clé 2", "importance": "critical"},
    {"word": "mot-clé 3", "importance": "important"},
    {"word": "mot-clé 4", "importance": "important"},
    {"word": "mot-clé 5", "importance": "nice_to_have"}
  ],
  "ats_score": 75,
  "recruiter_score": 68,
  "interview_probability": 72,
  "top_insight": "conseil clé en 1 phrase pour maximiser les chances"
}

Extrais au minimum 5 keywords. Les scores sont une estimation basée sur la complexité du poste et la demande du marché.`,
    }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return Response.json({ error: "Erreur d'analyse" }, { status: 500 });
  }

  try {
    let raw = textBlock.text.trim();
    if (raw.startsWith("```json")) raw = raw.slice(7);
    if (raw.startsWith("```")) raw = raw.slice(3);
    if (raw.endsWith("```")) raw = raw.slice(0, -3);
    const analysis = JSON.parse(raw.trim());
    return Response.json(analysis);
  } catch {
    return Response.json({ error: "Réessaie avec une description plus détaillée." }, { status: 500 });
  }
}
