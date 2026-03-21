"use client";

import Link from "next/link";
import { useLang } from "./lib/LanguageContext";
import LangSwitcher from "./lib/LangSwitcher";
import { Locale } from "./lib/translations";

const LANDING_TEXT: Record<Locale, {
  badge: string; hero1: string; hero2: string; heroSub: string;
  tryFree: string; signIn: string; exampleTrip: string;
  revenue: string; totalCost: string; netProfit: string; profitKm: string;
  accept: string; acceptSub: string;
  feat1t: string; feat1d: string; feat2t: string; feat2d: string; feat3t: string; feat3d: string;
  featTitle: string; pricingTitle: string; pricingSub: string;
  free: string; popular: string; pro: string; fleet: string;
  freeDesc: string; proDesc: string; fleetDesc: string;
  startFree: string; startPro: string; contactUs: string;
  footer: string;
}> = {
  ro: {
    badge: "🚛 Pentru șoferi și firme mici de transport",
    hero1: "Știi exact cât", hero2: "câștigi per cursă?",
    heroSub: "TripProfit calculează profitul real al fiecărei curse — combustibil, taxe drum, diurnă, costuri fixe. Îți spune instant: ACCEPTĂ, NEGOCIAZĂ sau REFUZĂ.",
    tryFree: "Încearcă gratuit", signIn: "Intră în cont",
    exampleTrip: "Exemplu cursă",
    revenue: "Venit", totalCost: "Cost total", netProfit: "Profit net", profitKm: "Profit / km",
    accept: "ACCEPTĂ", acceptSub: "Cursă profitabilă. Merită acceptată.",
    featTitle: "Tot ce ai nevoie pentru a decide rapid",
    feat1t: "Calculator complet", feat1d: "Combustibil, taxe drum, diurnă, costuri fixe — totul într-un singur calcul.",
    feat2t: "Profit per km și zi", feat2d: "Știi exact cât câștigi pe kilometru și pe zi lucrată.",
    feat3t: "Invită și câștigă", feat3d: "Trimite link-ul tău unui coleg șofer. Când se abonează la Pro primești 3€.",
    pricingTitle: "Prețuri simple", pricingSub: "Începe gratuit. Upgradează când ai nevoie.",
    free: "Free", popular: "CEL MAI POPULAR", pro: "Pro", fleet: "Flotă",
    freeDesc: "Perfect pentru a încerca TripProfit.",
    proDesc: "Pentru șoferii care vor control total.",
    fleetDesc: "Pentru firme cu 2-10 camioane.",
    startFree: "Începe gratuit", startPro: "Începe Pro", contactUs: "Contactează-ne",
    footer: "© 2025 TripProfit. Creat pentru șoferii de TIR din Europa.",
  },
  en: {
    badge: "🚛 For drivers and small transport companies",
    hero1: "Do you know exactly how much", hero2: "you earn per trip?",
    heroSub: "TripProfit calculates the real profit of each trip — fuel, road tolls, allowance, fixed costs. It tells you instantly: ACCEPT, NEGOTIATE or REJECT.",
    tryFree: "Try free", signIn: "Sign in",
    exampleTrip: "Example trip",
    revenue: "Revenue", totalCost: "Total cost", netProfit: "Net profit", profitKm: "Profit / km",
    accept: "ACCEPT", acceptSub: "Profitable trip. Worth accepting.",
    featTitle: "Everything you need to decide fast",
    feat1t: "Complete calculator", feat1d: "Fuel, tolls, allowance, fixed costs — all in one calculation.",
    feat2t: "Profit per km and day", feat2d: "Know exactly how much you earn per kilometer and per working day.",
    feat3t: "Invite and earn", feat3d: "Send your link to a colleague driver. When they subscribe to Pro you get €3.",
    pricingTitle: "Simple pricing", pricingSub: "Start free. Upgrade when you need more.",
    free: "Free", popular: "MOST POPULAR", pro: "Pro", fleet: "Fleet",
    freeDesc: "Perfect for trying TripProfit.",
    proDesc: "For drivers who want full control.",
    fleetDesc: "For companies with 2-10 trucks.",
    startFree: "Start free", startPro: "Start Pro", contactUs: "Contact us",
    footer: "© 2025 TripProfit. Built for truck drivers across Europe.",
  },
  de: {
    badge: "🚛 Für Fahrer und kleine Transportunternehmen",
    hero1: "Wissen Sie genau wie viel", hero2: "Sie pro Fahrt verdienen?",
    heroSub: "TripProfit berechnet den echten Gewinn jeder Fahrt — Kraftstoff, Maut, Tagegeld, Fixkosten. Sofortige Antwort: ANNEHMEN, VERHANDELN oder ABLEHNEN.",
    tryFree: "Kostenlos testen", signIn: "Einloggen",
    exampleTrip: "Beispielfahrt",
    revenue: "Einnahmen", totalCost: "Gesamtkosten", netProfit: "Nettogewinn", profitKm: "Gewinn / km",
    accept: "ANNEHMEN", acceptSub: "Rentable Fahrt. Lohnt sich.",
    featTitle: "Alles für schnelle Entscheidungen",
    feat1t: "Vollständiger Rechner", feat1d: "Kraftstoff, Maut, Tagegeld, Fixkosten — alles in einer Berechnung.",
    feat2t: "Gewinn pro km und Tag", feat2d: "Wissen Sie genau wie viel Sie pro Kilometer und Arbeitstag verdienen.",
    feat3t: "Einladen und verdienen", feat3d: "Schicken Sie Ihren Link an einen Kollegen. Wenn er Pro abonniert erhalten Sie 3€.",
    pricingTitle: "Einfache Preise", pricingSub: "Kostenlos starten. Upgraden wenn nötig.",
    free: "Kostenlos", popular: "AM BELIEBTESTEN", pro: "Pro", fleet: "Flotte",
    freeDesc: "Perfekt zum Ausprobieren.",
    proDesc: "Für Fahrer die volle Kontrolle möchten.",
    fleetDesc: "Für Unternehmen mit 2-10 LKWs.",
    startFree: "Kostenlos starten", startPro: "Pro starten", contactUs: "Kontaktieren",
    footer: "© 2025 TripProfit. Für LKW-Fahrer in ganz Europa.",
  },
  it: {
    badge: "🚛 Per autisti e piccole aziende di trasporto",
    hero1: "Sai esattamente quanto", hero2: "guadagni per viaggio?",
    heroSub: "TripProfit calcola il profitto reale di ogni viaggio — carburante, pedaggi, indennità, costi fissi. Ti dice subito: ACCETTA, NEGOZIA o RIFIUTA.",
    tryFree: "Prova gratis", signIn: "Accedi",
    exampleTrip: "Esempio viaggio",
    revenue: "Ricavo", totalCost: "Costo totale", netProfit: "Profitto netto", profitKm: "Profitto / km",
    accept: "ACCETTA", acceptSub: "Viaggio redditizio. Vale la pena.",
    featTitle: "Tutto il necessario per decidere in fretta",
    feat1t: "Calcolatore completo", feat1d: "Carburante, pedaggi, indennità, costi fissi — tutto in un calcolo.",
    feat2t: "Profitto per km e giorno", feat2d: "Sai esattamente quanto guadagni per chilometro e per giorno lavorativo.",
    feat3t: "Invita e guadagna", feat3d: "Manda il tuo link a un collega autista. Quando si abbona a Pro ricevi 3€.",
    pricingTitle: "Prezzi semplici", pricingSub: "Inizia gratis. Aggiorna quando hai bisogno.",
    free: "Gratuito", popular: "PIÙ POPOLARE", pro: "Pro", fleet: "Flotta",
    freeDesc: "Perfetto per provare TripProfit.",
    proDesc: "Per gli autisti che vogliono il controllo totale.",
    fleetDesc: "Per aziende con 2-10 camion.",
    startFree: "Inizia gratis", startPro: "Inizia Pro", contactUs: "Contattaci",
    footer: "© 2025 TripProfit. Creato per i camionisti europei.",
  },
  pl: {
    badge: "🚛 Dla kierowców i małych firm transportowych",
    hero1: "Czy wiesz dokładnie ile", hero2: "zarabiasz na trasie?",
    heroSub: "TripProfit oblicza realny zysk każdej trasy — paliwo, opłaty, diety, koszty stałe. Odpowiedź natychmiast: PRZYJMIJ, NEGOCJUJ lub ODRZUĆ.",
    tryFree: "Wypróbuj za darmo", signIn: "Zaloguj się",
    exampleTrip: "Przykładowa trasa",
    revenue: "Przychód", totalCost: "Koszt całkowity", netProfit: "Zysk netto", profitKm: "Zysk / km",
    accept: "PRZYJMIJ", acceptSub: "Opłacalna trasa. Warto przyjąć.",
    featTitle: "Wszystko do szybkiej decyzji",
    feat1t: "Pełny kalkulator", feat1d: "Paliwo, opłaty, diety, koszty stałe — wszystko w jednym obliczeniu.",
    feat2t: "Zysk na km i dzień", feat2d: "Wiesz dokładnie ile zarabiasz na kilometr i na dzień pracy.",
    feat3t: "Zaproś i zarabiaj", feat3d: "Wyślij swój link koledze kierowcy. Gdy subskrybuje Pro otrzymujesz 3€.",
    pricingTitle: "Proste ceny", pricingSub: "Zacznij za darmo. Ulepsz kiedy potrzebujesz.",
    free: "Darmowy", popular: "NAJPOPULARNIEJSZY", pro: "Pro", fleet: "Flota",
    freeDesc: "Idealny do wypróbowania TripProfit.",
    proDesc: "Dla kierowców którzy chcą pełnej kontroli.",
    fleetDesc: "Dla firm z 2-10 ciężarówkami.",
    startFree: "Zacznij za darmo", startPro: "Zacznij Pro", contactUs: "Skontaktuj się",
    footer: "© 2025 TripProfit. Stworzony dla kierowców TIR w Europie.",
  },
  hu: {
    badge: "🚛 Sofőröknek és kis fuvarozó cégeknek",
    hero1: "Pontosan tudod mennyit", hero2: "keresel utanként?",
    heroSub: "A TripProfit kiszámítja minden út valódi nyereségét — üzemanyag, útdíj, napidíj, fix költségek. Azonnal megmondja: ELFOGAD, TÁRGYAL vagy ELUTASÍT.",
    tryFree: "Próbáld ki ingyen", signIn: "Bejelentkezés",
    exampleTrip: "Példa út",
    revenue: "Bevétel", totalCost: "Összes költség", netProfit: "Nettó nyereség", profitKm: "Nyereség / km",
    accept: "ELFOGAD", acceptSub: "Nyereséges út. Megéri elfogadni.",
    featTitle: "Minden a gyors döntéshez",
    feat1t: "Teljes kalkulátor", feat1d: "Üzemanyag, útdíj, napidíj, fix költségek — minden egy számításban.",
    feat2t: "Nyereség km-enként és naponta", feat2d: "Pontosan tudod mennyit keresel kilométerenként és munkanaponta.",
    feat3t: "Hívj meg és keress", feat3d: "Küldd el a linkedet egy sofőr kollégának. Ha Pro-ra fizet elő kapsz 3€-t.",
    pricingTitle: "Egyszerű árak", pricingSub: "Kezdd ingyen. Frissíts ha szükséges.",
    free: "Ingyenes", popular: "LEGNÉPSZERŰBB", pro: "Pro", fleet: "Flotta",
    freeDesc: "Tökéletes a TripProfit kipróbálásához.",
    proDesc: "Sofőröknek akik teljes kontrollt akarnak.",
    fleetDesc: "2-10 teherautóval rendelkező cégeknek.",
    startFree: "Kezdd ingyen", startPro: "Kezdd Pro-val", contactUs: "Kapcsolat",
    footer: "© 2025 TripProfit. Európai TIR-sofőröknek készült.",
  },
  bg: {
    badge: "🚛 За шофьори и малки транспортни фирми",
    hero1: "Знаете ли точно колко", hero2: "печелите на курс?",
    heroSub: "TripProfit изчислява реалната печалба на всеки курс — гориво, пътни такси, дневни, постоянни разходи. Незабавен отговор: ПРИЕМИ, ПРЕГОВАРЯЙ или ОТКАЖИ.",
    tryFree: "Опитай безплатно", signIn: "Вход",
    exampleTrip: "Примерен курс",
    revenue: "Приход", totalCost: "Общо разходи", netProfit: "Нетна печалба", profitKm: "Печалба / км",
    accept: "ПРИЕМИ", acceptSub: "Печелившо пътуване. Струва си.",
    featTitle: "Всичко за бързо решение",
    feat1t: "Пълен калкулатор", feat1d: "Гориво, такси, дневни, постоянни разходи — всичко в едно изчисление.",
    feat2t: "Печалба на км и ден", feat2d: "Знаете точно колко печелите на километър и на работен ден.",
    feat3t: "Покани и спечели", feat3d: "Изпрати линка си на колега шофьор. Когато се абонира за Pro получаваш 3€.",
    pricingTitle: "Прости цени", pricingSub: "Започни безплатно. Надгради когато трябва.",
    free: "Безплатно", popular: "НАЙ-ПОПУЛЯРЕН", pro: "Pro", fleet: "Флота",
    freeDesc: "Перфектно за изпробване на TripProfit.",
    proDesc: "За шофьори които искат пълен контрол.",
    fleetDesc: "За фирми с 2-10 камиона.",
    startFree: "Започни безплатно", startPro: "Започни Pro", contactUs: "Свържи се",
    footer: "© 2025 TripProfit. Създаден за TIR шофьори в Европа.",
  },
};

export default function LandingPage() {
  const { locale } = useLang();
  const l = LANDING_TEXT[locale];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="border-b border-[#2e2e2e] px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Trip<span className="text-[#f5a623]">Profit</span></h1>
        <div className="flex items-center gap-4">
          <LangSwitcher />
          <Link href="/login" className="text-sm text-gray-400 hover:text-white px-4 py-2">{l.signIn}</Link>
          <Link href="/register" className="bg-[#f5a623] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#e8951a] transition">{l.tryFree}</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-[#1e1b4b] border border-[#3730a3] text-[#a5b4fc] text-xs font-mono px-4 py-2 rounded-full mb-6">
          {l.badge}
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          {l.hero1}<br />
          <span className="text-[#f5a623]">{l.hero2}</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">{l.heroSub}</p>
        <div className="flex items-center justify-center gap-4 mb-16">
          <Link href="/register" className="bg-[#f5a623] text-black font-bold px-8 py-4 rounded-lg hover:bg-[#e8951a] transition text-lg">{l.tryFree}</Link>
          <Link href="/login" className="border border-[#334155] text-white px-8 py-4 rounded-lg hover:bg-[#1e293b] transition text-lg">{l.signIn}</Link>
        </div>

        <div className="bg-[#161616] border border-[#2e2e2e] rounded-2xl p-8 max-w-md mx-auto text-left">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-4 font-mono">{l.exampleTrip}</div>
          {[
            { label: "București → München", val: "1.800 km" },
            { label: l.revenue, val: "3.200 €" },
            { label: l.totalCost, val: "1.680 €" },
            { label: l.netProfit, val: "1.520 €", green: true },
            { label: l.profitKm, val: "0.844 €/km", green: true },
          ].map((r, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-[#2e2e2e] last:border-0">
              <span className="text-gray-400 text-sm">{r.label}</span>
              <span className={`font-mono text-sm font-medium ${r.green ? "text-green-400" : "text-white"}`}>{r.val}</span>
            </div>
          ))}
          <div className="mt-4 p-4 rounded-xl bg-green-900 border border-green-700 text-center">
            <div className="text-green-400 font-bold font-mono text-xl">{l.accept}</div>
            <div className="text-green-400 text-xs mt-1 opacity-80">{l.acceptSub}</div>
          </div>
        </div>
      </div>

      <div className="bg-[#080f1e] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{l.featTitle}</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: "🧮", title: l.feat1t, desc: l.feat1d },
              { icon: "📊", title: l.feat2t, desc: l.feat2d },
              { icon: "👥", title: l.feat3t, desc: l.feat3d },
            ].map((f, i) => (
              <div key={i} className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{l.pricingTitle}</h2>
          <p className="text-gray-400 mb-12">{l.pricingSub}</p>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8 text-left">
              <div className="text-gray-400 text-sm uppercase tracking-wider font-mono mb-2">{l.free}</div>
              <div className="text-4xl font-bold font-mono mb-2">0 <span className="text-sm font-normal text-gray-400">€ / lună</span></div>
              <p className="text-gray-500 text-xs mb-4">{l.freeDesc}</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li className="flex gap-2"><span className="text-green-400">✓</span> 5 curse / lună</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Verdict de bază</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Istoric curse</li>
              </ul>
              <Link href="/register" className="block text-center border border-[#334155] py-3 rounded-lg hover:bg-[#1e293b] transition text-sm">{l.startFree}</Link>
            </div>
            <div className="bg-[#1e1b4b] border-2 border-[#6366f1] rounded-xl p-8 text-left relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f5a623] text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">{l.popular}</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider font-mono mb-2">{l.pro}</div>
              <div className="text-4xl font-bold font-mono mb-2">7 <span className="text-sm font-normal text-gray-400">€ / lună</span></div>
              <p className="text-gray-400 text-xs mb-4">{l.proDesc}</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li className="flex gap-2"><span className="text-green-400">✓</span> Curse nelimitate</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Raport lunar</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Profil camion</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Invită șoferi — câștigă 3€</li>
              </ul>
              <Link href="/register" className="block text-center bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition text-sm">{l.startPro}</Link>
            </div>
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8 text-left">
              <div className="text-gray-400 text-sm uppercase tracking-wider font-mono mb-2">{l.fleet}</div>
              <div className="text-4xl font-bold font-mono mb-2">29 <span className="text-sm font-normal text-gray-400">€ / lună</span></div>
              <p className="text-gray-500 text-xs mb-4">{l.fleetDesc}</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li className="flex gap-2"><span className="text-green-400">✓</span> Tot din Pro</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Până la 10 șoferi</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Dashboard flotă</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Suport prioritar</li>
              </ul>
              <Link href="/register" className="block text-center border border-[#334155] py-3 rounded-lg hover:bg-[#1e293b] transition text-sm">{l.contactUs}</Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-[#2e2e2e] py-8 text-center text-gray-500 text-sm">
        <div className="font-bold text-white text-lg mb-2">Trip<span className="text-[#f5a623]">Profit</span></div>
        <p>{l.footer}</p>
      </footer>
    </div>
  );
}