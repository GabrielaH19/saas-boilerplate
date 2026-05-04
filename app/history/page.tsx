"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection, query, where, getDocs,
  deleteDoc, doc, orderBy
} from "firebase/firestore";
import Link from "next/link";
import AppNav from "@/app/components/AppNav";

interface Trip {
  id: string;
  from: string;
  to: string;
  tripDate: string;
  snapshots: {
    truckName: string;
    clientName: string;
  };
  inputs: {
    loadedKm: number;
    emptyKm: number;
    revenue: number;
    days: number;
  };
  results: {
    profit: number;
    revenuePerLoadedKm: number;
    totalCost: number;
    verdict: "accept" | "negotiate" | "reject";
  };
}

export default function HistoryPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVerdict, setFilterVerdict] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterTruck, setFilterTruck] = useState("all");
  const [filterClient, setFilterClient] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      await loadTrips(u.uid);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loadTrips = async (uid: string) => {
    const q = query(
      collection(db, "trips"),
      where("userId", "==", uid),
    );
    const snap = await getDocs(q);
    const data = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Trip))
      .sort((a, b) => (b.tripDate || "").localeCompare(a.tripDate || ""));
    setTrips(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ștergi această cursă?")) return;
    await deleteDoc(doc(db, "trips", id));
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // filtre disponibile
  const months = ["all", ...Array.from(new Set(trips.map(t => t.tripDate?.slice(0, 7)).filter(Boolean))).sort().reverse()];
  const trucks = ["all", ...Array.from(new Set(trips.map(t => t.snapshots?.truckName).filter(Boolean)))];
  const clientNames = ["all", ...Array.from(new Set(trips.map(t => t.snapshots?.clientName).filter(Boolean)))];

  const filtered = trips.filter(t => {
    if (filterVerdict !== "all" && t.results?.verdict !== filterVerdict) return false;
    if (filterMonth !== "all" && !t.tripDate?.startsWith(filterMonth)) return false;
    if (filterTruck !== "all" && t.snapshots?.truckName !== filterTruck) return false;
    if (filterClient !== "all" && t.snapshots?.clientName !== filterClient) return false;
    return true;
  });

  const totalProfit = filtered.reduce((s, t) => s + (t.results?.profit || 0), 0);
  const totalRevenue = filtered.reduce((s, t) => s + (t.inputs?.revenue || 0), 0);

  const verdictStyle = (v: string) => {
    if (v === "accept") return "bg-green-900 text-green-400 border-green-800";
    if (v === "negotiate") return "bg-[#1f1500] text-[#f5a623] border-yellow-800";
    return "bg-red-900 text-red-400 border-red-800";
  };

  const verdictLabel = (v: string) => {
    if (v === "accept") return "ACCEPTĂ";
    if (v === "negotiate") return "NEGOCIAZĂ";
    return "REFUZĂ";
  };

  const sel = "bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#f5a623]";

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">Se încarcă...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="history" />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Istoric curse</h2>
            <p className="text-gray-400 text-sm mt-1">
              {filtered.length} curse afișate · Profit total:{" "}
              <span className={totalProfit >= 0 ? "text-green-400" : "text-red-400"}>
                {totalProfit >= 0 ? "+" : ""}{totalProfit.toLocaleString()} €
              </span>
              {" "}· Venit total:{" "}
              <span className="text-white">{totalRevenue.toLocaleString()} €</span>
            </p>
          </div>
          <Link
            href="/trip/new"
            className="bg-[#f5a623] text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#e8951a] transition"
          >
            + Cursă nouă
          </Link>
        </div>

        {/* FILTRE */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select className={sel} value={filterVerdict} onChange={e => setFilterVerdict(e.target.value)}>
            <option value="all">Toate verdictele</option>
            <option value="accept">ACCEPTĂ</option>
            <option value="negotiate">NEGOCIAZĂ</option>
            <option value="reject">REFUZĂ</option>
          </select>
          <select className={sel} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
            <option value="all">Toate lunile</option>
            {months.filter(m => m !== "all").map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select className={sel} value={filterTruck} onChange={e => setFilterTruck(e.target.value)}>
            <option value="all">Toate camioanele</option>
            {trucks.filter(t => t !== "all").map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select className={sel} value={filterClient} onChange={e => setFilterClient(e.target.value)}>
            <option value="all">Toți clienții</option>
            {clientNames.filter(c => c !== "all").map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {(filterVerdict !== "all" || filterMonth !== "all" || filterTruck !== "all" || filterClient !== "all") && (
            <button
              onClick={() => { setFilterVerdict("all"); setFilterMonth("all"); setFilterTruck("all"); setFilterClient("all"); }}
              className="text-xs text-gray-500 hover:text-white px-3 py-1.5 border border-[#2e2e2e] rounded-lg"
            >
              Resetează filtre
            </button>
          )}
        </div>

        {/* LISTA */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-2">Nicio cursă găsită.</p>
            <Link href="/trip/new" className="text-[#f5a623] text-sm">+ Adaugă prima cursă</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(t => (
              <div key={t.id} className="bg-[#161616] border border-[#2e2e2e] rounded-xl px-5 py-4 hover:border-[#3a3a3a] transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-white">
                        {t.from || "—"} → {t.to || "—"}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${verdictStyle(t.results?.verdict)}`}>
                        {verdictLabel(t.results?.verdict)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 flex gap-3 flex-wrap">
                      <span>{t.tripDate}</span>
                      {t.snapshots?.truckName && <span>· {t.snapshots.truckName}</span>}
                      {t.snapshots?.clientName && <span>· {t.snapshots.clientName}</span>}
                      <span>· {t.inputs?.loadedKm} km încărcați</span>
                      {t.inputs?.emptyKm > 0 && <span>+ {t.inputs.emptyKm} km goi</span>}
                      <span>· {t.inputs?.days} zile</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-0.5">Venit</div>
                      <div className="text-sm font-semibold text-white">{t.inputs?.revenue?.toLocaleString()} €</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-0.5">Profit</div>
                      <div className={`text-sm font-bold ${(t.results?.profit || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {(t.results?.profit || 0) >= 0 ? "+" : ""}{t.results?.profit?.toLocaleString()} €
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-0.5">€/km</div>
                      <div className="text-sm font-semibold text-[#f5a623]">
                        {t.results?.revenuePerLoadedKm?.toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-gray-600 hover:text-red-400 transition text-xl ml-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

