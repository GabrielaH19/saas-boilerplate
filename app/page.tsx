"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function FounderCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/founder-count")
      .then(r => r.json())
      .then(d => setCount(d.count || 0))
      .catch(() => setCount(0));
  }, []);

  const remaining = Math.max(0, 100 - count);
  if (remaining <= 0) return null;

  return (
    <div className="flex items-center gap-2 justify-center">
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`h-3 w-8 rounded-full ${i < Math.ceil(count / 10) ? "bg-[#f5a623]" : "bg-[#2e2e2e]"}`} />
        ))}
      </div>
      <span className="text-sm text-gray-300">{remaining} spots remaining out of 100</span>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "resetPassword") {
        router.push(`/reset-password${window.location.search}`);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#1e1e1e] px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Your<span className="text-[#f5a623]">App</span></div>
        <div className="flex items-center gap-4">
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition">Features</a>
          <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition">Pricing</a>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white">Sign in</Link>
          <Link href="/register" className="bg-[#f5a623] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#e8951a] transition">
            Try for free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-14 text-center">
        <div className="inline-block bg-[#1a1a00] text-[#f5a623] border border-[#3a3000] text-xs px-4 py-2 rounded-full mb-8">
          Your tagline or niche here
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold leading-tight mb-6 text-white">
          Your main headline <span className="text-[#f5a623]">goes here.</span>
        </h1>
        <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
          Describe your product value proposition in one or two sentences. What does it do and why does it matter?
        </p>
        <p className="text-sm text-gray-500 mb-10">No complicated setup. Just results.</p>
        <div className="flex items-center gap-4 justify-center mb-4">
          <Link href="/register" className="bg-[#f5a623] text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#e8951a] transition text-base">
            Try 30 days free
          </Link>
          <Link href="/login" className="border border-[#3a3a3a] text-gray-300 px-8 py-4 rounded-lg hover:text-white hover:border-[#555] transition text-base">
            Sign in
          </Link>
        </div>
        <p className="text-xs text-gray-600">No credit card required. No commitments.</p>
      </div>

      {/* SOCIAL PROOF */}
      <div className="border-t border-b border-[#1e1e1e] bg-[#111] py-7 px-6 text-center mb-24">
        <p className="text-base text-gray-300 max-w-lg mx-auto">
          Built for [your target audience] who need [your core benefit].{" "}
          <strong className="text-white">YourApp solves [the problem] before it becomes expensive.</strong>
        </p>
      </div>

      {/* PROBLEM */}
      <div className="max-w-6xl mx-auto px-6 mb-24 text-center">
        <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-5">The Problem</div>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">Why does [your audience] struggle with [problem]?</h2>
        <p className="text-lg text-gray-400 mb-14">Not for lack of effort. But for lack of the right tools.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { t: "Problem 1", d: "Describe the first pain point your target audience faces. Be specific and empathetic." },
            { t: "Problem 2", d: "Describe the second pain point. Use the language your customers use." },
            { t: "Problem 3", d: "Describe the third pain point. Focus on the emotional and financial cost." },
            { t: "Problem 4", d: "Describe the fourth pain point. This builds the case for your solution." },
          ].map((item, i) => (
            <div key={i} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-7 text-left">
              <div className="text-lg font-semibold text-white mb-3">{item.t}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{item.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" className="bg-[#0a0a0a] border-t border-b border-[#1e1e1e] py-24 px-6 mb-24">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-5">Features</div>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">What YourApp does for you</h2>
          <p className="text-lg text-gray-400 mb-14">All the tools you need, available instantly.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { n: "01", t: "Feature One", d: "Describe what this feature does and why it matters to your user." },
              { n: "02", t: "Feature Two", d: "Describe what this feature does and why it matters to your user." },
              { n: "03", t: "Feature Three", d: "Describe what this feature does and why it matters to your user." },
              { n: "04", t: "Feature Four", d: "Describe what this feature does and why it matters to your user." },
              { n: "05", t: "Feature Five", d: "Describe what this feature does and why it matters to your user." },
              { n: "06", t: "Feature Six", d: "Describe what this feature does and why it matters to your user." },
            ].map((f, i) => (
              <div key={i} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6 text-left">
                <div className="text-xs text-[#f5a623] mb-3">{f.n}</div>
                <div className="text-base font-semibold text-white mb-2">{f.t}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" className="max-w-6xl mx-auto px-6 mb-24 text-center">
        <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-5">Pricing</div>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">Simple and transparent.</h2>
        <div className="mb-6 flex flex-col items-center gap-3">
          <span className="bg-[#1f0a00] border border-[#f5a623] text-[#f5a623] text-sm font-semibold px-6 py-3 rounded-full">
            🔥 First 100 subscribers · Founder pricing for life
          </span>
          <FounderCounter />
        </div>
        <p className="text-lg text-gray-400 mb-14">30 days free for any plan. No credit card at registration.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { id: "basic", name: "Basic", founder: 9, normal: 19, savings: 120, discount: 40, highlight: false, features: ["Feature one", "Feature two", "1 user", "60-day history"], missing: ["Advanced analytics", "Priority support", "Export PDF"] },
            { id: "pro", name: "Pro", founder: 19, normal: 39, savings: 240, discount: 41, highlight: true, features: ["Everything in Basic", "10 users", "365-day history", "Advanced analytics"], missing: ["Export PDF", "Priority support"] },
            { id: "premium", name: "Premium", founder: 39, normal: 79, savings: 480, discount: 41, highlight: false, features: ["Everything in Pro", "Unlimited users", "Unlimited history", "Export PDF", "Priority support"], missing: [] },
          ].map(plan => (
            <div key={plan.id} className={`rounded-xl overflow-hidden text-left ${plan.highlight ? "bg-[#16143a] border-2 border-[#4f46e5] relative" : "bg-[#161616] border border-[#2a2a2a]"}`}>
              {plan.highlight && (
                <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#f5a623] text-black text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap z-10">
                  Most popular
                </div>
              )}
              <div className="bg-red-500 px-5 py-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-white">🔥 Founder price</span>
                <span className="text-xs font-bold text-white bg-black/20 px-2 py-0.5 rounded">-€{plan.savings}/yr</span>
              </div>
              <div className={`p-8 ${plan.highlight ? "pt-12" : ""}`}>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">{plan.name}</div>
                <div className="text-sm text-gray-500 line-through mb-1">€{plan.normal}/mo</div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-5xl font-bold text-[#f5a623]">€{plan.founder}</div>
                  <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg">-{plan.discount}%</span>
                </div>
                <div className="text-xs text-gray-600 mb-6">/mo · founder price for life</div>
                <div className="border-t border-[#2a2a2a] pt-5 mb-7 space-y-2.5">
                  {plan.features.map(f => (
                    <div key={f} className="flex gap-2 text-sm text-gray-300"><span className="text-green-400">✓</span>{f}</div>
                  ))}
                  {plan.missing.map(f => (
                    <div key={f} className="flex gap-2 text-sm text-gray-600"><span>✗</span>{f}</div>
                  ))}
                </div>
                <Link href="/register" className={`block text-center py-3 rounded-lg text-sm font-semibold transition ${plan.highlight ? "bg-[#4f46e5] text-white hover:bg-[#4338ca]" : "border border-[#333] text-white hover:bg-[#1e1e1e]"}`}>
                  Start free
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-5xl mx-auto px-6 mb-24">
        <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-5 text-center">FAQ</div>
        <h2 className="text-3xl font-semibold mb-10 text-center text-white">Got questions?</h2>
        <div className="space-y-4">
          {[
            { q: "Do I need a credit card to sign up?", a: "No. You get 30 days free without a credit card. You only add payment details if you decide to continue." },
            { q: "How long does setup take?", a: "About 2 minutes. Enter your details once and everything works automatically from there." },
            { q: "Does it work on mobile?", a: "Yes, it works on any device — phone, tablet, or computer." },
            { q: "Is my data safe?", a: "Yes. Data is stored securely in the cloud and is never shared with anyone." },
            { q: "Can I cancel anytime?", a: "Yes, no penalties and no explanation needed." },
            { q: "What happens after 30 days?", a: "Choose a plan from the app. Your data stays intact regardless of the plan you choose." },
          ].map((item, i) => (
            <div key={i} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6">
              <div className="font-semibold text-white mb-2">{item.q}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{item.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0a0a0a] border-t border-[#1e1e1e] py-24 px-6 text-center">
        <h2 className="text-4xl font-semibold mb-5 text-white">Ready to get started?</h2>
        <p className="text-lg text-gray-400 mb-10">Set up in two minutes. First result immediately.</p>
        <Link href="/register" className="bg-[#f5a623] text-black font-semibold px-10 py-4 rounded-lg hover:bg-[#e8951a] transition text-base inline-block">
          Try 30 days free
        </Link>
        <p className="text-sm text-gray-600 mt-5">No credit card. No commitments. Cancel anytime.</p>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#1e1e1e] py-6 px-10 flex items-center justify-between">
        <div className="text-sm font-semibold">Your<span className="text-[#f5a623]">App</span></div>
        <div className="flex gap-4 text-sm text-gray-600">
          <Link href="/terms" className="hover:text-gray-400">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
          <span>contact@yourapp.com</span>
        </div>
      </footer>

    </div>
  );
}