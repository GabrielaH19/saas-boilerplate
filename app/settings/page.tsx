"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

interface Settings {
  thresholdPerKm: number;
  defaultFuelPrice: number;
  estimatedKmPerMonth: number;
  companyFixedCosts: {
    salaries: number;
    admin: number;
    rent: number;
    software: number;
    other: number;
  };
  currency: string;
}

const defaultSettings = (): Settings => ({
  thresholdPerKm: 1.30,
  defaultFuelPrice: 1.68,
  estimatedKmPerMonth: 9500,
  companyFixedCosts: {
    salaries: 0,
    admin: 0,
    rent: 0,
    software: 0,
    other: 0,
  },
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
        setDoc(doc(db, "settings", userId), {
          ...settings,
          userId,
          updatedAt: serverTimestamp(),
        }, { merge: true }),
        setDoc(doc(db, "users", userId), {
          name: userName,
          companyName,
          updatedAt: serverTimestamp(),
        }, { merge: true }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const setFixed = (key: keyof Settings["companyFixedCosts"], val: number) => {
    setSettings(s => ({
      ...s,
      companyFixedCosts: { ...s.companyFixedCosts, [key]: val },
    }));
  };

  const totalCompanyFixed = Object.values(settings.companyFixedCosts).reduce((a, b) => a + b, 0);
  const costPerKm = settings.estimatedKmPerMonth > 0
    ? ((settings.defaultFuelPrice * 0.32) + totalCompanyFixed / settings.estimatedKmPerMonth).toFixed(2)
    : "—";

  const inp = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]";
  const lbl = "block text-xs text-gray-400 mb-1";

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">Se încarcă...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="bg-[#161616] border-b border-[#2e2e2e] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link href="/trip/new" className="hover:text-white">Cursă nouă</Link>
          <Link href="/history" className="hover:text-white">Istoric</Link>
          <Link href="/clients" className="hover:text-white">Clienți</Link>
          <Link href="/cashflow" className="hover:text-white">Cashflow</Link>
          <Link href="/truck" className="hover:text-white">Camioane</Link>
          <Link href="/settings" className="text-white">Setări</Link>
          <button onClick={handleLogout} className="hover:text-white">Ieși</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">Setări firmă</h2>
        <p className="text-gray-400 text-sm mb-8">
          Costurile și pragurile de aici sunt folosite în toate calculele.
        </p>

        {saved && (
          <div className="bg-green-900 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
            ✓ Setările au fost salvate!
          </div>
        )}

        <div className="space-y-6">

          {/* DATE FIRMA */}
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Date firmă</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Numele tău</label>
                <input className={inp} value={userName} onChange={e => setUserName(e.target.value)} placeholder="Ion Ionescu" />
              </div>
              <div>
                <label className={lbl}>Numele firmei</label>
                <input className={inp} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ionescu Trans SRL" />
              </div>
            </div>
          </div>

          {/* SETARI CALCUL */}
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Setări calcul</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={lbl}>Prag minim acceptat (€/km)</label>
                <input
                  type="number"
                  step="0.01"
                  className={inp}
                  value={settings.thresholdPerKm}
                  onChange={e => setSettings(s => ({ ...s, thresholdPerKm: +e.target.value }))}
                />
                <p className="text-xs text-gray-600 mt-1">Sub acest prag → REFUZĂ</p>
              </div>
              <div>
                <label className={lbl}>Preț motorină implicit (€/l)</label>
                <input
                  type="number"
                  step="0.01"
                  className={inp}
                  value={settings.defaultFuelPrice}
                  onChange={e => setSettings(s => ({ ...s, defaultFuelPrice: +e.target.value }))}
                />
                <p className="text-xs text-gray-600 mt-1">Pre-completat în calculator</p>
              </div>
              <div>
                <label className={lbl}>Km estimați / lună (firmă)</label>
                <input
                  type="number"
                  className={inp}
                  value={settings.estimatedKmPerMonth}
                  onChange={e => setSettings(s => ({ ...s, estimatedKmPerMonth: +e.target.value }))}
                />
                <p className="text-xs text-gray-600 mt-1">Toată flota combinată</p>
              </div>
            </div>
          </div>

          {/* COSTURI FIXE FIRMA */}
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Costuri fixe firmă (€/lună)</h3>
            <p className="text-xs text-gray-600 mb-4">
              Costuri care nu țin de un camion anume — birou, contabilitate, software, etc.
              Costurile per camion le setezi în pagina Camioane.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={lbl}>Salarii personal birou</label>
                <input
                  type="number"
                  className={inp}
                  value={settings.companyFixedCosts.salaries || ""}
                  onChange={e => setFixed("salaries", +e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={lbl}>Administrație / contabilitate</label>
                <input
                  type="number"
                  className={inp}
                  value={settings.companyFixedCosts.admin || ""}
                  onChange={e => setFixed("admin", +e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={lbl}>Chirie birou / depozit</label>
                <input
                  type="number"
                  className={inp}
                  value={settings.companyFixedCosts.rent || ""}
                  onChange={e => setFixed("rent", +e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={lbl}>Software / abonamente</label>
                <input
                  type="number"
                  className={inp}
                  value={settings.companyFixedCosts.software || ""}
                  onChange={e => setFixed("software", +e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={lbl}>Altele</label>
                <input
                  type="number"
                  className={inp}
                  value={settings.companyFixedCosts.other || ""}
                  onChange={e => setFixed("other", +e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* SUMMARY */}
            <div className="bg-[#1a1a0a] border border-[#3a3000] rounded-lg p-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Total costuri fixe firmă / lună</div>
                <div className="text-xl font-bold text-[#f5a623]">{totalCompanyFixed.toLocaleString()} €</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Cost firmă per km (estimat)</div>
                <div className="text-xl font-bold text-white">{costPerKm} €/km</div>
                <div className="text-xs text-gray-600 mt-0.5">include combustibil la 32l/100km</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition disabled:opacity-50"
          >
            {saving ? "Se salvează..." : "Salvează setările"}
          </button>
        </div>
      </div>
    </div>
  );
}