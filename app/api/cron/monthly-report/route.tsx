import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Resend } from "resend";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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
    totalRevenue: "Venit total",
    totalCosts: "Costuri totale",
    totalProfit: "Profit net",
    bestTruck: "Cel mai bun camion",
    bestClient: "Cel mai bun client",
    profit: "Profit",
    date: "Data",
    route: "Ruta",
    truck: "Camion",
    client: "Client",
    revenue: "Venit",
    costs: "Costuri",
    total: "Total",
    tripDetail: "Detaliu curse",
    viewReport: "Vezi raportul complet",
    rights: "2026 TripProfit. Toate drepturile rezervate.",
    subject: (month: string) => `TripProfit - Raport lunar ${month}`,
    locale: "ro-RO",
    noClient: "Fara client",
  },
  it: {
    title: "Report mensile",
    greeting: (name: string) => `Ciao ${name},`,
    intro: "Ecco il riepilogo delle tue performance del mese scorso:",
    tripsCount: "Viaggi effettuati",
    totalRevenue: "Ricavo totale",
    totalCosts: "Costi totali",
    totalProfit: "Profitto netto",
    bestTruck: "Miglior camion",
    bestClient: "Miglior cliente",
    profit: "Profitto",
    date: "Data",
    route: "Percorso",
    truck: "Camion",
    client: "Cliente",
    revenue: "Ricavo",
    costs: "Costi",
    total: "Totale",
    tripDetail: "Dettaglio viaggi",
    viewReport: "Vedi il report completo",
    rights: "2026 TripProfit. Tutti i diritti riservati.",
    subject: (month: string) => `TripProfit - Report mensile ${month}`,
    locale: "it-IT",
    noClient: "Nessun cliente",
  },
};

const pdfStyles = StyleSheet.create({
  page: { padding: 32, fontSize: 9, fontFamily: "Helvetica", backgroundColor: "#ffffff" },
  header: { borderBottom: "2px solid #f5a623", paddingBottom: 12, marginBottom: 16, alignItems: "center" },
  logo: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#f5a623" },
  logoSub: { fontSize: 10, color: "#666666", marginTop: 2 },
  userLine: { fontSize: 8, color: "#999999", marginTop: 2 },
  cards: { flexDirection: "row", gap: 8, marginBottom: 16 },
  card: { flex: 1, backgroundColor: "#f9f9f9", padding: 10, borderRadius: 4 },
  cardLabel: { fontSize: 7, color: "#999999", textTransform: "uppercase", marginBottom: 4 },
  cardValue: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#333333" },
  cardValuePos: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#3B6D11" },
  cardValueNeg: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#A32D2D" },
  sectionTitle: { fontSize: 8, color: "#999999", textTransform: "uppercase", marginBottom: 8, fontFamily: "Helvetica-Bold" },
  table: { border: "0.5px solid #e0e0e0", borderRadius: 4 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f5f5f5", borderBottom: "0.5px solid #e0e0e0", padding: "6px 8px" },
  tableRow: { flexDirection: "row", borderBottom: "0.5px solid #f0f0f0", padding: "5px 8px" },
  tableRowLast: { flexDirection: "row", padding: "5px 8px" },
  tableRowTotal: { flexDirection: "row", backgroundColor: "#f9f9f9", borderTop: "1px solid #e0e0e0", padding: "6px 8px" },
  th: { fontSize: 7, color: "#999999", textTransform: "uppercase", fontFamily: "Helvetica-Bold" },
  td: { fontSize: 8, color: "#333333" },
  tdPos: { fontSize: 8, color: "#3B6D11", fontFamily: "Helvetica-Bold" },
  tdNeg: { fontSize: 8, color: "#A32D2D", fontFamily: "Helvetica-Bold" },
  tdTotal: { fontSize: 8, color: "#333333", fontFamily: "Helvetica-Bold" },
  col1: { width: "9%" },
  col2: { width: "22%" },
  col3: { width: "16%" },
  col4: { width: "16%" },
  col5: { width: "12%" },
  col6: { width: "12%" },
  col7: { width: "13%" },
  footer: { marginTop: 20, paddingTop: 10, borderTop: "0.5px solid #e0e0e0", alignItems: "center" },
  footerText: { fontSize: 7, color: "#999999" },
});

function buildPDF(userName: string, userEmail: string, monthName: string, trips: any[], t: any, userLocale: string) {
  const totalRevenue = trips.reduce((s: number, tr: any) => s + (tr.results?.revenue || tr.revenue || 0), 0);
  const totalCosts = trips.reduce((s: number, tr: any) => s + (tr.results?.totalCosts || tr.totalCosts || 0), 0);
  const totalProfit = trips.reduce((s: number, tr: any) => s + (tr.results?.profit || 0), 0);

  const fmt = (n: number) => n.toLocaleString(t.locale, { minimumFractionDigits: 0 }) + " EUR";

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.logo}>TripProfit</Text>
          <Text style={pdfStyles.logoSub}>{t.title} — {monthName}</Text>
          <Text style={pdfStyles.userLine}>{userName} · {userEmail}</Text>
        </View>

        <View style={pdfStyles.cards}>
          <View style={pdfStyles.card}>
            <Text style={pdfStyles.cardLabel}>{t.tripsCount}</Text>
            <Text style={pdfStyles.cardValue}>{trips.length}</Text>
          </View>
          <View style={pdfStyles.card}>
            <Text style={pdfStyles.cardLabel}>{t.totalRevenue}</Text>
            <Text style={pdfStyles.cardValue}>{fmt(totalRevenue)}</Text>
          </View>
          <View style={pdfStyles.card}>
            <Text style={pdfStyles.cardLabel}>{t.totalCosts}</Text>
            <Text style={pdfStyles.cardValue}>{fmt(totalCosts)}</Text>
          </View>
          <View style={pdfStyles.card}>
            <Text style={pdfStyles.cardLabel}>{t.totalProfit}</Text>
            <Text style={totalProfit >= 0 ? pdfStyles.cardValuePos : pdfStyles.cardValueNeg}>
              {totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)}
            </Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>{t.tripDetail}</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.th, pdfStyles.col1]}>{t.date}</Text>
            <Text style={[pdfStyles.th, pdfStyles.col2]}>{t.route}</Text>
            <Text style={[pdfStyles.th, pdfStyles.col3]}>{t.truck}</Text>
            <Text style={[pdfStyles.th, pdfStyles.col4]}>{t.client}</Text>
            <Text style={[pdfStyles.th, pdfStyles.col5]}>{t.revenue}</Text>
            <Text style={[pdfStyles.th, pdfStyles.col6]}>{t.costs}</Text>
            <Text style={[pdfStyles.th, pdfStyles.col7]}>{t.profit}</Text>
          </View>

          {trips.map((trip: any, i: number) => {
            const profit = trip.results?.profit || 0;
            const revenue = trip.results?.revenue || trip.revenue || 0;
            const costs = trip.results?.totalCosts || trip.totalCosts || 0;
            const isLast = i === trips.length - 1;
            const rowStyle = isLast ? pdfStyles.tableRowLast : pdfStyles.tableRow;
            const profitStyle = profit > 0 ? pdfStyles.tdPos : profit < 0 ? pdfStyles.tdNeg : pdfStyles.td;
            return (
              <View key={trip.id} style={rowStyle}>
                <Text style={[pdfStyles.td, pdfStyles.col1]}>{trip.tripDate || "-"}</Text>
                <Text style={[pdfStyles.td, pdfStyles.col2]}>{trip.snapshots?.fromCity || trip.fromCity || "-"} → {trip.snapshots?.toCity || trip.toCity || "-"}</Text>
                <Text style={[pdfStyles.td, pdfStyles.col3]}>{trip.snapshots?.truckName || trip.truckName || "-"}</Text>
                <Text style={[pdfStyles.td, pdfStyles.col4]}>{trip.snapshots?.clientName || trip.clientName || t.noClient}</Text>
                <Text style={[pdfStyles.td, pdfStyles.col5]}>{fmt(revenue)}</Text>
                <Text style={[pdfStyles.td, pdfStyles.col6]}>{fmt(costs)}</Text>
                <Text style={[profitStyle, pdfStyles.col7]}>{profit >= 0 ? "+" : ""}{fmt(profit)}</Text>
              </View>
            );
          })}

          <View style={pdfStyles.tableRowTotal}>
            <Text style={[pdfStyles.tdTotal, { width: "63%" }]}>{t.total}</Text>
            <Text style={[pdfStyles.tdTotal, pdfStyles.col5]}>{fmt(totalRevenue)}</Text>
            <Text style={[pdfStyles.tdTotal, pdfStyles.col6]}>{fmt(totalCosts)}</Text>
            <Text style={[totalProfit >= 0 ? pdfStyles.tdPos : pdfStyles.tdNeg, pdfStyles.col7]}>
              {totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)}
            </Text>
          </View>
        </View>

        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>tripprofit.ro · contact@tripprofit.ro</Text>
          <Text style={pdfStyles.footerText}>{t.rights}</Text>
        </View>
      </Page>
    </Document>
  );
}

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

        const totalProfit = trips.reduce((sum: number, tr: any) => sum + (tr.results?.profit || 0), 0);
        const monthName = lastMonth.toLocaleString(t.locale, { month: "long", year: "numeric" });

        const pdfDoc = buildPDF(userName, userEmail, monthName, trips, t, userLocale);
       const pdfBuffer = await renderToBuffer(pdfDoc);
        const pdfBase64 = pdfBuffer.toString("base64");

        const truckProfits: Record<string, number> = {};
        trips.forEach((trip: any) => {
          const name = trip.snapshots?.truckName || "Unknown";
          truckProfits[name] = (truckProfits[name] || 0) + (trip.results?.profit || 0);
        });
        const bestTruck = Object.entries(truckProfits).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];

        const clientProfits: Record<string, number> = {};
        trips.forEach((trip: any) => {
          const name = trip.snapshots?.clientName || t.noClient;
          clientProfits[name] = (clientProfits[name] || 0) + (trip.results?.profit || 0);
        });
        const bestClient = Object.entries(clientProfits).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];

        const fmt = (n: number) => n.toLocaleString(t.locale, { minimumFractionDigits: 0 }) + " EUR";

        const htmlContent = `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8">
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
        <div class="card-value">${trips.length}</div>
      </div>
      <div class="card">
        <div class="card-label">${t.totalProfit}</div>
        <div class="card-value">${totalProfit >= 0 ? "+" : ""}${fmt(totalProfit)}</div>
      </div>
      <div class="card">
        <div class="card-label">${t.bestTruck}</div>
        <div class="card-value">${bestTruck[0]}</div>
        <div class="card-subtext">${t.profit}: +${fmt(bestTruck[1] as number)}</div>
      </div>
      <div class="card">
        <div class="card-label">${t.bestClient}</div>
        <div class="card-value">${bestClient[0]}</div>
        <div class="card-subtext">${t.profit}: +${fmt(bestClient[1] as number)}</div>
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
          attachments: [
            {
              filename: `TripProfit-Raport-${monthStr}.pdf`,
              content: pdfBase64,
            },
          ],
        });

        results.push({ userId, status: "sent", email: userEmail, tripsCount: trips.length, totalProfit, locale: userLocale });
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