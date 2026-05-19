"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, query, where, getDocs,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";
import AppNav from "@/app/components/AppNav";
import ReferralBanner from "@/app/components/ReferralBanner";
import { useLang } from "../lib/LanguageContext";
import { usePlan } from "../lib/usePlan";
import PaywallModal from "@/app/components/PaywallModal";

interface Client {
  id: string;
  name: string;
  paymentTermDays: number;
  notes: string;
  isActive: boolean;
  totalProfit?: number;
  avgRevenuePerKm?: number;
  tripCount?: number;
  score?: number;
}

const emptyClient = () => ({ name: "", paymentTermDays: 30, notes: "", isActive: true });

function calcScore(profit: number, avgKm: number, paymentDays: number): number {
  let score = 5;
  if (avgKm >= 1.6) score += 2;
  else if (avgKm >= 1.4) score += 1;
  else if (avgKm < 1.2) score -= 2;
  else if (avgKm < 1.3) score -= 1;
  if (paymentDays <= 30) score += 2;
  else if (paymentDays <= 60) score += 0;
  else if (paymentDays <= 90) score -= 1;
  else score -= 2;
  if (profit > 5000) score += 1;
  else if (profit < 0) score -= 2;
  return Math.max(1, Math.min(10, score));
}

function scoreColor(s: number) {
  if (s >= 7) return "text-green-400 bg-green-900";
  if (s >= 4) return "text-[#f5a623] bg-[#1f1500]";
  return "text-red-400 bg-red-900";
}

export default function ClientsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyClient());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const { tr } = useLang();
  const { limits, loading: planLoading } = usePlan();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUserId(u.uid);
      await loadClients(u.uid);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (!limits.hasClients && !planLoading) {
    return (
      <>
        <div className="min-h-screen bg-[#0d0d0d]">
          <AppNav active="clients" />
        </div>
        <PaywallModal
          feature="Clienti & scoring"
          requiredPlan="Pro"
          onClose={() => router.push("/dashboard")}
        />
      </>
    );
  }

  const loadClients = async (uid: string) => {
    const cSnap = await getDocs(query(collection(db, "clients"), where("userId", "==", uid)));
    const tSnap = await getDocs(query(collection(db, "trips"), where("userId", "==", uid)));
    const trips = tSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    const list: Client[] = cSnap.docs.map(d => {
      const data = d.data();
      const clientTrips = trips.filter((t: any) => t.clientId === d.id);
      const totalProfit = clientTrips.reduce((sum: number, t: any) => sum + (t.results?.profit || 0), 0);
      const totalKm = clientTrips.reduce((sum: number, t: any) => sum + (t.inputs?.loadedKm || 0), 0);
      const totalRevenue = clientTrips.reduce((sum: number, t: any) => sum + (t.inputs?.revenue || 0), 0);
      const avgRevenuePerKm = totalKm > 0 ? totalRevenue / totalKm : 0;
      const tripCount = clientTrips.length;
      const score = tripCount > 0 ? calcScore(totalProfit, avgRevenuePerKm, data.paymentTermDays) : undefined;
      return { id: d.id, name: data.name, paymentTermDays: data.paymentTermDays, notes: data.notes, isActive: data.isActive, totalProfit, avgRevenuePerKm, tripCount, score };
    });
    list.sort((a, b) => (b.totalProfit || 0) - (a.totalProfit || 0));
    setClients(list);
  };

  const handleSave = async () => {
    if (!userId) return;
    if (!form.name) return alert("Completeaza numele clientului.");
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "clients", editingId), { ...form, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "clients"), { ...form, userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
      await loadClients(userId);
      setShowForm(false);
      setEditingId(null);
      setForm(emptyClient());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleEdit = (client: Client) => {
    setForm({ name: client.name, paymentTermDays: client.paymentTermDays, notes: client.notes, isActive: client.isActive });
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr.deleteConfirmClient)) return;
    await deleteDoc(doc(db, "clients", id));
    if (userId) await loadClients(userId);
  };

  const scoreLabel = (s: number) => s >= 7 ? tr.scoreGood : s >= 4 ? tr.scoreMedium : tr.scoreBad;

  const inp = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]";
  const lbl = "block text-xs text-gray-400 mb-1";

  if (loading) return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center"><p className="text-gray-400">{tr.loading}</p></div>;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="clients" />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{tr.clientsTitle}</h2>
            <p className="text-gray-400 text-sm mt-1">{tr.clientsSub}</p>
          </div>
          <button onClick={() => { setForm(emptyClient()); setEditingId(null); setShowForm(true); }} className="bg-[#f5a623] text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#e8951a] transition">
            {tr.addClientBtn}
          </button>
        </div>

        {saved && (
          <div className="bg-green-900 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">{tr.clientSaved}</div>
        )}

        {clients.length === 0 && !showForm && (
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-12 text-center">
            <div className="text-gray-500 text-4xl mb-4">👥</div>
            <p className="text-gray-400 mb-2">{tr.noClientYet}</p>
            <p className="text-gray-600 text-sm">{tr.noClientDesc}</p>
          </div>
        )}

        <div className="space-y-3 mb-8">
          {clients.map(client => (
            <div key={client.id} className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-white">{client.name}</span>
                    {client.score !== undefined && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scoreColor(client.score)}`}>
                        {client.score}/10 — {scoreLabel(client.score)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {tr.paymentTerm}: {client.paymentTermDays} {tr.days}
                    {client.tripCount !== undefined && client.tripCount > 0 && (
                      <> · {client.tripCount} {tr.tripsCount} · {client.avgRevenuePerKm?.toFixed(2)} {tr.avgKmLabel}</>
                    )}
                    {client.notes && <> · {client.notes}</>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {client.tripCount !== undefined && client.tripCount > 0 && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{tr.totalProfitLabel}</div>
                      <div className={`text-lg font-bold ${client.totalProfit! >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {client.totalProfit! >= 0 ? "+" : ""}{client.totalProfit?.toLocaleString()} €
                      </div>
                    </div>
                  )}
                  {client.tripCount === 0 && <div className="text-xs text-gray-600">{tr.noTripsYet}</div>}
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(client)} className="text-xs text-gray-400 hover:text-white border border-[#2e2e2e] px-3 py-1.5 rounded-lg">{tr.edit}</button>
                    <button onClick={() => handleDelete(client.id)} className="text-xs text-red-400 hover:text-red-300 border border-[#2e2e2e] px-3 py-1.5 rounded-lg">{tr.delete}</button>
                  </div>
                </div>
              </div>
              {client.score !== undefined && client.score <= 3 && (
                <div className="mt-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg px-3 py-2 text-xs text-red-400">{tr.alertDanger}</div>
              )}
              {client.score !== undefined && client.score >= 4 && client.score <= 5 && client.paymentTermDays > 60 && (
                <div className="mt-3 bg-yellow-900 bg-opacity-30 border border-yellow-800 rounded-lg px-3 py-2 text-xs text-[#f5a623]">{tr.alertSlow}</div>
              )}
            </div>
          ))}
        </div>

        {showForm && (
          <div className="bg-[#161616] border border-[#f5a623] rounded-xl p-6">
            <h3 className="font-semibold text-white mb-5">{editingId ? tr.editClient : tr.newClient}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className={lbl}>{tr.clientName}</label>
                <input className={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="ex: Trans Logistics SRL" />
              </div>
              <div>
                <label className={lbl}>{tr.paymentDays}</label>
                <input type="number" className={inp} value={form.paymentTermDays} onChange={e => setForm(f => ({ ...f, paymentTermDays: +e.target.value }))} placeholder="30" />
              </div>
              <div>
                <label className={lbl}>{tr.notes}</label>
                <input className={inp} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="ex: plateste mereu cu intarziere" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="bg-[#f5a623] text-black font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-[#e8951a] transition disabled:opacity-50">
                {saving ? tr.saving : editingId ? tr.saveChanges : tr.addClientBtn}
              </button>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyClient()); }} className="text-gray-400 hover:text-white px-6 py-2.5 rounded-lg text-sm border border-[#2e2e2e]">
                {tr.cancel}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 px-4 max-w-6xl mx-auto"><ReferralBanner /></div>
    </div>
  );
}
