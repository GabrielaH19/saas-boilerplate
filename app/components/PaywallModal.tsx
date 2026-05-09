"use client";

import Link from "next/link";
import { Plan } from "@/app/lib/planLimits";

interface PaywallProps {
  feature: string;
  requiredPlan: "basic" | "pro" | "premium";
  currentPlan: Plan;
}

const planNames: Record<string, string> = {
  basic: "Basic",
  pro: "Pro",
  premium: "Premium",
};

const planPrices: Record<string, string> = {
  basic: "30€",
  pro: "49€",
  premium: "79€",
};

export default function PaywallModal({ feature, requiredPlan, currentPlan }: PaywallProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161616] border border-[#f5a623] rounded-xl p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-white mb-2">
          {feature}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Această funcție necesită planul{" "}
          <span className="text-[#f5a623] font-semibold">{planNames[requiredPlan]}</span>.
          Tu ești pe planul{" "}
          <span className="text-white font-semibold">{planNames[currentPlan] || "Free"}</span>.
        </p>
        <div className="bg-[#1a1a0a] border border-[#3a3000] rounded-lg p-4 mb-6">
          <div className="text-[#f5a623] font-bold text-2xl mb-1">{planPrices[requiredPlan]} / lună</div>
          <div className="text-gray-500 text-xs">Anulezi oricând</div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/pricing"
            className="flex-1 bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition text-sm"
          >
            Upgradează acum
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 border border-[#2e2e2e] text-gray-400 font-semibold py-3 rounded-lg hover:text-white transition text-sm"
          >
            Înapoi
          </button>
        </div>
      </div>
    </div>
  );
}
