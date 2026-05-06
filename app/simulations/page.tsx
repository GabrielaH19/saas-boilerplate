"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import AppNav from "@/app/components/AppNav";
import { useLang } from "../lib/LanguageContext";

interface Settings {
  thresholdPerKm: number;
  defaultFuelPrice: number;
  estimatedKmPerMonth: number;
  companyFixedCosts: { salaries: number; admin: number; rent: number; software: number; other: number; };
}

export default function SimulationsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [truckConsumption, setTruckConsumption] = useState(32);
  const [truckFixedPerMonth, setTruckFixedPerMonth] = useState(3900);
  const [truckKmPerMonth, setTruckKmPerMonth] = useState(9500);
  const [simFuelPrice, setSimFuelPrice] = useState(1.68);
  const [simIdleDays, setSimIdleDays] = useState(3);
  const [simTripKm, setSimTripKm] = useState(1200);
  const [simTripPrice, setSimTripPrice] = useState(1850);
  const [simTripEmptyKm, setSimTripEmptyKm] = useState(200);
  const router = useRouter();
  const { tr } = useLang();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      const [settingsSnap, trucksSnap] = await Promise.all([
        getDoc(doc(db, "settings", u.uid)),
        getDocs(query(collection(db, "trucks"), where("userId", "==", u.uid))),
      ]);
      if (settingsSnap.exists()) {
        const s = settingsSnap.data() as Settings;
        setSettings(s);
        setSimFuelPrice(s.defaultFuelPrice || 1.68);
      }
      if (!trucksSnap.empty) {
        const trucks = trucksSnap.docs.map(d => d.data());
        const avgConsumption = trucks.reduce((s: number, t: any) => s + (t.consumption || 32), 0) / trucks.length;
        const totalFixed = trucks.reduce((s: number, t: any) => {
          const fc = t.fixedCosts || {};
          return s + (fc.leasing || 0) + (fc.insurance || 0) + (fc.maintenance || 0) + (fc.salary || 0) + (fc.other || 0);
        }, 0);
        const totalKm = trucks.reduce((s: number, t: any) => s + (t.estimatedKmPerMonth || 0), 0);
        setTruckConsumption(Math.round(avgConsumption));
        setTruckFixedPerMonth(totalFixed);
        if (totalKm > 0) setTruckKmPerMonth(totalKm);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const baseFuelPrice = settings?.defaultFuelPrice || 1.68;
  const threshold = settings?.thresholdPerKm || 1.30;
  const companyFixed = settings ? Object.values(settings.companyFixedCosts).reduce((a, b) => a + b, 0) : 0;
  const totalFixedPerMonth = truckFixedPerMonth + companyFixed;

  const baseFuelCostPerKm = (truckConsumption / 100) * baseFuelPrice;
  const newFuelCostPerKm = (truckConsumption / 100) * simFuelPrice;
  const fuelDiff = newFuelCostPerKm - baseFuelCostPerKm;
  const fuelImpactMonthly = Math.round(fuelDiff * truckKmPerMonth);
  const newCostPerKm = (newFuelCostPerKm + totalFixedPerMonth / truckKmPerMonth).toFixed(2);
  const newMinThreshold = (parseFloat(newCostPerKm) + 0.15).toFixed(2);

  const fixedPerDay = Math.round(totalFixedPerMonth / 30);
  const idleLoss = Math.round(fixedPerDay * simIdleDays);
  const avgRevenuePerDay = Math.round((truckKmPerMonth * threshold) / 25);
  const revenueLost = Math.round(avgRevenuePerDay * simIdleDays);
  const totalIdleImpact = idleLoss + revenueLost;

  const totalKmTrip = simTripKm + simTripEmptyKm;
  const fuelCostTrip = Math.round((truckConsumption / 100) * baseFuelPrice * totalKmTrip);
  const fixedCostTrip = Math.round((totalFixedPerMonth / truckKmPerMonth) * simTripKm);
  const totalCostTrip = fuelCostTrip + fixedCostTrip;
  const profitTrip = simTripPrice - totalCostTrip;
  const pkmTrip = simTripKm > 0 ? (simTripPrice / simTripKm).toFixed(2) : "0";
  const breakEvenVal = simTripKm > 0 ? (totalCostTrip / simTripKm).toFixed(2) : "0";
  const tripVerdict: "accept" | "negotiate" | "reject" =
    parseFloat(pkmTrip) >= threshold + 0.15 ? "accept" :
    parseFloat(pkmTrip) >= threshold ? "negotiate" : "reject";

  const inp = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]";
  const lbl = "block text-xs text-gray-400 mb-1";

  const metricCard = (label: string, value: string, color = "text-white") => (
    <div className="bg-[#1f1f1f] rounded-lg p-4">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  );

  if (loading) return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center"><p className="text-gray-400">{tr.loading}</p></div>;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="simulations" />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">{tr.simulationsTitle}</h2>
        <p className="text-gray-400 text-sm mb-8">
          {tr.simulationsSub}
          {!settings && (
            <span className="text-[#f5a623]"> <Link href="/settings" className="underline">{tr.settingsTitle}</Link></span>
          )}
        </p>

        <div className="space-y-6">

          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="font-semibold text-white mb-1">{tr.simFuelTitle}</h3>
            <p className="text-xs text-gray-500 mb-5">{tr.simFuelSub}: {baseFuelPrice} €/l · {tr.consumption}: {truckConsumption}l/100km</p>
            <div className="mb-5">
              <label className={lbl}>{tr.newFuelPrice}</label>
              <div className="flex items-center gap-4">
                <input type="range" min="1.20" max="2.50" step="0.01" value={simFuelPrice} onChange={e => setSimFuelPrice(+e.target.value)} className="flex-1 accent-[#f5a623]" />
                <input type="number" step="0.01" className="w-24 bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]" value={simFuelPrice} onChange={e => setSimFuelPrice(+e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {metricCard(tr.newCostPerKm, `${newCostPerKm} €/km`, "text-[#f5a623]")}
              {metricCard(tr.monthlyImpact, `${fuelImpactMonthly >= 0 ? "+" : ""}${fuelImpactMonthly.toLocaleString()} €`, fuelImpactMonthly > 0 ? "text-red-400" : "text-green-400")}
              {metricCard(tr.newMinThreshold, `${newMinThreshold} €/km`)}
            </div>
            {fuelImpactMonthly > 500 && (
              <div className="mt-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg px-4 py-3 text-xs text-red-400">
                {tr.simFuelAlert} {fuelImpactMonthly.toLocaleString()} {tr.simFuelAlertEnd}
              </div>
            )}
          </div>

          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="font-semibold text-white mb-1">{tr.simIdleTitle}</h3>
            <p className="text-xs text-gray-500 mb-5">{tr.simIdleSub}: {fixedPerDay.toLocaleString()} €/zi</p>
            <div className="mb-5">
              <label className={lbl}>{tr.idleDays}</label>
              <div className="flex items-center gap-4">
                <input type="range" min="1" max="30" step="1" value={simIdleDays} onChange={e => setSimIdleDays(+e.target.value)} className="flex-1 accent-[#f5a623]" />
                <span className="text-[#f5a623] font-bold text-lg w-16 text-center">{simIdleDays} zile</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {metricCard(tr.fixedRunning, `-${idleLoss.toLocaleString()} €`, "text-red-400")}
              {metricCard(tr.revenueLost, `-${revenueLost.toLocaleString()} €`, "text-red-400")}
              {metricCard(tr.totalImpact, `-${totalIdleImpact.toLocaleString()} €`, "text-red-400")}
            </div>
            {simIdleDays >= 7 && (
              <div className="mt-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg px-4 py-3 text-xs text-red-400">
                {simIdleDays} {tr.idleDays.toLowerCase()} — {totalIdleImpact.toLocaleString()}€ {tr.totalImpact.toLowerCase()}.
              </div>
            )}
          </div>

          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="font-semibold text-white mb-1">{tr.simTripTitle}</h3>
            <p className="text-xs text-gray-500 mb-5">{tr.simTripSub}</p>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <label className={lbl}>{tr.loadedKm}</label>
                <input type="number" className={inp} value={simTripKm} onChange={e => setSimTripKm(+e.target.value)} />
              </div>
              <div>
                <label className={lbl}>{tr.emptyKm}</label>
                <input type="number" className={inp} value={simTripEmptyKm} onChange={e => setSimTripEmptyKm(+e.target.value)} />
              </div>
              <div>
                <label className={lbl}>{tr.revenue}</label>
                <input type="number" className={inp} value={simTripPrice} onChange={e => setSimTripPrice(+e.target.value)} />
              </div>
            </div>

            <div className={`rounded-xl p-4 text-center mb-4 border ${
              tripVerdict === "accept" ? "bg-[#0a1f0a] border-green-800" :
              tripVerdict === "negotiate" ? "bg-[#1f1a00] border-yellow-800" :
              "bg-[#1f0a0a] border-red-800"
            }`}>
              <div className={`text-xl font-bold mb-1 ${
                tripVerdict === "accept" ? "text-green-400" :
                tripVerdict === "negotiate" ? "text-[#f5a623]" : "text-red-400"
              }`}>
                {tripVerdict === "accept" ? tr.accept : tripVerdict === "negotiate" ? tr.negotiate : tr.reject}
              </div>
              <div className={`text-2xl font-bold ${profitTrip >= 0 ? "text-green-400" : "text-red-400"}`}>
                {profitTrip >= 0 ? "+" : ""}{profitTrip.toLocaleString()} €
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {metricCard("€/km", `${pkmTrip} €/km`, "text-[#f5a623]")}
              {metricCard(tr.breakEven, `${breakEvenVal} €/km`)}
              {metricCard(tr.totalCost, `${totalCostTrip.toLocaleString()} €`)}
              {metricCard(tr.fuel, `${fuelCostTrip.toLocaleString()} €`)}
            </div>

            <div className="mt-4 text-center">
              <Link href="/trip/new" className="text-xs text-[#f5a623] hover:underline">{tr.saveToHistory}</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
