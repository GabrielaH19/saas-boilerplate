"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { useLang } from "../lib/LanguageContext";
import LangSwitcher from "../lib/LangSwitcher";

export default function HistoryPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { tr } = useLang();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      const q = query(collection(db, "trips"), where("userId", "==", u.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTrips(data);
      setFiltered(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const applyFilter = (f: string) => {
    setFilter(f);
    setFiltered(f === "all" ? trips : trips.filter((t) => t.verdict === f));
  };

  const deleteTrip = async (id: string) => {
    if (!confirm("Ștergi această cursă?")) return;
    await deleteDoc(doc(db, "trips", id));
    const updated = trips.filter((t) => t.id !== id);
    setTrips(updated);
    setFiltered(filter === "all" ? updated : updated.filter((t) => t.verdict === filter));
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">{tr.loading}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="bg-[#161616] border-b border-[#2e2e2e] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/dashboard" className="hover:text-white">{tr.dashboard}</Link>
          <Link href="/trip/new" className="hover:text-white">{tr.newTrip}</Link>
          <Link href="/history" className="text-white">{tr.history}</Link>
          <Link href="/report" className="hover:text-white">{tr.report}</Link>
          <Link href="/truck" className="hover:text-white">{tr.truck}</Link><Link href="/pricing" className="hover:text-white">Prețuri</Link>
          <button onClick={handleLogout} className="hover:text-white">{tr.logout}</button>
        </div>
        <LangSwitcher />
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">{tr.historyTitle}</h2>
        <p className="text-gray-400 mb-6">{trips.length} {tr.totalTrips} · {filtered.length} afișate</p>

        <div className="flex gap-2 mb-6">
          {["all", "accept", "negotiate", "reject"].map((f) => (
            <button key={f} onClick={() => applyFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition ${filter === f ? "bg-[#2a2a2a] text-[#f5a623] border border-[#3a3a3a]" : "text-gray-400 hover:text-white"}`}>
              {f === "all" ? tr.all : f === "accept" ? tr.accept : f === "negotiate" ? tr.negotiate : tr.reject}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>{tr.noTripsFound}</p>
            <Link href="/trip/new" className="text-[#f5a623] text-sm mt-2 inline-block">+ {tr.newTrip}</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => (
              <div key={t.id} className="bg-[#161616] border border-[#2e2e2e] rounded-xl px-6 py-4 flex items-center justify-between hover:border-[#3a3a3a] transition">
                <div>
                  <div className="font-medium">{t.from} → {t.to}</div>
                  <div className="text-xs text-gray-500 font-mono mt-1">{t.date} · {t.km} km · {t.days} {tr.days}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`font-mono font-bold ${t.profit >= 0 ? "text-green-400" : "text-red-400"}`}>{t.profit?.toFixed(0)} €</div>
                    <div className="text-xs text-gray-500 font-mono">{t.ppkm?.toFixed(3)} €/km</div>
                  </div>
                  <div className={`text-xs font-mono px-3 py-1 rounded border ${
                    t.verdict === "accept" ? "bg-green-900 text-green-400 border-green-700" :
                    t.verdict === "negotiate" ? "bg-yellow-900 text-yellow-400 border-yellow-700" :
                    "bg-red-900 text-red-400 border-red-700"}`}>
                    {t.verdict === "accept" ? tr.accept : t.verdict === "negotiate" ? tr.negotiate : tr.reject}
                  </div>
                  <button onClick={() => deleteTrip(t.id)} className="text-gray-600 hover:text-red-400 transition text-lg">×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}