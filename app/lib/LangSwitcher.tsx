"use client";

import { useLang } from "./LanguageContext";
import { Locale } from "./translations";

const LANGS: { code: Locale; flag: string; label: string }[] = [
  { code: "ro", flag: "????", label: "RO" },
  { code: "it", flag: "????", label: "IT" },
];

export default function LangSwitcher() {
  const { locale, setLocale } = useLang();

  return (
    <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#333] rounded-lg p-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`px-2 py-1 rounded text-xs font-semibold transition ${
            locale === l.code
              ? "bg-[#f5a623] text-black"
              : "text-gray-300 hover:text-white"
          }`}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
}
