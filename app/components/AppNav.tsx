"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import LangSwitcher from "@/app/lib/LangSwitcher";
import { useLang } from "@/app/lib/LanguageContext";

export default function AppNav({ active }: { active?: string }) {
  const router = useRouter();
  const { tr } = useLang();
  const handleLogout = async () => { await signOut(auth); router.push("/login"); };
  return (
    <nav className="bg-[#161616] border-b border-[#2e2e2e] px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>
      <div className="flex items-center gap-6 text-sm text-gray-400">
        <Link href="/dashboard" className={active==="dashboard"?"text-white":"hover:text-white"}>Dashboard</Link>
        <Link href="/trip/new" className={active==="trip"?"text-white":"hover:text-white"}>Cursa noua</Link>
        <Link href="/history" className={active==="history"?"text-white":"hover:text-white"}>Istoric</Link>
        <Link href="/clients" className={active==="clients"?"text-white":"hover:text-white"}>Clien?i</Link>
        <Link href="/cashflow" className={active==="cashflow"?"text-white":"hover:text-white"}>Cashflow</Link>
        <Link href="/truck" className={active==="truck"?"text-white":"hover:text-white"}>Camioane</Link>
        <LangSwitcher />
        <button onClick={handleLogout} className="hover:text-white">Ie?i</button>
      </div>
    </nav>
  );
}
