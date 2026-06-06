"use client";

import Link from "next/link";
import { useLang } from "@/app/lib/LanguageContext";

export default function PrivacyPage() {
  const { locale, setLocale } = useLang();
  const ro = locale === "ro";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#1e1e1e] px-10 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Trip<span className="text-[#f5a623]">Profit</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setLocale("ro")}
              className={locale === "ro" ? "text-[#f5a623] font-semibold" : "text-gray-500 hover:text-gray-300"}
            >
              RO
            </button>
            <span className="text-gray-700">/</span>
            <button
              onClick={() => setLocale("it")}
              className={locale === "it" ? "text-[#f5a623] font-semibold" : "text-gray-500 hover:text-gray-300"}
            >
              IT
            </button>
          </div>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white">
            {ro ? "Intră în cont" : "Accedi"}
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-2">
          {ro ? "Politica de confidențialitate" : "Informativa sulla privacy"}
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          {ro ? "Ultima actualizare: Iunie 2026" : "Ultimo aggiornamento: Giugno 2026"}
        </p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          {/* 1. Operator */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "1. Identitatea operatorului de date" : "1. Identità del titolare del trattamento"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Operatorul de date cu caracter personal este TripProfit, accesibil la tripprofit.ro. Pentru orice întrebări legate de prelucrarea datelor tale personale, ne poți contacta la:"
                : "Il titolare del trattamento dei dati personali è TripProfit, accessibile su tripprofit.ro. Per qualsiasi domanda relativa al trattamento dei tuoi dati personali, puoi contattarci a:"}
            </p>
            <p className="text-sm mt-2">
              <a href="mailto:contact@tripprofit.ro" className="text-[#f5a623] hover:underline">
                contact@tripprofit.ro
              </a>
            </p>
          </section>

          {/* 2. Date colectate */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "2. Ce date colectăm" : "2. Dati che raccogliamo"}
            </h2>
            <p className="text-sm mb-2">
              {ro ? "Colectăm următoarele categorii de date:" : "Raccogliamo le seguenti categorie di dati:"}
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>{ro ? "Date de cont: email, nume, numele firmei" : "Dati dell'account: email, nome, ragione sociale"}</li>
              <li>{ro ? "Date de utilizare: curse salvate, camioane, clienți, facturi, simulări" : "Dati d'uso: viaggi salvati, camion, clienti, fatture, simulazioni"}</li>
              <li>{ro ? "Date tehnice: adresă IP, tipul browserului, date de sesiune" : "Dati tecnici: indirizzo IP, tipo di browser, dati di sessione"}</li>
              <li>{ro ? "Date de plată: procesate exclusiv prin Stripe — nu stocăm date de card" : "Dati di pagamento: elaborati esclusivamente tramite Stripe — non memorizziamo dati della carta"}</li>
              <li>{ro ? "Date de referral: codul de referral folosit la înregistrare (dacă există)" : "Dati referral: il codice referral utilizzato alla registrazione (se presente)"}</li>
            </ul>
          </section>

          {/* 3. Temeiul legal */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "3. Temeiul legal al prelucrării (Art. 6 GDPR)" : "3. Base giuridica del trattamento (Art. 6 GDPR)"}
            </h2>
            <p className="text-sm mb-3">
              {ro
                ? "Prelucrăm datele tale în baza următoarelor temeiuri legale:"
                : "Trattiamo i tuoi dati sulla base delle seguenti basi giuridiche:"}
            </p>
            <div className="space-y-3">
              <div className="bg-[#141414] border border-[#1e1e1e] rounded-lg p-4">
                <p className="text-sm font-medium text-white mb-1">
                  {ro ? "Executarea contractului — Art. 6(1)(b)" : "Esecuzione del contratto — Art. 6(1)(b)"}
                </p>
                <p className="text-sm text-gray-400">
                  {ro
                    ? "Date de cont, date de utilizare, date de plată — necesare pentru furnizarea serviciului TripProfit și procesarea abonamentului."
                    : "Dati dell'account, dati d'uso, dati di pagamento — necessari per fornire il servizio TripProfit e gestire l'abbonamento."}
                </p>
              </div>
              <div className="bg-[#141414] border border-[#1e1e1e] rounded-lg p-4">
                <p className="text-sm font-medium text-white mb-1">
                  {ro ? "Interes legitim — Art. 6(1)(f)" : "Legittimo interesse — Art. 6(1)(f)"}
                </p>
                <p className="text-sm text-gray-400">
                  {ro
                    ? "Date tehnice (IP, sesiune) — pentru securitatea platformei și prevenirea utilizării frauduloase. Interesul nostru legitim nu depășește drepturile tale fundamentale."
                    : "Dati tecnici (IP, sessione) — per la sicurezza della piattaforma e la prevenzione di utilizzi fraudolenti. Il nostro legittimo interesse non prevale sui tuoi diritti fondamentali."}
                </p>
              </div>
              <div className="bg-[#141414] border border-[#1e1e1e] rounded-lg p-4">
                <p className="text-sm font-medium text-white mb-1">
                  {ro ? "Consimțământ — Art. 6(1)(a)" : "Consenso — Art. 6(1)(a)"}
                </p>
                <p className="text-sm text-gray-400">
                  {ro
                    ? "Comunicări de marketing și emailuri drip (newsletters). Poți retrage consimțământul oricând din Setări → Preferințe sau prin link-ul de dezabonare din email."
                    : "Comunicazioni di marketing ed email drip (newsletter). Puoi revocare il consenso in qualsiasi momento da Impostazioni → Preferenze o tramite il link di disiscrizione nell'email."}
                </p>
              </div>
              <div className="bg-[#141414] border border-[#1e1e1e] rounded-lg p-4">
                <p className="text-sm font-medium text-white mb-1">
                  {ro ? "Obligație legală — Art. 6(1)(c)" : "Obbligo legale — Art. 6(1)(c)"}
                </p>
                <p className="text-sm text-gray-400">
                  {ro
                    ? "Date financiare păstrate conform legislației fiscale aplicabile (ex: evidențe contabile)."
                    : "Dati finanziari conservati in conformità con la normativa fiscale applicabile (es: registrazioni contabili)."}
                </p>
              </div>
            </div>
          </section>

          {/* 4. Cum folosim datele */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "4. Cum folosim datele" : "4. Come utilizziamo i dati"}
            </h2>
            <p className="text-sm mb-2">
              {ro ? "Datele tale sunt folosite exclusiv pentru:" : "I tuoi dati sono utilizzati esclusivamente per:"}
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>{ro ? "Furnizarea și îmbunătățirea serviciului TripProfit" : "Erogazione e miglioramento del servizio TripProfit"}</li>
              <li>{ro ? "Comunicări legate de cont, trial și abonament" : "Comunicazioni relative all'account, al periodo di prova e all'abbonamento"}</li>
              <li>{ro ? "Procesarea plăților prin Stripe" : "Elaborazione dei pagamenti tramite Stripe"}</li>
              <li>{ro ? "Trimiterea de emailuri informative (cu acordul tău)" : "Invio di email informative (con il tuo consenso)"}</li>
              <li>{ro ? "Suport tehnic și rezolvarea problemelor" : "Supporto tecnico e risoluzione dei problemi"}</li>
              <li>{ro ? "Gestionarea programului de referral" : "Gestione del programma referral"}</li>
            </ul>
            <p className="text-sm mt-3 text-gray-400">
              {ro
                ? "Nu vindem, nu închiriem și nu distribuim datele tale către terți în scop comercial."
                : "Non vendiamo, affittiamo né distribuiamo i tuoi dati a terzi per scopi commerciali."}
            </p>
          </section>

          {/* 5. Stocare */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "5. Stocarea și securitatea datelor" : "5. Archiviazione e sicurezza dei dati"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Datele sunt stocate în Google Firebase (Firestore) pe servere localizate în Europa (regiunea eur3). Datele sunt protejate prin criptare în tranzit (TLS) și în repaus (AES-256). Accesul la date este restricționat prin reguli de securitate Firebase — fiecare utilizator poate accesa doar propriile date."
                : "I dati sono archiviati su Google Firebase (Firestore) su server situati in Europa (regione eur3). I dati sono protetti da crittografia in transito (TLS) e a riposo (AES-256). L'accesso ai dati è limitato tramite le regole di sicurezza Firebase — ogni utente può accedere solo ai propri dati."}
            </p>
          </section>

          {/* 6. Servicii terte + transferuri internationale */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "6. Servicii terțe și transferuri internaționale" : "6. Servizi di terze parti e trasferimenti internazionali"}
            </h2>
            <p className="text-sm mb-3">
              {ro
                ? "Folosim următorii subprocesori. Unii dintre aceștia pot prelucra date în afara Spațiului Economic European (SEE), inclusiv în SUA, în baza Clauzelor Contractuale Standard aprobate de Comisia Europeană (Art. 46 GDPR):"
                : "Utilizziamo i seguenti responsabili del trattamento. Alcuni di essi possono trattare dati al di fuori dello Spazio Economico Europeo (SEE), inclusi gli USA, sulla base delle Clausole Contrattuali Standard approvate dalla Commissione Europea (Art. 46 GDPR):"}
            </p>
            <ul className="text-sm space-y-2 list-disc list-inside text-gray-400">
              <li>
                <strong className="text-gray-300">Firebase / Google</strong>
                {ro ? " — autentificare și bază de date (servere EU, eur3)" : " — autenticazione e database (server EU, eur3)"}
              </li>
              <li>
                <strong className="text-gray-300">Stripe</strong>
                {ro ? " — procesare plăți (SUA, transferuri acoperite prin SCC)" : " — elaborazione pagamenti (USA, trasferimenti coperti da SCC)"}
              </li>
              <li>
                <strong className="text-gray-300">Vercel</strong>
                {ro ? " — hosting aplicație (SUA, transferuri acoperite prin SCC)" : " — hosting applicazione (USA, trasferimenti coperti da SCC)"}
              </li>
              <li>
                <strong className="text-gray-300">Resend</strong>
                {ro ? " — trimitere emailuri tranzacționale (SUA, transferuri acoperite prin SCC)" : " — invio email transazionali (USA, trasferimenti coperti da SCC)"}
              </li>
            </ul>
            <p className="text-sm mt-3 text-gray-400">
              {ro
                ? "Aceste servicii au propriile politici de confidențialitate și sunt conforme cu GDPR."
                : "Questi servizi hanno le proprie politiche sulla privacy e sono conformi al GDPR."}
            </p>
          </section>

          {/* 7. Drepturile tale */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "7. Drepturile tale (GDPR)" : "7. I tuoi diritti (GDPR)"}
            </h2>
            <p className="text-sm mb-2">
              {ro ? "Conform GDPR, ai dreptul la:" : "Ai sensi del GDPR, hai il diritto di:"}
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>{ro ? "Acces la datele tale personale" : "Accesso ai tuoi dati personali"}</li>
              <li>{ro ? "Rectificarea datelor incorecte" : "Rettifica dei dati inesatti"}</li>
              <li>{ro ? "Ștergerea datelor (\"dreptul de a fi uitat\")" : "Cancellazione dei dati (\"diritto all'oblio\")"}</li>
              <li>{ro ? "Portabilitatea datelor (format CSV/JSON, la cerere)" : "Portabilità dei dati (formato CSV/JSON, su richiesta)"}</li>
              <li>{ro ? "Opoziție față de prelucrarea bazată pe interes legitim" : "Opposizione al trattamento basato su legittimo interesse"}</li>
              <li>{ro ? "Retragerea consimțământului oricând, fără a afecta prelucrările anterioare" : "Revoca del consenso in qualsiasi momento, senza pregiudizio per i trattamenti precedenti"}</li>
              <li>{ro ? "Restricționarea prelucrării în anumite circumstanțe" : "Limitazione del trattamento in determinate circostanze"}</li>
            </ul>
            <p className="text-sm mt-3 text-gray-400">
              {ro
                ? "Pentru a exercita aceste drepturi, contactează-ne la "
                : "Per esercitare questi diritti, contattaci a "}
              <a href="mailto:contact@tripprofit.ro" className="text-[#f5a623] hover:underline">
                contact@tripprofit.ro
              </a>
              {ro ? ". Răspundem în termen de 30 de zile." : ". Risponderemo entro 30 giorni."}
            </p>
          </section>

          {/* 8. Dreptul de plangere la autoritate */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "8. Dreptul de a depune plângere la autoritate" : "8. Diritto di proporre reclamo all'autorità di controllo"}
            </h2>
            <p className="text-sm text-gray-400">
              {ro
                ? "Dacă consideri că prelucrarea datelor tale încalcă GDPR, ai dreptul să depui o plângere la autoritatea de supraveghere competentă:"
                : "Se ritieni che il trattamento dei tuoi dati violi il GDPR, hai il diritto di proporre reclamo all'autorità di controllo competente:"}
            </p>
            <ul className="text-sm mt-2 space-y-2 list-disc list-inside text-gray-400">
              <li>
                {ro ? "România: " : "Romania: "}
                <strong className="text-gray-300">ANSPDCP</strong>
                {" — "}
                <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-[#f5a623] hover:underline">
                  dataprotection.ro
                </a>
              </li>
              <li>
                {ro ? "Italia: " : "Italia: "}
                <strong className="text-gray-300">Garante per la protezione dei dati personali</strong>
                {" — "}
                <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-[#f5a623] hover:underline">
                  garanteprivacy.it
                </a>
              </li>
            </ul>
          </section>

          {/* 9. Cookie-uri */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "9. Cookie-uri" : "9. Cookie"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Folosim doar cookie-uri esențiale pentru funcționarea aplicației (sesiune de autentificare). Nu folosim cookie-uri de tracking sau publicitare. Dacă în viitor vom adăuga instrumente de analiză (ex: Google Analytics), vei fi informat și vei putea refuza prin banner de consimțământ."
                : "Utilizziamo solo cookie essenziali per il funzionamento dell'applicazione (sessione di autenticazione). Non utilizziamo cookie di tracciamento o pubblicitari. Se in futuro aggiungessimo strumenti di analisi (es: Google Analytics), sarai informato e potrai rifiutare tramite banner di consenso."}
            </p>
          </section>

          {/* 10. Retentie */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "10. Retenția datelor" : "10. Conservazione dei dati"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Datele tale sunt păstrate atât timp cât ai un cont activ. La ștergerea contului, datele sunt eliminate în termen de 30 de zile, cu excepția datelor necesare pentru obligații legale (ex: evidențe financiare — păstrate conform legislației fiscale aplicabile, de regulă 5–10 ani)."
                : "I tuoi dati sono conservati per tutto il tempo in cui hai un account attivo. Alla cancellazione dell'account, i dati vengono eliminati entro 30 giorni, ad eccezione dei dati necessari per obblighi legali (es: registrazioni finanziarie — conservate secondo la normativa fiscale applicabile, generalmente 5–10 anni)."}
            </p>
          </section>

          {/* 11. Modificari */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "11. Modificări ale politicii" : "11. Modifiche all'informativa"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Dacă modificăm această politică în mod semnificativ, te vom notifica prin email cu cel puțin 14 zile înainte de intrarea în vigoare. Versiunea curentă este întotdeauna disponibilă la tripprofit.ro/privacy."
                : "Se modifichiamo questa informativa in modo significativo, ti avviseremo via email almeno 14 giorni prima dell'entrata in vigore. La versione aggiornata è sempre disponibile su tripprofit.ro/privacy."}
            </p>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "12. Contact" : "12. Contatto"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Pentru orice întrebări legate de datele tale personale sau pentru exercitarea drepturilor tale:"
                : "Per qualsiasi domanda relativa ai tuoi dati personali o per esercitare i tuoi diritti:"}
              {" "}
              <a href="mailto:contact@tripprofit.ro" className="text-[#f5a623] hover:underline">
                contact@tripprofit.ro
              </a>
            </p>
          </section>

        </div>
      </div>

      <footer className="border-t border-[#1e1e1e] py-6 px-10 flex items-center justify-between mt-10">
        <div className="text-sm font-semibold">Trip<span className="text-[#f5a623]">Profit</span></div>
        <div className="flex gap-6 text-xs text-gray-600">
          <Link href="/terms" className="hover:text-gray-400">
            {ro ? "Termeni" : "Termini"}
          </Link>
          <Link href="/privacy" className="text-gray-400">
            {ro ? "Confidențialitate" : "Privacy"}
          </Link>
        </div>
      </footer>
    </div>
  );
}