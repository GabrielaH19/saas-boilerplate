"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface SignupSourceModalProps {
  userId: string;
  onClose: () => void;
}

export default function SignupSourceModal({
  userId,
  onClose,
}: SignupSourceModalProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const options = [
    { id: "referral", label: "Recomandare de la cineva" },
    { id: "google", label: "Google / motoare de căutare" },
    { id: "social_media", label: "Social media (Facebook, LinkedIn, etc)" },
    { id: "tiktok", label: "TikTok (@gabryhawk)" },
    { id: "altele", label: "Altceva" },
  ];

  const handleSubmit = async () => {
    if (!selectedSource) {
      setError("Selectează o opțiune");
      return;
    }

    const sourceValue =
      selectedSource === "altele" && otherText.trim()
        ? `altele: ${otherText.trim()}`
        : selectedSource;

    setLoading(true);
    setError("");

    try {
      await updateDoc(doc(db, "users", userId), {
        signupSource: sourceValue,
      });
      onClose();
    } catch (err) {
      setError("A apărut o eroare. Încearcă din nou.");
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", userId), {
        signupSource: "skipped",
      });
      onClose();
    } catch (err) {
      setError("A apărut o eroare. Încearcă din nou.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">
            De unde ai aflat de TripProfit?
          </h2>
          <p className="text-sm text-gray-400">
            Asta ne ajută să înțelegem de unde vin clienții și cum putem face mai bine.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <div key={option.id}>
              <button
                onClick={() => setSelectedSource(option.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedSource === option.id
                    ? "border-[#f5a623] bg-[#1f1f1f]"
                    : "border-[#2e2e2e] bg-[#1a1a1a] hover:border-[#3a3a3a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedSource === option.id
                        ? "border-[#f5a623]"
                        : "border-[#3a3a3a]"
                    }`}
                  >
                    {selectedSource === option.id && (
                      <div className="w-3 h-3 bg-[#f5a623] rounded-full" />
                    )}
                  </div>
                  <span className="text-white text-sm">{option.label}</span>
                </div>
              </button>

              {/* Text input for "altele" */}
              {selectedSource === option.id && option.id === "altele" && (
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Spune-ne cum..."
                  className="w-full mt-2 bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]"
                />
              )}
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            disabled={loading}
            className="flex-1 bg-[#2e2e2e] text-white font-bold py-3 rounded-lg hover:bg-[#3a3a3a] transition disabled:opacity-50"
          >
            Sari pasul
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedSource}
            className="flex-1 bg-[#f5a623] text-black font-bold py-3 rounded-lg hover:bg-[#e59512] transition disabled:opacity-50"
          >
            {loading ? "Se salvează..." : "Gata"}
          </button>
        </div>
      </div>
    </div>
  );
}
