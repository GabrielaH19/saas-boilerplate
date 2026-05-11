"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

interface ForecastData {
  expectedRevenue: number;
  estimatedExpenses: number;
  forecastedBalance: number;
  dailyBreakdown: { date: string; revenue: number; expenses: number; balance: number }[];
}

interface CashflowForecast90Props {
  userId: string;
}

export default function CashflowForecast90({ userId }: CashflowForecast90Props) {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        // Get all invoices for user
        const invoicesSnap = await getDocs(
          query(collection(db, "invoices"), where("userId", "==", userId))
        );

        // Get all trucks for user
        const trucksSnap = await getDocs(
          query(collection(db, "trucks"), where("userId", "==", userId))
        );

        // Calculate expected revenue (next 90 days)
        const now = new Date();
        const ninetyDaysLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

        let expectedRevenue = 0;
        const invoices = invoicesSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

        invoices.forEach(invoice => {
          const dueDate = new Date(invoice.dueDate);
          if (dueDate >= now && dueDate <= ninetyDaysLater) {
            // Include unpaid, partial, and overdue
            if (invoice.status === "unpaid" || invoice.status === "partial" || invoice.status === "overdue") {
              expectedRevenue += invoice.amount || 0;
            }
          }
        });

        // Calculate total daily fixed costs
        let totalDailyFixedCosts = 0;
        const trucks = trucksSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

        trucks.forEach(truck => {
          const fc = truck.fixedCosts || {};
          const total = (fc.leasing || 0) + (fc.insurance || 0) + (fc.maintenance || 0) + (fc.salary || 0) + (fc.other || 0);
          totalDailyFixedCosts += total / 30; // Daily cost
        });

        // Calculate 90-day expenses
        const estimatedExpenses = totalDailyFixedCosts * 90;

        // Calculate forecasted balance
        const forecastedBalance = expectedRevenue - estimatedExpenses;

        // Build daily breakdown
        const dailyBreakdown = [];
        let cumulativeBalance = 0;
        let revenueByDay: Record<string, number> = {};

        invoices.forEach(invoice => {
          const dueDate = new Date(invoice.dueDate).toISOString().split("T")[0];
          if (invoice.status === "unpaid" || invoice.status === "partial" || invoice.status === "overdue") {
            revenueByDay[dueDate] = (revenueByDay[dueDate] || 0) + (invoice.amount || 0);
          }
        });

        for (let i = 0; i < 90; i++) {
          const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
          const dateStr = date.toISOString().split("T")[0];
          const dayRevenue = revenueByDay[dateStr] || 0;
          const dayExpenses = totalDailyFixedCosts;
          cumulativeBalance += dayRevenue - dayExpenses;

          dailyBreakdown.push({
            date: dateStr,
            revenue: dayRevenue,
            expenses: dayExpenses,
            balance: cumulativeBalance,
          });
        }

        setData({
          expectedRevenue,
          estimatedExpenses,
          forecastedBalance,
          dailyBreakdown,
        });
      } catch (err) {
        console.error("Error fetching forecast data:", err);
        setError("A apărut o eroare la calcularea previziunii.");
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
        <p className="text-gray-400">Se încarcă previziunea...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const isNegative = data.forecastedBalance < 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Previziune cashflow 90 zile</h3>
        <p className="text-sm text-gray-400">
          Estimare pentru următoarele 90 zile pe baza facturilor și costurilor fixe.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Expected Revenue */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Venituri așteptate</p>
          <p className="text-2xl font-bold text-green-400">
            +{data.expectedRevenue.toLocaleString("ro-RO", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })} €
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {data.dailyBreakdown.filter(d => d.revenue > 0).length} zile cu venituri
          </p>
        </div>

        {/* Estimated Expenses */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Cheltuieli estimate</p>
          <p className="text-2xl font-bold text-red-400">
            -{data.estimatedExpenses.toLocaleString("ro-RO", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })} €
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {(data.estimatedExpenses / 90).toFixed(0)} € / zi
          </p>
        </div>

        {/* Forecasted Balance */}
        <div
          className={`rounded-lg p-4 border ${
            isNegative
              ? "bg-red-900 bg-opacity-20 border-red-700"
              : "bg-[#1a1a1a] border-[#2e2e2e]"
          }`}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Sold previzionat</p>
          <p
            className={`text-2xl font-bold ${
              isNegative ? "text-red-400" : "text-green-400"
            }`}
          >
            {data.forecastedBalance >= 0 ? "+" : ""}
            {data.forecastedBalance.toLocaleString("ro-RO", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })} €
          </p>
          {isNegative && (
            <p className="text-xs text-red-400 mt-2">
              ⚠️ Risc de blocaj de lichiditate
            </p>
          )}
        </div>
      </div>

      {/* Chart Alternative: Daily Balance Line (simplified text view) */}
      <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Evoluție zilnică (selecție)</p>
        <div className="space-y-2">
          {data.dailyBreakdown
            .filter((_, i) => i % 10 === 0 || i === data.dailyBreakdown.length - 1) // Every 10 days + last day
            .map((day, idx) => {
              const maxBalance = Math.max(...data.dailyBreakdown.map(d => d.balance));
              const minBalance = Math.min(...data.dailyBreakdown.map(d => d.balance));
              const range = maxBalance - minBalance || 1;
              const percent = ((day.balance - minBalance) / range) * 100;

              return (
                <div key={day.date} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-gray-500">{day.date}</div>
                  <div className="flex-1 bg-[#0d0d0d] rounded h-6 overflow-hidden relative">
                    <div
                      className={`h-full ${
                        day.balance >= 0 ? "bg-green-600" : "bg-red-600"
                      }`}
                      style={{ width: `${Math.max(1, percent)}%` }}
                    />
                  </div>
                  <div className="w-24 text-right text-xs font-mono text-white">
                    {day.balance >= 0 ? "+" : ""}
                    {day.balance.toLocaleString("ro-RO", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })} €
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
        <p className="text-xs text-blue-400">
          <strong>ℹ️ Info:</strong> Previziunea se calculează pe baza facturilor cu dueDate în următoarele 90
          zile și costurilor fixe zilnice din profilul camioanelor.
        </p>
      </div>
    </div>
  );
}
