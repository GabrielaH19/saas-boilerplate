"use client";

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
  const { plan } = usePlan();
  const handleLogout = async () => { await signOut(auth); router.push("/login"); };
  return (
    <nav className="bg-[#161616] border-b border-[#2e2e2e] px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>
      <div className="flex items-center gap-6 text-sm text-gray-400">
        <Link href="/dashboard" className={active==="dashboard"?"text-white":"hover:text-white"}>{tr.dashboard}</Link>
        <Link href="/trip/new" className={active==="trip"?"text-white":"hover:text-white"}>{tr.newTrip}</Link>
        <Link href="/history" className={active==="history"?"text-white":"hover:text-white"}>{tr.history}</Link>
        <Link href="/clients" className={active==="clients"?"text-white":"hover:text-white"}>{tr.clients}</Link>
        <Link href="/cashflow" className={active==="cashflow"?"text-white":"hover:text-white"}>{tr.cashflow}</Link>
        <Link href="/truck" className={active==="truck"?"text-white":"hover:text-white"}>{tr.truck}</Link>
        {plan !== "premium" && (
          <Link href="/#pricing" className="bg-[#f5a623] text-black font-semibold px-3 py-1 rounded-lg hover:bg-[#e8951a] transition text-xs">
            Upgrade
          </Link>
        )}
        <LangSwitcher />
        <button onClick={handleLogout} className="hover:text-white">{tr.logout}</button>
      </div>
    </nav>
  );
}
