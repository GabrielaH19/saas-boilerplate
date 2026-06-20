import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/email";
import { day3Email, day7Email, trialExpiringSoonEmail, trialExpiredEmail } from "@/app/lib/email-templates";
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const snapshot = await getDocs(collection(db, "users"));

  for (const doc of snapshot.docs) {
    const user = doc.data();
    const createdAt: Date = user.createdAt?.toDate?.() ?? new Date(user.createdAt);
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const name = user.name || "user";
    const email = user.email;
    const plan = user.plan || "free";

    if (!email) continue;

    if (daysSinceCreation === 3 && plan === "free") {
      const { subject, html } = day3Email(name);
      await sendEmail({ to: email, subject, html });
    }

    if (daysSinceCreation === 7 && plan === "free") {
      const { subject, html } = day7Email(name);
      await sendEmail({ to: email, subject, html });
    }

    if (daysSinceCreation === 27 && plan === "free") {
      const { subject, html } = trialExpiringSoonEmail(name);
      await sendEmail({ to: email, subject, html });
    }

    if (daysSinceCreation === 31 && plan === "free") {
      const { subject, html } = trialExpiredEmail(name);
      await sendEmail({ to: email, subject, html });
    }
  }

  return NextResponse.json({ ok: true });
}