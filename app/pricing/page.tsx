"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AppNav from "@/app/components/AppNav";
import { useLang } from "@/app/lib/LanguageContext";

const FOUNDER_PRICES: Record<string, number> = { basic: 18, pro: 29, premium: 47 };
const NORMAL_PRICES: Record<string, number> = { basic: 30, pro: 49, premium: 79 };
const SAVINGS_YEAR: Record<string, number> = { basic: 144, pro: 240, premium: 384 };
const DISCOUNT: Record<string, number> = { basic: 40, pro: 41, premium: 41 };

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [founderPricing, setFounderPricing] = useState(false);
  const [founderCount, setFounderCount] = useState<number | null>(null);
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

    // Fetch founder count
    fetch("/api/founder-count")
      .then(r => r.json())
      .then(d => setFounderCount(d.count ?? null))
      .catch(() => {});

    return () => unsub();
  }, []);

  const handleCheckout = async (plan: string) => {
    if (!user) return;
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId: user.uid, email: user.email, createdAt, founderPricing }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(it ? "Errore nel pagamento. Riprova." : "Eroare la procesarea platii. Incearca din nou.");
    } catch {
      alert(it ? "Errore nel pagamento. Riprova." : "Eroare la procesarea platii. Incearca din nou.");
    }
    setLoading(null);
  };

  const plans = [
    {
      id: "basic",
      name: "Basic",
      desc: it ? "Per le aziende che vogliono eliminare i viaggi non redditizi" : "Pentru firmele care vor să elimine cursele neprofitabile",
      features: it
        ? ["Calcolatore viaggio con verdetto istantaneo", "Costo reale per km", "1 camion", "Storico 60 giorni"]
        : ["Calculator cursă cu verdict instant", "Cost real per km", "1 camion", "Istoric 60 zile"],
      missing: it
        ? ["Clienti + scoring", "Rapporto mensile email", "Cashflow", "Simulazioni", "Export PDF", "Supporto prioritario"]
        : ["Clienți + scoring", "Raport lunar email", "Cashflow", "Simulări", "Export PDF", "Suport prioritar"],
      highlight: false,
    },
    {
      id: "pro",
      name: "Pro",
      desc: it ? "Per le aziende che vogliono visibilità completa sulle finanze" : "Pentru firmele care vor vizibilitate completă asupra finanțelor",
      features: it
        ? ["Tot ce include Basic", "10 camioane", "Storico 365 giorni", "Clienti + scoring", "Rapporto mensile email", "Simulazioni"]
        : ["Tot ce include Basic", "10 camioane", "Istoric 365 zile", "Clienți + scoring", "Raport lunar email", "Simulări"],
      missing: it
        ? ["Cashflow", "Export PDF", "Supporto prioritario"]
        : ["Cashflow", "Export PDF", "Suport prioritar"],
      highlight: true,
    },
    {
      id: "premium",
      name: "Premium",
      desc: it ? "Per le aziende che vogliono controllo finanziario completo" : "Pentru firmele care vor control financiar complet",
      features: it
        ? ["Tutto di Pro", "Camion illimitati", "Storico illimitato", "Cashflow", "Export PDF rapporto", "Supporto prioritario"]
        : ["Tot ce include Pro", "Camioane nelimitate", "Istoric nelimitat", "Cashflow", "Export PDF raport", "Suport prioritar"],
      missing: [],
      highlight: false,
    },
  ];

  const remaining = founderCount !== null ? 100 - founderCount : null;
  const progressDots = 12;
  const filledDots = founderCount !== null ? Math.max(1, Math.round((founderCount / 100) * progressDots)) : 2;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="pricing" />

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
            {it ? "PREZZI" : "PREȚURI"}
          </p>
          <h2 className="text-3xl font-bold mb-6">
            {it ? "Chiaro e prevedibile." : "Clar și previzibil."}
          </h2>

          {/* Founder badge */}
          <div className="inline-flex items-center gap-2 border border-[#f5a623] rounded-full px-5 py-2 text-sm text-[#f5a623] mb-4">
            🔥 {it ? "Primi 100 abbonati · Prezzo ridotto a vita" : "Primii 100 abonați · Preț redus pe viață"}
          </div>

          {/* Progress dots */}
          {remaining !== null && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex gap-1">
                {Array.from({ length: progressDots }).map((_, i) => (
  <div
    key={i}
    style={{
      backgroundColor: i < filledDots ? "#f5a623" : "#2a2a2a",
      width: "20px",
      height: "8px",
      borderRadius: "9999px"
    }}
  />
))}
              </div>
              <span className="text-sm text-gray-400 ml-2">
                {remaining} {it ? "posti rimasti su 100" : "locuri rămase din 100"}
              </span>
            </div>
          )}

          <p className="text-gray-400 text-sm">
            {it ? "30 giorni gratuiti per qualsiasi piano. Senza carta di credito alla registrazione." : "30 de zile gratuit pentru orice plan. Fără card bancar la înregistrare."}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {it
              ? "Dopo il periodo di prova, scegli il piano adatto alla tua azienda e attivalo direttamente dall'applicazione, dalla sezione Prezzi."
              : "După perioada de test, alegi planul potrivit firmei tale și îl activezi direct din aplicație, din secțiunea Prețuri."}
          </p>

          {currentPlan && currentPlan !== "free" && (
            <div className="mt-4 inline-block bg-green-900 border border-green-700 text-green-400 text-sm px-4 py-2 rounded-lg">
              {it ? "Piano attivo:" : "Plan activ:"} <strong className="capitalize">{currentPlan}</strong>
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const founderPrice = FOUNDER_PRICES[plan.id];
            const normalPrice = NORMAL_PRICES[plan.id];
            const savings = SAVINGS_YEAR[plan.id];
            const discount = DISCOUNT[plan.id];

            return (
              <div key={plan.id} className={`rounded-xl relative flex flex-col ${plan.highlight ? "bg-[#16143a] border-2 border-[#4f46e5]" : "bg-[#161616] border border-[#2a2a2a]"}`}>

                {/* Banner fondator rosu */}
                <div className="flex items-center justify-between bg-red-600 rounded-t-xl px-4 py-2">
                  <span className="text-xs font-semibold text-white">
                    🔥 {it ? "Prezzo fondatore" : "Preț fondator"}
                  </span>
                  <span className="text-xs font-bold text-white">-{savings}€/an</span>
                </div>

                <div className="p-7 flex flex-col flex-1">
                  {plan.highlight && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#f5a623] text-black text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                      {it ? "Il più scelto" : "Cel mai ales"}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-4 mt-2">{plan.name}</div>

                  {/* Pret */}
                  <div className="mb-4">
                    <div className="text-gray-500 line-through text-lg">€{normalPrice}/{it ? "lună" : "lună"}</div>
                    <div className="flex items-end gap-3">
                      <div className="text-5xl font-semibold text-[#f5a623]">
                        <sup className="text-xl">€</sup>{founderPrice}
                        <sub className="text-sm font-normal text-gray-500">/{it ? "mese" : "lună"}</sub>
                      </div>
                      <span className="mb-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>
                    </div>
                    <div className="text-xs text-[#f5a623] mt-1">
                      {it ? "prezzo fondatore a vita" : "preț fondator pe viață"}
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-5">{plan.desc}</p>

                  <div className="border-t border-[#2a2a2a] pt-4 mb-6 space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex gap-2 text-sm text-gray-300">
                        <span className="text-green-400 shrink-0">✓</span>{f}
                      </div>
                    ))}
                    {plan.missing.map((f) => (
                      <div key={f} className="flex gap-2 text-sm text-gray-600">
                        <span className="shrink-0">✗</span>{f}
                      </div>
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
                      {loading === plan.id
                        ? (it ? "Elaborazione..." : "Se procesează...")
                        : (it ? "Inizia gratuitamente" : "Începe gratuit")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-8 bg-[#161616] border border-[#2a2a2a] rounded-xl p-5 text-center text-sm text-gray-400">
          {it
            ? "Il pagamento viene elaborato in modo sicuro tramite Stripe. Puoi annullare in qualsiasi momento."
            : "Plata se procesează securizat prin Stripe. Poți anula oricând. Datele tale rămân intacte indiferent de planul ales."}
        </div>

      </div>
    </div>
  );
}