import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { stripeCustomerId } = await req.json();

    if (!stripeCustomerId) {
      return NextResponse.json({ error: "stripeCustomerId is required" }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Billing portal error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}