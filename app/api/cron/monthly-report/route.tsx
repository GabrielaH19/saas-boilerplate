import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Resend } from "resend";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const app =
  getApps().length === 0
    ? initializeApp({ credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      } as any) })
    : getApps()[0];
const db = getFirestore(app);
const resend = new Resend(process.env.RESEND_API_KEY);

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
  col1: { width: "20%" },
  col2: { width: "40%" },
  col3: { width: "20%" },
  col4: { width: "20%" },
  footer: { marginTop: 20, paddingTop: 10, borderTop: "0.5px solid #e0e0e0", alignItems: "center" },
  footerText: { fontSize: 7, color: "#999999" },
});

function buildPDF(userName: string, userEmail: string, monthName: string, items: any[]) {
  const totalRevenue = items.reduce((s, item) => s + (item.revenue || 0), 0);
  const totalCosts = items.reduce((s, item) => s + (item.costs || 0), 0);
  const totalProfit = items.reduce((s, item) => s + (item.profit || 0), 0);
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0 }) + " EUR";

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.logo}>YourApp</Text>
          <Text style={pdfStyles.logoSub}>Monthly Report — {monthName}</Text>
          <Text style={pdfStyles.userLine}>{userName} · {userEmail}</Text>
        </View>

        <View style={pdfStyles.cards}>
          <View style={pdfStyles.card}>
            <Text style={pdfStyles.cardLabel}>Items</Text>
            <Text style={pdfStyles.cardValue}>{items.length}</Text>
          </View>
          <View style={pdfStyles.card}>
            <Text style={pdfStyles.cardLabel}>Total Revenue</Text>
            <Text style={pdfStyles.cardValue}>{fmt(totalRevenue)}</Text>
          </View>
          <View style={pdfStyles.card}>
            <Text style={pdfStyles.cardLabel}>Total Costs</Text>
            <Text style={pdfStyles.cardValue}>{fmt(totalCosts)}</Text>
          </View>
          <View style={pdfStyles.card}>
            <Text style={pdfStyles.cardLabel}>Net Profit</Text>
            <Text style={totalProfit >= 0 ? pdfStyles.cardValuePos : pdfStyles.cardValueNeg}>
              {totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)}
            </Text>
          </View>
        </View>

        <Text style={pdfStyles.sectionTitle}>Item Details</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.th, pdfStyles.col1]}>Date</Text>
            <Text style={[pdfStyles.th, pdfStyles.col2]}>Description</Text>
            <Text style={[pdfStyles.th, pdfStyles.col3]}>Revenue</Text>
            <Text style={[pdfStyles.th, pdfStyles.col4]}>Profit</Text>
          </View>

          {items.map((item: any, i: number) => {
            const profit = item.profit || 0;
            const isLast = i === items.length - 1;
            const profitStyle = profit > 0 ? pdfStyles.tdPos : profit < 0 ? pdfStyles.tdNeg : pdfStyles.td;
            return (
              <View key={item.id} style={isLast ? pdfStyles.tableRowLast : pdfStyles.tableRow}>
                <Text style={[pdfStyles.td, pdfStyles.col1]}>{item.date || "-"}</Text>
                <Text style={[pdfStyles.td, pdfStyles.col2]}>{item.description || "-"}</Text>
                <Text style={[pdfStyles.td, pdfStyles.col3]}>{fmt(item.revenue || 0)}</Text>
                <Text style={[profitStyle, pdfStyles.col4]}>{profit >= 0 ? "+" : ""}{fmt(profit)}</Text>
              </View>
            );
          })}

          <View style={pdfStyles.tableRowTotal}>
            <Text style={[pdfStyles.tdTotal, { width: "60%" }]}>Total</Text>
            <Text style={[pdfStyles.tdTotal, pdfStyles.col3]}>{fmt(totalRevenue)}</Text>
            <Text style={[totalProfit >= 0 ? pdfStyles.tdPos : pdfStyles.tdNeg, pdfStyles.col4]}>
              {totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)}
            </Text>
          </View>
        </View>

        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>yourapp.com · contact@yourapp.com</Text>
          <Text style={pdfStyles.footerText}>© 2026 YourApp. All rights reserved.</Text>
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
    if (usersSnap.empty) return NextResponse.json({ message: "No users found" });

    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get("email");

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const monthStr = lastMonth.toISOString().slice(0, 7);
    const monthName = lastMonth.toLocaleString("en-US", { month: "long", year: "numeric" });

    const results = [];

    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data() as any;
      const userEmail = userData.email;

      if (testEmail && userEmail !== testEmail) continue;

      const userName = userData.name || userEmail;
      const userPlan = userData.plan;
      const trialEnd = userData.trialEnd;
      const isOnTrial = userPlan === "free" && trialEnd && new Date(trialEnd) > new Date();

      if (userPlan !== "premium" && userPlan !== "pro" && !isOnTrial) continue;

      try {
        // TODO: Replace "items" with your own Firestore collection
        const itemsSnap = await db.collection("items")
          .where("userId", "==", userId)
          .where("date", ">=", `${monthStr}-01`)
          .where("date", "<", `${monthStr}-32`)
          .get();

        const items = itemsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (items.length === 0) {
          results.push({ userId, status: "skipped", reason: "no items" });
          continue;
        }

        const totalProfit = items.reduce((sum: number, item: any) => sum + (item.profit || 0), 0);

        const pdfDoc = buildPDF(userName, userEmail, monthName, items);
        const pdfBuffer = await renderToBuffer(pdfDoc);
        const pdfBase64 = pdfBuffer.toString("base64");

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
      .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
      .footer a { color: #f5a623; text-decoration: none; }
      .btn { display: inline-block; padding: 12px 30px; background-color: #f5a623; color: black; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">Your<span>App</span></div>
        <div style="font-size:18px;color:#333;">Monthly Report</div>
        <div style="color:#666;font-size:14px;">${monthName}</div>
      </div>
      <p>Hi ${userName},</p>
      <p>Here's your performance summary for last month:</p>
      <div class="card">
        <div class="card-label">Items</div>
        <div class="card-value">${items.length}</div>
      </div>
      <div class="card">
        <div class="card-label">Net Profit</div>
        <div class="card-value">${totalProfit >= 0 ? "+" : ""}${totalProfit.toLocaleString()} EUR</div>
      </div>
      <div style="text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">View full report →</a>
      </div>
      <div class="footer">
        <p>© 2026 YourApp. All rights reserved.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}">yourapp.com</a> | <a href="mailto:contact@yourapp.com">contact@yourapp.com</a></p>
      </div>
    </div>
  </body>
</html>`;

        await resend.emails.send({
          from: "YourApp <contact@yourapp.com>",
          to: userEmail,
          subject: `YourApp - Monthly Report ${monthName}`,
          html: htmlContent,
          attachments: [{
            filename: `YourApp-Report-${monthStr}.pdf`,
            content: pdfBase64,
          }],
        });

        results.push({ userId, status: "sent", email: userEmail, itemsCount: items.length, totalProfit });
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

export async function GET(request: NextRequest) { return handler(request); }
export async function POST(request: NextRequest) { return handler(request); }