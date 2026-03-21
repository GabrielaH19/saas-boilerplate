export type Plan = "free" | "pro" | "fleet";

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    tripsPerMonth: 5,
    features: ["5 calcule / lună", "Verdict de bază", "Istoric curse"],
  },
  pro: {
    name: "Pro",
    price: 7,
    tripsPerMonth: Infinity,
    features: [
      "Calcule nelimitate",
      "Verdict complet",
      "Istoric curse",
      "Raport lunar",
      "Profil camion",
      "Invită șoferi — câștigă 3€",
    ],
  },
  fleet: {
    name: "Flotă",
    price: 29,
    tripsPerMonth: Infinity,
    features: [
      "Tot din Pro",
      "Până la 10 șoferi",
      "Dashboard flotă",
      "Suport prioritar",
    ],
  },
};

export function canAddTrip(plan: Plan, tripsThisMonth: number): boolean {
  if (plan === "pro" || plan === "fleet") return true;
  return tripsThisMonth < PLANS.free.tripsPerMonth;
}