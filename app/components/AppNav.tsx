"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { usePlan } from "@/app/lib/usePlan";

export default function AppNav({ active }: { active?: string }) {
  const router = useRouter();
  const { plan, isTrialing } = usePlan();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const linkClass = (name: string) =>
    `transition ${active === name ? "text-white" : "text-gray-400 hover:text-white"}`;

  const showUpgrade = !isTrialing && plan !== "premium";

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", name: "dashboard" },
    { href: "/new", label: "New Item", name: "new" },
    { href: "/history", label: "History", name: "history" },
    { href: "/settings", label: "Settings", name: "settings" },
  ];

  return (
    <nav className="bg-[#161616] border-b border-[#2e2e2e] px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Your<span className="text-[#f5a623]">App</span></h1>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5 text-sm text-gray-400">
          {navLinks.map(link => (
            <Link key={link.name} href={link.href} className={linkClass(link.name)}>
              {link.label}
            </Link>
          ))}
          {showUpgrade && (
            <Link href="/pricing" className="bg-[#f5a623] text-black font-semibold px-3 py-1 rounded-lg hover:bg-[#e8951a] transition text-xs">
              Upgrade
            </Link>
          )}
          <button onClick={handleLogout} className="text-gray-400 hover:text-white transition">Logout</button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-white p-1">
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
          {navLinks.map(link => (
            <Link key={link.name} href={link.href} onClick={() => setMenuOpen(false)} className={linkClass(link.name)}>
              {link.label}
            </Link>
          ))}
          {showUpgrade && (
            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="bg-[#f5a623] text-black font-semibold px-3 py-2 rounded-lg text-center text-xs">
              Upgrade
            </Link>
          )}
          <button onClick={handleLogout} className="text-left text-gray-400 hover:text-white">Logout</button>
        </div>
      )}
    </nav>
  );
}