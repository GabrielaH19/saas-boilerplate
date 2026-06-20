"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface ForecastData {
  expectedRevenue: number;
  estimatedExpenses: number;
  forecastedBalance: number;
  dailyBreakdown: { date: string; revenue: number; expenses: number; balance: number }[];
}

export default function CashflowForecast90({ userId }: { userId: string }) {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        // TODO: Replace "invoices" and "items" with your own Firestore collections
        const invoicesSnap = await getDocs(
          query(collection(db, "invoices"), where("userId", "==", userId))
        );

        const now = new Date();
        const ninetyDaysLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

        let expectedRevenue = 0;
        const invoices = invoicesSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

        invoices.forEach(invoice => {
          const dueDate = new Date(invoice.dueDate);
          if (dueDate >= now && dueDate <= ninetyDaysLater) {
            if (invoice.status === "unpaid" || invoice.status === "partial" || invoice.status === "overdue") {
              expectedRevenue += invoice.amount || 0;
            }
          }
        });

        // TODO: Replace with your own fixed cost logic
        const totalDailyFixedCosts = 0;
        const estimatedExpenses = totalDailyFixedCosts * 90;
        const forecastedBalance = expectedRevenue - estimatedExpenses;

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
          cumulativeBalance += dayRevenue - totalDailyFixedCosts;
          dailyBreakdown.push({ date: dateStr, revenue: dayRevenue, expenses: totalDailyFixedCosts, balance: cumulativeBalance });
        }

        setData({ expectedRevenue, estimatedExpenses, forecastedBalance, dailyBreakdown });
      } catch (err) {
        console.error("Error fetching forecast data:", err);
        setError("An error occurred while calculating the forecast.");
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [userId]);

  if (loading) return (
    <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
      <p className="text-gray-400">Loading forecast...</p>
    </div>
  );

  if (error) return (
    <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
      <p className="text-red-500">{error}</p>
    </div>
  );

  if (!data) return null;

  const isNegative = data.forecastedBalance < 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-2">90-Day Cashflow Forecast</h3>
        <p className="text-sm text-gray-400">Estimate for the next 90 days based on invoices and fixed costs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Expected Revenue</p>
          <p className="text-2xl font-bold text-green-400">+{data.expectedRevenue.toLocaleString()} €</p>
          <p className="text-xs text-gray-500 mt-2">{data.dailyBreakdown.filter(d => d.revenue > 0).length} days with revenue</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Estimated Expenses</p>
          <p className="text-2xl font-bold text-red-400">-{data.estimatedExpenses.toLocaleString()} €</p>
          <p className="text-xs text-gray-500 mt-2">{(data.estimatedExpenses / 90).toFixed(0)} € / day</p>
        </div>

        <div className={`rounded-lg p-4 border ${isNegative ? "bg-red-900 bg-opacity-20 border-red-700" : "bg-[#1a1a1a] border-[#2e2e2e]"}`}>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Forecasted Balance</p>
          <p className={`text-2xl font-bold ${isNegative ? "text-red-400" : "text-green-400"}`}>
            {data.forecastedBalance >= 0 ? "+" : ""}{data.forecastedBalance.toLocaleString()} €
          </p>
          {isNegative && <p className="text-xs text-red-400 mt-2">⚠️ Risk of cash flow blockage</p>}
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Daily Balance (every 10 days)</p>
        <div className="space-y-2">
          {data.dailyBreakdown
            .filter((_, i) => i % 10 === 0 || i === data.dailyBreakdown.length - 1)
            .map(day => {
              const maxBalance = Math.max(...data.dailyBreakdown.map(d => d.balance));
              const minBalance = Math.min(...data.dailyBreakdown.map(d => d.balance));
              const range = maxBalance - minBalance || 1;
              const percent = ((day.balance - minBalance) / range) * 100;
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-gray-500">{day.date}</div>
                  <div className="flex-1 bg-[#0d0d0d] rounded h-6 overflow-hidden">
                    <div className={`h-full ${day.balance >= 0 ? "bg-green-600" : "bg-red-600"}`} style={{ width: `${Math.max(1, percent)}%` }} />
                  </div>
                  <div className="w-24 text-right text-xs font-mono text-white">
                    {day.balance >= 0 ? "+" : ""}{day.balance.toLocaleString()} €
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
        <p className="text-xs text-blue-400">
          <strong>ℹ️ Info:</strong> Forecast is calculated based on invoices due in the next 90 days and daily fixed costs. Replace the Firestore collections with your own data structure.
        </p>
      </div>
    </div>
  );
}