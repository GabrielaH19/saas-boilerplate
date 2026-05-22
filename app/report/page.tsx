"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import AppNav from "@/app/components/AppNav";
import { useLang } from "../lib/LanguageContext";
import { usePlan } from "../lib/usePlan";
import PaywallModal from "@/app/components/PaywallModal";

export default function ReportPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { limits, loading: planLoading } = usePlan();
  const router = useRouter();
  const { tr } = useLang();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      const q = query(collection(db, "trips"), where("userId", "==", u.uid));
      const snap = await getDocs(q);
      setTrips(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#0d0d0d", useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("tripprofit-raport-" + month + ".pdf");
    } catch (e) { console.error(e); }
    setDownloading(false);
  };

  const monthTrips = trips.filter((t) => t.date?.startsWith(month));
  const totalRev = monthTrips.reduce((s, t) => s + (t.revenue || 0), 0);
  const totalCost = monthTrips.reduce((s, t) => s + (t.totalCost || 0), 0);
  const totalProfit = monthTrips.reduce((s, t) => s + (t.profit || 0), 0);
  const totalKm = monthTrips.reduce((s, t) => s + (t.km || 0), 0);
  const totalDays = monthTrips.reduce((s, t) => s + (t.days || 0), 0);
  const totalFuel = monthTrips.reduce((s, t) => s + (t.fuelCost || 0), 0);
  const totalTolls = monthTrips.reduce((s, t) => s + (t.tollsTotal || 0), 0);
  const totalDiurna = monthTrips.reduce((s, t) => s + (t.diurnaTotal || 0), 0);
  const totalFixed = monthTrips.reduce((s, t) => s + (t.fixed || 0), 0);
  const avgPpkm = totalKm > 0 ? totalProfit / totalKm : 0;
  const avgPpday = totalDays > 0 ? totalProfit / totalDays : 0;
  const marja = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0;
  const months = [...new Set(trips.map((t) => t.date?.slice(0, 7)))].sort().reverse();
  if (!months.includes(month)) months.unshift(month);

  if (!limits.hasReport && !planLoading) {
    return (
      <>
        <div className="min-h-screen bg-[#0d0d0d]">
          <AppNav />
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <p className="text-gray-400">Se incarca...</p>
          </div>
        </div>
        <PaywallModal feature="Raport lunar" requiredPlan="Pro" onClose={() => router.push("/dashboard")} />
      </>
    );
  }

  if (loading) return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center"><p className="text-gray-400">{tr.loading}</p></div>;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="report" />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">{tr.reportTitle}</h2>
          {limits.hasPdfExport && monthTrips.length > 0 && (
            <button onClick={handleDownloadPdf} disabled={downloading} className="bg-[#f5a623] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#e8951a] transition text-sm disabled:opacity-50">
              {downloading ? "Se genereaza..." : "Descarca PDF"}
            </button>
          )}
        </div>
        <p className="text-gray-400 mb-6">{tr.reportSub}</p>
        <select value={month} onChange={(e) => setMonth(e.target.value)} className="bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 text-white mb-8 focus:outline-none focus:border-[#f5a623]">
          {months.map((m) => (
            <option key={m} value={m}>{new Date(m + "-01").toLocaleDateString("ro-RO", { month: "long", year: "numeric" })}</option>
          ))}
        </select>
        {monthTrips.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>{tr.noTripsFound}</p>
            <Link href="/trip/new" className="text-[#f5a623] text-sm mt-2 inline-block">+ {tr.newTrip}</Link>
          </div>
        ) : (
          <div ref={reportRef}>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: tr.totalRevenue, value: totalRev.toFixed(0) + " €" },
                { label: tr.totalCosts, value: totalCost.toFixed(0) + " €" },
                { label: tr.totalProfit, value: totalProfit.toFixed(0) + " €", color: totalProfit >= 0 ? "text-green-400" : "text-red-400" },
                { label: tr.tripsCount, value: monthTrips.length },
              ].map((m, i) => (
                <div key={i} className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
                  <div className={`text-2xl font-bold font-mono ${m.color || ""}`}>{m.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.reportTitle}</h3>
                {[
                  { label: tr.totalKm, val: totalKm.toLocaleString() + " km" },
                  { label: tr.totalDays, val: totalDays + " zile" },
                  { label: tr.avgKm, val: avgPpkm.toFixed(3) + " €" },
                  { label: tr.avgDay, val: avgPpday.toFixed(2) + " €" },
                  { label: tr.margin, val: marja.toFixed(1) + "%", color: marja >= 0 ? "text-green-400" : "text-red-400" },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-[#2e2e2e] last:border-0">
                    <span className="text-gray-400 text-sm">{r.label}</span>
                    <span className={`font-mono text-sm font-medium ${r.color || "text-white"}`}>{r.val}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
                <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.fuelCosts}</h3>
                {[
                  { label: tr.fuelCosts, val: totalFuel.toFixed(0) + " €" },
                  { label: tr.tollsCosts, val: totalTolls.toFixed(0) + " €" },
                  { label: tr.allowanceCosts, val: totalDiurna.toFixed(0) + " €" },
                  { label: tr.fixedCostsAlloc, val: totalFixed.toFixed(0) + " €" },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-[#2e2e2e] last:border-0">
                    <span className="text-gray-400 text-sm">{r.label}</span>
                    <span className="font-mono text-sm font-medium">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.tripsCount}</h3>
              {monthTrips.map((t) => (
                <div key={t.id} className="flex justify-between items-center py-3 border-b border-[#2e2e2e] last:border-0">
                  <div>
                    <div className="text-sm font-medium">{t.from} → {t.to}</div>
                    <div className="text-xs text-gray-500 font-mono mt-1">{t.date} · {t.km} km</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-sm font-bold ${t.profit >= 0 ? "text-green-400" : "text-red-400"}`}>{t.profit?.toFixed(0)} €</span>
                    <span className={`text-xs font-mono px-2 py-1 rounded border ${t.verdict === "accept" ? "bg-green-900 text-green-400 border-green-700" : t.verdict === "negotiate" ? "bg-yellow-900 text-yellow-400 border-yellow-700" : "bg-red-900 text-red-400 border-red-700"}`}>{t.verdict === "accept" ? tr.accept : t.verdict === "negotiate" ? tr.negotiate : tr.reject}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}ppp