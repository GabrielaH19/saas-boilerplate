"use client";

import { useState, useEffect } from "react";

const COOKIE_KEY = "tp_cookie_consent";

type ConsentState = {
  analytics: boolean;
  accepted: boolean;
};

function loadConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveConsent(state: ConsentState) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify(state));
}

function activateAnalytics() {
  // Activezi GA aici când e gata
  // ex: window.gtag("consent", "update", { analytics_storage: "granted" });
  console.log("[TripProfit] Analytics consent granted");
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [analyticsToggle, setAnalyticsToggle] = useState(false);

  useEffect(() => {
    const consent = loadConsent();
    if (!consent) {
      setVisible(true);
    } else if (consent.analytics) {
      activateAnalytics();
    }
  }, []);

  function acceptAll() {
    const state: ConsentState = { analytics: true, accepted: true };
    saveConsent(state);
    activateAnalytics();
    setVisible(false);
  }

  function saveSettings() {
    const state: ConsentState = { analytics: analyticsToggle, accepted: true };
    saveConsent(state);
    if (analyticsToggle) activateAnalytics();
    setModalOpen(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl">
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 leading-relaxed">
                Folosim cookie-uri esențiale pentru funcționarea platformei și, cu acordul tău, cookie-uri de analiză pentru a înțelege cum e folosit TripProfit.{" "}
                <a href="/privacy" className="text-[#f5a623] hover:underline text-sm">
                  Politica de confidențialitate
                </a>
              </p>
            </div>

            {/* Butoane */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setAnalyticsToggle(false);
                  setModalOpen(true);
                }}
                className="text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap"
              >
                Manage Settings
              </button>
              <button
                onClick={acceptAll}
                className="bg-[#f5a623] hover:bg-[#e09520] text-black text-sm font-semibold px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Manage Settings */}
      {modalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-[#141414] border border-[#2a2a2a] rounded-2xl w-full max-w-md shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#1e1e1e]">
              <h2 className="text-base font-semibold text-white">Setări cookie-uri</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Continut */}
            <div className="px-6 py-5 space-y-4">

              {/* Esențiale — mereu ON */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">Cookie-uri esențiale</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Necesare pentru autentificare și funcționarea platformei. Nu pot fi dezactivate.
                  </p>
                </div>
                <div className="shrink-0 mt-0.5">
                  <div className="w-10 h-5 bg-[#f5a623] rounded-full flex items-center justify-end px-0.5 cursor-not-allowed opacity-70">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#1e1e1e]" />

              {/* Analytics — toggle */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">Cookie-uri de analiză</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ne ajută să înțelegem cum e folosit TripProfit (Google Analytics). Datele sunt anonimizate.
                  </p>
                </div>
                <button
                  onClick={() => setAnalyticsToggle(!analyticsToggle)}
                  className={`shrink-0 mt-0.5 w-10 h-5 rounded-full flex items-center px-0.5 transition-colors duration-200 ${
                    analyticsToggle ? "bg-[#f5a623] justify-end" : "bg-[#2a2a2a] justify-start"
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={saveSettings}
                className="flex-1 bg-[#f5a623] hover:bg-[#e09520] text-black text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                Salvează preferințele
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}