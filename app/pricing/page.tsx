"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useLang } from "../lib/LanguageContext";
import LangSwitcher from "../lib/LangSwitcher";

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const router = useRouter();
  const { tr } = useLang();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) setCurrentPlan(snap.data().plan || "free");
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="bg-[#161616] border-b border-[#2e2e2e] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/dashboard" className="hover:text-white">{tr.dashboard}</Link>
          <Link href="/trip/new" className="hover:text-white">{tr.newTrip}</Link>
          <Link href="/history" className="hover:text-white">{tr.history}</Link>
          <Link href="/report" className="hover:text-white">{tr.report}</Link>
          <Link href="/truck" className="hover:text-white">{tr.truck}</Link>
          <Link href="/pricing" className="text-white">{tr.pricingNav}</Link>
          <button onClick={handleLogout} className="hover:text-white">{tr.logout}</button>
        </div>
        <LangSwitcher />
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{tr.pricingTitle}</h2>
          <p className="text-gray-400">{tr.pricingSub}</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* FREE */}
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8 relative">
            <div className="text-sm text-gray-400 uppercase tracking-wider font-mono mb-2">{tr.pricingFree}</div>
            <div className="text-4xl font-bold font-mono mb-1">0 <span className="text-sm font-normal text-gray-400">{tr.pricingMonth}</span></div>
            <p className="text-gray-500 text-xs mb-6">{tr.pricingFreeDesc}</p>
            <ul className="space-y-2 mb-8">
              {tr.pricingFreeF.map((f: string, j: number) => (
                <li key={j} className="flex items-center gap-2 text-sm"><span className="text-green-400 font-bold">✓</span>{f}</li>
              ))}
              {tr.pricingFreeNo.map((f: string, j: number) => (
                <li key={j} className="flex items-center gap-2 text-sm text-gray-600"><span>✗</span>{f}</li>
              ))}
            </ul>
            <button disabled className="w-full py-3 rounded-lg font-semibold text-sm bg-[#2a2a2a] text-gray-500 cursor-not-allowed">
              {currentPlan === "free" ? tr.pricingCurrent : tr.pricingFree}
            </button>
          </div>

          {/* PRO */}
          <div className="bg-[#1e1b4b] border-2 border-[#6366f1] rounded-xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f5a623] text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">{tr.pricingPopular}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider font-mono mb-2">{tr.pricingPro}</div>
            <div className="text-4xl font-bold font-mono mb-1">7 <span className="text-sm font-normal text-gray-400">{tr.pricingMonth}</span></div>
            <p className="text-gray-400 text-xs mb-6">{tr.pricingProDesc}</p>
            <ul className="space-y-2 mb-8">
              {tr.pricingProF.map((f: string, j: number) => (
                <li key={j} className="flex items-center gap-2 text-sm"><span className="text-green-400 font-bold">✓</span>{f}</li>
              ))}
            </ul>
            <button disabled={currentPlan === "pro"}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition ${currentPlan === "pro" ? "bg-[#2a2a2a] text-gray-500 cursor-not-allowed" : "bg-[#f5a623] text-black hover:bg-[#e8951a]"}`}>
              {currentPlan === "pro" ? tr.pricingCurrent : tr.pricingUpgrade}
            </button>
          </div>

          {/* FLEET */}
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8 relative">
            <div className="text-sm text-gray-400 uppercase tracking-wider font-mono mb-2">{tr.pricingFleet}</div>
            <div className="text-4xl font-bold font-mono mb-1">29 <span className="text-sm font-normal text-gray-400">{tr.pricingMonth}</span></div>
            <p className="text-gray-500 text-xs mb-6">{tr.pricingFleetDesc}</p>
            <ul className="space-y-2 mb-8">
              {tr.pricingFleetF.map((f: string, j: number) => (
                <li key={j} className="flex items-center gap-2 text-sm"><span className="text-green-400 font-bold">✓</span>{f}</li>
              ))}
            </ul>
            <a href="mailto:tripprofit.contact@gmail.com"
              className="w-full py-3 rounded-lg font-semibold text-sm border border-[#334155] text-white hover:bg-[#1e293b] transition block text-center">
              {tr.pricingContact}
            </a>
          </div>
        </div>

        {/* REFERRAL */}
        <div className="mt-12 bg-[#161616] border border-[#2e2e2e] rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold mb-2">{tr.pricingRefTitle}</h3>
          <p className="text-gray-400 text-sm mb-4">{tr.pricingRefSub}</p>
          <div className="bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 font-mono text-sm text-[#f5a623] inline-block">
            tripprofit.com/ref/{user?.uid?.slice(0, 8)}
          </div>
        </div>
      </div>
    </div>
  );
}