"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection, query, where, getDocs,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";
import Link from "next/link";
import AppNav from "@/app/components/AppNav";

interface Truck {
  id: string;
  name: string;
  plate: string;
  consumption: number;
  estimatedKmPerMonth: number;
  fixedCosts: {
    leasing: number;
    insurance: number;
    maintenance: number;
    salary: number;
    other: number;
  };
  isActive: boolean;
}

const emptyTruck = (): Omit<Truck, "id"> => ({
  name: "",
  plate: "",
  consumption: 0,
  estimatedKmPerMonth: 0,
  fixedCosts: { leasing: 0, insurance: 0, maintenance: 0, salary: 0, other: 0 },
  isActive: true,
});

export default function TrucksPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyTruck());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUserId(u.uid);
      await loadTrucks(u.uid);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loadTrucks = async (uid: string) => {
    const q = query(collection(db, "trucks"), where("userId", "==", uid));
    const snap = await getDocs(q);
    const list: Truck[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Truck));
    setTrucks(list);
  };

  const totalFixed = (t: typeof form) =>
    t.fixedCosts.leasing + t.fixedCosts.insurance + t.fixedCosts.maintenance +
    t.fixedCosts.salary + t.fixedCosts.other;

  const costPerKm = (t: typeof form) => {
    const km = t.estimatedKmPerMonth;
    if (!km) return 0;
    const fixed = totalFixed(t) / km;
    const fuel = (t.consumption / 100) * 1.68;
    return fixed + fuel;
  };

  const handleSave = async () => {
    if (!userId) return;
    if (!form.name || !form.plate) return alert("Completează cel puțin numele și numărul de înmatriculare.");
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "trucks", editingId), {
          ...form,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "trucks"), {
          ...form,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await loadTrucks(userId);
      setShowForm(false);
      setEditingId(null);
      setForm(emptyTruck());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleEdit = (truck: Truck) => {
    setForm({
      name: truck.name,
      plate: truck.plate,
      consumption: truck.consumption,
      estimatedKmPerMonth: truck.estimatedKmPerMonth,
      fixedCosts: { ...truck.fixedCosts },
      isActive: truck.isActive,
    });
    setEditingId(truck.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ești sigur că vrei să ștergi acest camion?")) return;
    await deleteDoc(doc(db, "trucks", id));
    if (userId) await loadTrucks(userId);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const setFixed = (key: keyof typeof form.fixedCosts, val: number) => {
    setForm(f => ({ ...f, fixedCosts: { ...f.fixedCosts, [key]: val } }));
  };

  const inp = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]";
  const lbl = "block text-xs text-gray-400 mb-1";

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">Se încarcă...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* NAV */}
      <AppNav active="truck" />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Camioane</h2>
            <p className="text-gray-400 text-sm mt-1">Costurile per camion sunt folosite în calculul fiecărei curse.</p>
          </div>
          <button
            onClick={() => { setForm(emptyTruck()); setEditingId(null); setShowForm(true); }}
            className="bg-[#f5a623] text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#e8951a] transition"
          >
            + Adaugă camion
          </button>
        </div>

        {saved && (
          <div className="bg-green-900 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
            ✓ Camionul a fost salvat!
          </div>
        )}

        {/* LISTA CAMIOANE */}
        {trucks.length === 0 && !showForm && (
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-12 text-center">
            <div className="text-gray-500 text-4xl mb-4">🚛</div>
            <p className="text-gray-400 mb-2">Nu ai adăugat niciun camion încă.</p>
            <p className="text-gray-600 text-sm">Adaugă primul camion pentru a putea calcula curse.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 mb-8">
          {trucks.map(truck => {
            const total = truck.fixedCosts.leasing + truck.fixedCosts.insurance +
              truck.fixedCosts.maintenance + truck.fixedCosts.salary + truck.fixedCosts.other;
            const cpk = truck.estimatedKmPerMonth > 0
              ? ((total / truck.estimatedKmPerMonth) + (truck.consumption / 100) * 1.68).toFixed(2)
              : "—";

            return (
              <div key={truck.id} className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-semibold text-white">{truck.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{truck.plate} · {truck.consumption} l/100km · {truck.estimatedKmPerMonth.toLocaleString()} km/lună</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Cost total/lună</div>
                      <div className="text-lg font-bold text-[#f5a623]">{total.toLocaleString()} €</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Cost real/km</div>
                      <div className="text-lg font-bold text-white">{cpk} €</div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleEdit(truck)} className="text-xs text-gray-400 hover:text-white border border-[#2e2e2e] px-3 py-1.5 rounded-lg">
                        Editează
                      </button>
                      <button onClick={() => handleDelete(truck.id)} className="text-xs text-red-400 hover:text-red-300 border border-[#2e2e2e] px-3 py-1.5 rounded-lg">
                        Șterge
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-3 text-xs">
                  {[
                    ["Leasing", truck.fixedCosts.leasing],
                    ["Asigurare", truck.fixedCosts.insurance],
                    ["Mentenanță", truck.fixedCosts.maintenance],
                    ["Salariu șofer", truck.fixedCosts.salary],
                    ["Altele", truck.fixedCosts.other],
                  ].map(([label, val]) => (
                    <div key={label as string} className="bg-[#1f1f1f] rounded-lg p-3">
                      <div className="text-gray-500 mb-1">{label}</div>
                      <div className="font-semibold text-white">{(val as number).toLocaleString()} €</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FORM ADAUGARE/EDITARE */}
        {showForm && (
          <div className="bg-[#161616] border border-[#f5a623] rounded-xl p-6">
            <h3 className="font-semibold text-white mb-6">
              {editingId ? "Editează camion" : "Camion nou"}
            </h3>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* DATE CAMION */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Date camion</p>
                <div className="space-y-3">
                  <div>
                    <label className={lbl}>Nume / identificator</label>
                    <input className={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="ex: Volvo B-01 PLT" />
                  </div>
                  <div>
                    <label className={lbl}>Număr înmatriculare</label>
                    <input className={inp} value={form.plate} onChange={e => setForm(f => ({ ...f, plate: e.target.value }))} placeholder="B 123 ABC" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Consum mediu (l/100km)</label>
                      <input type="number" className={inp} value={form.consumption || ""} onChange={e => setForm(f => ({ ...f, consumption: +e.target.value }))} placeholder="32" />
                    </div>
                    <div>
                      <label className={lbl}>Km estimați / lună</label>
                      <input type="number" className={inp} value={form.estimatedKmPerMonth || ""} onChange={e => setForm(f => ({ ...f, estimatedKmPerMonth: +e.target.value }))} placeholder="9500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* COSTURI FIXE */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Costuri fixe lunare (€)</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Leasing / rată</label>
                      <input type="number" className={inp} value={form.fixedCosts.leasing || ""} onChange={e => setFixed("leasing", +e.target.value)} placeholder="1200" />
                    </div>
                    <div>
                      <label className={lbl}>Asigurare</label>
                      <input type="number" className={inp} value={form.fixedCosts.insurance || ""} onChange={e => setFixed("insurance", +e.target.value)} placeholder="400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Mentenanță</label>
                      <input type="number" className={inp} value={form.fixedCosts.maintenance || ""} onChange={e => setFixed("maintenance", +e.target.value)} placeholder="300" />
                    </div>
                    <div>
                      <label className={lbl}>Salariu șofer</label>
                      <input type="number" className={inp} value={form.fixedCosts.salary || ""} onChange={e => setFixed("salary", +e.target.value)} placeholder="2000" />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Altele</label>
                    <input type="number" className={inp} value={form.fixedCosts.other || ""} onChange={e => setFixed("other", +e.target.value)} placeholder="200" />
                  </div>

                  {/* PREVIEW CALCUL */}
                  <div className="bg-[#1a1a0a] border border-[#3a3000] rounded-lg p-3 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">Total costuri fixe / lună</span>
                      <span className="text-[#f5a623] font-semibold">{totalFixed(form).toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Cost real per km (cu combustibil)</span>
                      <span className="text-white font-semibold">
                        {form.estimatedKmPerMonth > 0
                          ? `${costPerKm(form).toFixed(2)} €/km`
                          : "— (adaugă km/lună)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#f5a623] text-black font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-[#e8951a] transition disabled:opacity-50"
              >
                {saving ? "Se salvează..." : editingId ? "Salvează modificările" : "Adaugă camion"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyTruck()); }}
                className="text-gray-400 hover:text-white px-6 py-2.5 rounded-lg text-sm border border-[#2e2e2e]"
              >
                Anulează
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

