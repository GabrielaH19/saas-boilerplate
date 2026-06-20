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
  basic: 9,
  pro: 19,
  premium: 39,
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
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Payment successful
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      await setDoc(doc(db, "users", userId), {
        plan,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Referral logic
      const newUser = await getUserData(userId);
      if (newUser?.referredBy) {
        const { getDocs, collection, query, where } = await import("firebase/firestore");
        const q = query(collection(db, "users"), where("referralCode", "==", newUser.referredBy));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const referrerDoc = snap.docs[0];
          const referrerData = referrerDoc.data();
          const now = new Date();
          const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
          const monthlyCount = referrerData.referralMonthly?.[monthKey] || 0;
          if (monthlyCount < 4) {
            await setDoc(doc(db, "users", referrerDoc.id), {
              referralEarnings: (referrerData.referralEarnings || 0) + 10,
              referralCount: (referrerData.referralCount || 0) + 1,
              referralMonthly: { ...(referrerData.referralMonthly || {}), [monthKey]: monthlyCount + 1 },
              updatedAt: serverTimestamp(),
            }, { merge: true });
          }
        }
      }

      // Payment confirmation email
      const user = await getUserData(userId);
      if (user?.email) {
        const { subject, html } = paymentSuccessEmail(
          user.name || "user",
          plan.charAt(0).toUpperCase() + plan.slice(1),
          planAmounts[plan] ?? 0
        );
        await sendEmail({ to: user.email, subject, html });
      }
    }
  }

  // Payment failed
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    const { getDocs, collection, query, where } = await import("firebase/firestore");
    const q = query(collection(db, "users"), where("stripeCustomerId", "==", customerId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const user = snapshot.docs[0].data();
      if (user.email) {
        const { subject, html } = paymentFailedEmail(user.name || "user");
        await sendEmail({ to: user.email, subject, html });
      }
    }
  }

  // Subscription cancelled
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.userId;

    if (userId) {
      await setDoc(doc(db, "users", userId), {
        plan: "free",
        updatedAt: serverTimestamp(),
      }, { merge: true });

      const user = await getUserData(userId);
      if (user?.email) {
        const { subject, html } = subscriptionCancelledEmail(user.name || "user");
        await sendEmail({ to: user.email, subject, html });
      }
    }
  }

  return NextResponse.json({ received: true });
}