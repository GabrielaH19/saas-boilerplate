"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AppNav from "@/app/components/AppNav";

const FOUNDER_PRICES: Record<string, number> = { basic: 9, pro: 19, premium: 39 };
const NORMAL_PRICES: Record<string, number> = { basic: 19, pro: 39, premium: 79 };

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [founderPricing, setFounderPricing] = useState(false);
  const [founderCount, setFounderCount] = useState<number | null>(null);
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
      else alert("Payment error. Please try again.");
    } catch {
      alert("Payment error. Please try again.");
    }
    setLoading(null);
  };

  const plans = [
    {
      id: "basic",
      name: "Basic",
      desc: "Perfect for individuals and small teams getting started.",
      features: ["Feature one", "Feature two", "Feature three", "Up to 3 users"],
      missing: ["Advanced analytics", "Priority support", "Custom integrations"],
      highlight: false,
    },
    {
      id: "pro",
      name: "Pro",
      desc: "For growing teams that need more power and flexibility.",
      features: ["Everything in Basic", "Up to 10 users", "Advanced analytics", "Priority email support"],
      missing: ["Custom integrations", "Dedicated support"],
      highlight: true,
    },
    {
      id: "premium",
      name: "Premium",
      desc: "For businesses that need full control and customization.",
      features: ["Everything in Pro", "Unlimited users", "Custom integrations", "Dedicated support", "SLA guarantee"],
      missing: [],
      highlight: false,
    },
  ];

  const remaining = founderCount !== null ? 100 - founderCount : null;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="pricing" />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">PRICING</p>
          <h2 className="text-3xl font-bold mb-6">Simple, transparent pricing.</h2>

          <div className="inline-flex items-center gap-2 border border-[#f5a623] rounded-full px-5 py-2 text-sm text-[#f5a623] mb-4">
            🔥 First 100 subscribers · Founder pricing for life
          </div>

          {remaining !== null && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm text-gray-400">{remaining} spots remaining out of 100</span>
            </div>
          )}

          <p className="text-gray-400 text-sm">30-day free trial. No credit card required.</p>

          {currentPlan && currentPlan !== "free" && (
            <div className="mt-4 inline-block bg-green-900 border border-green-700 text-green-400 text-sm px-4 py-2 rounded-lg">
              Active plan: <strong className="capitalize">{currentPlan}</strong>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const founderPrice = FOUNDER_PRICES[plan.id];
            const normalPrice = NORMAL_PRICES[plan.id];

            return (
              <div key={plan.id} className={`rounded-xl relative flex flex-col ${plan.highlight ? "bg-[#16143a] border-2 border-[#4f46e5]" : "bg-[#161616] border border-[#2a2a2a]"}`}>
                <div className="flex items-center justify-between bg-red-600 rounded-t-xl px-4 py-2">
                  <span className="text-xs font-semibold text-white">🔥 Founder price</span>
                </div>

                <div className="p-7 flex flex-col flex-1">
                  {plan.highlight && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#f5a623] text-black text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                      Most popular
                    </div>
                  )}

                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-4 mt-2">{plan.name}</div>

                  <div className="mb-4">
                    <div className="text-gray-500 line-through text-lg">€{normalPrice}/mo</div>
                    <div className="flex items-end gap-3">
                      <div className="text-5xl font-semibold text-[#f5a623]">
                        <sup className="text-xl">€</sup>{founderPrice}
                        <sub className="text-sm font-normal text-gray-500">/mo</sub>
                      </div>
                    </div>
                    <div className="text-xs text-[#f5a623] mt-1">founder price for life</div>
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
                      Current plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCheckout(plan.id)}
                      disabled={loading === plan.id}
                      className={`w-full py-3 rounded-lg text-sm font-semibold transition disabled:opacity-50 ${plan.highlight ? "bg-[#4f46e5] text-white hover:bg-[#4338ca]" : "border border-[#333] text-white hover:bg-[#1e1e1e]"}`}
                    >
                      {loading === plan.id ? "Processing..." : "Start free trial"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-[#161616] border border-[#2a2a2a] rounded-xl p-5 text-center text-sm text-gray-400">
          Payments processed securely via Stripe. Cancel anytime.
        </div>
      </div>
    </div>
  );
}