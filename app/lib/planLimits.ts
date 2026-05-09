import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export type Plan = "free" | "basic" | "pro" | "premium";

export interface PlanLimits {
  tripsPerMonth: number | null;
  trucks: number | null;
  historyDays: number | null;
  hasReport: boolean;
  hasCashflow: boolean;
  hasSimulations: boolean;
  hasClients: boolean;
  hasReferral: boolean;
  fullAccessUntil: number | null;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    tripsPerMonth: 3,
    trucks: 1,
    historyDays: 7,
    hasReport: false,
    hasCashflow: false,
    hasSimulations: false,
    hasClients: false,
    hasReferral: false,
    fullAccessUntil: null,
  },
  basic: {
    tripsPerMonth: 15,
    trucks: 1,
    historyDays: 60,
    hasReport: false,
    hasCashflow: false,
    hasSimulations: true,
    hasClients: true,
    hasReferral: true,
    fullAccessUntil: null,
  },
  pro: {
    tripsPerMonth: null,
    trucks: 10,
    historyDays: null,
    hasReport: true,
    hasCashflow: true,
    hasSimulations: true,
    hasClients: true,
    hasReferral: true,
    fullAccessUntil: null,
  },
  premium: {
    tripsPerMonth: null,
    trucks: null,
    historyDays: null,
    hasReport: true,
    hasCashflow: true,
    hasSimulations: true,
    hasClients: true,
    hasReferral: true,
    fullAccessUntil: null,
  },
};

export async function getUserPlan(userId: string): Promise<Plan> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) return "free";
    const data = userDoc.data();

    // Luna 1 full access — daca contul e mai nou de 30 zile
    const createdAt = data.createdAt ? new Date(data.createdAt) : null;
    if (createdAt) {
      const daysSinceCreation = Math.floor(
        (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceCreation < 30) return "premium"; // full access luna 1
    }

    return (data.plan as Plan) || "free";
  } catch {
    return "free";
  }
}

export function getPlanLimits(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan];
}

export function isWithinTrialPeriod(createdAt: string): boolean {
  const created = new Date(createdAt);
  const daysSince = Math.floor(
    (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSince < 30;
}
