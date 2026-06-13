import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Resend } from "resend";

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app =
  getApps().length === 0
    ? initializeApp({ credential: cert(firebaseAdminConfig as any) })
    : getApps()[0];
const db = getFirestore(app);

const resend = new Resend(process.env.RESEND_API_KEY);

const translations = {
  ro: {
    title: "Raport lunar",
    greeting: (name: string) => `Buna ${name},`,
    intro: "Iata rezumatul performantei tale pentru luna trecuta:",
    tripsCount: "Curse efectuate",
    totalProfit: "Profit total",
    bestTruck: "Cel mai bun camion",
    bestClient: "Cel mai bun client",
    profit: "Profit",
    viewReport: "Vezi raportul complet",
    rights: "2026 TripProfit. Toate drepturile rezervate.",
    subject: (month: string) => `TripProfit - Raport lunar ${month}`,
    locale: "ro-RO",
  },
  it: {
    title: "Report mensile",
    greeting: (name: string) => `Ciao ${name},`,
    intro: "Ecco il riepilogo delle tue performance del mese scorso:",
    tripsCount: "Viaggi effettuati",
    totalProfit: "Profitto totale",
    bestTruck: "Miglior camion",
    bestClient: "Miglior cliente",
    profit: "Profitto",
    viewReport: "Vedi il report completo",
    rights: "2026 TripProfit. Tutti i diritti riservati.",
    subject: (month: string) => `TripProfit - Report mensile ${month}`,
    locale: "it-IT",
  },
};

async function handler(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usersSnap = await db.collection("users").get();

    if (usersSnap.empty) {
      return NextResponse.json({ message: "No users found" });
    }

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthStr = lastMonth.toISOString().slice(0, 7);

    const results = [];

    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data() as any;
      const userEmail = userData.email;
      const userName = userData.name || userEmail;
      const userPlan = userData.plan;
      const trialEnd = userData.trialEnd;
      const userLocale = userData.locale === "it" ? "it" : "ro";
      const t = translations[userLocale];
      const isOnTrial = userPlan === "free" && trialEnd && new Date(trialEnd) > new Date();
      if (userPlan !== "premium" && userPlan !== "pro" && !isOnTrial) continue;

      try {
        const tripsSnap = await db
          .collection("trips")
          .where("userId", "==", userId)
          .where("tripDate", ">=", `${monthStr}-01`)
          .where("tripDate", "<", `${monthStr}-32`)
          .get();

        const trips = tripsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

        if (trips.length === 0) {
          results.push({ userId, status: "skipped", reason: "no trips" });
          continue;
        }

        const totalProfit = trips.reduce((sum: number, t: any) => sum + (t.results?.profit || 0), 0);
        const tripsCount = trips.length;

        const truckProfits: Record<string, number> = {};
        trips.forEach((trip: any) => {
          const name = trip.snapshots?.truckName || "Unknown";
          truckProfits[name] = (truckProfits[name] || 0) + (trip.results?.profit || 0);
        });
        const bestTruck = Object.entries(truckProfits).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];

        const clientProfits: Record<string, number> = {};
        trips.forEach((trip: any) => {
          const name = trip.snapshots?.clientName || (userLocale === "it" ? "Nessun cliente" : "Fara client");
          clientProfits[name] = (clientProfits[name] || 0) + (trip.results?.profit || 0);
        });
        const bestClient = Object.entries(clientProfits).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];

        const monthName = lastMonth.toLocaleString(t.locale, { month: "long", year: "numeric" });

        const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; }
      .header { text-align: center; border-bottom: 2px solid #f5a623; padding-bottom: 20px; margin-bottom: 30px; }
      .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
      .logo span { color: #f5a623; }
      .card { padding: 20px; background-color: #f9f9f9; border-left: 4px solid #f5a623; margin-bottom: 16px; }
      .card-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 8px; }
      .card-value { font-size: 24px; font-weight: bold; color: #333; }
      .card-subtext { font-size: 12px; color: #999; margin-top: 8px; }
      .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
      .footer a { color: #f5a623; text-decoration: none; }
      .btn { display: inline-block; padding: 12px 30px; background-color: #f5a623; color: black; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">Trip<span>Profit</span></div>
        <div style="font-size:18px;color:#333;">${t.title}</div>
        <div style="color:#666;font-size:14px;">${monthName}</div>
      </div>
      <p>${t.greeting(userName)}</p>
      <p>${t.intro}</p>
      <div class="card">
        <div class="card-label">${t.tripsCount}</div>
        <div class="card-value">${tripsCount}</div>
      </div>
      <div class="card">
        <div class="card-label">${t.totalProfit}</div>
        <div class="card-value">${totalProfit >= 0 ? "+" : ""}${totalProfit.toLocaleString(t.locale, { minimumFractionDigits: 0 })} EUR</div>
      </div>
      <div class="card">
        <div class="card-label">${t.bestTruck}</div>
        <div class="card-value">${bestTruck[0]}</div>
        <div class="card-subtext">${t.profit}: +${(bestTruck[1] as number).toLocaleString(t.locale, { minimumFractionDigits: 0 })} EUR</div>
      </div>
      <div class="card">
        <div class="card-label">${t.bestClient}</div>
        <div class="card-value">${bestClient[0]}</div>
        <div class="card-subtext">${t.profit}: +${(bestClient[1] as number).toLocaleString(t.locale, { minimumFractionDigits: 0 })} EUR</div>
      </div>
      <div style="text-align:center;">
        <a href="https://tripprofit.ro/report" class="btn">${t.viewReport}</a>
      </div>
      <div class="footer">
        <p>${t.rights}</p>
        <p><a href="https://tripprofit.ro">tripprofit.ro</a> | <a href="mailto:contact@tripprofit.ro">contact@tripprofit.ro</a></p>
      </div>
    </div>
  </body>
</html>`;

        await resend.emails.send({
          from: "contact@tripprofit.ro",
          to: userEmail,
          subject: t.subject(monthName),
          html: htmlContent,
        });

        results.push({ userId, status: "sent", email: userEmail, tripsCount, totalProfit, locale: userLocale });
      } catch (userError) {
        console.error(`Error processing user ${userId}:`, userError);
        results.push({ userId, status: "error", error: (userError as Error).message });
      }
    }

    return NextResponse.json({ success: true, processed: results.length, results });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ error: "Failed to process reports", details: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}