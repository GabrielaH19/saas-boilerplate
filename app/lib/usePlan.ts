"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getPlanLimits } from "@/app/lib/planLimits";

export function usePlan() {
  const [plan, setPlan] = useState<string>("free");
  const [limits, setLimits] = useState(getPlanLimits("free"));
  const [itemsThisMonth, setItemsThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTrialing, setIsTrialing] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setLoading(false); return; }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const data = userDoc.data();
      const userPlan = data?.plan || "free";

      const createdAtRaw = data?.createdAt;
      const createdAt = createdAtRaw?.toDate
        ? createdAtRaw.toDate()
        : createdAtRaw
        ? new Date(createdAtRaw)
        : new Date(user.metadata.creationTime || Date.now());
      const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      const onTrial = userPlan === "free" && daysSinceCreation <= 30;

      setPlan(userPlan);
      setIsTrialing(onTrial);
      setLimits(getPlanLimits(onTrial ? "premium" : userPlan));

      // TODO: Replace "items" with your own Firestore collection
      const now = new Date();
      const monthStr = now.toISOString().slice(0, 7);
      const itemsSnap = await getDocs(
        query(collection(db, "items"),
          where("userId", "==", user.uid),
          where("createdAt", ">=", monthStr + "-01")
        )
      );
      setItemsThisMonth(itemsSnap.size);

      setLoading(false);
    });
    return () => unsub();
  }, []);

  const canAddItem = limits.maxItemsPerMonth === Infinity || itemsThisMonth < limits.maxItemsPerMonth;

  return { plan, limits, itemsThisMonth, canAddItem, loading, isTrialing };
}