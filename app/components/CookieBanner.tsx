"use client";

import { useState, useEffect } from "react";

const COOKIE_KEY = "app_cookie_consent";

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
  // window.gtag?.("consent", "update", { analytics_storage: "granted" });
  console.log("[App] Analytics consent granted");
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-200 text-gray-500 ${open ? "rotate-180" : ""}`}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [analyticsToggle, setAnalyticsToggle] = useState(false);
  const [essentialOpen, setEssentialOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  useEffect(() => {
    const consent = loadConsent();
    if (!consent) {
      setVisible(true);
    } else if (consent.analytics) {
      activateAnalytics();
    }
  }, []);

  function acceptAll() {
    saveConsent({ analytics: true, accepted: true });
    activateAnalytics();
    setVisible(false);
    setModalOpen(false);
  }

  function rejectAll() {
    saveConsent({ analytics: false, accepted: true });
    setVisible(false);
    setModalOpen(false);
  }

  function saveSettings() {
    saveConsent({ analytics: analyticsToggle, accepted: true });
    if (analyticsToggle) activateAnalytics();
    setVisible(false);
    setModalOpen(false);
  }

  function openModal() {
    setAnalyticsToggle(false);
    setEssentialOpen(false);
    setAnalyticsOpen(false);
    setModalOpen(true);
  }

  if (!visible) return null;

  return (
    <>
      {!modalOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4">
          <div className="max-w-2xl mx-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">We use cookies</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              We use essential cookies for the platform to work and, with your consent, analytics cookies to understand how it's used. Read our{" "}
              <a href="/privacy" className="text-[#f5a623] hover:underline">privacy policy</a>.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={rejectAll} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 bg-[#2a2a2a] hover:bg-[#333] transition-colors">
                Reject all
              </button>
              <button onClick={openModal} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 bg-[#2a2a2a] hover:bg-[#333] transition-colors">
                Manage preferences
              </button>
              <button onClick={acceptAll} className="px-4 py-2 rounded-xl text-sm font-semibold text-black bg-[#f5a623] hover:bg-[#e09520] transition-colors">
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-lg shadow-2xl">

            <div className="px-6 pt-6 pb-4 border-b border-[#242424]">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Privacy & Data</p>
              <h2 className="text-xl font-bold text-white">Cookie preferences</h2>
            </div>

            <div className="px-6 py-4 border-b border-[#242424]">
              <h3 className="text-sm font-semibold text-white mb-1">Your privacy</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                You can change your cookie preferences at any time.{" "}
                <a href="/privacy" className="text-[#f5a623] hover:underline font-medium">Privacy policy</a>
              </p>
            </div>

            <div className="border-b border-[#242424]">
              <button onClick={() => setEssentialOpen(!essentialOpen)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#1f1f1f] transition-colors">
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Essential</p>
                  <p className="text-xs text-gray-500 mt-0.5">Required for the platform to work</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#f5a623] font-medium">Always active</span>
                  <ChevronIcon open={essentialOpen} />
                </div>
              </button>
              {essentialOpen && (
                <div className="px-6 pb-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    These cookies are required for the app to work — for example, keeping you logged in.
                  </p>
                </div>
              )}
            </div>

            <div className="border-b border-[#242424]">
              <div className="px-6 py-4 flex items-center justify-between gap-4">
                <button onClick={() => setAnalyticsOpen(!analyticsOpen)} className="flex items-start gap-3 text-left flex-1 hover:opacity-80 transition-opacity">
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      Analytics <ChevronIcon open={analyticsOpen} />
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Helps improve the platform</p>
                  </div>
                </button>
                <button onClick={() => setAnalyticsToggle(!analyticsToggle)}
                  className={`shrink-0 w-11 h-6 rounded-full flex items-center px-0.5 transition-colors duration-200 ${analyticsToggle ? "bg-[#f5a623] justify-end" : "bg-[#3a3a3a] justify-start"}`}>
                  <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                </button>
              </div>
              {analyticsOpen && (
                <div className="px-6 pb-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    These cookies collect anonymized data about how you use the app — pages visited and interactions. Data is aggregated and never sold.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 flex items-center gap-3 flex-wrap">
              <button onClick={acceptAll} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black bg-[#f5a623] hover:bg-[#e09520] transition-colors">
                Accept all
              </button>
              <button onClick={rejectAll} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-[#2a2a2a] hover:bg-[#333] transition-colors">
                Reject all
              </button>
              <button onClick={saveSettings} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-[#2a2a2a] hover:bg-[#333] transition-colors">
                Save settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}