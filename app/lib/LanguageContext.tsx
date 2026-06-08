"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { t, Locale } from "./translations";

type LanguageContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  tr: typeof t.ro;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "ro",
  setLocale: () => {},
  tr: t.ro,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ro");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("tp_lang") as Locale;
    if (saved && t[saved]) {
      setLocaleState(saved);
      return;
    }
    fetch("https://ip-api.com/json/?fields=countryCode")
      .then((r) => r.json())
      .then((data) => {
        const detected: Locale = data.countryCode === "IT" ? "it" : "ro";
        setLocaleState(detected);
        localStorage.setItem("tp_lang", detected);
      })
      .catch(() => {});
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("tp_lang", l);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, tr: t[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);