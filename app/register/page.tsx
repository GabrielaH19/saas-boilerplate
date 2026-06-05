"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, getCountFromServer } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/app/lib/LanguageContext";
import LangSwitcher from "@/app/lib/LangSwitcher";

import { Suspense } from "react";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");
  const { tr } = useLang();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Verifica daca e printre primii 100
      const usersCount = await getCountFromServer(collection(db, "users"));
      const isFounder = usersCount.data().count < 100;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 30);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        plan: "free",
        trialEnd: trialEnd.toISOString().slice(0, 10),
        onboardingCompleted: false,
        founderPricing: isFounder,
        founderNumber: isFounder ? usersCount.data().count + 1 : null,
        referredBy: refCode || null,
        referralEarnings: 0,
        referralCount: 0,
      });

      await fetch("/api/email/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      router.push("/onboarding");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email-ul este deja folosit.");
      } else if (err.code === "auth/weak-password") {
        setError("Parola trebuie sa aiba minim 6 caractere.");
      } else {
        setError("A aparut o eroare. Incearca din nou.");
      }
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
          <p className="text-gray-400 mt-2">{tr.registerTitle}</p>
        </div>
        <div className="flex justify-end mb-4">
          <LangSwitcher />
        </div>
        <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">{tr.fullName}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]"
                placeholder="Ion Popescu" required />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">{tr.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]"
                placeholder="email@tau.com" required />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">{tr.password}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]"
                placeholder={tr.minChars} required />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition disabled:opacity-50">
              {loading ? tr.loading : tr.registerBtn}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            {tr.hasAccount}{" "}
            <Link href="/login" className="text-[#f5a623] hover:underline">{tr.signIn}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}