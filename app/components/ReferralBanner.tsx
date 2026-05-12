"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useLang } from "@/app/lib/LanguageContext";

export default function ReferralBanner() {
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { locale } = useLang();

  const texts = {
    ro: {
      title: "Invita un coleg, castiga 4€",
      sub: "Dupa 30 zile de abonament activ primesti 4€ pentru fiecare invitat.",
      shareText: "Folosesc TripProfit sa calculez profitul curselor mele. Incearca si tu: ",
      copy: "Copiaza link",
      copied: "Copiat!",
    },
    it: {
      title: "Invita un collega, guadagna 4€",
      sub: "Dopo 30 giorni di abbonamento attivo ricevi 4€ per ogni invitato.",
      shareText: "Uso TripProfit per calcolare il profitto dei miei viaggi. Provalo anche tu: ",
      copy: "Copia link",
      copied: "Copiato!",
    },
  };

  const t = locale === "it" ? texts.it : texts.ro;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let code = userDoc.data()?.referralCode;
      if (!code) {
        code = user.uid.slice(0, 8).toUpperCase();
        await updateDoc(doc(db, "users", user.uid), { referralCode: code });
      }
      setReferralLink("https://tripprofit.ro/register?ref=" + code);
    });
    return () => unsub();
  }, []);

  if (!referralLink) return null;

  const shareWhatsApp = () => window.open("https://wa.me/?text=" + encodeURIComponent(t.shareText + referralLink), "_blank");
  const shareFacebook = () => window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(referralLink), "_blank");
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#f5a623] border-opacity-30 rounded-xl p-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-[#f5a623]">{t.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{t.sub}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={shareWhatsApp} className="bg-[#25D366] text-white font-bold py-1.5 px-3 rounded-lg hover:opacity-90 transition text-xs">
            WhatsApp
          </button>
          <button onClick={shareFacebook} className="bg-[#1877F2] text-white font-bold py-1.5 px-3 rounded-lg hover:opacity-90 transition text-xs">
            Facebook
          </button>
          <button onClick={handleCopy} className="bg-[#2e2e2e] text-white font-bold py-1.5 px-3 rounded-lg hover:bg-[#3a3a3a] transition text-xs">
            {copied ? t.copied : t.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
