"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      const userDoc = await getDoc(doc(db, "users", u.uid));
      if (userDoc.exists() && userDoc.data()?.onboardingCompleted === true) {
        router.push("/dashboard");
        return;
      }
      setUserId(u.uid);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleStep1Submit = async () => {
    if (!companyName.trim()) { setError("Please enter your company name."); return; }
    setError("");
    try {
      await updateDoc(doc(db, "users", userId), { companyName: companyName.trim() });
      setStep(2);
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  const handleStep2Submit = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", userId), { onboardingCompleted: true });
      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Your<span className="text-[#f5a623]">App</span>
          </h1>
          <p className="text-gray-400 mt-2">Let's get you set up</p>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? "bg-[#f5a623]" : "bg-[#2e2e2e]"}`} />
          ))}
        </div>

        <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-2">What's your company name?</h2>
              <p className="text-sm text-gray-400 mb-6">This will be displayed in your dashboard.</p>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button onClick={handleStep1Submit} className="w-full bg-[#f5a623] text-black font-bold py-3 rounded-lg hover:bg-[#e59512] transition">
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-2">Set up your first item</h2>
              <p className="text-sm text-gray-400 mb-6">
                Add your first item to get started. You can add more later.
              </p>
              {/* 
                TODO: Add your custom onboarding fields here.
                Example: product name, team size, use case, etc.
              */}
              <div className="bg-[#1f1f1f] border border-dashed border-[#2e2e2e] rounded-lg p-6 text-center text-gray-500 text-sm">
                Add your custom fields here
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 pt-4">
                <button onClick={handleStep2Submit} disabled={saving} className="flex-1 bg-[#2e2e2e] text-white font-bold py-3 rounded-lg hover:bg-[#3a3a3a] transition disabled:opacity-50">
                  Skip for now
                </button>
                <button onClick={handleStep2Submit} disabled={saving} className="flex-1 bg-[#f5a623] text-black font-bold py-3 rounded-lg hover:bg-[#e59512] transition disabled:opacity-50">
                  {saving ? "Saving..." : "Continue"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-xl font-bold text-white mb-2">You're all set!</h2>
                <p className="text-sm text-gray-400">Your account is ready. Let's go to your dashboard.</p>
              </div>
              <button onClick={() => router.push("/dashboard")} className="w-full bg-[#f5a623] text-black font-bold py-3 rounded-lg hover:bg-[#e59512] transition">
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}