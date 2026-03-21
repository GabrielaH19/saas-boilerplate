"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import Link from "next/link";
import { useLang } from "@/app/lib/LanguageContext";
import LangSwitcher from "@/app/lib/LangSwitcher";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { tr } = useLang();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError("Email-ul nu există în sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Trip<span className="text-[#f5a623]">Profit</span>
          </h1>
          <p className="text-gray-400 mt-2">Resetează parola</p>
        </div>
        <div className="flex justify-end mb-4">
          <LangSwitcher />
        </div>
        <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-green-400 text-5xl mb-4">✓</div>
              <h2 className="text-white font-bold text-lg mb-2">Email trimis!</h2>
              <p className="text-gray-400 text-sm mb-6">
                Am trimis un link de resetare la <strong className="text-white">{email}</strong>. Verifică inbox-ul și spam-ul.
              </p>
              <Link href="/login" className="text-[#f5a623] hover:underline text-sm">
                Înapoi la login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-gray-400 text-sm mb-4">
                Introdu email-ul cu care te-ai înregistrat și îți trimitem un link de resetare.
              </p>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">{tr.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]"
                  placeholder="email@tau.com"
                  required
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition disabled:opacity-50"
              >
                {loading ? tr.loading : "Trimite link de resetare"}
              </button>
              <p className="text-center text-gray-400 text-sm mt-4">
                <Link href="/login" className="text-[#f5a623] hover:underline">
                  Înapoi la login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}