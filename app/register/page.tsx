"use client";

import { useState, Suspense } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprAccepted) {
      setError("You must accept the privacy policy to continue.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users/count");
      const { count, isFounder } = await res.json();
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
        founderNumber: isFounder ? count + 1 : null,
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
        setError("This email is already in use.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError("An error occurred. Please try again.");
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
            Your<span className="text-[#f5a623]">App</span>
          </h1>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>
        <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]"
                placeholder="John Doe" required />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]"
                placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]"
                placeholder="Min. 6 characters" required />
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="gdpr" checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="mt-1 accent-[#f5a623] w-4 h-4 shrink-0 cursor-pointer" />
              <label htmlFor="gdpr" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
                I have read and accept the{" "}
                <Link href="/privacy" className="text-[#f5a623] hover:underline">privacy policy</Link>{" "}
                and{" "}
                <Link href="/terms" className="text-[#f5a623] hover:underline">terms and conditions</Link>.
              </label>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition disabled:opacity-50">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#f5a623] hover:underline">Sign in</Link>
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