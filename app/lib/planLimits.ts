export type Plan = "free" | "basic" | "pro" | "premium";

export const PLAN_LIMITS = {
  free:    { maxItemsPerMonth: 3, maxUsers: 1, historyDays: 30, hasReports: false, hasExport: false, hasAdvancedFeatures: false, hasReferral: false },
  basic:   { maxItemsPerMonth: 15, maxUsers: 1, historyDays: 60, hasReports: false, hasExport: false, hasAdvancedFeatures: false, hasReferral: true },
  pro:     { maxItemsPerMonth: Infinity, maxUsers: 10, historyDays: 365, hasReports: true, hasExport: false, hasAdvancedFeatures: true, hasReferral: true },
  premium: { maxItemsPerMonth: Infinity, maxUsers: Infinity, historyDays: Infinity, hasReports: true, hasExport: true, hasAdvancedFeatures: true, hasReferral: true },
};

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as Plan] || PLAN_LIMITS.free;
}