"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import AppNav from "@/app/components/AppNav";
import CashflowForecast90 from "@/app/components/CashflowForecast90";
import { useLang } from "@/app/lib/LanguageContext";

interface Invoice {
  id: string;
  clientName?: string;
  clientId: string;
  amount: number;
  paidAmount?: number;
  dueDate: string;
  status: string;
  issueDate: string;
  notes?: string;
}

export default function CashflowPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userPlan, setUserPlan] = useState<string>("");
  const router = useRouter();
  const { tr, locale } = useLang();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", u.uid));
      if (userDoc.exists() && userDoc.data()?.onboardingCompleted === false) {
        router.push("/onboarding");
        return;
      }

      setUserId(u.uid);
      setUserPlan(userDoc.data()?.plan || "free");

      const iSnap = await getDocs(
        query(collection(db, "invoices"), where("userId", "==", u.uid))
      );
      const invoiceData = iSnap.docs
        .map((d) => ({ id: d.id, ...d.data() } as Invoice))
        .sort((a, b) => (b.dueDate || "").localeCompare(a.dueDate || ""));

      setInvoices(invoiceData);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const today = new Date().toISOString().slice(0, 10);
  const overdueInvoices = invoices.filter(
    (i) => i.status !== "paid" && i.dueDate < today
  );
  const upcomingInvoices = invoices.filter(
    (i) => i.status !== "paid" && i.dueDate >= today
  );

  const totalReceivable = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + ((i.amount || 0) - (i.paidAmount || 0)), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d]">
        <AppNav />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-gray-400">{tr.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <AppNav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {tr.cashflowTitle}
          </h1>
          <p className="text-gray-400">{tr.cashflowSub}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Receivable */}
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              {tr.totalReceivable}
            </p>
            <p className="text-3xl font-bold text-white">
              {totalReceivable.toLocaleString(locale === "it" ? "it-IT" : "ro-RO", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })} €
            </p>
          </div>

          {/* Overdue */}
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              {tr.overdue}
            </p>
            <p className="text-3xl font-bold text-red-400">
              {overdueInvoices.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {overdueInvoices
                .reduce((sum, i) => sum + (i.amount || 0), 0)
                .toLocaleString(locale === "it" ? "it-IT" : "ro-RO", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{" "}
              €
            </p>
          </div>

          {/* Due Soon */}
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              {tr.dueSoon}
            </p>
            <p className="text-3xl font-bold text-orange-400">
              {upcomingInvoices.length}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {upcomingInvoices
                .reduce((sum, i) => sum + (i.amount || 0), 0)
                .toLocaleString(locale === "it" ? "it-IT" : "ro-RO", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{" "}
              €
            </p>
          </div>
        </div>

        {/* 90-Day Forecast (Premium only) */}
        {userPlan === "premium" && (
          <div className="mb-8">
            <CashflowForecast90 userId={userId} />
          </div>
        )}

        {/* Invoices List */}
        <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            {tr.allInvoices || "Toate facturile"}
          </h2>

          {invoices.length === 0 ? (
            <p className="text-gray-400">{tr.noInvoiceYet}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2e2e2e]">
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">
                      {tr.clientFirm}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">
                      {tr.issueDate}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">
                      {tr.dueDateCol}
                    </th>
                    <th className="text-right py-3 px-4 text-gray-500 font-semibold">
                      {tr.amount}
                    </th>
                    <th className="text-right py-3 px-4 text-gray-500 font-semibold">
                      {tr.paidAmount}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-500 font-semibold">
                      {tr.statusCol}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const statusColor =
                      inv.status === "paid"
                        ? "text-green-400"
                        : inv.status === "overdue"
                          ? "text-red-400"
                          : "text-orange-400";
                    const remaining = (inv.amount || 0) - (inv.paidAmount || 0);

                    return (
                      <tr
                        key={inv.id}
                        className="border-b border-[#1e1e1e] hover:bg-[#1a1a1a] transition"
                      >
                        <td className="py-3 px-4 text-white">
                          {inv.clientName || "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {inv.issueDate}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {inv.dueDate}
                        </td>
                        <td className="py-3 px-4 text-right text-white font-mono">
                          {(inv.amount || 0).toLocaleString(
                            locale === "it" ? "it-IT" : "ro-RO"
                          )}{" "}
                          €
                        </td>
                        <td className="py-3 px-4 text-right text-white font-mono">
                          {(inv.paidAmount || 0).toLocaleString(
                            locale === "it" ? "it-IT" : "ro-RO"
                          )}{" "}
                          €
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded text-xs font-semibold ${statusColor}`}
                          >
                            {inv.status === "paid"
                              ? "Plătit"
                              : inv.status === "overdue"
                                ? "Întârziat"
                                : inv.status === "partial"
                                  ? "Parțial"
                                  : "Neachitat"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Invoice Button */}
        <div className="mt-6">
          <Link
            href="/cashflow?action=add"
            className="inline-block bg-[#f5a623] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#e59512] transition"
          >
            {tr.addInvoiceBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
