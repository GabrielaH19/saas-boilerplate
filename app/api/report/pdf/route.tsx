import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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

const tr = {
  ro: { title: "Raport lunar", tripsCount: "Curse efectuate", totalRevenue: "Venit total", totalCosts: "Costuri totale", totalProfit: "Profit net", tripDetail: "Detaliu curse", date: "Data", route: "Ruta", truck: "Camion", client: "Client", revenue: "Venit", costs: "Costuri", profit: "Profit", total: "Total", rights: "2026 TripProfit. Toate drepturile rezervate.", noClient: "Fara client", locale: "ro-RO" },
  it: { title: "Report mensile", tripsCount: "Viaggi effettuati", totalRevenue: "Ricavo totale", totalCosts: "Costi totali", totalProfit: "Profitto netto", tripDetail: "Dettaglio viaggi", date: "Data", route: "Percorso", truck: "Camion", client: "Cliente", revenue: "Ricavo", costs: "Costi", profit: "Profitto", total: "Totale", rights: "2026 TripProfit. Tutti i diritti riservati.", noClient: "Nessun cliente", locale: "it-IT" },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const month = searchParams.get("month");
  const locale = searchParams.get("locale") === "it" ? "it" : "ro";
  const t = tr[locale];

  if (!userId || !month) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const userDoc = await db.collection("users").doc(userId).get();
  const userData = userDoc.data() as any;
  const userName = userData?.name || userData?.email || "User";
  const userEmail = userData?.email || "";

  const tripsSnap = await db
    .collection("trips")
    .where("userId", "==", userId)
    .where("tripDate", ">=", `${month}-01`)
    .where("tripDate", "<", `${month}-32`)
    .get();

  const trips = tripsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

  if (trips.length === 0) {
    return NextResponse.json({ error: "No trips" }, { status: 404 });
  }

  const totalRevenue = trips.reduce((s, tr) => s + (tr.results?.revenue || tr.revenue || 0), 0);
  const totalCosts = trips.reduce((s, tr) => s + (tr.results?.totalCosts || tr.totalCosts || 0), 0);
  const totalProfit = trips.reduce((s, tr) => s + (tr.results?.profit || 0), 0);
  const monthName = new Date(month + "-01").toLocaleString(t.locale, { month: "long", year: "numeric" });
  const fmt = (n: number) => n.toLocaleString(t.locale, { minimumFractionDigits: 0 }) + " EUR";

  const pdf = (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.logo}>TripProfit</Text>
          <Text style={pdfStyles.logoSub}>{t.title} — {monthName}</Text>
          <Text style={pdfStyles.userLine}>{userName} · {userEmail}</Text>
        </View>
        <View style={pdfStyles.cards}>
          <View style={pdfStyles.card}><Text style={pdfStyles.cardLabel}>{t.tripsCount}</Text><Text style={pdfStyles.cardValue}>{trips.length}</Text></View>
          <View style={pdfStyles.card}><Text style={pdfStyles.cardLabel}>{t.totalRevenue}</Text><Text style={pdfStyles.cardValue}>{fmt(totalRevenue)}</Text></View>
          <View style={pdfStyles.card}><Text style={pdfStyles.cardLabel}>{t.totalCosts}</Text><Text style={pdfStyles.cardValue}>{fmt(totalCosts)}</Text></View>
          <View style={pdfStyles.card}><Text style={pdfStyles.cardLabel}>{t.totalProfit}</Text><Text style={totalProfit >= 0 ? pdfStyles.cardValuePos : pdfStyles.cardValueNeg}>{totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)}</Text></View>
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
            const profitStyle = profit > 0 ? pdfStyles.tdPos : profit < 0 ? pdfStyles.tdNeg : pdfStyles.td;
            return (
              <View key={trip.id} style={isLast ? pdfStyles.tableRowLast : pdfStyles.tableRow}>
                <Text style={[pdfStyles.td, pdfStyles.col1]}>{trip.tripDate || "-"}</Text>
                <Text style={[pdfStyles.td, pdfStyles.col2]}>{trip.snapshots?.fromCity || trip.fromCity || "-"} — {trip.snapshots?.toCity || trip.toCity || "-"}</Text>
                <Text style={[pdfStyles.td, pdfStyles.col3]}>{trip.snapshots?.truckName || "-"}</Text>
                <Text style={[pdfStyles.td, pdfStyles.col4]}>{trip.snapshots?.clientName || t.noClient}</Text>
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
            <Text style={[totalProfit >= 0 ? pdfStyles.tdPos : pdfStyles.tdNeg, pdfStyles.col7]}>{totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)}</Text>
          </View>
        </View>
        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>tripprofit.ro · contact@tripprofit.ro</Text>
          <Text style={pdfStyles.footerText}>{t.rights}</Text>
        </View>
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(pdf);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="TripProfit-${month}.pdf"`,
    },
  });
}