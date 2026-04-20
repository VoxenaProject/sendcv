import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const credits = parseInt(session.metadata?.credits || "0");

    if (userId && credits > 0) {
      const supabase = createAdminClient();

      // Ajouter les credits
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", userId).single();
      const currentCredits = (profile as { credits: number } | null)?.credits || 0;

      await supabase.from("profiles").update({ credits: currentCredits + credits }).eq("id", userId);

      // Log transaction
      await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount: credits,
        type: "purchase",
        description: `Achat pack ${session.metadata?.pack} — ${credits} credits`,
        stripe_session_id: session.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}
