"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection, query, where, getDocs,
  addDoc, doc, getDoc, serverTimestamp
} from "firebase/firestore";
import Link from "next/link";

interface Truck {
  id: string;
  name: string;
  plate: string;
  consumption: number;
  estimatedKmPerMonth: number;
  fixedCosts: {
    leasing: number;
    insurance: number;
    maintenance: number;
    salary: number;
    other: number;
  };
}

interface Client {
  id: string;
  name: string;
  paymentTermDays: number;
}

export default function NewTripPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // inputs
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
    return () => unsub();
  }, []);

  const selectedTruck = trucks.find(t => t.id === selectedTruckId);
  const selectedClient = clients.find(c => c.id === selectedClientId);

  // calcule reale
  const totalKm = loadedKm + emptyKm;
  const consumption = selectedTruck?.consumption || 32;
  const fuelCost = Math.round((consumption / 100) * fuelPrice * totalKm);
  const emptyCost = Math.round((consumption / 100) * fuelPrice * emptyKm);
  const extraCost = Math.round(tolls + days * dailyAllowance);
  const waitCost = Math.round(waitHours * 17);

  // cost fix per km din camionul selectat
  const truckFixed = selectedTruck
    ? selectedTruck.fixedCosts.leasing + selectedTruck.fixedCosts.insurance +
      selectedTruck.fixedCosts.maintenance + selectedTruck.fixedCosts.salary +
      selectedTruck.fixedCosts.other
    : 0;
  const truckFixedPerKm = selectedTruck?.estimatedKmPerMonth
    ? truckFixed / selectedTruck.estimatedKmPerMonth
    : 0;
  const truckFixedCost = Math.round(truckFixedPerKm * loadedKm);

  const totalCost = fuelCost + extraCost + truckFixedCost + waitCost;
  const profit = revenue - totalCost;
  const revenuePerLoadedKm = loadedKm > 0 ? revenue / loadedKm : 0;
  const revenuePerTotalKm = totalKm > 0 ? revenue / totalKm : 0;
  const minBreakEvenPerKm = loadedKm > 0 ? totalCost / loadedKm : 0;
  const minRecommendedPerKm = minBreakEvenPerKm + 0.15;

  // verdict bazat pe €/km real vs prag
  const verdict: "accept" | "negotiate" | "reject" =
    revenuePerLoadedKm >= minRecommendedPerKm ? "accept" :
    revenuePerLoadedKm >= minBreakEvenPerKm ? "negotiate" : "reject";

  const handleSave = async () => {
    if (!userId) return;
    if (!selectedTruckId) return alert("Selectează un camion.");
    if (!from || !to) return alert("Completează ruta (de la / până la).");

    setSaving(true);
    try {
      await addDoc(collection(db, "trips"), {
        userId,
        truckId: selectedTruckId,
        clientId: selectedClientId || null,
        from,
        to,
        tripDate,

        inputs: {
          loadedKm,
          emptyKm,
          fuelPrice,
          tolls,
          days,
          waitHours,
          dailyAllowance,
          revenue,
        },

        snapshots: {
          truckName: selectedTruck?.name || "",
          clientName: selectedClient?.name || "",
          truckConsumption: consumption,
          truckFixedCostPerKm: parseFloat(truckFixedPerKm.toFixed(4)),
        },

        results: {
          fuelCost,
          emptyCost,
          extraCost,
          truckFixedCost,
          waitCost,
          totalCost,
          profit,
          revenuePerLoadedKm: parseFloat(revenuePerLoadedKm.toFixed(4)),
          revenuePerTotalKm: parseFloat(revenuePerTotalKm.toFixed(4)),
          minBreakEvenPerKm: parseFloat(minBreakEvenPerKm.toFixed(4)),
          minRecommendedPerKm: parseFloat(minRecommendedPerKm.toFixed(4)),
          verdict,
        },

        status: "saved",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSaved(true);
    } catch (e) {
      console.error(e);
      alert("Eroare la salvare. Încearcă din nou.");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const inp = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]";
  const lbl = "block text-xs text-gray-400 mb-1";

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
          <Link href="/trip/new" className="text-white">Cursă nouă</Link>
          <Link href="/history" className="hover:text-white">Istoric</Link>
          <Link href="/clients" className="hover:text-white">Clienți</Link>
          <Link href="/cashflow" className="hover:text-white">Cashflow</Link>
          <Link href="/truck" className="hover:text-white">Camioane</Link>
          <button onClick={handleLogout} className="hover:text-white">Ieși</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">Calculează o cursă</h2>
        <p className="text-gray-400 text-sm mb-8">Completează datele — verdictul apare instant pe baza costurilor reale ale camionului tău.</p>

        {trucks.length === 0 && (
          <div className="bg-yellow-900 border border-yellow-700 text-yellow-400 px-4 py-3 rounded-lg mb-6 text-sm">
            Nu ai adăugat niciun camion.{" "}
            <Link href="/truck" className="underline font-semibold">Adaugă un camion</Link>
            {" "}pentru calcule corecte.
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* STANGA — INPUTS */}
          <div className="space-y-4">

            {/* CAMION + CLIENT */}
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Camion și client</p>
              <div className="space-y-3">
                <div>
                  <label className={lbl}>Camion</label>
                  <select className={inp} value={selectedTruckId} onChange={e => setSelectedTruckId(e.target.value)}>
                    {trucks.length === 0 && <option value="">— Niciun camion —</option>}
                    {trucks.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.plate})</option>
                    ))}
                  </select>
                  {selectedTruck && (
                    <p className="text-xs text-gray-600 mt-1">
                      Consum: {selectedTruck.consumption}l/100km · Cost fix: {truckFixedPerKm.toFixed(2)}€/km
                    </p>
                  )}
                </div>
                <div>
                  <label className={lbl}>Client (opțional)</label>
                  <select className={inp} value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
                    <option value="">— Fără client —</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* RUTA */}
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Rută și dată</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={lbl}>De la</label>
                  <input className={inp} value={from} onChange={e => setFrom(e.target.value)} placeholder="București" />
                </div>
                <div>
                  <label className={lbl}>Până la</label>
                  <input className={inp} value={to} onChange={e => setTo(e.target.value)} placeholder="München" />
                </div>
              </div>
              <div>
                <label className={lbl}>Data cursei</label>
                <input type="date" className={inp} value={tripDate} onChange={e => setTripDate(e.target.value)} />
              </div>
            </div>

            {/* KM + VENIT */}
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Km și venit</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={lbl}>Km încărcați</label>
                  <input type="number" className={inp} value={loadedKm} onChange={e => setLoadedKm(+e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Km goi (retur)</label>
                  <input type="number" className={inp} value={emptyKm} onChange={e => setEmptyKm(+e.target.value)} />
                  <p className="text-xs text-gray-600 mt-1">Total: {totalKm} km</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Venit cursă (€)</label>
                  <input type="number" className={inp} value={revenue} onChange={e => setRevenue(+e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Preț motorină (€/l)</label>
                  <input type="number" step="0.01" className={inp} value={fuelPrice} onChange={e => setFuelPrice(+e.target.value)} />
                </div>
              </div>
            </div>

            {/* COSTURI SUPLIMENTARE */}
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Costuri suplimentare</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Taxe drum (€)</label>
                  <input type="number" className={inp} value={tolls} onChange={e => setTolls(+e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Ore așteptare rampă</label>
                  <input type="number" className={inp} value={waitHours} onChange={e => setWaitHours(+e.target.value)} />
                  <p className="text-xs text-gray-600 mt-1">Cost pierdut: {waitCost}€</p>
                </div>
                <div>
                  <label className={lbl}>Zile deplasare</label>
                  <input type="number" className={inp} value={days} onChange={e => setDays(+e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Diurnă / zi (€)</label>
                  <input type="number" className={inp} value={dailyAllowance} onChange={e => setDailyAllowance(+e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* DREAPTA — REZULTATE */}
          <div className="space-y-4">

            {/* VERDICT */}
            <div className={`rounded-xl p-5 text-center border ${
              verdict === "accept" ? "bg-[#0a1f0a] border-green-800" :
              verdict === "negotiate" ? "bg-[#1f1a00] border-yellow-800" :
              "bg-[#1f0a0a] border-red-800"
            }`}>
              <div className={`text-2xl font-bold mb-1 ${
                verdict === "accept" ? "text-green-400" :
                verdict === "negotiate" ? "text-[#f5a623]" :
                "text-red-400"
              }`}>
                {verdict === "accept" ? "ACCEPTĂ" :
                 verdict === "negotiate" ? "NEGOCIAZĂ" : "REFUZĂ"}
              </div>
              <div className="text-sm text-gray-500 mb-3">
                {verdict === "accept" ? "Cursă profitabilă — peste pragul tău" :
                 verdict === "negotiate" ? "Marjă periculoasă — încearcă un preț mai bun" :
                 "Sub costul real — pierzi bani dacă accepți"}
              </div>
              <div className={`text-xs font-semibold ${
                verdict === "accept" ? "text-green-400" :
                verdict === "negotiate" ? "text-[#f5a623]" :
                "text-red-400"
              }`}>
                {verdict === "accept"
                  ? "Fără calcul, ai fi acceptat orb. Acum știi că merită."
                  : verdict === "negotiate"
                  ? "Majoritatea acceptă curse ca asta și pierd bani. Tu nu trebuie."
                  : "Dacă accepți, plătești tu din buzunar ca să lucrezi."}
              </div>
            </div>

            {/* CALCULE DETALIATE */}
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Detalii calcul</p>
              {[
                { label: "Cost combustibil (total km)", val: `${fuelCost} €` },
                { label: `Cost km goi (${emptyKm} km)`, val: `-${emptyCost} €`, red: true },
                { label: "Taxe + diurnă", val: `${extraCost} €` },
                { label: "Cost fix camion alocat", val: `${truckFixedCost} €` },
                { label: `Timp pierdut rampă (${waitHours}h)`, val: `-${waitCost} €`, red: true },
                { label: "Cost total", val: `${totalCost} €` },
              ].map((r, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-[#1e1e1e] text-sm">
                  <span className="text-gray-400">{r.label}</span>
                  <span className={r.red ? "text-red-400 font-medium" : "text-white font-medium"}>{r.val}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 text-sm mt-1">
                <span className="text-white font-semibold">Profit net</span>
                <span className={`font-bold text-base ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {profit >= 0 ? "+" : ""}{profit} €
                </span>
              </div>
            </div>

            {/* METRICI */}
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Metrici</p>
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

            {/* SAVE */}
            {saved ? (
              <div className="space-y-3">
                <div className="bg-green-900 border border-green-700 text-green-400 px-4 py-3 rounded-lg text-sm">
                  ✓ Cursa a fost salvată!
                </div>
                <Link href="/history" className="w-full border border-[#2e2e2e] text-white font-semibold py-3 rounded-lg hover:bg-[#161616] transition block text-center text-sm">
                  Vezi istoricul
                </Link>
                <button
                  onClick={() => { setSaved(false); setFrom(""); setTo(""); setRevenue(1850); setLoadedKm(1200); setEmptyKm(200); }}
                  className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition text-sm"
                >
                  + Calculează altă cursă
                </button>
              </div>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition disabled:opacity-50 text-sm"
              >
                {saving ? "Se salvează..." : "Salvează cursa"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}