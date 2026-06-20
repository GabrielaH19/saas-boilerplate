import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
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
  col1: { width: "15%" },
  col2: { width: "45%" },
  col3: { width: "20%" },
  col4: { width: "20%" },
  footer: { marginTop: 20, paddingTop: 10, borderTop: "0.5px solid #e0e0e0", alignItems: "center" },
  footerText: { fontSize: 7, color: "#999999" },
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const month = searchParams.get("month");

  if (!userId || !month) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const userDoc = await db.collection("users").doc(userId).get();
  const userData = userDoc.data() as any;
  const userName = userData?.name || userData?.email || "User";
  const userEmail = userData?.email || "";

  // TODO: Replace "items" with your own Firestore collection
  const itemsSnap = await db.collection("items")
    .where("userId", "==", userId)
    .where("date", ">=", `${month}-01`)
    .where("date", "<", `${month}-32`)
    .get();

  const items = itemsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

  if (items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 404 });
  }

  const totalRevenue = items.reduce((s, item) => s + (item.revenue || 0), 0);
  const totalCosts = items.reduce((s, item) => s + (item.costs || 0), 0);
  const totalProfit = items.reduce((s, item) => s + (item.profit || 0), 0);
  const monthName = new Date(month + "-01").toLocaleString("en-US", { month: "long", year: "numeric" });
  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0 }) + " EUR";

  const pdf = (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.logo}>YourApp</Text>
          <Text style={pdfStyles.logoSub}>Monthly Report — {monthName}</Text>
          <Text style={pdfStyles.userLine}>{userName} · {userEmail}</Text>
        </View>

        <View style={pdfStyles.cards}>
          <View style={pdfStyles.card}><Text style={pdfStyles.cardLabel}>Items</Text><Text style={pdfStyles.cardValue}>{items.length}</Text></View>
          <View style={pdfStyles.card}><Text style={pdfStyles.cardLabel}>Total Revenue</Text><Text style={pdfStyles.cardValue}>{fmt(totalRevenue)}</Text></View>
          <View style={pdfStyles.card}><Text style={pdfStyles.cardLabel}>Total Costs</Text><Text style={pdfStyles.cardValue}>{fmt(totalCosts)}</Text></View>
          <View style={pdfStyles.card}><Text style={pdfStyles.cardLabel}>Net Profit</Text><Text style={totalProfit >= 0 ? pdfStyles.cardValuePos : pdfStyles.cardValueNeg}>{totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)}</Text></View>
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
            <Text style={[totalProfit >= 0 ? pdfStyles.tdPos : pdfStyles.tdNeg, pdfStyles.col4]}>{totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)}</Text>
          </View>
        </View>

        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>yourapp.com · contact@yourapp.com</Text>
          <Text style={pdfStyles.footerText}>© 2026 YourApp. All rights reserved.</Text>
        </View>
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(pdf);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="YourApp-Report-${month}.pdf"`,
    },
  });
}