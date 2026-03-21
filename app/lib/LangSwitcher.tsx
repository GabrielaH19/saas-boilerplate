"use client";

import { useLang } from "./LanguageContext";
import { Locale } from "./translations";

const LANGS: { code: Locale; flag: string; label: string }[] = [
  { code: "ro", flag: "🇷🇴", label: "RO" },
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "de", flag: "🇩🇪", label: "DE" },
  { code: "it", flag: "🇮🇹", label: "IT" },
  { code: "pl", flag: "🇵🇱", label: "PL" },
  { code: "hu", flag: "🇭🇺", label: "HU" },
  { code: "bg", flag: "🇧🇬", label: "BG" },
];

export default function LangSwitcher() {
  const { locale, setLocale } = useLang();

  return (
    <div className="flex items-center gap-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`px-2 py-1 rounded text-xs font-mono transition ${
            locale === l.code
              ? "bg-[#2a2a2a] text-[#f5a623] border border-[#3a3a3a]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
}