import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Resend } from "resend";

// Initialize Firebase Admin
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

export async function POST(request: NextRequest) {
  // Verify cron secret
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all premium users
    const usersSnap = await db.collection("users").where("plan", "==", "premium").get();

    if (usersSnap.empty) {
      return NextResponse.json({ message: "No premium users found" });
    }

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthStr = lastMonth.toISOString().slice(0, 7); // "2026-05"

    const results = [];

    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data() as any;
      const userEmail = userData.email;
      const userName = userData.name || userEmail;

      try {
        // Get trips for last month
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

        // Calculate metrics
        const totalProfit = trips.reduce((sum, t) => sum + (t.results?.profit || 0), 0);
        const tripsCount = trips.length;

        // Best truck
        const truckProfits: Record<string, number> = {};
        trips.forEach((t) => {
          const name = t.snapshots?.truckName || "Unknown";
          truckProfits[name] = (truckProfits[name] || 0) + (t.results?.profit || 0);
        });
        const bestTruck =
          Object.entries(truckProfits).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];

        // Best client
        const clientProfits: Record<string, number> = {};
        trips.forEach((t) => {
          const name = t.snapshots?.clientName || "No client";
          clientProfits[name] = (clientProfits[name] || 0) + (t.results?.profit || 0);
        });
        const bestClient =
          Object.entries(clientProfits).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];

        // Generate HTML for email
        const monthName = lastMonth.toLocaleString("ro-RO", {
          month: "long",
          year: "numeric",
        });
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; }
                .header { text-align: center; border-bottom: 2px solid #f5a623; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
                .logo span { color: #f5a623; }
                .title { font-size: 18px; color: #333; }
                .month { color: #666; font-size: 14px; }
                .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
                .card { padding: 20px; background-color: #f9f9f9; border-left: 4px solid #f5a623; }
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
                  <div class="title">Raport lunar</div>
                  <div class="month">${monthName}</div>
                </div>

                <p>Bună ${userName},</p>
                <p>Iată rezumatul performanței tale pentru luna trecută:</p>

                <div class="cards">
                  <div class="card">
                    <div class="card-label">Curse efectuate</div>
                    <div class="card-value">${tripsCount}</div>
                  </div>
                  <div class="card">
                    <div class="card-label">Profit total</div>
                    <div class="card-value">${totalProfit >= 0 ? "+" : ""}${totalProfit.toLocaleString("ro-RO", {
          minimumFractionDigits: 0,
        })} €</div>
                  </div>
                  <div class="card">
                    <div class="card-label">Cel mai bun camion</div>
                    <div class="card-value">${bestTruck[0]}</div>
                    <div class="card-subtext">Profit: +${(bestTruck[1] as number).toLocaleString("ro-RO", {
          minimumFractionDigits: 0,
        })} €</div>
                  </div>
                  <div class="card">
                    <div class="card-label">Cel mai bun client</div>
                    <div class="card-value">${bestClient[0]}</div>
                    <div class="card-subtext">Profit: +${(bestClient[1] as number).toLocaleString("ro-RO", {
          minimumFractionDigits: 0,
        })} €</div>
                  </div>
                </div>

                <div style="text-align: center;">
                  <a href="https://tripprofit.ro/report" class="btn">Vezi raportul complet</a>
                </div>

                <div class="footer">
                  <p>© 2026 TripProfit. Toate drepturile rezervate.</p>
                  <p>
                    <a href="https://tripprofit.ro">tripprofit.ro</a> | 
                    <a href="mailto:contact@tripprofit.ro">contact@tripprofit.ro</a>
                  </p>
                </div>
              </div>
            </body>
          </html>
        `;

        // Send email via Resend
        const emailResponse = await resend.emails.send({
          from: "contact@tripprofit.ro",
          to: userEmail,
          subject: `TripProfit - Raport lunar ${monthName}`,
          html: htmlContent,
        });

        results.push({
          userId,
          status: "sent",
          email: userEmail,
          tripsCount,
          totalProfit,
        });
      } catch (userError) {
        console.error(`Error processing user ${userId}:`, userError);
        results.push({
          userId,
          status: "error",
          error: (userError as Error).message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        error: "Failed to process reports",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
