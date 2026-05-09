"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getUserPlan, getPlanLimits, Plan, PlanLimits } from "./planLimits";

export function usePlan() {
  const [plan, setPlan] = useState<Plan>("free");
  const [limits, setLimits] = useState<PlanLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { setLoading(false); return; }
      const userPlan = await getUserPlan(u.uid);
      const userLimits = getPlanLimits(userPlan);

      // calculeaza zilele ramase din trial
      const userDoc = await getDoc(doc(db, "users", u.uid));
      if (userDoc.exists()) {
        const createdAt = userDoc.data().createdAt;
        if (createdAt) {
          const created = new Date(createdAt);
          const daysSince = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSince < 30) setTrialDaysLeft(30 - daysSince);
        }
      }

      setPlan(userPlan);
      setLimits(userLimits);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const canAddTrip = (currentMonthTrips: number) => {
    if (!limits) return false;
    if (limits.tripsPerMonth === null) return true;
    return currentMonthTrips < limits.tripsPerMonth;
  };

  const canAddTruck = (currentTrucks: number) => {
    if (!limits) return false;
    if (limits.trucks === null) return true;
    return currentTrucks < limits.trucks;
  };

  return { plan, limits, loading, trialDaysLeft, canAddTrip, canAddTruck };
}
