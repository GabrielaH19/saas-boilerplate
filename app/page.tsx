"use client";

import Link from "next/link";
import { useLang } from "./lib/LanguageContext";
import LangSwitcher from "./lib/LangSwitcher";

export default function LandingPage() {
  const { tr, locale } = useLang();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#1e1e1e] px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Trip<span className="text-[#f5a623]">Profit</span></div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#functii" className="text-sm text-gray-400 hover:text-white transition">{locale === "it" ? "Funzioni" : "Functii"}</a>
          <a href="#preturi" className="text-sm text-gray-400 hover:text-white transition">{locale === "it" ? "Prezzi" : "Preturi"}</a>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white">{locale === "it" ? "Accedi" : "Intra in cont"}</Link>
          <LangSwitcher />
          <Link href="/register" className="bg-[#f5a623] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#e8951a] transition">
            {locale === "it" ? "Prova gratis" : "Incearca gratuit"}
          </Link>
        </div>
        <div className="flex md:hidden items-center gap-3">
          <LangSwitcher />
          <Link href="/register" className="bg-[#f5a623] text-black text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#e8951a] transition">
            {locale === "it" ? "Prova gratis" : "Incearca gratuit"}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="text-center px-6 pt-24 pb-14">
        <div className="inline-block bg-[#1a1a00] text-[#f5a623] border border-[#3a3000] text-xs px-4 py-2 rounded-full mb-8">
          {locale === "it" ? "Per piccole aziende di trasporto · 1-20 camion" : "Pentru firme mici de transport · 1-20 camioane"}
        </div>
        <h1 className="text-6xl font-semibold leading-tight mb-6 max-w-3xl mx-auto text-white">
          {locale === "it" ? <>In 10 secondi sai se<br />un viaggio <span className="text-[#f5a623]">vale o no.</span></> : <>În 10 secunde știi dacă<br />o cursă <span className="text-[#f5a623]">merită sau nu.</span></>}
        </h1>
        <p className="text-xl text-gray-300 mb-4 max-w-xl mx-auto">
          {locale === "it" ? "Inserisci i dati del viaggio. TripProfit calcola tutto e ti dice subito: ACCETTA, NEGOZIA o RIFIUTA." : "Introduci datele cursei. TripProfit calculează tot și îți spune direct: ACCEPTĂ, NEGOCIAZĂ sau REFUZĂ."}
        </p>
        <p className="text-sm text-gray-500 mb-10 max-w-md mx-auto">
          {locale === "it" ? "Non è un software complesso. È uno strumento che calcola la redditività reale di ogni viaggio." : "Nu este un software complex. Este un instrument care calculează profitabilitatea reală a fiecărei curse."}
        </p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Link href="/register" className="bg-[#f5a623] text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#e8951a] transition text-base">
            {locale === "it" ? "Prova 30 giorni gratis" : "Încearcă 30 zile gratuit"}
          </Link>
          <Link href="/login" className="border border-[#3a3a3a] text-gray-300 px-8 py-4 rounded-lg hover:text-white hover:border-[#555] transition text-base">
            {locale === "it" ? "Accedi" : "Intră în cont"}
          </Link>
        </div>
        <p className="text-xs text-gray-600">{locale === "it" ? "Senza carta di credito. Senza impegni." : "Fără card bancar. Fără angajamente."}</p>
      </div>

      {/* DEMO VERDICT */}
      <div className="max-w-md mx-auto px-6 mb-24">
        <div className="bg-[#0a1f0a] border border-green-900 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-500 mb-3">{locale === "it" ? "Viaggio București → München · 1.200 km · 1.850€" : "Cursă București → München · 1.200 km · 1.850€"}</div>
          <div className="text-5xl font-semibold text-green-400 mb-2">+482 €</div>
          <div className="text-2xl font-semibold text-green-400 mb-3">{locale === "it" ? "ACCETTA" : "ACCEPTĂ"}</div>
          <div className="text-sm text-gray-500">{locale === "it" ? "1.54 €/km · sopra la soglia minima impostata da te" : "1.54 €/km · peste pragul minim setat de tine"}</div>
        </div>
      </div>

      {/* CREDIBILITATE */}
      <div className="border-t border-b border-[#1e1e1e] bg-[#111] py-7 px-6 text-center mb-24">
        <p className="text-base text-gray-300 max-w-lg mx-auto">
          {locale === "it" ? <>Costruito per le piccole aziende di trasporto che gestiscono viaggi internazionali e hanno bisogno di chiarezza finanziaria rapida.{" "}<strong className="text-white">TripProfit calcola prima che appaiano le perdite.</strong></> : <>Construit pentru firmele mici de transport care gestionează curse internaționale și au nevoie de claritate financiară rapidă.{" "}<strong className="text-white">TripProfit calculează înainte să apară pierderile.</strong></>}
        </p>
      </div>

      {/* PROBLEMA */}
      <div className="max-w-4xl mx-auto px-6 mb-24 text-center">
        <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-5">{locale === "it" ? "Il problema" : "Problema"}</div>
        <h2 className="text-4xl font-semibold mb-4 text-white">{locale === "it" ? "Perché le piccole aziende di trasporto perdono soldi?" : "De ce pierd bani firmele mici de transport?"}</h2>
        <p className="text-lg text-gray-400 mb-14">{locale === "it" ? "Non per mancanza di lavoro. Ma per mancanza di una visione chiara sui costi reali." : "Nu din lipsă de muncă. Ci din lipsa unei imagini clare asupra costurilor reale."}</p>
        <div className="grid grid-cols-2 gap-5">
          {(locale === "it" ? [
            { t: "Viaggi accettati sotto il costo reale", d: "Il prezzo negoziato copre il carburante, ma non include leasing, assicurazione e stipendio dell'autista. Senza un calcolo completo, la decisione viene presa senza tutte le informazioni." },
            { t: "Impossibile sapere quale camion perde", d: "Se hai tre camion e uno è in perdita da due mesi, non saprai esattamente quale sia il problema senza un registro chiaro per ogni unità." },
            { t: "Clienti con margine basso e lunghi tempi di pagamento", d: "Alcuni clienti portano grandi volumi di viaggi, ma a prezzi bassi e con termini di pagamento di 60-90 giorni. L'impatto reale sulla liquidità diventa visibile solo dopo alcuni mesi." },
            { t: "Blocchi di liquidità difficili da anticipare", d: "Le fatture emesse non si trasformano automaticamente in denaro disponibile. Tra il momento della prestazione e quello dell'incasso, i costi fissi continuano a scorrere." },
          ] : [
            { t: "Curse acceptate sub costul real", d: "Prețul negociat acoperă combustibilul, dar nu include leasing-ul, asigurarea și salariul șoferului. Fără un calcul complet, decizia este luată fără toate informațiile necesare." },
            { t: "Imposibil de știut care camion produce pierderi", d: "Dacă ai trei camioane și unul funcționează în pierdere de două luni, nu vei ști exact care este problema fără o evidență clară pe fiecare unitate." },
            { t: "Clienți cu marjă mică și termene lungi de plată", d: "Unii clienți aduc volume mari de curse, dar la prețuri mici și cu termene de plată de 60-90 zile. Impactul real asupra lichidității firmei devine vizibil abia după câteva luni." },
            { t: "Blocaje de lichiditate greu de anticipat", d: "Facturile emise nu se transformă automat în bani disponibili. Între momentul prestării serviciului și cel al încasării, costurile fixe continuă să curgă." },
          ]).map((item, i) => (
            <div key={i} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-7 text-left">
              <div className="text-lg font-semibold text-white mb-3">{item.t}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{item.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SOLUTIA */}
      <div id="functii" className="bg-[#0a0a0a] border-t border-b border-[#1e1e1e] py-24 px-6 mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-5">{locale === "it" ? "Funzionalità" : "Funcționalități"}</div>
          <h2 className="text-4xl font-semibold mb-4 text-white">{locale === "it" ? "Cosa fa TripProfit per la tua azienda" : "Ce face TripProfit pentru firma ta"}</h2>
          <p className="text-lg text-gray-400 mb-14">{locale === "it" ? "Tutte le informazioni rilevanti, disponibili immediatamente, senza cercarle tu." : "Toate informațiile relevante, disponibile imediat, fără să le cauți tu."}</p>
          <div className="grid grid-cols-3 gap-5">
            {(locale === "it" ? [
              { n: "01", t: "Verdetto istantaneo per viaggio", d: "Inserisci i dati del viaggio e ricevi subito il verdetto: ACCETTA, NEGOZIA o RIFIUTA, basato sui costi reali del tuo camion." },
              { n: "02", t: "Report per camion", d: "Visualizzi il profitto, il costo per km e il numero di viaggi per ogni camion della flotta. Identifichi subito le unità con prestazioni scarse." },
              { n: "03", t: "Punteggio di rischio per cliente", d: "Ogni cliente riceve un punteggio calcolato automaticamente in base al profitto generato, al prezzo medio per km e ai tempi di pagamento rispettati." },
              { n: "04", t: "Avviso prima del blocco finanziario", d: "Quando la somma delle fatture in scadenza non copre gli obblighi del mese, ricevi una notifica nell'app. Hai tempo per agire prima che appaia il problema." },
              { n: "05", t: "Costo reale per km", d: "Calcolato automaticamente in base ai dati inseriti da te: leasing, assicurazione, stipendio, carburante. Ogni viaggio viene valutato rispetto a questo costo." },
              { n: "06", t: "Notifiche automatiche", d: "L'app ti invia avvisi direttamente nella dashboard quando un camion registra perdite o quando un cliente supera il termine di pagamento." },
            ] : [
              { n: "01", t: "Verdict instant per cursă", d: "Introduci datele cursei și primești imediat verdictul: ACCEPTĂ, NEGOCIAZĂ sau REFUZĂ, bazat pe costurile reale ale camionului tău." },
              { n: "02", t: "Raport per camion", d: "Vizualizezi profitul, costul per km și numărul de curse pentru fiecare camion din flotă. Identifici imediat unitățile cu performanță slabă." },
              { n: "03", t: "Scor de risc per client", d: "Fiecare client primește un scor calculat automat pe baza profitului generat, a prețului mediu per km și a termenelor de plată respectate." },
              { n: "04", t: "Alertă înainte de blocaj financiar", d: "Când suma facturilor scadente nu acoperă obligațiile lunii, primești o notificare în aplicație. Ai timp să acționezi înainte să apară problema." },
              { n: "05", t: "Cost real per km", d: "Calculat automat pe baza datelor introduse de tine: leasing, asigurare, salariu, combustibil. Fiecare cursă este evaluată față de acest cost." },
              { n: "06", t: "Notificări automate", d: "Aplicația îți transmite alerte direct în dashboard când un camion înregistrează pierderi sau când un client depășește termenul de plată." },
            ]).map((f, i) => (
              <div key={i} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6 text-left">
                <div className="text-xs text-[#f5a623] mb-3">{f.n}</div>
                <div className="text-base font-semibold text-white mb-2">{f.t}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{f.d}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-7 max-w-xl mx-auto mt-12 text-left">
            <div className="text-base text-gray-300 mb-3 italic">{locale === "it" ? '"Un altro software complicato che non ho tempo di imparare?"' : '"Încă un software complicat pe care nu am timp să îl învăț?"'}</div>
            <div className="text-sm text-gray-400 leading-relaxed">
              {locale === "it" ? "La configurazione richiede circa due minuti. Inserisci i costi dell'azienda una sola volta, e da lì ogni viaggio viene calcolato automaticamente. Non è richiesta esperienza tecnica." : "Configurarea durează aproximativ două minute. Introduci costurile firmei o singură dată, iar de acolo fiecare cursă este calculată automat. Nu este necesară experiență tehnică."}
            </div>
          </div>
        </div>
      </div>

      {/* PRETURI */}
      <div id="preturi" className="max-w-4xl mx-auto px-6 mb-24 text-center">
        <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-5">{locale === "it" ? "Prezzi" : "Prețuri"}</div>
        <h2 className="text-4xl font-semibold mb-4 text-white">{locale === "it" ? "Chiaro e prevedibile." : "Clar și previzibil."}</h2>
        <p className="text-lg text-gray-400 mb-4">{locale === "it" ? "30 giorni gratis per qualsiasi piano. Senza carta di credito alla registrazione." : "30 de zile gratuit pentru orice plan. Fără card bancar la înregistrare."}</p>
        <p className="text-sm text-gray-600 mb-14">
          {locale === "it" ? "Dopo il periodo di prova, scegli il piano adatto alla tua azienda e lo attivi direttamente dall'app, nella sezione Prezzi." : "După perioada de test, alegi planul potrivit firmei tale și îl activezi direct din aplicație, din secțiunea Prețuri."}
        </p>
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-8 text-left">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Basic</div>
            <div className="text-5xl font-semibold text-white mb-1"><sup className="text-xl">€</sup>30<sub className="text-sm font-normal text-gray-500">{locale === "it" ? "/mese" : "/lună"}</sub></div>
            <div className="text-sm text-gray-400 mb-6 mt-2">{locale === "it" ? "Per le aziende che vogliono eliminare i viaggi non redditizi" : "Pentru firmele care vor să elimine cursele neprofitabile"}</div>
            <div className="border-t border-[#2a2a2a] pt-5 mb-7 space-y-2.5">
              {(locale === "it" ? ["Calcolatore viaggio con verdetto istantaneo", "Costo reale per km", "1 camion", "Storico viaggi"] : ["Calculator cursă cu verdict instant", "Cost real per km", "1 camion", "Istoric curse"]).map(f => (
                <div key={f} className="flex gap-2 text-sm text-gray-300"><span className="text-green-400">✓</span>{f}</div>
              ))}
              {(locale === "it" ? ["Report per camion", "Report per cliente", "Cashflow tracking"] : ["Raport per camion", "Raport per client", "Cashflow tracking"]).map(f => (
                <div key={f} className="flex gap-2 text-sm text-gray-600"><span>✗</span>{f}</div>
              ))}
            </div>
            <Link href="/register" className="block text-center border border-[#333] text-white py-3 rounded-lg text-sm hover:bg-[#1e1e1e] transition">
              {locale === "it" ? "Inizia gratis" : "Începe gratuit"}
            </Link>
          </div>

          <div className="bg-[#16143a] border-2 border-[#4f46e5] rounded-xl p-8 text-left relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f5a623] text-black text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
              {locale === "it" ? "Il più scelto" : "Cel mai ales"}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Pro</div>
            <div className="text-5xl font-semibold text-white mb-1"><sup className="text-xl">€</sup>49<sub className="text-sm font-normal text-gray-500">{locale === "it" ? "/mese" : "/lună"}</sub></div>
            <div className="text-sm text-gray-400 mb-6 mt-2">{locale === "it" ? "Per le aziende che vogliono visibilità completa sulle finanze" : "Pentru firmele care vor vizibilitate completă asupra finanțelor"}</div>
            <div className="border-t border-[#2a2a2a] pt-5 mb-7 space-y-2.5">
              {(locale === "it" ? ["Tutto di Basic", "Camion illimitati", "Report per camion", "Report per cliente con punteggio rischio", "Dashboard generale azienda", "Avvisi automatici costi superati"] : ["Tot ce include Basic", "Camioane nelimitate", "Raport per camion", "Raport per client cu scor de risc", "Dashboard general firmă", "Alerte automate costuri depășite"]).map(f => (
                <div key={f} className="flex gap-2 text-sm text-gray-300"><span className="text-green-400">✓</span>{f}</div>
              ))}
              {(locale === "it" ? ["Cashflow tracking"] : ["Cashflow tracking"]).map(f => (
                <div key={f} className="flex gap-2 text-sm text-gray-600"><span>✗</span>{f}</div>
              ))}
            </div>
            <Link href="/register" className="block text-center bg-[#4f46e5] text-white py-3 rounded-lg text-sm hover:bg-[#4338ca] transition font-semibold">
              {locale === "it" ? "Inizia gratis" : "Începe gratuit"}
            </Link>
          </div>

          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-8 text-left">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Premium</div>
            <div className="text-5xl font-semibold text-white mb-1"><sup className="text-xl">€</sup>79<sub className="text-sm font-normal text-gray-500">{locale === "it" ? "/mese" : "/lună"}</sub></div>
            <div className="text-sm text-gray-400 mb-6 mt-2">{locale === "it" ? "Per le aziende che vogliono il controllo finanziario completo" : "Pentru firmele care vor control financiar complet"}</div>
            <div className="border-t border-[#2a2a2a] pt-5 mb-7 space-y-2.5">
              {(locale === "it" ? ["Tutto di Pro", "Cashflow tracking", "Avviso blocco liquidità", "Punteggio rischio dettagliato per cliente", "Simulazioni finanziarie", "Raccomandazioni automatiche", "Assistenza prioritaria"] : ["Tot ce include Pro", "Cashflow tracking", "Alertă blocaj de lichiditate", "Scor de risc detaliat per client", "Simulări financiare", "Recomandări automate", "Asistență prioritară"]).map(f => (
                <div key={f} className="flex gap-2 text-sm text-gray-300"><span className="text-green-400">✓</span>{f}</div>
              ))}
            </div>
            <Link href="/register" className="block text-center border border-[#333] text-white py-3 rounded-lg text-sm hover:bg-[#1e1e1e] transition">
              {locale === "it" ? "Inizia gratis" : "Începe gratuit"}
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-[#161616] border border-[#2a2a2a] rounded-xl p-5 max-w-xl mx-auto text-left">
          <div className="text-sm font-semibold text-white mb-2">{locale === "it" ? "Come attivi il piano dopo il periodo di prova?" : "Cum activezi planul după perioada de test?"}</div>
          <div className="text-sm text-gray-400 leading-relaxed">
            {locale === "it" ? <>Alla fine dei 30 giorni gratuiti, entri nell'app nella sezione <strong className="text-white">Prezzi</strong> e selezioni il piano adatto. L'attivazione richiede meno di un minuto. I tuoi dati rimangono intatti indipendentemente dal piano scelto.</> : <>La finalul celor 30 de zile gratuite, intri în aplicație la secțiunea <strong className="text-white">Prețuri</strong> și selectezi planul potrivit. Activarea durează mai puțin de un minut. Datele tale rămân intacte indiferent de planul ales.</>}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0a0a0a] border-t border-[#1e1e1e] py-24 px-6 text-center">
        <h2 className="text-4xl font-semibold mb-5 text-white">
          {locale === "it" ? <>Pronto ad avere il controllo<br />della tua azienda?</> : <>Gata să ai control<br />asupra firmei tale?</>}
        </h2>
        <p className="text-lg text-gray-400 mb-10">{locale === "it" ? "Configuri l'azienda in due minuti. Il primo viaggio calcolato subito." : "Configurezi firma în două minute. Prima cursă calculată imediat."}</p>
        <Link href="/register" className="bg-[#f5a623] text-black font-semibold px-10 py-4 rounded-lg hover:bg-[#e8951a] transition text-base inline-block">
          {locale === "it" ? "Prova 30 giorni gratis" : "Încearcă 30 zile gratuit"}
        </Link>
        <p className="text-sm text-gray-600 mt-5">{locale === "it" ? "Senza carta di credito. Senza impegni. Puoi annullare in qualsiasi momento." : "Fără card bancar. Fără angajamente. Poți anula oricând."}</p>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#1e1e1e] py-6 px-10 flex items-center justify-between">
        <div className="text-sm font-semibold">Trip<span className="text-[#f5a623]">Profit</span></div>
        <div className="flex gap-6 text-sm text-gray-600">
          <Link href="/terms" className="hover:text-gray-400">{locale === "it" ? "Termini e condizioni" : "Termeni și condiții"}</Link>
          <Link href="/privacy" className="hover:text-gray-400">{locale === "it" ? "Politica sulla privacy" : "Politica de confidențialitate"}</Link>
          <span>contact@tripprofit.ro</span>
        </div>
      </footer>

    </div>
  );
}
