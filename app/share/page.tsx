"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppNav from "@/app/components/AppNav";
import { useLang } from "@/app/lib/LanguageContext";

const CARD_TEXT: Record<string, any> = {
  ro: { badge: "Calculator profit curse TIR", profitNet: "PROFIT NET", profitKm: "PROFIT / KM", km: "KILOMETRI", accept: "ACCEPTA", acceptSub: "Cursa profitabila. Merita acceptata.", negotiate: "NEGOCIAZA", negotiateSub: "Profit mic. Incearca sa negociezi.", reject: "REFUZA", rejectSub: "Nu merita. Costurile depasesc beneficiul.", footer: "tripprofit.ro - Calculatorul de profit pentru soferi de TIR din Europa", cta: "Incearca gratuit", title: "Cardul tau de cursa - posteaza-l pe Facebook sau WhatsApp", earn: "Câștigă 10€ pentru fiecare prieten invitat", earnSub: "Posteaza cardul pe grupurile de Facebook pentru soferi. Când un prieten se abonează prin link-ul tău, primești 10€ direct în cont.", refLink: "Vezi link-ul tau de referral", newTrip: "+ Cursa noua", download: "Descarca imaginea" },
  it: { badge: "Calcolatore profitto viaggi TIR", profitNet: "PROFITTO NETTO", profitKm: "PROFITTO / KM", km: "CHILOMETRI", accept: "ACCETTA", acceptSub: "Viaggio redditizio. Vale la pena.", negotiate: "NEGOZIA", negotiateSub: "Margine basso. Negozia.", reject: "RIFIUTA", rejectSub: "Non vale. I costi superano il ricavo.", footer: "tripprofit.ro - Calcolatore di profitto per camionisti in Europa", cta: "Prova gratis", title: "La tua scheda viaggio - condividila su Facebook o WhatsApp", earn: "Guadagna 10€ per ogni amico invitato", earnSub: "Posta la scheda nei gruppi Facebook per autisti. Quando un amico si abbona tramite il tuo link, ricevi 10€.", refLink: "Vedi il tuo link referral", newTrip: "+ Nuovo viaggio", download: "Scarica immagine" },
};

function ShareCard() {
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trip, setTrip] = useState<any>(null);
  const { locale: lang } = useLang();

  useEffect(() => {
    const from = searchParams.get("from") || "—";
    const to = searchParams.get("to") || "—";
    const profit = searchParams.get("profit") || "0";
    const ppkm = searchParams.get("ppkm") || "0";
    const verdict = searchParams.get("verdict") || "accept";
    const km = searchParams.get("km") || "0";
    setTrip({ from, to, profit, ppkm, verdict, km });
  }, [searchParams]);

  useEffect(() => {
    if (!trip || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ct = CARD_TEXT[lang] || CARD_TEXT.ro;
    canvas.width = 1200;
    canvas.height = 630;
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, 1200, 630);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 630); ctx.stroke(); }
    for (let y = 0; y < 630; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke(); }
    const verdictColor = trip.verdict === "accept" ? "#22c55e" : trip.verdict === "negotiate" ? "#f5a623" : "#ef4444";
    const verdictBg = trip.verdict === "accept" ? "#052612" : trip.verdict === "negotiate" ? "#2a1e05" : "#1f0a0a";
    const verdictText = trip.verdict === "accept" ? ct.accept : trip.verdict === "negotiate" ? ct.negotiate : ct.reject;
    const verdictSub = trip.verdict === "accept" ? ct.acceptSub : trip.verdict === "negotiate" ? ct.negotiateSub : ct.rejectSub;
    ctx.fillStyle = verdictColor;
    ctx.fillRect(0, 0, 8, 630);
    const grd = ctx.createRadialGradient(1100, 100, 0, 1100, 100, 300);
    grd.addColorStop(0, verdictColor + "15");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1200, 630);
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Trip", 60, 65);
    ctx.fillStyle = "#f5a623";
    ctx.fillText("Profit", 108, 65);
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.roundRect(60, 80, 280, 28, 14);
    ctx.fill();
    ctx.font = "12px Arial";
    ctx.fillStyle = "#a5b4fc";
    ctx.fillText(ct.badge, 75, 99);
    const fromCap = trip.from.charAt(0).toUpperCase() + trip.from.slice(1);
    const toCap = trip.to.charAt(0).toUpperCase() + trip.to.slice(1);
    ctx.font = "bold 64px Arial";
    let x = 60;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(fromCap, x, 195);
    x += ctx.measureText(fromCap).width + 20;
    ctx.fillStyle = "#f5a623";
    ctx.fillText("→", x, 195);
    x += ctx.measureText("->").width + 20;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(toCap, x, 195);
    ctx.fillStyle = "#2e2e2e";
    ctx.fillRect(60, 215, 1080, 1);
    const stats = [
      { label: ct.profitNet, value: parseFloat(trip.profit).toFixed(0) + " euro", color: parseFloat(trip.profit) >= 0 ? "#22c55e" : "#ef4444" },
      { label: ct.profitKm, value: parseFloat(trip.ppkm).toFixed(3) + " euro", color: "#ffffff" },
      { label: ct.km, value: trip.km + " km", color: "#ffffff" },
    ];
    stats.forEach((stat, i) => {
      const sx = 60 + i * 380;
      ctx.font = "13px Arial";
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "left";
      ctx.fillText(stat.label, sx, 258);
      ctx.font = "bold 52px Arial";
      ctx.fillStyle = stat.color;
      ctx.fillText(stat.value, sx, 320);
    });
    ctx.fillStyle = "#2e2e2e";
    ctx.fillRect(60, 345, 1080, 1);
    ctx.fillStyle = verdictBg;
    ctx.beginPath();
    ctx.roundRect(60, 368, 1080, 140, 16);
    ctx.fill();
    ctx.strokeStyle = verdictColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(60, 368, 1080, 140, 16);
    ctx.stroke();
    ctx.font = "bold 58px Arial";
    ctx.fillStyle = verdictColor;
    ctx.textAlign = "center";
    ctx.fillText(verdictText, 600, 435);
    ctx.font = "18px Arial";
    ctx.fillStyle = verdictColor;
    ctx.globalAlpha = 0.75;
    ctx.fillText(verdictSub, 600, 468);
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
    ctx.font = "14px Arial";
    ctx.fillStyle = "#334155";
    ctx.fillText(ct.footer, 60, 610);
    ctx.textAlign = "right";
    ctx.fillText(ct.cta, 1140, 610);
  }, [trip, lang]);

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "tripprofit-card.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  if (!trip) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">Se incarca...</p>
    </div>
  );

  const ct = CARD_TEXT[lang] || CARD_TEXT.ro;
  const verdictColor = trip.verdict === "accept" ? "#22c55e" : trip.verdict === "negotiate" ? "#f5a623" : "#ef4444";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav />
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-gray-400 text-sm mb-8">{ct.title}</p>
        <div className="w-full max-w-4xl">
          <canvas ref={canvasRef} className="rounded-xl w-full border border-[#2e2e2e]" />
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={downloadCard} className="bg-[#f5a623] text-black font-bold px-8 py-4 rounded-lg hover:bg-[#e8951a] transition text-lg">
            {ct.download}
          </button>
          <Link href="/trip/new" className="border border-[#334155] text-white px-8 py-4 rounded-lg hover:bg-[#1e293b] transition text-lg">
            {ct.newTrip}
          </Link>
          <Link href="/dashboard" className="border border-[#334155] text-white px-8 py-4 rounded-lg hover:bg-[#1e293b] transition text-lg">
            Dashboard
          </Link>
        </div>
        <div className="mt-8 bg-[#161616] border border-[#2e2e2e] rounded-xl p-6 max-w-2xl text-center">
          <div style={{ color: verdictColor }} className="text-lg font-bold mb-2">{ct.earn}</div>
          <p className="text-gray-400 text-sm">{ct.earnSub}</p>
          <Link href="/dashboard" className="inline-block mt-4 text-[#f5a623] text-sm hover:underline">
            {ct.refLink}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <p className="text-gray-400">Se incarca...</p>
      </div>
    }>
      <ShareCard />
    </Suspense>
  );
}