import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { sendEmail } from "@/app/lib/email";
import {
  day3Email,
  day7Email,
  trialExpiringSoonEmail,
  trialExpiredEmail,
} from "@/app/lib/email-templates";

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        } as any),
      })
    : getApps()[0];

const db = getFirestore(app);

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const usersSnap = await db.collection("users").get();
  const results = [];

  for (const doc of usersSnap.docs) {
    const user = doc.data();
    const email = user.email;
    const name = user.name || "user";
    const plan = user.plan || "free";

    if (!email) continue;
    if (plan !== "free") continue; // drip emails only for trial/free users

    const createdAt = user.createdAt ? new Date(user.createdAt) : null;
    if (!createdAt) continue;

    const daysSince = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    const emailsSent: string[] = user.emailsSent || [];

    try {
      if (daysSince >= 3 && !emailsSent.includes("day3")) {
        const { subject, html } = day3Email(name);
        await sendEmail({ to: email, subject, html });
        await doc.ref.update({ emailsSent: [...emailsSent, "day3"] });
        results.push({ email, sent: "day3" });
      } else if (daysSince >= 7 && !emailsSent.includes("day7")) {
        const { subject, html } = day7Email(name);
        await sendEmail({ to: email, subject, html });
        await doc.ref.update({ emailsSent: [...emailsSent, "day7"] });
        results.push({ email, sent: "day7" });
      } else if (daysSince >= 27 && !emailsSent.includes("trial_expiring")) {
        const { subject, html } = trialExpiringSoonEmail(name);
        await sendEmail({ to: email, subject, html });
        await doc.ref.update({ emailsSent: [...emailsSent, "trial_expiring"] });
        results.push({ email, sent: "trial_expiring" });
      } else if (daysSince >= 31 && !emailsSent.includes("trial_expired")) {
        const { subject, html } = trialExpiredEmail(name);
        await sendEmail({ to: email, subject, html });
        await doc.ref.update({ emailsSent: [...emailsSent, "trial_expired"] });
        results.push({ email, sent: "trial_expired" });
      }
    } catch (err) {
      results.push({ email, error: (err as Error).message });
    }
  }

  return NextResponse.json({ ok: true, results });
}