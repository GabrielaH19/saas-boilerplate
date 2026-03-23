"use client";

import { createContext, useContext, useState } from "react";
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
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tp_lang") as Locale;
      if (saved && t[saved]) return saved;
    }
    return "ro";
  });

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