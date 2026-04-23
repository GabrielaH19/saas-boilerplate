import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { sendEmail } from "@/app/lib/email";
import {
  paymentSuccessEmail,
  paymentFailedEmail,
  subscriptionCancelledEmail,
} from "@/app/lib/email-templates";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const planAmounts: Record<string, number> = {
  basic: 30,
  pro: 49,
  premium: 79,
};

async function getUserData(userId: string) {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists() ? userDoc.data() : null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // ✅ Plată reușită
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      await setDoc(
        doc(db, "users", userId),
        {
          plan,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Email confirmare plată
      const user = await getUserData(userId);
      if (user?.email) {
        const { subject, html } = paymentSuccessEmail(
          user.name || "transportator",
          plan.charAt(0).toUpperCase() + plan.slice(1),
          planAmounts[plan] ?? 0
        );
        await sendEmail({ to: user.email, subject, html });
      }
    }
  }

  // ❌ Plată eșuată
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    // Găsim userul după stripeCustomerId
    const { getDocs, collection, query, where } = await import("firebase/firestore");
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("stripeCustomerId", "==", customerId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const user = snapshot.docs[0].data();
      if (user.email) {
        const { subject, html } = paymentFailedEmail(user.name || "transportator");
        await sendEmail({ to: user.email, subject, html });
      }
    }
  }

  // 🚫 Abonament anulat
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.userId;

    if (userId) {
      await setDoc(
        doc(db, "users", userId),
        {
          plan: "basic",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Email anulare
      const user = await getUserData(userId);
      if (user?.email) {
        const { subject, html } = subscriptionCancelledEmail(user.name || "transportator");
        await sendEmail({ to: user.email, subject, html });
      }
    }
  }

  return NextResponse.json({ received: true });
}