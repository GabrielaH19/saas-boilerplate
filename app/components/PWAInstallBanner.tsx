"use client";

import { useState, useEffect } from "react";

const BANNER_KEY = "tp_pwa_banner_dismissed";

export function PWAInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [lang, setLang] = useState("ro");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

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

    // Captam evenimentul nativ de instalare (Android Chrome)
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
  }

  async function install() {
    if (deferredPrompt) {
      // Android — declanseaza popup nativ
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        dismiss();
      }
      setDeferredPrompt(null);
    } else {
      // iOS — nu exista prompt nativ, bannerul explica manual
      dismiss();
    }
  }

  if (!visible) return null;

  const it = lang === "it";

  return (
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
            {isIOS
              ? it ? 'Premi Share → "Aggiungi a Home"' : 'Apasă Share → "Add to Home Screen"'
              : it ? "Accesso istantaneo · fullscreen · zero barra browser" : "Acces instant · fullscreen · zero bara browser"}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isIOS && (
            <button
              onClick={install}
              className="bg-black text-[#f5a623] text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              {it ? "INSTALLA" : "INSTALEAZĂ"}
            </button>
          )}
          <button
            onClick={dismiss}
            className="text-black/50 hover:text-black text-lg leading-none p-1"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}