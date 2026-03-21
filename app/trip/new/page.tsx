"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { collection, addDoc, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useLang } from "../../lib/LanguageContext";
import LangSwitcher from "../../lib/LangSwitcher";
import { canAddTrip } from "../../lib/plans";

export default function NewTripPage() {
  const router = useRouter();
  const { tr } = useLang();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [revenue, setRevenue] = useState(2000);
  const [km, setKm] = useState(1200);
  const [liters, setLiters] = useState(350);
  const [fuelprice, setFuelprice] = useState(1.68);
  const [tolls, setTolls] = useState(120);
  const [parking, setParking] = useState(20);
  const [days, setDays] = useState(3);
  const [diurna, setDiurna] = useState(65);
  const [other, setOther] = useState(0);
  const [fixed, setFixed] = useState(150);

  const fuelCost = liters * fuelprice;
  const diurnaTotal = days * diurna;
  const tollsTotal = tolls + parking;
  const totalCost = fuelCost + diurnaTotal + tollsTotal + other + fixed;
  const profit = revenue - totalCost;
  const ppkm = km > 0 ? profit / km : 0;
  const ppday = days > 0 ? profit / days : 0;

  const verdict = ppkm >= 0.8 ? "accept" : ppkm >= 0.4 ? "negotiate" : "reject";
  const verdictLabel = verdict === "accept" ? tr.accept : verdict === "negotiate" ? tr.negotiate : tr.reject;
  const verdictColor = verdict === "accept" ? "text-green-400 bg-green-900 border-green-700" : verdict === "negotiate" ? "text-yellow-400 bg-yellow-900 border-yellow-700" : "text-red-400 bg-red-900 border-red-700";
  const verdictSub = verdict === "accept" ? tr.acceptSub : verdict === "negotiate" ? tr.negotiateSub : tr.rejectSub;

  const saveTrip = async () => {
    const user = auth.currentUser;
    if (!user) { router.push("/login"); return; }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();
    const plan = userData?.plan || "free";

    const thisMonth = new Date().toISOString().slice(0, 7);
    const q = query(
      collection(db, "trips"),
      where("userId", "==", user.uid),
      where("date", ">=", thisMonth + "-01"),
    );
    const snap = await getDocs(q);
    const tripsThisMonth = snap.size;

    if (!canAddTrip(plan, tripsThisMonth)) {
      alert("Ai atins limita de 5 curse gratuite pe lună. Upgradează la Pro pentru curse nelimitate.");
      router.push("/pricing");
      return;
    }

    setLoading(true);
    await addDoc(collection(db, "trips"), {
      userId: user.uid,
      from, to, revenue, km, liters, fuelprice, tolls, parking, days, diurna, other, fixed,
      fuelCost, diurnaTotal, tollsTotal, totalCost, profit, ppkm, ppday, verdict,
      date: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    });
    setLoading(false);
    setSaved(true);
  };

  const inputClass = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#f5a623]";
  const labelClass = "block text-xs text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="bg-[#161616] border-b border-[#2e2e2e] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/dashboard" className="hover:text-white">{tr.dashboard}</Link>
          <Link href="/trip/new" className="text-white">{tr.newTrip}</Link>
          <Link href="/history" className="hover:text-white">{tr.history}</Link>
          <Link href="/report" className="hover:text-white">{tr.report}</Link>
          <Link href="/truck" className="hover:text-white">{tr.truck}</Link>
          <Link href="/pricing" className="hover:text-white">Prețuri</Link>
        </div>
        <LangSwitcher />
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">{tr.newTripTitle}</h2>
        <p className="text-gray-400 mb-8">{tr.newTripSub}</p>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.from} / {tr.to}</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={labelClass}>{tr.from}</label><input className={inputClass} value={from} onChange={e=>setFrom(e.target.value)} placeholder="București" /></div>
                <div><label className={labelClass}>{tr.to}</label><input className={inputClass} value={to} onChange={e=>setTo(e.target.value)} placeholder="München" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>{tr.revenue}</label><input type="number" className={inputClass} value={revenue} onChange={e=>setRevenue(+e.target.value)} /></div>
                <div><label className={labelClass}>{tr.km}</label><input type="number" className={inputClass} value={km} onChange={e=>setKm(+e.target.value)} /></div>
              </div>
            </div>

            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.liters}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>{tr.liters}</label><input type="number" className={inputClass} value={liters} onChange={e=>setLiters(+e.target.value)} /></div>
                <div><label className={labelClass}>{tr.fuelPrice}</label><input type="number" step="0.01" className={inputClass} value={fuelprice} onChange={e=>setFuelprice(+e.target.value)} /></div>
              </div>
            </div>

            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.otherCosts}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>{tr.tolls}</label><input type="number" className={inputClass} value={tolls} onChange={e=>setTolls(+e.target.value)} /></div>
                <div><label className={labelClass}>{tr.parking}</label><input type="number" className={inputClass} value={parking} onChange={e=>setParking(+e.target.value)} /></div>
                <div><label className={labelClass}>{tr.days}</label><input type="number" className={inputClass} value={days} onChange={e=>setDays(+e.target.value)} /></div>
                <div><label className={labelClass}>{tr.dailyAllowance}</label><input type="number" className={inputClass} value={diurna} onChange={e=>setDiurna(+e.target.value)} /></div>
                <div><label className={labelClass}>{tr.otherCosts}</label><input type="number" className={inputClass} value={other} onChange={e=>setOther(+e.target.value)} /></div>
                <div><label className={labelClass}>{tr.fixedCosts}</label><input type="number" className={inputClass} value={fixed} onChange={e=>setFixed(+e.target.value)} /></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.result}</h3>
              {[
                { label: tr.fuelCost, val: fuelCost.toFixed(2) + " €" },
                { label: tr.totalAllowance, val: diurnaTotal.toFixed(2) + " €" },
                { label: tr.tollsParking, val: tollsTotal.toFixed(2) + " €" },
                { label: tr.fixedShare, val: fixed.toFixed(2) + " €" },
                { label: tr.totalCost, val: totalCost.toFixed(2) + " €" },
                { label: tr.netProfit, val: profit.toFixed(2) + " €", color: profit >= 0 ? "text-green-400" : "text-red-400" },
                { label: tr.profitKm, val: ppkm.toFixed(3) + " €/km" },
                { label: tr.profitDay, val: ppday.toFixed(2) + " €" },
              ].map((r, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-[#2e2e2e] last:border-0">
                  <span className="text-gray-400 text-sm">{r.label}</span>
                  <span className={`font-mono text-sm font-medium ${r.color || "text-white"}`}>{r.val}</span>
                </div>
              ))}
              <div className={`mt-4 p-4 rounded-xl border text-center ${verdictColor}`}>
                <div className="text-xl font-bold font-mono">{verdictLabel}</div>
                <div className="text-xs mt-1 opacity-80">{verdictSub}</div>
              </div>
            </div>

            {saved ? (
              <div className="space-y-3">
                <div className="bg-green-900 border border-green-700 text-green-400 px-4 py-3 rounded-lg">{tr.tripSaved}</div>
                <Link href={`/share?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&profit=${profit.toFixed(0)}&ppkm=${ppkm.toFixed(3)}&verdict=${verdict}&km=${km}`}
                  className="w-full bg-[#6366f1] text-white font-semibold py-3 rounded-lg hover:bg-[#4f46e5] transition block text-center">
                  📤 Generează cardul de cursă
                </Link>
                <Link href="/history"
                  className="w-full border border-[#334155] text-white font-semibold py-3 rounded-lg hover:bg-[#1e293b] transition block text-center">
                  Vezi istoricul
                </Link>
              </div>
            ) : (
              <button onClick={saveTrip} disabled={loading} className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition disabled:opacity-50">
                {loading ? tr.loading : tr.saveTrip}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}