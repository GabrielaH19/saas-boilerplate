"use client";

import Link from "next/link";
import { useLang } from "@/app/lib/LanguageContext";

export default function TermsPage() {
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
          {ro ? "Termeni și condiții" : "Termini e condizioni"}
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          {ro ? "Ultima actualizare: Iunie 2026" : "Ultimo aggiornamento: Giugno 2026"}
        </p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          {/* 1. Acceptare */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "1. Acceptarea termenilor" : "1. Accettazione dei termini"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Prin accesarea și utilizarea platformei TripProfit, ești de acord cu acești termeni și condiții. Dacă nu ești de acord cu oricare dintre aceștia, te rugăm să nu folosești serviciul. Continuarea utilizării serviciului după publicarea unor modificări constituie acceptarea acestora."
                : "Accedendo e utilizzando la piattaforma TripProfit, accetti questi termini e condizioni. Se non sei d'accordo con uno qualsiasi di essi, ti preghiamo di non utilizzare il servizio. Il proseguimento dell'utilizzo del servizio dopo la pubblicazione di modifiche costituisce accettazione delle stesse."}
            </p>
          </section>

          {/* 2. Descriere serviciu */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "2. Descrierea serviciului" : "2. Descrizione del servizio"}
            </h2>
            <p className="text-sm">
              {ro
                ? "TripProfit este o platformă software destinată firmelor mici de transport rutier de marfă (1–20 camioane). Serviciul oferă instrumente pentru calculul profitabilității curselor, gestionarea camioanelor, urmărirea clienților și monitorizarea cashflow-ului. TripProfit furnizează calcule estimative cu caracter orientativ — a se vedea secțiunea 8."
                : "TripProfit è una piattaforma software destinata alle piccole imprese di trasporto merci su strada (1–20 camion). Il servizio offre strumenti per il calcolo della redditività dei viaggi, la gestione dei camion, il monitoraggio dei clienti e del flusso di cassa. TripProfit fornisce calcoli stimati con carattere orientativo — vedere sezione 8."}
            </p>
          </section>

          {/* 3. Cont utilizator */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "3. Contul de utilizator" : "3. Account utente"}
            </h2>
            <p className="text-sm mb-2">
              {ro
                ? "Pentru a utiliza TripProfit trebuie să creezi un cont cu o adresă de email validă. Ești responsabil pentru:"
                : "Per utilizzare TripProfit è necessario creare un account con un indirizzo email valido. Sei responsabile di:"}
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>{ro ? "Menținerea confidențialității parolei" : "Mantenere la riservatezza della password"}</li>
              <li>{ro ? "Toate activitățile care au loc în contul tău" : "Tutte le attività che avvengono nel tuo account"}</li>
              <li>{ro ? "Notificarea imediată a oricărei utilizări neautorizate" : "Notifica immediata di qualsiasi utilizzo non autorizzato"}</li>
              <li>{ro ? "Acuratețea datelor introduse în platformă" : "L'accuratezza dei dati inseriti nella piattaforma"}</li>
            </ul>
          </section>

          {/* 4. Planuri si plati */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "4. Planuri, plăți și abonamente" : "4. Piani, pagamenti e abbonamenti"}
            </h2>
            <p className="text-sm mb-2">
              {ro
                ? "TripProfit oferă mai multe planuri de abonament lunar, ale căror prețuri curente sunt afișate pe pagina de prețuri de la tripprofit.ro/pricing. Toate planurile includ o perioadă de testare gratuită de 30 de zile."
                : "TripProfit offre diversi piani di abbonamento mensile, i cui prezzi aggiornati sono visualizzati nella pagina prezzi su tripprofit.ro/pricing. Tutti i piani includono un periodo di prova gratuito di 30 giorni."}
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>{ro ? "Plățile se procesează lunar prin Stripe" : "I pagamenti vengono elaborati mensilmente tramite Stripe"}</li>
              <li>
                {ro
                  ? "Abonamentul se reînnoiește automat la fiecare 30 de zile — vei primi un email de notificare cu cel puțin 7 zile înainte de reînnoire"
                  : "L'abbonamento si rinnova automaticamente ogni 30 giorni — riceverai un'email di notifica almeno 7 giorni prima del rinnovo"}
              </li>
              <li>{ro ? "Poți anula abonamentul oricând din Setări → Abonament, fără penalități" : "Puoi annullare l'abbonamento in qualsiasi momento da Impostazioni → Abbonamento, senza penali"}</li>
              <li>{ro ? "La anulare, accesul rămâne activ până la sfârșitul perioadei plătite" : "Dopo l'annullamento, l'accesso rimane attivo fino alla fine del periodo pagato"}</li>
              <li>{ro ? "Nu se oferă rambursări pentru perioadele deja plătite" : "Non vengono effettuati rimborsi per i periodi già pagati"}</li>
              <li>{ro ? "Prețurile pot fi modificate cu notificare prealabilă de 30 de zile prin email" : "I prezzi possono essere modificati con preavviso di 30 giorni via email"}</li>
            </ul>
          </section>

          {/* 5. Perioada de trial */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "5. Perioada de testare gratuită (trial)" : "5. Periodo di prova gratuito (trial)"}
            </h2>
            <p className="text-sm">
              {ro
                ? "La înregistrare primești acces gratuit la planul Premium timp de 30 de zile, fără a introduce date de card. La expirarea trialului, accesul la funcționalitățile premium este suspendat. Pentru a continua să folosești TripProfit este necesar să alegi un plan plătit. Nu se percepe nicio sumă automat fără acordul tău explicit."
                : "Alla registrazione ricevi accesso gratuito al piano Premium per 30 giorni, senza inserire dati della carta. Alla scadenza del trial, l'accesso alle funzionalità premium viene sospeso. Per continuare a utilizzare TripProfit è necessario scegliere un piano a pagamento. Non viene addebitato alcun importo automaticamente senza il tuo esplicito consenso."}
            </p>
          </section>

          {/* 6. Program referral */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "6. Programul de referral" : "6. Programma referral"}
            </h2>
            <p className="text-sm mb-2">
              {ro
                ? "TripProfit oferă un program de recompense pentru referral cu următoarele condiții:"
                : "TripProfit offre un programma di ricompense referral con le seguenti condizioni:"}
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>{ro ? "Recompensa: 10€ per referral confirmat" : "Ricompensa: 10€ per referral confermato"}</li>
              <li>{ro ? "Limită: maximum 4 referral-uri recompensate pe lună calendaristică" : "Limite: massimo 4 referral premiati per mese solare"}</li>
              <li>{ro ? "Creditul se acordă după prima plată a utilizatorului referit" : "Il credito viene assegnato dopo il primo pagamento dell'utente referito"}</li>
              <li>{ro ? "Referral-urile frauduloase (conturi false, auto-referral) duc la suspendarea contului" : "I referral fraudolenti (account falsi, auto-referral) comportano la sospensione dell'account"}</li>
              <li>{ro ? "TripProfit își rezervă dreptul de a modifica sau încheia programul de referral oricând" : "TripProfit si riserva il diritto di modificare o terminare il programma referral in qualsiasi momento"}</li>
            </ul>
          </section>

          {/* 7. Utilizare acceptabila */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "7. Utilizare acceptabilă" : "7. Utilizzo accettabile"}
            </h2>
            <p className="text-sm mb-2">
              {ro ? "Nu este permisă utilizarea TripProfit pentru:" : "Non è consentito utilizzare TripProfit per:"}
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>{ro ? "Activități ilegale sau frauduloase" : "Attività illegali o fraudolente"}</li>
              <li>{ro ? "Tentative de acces neautorizat la sistemele noastre" : "Tentativi di accesso non autorizzato ai nostri sistemi"}</li>
              <li>{ro ? "Revânzarea sau redistribuirea serviciului fără acordul nostru scris" : "Rivendita o ridistribuzione del servizio senza nostro consenso scritto"}</li>
              <li>{ro ? "Inginerie inversă sau decompilarea platformei" : "Ingegneria inversa o decompilazione della piattaforma"}</li>
              <li>{ro ? "Introducerea intenționată de date false pentru a manipula rezultatele" : "Inserimento intenzionale di dati falsi per manipolare i risultati"}</li>
            </ul>
          </section>

          {/* 8. DISCLAIMER CALCULE - important legal */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "8. Caracterul estimativ al calculelor" : "8. Natura estimativa dei calcoli"}
            </h2>
            <div className="bg-[#1a1400] border border-[#f5a62330] rounded-lg p-4">
              <p className="text-sm text-gray-300">
                {ro
                  ? "TripProfit oferă instrumente de calcul și estimare cu caracter orientativ. Toate calculele — inclusiv profitabilitate, cashflow și simulări — sunt estimative și se bazează exclusiv pe datele introduse de utilizator. Rezultatele nu constituie consultanță financiară, fiscală sau juridică și nu garantează rezultate reale de afaceri. Utilizatorul este singurul responsabil pentru deciziile comerciale luate pe baza datelor din platformă. TripProfit nu poate fi tras la răspundere pentru pierderile rezultate din decizii bazate pe calculele platformei."
                  : "TripProfit offre strumenti di calcolo e stima con carattere orientativo. Tutti i calcoli — inclusi redditività, flusso di cassa e simulazioni — sono stime e si basano esclusivamente sui dati inseriti dall'utente. I risultati non costituiscono consulenza finanziaria, fiscale o legale e non garantiscono risultati aziendali reali. L'utente è l'unico responsabile delle decisioni commerciali prese sulla base dei dati della piattaforma. TripProfit non può essere ritenuta responsabile per le perdite derivanti da decisioni basate sui calcoli della piattaforma."}
              </p>
            </div>
          </section>

          {/* 9. Proprietate intelectuala */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "9. Proprietate intelectuală" : "9. Proprietà intellettuale"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Toate elementele platformei TripProfit — cod, design, conținut, algoritmi, mărci — sunt proprietatea exclusivă a TripProfit. Nu ai dreptul să copiezi, modifici, distribuiești sau folosești în scop comercial niciun element fără permisiune explicită scrisă."
                : "Tutti gli elementi della piattaforma TripProfit — codice, design, contenuti, algoritmi, marchi — sono di proprietà esclusiva di TripProfit. Non hai il diritto di copiare, modificare, distribuire o utilizzare commercialmente nessun elemento senza esplicita autorizzazione scritta."}
            </p>
          </section>

          {/* 10. Disponibilitate */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "10. Disponibilitatea serviciului" : "10. Disponibilità del servizio"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Ne străduim să menținem platforma disponibilă 24/7, dar nu garantăm disponibilitatea neîntreruptă. Ne rezervăm dreptul de a efectua întreținere și actualizări care pot cauza întreruperi temporare. În cazul unor întreruperi prelungite (peste 48 de ore consecutive), utilizatorii afectați pot solicita o extindere a perioadei de abonament."
                : "Ci impegniamo a mantenere la piattaforma disponibile 24/7, ma non garantiamo la disponibilità ininterrotta. Ci riserviamo il diritto di effettuare manutenzione e aggiornamenti che possono causare interruzioni temporanee. In caso di interruzioni prolungate (oltre 48 ore consecutive), gli utenti interessati possono richiedere un'estensione del periodo di abbonamento."}
            </p>
          </section>

          {/* 11. Limitarea raspunderii */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "11. Limitarea răspunderii" : "11. Limitazione di responsabilità"}
            </h2>
            <p className="text-sm">
              {ro
                ? "În măsura permisă de lege, răspunderea totală a TripProfit față de tine pentru orice daune directe nu va depăși suma plătită de tine în ultimele 3 luni calendaristice. TripProfit nu este răspunzătoare pentru daune indirecte, pierderi de profit, pierdere de date sau întreruperi de activitate."
                : "Nella misura consentita dalla legge, la responsabilità totale di TripProfit nei tuoi confronti per qualsiasi danno diretto non supererà l'importo da te pagato negli ultimi 3 mesi solari. TripProfit non è responsabile per danni indiretti, perdita di profitti, perdita di dati o interruzioni dell'attività."}
            </p>
          </section>

          {/* 12. Forta majora */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "12. Forță majoră" : "12. Forza maggiore"}
            </h2>
            <p className="text-sm">
              {ro
                ? "TripProfit nu este răspunzătoare pentru neîndeplinirea obligațiilor cauzată de evenimente în afara controlului său rezonabil, inclusiv dar fără a se limita la: defecțiuni ale infrastructurii tehnice terțe, dezastre naturale, atacuri cibernetice sau modificări legislative."
                : "TripProfit non è responsabile per il mancato adempimento degli obblighi causato da eventi al di fuori del suo ragionevole controllo, inclusi ma non limitati a: guasti dell'infrastruttura tecnica di terze parti, disastri naturali, attacchi informatici o modifiche legislative."}
            </p>
          </section>

          {/* 13. Modificarea termenilor */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "13. Modificarea termenilor" : "13. Modifica dei termini"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Ne rezervăm dreptul de a modifica acești termeni oricând. Vei fi notificat prin email cu cel puțin 14 zile înainte de intrarea în vigoare a modificărilor semnificative. Versiunea curentă este întotdeauna disponibilă la tripprofit.ro/terms."
                : "Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Sarai avvisato via email almeno 14 giorni prima dell'entrata in vigore di modifiche significative. La versione aggiornata è sempre disponibile su tripprofit.ro/terms."}
            </p>
          </section>

          {/* 14. Nulitate partiala */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "14. Nulitate parțială" : "14. Nullità parziale"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Dacă orice prevedere a acestor termeni este considerată invalidă sau inaplicabilă de o instanță competentă, celelalte prevederi rămân în vigoare și continuă să producă efecte juridice depline."
                : "Se qualsiasi disposizione di questi termini viene ritenuta non valida o inapplicabile da un tribunale competente, le altre disposizioni rimangono in vigore e continuano a produrre pieno effetto giuridico."}
            </p>
          </section>

          {/* 15. Legea aplicabila */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "15. Legea aplicabilă și jurisdicția" : "15. Legge applicabile e giurisdizione"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Acești termeni sunt guvernați de legislația română și de dreptul Uniunii Europene aplicabil. Orice litigiu care nu poate fi soluționat pe cale amiabilă va fi supus jurisdicției instanțelor competente din România. Utilizatorii din Italia beneficiază de protecțiile obligatorii prevăzute de legislația italiană aplicabilă în materie de consum și servicii digitale."
                : "Questi termini sono regolati dalla legislazione rumena e dal diritto dell'Unione Europea applicabile. Qualsiasi controversia che non possa essere risolta in via amichevole sarà sottoposta alla giurisdizione dei tribunali competenti in Romania. Gli utenti in Italia beneficiano delle protezioni obbligatorie previste dalla normativa italiana applicabile in materia di consumo e servizi digitali."}
            </p>
          </section>

          {/* 16. Contact */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              {ro ? "16. Contact" : "16. Contatto"}
            </h2>
            <p className="text-sm">
              {ro
                ? "Pentru orice întrebări legate de acești termeni, ne poți contacta la:"
                : "Per qualsiasi domanda relativa a questi termini, puoi contattarci a:"}
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
          <Link href="/terms" className="text-gray-400">
            {ro ? "Termeni" : "Termini"}
          </Link>
          <Link href="/privacy" className="hover:text-gray-400">
            {ro ? "Confidențialitate" : "Privacy"}
          </Link>
        </div>
      </footer>
    </div>
  );
}