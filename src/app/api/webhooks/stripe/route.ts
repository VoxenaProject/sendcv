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

  const supabase = createAdminClient();

  // Checkout completed (lifetime one-time OR first subscription payment)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      // Vérifier que le user existe avant de mettre à jour
      const { data: existing } = await supabase.from("profiles").select("id").eq("id", userId).single();
      if (existing) {
        await supabase.from("profiles").update({
          plan,
          subscription_id: session.subscription as string || null,
          subscription_status: "active",
          stripe_customer_id: session.customer as string || null,
        }).eq("id", userId);
      }
    }
  }

  // Subscription cancelled or expired
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Find user by stripe customer ID
    const { data: profiles } = await supabase.from("profiles").select("id").eq("stripe_customer_id", customerId);
    if (profiles && profiles.length > 0) {
      await supabase.from("profiles").update({
        plan: "free",
        subscription_status: "cancelled",
      }).eq("id", profiles[0].id);
    }
  }

  // Payment failed
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    const { data: profiles } = await supabase.from("profiles").select("id").eq("stripe_customer_id", customerId);
    if (profiles && profiles.length > 0) {
      await supabase.from("profiles").update({
        subscription_status: "past_due",
      }).eq("id", profiles[0].id);
    }
  }

  return NextResponse.json({ received: true });
}
