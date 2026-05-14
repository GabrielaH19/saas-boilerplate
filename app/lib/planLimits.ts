export type Plan = "free" | "basic" | "pro" | "premium";

export const PLAN_LIMITS = {
  free:    { maxTripsPerMonth: 3, maxTrucks: 1, historyDays: 30, hasReport: false, hasCashflow: false, hasSimulations: false, hasReferral: false, hasPdfExport: false },
  basic:   { maxTripsPerMonth: 15, maxTrucks: 1, historyDays: 60, hasReport: false, hasCashflow: false, hasSimulations: true, hasReferral: true, hasPdfExport: false },
  pro:     { maxTripsPerMonth: Infinity, maxTrucks: 10, historyDays: 365, hasReport: true, hasCashflow: true, hasSimulations: true, hasReferral: true, hasPdfExport: false },
  premium: { maxTripsPerMonth: Infinity, maxTrucks: Infinity, historyDays: Infinity, hasReport: true, hasCashflow: true, hasSimulations: true, hasReferral: true, hasPdfExport: true },
};

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as Plan] || PLAN_LIMITS.free;
}
