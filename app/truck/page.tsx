"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useLang } from "../lib/LanguageContext";
import LangSwitcher from "../lib/LangSwitcher";

export default function TruckPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const { tr } = useLang();

  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [euro, setEuro] = useState("Euro 6");
  const [consumption, setConsumption] = useState("");
  const [tank, setTank] = useState("");
  const [lease, setLease] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [vignette, setVignette] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [otherFixed, setOtherFixed] = useState(0);

  const totalFixed = lease + insurance + vignette + maintenance + otherFixed;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      const snap = await getDoc(doc(db, "trucks", u.uid));
      if (snap.exists()) {
        const d = snap.data();
        setPlate(d.plate || "");
        setBrand(d.brand || "");
        setModel(d.model || "");
        setYear(d.year || "");
        setEuro(d.euro || "Euro 6");
        setConsumption(d.consumption || "");
        setTank(d.tank || "");
        setLease(d.lease || 0);
        setInsurance(d.insurance || 0);
        setVignette(d.vignette || 0);
        setMaintenance(d.maintenance || 0);
        setOtherFixed(d.otherFixed || 0);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const saveTruck = async () => {
    const user = auth.currentUser;
    if (!user) return;
    await setDoc(doc(db, "trucks", user.uid), {
      plate, brand, model, year, euro, consumption, tank,
      lease, insurance, vignette, maintenance, otherFixed,
      updatedAt: new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const inputClass = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#f5a623]";
  const labelClass = "block text-xs text-gray-400 mb-1";

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">{tr.loading}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="bg-[#161616] border-b border-[#2e2e2e] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/dashboard" className="hover:text-white">{tr.dashboard}</Link>
          <Link href="/trip/new" className="hover:text-white">{tr.newTrip}</Link>
          <Link href="/history" className="hover:text-white">{tr.history}</Link>
          <Link href="/report" className="hover:text-white">{tr.report}</Link>
          <Link href="/truck" className="text-white">{tr.truck}</Link><Link href="/pricing" className="hover:text-white">Prețuri</Link>
          <button onClick={handleLogout} className="hover:text-white">{tr.logout}</button>
        </div>
        <LangSwitcher />
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">{tr.truckTitle}</h2>
        <p className="text-gray-400 mb-8">{tr.truckSub}</p>

        {saved && <div className="bg-green-900 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-6">{tr.profileSaved}</div>}

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.truckTitle}</h3>
            <div className="space-y-3">
              <div><label className={labelClass}>{tr.plate}</label><input className={inputClass} value={plate} onChange={e=>setPlate(e.target.value)} placeholder="B 123 ABC" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>{tr.brand}</label><input className={inputClass} value={brand} onChange={e=>setBrand(e.target.value)} placeholder="Volvo" /></div>
                <div><label className={labelClass}>{tr.model}</label><input className={inputClass} value={model} onChange={e=>setModel(e.target.value)} placeholder="FH16" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>{tr.year}</label><input className={inputClass} value={year} onChange={e=>setYear(e.target.value)} placeholder="2020" /></div>
                <div><label className={labelClass}>{tr.euroClass}</label>
                  <select className={inputClass} value={euro} onChange={e=>setEuro(e.target.value)}>
                    {["Euro 6","Euro 5","Euro 4","Euro 3"].map(e=><option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>{tr.consumption}</label><input type="number" step="0.1" className={inputClass} value={consumption} onChange={e=>setConsumption(e.target.value)} placeholder="28.5" /></div>
                <div><label className={labelClass}>{tr.tank}</label><input type="number" className={inputClass} value={tank} onChange={e=>setTank(e.target.value)} placeholder="700" /></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">{tr.totalFixed}</h3>
              <div className="space-y-3">
                <div><label className={labelClass}>{tr.lease}</label><input type="number" className={inputClass} value={lease} onChange={e=>setLease(+e.target.value)} placeholder="1200" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>{tr.insurance}</label><input type="number" className={inputClass} value={insurance} onChange={e=>setInsurance(+e.target.value)} placeholder="350" /></div>
                  <div><label className={labelClass}>{tr.vignette}</label><input type="number" className={inputClass} value={vignette} onChange={e=>setVignette(+e.target.value)} placeholder="80" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>{tr.maintenance}</label><input type="number" className={inputClass} value={maintenance} onChange={e=>setMaintenance(+e.target.value)} placeholder="200" /></div>
                  <div><label className={labelClass}>{tr.otherFixed}</label><input type="number" className={inputClass} value={otherFixed} onChange={e=>setOtherFixed(+e.target.value)} placeholder="100" /></div>
                </div>
                <div className="bg-[#1f1f1f] rounded-lg p-4 mt-2">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{tr.totalFixed}</div>
                  <div className="text-2xl font-bold font-mono text-[#f5a623]">{totalFixed.toFixed(0)} €</div>
                </div>
              </div>
            </div>
            <button onClick={saveTruck} className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition">
              {tr.saveProfile}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}