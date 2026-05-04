"use client";

import { useLang } from "./LanguageContext";
import { Locale } from "./translations";

const LANGS: { code: Locale; label: string }[] = [
  { code: "ro", label: "RO" },
  { code: "it", label: "IT" },
];

export default function LangSwitcher() {
  const { locale, setLocale } = useLang();

  return (
    <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#333] rounded-lg p-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`px-3 py-1 rounded text-xs font-semibold transition ${
            locale === l.code
              ? "bg-[#f5a623] text-black"
              : "text-gray-300 hover:text-white"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
