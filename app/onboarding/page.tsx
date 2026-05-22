"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { useLang } from "@/app/lib/LanguageContext";

interface Truck {
  name: string;
  leasing: number;
  insurance: number;
  maintenance: number;
  salary: number;
  otherCost: number;
  fuelConsumption: number;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [truck, setTruck] = useState<Truck>({
    name: "Camion 1",
    leasing: 0,
    insurance: 0,
    maintenance: 0,
    salary: 0,
    otherCost: 0,
    fuelConsumption: 32,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const { tr } = useLang();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

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
    if (!companyName.trim()) {
      setError(tr.onboardingError);
      return;
    }
    setError("");
    try {
      await updateDoc(doc(db, "users", userId), {
        companyName: companyName.trim(),
      });
      setStep(2);
    } catch (err) {
      setError(tr.onboardingError);
    }
  };

  const handleStep2Skip = async () => {
    setError("");
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", userId), {
        onboardingCompleted: true,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(tr.onboardingError);
      setSaving(false);
    }
  };

  const handleStep2Submit = async () => {
    if (!truck.name.trim()) {
      setError(tr.onboardingError);
      return;
    }

    setError("");
    setSaving(true);
    try {
      const truckId = `truck_${Date.now()}`;
      await setDoc(doc(db, "trucks", truckId), {
        userId,
        name: truck.name.trim(),
        plate: "",
        consumption: truck.fuelConsumption,
        estimatedKmPerMonth: 0,
        fixedCosts: {
          leasing: truck.leasing,
          insurance: truck.insurance,
          maintenance: truck.maintenance,
          salary: truck.salary,
          other: truck.otherCost,
        },
        isActive: true,
        createdAt: new Date().toISOString(),
      });

      await updateDoc(doc(db, "users", userId), {
        onboardingCompleted: true,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(tr.onboardingError);
      setSaving(false);
    }
  };

  const handleStep3Finish = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <p className="text-gray-400">{tr.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Trip<span className="text-[#f5a623]">Profit</span>
          </h1>
          <p className="text-gray-400 mt-2">{tr.onboardingTitle}</p>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? "bg-[#f5a623]" : "bg-[#2e2e2e]"
              }`}
            />
          ))}
        </div>

        <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {tr.onboardingStep1Title}
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  {tr.onboardingStep1Sub}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                  {tr.companyName}
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={tr.companyNamePlaceholder}
                  className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleStep1Submit}
                className="w-full bg-[#f5a623] text-black font-bold py-3 rounded-lg hover:bg-[#e59512] transition"
              >
                {tr.onboardingNext}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {tr.onboardingStep2Title}
                </h2>
                <p className="text-sm text-gray-400 mb-2">
                  {tr.onboardingStep2Sub}
                </p>
                <p className="text-xs text-gray-500 mb-6">
                  {tr.onboardingStep2Desc}
                </p>
              </div>

              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                  {tr.truck}
                </label>
                <input
                  type="text"
                  value={truck.name}
                  onChange={(e) => setTruck({ ...truck, name: e.target.value })}
                  placeholder={tr.truckNamePlaceholder}
                  className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              <div className="pt-4 border-t border-[#2e2e2e]">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-bold">
                  {tr.calcSettings}
                </p>
                <div className="space-y-3">
                  {[
                    { key: "leasing", label: tr.leasing },
                    { key: "insurance", label: tr.insurance },
                    { key: "maintenance", label: tr.maintenance },
                    { key: "salary", label: tr.salary },
                    { key: "otherCost", label: tr.otherCost },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-500 mb-1">
                        {label}
                      </label>
                      <input
                        type="number"
                        value={truck[key as keyof Truck]}
                        onChange={(e) =>
                          setTruck({
                            ...truck,
                            [key]: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#2e2e2e]">
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                  {tr.fuelConsumption}
                </label>
                <input
                  type="number"
                  value={truck.fuelConsumption}
                  onChange={(e) =>
                    setTruck({
                      ...truck,
                      fuelConsumption: parseFloat(e.target.value) || 32,
                    })
                  }
                  className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#f5a623]"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleStep2Skip}
                  disabled={saving}
                  className="flex-1 bg-[#2e2e2e] text-white font-bold py-3 rounded-lg hover:bg-[#3a3a3a] transition disabled:opacity-50"
                >
                  {tr.onboardingAddLater}
                </button>
                <button
                  onClick={handleStep2Submit}
                  disabled={saving}
                  className="flex-1 bg-[#f5a623] text-black font-bold py-3 rounded-lg hover:bg-[#e59512] transition disabled:opacity-50"
                >
                  {saving ? tr.loading : tr.onboardingNext}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {tr.onboardingStep3Title}
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  {tr.onboardingStep3Sub}
                </p>
                <p className="text-xs text-gray-500">
                  {tr.onboardingStep3Desc}
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={handleStep3Finish}
                  className="w-full bg-[#f5a623] text-black font-bold py-3 rounded-lg hover:bg-[#e59512] transition"
                >
                  {tr.onboardingFinish}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}