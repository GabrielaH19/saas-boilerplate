"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const CARD_TEXT: Record<string, any> = {
  ro: { badge: "🚛 Calculator profit curse TIR", profitNet: "PROFIT NET", profitKm: "PROFIT / KM", km: "KILOMETRI", accept: "✓  ACCEPTĂ", acceptSub: "Cursă profitabilă. Merită acceptată.", negotiate: "⚡  NEGOCIAZĂ", negotiateSub: "Profit mic. Încearcă să negociezi.", reject: "✗  REFUZĂ", rejectSub: "Nu merită. Costurile depășesc beneficiul.", footer: "tripprofit.com — Calculatorul de profit pentru șoferi de TIR din Europa", cta: "Încearcă gratuit →", title: "Cardul tău de cursă — postează-l pe Facebook sau WhatsApp", earn: "💰 Câștigă 3€ pentru fiecare prieten invitat", earnSub: "Postează cardul pe grupurile de Facebook pentru șoferi. Când un prieten se abonează la Pro prin link-ul tău, primești 3€ direct în cont.", refLink: "Vezi link-ul tău de referral →", newTrip: "+ Cursă nouă", download: "📥 Descarcă imaginea" },
  en: { badge: "🚛 Truck trip profit calculator", profitNet: "NET PROFIT", profitKm: "PROFIT / KM", km: "KILOMETERS", accept: "✓  ACCEPT", acceptSub: "Profitable trip. Worth accepting.", negotiate: "⚡  NEGOTIATE", negotiateSub: "Low margin. Try to negotiate.", reject: "✗  REJECT", rejectSub: "Not worth it. Costs exceed revenue.", footer: "tripprofit.com — Profit calculator for truck drivers in Europe", cta: "Try free →", title: "Your trip card — share it on Facebook or WhatsApp", earn: "💰 Earn €3 for every friend you invite", earnSub: "Post the card in Facebook groups for drivers. When a friend subscribes to Pro through your link, you get €3 directly.", refLink: "See your referral link →", newTrip: "+ New trip", download: "📥 Download image" },
  de: { badge: "🚛 LKW-Gewinnrechner", profitNet: "NETTOGEWINN", profitKm: "GEWINN / KM", km: "KILOMETER", accept: "✓  ANNEHMEN", acceptSub: "Rentable Fahrt. Lohnt sich.", negotiate: "⚡  VERHANDELN", negotiateSub: "Geringe Marge. Verhandeln.", reject: "✗  ABLEHNEN", rejectSub: "Nicht rentabel.", footer: "tripprofit.com — Gewinnrechner für LKW-Fahrer in Europa", cta: "Kostenlos testen →", title: "Ihre Fahrkarte — teilen Sie sie auf Facebook oder WhatsApp", earn: "💰 Verdienen Sie 3€ für jeden eingeladenen Freund", earnSub: "Posten Sie die Karte in Facebook-Gruppen für Fahrer. Wenn ein Freund Pro abonniert, erhalten Sie 3€.", refLink: "Ihren Empfehlungslink anzeigen →", newTrip: "+ Neue Fahrt", download: "📥 Bild herunterladen" },
  it: { badge: "🚛 Calcolatore profitto viaggi TIR", profitNet: "PROFITTO NETTO", profitKm: "PROFITTO / KM", km: "CHILOMETRI", accept: "✓  ACCETTA", acceptSub: "Viaggio redditizio. Vale la pena.", negotiate: "⚡  NEGOZIA", negotiateSub: "Margine basso. Negozia.", reject: "✗  RIFIUTA", rejectSub: "Non vale. I costi superano il ricavo.", footer: "tripprofit.com — Calcolatore di profitto per camionisti in Europa", cta: "Prova gratis →", title: "La tua scheda viaggio — condividila su Facebook o WhatsApp", earn: "💰 Guadagna 3€ per ogni amico invitato", earnSub: "Posta la scheda nei gruppi Facebook per autisti. Quando un amico si abbona a Pro tramite il tuo link, ricevi 3€.", refLink: "Vedi il tuo link referral →", newTrip: "+ Nuovo viaggio", download: "📥 Scarica immagine" },
  pl: { badge: "🚛 Kalkulator zysku tras TIR", profitNet: "ZYSK NETTO", profitKm: "ZYSK / KM", km: "KILOMETRY", accept: "✓  PRZYJMIJ", acceptSub: "Opłacalna trasa. Warto przyjąć.", negotiate: "⚡  NEGOCJUJ", negotiateSub: "Niska marża. Negocjuj.", reject: "✗  ODRZUĆ", rejectSub: "Nieopłacalne.", footer: "tripprofit.com — Kalkulator zysku dla kierowców TIR w Europie", cta: "Wypróbuj za darmo →", title: "Twoja karta trasy — udostępnij ją na Facebooku lub WhatsApp", earn: "💰 Zarabiaj 3€ za każdego zaproszonego znajomego", earnSub: "Opublikuj kartę w grupach Facebook dla kierowców. Gdy znajomy subskrybuje Pro przez Twój link, otrzymujesz 3€.", refLink: "Zobacz swój link polecający →", newTrip: "+ Nowa trasa", download: "📥 Pobierz obraz" },
  hu: { badge: "🚛 TIR út nyereség kalkulátor", profitNet: "NETTÓ NYERESÉG", profitKm: "NYERESÉG / KM", km: "KILOMÉTER", accept: "✓  ELFOGAD", acceptSub: "Nyereséges út. Megéri elfogadni.", negotiate: "⚡  TÁRGYAL", negotiateSub: "Alacsony haszon. Tárgyalj.", reject: "✗  ELUTASÍT", rejectSub: "Nem éri meg.", footer: "tripprofit.com — Nyereség kalkulátor TIR sofőröknek Európában", cta: "Próbáld ki ingyen →", title: "Az útkártyád — oszd meg Facebookon vagy WhatsApp-on", earn: "💰 Keress 3€-t minden meghívott barátért", earnSub: "Tedd közzé a kártyát Facebook csoportokban sofőröknek. Amikor egy barátod Pro-ra fizet elő a linked által, kapsz 3€-t.", refLink: "Nézd meg a referral linkedet →", newTrip: "+ Új út", download: "📥 Kép letöltése" },
  bg: { badge: "🚛 Калкулатор печалба курсове ТИР", profitNet: "НЕТНА ПЕЧАЛБА", profitKm: "ПЕЧАЛБА / КМ", km: "КИЛОМЕТРИ", accept: "✓  ПРИЕМИ", acceptSub: "Печелившо пътуване.", negotiate: "⚡  ПРЕГОВАРЯЙ", negotiateSub: "Ниска марж. Преговаряй.", reject: "✗  ОТКАЖИ", rejectSub: "Не си струва.", footer: "tripprofit.com — Калкулатор на печалбата за TIR шофьори в Европа", cta: "Опитай безплатно →", title: "Вашата карта за курс — споделете я във Facebook или WhatsApp", earn: "💰 Спечелете 3€ за всеки поканен приятел", earnSub: "Публикувайте картата в групи за шофьори. Когато приятел се абонира за Pro чрез вашия линк, получавате 3€.", refLink: "Вижте вашия референтен линк →", newTrip: "+ Нов курс", download: "📥 Изтеглете изображение" },
};

function ShareCard() {
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trip, setTrip] = useState<any>(null);
  const [lang, setLang] = useState("ro");

  useEffect(() => {
    const saved = localStorage.getItem("tp_lang") || "ro";
    setLang(saved);
  }, []);

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

    // Background
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, 1200, 630);

    // Grid pattern
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 630); ctx.stroke();
    }
    for (let y = 0; y < 630; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke();
    }

    // Verdict colors
    const verdictColor = trip.verdict === "accept" ? "#22c55e" : trip.verdict === "negotiate" ? "#f5a623" : "#ef4444";
    const verdictBg = trip.verdict === "accept" ? "#052612" : trip.verdict === "negotiate" ? "#2a1e05" : "#1f0a0a";
    const verdictText = trip.verdict === "accept" ? ct.accept : trip.verdict === "negotiate" ? ct.negotiate : ct.reject;
    const verdictSub = trip.verdict === "accept" ? ct.acceptSub : trip.verdict === "negotiate" ? ct.negotiateSub : ct.rejectSub;

    // Left accent bar
    ctx.fillStyle = verdictColor;
    ctx.fillRect(0, 0, 8, 630);

    // Top right glow
    const grd = ctx.createRadialGradient(1100, 100, 0, 1100, 100, 300);
    grd.addColorStop(0, verdictColor + "15");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1200, 630);

    // Logo
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Trip", 60, 65);
    ctx.fillStyle = "#f5a623";
    ctx.fillText("Profit", 108, 65);

    // Badge
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.roundRect(60, 80, 280, 28, 14);
    ctx.fill();
    ctx.font = "12px Arial";
    ctx.fillStyle = "#a5b4fc";
    ctx.fillText(ct.badge, 75, 99);

    // Route
    const fromCap = trip.from.charAt(0).toUpperCase() + trip.from.slice(1);
    const toCap = trip.to.charAt(0).toUpperCase() + trip.to.slice(1);

    ctx.font = "bold 64px Arial";
    let x = 60;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(fromCap, x, 195);
    x += ctx.measureText(fromCap).width + 20;
    ctx.fillStyle = "#f5a623";
    ctx.fillText("→", x, 195);
    x += ctx.measureText("→").width + 20;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(toCap, x, 195);

    // Divider
    ctx.fillStyle = "#2e2e2e";
    ctx.fillRect(60, 215, 1080, 1);

    // Stats
    const stats = [
      { label: ct.profitNet, value: `${parseFloat(trip.profit).toFixed(0)} €`, color: parseFloat(trip.profit) >= 0 ? "#22c55e" : "#ef4444" },
      { label: ct.profitKm, value: `${parseFloat(trip.ppkm).toFixed(3)} €`, color: "#ffffff" },
      { label: ct.km, value: `${trip.km} km`, color: "#ffffff" },
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

    // Divider
    ctx.fillStyle = "#2e2e2e";
    ctx.fillRect(60, 345, 1080, 1);

    // Verdict box
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

    // Footer
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
    link.download = `tripprofit-${trip?.from}-${trip?.to}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  if (!trip) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">Se încarcă...</p>
    </div>
  );

  const ct = CARD_TEXT[lang] || CARD_TEXT.ro;
  const verdictColor = trip.verdict === "accept" ? "#22c55e" : trip.verdict === "negotiate" ? "#f5a623" : "#ef4444";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-1">Trip<span className="text-[#f5a623]">Profit</span></h1>
      <p className="text-gray-400 text-sm mb-8">{ct.title}</p>

      <div className="w-full max-w-4xl">
        <canvas ref={canvasRef} className="rounded-xl w-full border border-[#2e2e2e]" />
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={downloadCard}
          className="bg-[#f5a623] text-black font-bold px-8 py-4 rounded-lg hover:bg-[#e8951a] transition text-lg">
          {ct.download}
        </button>
        <Link href="/trip/new"
          className="border border-[#334155] text-white px-8 py-4 rounded-lg hover:bg-[#1e293b] transition text-lg">
          {ct.newTrip}
        </Link>
        <Link href="/dashboard"
          className="border border-[#334155] text-white px-8 py-4 rounded-lg hover:bg-[#1e293b] transition text-lg">
          Dashboard
        </Link>
      </div>

      <div className="mt-8 bg-[#161616] border border-[#2e2e2e] rounded-xl p-6 max-w-2xl text-center">
        <div style={{ color: verdictColor }} className="text-lg font-bold mb-2">{ct.earn}</div>
        <p className="text-gray-400 text-sm">{ct.earnSub}</p>
        <Link href="/pricing" className="inline-block mt-4 text-[#f5a623] text-sm hover:underline">
          {ct.refLink}
        </Link>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <p className="text-gray-400">Se încarcă...</p>
      </div>
    }>
      <ShareCard />
    </Suspense>
  );
}