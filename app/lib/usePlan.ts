"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getPlanLimits } from "@/app/lib/planLimits";

export function usePlan() {
  const [plan, setPlan] = useState<string>("free");
  const [limits, setLimits] = useState(getPlanLimits("free"));
  const [tripsThisMonth, setTripsThisMonth] = useState(0);
  const [trucksCount, setTrucksCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setLoading(false); return; }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userPlan = userDoc.data()?.plan || "free";
      setPlan(userPlan);
      setLimits(getPlanLimits(userPlan));

      // Count trips this month
      const now = new Date();
      const monthStr = now.toISOString().slice(0, 7);
      const tripsSnap = await getDocs(
        query(collection(db, "trips"),
          where("userId", "==", user.uid),
          where("tripDate", ">=", monthStr + "-01")
        )
      );
      setTripsThisMonth(tripsSnap.size);

      // Count trucks
      const trucksSnap = await getDocs(
        query(collection(db, "trucks"), where("userId", "==", user.uid))
      );
      setTrucksCount(trucksSnap.size);

      setLoading(false);
    });
    return () => unsub();
  }, []);

  const canAddTrip = limits.maxTripsPerMonth === Infinity || tripsThisMonth < limits.maxTripsPerMonth;
  const canAddTruck = limits.maxTrucks === Infinity || trucksCount < limits.maxTrucks;

  return { plan, limits, tripsThisMonth, trucksCount, canAddTrip, canAddTruck, loading };
}
