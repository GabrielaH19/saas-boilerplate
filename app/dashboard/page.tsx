"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import AppNav from "@/app/components/AppNav";
import ReferralBanner from "@/app/components/ReferralBanner";
import { usePlan } from "@/app/lib/usePlan";

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  date: string;
  status: "success" | "warning" | "danger";
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const router = useRouter();
  const { plan, isTrialing } = usePlan();

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }

      const userDoc = await getDoc(doc(db, "users", u.uid));
      if (userDoc.exists() && userDoc.data()?.onboardingCompleted === false) {
        router.push("/onboarding");
        return;
      }

      setUserName(u.email || "");

      // Replace this with your own Firestore collection
      const snap = await getDocs(query(collection(db, "items"), where("userId", "==", u.uid)));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityItem));
      setActivity(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="dashboard" />

      {!isTrialing && plan === "free" && (
        <div className="bg-[#1a0a00] border-b border-[#f5a623]/30 px-6 py-3 flex items-center justify-between">
          <p className="text-sm text-[#f5a623]">
            ⚠️ Your free trial has expired. Some features are disabled.
          </p>
          <Link href="/pricing" className="bg-[#f5a623] text-black text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-[#e8951a] transition whitespace-nowrap ml-4">
            Upgrade now
          </Link>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">{userName} · {currentMonth}</p>
          </div>
          <Link href="/new" className="bg-[#f5a623] text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#e8951a] transition">
            + New Item
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Revenue", value: "€0", color: "text-green-400" },
            { label: "Active Users", value: "0", color: "text-white" },
            { label: "This Month", value: "0", color: "text-[#f5a623]" },
            { label: "Pending", value: "€0", color: "text-[#f5a623]" },
          ].map((m, i) => (
            <div key={i} className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{m.label}</div>
              <div className={`text-2xl font-bold font-mono ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider">Recent Activity</h3>
            <Link href="/history" className="text-xs text-[#f5a623] hover:underline">View all →</Link>
          </div>
          {activity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-3">No activity yet.</p>
              <Link href="/new" className="bg-[#f5a623] text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#e8951a] transition">
                + Add your first item
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {activity.slice(0, 6).map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#1e1e1e] last:border-0">
                  <div>
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.date} · {item.subtitle}</div>
                  </div>
                  <div className="text-sm font-bold text-green-400">{item.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 max-w-6xl mx-auto px-4"><ReferralBanner /></div>
    </div>
  );
}