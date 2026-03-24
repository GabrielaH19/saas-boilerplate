"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";

interface Settings {
  thresholdPerKm: number;
  defaultFuelPrice: number;
  estimatedKmPerMonth: number;
  companyFixedCosts: {
    salaries: number;
    admin: number;
    rent: number;
    software: number;
    other: number;
  };
}

export default function SimulationsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [truckConsumption, setTruckConsumption] = useState(32);
  const [truckFixedPerMonth, setTruckFixedPerMonth] = useState(3900);
  const [truckKmPerMonth, setTruckKmPerMonth] = useState(9500);

  // Sim 1 — motorina
  const [simFuelPrice, setSimFuelPrice] = useState(1.68);

  // Sim 2 — zile fara cursa
  const [simIdleDays, setSimIdleDays] = useState(3);

  // Sim 3 — pret cursa
  const [simTripKm, setSimTripKm] = useState(1200);
  const [simTripPrice, setSimTripPrice] = useState(1850);
  const [simTripEmptyKm, setSimTripEmptyKm] = useState(200);

  const router = useRouter();

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

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const baseFuelPrice = settings?.defaultFuelPrice || 1.68;
  const threshold = settings?.thresholdPerKm || 1.30;
  const companyFixed = settings ? Object.values(settings.companyFixedCosts).reduce((a, b) => a + b, 0) : 0;
  const totalFixedPerMonth = truckFixedPerMonth + companyFixed;

  // SIM 1 — impact motorina
  const baseFuelCostPerKm = (truckConsumption / 100) * baseFuelPrice;
  const newFuelCostPerKm = (truckConsumption / 100) * simFuelPrice;
  const fuelDiff = newFuelCostPerKm - baseFuelCostPerKm;
  const fuelImpactMonthly = Math.round(fuelDiff * truckKmPerMonth);
  const newCostPerKm = (newFuelCostPerKm + totalFixedPerMonth / truckKmPerMonth).toFixed(2);
  const newMinThreshold = (parseFloat(newCostPerKm) + 0.15).toFixed(2);

  // SIM 2 — zile fara cursa
  const fixedPerDay = Math.round(totalFixedPerMonth / 30);
  const idleLoss = Math.round(fixedPerDay * simIdleDays);
  const avgRevenuePerDay = Math.round((truckKmPerMonth * threshold) / 25);
  const revenueLost = Math.round(avgRevenuePerDay * simIdleDays);
  const totalIdleImpact = idleLoss + revenueLost;

  // SIM 3 — profitabilitate cursa
  const totalKmTrip = simTripKm + simTripEmptyKm;
  const fuelCostTrip = Math.round((truckConsumption / 100) * baseFuelPrice * totalKmTrip);
  const fixedCostTrip = Math.round((totalFixedPerMonth / truckKmPerMonth) * simTripKm);
  const totalCostTrip = fuelCostTrip + fixedCostTrip;
  const profitTrip = simTripPrice - totalCostTrip;
  const pkmTrip = simTripKm > 0 ? (simTripPrice / simTripKm).toFixed(2) : "0";
  const breakEven = simTripKm > 0 ? (totalCostTrip / simTripKm).toFixed(2) : "0";
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

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">Se încarcă...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="bg-[#161616] border-b border-[#2e2e2e] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link href="/trip/new" className="hover:text-white">Cursă nouă</Link>
          <Link href="/history" className="hover:text-white">Istoric</Link>
          <Link href="/clients" className="hover:text-white">Clienți</Link>
          <Link href="/cashflow" className="hover:text-white">Cashflow</Link>
          <Link href="/truck" className="hover:text-white">Camioane</Link>
          <Link href="/simulations" className="text-white">Simulări</Link>
          <button onClick={handleLogout} className="hover:text-white">Ieși</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">Simulări</h2>
        <p className="text-gray-400 text-sm mb-8">
          Vezi ce se întâmplă cu profitul tău dacă se schimbă condițiile.
          {!settings && (
            <span className="text-[#f5a623]"> Configurează <Link href="/settings" className="underline">setările firmei</Link> pentru simulări precise.</span>
          )}
        </p>

        <div className="space-y-6">

          {/* SIM 1 — MOTORINA */}
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="font-semibold text-white mb-1">Dacă prețul motorinei se schimbă</h3>
            <p className="text-xs text-gray-500 mb-5">
              Preț actual: {baseFuelPrice} €/l · Consum mediu: {truckConsumption}l/100km
            </p>
            <div className="mb-5">
              <label className={lbl}>Noul preț motorină (€/l)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1.20"
                  max="2.50"
                  step="0.01"
                  value={simFuelPrice}
                  onChange={e => setSimFuelPrice(+e.target.value)}
                  className="flex-1 accent-[#f5a623]"
                />
                <input
                  type="number"
                  step="0.01"
                  className="w-24 bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]"
                  value={simFuelPrice}
                  onChange={e => setSimFuelPrice(+e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {metricCard("Cost nou per km", `${newCostPerKm} €/km`, "text-[#f5a623]")}
              {metricCard(
                "Impact lunar",
                `${fuelImpactMonthly >= 0 ? "+" : ""}${fuelImpactMonthly.toLocaleString()} €`,
                fuelImpactMonthly > 0 ? "text-red-400" : "text-green-400"
              )}
              {metricCard("Prag minim nou", `${newMinThreshold} €/km`)}
            </div>
            {fuelImpactMonthly > 500 && (
              <div className="mt-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg px-4 py-3 text-xs text-red-400">
                Creșterea prețului motorinei îți costă {fuelImpactMonthly.toLocaleString()}€/lună în plus. Renegociază contractele cu clienții.
              </div>
            )}
          </div>

          {/* SIM 2 — ZILE FARA CURSA */}
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="font-semibold text-white mb-1">Dacă stai fără cursă X zile</h3>
            <p className="text-xs text-gray-500 mb-5">
              Costurile fixe curg chiar și când camionul stă. Cost fix zilnic: {fixedPerDay.toLocaleString()} €/zi
            </p>
            <div className="mb-5">
              <label className={lbl}>Zile fără cursă</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={simIdleDays}
                  onChange={e => setSimIdleDays(+e.target.value)}
                  className="flex-1 accent-[#f5a623]"
                />
                <span className="text-[#f5a623] font-bold text-lg w-16 text-center">{simIdleDays} zile</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {metricCard("Costuri fixe curg", `-${idleLoss.toLocaleString()} €`, "text-red-400")}
              {metricCard("Venit pierdut", `-${revenueLost.toLocaleString()} €`, "text-red-400")}
              {metricCard("Impact total", `-${totalIdleImpact.toLocaleString()} €`, "text-red-400")}
            </div>
            {simIdleDays >= 7 && (
              <div className="mt-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg px-4 py-3 text-xs text-red-400">
                {simIdleDays} zile fără cursă te costă {totalIdleImpact.toLocaleString()}€. Asigură-te că ai curse planificate.
              </div>
            )}
          </div>

          {/* SIM 3 — CURSA */}
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="font-semibold text-white mb-1">Analizează o cursă înainte să o accepți</h3>
            <p className="text-xs text-gray-500 mb-5">
              Simulare rapidă fără să salvezi în istoric.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <label className={lbl}>Km încărcați</label>
                <input type="number" className={inp} value={simTripKm} onChange={e => setSimTripKm(+e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Km goi (retur)</label>
                <input type="number" className={inp} value={simTripEmptyKm} onChange={e => setSimTripEmptyKm(+e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Preț cursă (€)</label>
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
                tripVerdict === "negotiate" ? "text-[#f5a623]" :
                "text-red-400"
              }`}>
                {tripVerdict === "accept" ? "ACCEPTĂ" :
                 tripVerdict === "negotiate" ? "NEGOCIAZĂ" : "REFUZĂ"}
              </div>
              <div className={`text-2xl font-bold ${profitTrip >= 0 ? "text-green-400" : "text-red-400"}`}>
                {profitTrip >= 0 ? "+" : ""}{profitTrip.toLocaleString()} €
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {metricCard("€/km", `${pkmTrip} €/km`, "text-[#f5a623]")}
              {metricCard("Break-even", `${breakEven} €/km`)}
              {metricCard("Cost total", `${totalCostTrip.toLocaleString()} €`)}
              {metricCard("Combustibil", `${fuelCostTrip.toLocaleString()} €`)}
            </div>

            <div className="mt-4 text-center">
              <Link
                href={`/trip/new`}
                className="text-xs text-[#f5a623] hover:underline"
              >
                Salvează această cursă în istoric →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}