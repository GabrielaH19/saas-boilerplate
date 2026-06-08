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

function getLang(): string {
  if (typeof window === "undefined") return "ro";
  try {
    const saved = localStorage.getItem("tp_lang");
    return saved === "it" ? "it" : "ro";
  } catch {
    return "ro";
  }
}

function saveConsent(state: ConsentState) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify(state));
}

function activateAnalytics() {
  // window.gtag?.("consent", "update", { analytics_storage: "granted" });
  console.log("[TripProfit] Analytics consent granted");
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 text-gray-500 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [analyticsToggle, setAnalyticsToggle] = useState(false);
  const [lang, setLang] = useState("ro");
  const [essentialOpen, setEssentialOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  useEffect(() => {
    const consent = loadConsent();
    setLang(getLang());
    if (!consent) {
      setVisible(true);
    } else if (consent.analytics) {
      activateAnalytics();
    }
  }, []);

  const ro = lang === "ro";

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
      {/* Banner */}
      {!modalOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4">
          <div className="max-w-2xl mx-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-6 py-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">
              {ro ? "Folosim cookie-uri" : "Utilizziamo i cookie"}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              {ro
                ? "Folosim cookie-uri esențiale pentru funcționarea platformei și, cu acordul tău, cookie-uri de analiză pentru a înțelege cum e folosit TripProfit. Citește "
                : "Utilizziamo cookie essenziali per il funzionamento della piattaforma e, con il tuo consenso, cookie analitici per capire come viene utilizzato TripProfit. Leggi la "}
              <a href="/privacy" className="text-[#f5a623] hover:underline">
                {ro ? "politica de confidențialitate" : "informativa sulla privacy"}
              </a>
              {"."}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={rejectAll}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 bg-[#2a2a2a] hover:bg-[#333] transition-colors"
              >
                {ro ? "Respinge toate" : "Rifiuta tutti"}
              </button>
              <button
                onClick={openModal}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 bg-[#2a2a2a] hover:bg-[#333] transition-colors"
              >
                {ro ? "Alege preferințele" : "Gestisci preferenze"}
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-black bg-[#f5a623] hover:bg-[#e09520] transition-colors"
              >
                {ro ? "Acceptă toate" : "Accetta tutti"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-lg shadow-2xl">

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-[#242424]">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                {ro ? "Confidențialitate & Date" : "Privacy & Dati"}
              </p>
              <h2 className="text-xl font-bold text-white">
                {ro ? "Preferințe cookie" : "Preferenze cookie"}
              </h2>
            </div>

            {/* Your Privacy */}
            <div className="px-6 py-4 border-b border-[#242424]">
              <h3 className="text-sm font-semibold text-white mb-1">
                {ro ? "Confidențialitatea ta" : "La tua privacy"}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {ro
                  ? "Poți modifica preferințele cookie oricând. "
                  : "Puoi modificare le preferenze cookie in qualsiasi momento. "}
                <a href="/privacy" className="text-[#f5a623] hover:underline font-medium">
                  {ro ? "Politica de confidențialitate" : "Informativa sulla privacy"}
                </a>
              </p>
            </div>

            {/* Esențiale */}
            <div className="border-b border-[#242424]">
              <button
                onClick={() => setEssentialOpen(!essentialOpen)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#1f1f1f] transition-colors"
              >
                <div className="flex items-start gap-3 text-left">
                  <div>
                    <p className="text-sm font-bold text-white">
                      {ro ? "Esențiale" : "Essenziali"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {ro ? "Necesare pentru funcționarea platformei" : "Necessari per il funzionamento della piattaforma"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#f5a623] font-medium">
                    {ro ? "Întotdeauna active" : "Sempre attivi"}
                  </span>
                  <ChevronIcon open={essentialOpen} />
                </div>
              </button>
              {essentialOpen && (
                <div className="px-6 pb-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {ro
                      ? "Aceste cookie-uri sunt necesare pentru ca TripProfit să funcționeze și să îți ofere serviciile disponibile pe platformă — de exemplu, menținerea sesiunii de autentificare."
                      : "Questi cookie sono necessari per il funzionamento di TripProfit e per fornirti i servizi disponibili sulla piattaforma — ad esempio, il mantenimento della sessione di autenticazione."}
                  </p>
                </div>
              )}
            </div>

            {/* Analytics */}
            <div className="border-b border-[#242424]">
              <div className="px-6 py-4 flex items-center justify-between gap-4">
                <button
                  onClick={() => setAnalyticsOpen(!analyticsOpen)}
                  className="flex items-start gap-3 text-left flex-1 hover:opacity-80 transition-opacity"
                >
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      Analytics
                      <ChevronIcon open={analyticsOpen} />
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {ro ? "Ajută la îmbunătățirea platformei" : "Aiuta a migliorare la piattaforma"}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setAnalyticsToggle(!analyticsToggle)}
                  className={`shrink-0 w-11 h-6 rounded-full flex items-center px-0.5 transition-colors duration-200 ${
                    analyticsToggle ? "bg-[#f5a623] justify-end" : "bg-[#3a3a3a] justify-start"
                  }`}
                  aria-label="Toggle analytics"
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                </button>
              </div>
              {analyticsOpen && (
                <div className="px-6 pb-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {ro
                      ? "Aceste cookie-uri colectează informații despre modul în care folosești TripProfit — ce pagini vizitezi și cum interacționezi cu platforma. Datele sunt anonimizate și agregate."
                      : "Questi cookie raccolgono informazioni su come utilizzi TripProfit — quali pagine visiti e come interagisci con la piattaforma. I dati sono anonimizzati e aggregati."}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex items-center gap-3 flex-wrap">
              <button
                onClick={acceptAll}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black bg-[#f5a623] hover:bg-[#e09520] transition-colors"
              >
                {ro ? "Acceptă toate" : "Accetta tutti"}
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-[#2a2a2a] hover:bg-[#333] transition-colors"
              >
                {ro ? "Respinge toate" : "Rifiuta tutti"}
              </button>
              <button
                onClick={saveSettings}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-[#2a2a2a] hover:bg-[#333] transition-colors"
              >
                {ro ? "Salvează" : "Salva"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}