"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import LangSwitcher from "@/app/lib/LangSwitcher";
import { useLang } from "@/app/lib/LanguageContext";
import { usePlan } from "@/app/lib/usePlan";

export default function AppNav({ active }: { active?: string }) {
  const router = useRouter();
  const { tr } = useLang();
  const { plan, isTrialing } = usePlan();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const linkClass = (name: string) =>
    active === name ? "text-white" : "text-gray-400 hover:text-white";

  const showReport = plan === "pro" || plan === "premium" || isTrialing;
  const showUpgrade = !isTrialing && plan !== "premium";

  return (
    <nav className="bg-[#161616] border-b border-[#2e2e2e] px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5 text-sm text-gray-400">
          <Link href="/dashboard" className={linkClass("dashboard")}>{tr.dashboard}</Link>
          <Link href="/trip/new" className={linkClass("trip")}>{tr.newTrip}</Link>
          <Link href="/history" className={linkClass("history")}>{tr.history}</Link>
          <Link href="/clients" className={linkClass("clients")}>{tr.clients}</Link>
          <Link href="/cashflow" className={linkClass("cashflow")}>{tr.cashflow}</Link>
          <Link href="/truck" className={linkClass("truck")}>{tr.truck}</Link>
          {showReport && <Link href="/report" className={linkClass("report")}>{tr.report}</Link>}
          {showReport && <Link href="/simulations" className={linkClass("simulations")}>{tr.simulations}</Link>}
          {showUpgrade && (
            <Link href="/pricing" className="bg-[#f5a623] text-black font-semibold px-3 py-1 rounded-lg hover:bg-[#e8951a] transition text-xs">
              Upgrade
            </Link>
          )}
          <Link href="/settings" className={linkClass("settings")}>{tr.settings}</Link>
          <LangSwitcher />
          <button onClick={handleLogout} className="hover:text-white">{tr.logout}</button>
        </div>

        {/* Mobile - dreapta */}
        <div className="flex md:hidden items-center gap-3">
          <LangSwitcher />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-400 hover:text-white p-1"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 border-t border-[#2e2e2e] pt-3 flex flex-col gap-3 text-sm">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className={linkClass("dashboard")}>{tr.dashboard}</Link>
          <Link href="/trip/new" onClick={() => setMenuOpen(false)} className={linkClass("trip")}>{tr.newTrip}</Link>
          <Link href="/history" onClick={() => setMenuOpen(false)} className={linkClass("history")}>{tr.history}</Link>
          <Link href="/clients" onClick={() => setMenuOpen(false)} className={linkClass("clients")}>{tr.clients}</Link>
          <Link href="/cashflow" onClick={() => setMenuOpen(false)} className={linkClass("cashflow")}>{tr.cashflow}</Link>
          <Link href="/truck" onClick={() => setMenuOpen(false)} className={linkClass("truck")}>{tr.truck}</Link>
          {showReport && <Link href="/report" onClick={() => setMenuOpen(false)} className={linkClass("report")}>{tr.report}</Link>}
          {showReport && <Link href="/simulations" onClick={() => setMenuOpen(false)} className={linkClass("simulations")}>{tr.simulations}</Link>}
          <Link href="/settings" onClick={() => setMenuOpen(false)} className={linkClass("settings")}>{tr.settings}</Link>
          {showUpgrade && (
            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="bg-[#f5a623] text-black font-semibold px-3 py-2 rounded-lg text-center text-xs">
              Upgrade
            </Link>
          )}
          <button onClick={handleLogout} className="text-left text-gray-400 hover:text-white">{tr.logout}</button>
        </div>
      )}
    </nav>
  );
}