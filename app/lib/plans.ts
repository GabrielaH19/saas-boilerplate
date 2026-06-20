export type Plan = "free" | "basic" | "pro" | "premium";

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    itemsPerMonth: 3,
    features: ["3 items / month", "Basic features", "30-day history"],
  },
  basic: {
    name: "Basic",
    price: 9,
    itemsPerMonth: 15,
    features: ["15 items / month", "Core features", "60-day history", "Referral program"],
  },
  pro: {
    name: "Pro",
    price: 19,
    itemsPerMonth: Infinity,
    features: ["Unlimited items", "All features", "365-day history", "Reports", "Referral program"],
  },
  premium: {
    name: "Premium",
    price: 39,
    itemsPerMonth: Infinity,
    features: ["Everything in Pro", "Unlimited users", "PDF export", "Priority support"],
  },
};

export function canAddItem(plan: Plan, itemsThisMonth: number): boolean {
  if (plan === "pro" || plan === "premium") return true;
  if (plan === "basic") return itemsThisMonth < PLANS.basic.itemsPerMonth;
  return itemsThisMonth < PLANS.free.itemsPerMonth;
}