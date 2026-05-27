"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

const FOUNDER_PRICES: Record<string, number> = {
  basic: 18,
  pro: 29,
  premium: 47,
};

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [founderPricing, setFounderPricing] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) {
        setCurrentPlan(snap.data().plan || "free");
        setCreatedAt(snap.data().createdAt || null);
        setFounderPricing(snap.data().founderPricing || false);
      }
    });
    return () => unsub();
  }, []);

  const handleCheckout = async (plan: string) => {
    if (!user) return;
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          userId: user.uid,
          email: user.email,
          createdAt,
          founderPricing,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Eroare la procesarea platii. Incearca din nou.");
      }
    } catch (e) {
      alert("Eroare la procesarea platii. Incearca din nou.");
    }
    setLoading(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 30,
      desc: "Pentru firmele care vor sa elimine cursele neprofitabile",
      features: ["Calculator cursa cu verdict instant", "Cost real per km", "1 camion", "Istoric curse"],
      missing: ["Raport per camion", "Raport per client", "Cashflow tracking"],
      highlight: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 49,
      desc: "Pentru firmele care vor vizibilitate completa asupra finantelor",
      features: ["Tot ce include Basic", "Camioane nelimitate", "Raport per camion", "Raport per client cu scor de risc", "Dashboard general firma", "Alerte automate costuri depasite"],
      missing: ["Cashflow tracking"],
      highlight: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: 79,
      desc: "Pentru firmele care vor control financiar complet",
      features: ["Tot ce include Pro", "Cashflow tracking", "Alerta blocaj de lichiditate", "Scor de risc detaliat per client", "Simulari financiare", "Recomandari automate", "Asistenta prioritara"],
      missing: [],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="bg-[#161616] border-b border-[#2e2e2e] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link href="/trip/new" className="hover:text-white">Cursa noua</Link>
          <Link href="/history" className="hover:text-white">Istoric</Link>
          <Link href="/clients" className="hover:text-white">Clienti</Link>
          <Link href="/cashflow" className="hover:text-white">Cashflow</Link>
          <Link href="/truck" className="hover:text-white">Camioane</Link>
          <Link href="/pricing" className="text-white">Preturi</Link>
          <button onClick={handleLogout} className="hover:text-white">Iesi</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Alege planul potrivit firmei tale</h2>
          <p className="text-gray-400">30 de zile gratuit pentru orice plan. Fara card bancar la inregistrare.</p>
          {founderPricing && (
            <div className="mt-4 inline-block bg-[#1a1200] border border-[#f5a623] text-[#f5a623] text-sm px-4 py-2 rounded-lg">
              🎉 Esti printre primii 100 — beneficiezi de <strong>pretul fondator pe viata!</strong>
            </div>
          )}
          {currentPlan && currentPlan !== "free" && (
            <div className="mt-4 inline-block bg-green-900 border border-green-700 text-green-400 text-sm px-4 py-2 rounded-lg">
              Plan activ: <strong className="capitalize">{currentPlan}</strong>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`rounded-xl p-8 relative ${plan.highlight ? "bg-[#16143a] border-2 border-[#4f46e5]" : "bg-[#161616] border border-[#2a2a2a]"}`}>
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f5a623] text-black text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                  Cel mai ales
                </div>
              )}
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">{plan.name}</div>
              {founderPricing ? (
                <div className="mb-1">
                  <div className="text-gray-500 line-through text-xl">€{plan.price}/luna</div>
                  <div className="text-5xl font-semibold text-[#f5a623]">
                    <sup className="text-xl">€</sup>{FOUNDER_PRICES[plan.id]}<sub className="text-sm font-normal text-gray-500">/luna</sub>
                  </div>
                  <div className="text-xs text-[#f5a623] mt-1">Pret fondator pe viata</div>
                </div>
              ) : (
                <div className="text-5xl font-semibold text-white mb-1">
                  <sup className="text-xl">€</sup>{plan.price}<sub className="text-sm font-normal text-gray-500">/luna</sub>
                </div>
              )}
              <div className="text-sm text-gray-400 mb-6 mt-2">{plan.desc}</div>
              <div className="border-t border-[#2a2a2a] pt-5 mb-7 space-y-2.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex gap-2 text-sm text-gray-300"><span className="text-green-400">✓</span>{f}</div>
                ))}
                {plan.missing.map((f) => (
                  <div key={f} className="flex gap-2 text-sm text-gray-600"><span>✗</span>{f}</div>
                ))}
              </div>
              {currentPlan === plan.id ? (
                <button disabled className="w-full py-3 rounded-lg text-sm font-semibold bg-[#2a2a2a] text-gray-500 cursor-not-allowed">
                  Plan activ
                </button>
              ) : (
                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${plan.highlight ? "bg-[#4f46e5] text-white hover:bg-[#4338ca]" : "border border-[#333] text-white hover:bg-[#1e1e1e]"}`}
                >
                  {loading === plan.id ? "Se proceseaza..." : "Activeaza planul"}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#161616] border border-[#2a2a2a] rounded-xl p-5 text-center text-sm text-gray-400">
          Plata se proceseaza securizat prin <strong className="text-white">Stripe</strong>. Poti anula oricand. Datele tale raman intacte indiferent de planul ales.
        </div>
      </div>
    </div>
  );
}