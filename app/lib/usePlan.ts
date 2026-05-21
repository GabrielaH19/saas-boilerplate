@'
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
  const [isTrialing, setIsTrialing] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setLoading(false); return; }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const data = userDoc.data();
      const userPlan = data?.plan || "free";
      const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : new Date(user.metadata.creationTime || Date.now());

      const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      const onTrial = userPlan === "free" && daysSinceCreation <= 30;

      setPlan(userPlan);
      setIsTrialing(onTrial);
      setLimits(getPlanLimits(onTrial ? "premium" : userPlan));

      const now = new Date();
      const monthStr = now.toISOString().slice(0, 7);
      const tripsSnap = await getDocs(
        query(collection(db, "trips"),
          where("userId", "==", user.uid),
          where("tripDate", ">=", monthStr + "-01")
        )
      );
      setTripsThisMonth(tripsSnap.size);

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

  return { plan, limits, tripsThisMonth, trucksCount, canAddTrip, canAddTruck, loading, isTrialing };
}
'@ | Out-File -FilePath "C:\Users\Gabriela\tripprofit\app\lib\usePlan.ts" -Encoding UTF8