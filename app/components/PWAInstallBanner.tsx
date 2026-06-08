"use client";

import { useState, useEffect } from "react";

const BANNER_KEY = "tp_pwa_banner_dismissed";

export function PWAInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Nu afisa daca e deja instalat ca PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Nu afisa daca a fost deja inchis
    const dismissed = localStorage.getItem(BANNER_KEY);
    if (dismissed) return;

    // Detecteaza iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    // Afiseaza doar pe mobil
    const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Asteapta 3 secunde
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(BANNER_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] p-3">
      <div
        style={{ backgroundColor: "#f5a623" }}
        className="rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl"
      >
        {/* Logo */}
        <div className="shrink-0 w-10 h-10 rounded-xl bg-black flex items-center justify-center overflow-hidden">
          <img src="/logo-icon.png" alt="TripProfit" className="w-8 h-8 object-contain" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-black font-bold text-sm leading-tight">
            Pune TripProfit pe home screen
          </p>
          <p className="text-black/70 text-xs mt-0.5">
            {isIOS
              ? 'Apasă Share → "Add to Home Screen"'
              : "Acces instant · fullscreen · zero bara browser"}
          </p>
        </div>

        {/* Buton / X */}
        <div className="flex items-center gap-2 shrink-0">
          {!isIOS && (
            <button
              id="pwa-install-btn"
              onClick={dismiss}
              className="bg-black text-[#f5a623] text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              INSTALEAZĂ
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