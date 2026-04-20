import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!); }

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await request.json() as { plan: "pro" | "lifetime" };
  const stripe = getStripe();

  if (plan === "lifetime") {
    // One-time payment
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      metadata: { user_id: user.id, plan: "lifetime" },
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "SendCV.ai Lifetime",
            description: "Accès illimité à vie — Générations, templates, PDF, scoring",
          },
          unit_amount: 7900,
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=lifetime`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });
    return Response.json({ url: session.url });
  }

  if (plan === "pro") {
    // Monthly subscription
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      metadata: { user_id: user.id, plan: "pro" },
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "SendCV.ai Pro",
            description: "Tout illimité — Générations, templates, PDF, scoring",
          },
          unit_amount: 1900,
          recurring: { interval: "month" },
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=pro`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });
    return Response.json({ url: session.url });
  }

  return Response.json({ error: "Invalid plan" }, { status: 400 });
}
