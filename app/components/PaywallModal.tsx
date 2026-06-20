"use client";

import { useRouter } from "next/navigation";

interface PaywallModalProps {
  onClose: () => void;
  feature: string;
  requiredPlan: string;
}

export default function PaywallModal({ onClose, feature, requiredPlan }: PaywallModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8 w-full max-w-md text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-white mb-2">Premium Feature</h2>
        <p className="text-gray-400 mb-2">
          <span className="text-white font-semibold">{feature}</span> is only available on the{" "}
          <span className="text-[#f5a623] font-semibold capitalize">{requiredPlan}</span> plan or higher.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Upgrade your plan to unlock this feature.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-[#2e2e2e] text-white font-bold py-3 rounded-lg hover:bg-[#3a3a3a] transition">
            Back
          </button>
          <button onClick={() => router.push("/pricing")} className="flex-1 bg-[#f5a623] text-black font-bold py-3 rounded-lg hover:bg-[#e59512] transition">
            View plans
          </button>
        </div>
      </div>
    </div>
  );
}