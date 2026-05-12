"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import AppNav from "@/app/components/AppNav";
import ReferralBanner from "@/app/components/ReferralBanner";
import { useLang } from "../../lib/LanguageContext";
import { usePlan } from "../../lib/usePlan";
import PaywallModal from "@/app/components/PaywallModal";

interface Truck {
  id: string; name: string; plate: string; consumption: number; estimatedKmPerMonth: number;
  fixedCosts: { leasing: number; insurance: number; maintenance: number; salary: number; other: number; };
}
interface Client { id: string; name: string; paymentTermDays: number; }

export default function NewTripPage() {
  const router = useRouter();
  const { tr } = useLang();
  const { canAddTrip, limits, plan } = usePlan();
  const [showPaywall, setShowPaywall] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedTruckId, setSelectedTruckId] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tripDate, setTripDate] = useState(new Date().toISOString().slice(0, 10));
  const [revenue, setRevenue] = useState(1850);
  const [loadedKm, setLoadedKm] = useState(1200);
  const [emptyKm, setEmptyKm] = useState(200);
  const [fuelPrice, setFuelPrice] = useState(1.68);
  const [tolls, setTolls] = useState(120);
  const [days, setDays] = useState(3);
  const [waitHours, setWaitHours] = useState(3);
  const [dailyAllowance, setDailyAllowance] = useState(65);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUserId(u.uid);
      const [tSnap, cSnap] = await Promise.all([
        getDocs(query(collection(db, "trucks"), where("userId", "==", u.uid))),
        getDocs(query(collection(db, "clients"), where("userId", "==", u.uid))),
      ]);
      const truckList = tSnap.docs.map(d => ({ id: d.id, ...d.data() } as Truck));
      const clientList = cSnap.docs.map(d => ({ id: d.id, ...d.data() } as Client));
      setTrucks(truckList);
      setClients(clientList);
      if (truckList.length > 0) setSelectedTruckId(truckList[0].id);
      setLoading(false);
    });
    // Check paywall la incarcare
  if (!canAddTrip && !loading) {
    return (
      <>
        <div className="min-h-screen bg-[#0d0d0d]">
          <AppNav />
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <p className="text-gray-400">Se incarca...</p>
          </div>
        </div>
        <PaywallModal
          feature="Curse noi"
          requiredPlan="Pro"
          onClose={() => router.push("/dashboard")}
        />
      </>
    );
  }

  return () => unsub();
  }, []);

  const selectedTruck = trucks.find(t => t.id === selectedTruckId);
  const selectedClient = clients.find(c => c.id === selectedClientId);
  const totalKm = loadedKm + emptyKm;
  const consumption = selectedTruck?.consumption || 32;
  const fuelCost = Math.round((consumption / 100) * fuelPrice * totalKm);
  const emptyCost = Math.round((consumption / 100) * fuelPrice * emptyKm);
  const extraCost = Math.round(tolls + days * dailyAllowance);
  const waitCost = Math.round(waitHours * 17);
  const truckFixed = selectedTruck ? selectedTruck.fixedCosts.leasing + selectedTruck.fixedCosts.insurance + selectedTruck.fixedCosts.maintenance + selectedTruck.fixedCosts.salary + selectedTruck.fixedCosts.other : 0;
  const truckFixedPerKm = selectedTruck?.estimatedKmPerMonth ? truckFixed / selectedTruck.estimatedKmPerMonth : 0;
  const truckFixedCost = Math.round(truckFixedPerKm * loadedKm);
  const totalCost = fuelCost + extraCost + truckFixedCost + waitCost;
  const profit = revenue - totalCost;
  const revenuePerLoadedKm = loadedKm > 0 ? revenue / loadedKm : 0;
  const revenuePerTotalKm = totalKm > 0 ? revenue / totalKm : 0;
  const minBreakEvenPerKm = loadedKm > 0 ? totalCost / loadedKm : 0;
  const minRecommendedPerKm = minBreakEvenPerKm + 0.15;
  const verdict: "accept" | "negotiate" | "reject" =
    revenuePerLoadedKm >= minRecommendedPerKm ? "accept" :
    revenuePerLoadedKm >= minBreakEvenPerKm ? "negotiate" : "reject";

  const handleSave = async () => {
    if (!userId) return;
    if (!selectedTruckId) return alert("Selectează un camion.");
    if (!from || !to) return alert("Completează ruta.");
    setSaving(true);
    try {
      await addDoc(collection(db, "trips"), {
        userId, truckId: selectedTruckId, clientId: selectedClientId || null, from, to, tripDate,
        inputs: { loadedKm, emptyKm, fuelPrice, tolls, days, waitHours, dailyAllowance, revenue },
        snapshots: { truckName: selectedTruck?.name || "", clientName: selectedClient?.name || "", truckConsumption: consumption, truckFixedCostPerKm: parseFloat(truckFixedPerKm.toFixed(4)) },
        results: { fuelCost, emptyCost, extraCost, truckFixedCost, waitCost, totalCost, profit, revenuePerLoadedKm: parseFloat(revenuePerLoadedKm.toFixed(4)), revenuePerTotalKm: parseFloat(revenuePerTotalKm.toFixed(4)), minBreakEvenPerKm: parseFloat(minBreakEvenPerKm.toFixed(4)), minRecommendedPerKm: parseFloat(minRecommendedPerKm.toFixed(4)), verdict },
        status: "saved", createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setSaved(true);
    } catch (e) { console.error(e); alert("Eroare la salvare."); }
    setSaving(false);
  };

  const inp = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]";
  const lbl = "block text-xs text-gray-400 mb-1";

  if (loading) return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center"><p className="text-gray-400">{tr.loading}</p></div>;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="trip" />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">{tr.tripCalcTitle}</h2>
        <p className="text-gray-400 text-sm mb-8">{tr.tripCalcSub}</p>

        {trucks.length === 0 && (
          <div className="bg-yellow-900 border border-yellow-700 text-yellow-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {tr.noTruckWarning} <Link href="/truck" className="underline font-semibold">{tr.addTruck}</Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{tr.truckAndClient}</p>
              <div className="space-y-3">
                <div>
                  <label className={lbl}>{tr.truckLabel}</label>
                  <select className={inp} value={selectedTruckId} onChange={e => setSelectedTruckId(e.target.value)}>
                    {trucks.length === 0 && <option value="">{tr.noTruckOption}</option>}
                    {trucks.map(t => <option key={t.id} value={t.id}>{t.name} ({t.plate})</option>)}
                  </select>
                  {selectedTruck && <p className="text-xs text-gray-600 mt-1">Consum: {selectedTruck.consumption}l/100km · Cost fix: {truckFixedPerKm.toFixed(2)}€/km</p>}
                </div>
                <div>
                  <label className={lbl}>{tr.clientOptional}</label>
                  <select className={inp} value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
                    <option value="">{tr.noClient}</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{tr.routeAndDate}</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={lbl}>{tr.from}</label><input className={inp} value={from} onChange={e => setFrom(e.target.value)} placeholder="București" /></div>
                <div><label className={lbl}>{tr.to}</label><input className={inp} value={to} onChange={e => setTo(e.target.value)} placeholder="München" /></div>
              </div>
              <div><label className={lbl}>{tr.tripDate}</label><input type="date" className={inp} value={tripDate} onChange={e => setTripDate(e.target.value)} /></div>
            </div>

            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{tr.kmAndRevenue}</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={lbl}>{tr.loadedKm}</label><input type="number" className={inp} value={loadedKm} onChange={e => setLoadedKm(+e.target.value)} /></div>
                <div>
                  <label className={lbl}>{tr.emptyKm}</label>
                  <input type="number" className={inp} value={emptyKm} onChange={e => setEmptyKm(+e.target.value)} />
                  <p className="text-xs text-gray-600 mt-1">{tr.totalKmLabel}: {totalKm} km</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>{tr.revenue}</label><input type="number" className={inp} value={revenue} onChange={e => setRevenue(+e.target.value)} /></div>
                <div><label className={lbl}>{tr.fuelPriceLabel}</label><input type="number" step="0.01" className={inp} value={fuelPrice} onChange={e => setFuelPrice(+e.target.value)} /></div>
              </div>
            </div>

            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{tr.extraCosts}</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>{tr.tolls}</label><input type="number" className={inp} value={tolls} onChange={e => setTolls(+e.target.value)} /></div>
                <div>
                  <label className={lbl}>{tr.waitHours}</label>
                  <input type="number" className={inp} value={waitHours} onChange={e => setWaitHours(+e.target.value)} />
                  <p className="text-xs text-gray-600 mt-1">{tr.lostCost}: {waitCost}€</p>
                </div>
                <div><label className={lbl}>{tr.days}</label><input type="number" className={inp} value={days} onChange={e => setDays(+e.target.value)} /></div>
                <div><label className={lbl}>{tr.dailyAllowance}</label><input type="number" className={inp} value={dailyAllowance} onChange={e => setDailyAllowance(+e.target.value)} /></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`rounded-xl p-5 text-center border ${verdict === "accept" ? "bg-[#0a1f0a] border-green-800" : verdict === "negotiate" ? "bg-[#1f1a00] border-yellow-800" : "bg-[#1f0a0a] border-red-800"}`}>
              <div className={`text-2xl font-bold mb-1 ${verdict === "accept" ? "text-green-400" : verdict === "negotiate" ? "text-[#f5a623]" : "text-red-400"}`}>
                {verdict === "accept" ? tr.accept : verdict === "negotiate" ? tr.negotiate : tr.reject}
              </div>
              <div className="text-sm text-gray-500 mb-3">
                {verdict === "accept" ? tr.acceptSub : verdict === "negotiate" ? tr.negotiateSub : tr.rejectSub}
              </div>
            </div>

            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{tr.calcDetails}</p>
              {[
                { label: tr.fuelCost, val: `${fuelCost} €` },
                { label: `Cost km goi (${emptyKm} km)`, val: `-${emptyCost} €`, red: true },
                { label: "Taxe + diurnă", val: `${extraCost} €` },
                { label: "Cost fix camion", val: `${truckFixedCost} €` },
                { label: `${tr.waitHours} (${waitHours}h)`, val: `-${waitCost} €`, red: true },
                { label: tr.totalCost, val: `${totalCost} €` },
              ].map((r, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-[#1e1e1e] text-sm">
                  <span className="text-gray-400">{r.label}</span>
                  <span className={`${r.red ? "text-red-400" : "text-white"} font-medium`}>{r.val}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 text-sm mt-1">
                <span className="text-white font-semibold">{tr.netProfit}</span>
                <span className={`font-bold text-base ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>{profit >= 0 ? "+" : ""}{profit} €</span>
              </div>
            </div>

            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{tr.metrics}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "€/km (km încărcați)", val: revenuePerLoadedKm.toFixed(2) + " €/km", highlight: true },
                  { label: "€/km (km totali)", val: revenuePerTotalKm.toFixed(2) + " €/km" },
                  { label: "Break-even minim", val: minBreakEvenPerKm.toFixed(2) + " €/km" },
                  { label: "Recomandat minim", val: minRecommendedPerKm.toFixed(2) + " €/km" },
                ].map((m, i) => (
                  <div key={i} className="bg-[#1f1f1f] rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">{m.label}</div>
                    <div className={`font-semibold ${m.highlight ? "text-[#f5a623]" : "text-white"}`}>{m.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {saved ? (
              <div className="space-y-3">
                <div className="bg-green-900 border border-green-700 text-green-400 px-4 py-3 rounded-lg text-sm">{tr.savedTrip}</div>
              <a href={"/share?from=" + encodeURIComponent(from) + "&to=" + encodeURIComponent(to) + "&profit=" + Math.round(revenue - totalCost) + "&verdict=" + verdict + "&km=" + loadedKm} className="w-full bg-[#6366f1] text-white font-semibold py-3 rounded-lg hover:bg-[#4f46e5] transition block text-center text-sm">
                📤 Genereaza cardul de cursa
              </a>
                <Link href="/history" className="w-full border border-[#2e2e2e] text-white font-semibold py-3 rounded-lg hover:bg-[#161616] transition block text-center text-sm">{tr.viewHistory}</Link>
                <button onClick={() => { setSaved(false); setFrom(""); setTo(""); setRevenue(1850); setLoadedKm(1200); setEmptyKm(200); }} className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition text-sm">{tr.calcAnother}</button>
              </div>
            ) : (
              <button onClick={handleSave} disabled={saving} className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition disabled:opacity-50 text-sm">
                {saving ? tr.saving : tr.saveTrip}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 px-4 max-w-6xl mx-auto"><ReferralBanner /></div>
    </div>
  );
}