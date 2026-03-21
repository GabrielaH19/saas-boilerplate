"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useLang } from "../lib/LanguageContext";
import LangSwitcher from "../lib/LangSwitcher";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { tr } = useLang();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      const q = query(collection(db, "trips"), where("userId", "==", u.uid));
      const snap = await getDocs(q);
      setTrips(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const totalProfit = trips.reduce((s, t) => s + (t.profit || 0), 0);
  const avgPpkm = trips.length ? trips.reduce((s, t) => s + (t.ppkm || 0), 0) / trips.length : 0;
  const accepts = trips.filter((t) => t.verdict === "accept").length;
  const negotiates = trips.filter((t) => t.verdict === "negotiate").length;
  const rejects = trips.filter((t) => t.verdict === "reject").length;

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
          <Link href="/dashboard" className="text-white">{tr.dashboard}</Link>
          <Link href="/trip/new" className="hover:text-white">{tr.newTrip}</Link>
          <Link href="/history" className="hover:text-white">{tr.history}</Link>
          <Link href="/report" className="hover:text-white">{tr.report}</Link>
          <Link href="/truck" className="hover:text-white">{tr.truck}</Link><Link href="/pricing" className="hover:text-white">Prețuri</Link>
          <button onClick={handleLogout} className="hover:text-white">{tr.logout}</button>
        </div>
        <LangSwitcher />
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">{tr.dashboard}</h2>
        <p className="text-gray-400 mb-8">{tr.welcome}, {user?.email}</p>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: tr.totalTrips, value: trips.length },
            { label: tr.totalProfit, value: totalProfit.toFixed(0) + " €" },
            { label: tr.avgProfitKm, value: avgPpkm.toFixed(3) + " €" },
            { label: tr.acceptedTrips, value: accepts },
          ].map((m, i) => (
            <div key={i} className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <div className="text-2xl font-bold font-mono">{m.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.recentTrips}</h3>
            {trips.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>{tr.noTrips}</p>
                <Link href="/trip/new" className="text-[#f5a623] text-sm mt-2 inline-block">{tr.addFirstTrip}</Link>
              </div>
            ) : (
              trips.slice(0, 5).map((t) => (
                <div key={t.id} className="flex justify-between items-center py-3 border-b border-[#2e2e2e] last:border-0">
                  <div>
                    <div className="text-sm font-medium">{t.from} → {t.to}</div>
                    <div className="text-xs text-gray-500 font-mono">{t.date} · {t.km} km</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-mono font-bold ${t.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {t.profit?.toFixed(0)} €
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded mt-1 ${
                      t.verdict === "accept" ? "bg-green-900 text-green-400" :
                      t.verdict === "negotiate" ? "bg-yellow-900 text-yellow-400" :
                      "bg-red-900 text-red-400"
                    }`}>
                      {t.verdict === "accept" ? tr.accept : t.verdict === "negotiate" ? tr.negotiate : tr.reject}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.distribution}</h3>
            <div className="grid grid-cols-3 gap-4 text-center mt-4">
              <div>
                <div className="text-3xl font-bold font-mono text-green-400">{accepts}</div>
                <div className="text-xs text-gray-400 mt-2">{tr.accept}</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-mono text-yellow-400">{negotiates}</div>
                <div className="text-xs text-gray-400 mt-2">{tr.negotiate}</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-mono text-red-400">{rejects}</div>
                <div className="text-xs text-gray-400 mt-2">{tr.reject}</div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link href="/trip/new" className="bg-[#f5a623] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#e8951a] transition inline-block">
                + {tr.newTrip}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}