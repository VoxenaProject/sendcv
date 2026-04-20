import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { CREDIT_PACKS, type PackKey } from "@/types";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { pack } = await request.json() as { pack: PackKey };
  const packInfo = CREDIT_PACKS[pack];
  if (!packInfo) return Response.json({ error: "Invalid pack" }, { status: 400 });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    metadata: { user_id: user.id, pack, credits: String(packInfo.credits) },
    line_items: [{
      price_data: {
        currency: "eur",
        product_data: {
          name: `SendCV ${packInfo.label} — ${packInfo.credits} credits`,
          description: `${packInfo.credits} candidatures completes (CV + lettre + interview prep)`,
        },
        unit_amount: packInfo.price,
      },
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?purchased=${pack}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  return Response.json({ url: session.url });
}
