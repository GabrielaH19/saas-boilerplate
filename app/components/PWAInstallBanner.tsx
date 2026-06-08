"use client";

import { useState, useEffect } from "react";

const BANNER_KEY = "tp_pwa_banner_dismissed";

export function PWAInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [lang, setLang] = useState("ro");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    const dismissed = localStorage.getItem(BANNER_KEY);
    if (dismissed) return;

    const saved = localStorage.getItem("tp_lang");
    if (saved === "it") setLang("it");

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);
    if (!isMobile) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const timer = setTimeout(() => setVisible(true), 3000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(BANNER_KEY, "1");
    setVisible(false);
    setShowModal(false);
  }

  async function install() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") dismiss();
      setDeferredPrompt(null);
    } else {
      setShowModal(true);
    }
  }

  if (!visible) return null;

  const it = lang === "it";

  const iosSteps = it
    ? ["Apri Safari (non Chrome)", 'Premi il pulsante Share (quadrato con freccia)', 'Scorri e tocca "Aggiungi a Home"', 'Premi "Aggiungi" in alto a destra']
    : ["Deschide Safari (nu Chrome)", "Apasă butonul Share (pătratul cu săgeată)", 'Derulează și apasă "Add to Home Screen"', 'Apasă "Add" în dreapta sus'];

  const androidSteps = it
    ? ["Apri Chrome", 'Tocca i 3 punti in alto a destra', 'Tocca "Aggiungi a schermata Home"', 'Premi "Aggiungi"']
    : ["Deschide Chrome", "Apasă cele 3 puncte din dreapta sus", 'Apasă "Adaugă pe ecranul principal"', 'Apasă "Adaugă"'];

  const steps = isIOS ? iosSteps : androidSteps;

  return (
    <>
      {/* Banner */}
      {!showModal && (
        <div className="fixed bottom-0 left-0 right-0 z-[9998] p-3">
          <div
            style={{ backgroundColor: "#f5a623" }}
            className="rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-black flex items-center justify-center overflow-hidden">
              <img src="/logo-icon.png" alt="TripProfit" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-black font-bold text-sm leading-tight">
                {it ? "Aggiungi TripProfit alla schermata home" : "Pune TripProfit pe home screen"}
              </p>
              <p className="text-black/70 text-xs mt-0.5">
                {it ? "Accesso istantaneo · fullscreen" : "Acces instant · fullscreen"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={install}
                className="bg-black text-[#f5a623] text-xs font-bold px-3 py-1.5 rounded-lg"
              >
                {it ? "INSTALLA" : "INSTALEAZĂ"}
              </button>
              <button onClick={dismiss} className="text-black/50 hover:text-black text-lg leading-none p-1">
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal instructiuni */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center p-3">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-sm shadow-2xl pb-6">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#f5a623] flex items-center justify-center overflow-hidden">
                  <img src="/logo-icon.png" alt="TripProfit" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">TripProfit</p>
                  <p className="text-gray-500 text-xs">tripprofit.ro</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-xl p-1">×</button>
            </div>

            {/* Titlu */}
            <div className="px-5 pt-4 pb-3">
              <p className="text-white font-semibold text-sm">
                {it ? "Come installare l'app:" : "Cum instalezi aplicația:"}
              </p>
            </div>

            {/* Pasi */}
            <div className="px-5 space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-[#f5a623] flex items-center justify-center">
                    <span className="text-black text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>

            {/* Buton inchide */}
            <div className="px-5 mt-5">
              <button
                onClick={dismiss}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-[#2a2a2a] hover:bg-[#333] transition-colors"
              >
                {it ? "Chiudi" : "Închide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}