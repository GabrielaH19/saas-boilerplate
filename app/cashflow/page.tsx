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
import { useLang } from "@/app/lib/LanguageContext";

interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  tripId?: string;
  amount: number;
  paidAmount: number;
  issuedDate: string;
  dueDate: string;
  status: "unpaid" | "partial" | "paid" | "overdue";
  notes: string;
}

type InvoiceForm = Omit<Invoice, "id">;

const emptyInvoice = (): InvoiceForm => ({
  clientName: "",
  clientId: "",
  tripId: "",
  amount: 0,
  paidAmount: 0,
  issuedDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  status: "unpaid",
  notes: "",
});

function statusStyle(s: string) {
  if (s === "paid") return "bg-green-900 text-green-400 border-green-800";
  if (s === "partial") return "bg-blue-900 text-blue-400 border-blue-800";
  if (s === "overdue") return "bg-red-900 text-red-400 border-red-800";
  return "bg-[#1f1500] text-[#f5a623] border-yellow-800";
}

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

export default function CashflowPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<InvoiceForm>(emptyInvoice());
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { tr, locale } = useLang();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUserId(u.uid);
      await loadInvoices(u.uid);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loadInvoices = async (uid: string) => {
    const snap = await getDocs(query(collection(db, "invoices"), where("userId", "==", uid)));
    const today = new Date().toISOString().slice(0, 10);
    const list: Invoice[] = snap.docs.map(d => {
      const data = d.data() as Invoice;
      const status: Invoice["status"] = (data.status === "unpaid" && data.dueDate < today) ? "overdue" : data.status;
      return { ...data, id: d.id, status };
    });
    list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    setInvoices(list);
  };

  const handleSave = async () => {
    if (!userId) return;
    if (!form.clientName || !form.amount || !form.dueDate) {
      return alert(tr.clientFirm + ", " + tr.amount + ", " + tr.dueDate);
    }
    setSaving(true);
    try {
      const data: InvoiceForm = { ...form };
      if (editingId) {
        await updateDoc(doc(db, "invoices", editingId), { ...data, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "invoices"), { ...data, userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
      await loadInvoices(userId);
      setShowForm(false);
      setEditingId(null);
      setForm(emptyInvoice());
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleMarkPaid = async (invoice: Invoice) => {
    await updateDoc(doc(db, "invoices", invoice.id), { status: "paid" as Invoice["status"], paidAmount: invoice.amount, updatedAt: serverTimestamp() });
    if (userId) await loadInvoices(userId);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(tr.deleteConfirmInvoice)) return;
    await deleteDoc(doc(db, "invoices", id));
    if (userId) await loadInvoices(userId);
  };

  const handleEdit = (inv: Invoice) => {
    setForm({ clientName: inv.clientName, clientId: inv.clientId, tripId: inv.tripId || "", amount: inv.amount, paidAmount: inv.paidAmount, issuedDate: inv.issuedDate, dueDate: inv.dueDate, status: inv.status, notes: inv.notes });
    setEditingId(inv.id);
    setShowForm(true);
  };

  const statusLabel = (s: string) => {
    if (s === "paid") return tr.collected;
    if (s === "partial") return tr.partial;
    if (s === "overdue") return tr.overdueStatus;
    return tr.unpaid;
  };

  const unpaid = invoices.filter(i => i.status !== "paid");
  const totalReceivable = unpaid.reduce((s, i) => s + (i.amount - i.paidAmount), 0);
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0);
  const in14days = new Date();
  in14days.setDate(in14days.getDate() + 14);
  const dueSoon = unpaid.filter(i => i.dueDate <= in14days.toISOString().slice(0, 10));
  const dueSoonAmount = dueSoon.reduce((s, i) => s + (i.amount - i.paidAmount), 0);

  const inp = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]";
  const lbl = "block text-xs text-gray-400 mb-1";

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">{tr.loading}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="cashflow" />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold">{tr.cashflowTitle}</h2>
            <p className="text-gray-400 text-sm mt-1">{tr.cashflowSub}</p>
          </div>
          <button onClick={() => { setForm(emptyInvoice()); setEditingId(null); setShowForm(true); }} className="bg-[#f5a623] text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#e8951a] transition">
            {tr.addInvoiceBtn}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{tr.totalReceivable}</div>
            <div className="text-2xl font-bold text-green-400">{totalReceivable.toLocaleString()} €</div>
          </div>
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{tr.overdue}</div>
            <div className={`text-2xl font-bold ${totalOverdue > 0 ? "text-red-400" : "text-white"}`}>{totalOverdue.toLocaleString()} €</div>
          </div>
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{tr.dueSoon}</div>
            <div className={`text-2xl font-bold ${dueSoonAmount > 0 ? "text-[#f5a623]" : "text-white"}`}>{dueSoonAmount.toLocaleString()} €</div>
          </div>
        </div>

        {totalOverdue > 0 && (
          <div className="bg-red-900 bg-opacity-30 border border-red-800 rounded-xl px-5 py-4 mb-6">
            <div className="text-red-400 font-semibold mb-1">{tr.overdueAlert}</div>
            <div className="text-sm text-gray-400">{totalOverdue.toLocaleString()}€ {tr.overdueDesc}</div>
          </div>
        )}

        {invoices.length === 0 && !showForm ? (
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-12 text-center">
            <div className="text-4xl text-gray-600 mb-4">📄</div>
            <p className="text-gray-400 mb-2">{tr.noInvoiceYet}</p>
            <p className="text-gray-600 text-sm">{tr.noInvoiceDesc}</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
  {invoices.map(inv => {
    const days = daysUntil(inv.dueDate);
    return (
      <div key={inv.id} className="bg-[#161616] border border-[#2e2e2e] rounded-xl px-5 py-4 hover:bg-[#1a1a1a] transition">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="text-sm font-medium text-white">{inv.clientName}</div>
            {inv.notes && <div className="text-xs text-gray-500 mt-0.5">{inv.notes}</div>}
          </div>
          <span className={`text-xs px-2 py-1 rounded border font-semibold whitespace-nowrap ${statusStyle(inv.status)}`}>
            {statusLabel(inv.status)}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 mb-3 text-sm">
          <div>
            <div className="text-xs text-gray-500 mb-0.5">{tr.amountCol}</div>
            <div className="font-semibold text-white">{inv.amount.toLocaleString()} €</div>
            {inv.paidAmount > 0 && inv.paidAmount < inv.amount && (
              <div className="text-xs text-gray-500">{tr.collected}: {inv.paidAmount.toLocaleString()}€</div>
            )}
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-0.5">{tr.dueDateCol}</div>
            <div className="text-white">{inv.dueDate}</div>
            {inv.status !== "paid" && (
              <div className={`text-xs mt-0.5 ${days < 0 ? "text-red-400" : days <= 7 ? "text-[#f5a623]" : "text-gray-500"}`}>
                {days < 0 ? `${Math.abs(days)} ${tr.daysOverdue}` : days === 0 ? tr.dueToday : `${tr.daysLeft} ${days} ${locale === "it" ? "giorni" : "zile"}`}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {inv.status !== "paid" && (
            <button onClick={() => handleMarkPaid(inv)} className="text-xs text-green-400 hover:text-green-300 border border-green-800 px-2 py-1 rounded">
              {tr.markPaid}
            </button>
          )}
          <button onClick={() => handleEdit(inv)} className="text-xs text-gray-400 hover:text-white border border-[#2e2e2e] px-2 py-1 rounded">
            {tr.edit}
          </button>
          <button onClick={() => handleDelete(inv.id)} className="text-xs text-red-400 hover:text-red-300 border border-[#2e2e2e] px-2 py-1 rounded">
            ×
          </button>
        </div>
      </div>
    );
  })}
</div>
        )}

        {showForm && (
          <div className="bg-[#161616] border border-[#f5a623] rounded-xl p-6">
            <h3 className="font-semibold text-white mb-5">{editingId ? tr.editInvoice : tr.newInvoice}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className={lbl}>{tr.clientFirm}</label>
                <input className={inp} value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>{tr.amount}</label>
                <input type="number" className={inp} value={form.amount || ""} onChange={e => setForm(f => ({ ...f, amount: +e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>{tr.paidAmount}</label>
                <input type="number" className={inp} value={form.paidAmount || ""} onChange={e => setForm(f => ({ ...f, paidAmount: +e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>{tr.issueDate}</label>
                <input type="date" className={inp} value={form.issuedDate} onChange={e => setForm(f => ({ ...f, issuedDate: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>{tr.dueDate}</label>
                <input type="date" className={inp} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select className={inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Invoice["status"] }))}>
                  <option value="unpaid">{tr.unpaid}</option>
                  <option value="partial">{tr.partial}</option>
                  <option value="paid">{tr.collected}</option>
                  <option value="overdue">{tr.overdueStatus}</option>
                </select>
              </div>
              <div>
                <label className={lbl}>{tr.invoiceNotes}</label>
                <input className={inp} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="bg-[#f5a623] text-black font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-[#e8951a] transition disabled:opacity-50">
                {saving ? tr.saving : editingId ? tr.saveInvoice : tr.addInvoice}
              </button>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyInvoice()); }} className="text-gray-400 hover:text-white px-6 py-2.5 rounded-lg text-sm border border-[#2e2e2e]">
                {tr.cancel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



