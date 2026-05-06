"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import AppNav from "@/app/components/AppNav";
import { useLang } from "../lib/LanguageContext";

interface Settings {
  thresholdPerKm: number;
  defaultFuelPrice: number;
  estimatedKmPerMonth: number;
  companyFixedCosts: { salaries: number; admin: number; rent: number; software: number; other: number; };
  currency: string;
}

const defaultSettings = (): Settings => ({
  thresholdPerKm: 1.30,
  defaultFuelPrice: 1.68,
  estimatedKmPerMonth: 9500,
  companyFixedCosts: { salaries: 0, admin: 0, rent: 0, software: 0, other: 0 },
  currency: "EUR",
});

export default function SettingsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings());
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();
  const { tr } = useLang();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUserId(u.uid);
      const [userSnap, settingsSnap] = await Promise.all([
        getDoc(doc(db, "users", u.uid)),
        getDoc(doc(db, "settings", u.uid)),
      ]);
      if (userSnap.exists()) {
        setUserName(userSnap.data().name || "");
        setCompanyName(userSnap.data().companyName || "");
      }
      if (settingsSnap.exists()) {
        const data = settingsSnap.data() as Settings;
        setSettings({
          thresholdPerKm: data.thresholdPerKm ?? 1.30,
          defaultFuelPrice: data.defaultFuelPrice ?? 1.68,
          estimatedKmPerMonth: data.estimatedKmPerMonth ?? 9500,
          companyFixedCosts: {
            salaries: data.companyFixedCosts?.salaries ?? 0,
            admin: data.companyFixedCosts?.admin ?? 0,
            rent: data.companyFixedCosts?.rent ?? 0,
            software: data.companyFixedCosts?.software ?? 0,
            other: data.companyFixedCosts?.other ?? 0,
          },
          currency: data.currency ?? "EUR",
        });
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await Promise.all([
        setDoc(doc(db, "settings", userId), { ...settings, userId, updatedAt: serverTimestamp() }, { merge: true }),
        setDoc(doc(db, "users", userId), { name: userName, companyName, updatedAt: serverTimestamp() }, { merge: true }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const setFixed = (key: keyof Settings["companyFixedCosts"], val: number) => {
    setSettings(s => ({ ...s, companyFixedCosts: { ...s.companyFixedCosts, [key]: val } }));
  };

  const totalCompanyFixed = Object.values(settings.companyFixedCosts).reduce((a, b) => a + b, 0);
  const costPerKm = settings.estimatedKmPerMonth > 0
    ? ((settings.defaultFuelPrice * 0.32) + totalCompanyFixed / settings.estimatedKmPerMonth).toFixed(2)
    : "—";

  const inp = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]";
  const lbl = "block text-xs text-gray-400 mb-1";

  if (loading) return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center"><p className="text-gray-400">{tr.loading}</p></div>;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="settings" />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">{tr.settingsTitle}</h2>
        <p className="text-gray-400 text-sm mb-8">{tr.settingsSub}</p>

        {saved && <div className="bg-green-900 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">{tr.settingsSaved}</div>}

        <div className="space-y-6">
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.companyData}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>{tr.yourName}</label>
                <input className={inp} value={userName} onChange={e => setUserName(e.target.value)} placeholder="Ion Ionescu" />
              </div>
              <div>
                <label className={lbl}>{tr.companyName}</label>
                <input className={inp} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ionescu Trans SRL" />
              </div>
            </div>
          </div>

          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.calcSettings}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={lbl}>{tr.minThreshold}</label>
                <input type="number" step="0.01" className={inp} value={settings.thresholdPerKm} onChange={e => setSettings(s => ({ ...s, thresholdPerKm: +e.target.value }))} />
                <p className="text-xs text-gray-600 mt-1">{tr.thresholdHint}</p>
              </div>
              <div>
                <label className={lbl}>{tr.defaultFuel}</label>
                <input type="number" step="0.01" className={inp} value={settings.defaultFuelPrice} onChange={e => setSettings(s => ({ ...s, defaultFuelPrice: +e.target.value }))} />
                <p className="text-xs text-gray-600 mt-1">{tr.fuelHint}</p>
              </div>
              <div>
                <label className={lbl}>{tr.companyKm}</label>
                <input type="number" className={inp} value={settings.estimatedKmPerMonth} onChange={e => setSettings(s => ({ ...s, estimatedKmPerMonth: +e.target.value }))} />
                <p className="text-xs text-gray-600 mt-1">{tr.companyKmHint}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">{tr.companyFixed}</h3>
            <p className="text-xs text-gray-600 mb-4">{tr.companyFixedDesc}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {([
                ["salaries", tr.salaries],
                ["admin", tr.admin],
                ["rent", tr.rent],
                ["software", tr.software],
                ["other", tr.other],
              ] as [keyof Settings["companyFixedCosts"], string][]).map(([key, label]) => (
                <div key={key}>
                  <label className={lbl}>{label}</label>
                  <input type="number" className={inp} value={settings.companyFixedCosts[key] || ""} onChange={e => setFixed(key, +e.target.value)} placeholder="0" />
                </div>
              ))}
            </div>
            <div className="bg-[#1a1a0a] border border-[#3a3000] rounded-lg p-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">{tr.totalCompanyFixed}</div>
                <div className="text-xl font-bold text-[#f5a623]">{totalCompanyFixed.toLocaleString()} €</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">{tr.companyCostPerKm}</div>
                <div className="text-xl font-bold text-white">{costPerKm} €/km</div>
                <div className="text-xs text-gray-600 mt-0.5">{tr.includesFuel}</div>
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition disabled:opacity-50">
            {saving ? tr.saving : tr.saveSettings}
          </button>
        </div>
      </div>
    </div>
  );
}
