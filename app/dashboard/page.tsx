"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import AppNav from "@/app/components/AppNav";
import ReferralBanner from "@/app/components/ReferralBanner";
import SignupSourceModal from "@/app/components/SignupSourceModal";
import { useLang } from "@/app/lib/LanguageContext";

interface Trip {
  id: string;
  from: string;
  to: string;
  tripDate: string;
  snapshots: { truckName: string; clientName: string; };
  inputs: { loadedKm: number; emptyKm: number; revenue: number; days: number; };
  results: { profit: number; revenuePerLoadedKm: number; totalCost: number; verdict: string; };
}

interface Invoice {
  id: string;
  clientName?: string;
  clientId: string;
  amount: number;
  dueDate: string;
  status: string;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSignupSourceModal, setShowSignupSourceModal] = useState(false);
  const [signupSource, setSignupSource] = useState<string | null>(null);
  const router = useRouter();
  const { tr, locale } = useLang();

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      
      // Check if onboarding completed
      const userDoc = await getDoc(doc(db, "users", u.uid));
      if (userDoc.exists() && userDoc.data()?.onboardingCompleted === false) {
        router.push("/onboarding");
        return;
      }

      // Check signup source
      const userSignupSource = userDoc.exists() ? userDoc.data()?.signupSource : null;
      setSignupSource(userSignupSource || null);
      if (!userSignupSource) {
        setShowSignupSourceModal(true);
      }

      setUserId(u.uid);
      setUserName(u.email || "");
      const [tSnap, iSnap] = await Promise.all([
        getDocs(query(collection(db, "trips"), where("userId", "==", u.uid))),
        getDocs(query(collection(db, "invoices"), where("userId", "==", u.uid))),
      ]);
      const tripData = tSnap.docs
        .map(d => ({ id: d.id, ...d.data() } as Trip))
        .sort((a, b) => (b.tripDate || "").localeCompare(a.tripDate || ""));
      const invoiceData = iSnap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice));
      setTrips(tripData);
      setInvoices(invoiceData);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const monthTrips = trips.filter(t => t.tripDate?.startsWith(currentMonth));
  const monthProfit = monthTrips.reduce((s, t) => s + (t.results?.profit || 0), 0);
  const monthRevenue = monthTrips.reduce((s, t) => s + (t.inputs?.revenue || 0), 0);
  const monthKm = monthTrips.reduce((s, t) => s + (t.inputs?.loadedKm || 0), 0);
  const avgKm = monthKm > 0 && monthTrips.length > 0
    ? monthTrips.reduce((s, t) => s + (t.results?.revenuePerLoadedKm || 0), 0) / monthTrips.length
    : 0;

  const alerts: { type: "red" | "orange"; msg: string }[] = [];

  const truckProfits: Record<string, number> = {};
  monthTrips.forEach(t => {
    const name = t.snapshots?.truckName;
    if (name) truckProfits[name] = (truckProfits[name] || 0) + (t.results?.profit || 0);
  });
  Object.entries(truckProfits).forEach(([name, profit]) => {
    if (profit < 0) alerts.push({ type: "red", msg: locale === "it" ? `${name} è in perdita questo mese (${profit.toLocaleString()}€)` : `${name} este pe pierdere luna asta (${profit.toLocaleString()}€)` });
  });

  const today = new Date().toISOString().slice(0, 10);
  const overdueInvoices = invoices.filter(i => i.status !== "paid" && i.dueDate < today);
  overdueInvoices.forEach(i => {
    alerts.push({ type: "red", msg: locale === "it" ? `Fattura scaduta: ${i.amount.toLocaleString()}€ — scadenza ${i.dueDate}` : `Factură întârziată: ${i.amount.toLocaleString()}€ — scadentă pe ${i.dueDate}` });
  });

  const totalReceivable = invoices.filter(i => i.status !== "paid").reduce((s, i) => s + i.amount, 0);
  const in30days = new Date();
  in30days.setDate(in30days.getDate() + 30);
  const dueSoon = invoices.filter(i => i.status !== "paid" && i.dueDate <= in30days.toISOString().slice(0, 10));
  const dueSoonAmount = dueSoon.reduce((s, i) => s + i.amount, 0);
  if (totalReceivable > 0 && dueSoonAmount < monthRevenue * 0.3) {
    alerts.push({ type: "orange", msg: locale === "it" ? `Cashflow: solo ${dueSoonAmount.toLocaleString()}€ da incassare in 30 giorni` : `Cashflow: doar ${dueSoonAmount.toLocaleString()}€ de încasat în 30 zile` });
  }

  const truckEntries = Object.entries(truckProfits).sort((a, b) => b[1] - a[1]);
  const topTruck = truckEntries[0];
  const worstTruck = truckEntries[truckEntries.length - 1];

  const clientProfits: Record<string, number> = {};
  monthTrips.forEach(t => {
    const name = t.snapshots?.clientName;
    if (name) clientProfits[name] = (clientProfits[name] || 0) + (t.results?.profit || 0);
  });
  const clientEntries = Object.entries(clientProfits).sort((a, b) => b[1] - a[1]);
  const topClient = clientEntries[0];
  const worstClient = clientEntries[clientEntries.length - 1];

  const verdictStyle = (v: string) => {
    if (v === "accept") return "bg-green-900 text-green-400";
    if (v === "negotiate") return "bg-[#1f1500] text-[#f5a623]";
    return "bg-red-900 text-red-400";
  };
  const verdictLabel = (v: string) => {
    if (v === "accept") return tr.accept;
    if (v === "negotiate") return tr.negotiate;
    return tr.reject;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">{tr.loading}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="dashboard" />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">{userName} · {currentMonth}</p>
          </div>
          <Link href="/trip/new" className="bg-[#f5a623] text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#e8951a] transition">
            + {tr.newTrip}
          </Link>
        </div>

        {alerts.length > 0 && (
          <div className="space-y-2 mb-6">
            {alerts.map((a, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm border ${
                a.type === "red" ? "bg-red-900 bg-opacity-30 border-red-800 text-red-400" : "bg-yellow-900 bg-opacity-30 border-yellow-800 text-[#f5a623]"
              }`}>
                <span>{a.msg}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: locale === "it" ? "Profitto mese" : "Profit luna", value: `${monthProfit >= 0 ? "+" : ""}${monthProfit.toLocaleString()} €`, color: monthProfit >= 0 ? "text-green-400" : "text-red-400" },
            { label: locale === "it" ? "Viaggi mese" : "Curse luna", value: monthTrips.length, color: "text-white" },
            { label: locale === "it" ? "€/km medio" : "€/km mediu", value: avgKm.toFixed(2) + " €/km", color: "text-[#f5a623]" },
            { label: locale === "it" ? "Da incassare" : "De încasat", value: `${totalReceivable.toLocaleString()} €`, color: totalReceivable > 0 ? "text-[#f5a623]" : "text-white" },
          ].map((m, i) => (
            <div key={i} className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{m.label}</div>
              <div className={`text-2xl font-bold font-mono ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{locale === "it" ? "Prestazioni camion" : "Performanță camioane"}</h3>
            {truckEntries.length === 0 ? (
              <p className="text-gray-600 text-sm">{locale === "it" ? "Nessun viaggio salvato questo mese." : "Nicio cursă salvată luna asta."}</p>
            ) : (
              <div className="space-y-2">
                {truckEntries.map(([name, profit]) => (
                  <div key={name} className="flex justify-between items-center py-2 border-b border-[#1e1e1e] last:border-0">
                    <span className="text-sm text-gray-300">{name}</span>
                    <span className={`text-sm font-bold ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {profit >= 0 ? "+" : ""}{profit.toLocaleString()} €
                    </span>
                  </div>
                ))}
              </div>
            )}
            {topTruck && worstTruck && topTruck[0] !== worstTruck[0] && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-green-900 bg-opacity-20 border border-green-900 rounded-lg p-2 text-xs">
                  <div className="text-gray-500 mb-0.5">{locale === "it" ? "Il migliore" : "Cel mai bun"}</div>
                  <div className="text-green-400 font-semibold">{topTruck[0]}</div>
                </div>
                <div className="bg-red-900 bg-opacity-20 border border-red-900 rounded-lg p-2 text-xs">
                  <div className="text-gray-500 mb-0.5">{locale === "it" ? "Il peggiore" : "Cel mai slab"}</div>
                  <div className="text-red-400 font-semibold">{worstTruck[0]}</div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{locale === "it" ? "Prestazioni clienti" : "Performanță clienți"}</h3>
            {clientEntries.length === 0 ? (
              <p className="text-gray-600 text-sm">{locale === "it" ? "Nessun viaggio con cliente questo mese." : "Nicio cursă cu client luna asta."}</p>
            ) : (
              <div className="space-y-2">
                {clientEntries.map(([name, profit]) => (
                  <div key={name} className="flex justify-between items-center py-2 border-b border-[#1e1e1e] last:border-0">
                    <span className="text-sm text-gray-300">{name}</span>
                    <span className={`text-sm font-bold ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {profit >= 0 ? "+" : ""}{profit.toLocaleString()} €
                    </span>
                  </div>
                ))}
              </div>
            )}
            {topClient && worstClient && topClient[0] !== worstClient[0] && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-green-900 bg-opacity-20 border border-green-900 rounded-lg p-2 text-xs">
                  <div className="text-gray-500 mb-0.5">{locale === "it" ? "Il migliore" : "Cel mai bun"}</div>
                  <div className="text-green-400 font-semibold">{topClient[0]}</div>
                </div>
                <div className="bg-red-900 bg-opacity-20 border border-red-900 rounded-lg p-2 text-xs">
                  <div className="text-gray-500 mb-0.5">{locale === "it" ? "Il peggiore" : "Cel mai slab"}</div>
                  <div className="text-red-400 font-semibold">{worstClient[0]}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider">{locale === "it" ? "Viaggi recenti" : "Curse recente"}</h3>
            <Link href="/history" className="text-xs text-[#f5a623] hover:underline">{locale === "it" ? "Vedi tutti →" : "Vezi toate →"}</Link>
          </div>
          {trips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-3">{tr.noTrips}</p>
              <Link href="/trip/new" className="bg-[#f5a623] text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#e8951a] transition">
                + {tr.addFirstTrip}
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {trips.slice(0, 6).map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-[#1e1e1e] last:border-0">
                  <div>
                    <div className="text-sm font-medium text-white">{t.from || "—"} → {t.to || "—"}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {t.tripDate}
                      {t.snapshots?.truckName && ` · ${t.snapshots.truckName}`}
                      {t.snapshots?.clientName && ` · ${t.snapshots.clientName}`}
                      {` · ${t.inputs?.loadedKm} km`}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-sm font-bold ${(t.results?.profit || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {(t.results?.profit || 0) >= 0 ? "+" : ""}{t.results?.profit?.toLocaleString()} €
                      </div>
                      <div className="text-xs text-gray-500">{t.results?.revenuePerLoadedKm?.toFixed(2)} €/km</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${verdictStyle(t.results?.verdict)}`}>
                      {verdictLabel(t.results?.verdict)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Signup Source Modal */}
      {showSignupSourceModal && (
        <SignupSourceModal
          userId={userId}
          onClose={() => setShowSignupSourceModal(false)}
        />
      )}
    </div>
  );
}
