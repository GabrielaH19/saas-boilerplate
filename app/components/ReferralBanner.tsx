"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useLang } from "@/app/lib/LanguageContext";

export default function ReferralBanner() {
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const { locale } = useLang();

  const it = locale === "it";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const data = userDoc.data();
      let code = data?.referralCode;
      if (!code) {
        code = user.uid.slice(0, 8).toUpperCase();
        await updateDoc(doc(db, "users", user.uid), { referralCode: code });
      }
      setReferralLink("https://tripprofit.ro/register?ref=" + code);
      setEarnings(data?.referralEarnings || 0);
      setReferralCount(data?.referralCount || 0);
    });
    return () => unsub();
  }, []);

  if (!referralLink) return null;

  const shareText = it
    ? "Uso TripProfit per calcolare il profitto dei miei viaggi. Provalo anche tu: "
    : "Folosesc TripProfit sa calculez profitul curselor mele. Incearca si tu: ";

  const shareWhatsApp = () => window.open("https://wa.me/?text=" + encodeURIComponent(shareText + referralLink), "_blank");
  const shareFacebook = () => window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(referralLink), "_blank");
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#f5a623] border-opacity-30 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-[#f5a623]">
            {it ? "Invita un collega, guadagna 10€" : "Invita un coleg, castiga 10€"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {it ? "Per ogni abbonamento attivato tramite il tuo link ricevi 10€ (max 4/mese)." : "Pentru fiecare abonament activat prin linkul tau primesti 10€ (max 4/luna)."}
          </p>
          {referralCount > 0 && (
            <p className="text-xs text-green-400 mt-1">
              {it
                ? `${referralCount} ${referralCount === 1 ? "invitato convertito" : "invitati convertiti"} · ${earnings}€ guadagnati`
                : `${referralCount} ${referralCount === 1 ? "invitat convertit" : "invitati convertiti"} · ${earnings}€ castigati`}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0 flex-wrap">
          <button onClick={shareWhatsApp} className="bg-[#25D366] text-white font-bold py-1.5 px-3 rounded-lg hover:opacity-90 transition text-xs">
            WhatsApp
          </button>
          <button onClick={shareFacebook} className="bg-[#1877F2] text-white font-bold py-1.5 px-3 rounded-lg hover:opacity-90 transition text-xs">
            Facebook
          </button>
          <button onClick={handleCopy} className="bg-[#2e2e2e] text-white font-bold py-1.5 px-3 rounded-lg hover:bg-[#3a3a3a] transition text-xs">
            {copied ? (it ? "Copiato!" : "Copiat!") : (it ? "Copia link" : "Copiaza link")}
          </button>
        </div>
      </div>
    </div>
  );
}