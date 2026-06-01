"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import AppNav from "@/app/components/AppNav";
import { useLang } from "@/app/lib/LanguageContext";

const FOUNDER_PRICES: Record<string, number> = {
  basic: 18,
  pro: 29,
  premium: 47,
};

const NORMAL_PRICES: Record<string, number> = {
  basic: 30,
  pro: 49,
  premium: 79,
};

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [founderPricing, setFounderPricing] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { locale } = useLang();
  const it = locale === "it";

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
        alert(it ? "Errore nel pagamento. Riprova." : "Eroare la procesarea platii. Incearca din nou.");
      }
    } catch {
      alert(it ? "Errore nel pagamento. Riprova." : "Eroare la procesarea platii. Incearca din nou.");
    }
    setLoading(null);
  };

  const plans = [
    {
      id: "basic",
      name: "Basic",
      desc: it ? "Per le aziende che vogliono eliminare i viaggi non redditizi" : "Pentru firmele care vor sa elimine cursele neprofitabile",
      features: it
        ? ["Calcolatore viaggio con verdetto istantaneo", "Costo reale per km", "1 camion", "Storico viaggi"]
        : ["Calculator cursa cu verdict instant", "Cost real per km", "1 camion", "Istoric curse"],
      missing: it
        ? ["Rapporto per camion", "Rapporto per cliente", "Cashflow tracking"]
        : ["Raport per camion", "Raport per client", "Cashflow tracking"],
      highlight: false,
    },
    {
      id: "pro",
      name: "Pro",
      desc: it ? "Per le aziende che vogliono visibilita completa sulle finanze" : "Pentru firmele care vor vizibilitate completa asupra finantelor",
      features: it
        ? ["Tutto di Basic", "10 camion", "Storico 365 giorni", "Clienti + scoring", "Rapporto mensile email", "Simulazioni"]
        : ["Tot ce include Basic", "10 camioane", "Istoric 365 zile", "Clienti + scoring", "Raport lunar email", "Simulari"],
      missing: it
        ? ["Cashflow tracking", "Export PDF", "Supporto prioritario"]
        : ["Cashflow tracking", "Export PDF", "Suport prioritar"],
      highlight: true,
    },
    {
      id: "premium",
      name: "Premium",
      desc: it ? "Per le aziende che vogliono controllo finanziario completo" : "Pentru firmele care vor control financiar complet",
      features: it
        ? ["Tutto di Pro", "Camion illimitati", "Storico illimitato", "Cashflow tracking", "Export PDF rapporto", "Supporto prioritario"]
        : ["Tot ce include Pro", "Camioane nelimitate", "Istoric nelimitat", "Cashflow tracking", "Export PDF raport", "Suport prioritar"],
      missing: [],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="pricing" />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            {it ? "Scegli il piano giusto per la tua azienda" : "Alege planul potrivit firmei tale"}
          </h2>
          <p className="text-gray-400">
            {it ? "30 giorni gratuiti per qualsiasi piano. Senza carta di credito alla registrazione." : "30 de zile gratuit pentru orice plan. Fara card bancar la inregistrare."}
          </p>

          {founderPricing && (
            <div className="mt-4 inline-block bg-[#1a1200] border border-[#f5a623] text-[#f5a623] text-sm px-4 py-2 rounded-lg">
              🎉 {it ? "Sei tra i primi 100 — hai il prezzo fondatore a vita!" : "Esti printre primii 100 — beneficiezi de pretul fondator pe viata!"}
            </div>
          )}

          {currentPlan && currentPlan !== "free" && (
            <div className="mt-4 inline-block bg-green-900 border border-green-700 text-green-400 text-sm px-4 py-2 rounded-lg">
              {it ? "Piano attivo:" : "Plan activ:"} <strong className="capitalize">{currentPlan}</strong>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`rounded-xl p-8 relative ${plan.highlight ? "bg-[#16143a] border-2 border-[#4f46e5]" : "bg-[#161616] border border-[#2a2a2a]"}`}>
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f5a623] text-black text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                  {it ? "Il più scelto" : "Cel mai ales"}
                </div>
              )}

              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">{plan.name}</div>

              {founderPricing ? (
                <div className="mb-1">
                  <div className="text-gray-500 line-through text-xl">€{NORMAL_PRICES[plan.id]}/{it ? "mese" : "luna"}</div>
                  <div className="text-5xl font-semibold text-[#f5a623]">
                    <sup className="text-xl">€</sup>{FOUNDER_PRICES[plan.id]}<sub className="text-sm font-normal text-gray-500">/{it ? "mese" : "luna"}</sub>
                  </div>
                  <div className="text-xs text-[#f5a623] mt-1">{it ? "Prezzo fondatore a vita" : "Pret fondator pe viata"}</div>
                </div>
              ) : (
                <div className="text-5xl font-semibold text-white mb-1">
                  <sup className="text-xl">€</sup>{NORMAL_PRICES[plan.id]}<sub className="text-sm font-normal text-gray-500">/{it ? "mese" : "luna"}</sub>
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
                  {it ? "Piano attivo" : "Plan activ"}
                </button>
              ) : (
                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${plan.highlight ? "bg-[#4f46e5] text-white hover:bg-[#4338ca]" : "border border-[#333] text-white hover:bg-[#1e1e1e]"}`}
                >
                  {loading === plan.id ? (it ? "Elaborazione..." : "Se proceseaza...") : (it ? "Attiva piano" : "Activeaza planul")}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-[#161616] border border-[#2a2a2a] rounded-xl p-5 text-center text-sm text-gray-400">
          {it
            ? "Il pagamento viene elaborato in modo sicuro tramite Stripe. Puoi annullare in qualsiasi momento."
            : "Plata se proceseaza securizat prin Stripe. Poti anula oricand. Datele tale raman intacte indiferent de planul ales."}
        </div>
      </div>
    </div>
  );
}