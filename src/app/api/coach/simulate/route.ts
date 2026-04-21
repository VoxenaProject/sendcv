import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic/client";
import { buildInterviewSimulationSystemPrompt } from "@/lib/anthropic/prompts";
import type { Profile, Application } from "@/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { applicationId, messages } = await request.json();

  // Check plan — coach is Pro/Lifetime only
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const plan = (profile as unknown as { plan: string })?.plan || "free";
  if (plan === "free") return new Response("Upgrade required", { status: 402 });

  const { data: app } = await supabase.from("applications").select("*").eq("id", applicationId).eq("user_id", user.id).single();
  if (!app) return new Response("Not found", { status: 404 });

  const typedProfile = profile as unknown as Profile;
  const typedApp = app as unknown as Application;

  const systemPrompt = buildInterviewSimulationSystemPrompt(
    typedApp.job_description,
    typedProfile,
    typedApp.company_name
  );

  const anthropic = getAnthropicClient();

  const recentMessages = (messages || []).slice(-20).map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Add initial message if empty
  const apiMessages = recentMessages.length === 0
    ? [{ role: "user" as const, content: "Bonjour, je suis prêt pour l'entretien." }]
    : recentMessages;

  const stream = anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: apiMessages,
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        console.error("Coach simulation error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Transfer-Encoding": "chunked" },
  });
}
