"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useLang } from "../lib/LanguageContext";
import LangSwitcher from "../lib/LangSwitcher";

const PRICING_TEXT: Record<string, any> = {
  ro: {
    title: "Prețuri simple pentru orice șofer",
    sub: "Începe gratuit. Upgradează când ai nevoie.",
    current: "Plan curent", upgrade: "Upgradează la Pro", contact: "Contactează-ne",
    popular: "CEL MAI POPULAR", free: "Gratuit", pro: "Pro", fleet: "Flotă",
    freeDesc: "Perfect pentru a încerca TripProfit.",
    proDesc: "Pentru șoferii care vor control total.",
    fleetDesc: "Pentru firme cu 2-10 camioane.",
    freeF: ["5 curse / lună", "Verdict de bază", "Istoric curse"],
    freeNo: ["Raport lunar", "Profil camion", "Invită șoferi"],
    proF: ["Curse nelimitate", "Verdict complet", "Istoric curse", "Raport lunar", "Profil camion", "Invită șoferi — câștigă 3€"],
    fleetF: ["Tot din Pro", "Până la 10 șoferi", "Dashboard flotă", "Suport prioritar"],
    refTitle: "Invită șoferi — câștigă 3€ per invitat",
    refSub: "Trimite link-ul tău unui coleg șofer. Când se abonează la Pro primești 3€ direct în cont.",
    month: "€ / lună", pricing: "Prețuri",
  },
  en: {
    title: "Simple pricing for every driver",
    sub: "Start free. Upgrade when you need more.",
    current: "Current plan", upgrade: "Upgrade to Pro", contact: "Contact us",
    popular: "MOST POPULAR", free: "Free", pro: "Pro", fleet: "Fleet",
    freeDesc: "Perfect for trying TripProfit.",
    proDesc: "For drivers who want full control.",
    fleetDesc: "For companies with 2-10 trucks.",
    freeF: ["5 trips / month", "Basic verdict", "Trip history"],
    freeNo: ["Monthly report", "Truck profile", "Invite drivers"],
    proF: ["Unlimited trips", "Full verdict", "Trip history", "Monthly report", "Truck profile", "Invite drivers — earn €3"],
    fleetF: ["Everything in Pro", "Up to 10 drivers", "Fleet dashboard", "Priority support"],
    refTitle: "Invite drivers — earn €3 per referral",
    refSub: "Send your link to a colleague driver. When they subscribe to Pro you get €3 directly.",
    month: "€ / month", pricing: "Pricing",
  },
  de: {
    title: "Einfache Preise für jeden Fahrer",
    sub: "Kostenlos starten. Upgraden wenn nötig.",
    current: "Aktueller Plan", upgrade: "Auf Pro upgraden", contact: "Kontaktieren",
    popular: "AM BELIEBTESTEN", free: "Kostenlos", pro: "Pro", fleet: "Flotte",
    freeDesc: "Perfekt zum Ausprobieren.",
    proDesc: "Für Fahrer die volle Kontrolle möchten.",
    fleetDesc: "Für Unternehmen mit 2-10 LKWs.",
    freeF: ["5 Fahrten / Monat", "Basis-Urteil", "Fahrthistorie"],
    freeNo: ["Monatsbericht", "LKW-Profil", "Fahrer einladen"],
    proF: ["Unbegrenzte Fahrten", "Vollständiges Urteil", "Fahrthistorie", "Monatsbericht", "LKW-Profil", "Fahrer einladen — 3€ verdienen"],
    fleetF: ["Alles aus Pro", "Bis zu 10 Fahrer", "Flotten-Dashboard", "Prioritätssupport"],
    refTitle: "Fahrer einladen — 3€ pro Empfehlung verdienen",
    refSub: "Schicken Sie Ihren Link an einen Kollegen. Wenn er Pro abonniert erhalten Sie 3€.",
    month: "€ / Monat", pricing: "Preise",
  },
  it: {
    title: "Prezzi semplici per ogni autista",
    sub: "Inizia gratis. Aggiorna quando hai bisogno.",
    current: "Piano attuale", upgrade: "Passa a Pro", contact: "Contattaci",
    popular: "PIÙ POPOLARE", free: "Gratuito", pro: "Pro", fleet: "Flotta",
    freeDesc: "Perfetto per provare TripProfit.",
    proDesc: "Per gli autisti che vogliono il controllo totale.",
    fleetDesc: "Per aziende con 2-10 camion.",
    freeF: ["5 viaggi / mese", "Verdetto base", "Storico viaggi"],
    freeNo: ["Rapporto mensile", "Profilo camion", "Invita autisti"],
    proF: ["Viaggi illimitati", "Verdetto completo", "Storico viaggi", "Rapporto mensile", "Profilo camion", "Invita autisti — guadagna 3€"],
    fleetF: ["Tutto di Pro", "Fino a 10 autisti", "Dashboard flotta", "Supporto prioritario"],
    refTitle: "Invita autisti — guadagna 3€ per ogni invitato",
    refSub: "Manda il tuo link a un collega autista. Quando si abbona a Pro ricevi 3€ direttamente.",
    month: "€ / mese", pricing: "Prezzi",
  },
  pl: {
    title: "Proste ceny dla każdego kierowcy",
    sub: "Zacznij za darmo. Ulepsz kiedy potrzebujesz.",
    current: "Aktualny plan", upgrade: "Przejdź na Pro", contact: "Skontaktuj się",
    popular: "NAJPOPULARNIEJSZY", free: "Darmowy", pro: "Pro", fleet: "Flota",
    freeDesc: "Idealny do wypróbowania TripProfit.",
    proDesc: "Dla kierowców którzy chcą pełnej kontroli.",
    fleetDesc: "Dla firm z 2-10 ciężarówkami.",
    freeF: ["5 tras / miesiąc", "Podstawowy werdykt", "Historia tras"],
    freeNo: ["Raport miesięczny", "Profil ciężarówki", "Zaproś kierowców"],
    proF: ["Nieograniczone trasy", "Pełny werdykt", "Historia tras", "Raport miesięczny", "Profil ciężarówki", "Zaproś kierowców — zarabiaj 3€"],
    fleetF: ["Wszystko z Pro", "Do 10 kierowców", "Panel floty", "Wsparcie priorytetowe"],
    refTitle: "Zaproś kierowców — zarabiaj 3€ za każdego",
    refSub: "Wyślij swój link koledze kierowcy. Gdy subskrybuje Pro otrzymujesz 3€.",
    month: "€ / miesiąc", pricing: "Cennik",
  },
  hu: {
    title: "Egyszerű árak minden sofőrnek",
    sub: "Kezdd ingyen. Frissíts ha szükséges.",
    current: "Jelenlegi terv", upgrade: "Váltás Pro-ra", contact: "Kapcsolat",
    popular: "LEGNÉPSZERŰBB", free: "Ingyenes", pro: "Pro", fleet: "Flotta",
    freeDesc: "Tökéletes a TripProfit kipróbálásához.",
    proDesc: "Sofőröknek akik teljes kontrollt akarnak.",
    fleetDesc: "2-10 teherautóval rendelkező cégeknek.",
    freeF: ["5 út / hónap", "Alapverdikt", "Utak előzményei"],
    freeNo: ["Havi jelentés", "Kamion profil", "Sofőrök meghívása"],
    proF: ["Korlátlan utak", "Teljes verdikt", "Utak előzményei", "Havi jelentés", "Kamion profil", "Sofőrök meghívása — keress 3€-t"],
    fleetF: ["Minden Pro-ból", "Legfeljebb 10 sofőr", "Flotta irányítópult", "Prioritásos támogatás"],
    refTitle: "Hívj meg sofőröket — keress 3€-t meghívásonként",
    refSub: "Küldd el a linkedet egy sofőr kollégának. Ha Pro-ra fizet elő kapsz 3€-t.",
    month: "€ / hónap", pricing: "Árak",
  },
  bg: {
    title: "Прости цени за всеки шофьор",
    sub: "Започни безплатно. Надгради когато трябва.",
    current: "Текущ план", upgrade: "Надгради до Pro", contact: "Свържи се",
    popular: "НАЙ-ПОПУЛЯРЕН", free: "Безплатно", pro: "Pro", fleet: "Флота",
    freeDesc: "Перфектно за изпробване на TripProfit.",
    proDesc: "За шофьори които искат пълен контрол.",
    fleetDesc: "За фирми с 2-10 камиона.",
    freeF: ["5 курса / месец", "Основен вердикт", "История на курсовете"],
    freeNo: ["Месечен отчет", "Профил на камиона", "Покани шофьори"],
    proF: ["Неограничени курсове", "Пълен вердикт", "История на курсовете", "Месечен отчет", "Профил на камиона", "Покани шофьори — спечели 3€"],
    fleetF: ["Всичко от Pro", "До 10 шофьори", "Табло за флота", "Приоритетна поддръжка"],
    refTitle: "Покани шофьори — спечели 3€ за всеки поканен",
    refSub: "Изпрати линка си на колега шофьор. Когато се абонира за Pro получаваш 3€.",
    month: "€ / месец", pricing: "Цени",
  },
};

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const router = useRouter();
  const { locale, tr } = useLang();
  const pt = PRICING_TEXT[locale] || PRICING_TEXT.ro;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) setCurrentPlan(snap.data().plan || "free");
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="bg-[#161616] border-b border-[#2e2e2e] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <Link href="/dashboard" className="hover:text-white">{tr.dashboard}</Link>
          <Link href="/trip/new" className="hover:text-white">{tr.newTrip}</Link>
          <Link href="/history" className="hover:text-white">{tr.history}</Link>
          <Link href="/report" className="hover:text-white">{tr.report}</Link>
          <Link href="/truck" className="hover:text-white">{tr.truck}</Link>
          <Link href="/pricing" className="text-white">{pt.pricing}</Link>
          <button onClick={handleLogout} className="hover:text-white">{tr.logout}</button>
        </div>
        <LangSwitcher />
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{pt.title}</h2>
          <p className="text-gray-400">{pt.sub}</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8 relative">
            <div className="text-sm text-gray-400 uppercase tracking-wider font-mono mb-2">{pt.free}</div>
            <div className="text-4xl font-bold font-mono mb-1">0 <span className="text-sm font-normal text-gray-400">{pt.month}</span></div>
            <p className="text-gray-500 text-xs mb-6">{pt.freeDesc}</p>
            <ul className="space-y-2 mb-8">
              {pt.freeF.map((f: string, j: number) => (
                <li key={j} className="flex items-center gap-2 text-sm"><span className="text-green-400 font-bold">✓</span>{f}</li>
              ))}
              {pt.freeNo.map((f: string, j: number) => (
                <li key={j} className="flex items-center gap-2 text-sm text-gray-600"><span>✗</span>{f}</li>
              ))}
            </ul>
            <button disabled className="w-full py-3 rounded-lg font-semibold text-sm bg-[#2a2a2a] text-gray-500 cursor-not-allowed">
              {currentPlan === "free" ? pt.current : pt.free}
            </button>
          </div>

          <div className="bg-[#1e1b4b] border-2 border-[#6366f1] rounded-xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f5a623] text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">{pt.popular}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider font-mono mb-2">{pt.pro}</div>
            <div className="text-4xl font-bold font-mono mb-1">7 <span className="text-sm font-normal text-gray-400">{pt.month}</span></div>
            <p className="text-gray-400 text-xs mb-6">{pt.proDesc}</p>
            <ul className="space-y-2 mb-8">
              {pt.proF.map((f: string, j: number) => (
                <li key={j} className="flex items-center gap-2 text-sm"><span className="text-green-400 font-bold">✓</span>{f}</li>
              ))}
            </ul>
            <button disabled={currentPlan === "pro"}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition ${currentPlan === "pro" ? "bg-[#2a2a2a] text-gray-500 cursor-not-allowed" : "bg-[#f5a623] text-black hover:bg-[#e8951a]"}`}>
              {currentPlan === "pro" ? pt.current : pt.upgrade}
            </button>
          </div>

          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8 relative">
            <div className="text-sm text-gray-400 uppercase tracking-wider font-mono mb-2">{pt.fleet}</div>
            <div className="text-4xl font-bold font-mono mb-1">29 <span className="text-sm font-normal text-gray-400">{pt.month}</span></div>
            <p className="text-gray-500 text-xs mb-6">{pt.fleetDesc}</p>
            <ul className="space-y-2 mb-8">
              {pt.fleetF.map((f: string, j: number) => (
                <li key={j} className="flex items-center gap-2 text-sm"><span className="text-green-400 font-bold">✓</span>{f}</li>
              ))}
            </ul>
            <a href="mailto:tripprofit.contact@gmail.com"
              className="w-full py-3 rounded-lg font-semibold text-sm border border-[#334155] text-white hover:bg-[#1e293b] transition block text-center">
              {pt.contact}
            </a>
          </div>
        </div>

        <div className="mt-12 bg-[#161616] border border-[#2e2e2e] rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold mb-2">{pt.refTitle}</h3>
          <p className="text-gray-400 text-sm mb-4">{pt.refSub}</p>
          <div className="bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 font-mono text-sm text-[#f5a623] inline-block">
            tripprofit.com/ref/{user?.uid?.slice(0, 8)}
          </div>
        </div>
      </div>
    </div>
  );
}