import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const PRICE_IDS: Record<string, string> = {
  basic: process.env.STRIPE_PRICE_BASIC!,
  pro: process.env.STRIPE_PRICE_PRO!,
  premium: process.env.STRIPE_PRICE_PREMIUM!,
};

const PRICE_IDS_FOUNDER: Record<string, string> = {
  basic: process.env.STRIPE_PRICE_BASIC_FOUNDER!,
  pro: process.env.STRIPE_PRICE_PRO_FOUNDER!,
  premium: process.env.STRIPE_PRICE_PREMIUM_FOUNDER!,
};

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, email, createdAt, founderPricing } = await req.json();

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json({ error: "Plan invalid" }, { status: 400 });
    }

    // Foloseste pretul fondator daca e eligibil
    const priceId = founderPricing ? PRICE_IDS_FOUNDER[plan] : PRICE_IDS[plan];

    // Calculeaza zilele ramase din trial
    const daysSince = createdAt
      ? Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 30;
    const trialDays = Math.max(0, 30 - daysSince);

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        plan,
      },
      subscription_data: {
        metadata: {
          userId,
          plan,
        },
        ...(trialDays > 0 ? { trial_period_days: trialDays } : {}),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}