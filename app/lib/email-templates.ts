const baseStyle = `
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
`;

const header = `
  <div style="background: #f97316; padding: 24px 32px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">TripProfit</h1>
    <p style="color: #fed7aa; margin: 4px 0 0 0; font-size: 14px;">Profitabilitate in 10 secunde · Redditività in 10 secondi</p>
  </div>
`;

const divider = `
  <div style="border-top: 2px dashed #e5e7eb; margin: 32px 0; padding-top: 32px;">
    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0 0 24px 0;">🇮🇹 Versione italiana</p>
  </div>
`;

const footer = `
  <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; font-size: 13px; margin: 0;">
      Echipa TripProfit · Team TripProfit · <a href="mailto:contact@tripprofit.ro" style="color: #f97316;">contact@tripprofit.ro</a>
    </p>
    <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
      © 2026 TripProfit. Toate drepturile rezervate · Tutti i diritti riservati.
    </p>
  </div>
`;

const ctaButton = (url: string, textRo: string, textIt: string) => `
  <div style="text-align: center; margin: 32px 0;">
    <a href="${url}" style="background: #f97316; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
      ${textRo} · ${textIt}
    </a>
  </div>
`;

// 1. Welcome
export function welcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Bun venit la TripProfit! · Benvenuto in TripProfit! 🚛',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Buna, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Bun venit la <strong>TripProfit</strong> — platforma care iti spune in 10 secunde daca o cursa merita acceptata sau nu.
          </p>
          <p style="color: #374151; line-height: 1.6;">Contul tau este activ si ai <strong>30 de zile gratuit</strong> pentru a testa toate functiile:</p>
          <ul style="color: #374151; line-height: 2;">
            <li>📊 Calculator cursa cu verdict instant</li>
            <li>🚛 Management multi-camion</li>
            <li>👥 Scor clienti automat</li>
            <li>💰 Tracking cashflow si facturi</li>
            <li>📈 Simulari si rapoarte</li>
          </ul>
          ${ctaButton('https://tripprofit.ro/dashboard', 'Intra in cont →', 'Accedi →')}
          <p style="color: #6b7280; font-size: 14px;">Daca ai intrebari, raspundem la contact@tripprofit.ro.</p>
        </div>

        ${divider}

        <div style="padding: 0 32px 32px;">
          <h2 style="color: #111827; margin-top: 0;">Ciao, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Benvenuto in <strong>TripProfit</strong> — la piattaforma che ti dice in 10 secondi se un viaggio vale la pena o no.
          </p>
          <p style="color: #374151; line-height: 1.6;">Il tuo account è attivo e hai <strong>30 giorni gratuiti</strong> per testare tutte le funzioni:</p>
          <ul style="color: #374151; line-height: 2;">
            <li>📊 Calcolatore viaggio con verdetto istantaneo</li>
            <li>🚛 Gestione multi-camion</li>
            <li>👥 Punteggio clienti automatico</li>
            <li>💰 Tracking cashflow e fatture</li>
            <li>📈 Simulazioni e rapporti</li>
          </ul>
          <p style="color: #6b7280; font-size: 14px;">Per domande scrivici a contact@tripprofit.ro.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 2. Trial expiring soon (ziua 27)
export function trialExpiringSoonEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Perioada ta gratuita expira in 3 zile · Il tuo periodo gratuito scade tra 3 giorni',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Buna, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Perioada ta gratuita de 30 de zile <strong>expira in 3 zile</strong>.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Pentru a continua fara intrerupere, alege un plan:
          </p>
          <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">Basic — 18€/luna (pret fondator)</p>
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">15 curse/luna, 1 camion, istoric 60 zile</p>
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">Pro — 29€/luna (pret fondator)</p>
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">Curse nelimitate, 10 camioane, raport, simulari</p>
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">Premium — 47€/luna (pret fondator)</p>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Camioane nelimitate, toate functiile, PDF export</p>
          </div>
          ${ctaButton('https://tripprofit.ro/pricing', 'Alege planul tau →', 'Scegli il tuo piano →')}
        </div>

        ${divider}

        <div style="padding: 0 32px 32px;">
          <h2 style="color: #111827; margin-top: 0;">Ciao, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Il tuo periodo gratuito di 30 giorni <strong>scade tra 3 giorni</strong>.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Per continuare senza interruzioni, scegli un piano:
          </p>
          <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">Basic — 18€/mese (prezzo fondatore)</p>
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">15 viaggi/mese, 1 camion, storico 60 giorni</p>
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">Pro — 29€/mese (prezzo fondatore)</p>
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">Viaggi illimitati, 10 camion, rapporto, simulazioni</p>
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">Premium — 47€/mese (prezzo fondatore)</p>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Camion illimitati, tutte le funzioni, export PDF</p>
          </div>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 3. Trial expired (ziua 31)
export function trialExpiredEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Perioada gratuita a expirat · Il periodo gratuito è scaduto',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Buna, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Perioada ta gratuita de 30 de zile a expirat. Speram ca TripProfit ti-a fost util!
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Activeaza un abonament acum pentru a continua sa calculezi profitabilitatea curselor.
          </p>
          ${ctaButton('https://tripprofit.ro/pricing', 'Activeaza abonamentul →', 'Attiva abbonamento →')}
          <p style="color: #6b7280; font-size: 14px;">Ai intrebari? Scrie-ne la contact@tripprofit.ro si iti raspundem in aceeasi zi.</p>
        </div>

        ${divider}

        <div style="padding: 0 32px 32px;">
          <h2 style="color: #111827; margin-top: 0;">Ciao, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Il tuo periodo gratuito di 30 giorni è scaduto. Speriamo che TripProfit ti sia stato utile!
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Attiva un abbonamento ora per continuare a calcolare la redditività dei tuoi viaggi.
          </p>
          <p style="color: #6b7280; font-size: 14px;">Domande? Scrivici a contact@tripprofit.ro, rispondiamo in giornata.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 4. Payment success
export function paymentSuccessEmail(name: string, plan: string, amount: number): { subject: string; html: string } {
  return {
    subject: 'Plata confirmata · Pagamento confermato — TripProfit',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Multumim, ${name}! ✅</h2>
          <p style="color: #374151; line-height: 1.6;">Plata ta a fost procesata cu succes.</p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #374151;"><strong>Plan:</strong> ${plan}</p>
            <p style="margin: 0; color: #374151;"><strong>Suma:</strong> ${amount}€/luna</p>
          </div>
          <p style="color: #374151; line-height: 1.6;">Acum ai acces complet la toate functiile planului tau.</p>
          ${ctaButton('https://tripprofit.ro/dashboard', 'Mergi la dashboard →', 'Vai alla dashboard →')}
        </div>

        ${divider}

        <div style="padding: 0 32px 32px;">
          <h2 style="color: #111827; margin-top: 0;">Grazie, ${name}! ✅</h2>
          <p style="color: #374151; line-height: 1.6;">Il tuo pagamento è stato elaborato con successo.</p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #374151;"><strong>Piano:</strong> ${plan}</p>
            <p style="margin: 0; color: #374151;"><strong>Importo:</strong> ${amount}€/mese</p>
          </div>
          <p style="color: #374151; line-height: 1.6;">Ora hai accesso completo a tutte le funzioni del tuo piano.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 5. Payment failed
export function paymentFailedEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Problema cu plata · Problema con il pagamento — TripProfit',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Buna, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Nu am putut procesa plata pentru abonamentul tau TripProfit.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Te rugam sa actualizezi metoda de plata pentru a evita intreruperea accesului.
          </p>
          ${ctaButton('https://tripprofit.ro/settings', 'Actualizeaza plata →', 'Aggiorna pagamento →')}
          <p style="color: #6b7280; font-size: 14px;">Crezi ca e o eroare? Contacteaza-ne la contact@tripprofit.ro.</p>
        </div>

        ${divider}

        <div style="padding: 0 32px 32px;">
          <h2 style="color: #111827; margin-top: 0;">Ciao, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Non siamo riusciti a elaborare il pagamento per il tuo abbonamento TripProfit.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Aggiorna il metodo di pagamento per evitare l'interruzione dell'accesso.
          </p>
          <p style="color: #6b7280; font-size: 14px;">Pensi sia un errore? Contattaci a contact@tripprofit.ro.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 6. Subscription cancelled
export function subscriptionCancelledEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Abonamentul tau a fost anulat · Il tuo abbonamento è stato annullato',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Buna, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Abonamentul tau TripProfit a fost anulat. Vei pastra accesul pana la sfarsitul perioadei platite.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Ne pare rau ca pleci! Daca vrei sa ne spui ce am fi putut face mai bine, raspunde la acest email.
          </p>
          ${ctaButton('https://tripprofit.ro/pricing', 'Reactiveaza abonamentul →', 'Riattiva abbonamento →')}
        </div>

        ${divider}

        <div style="padding: 0 32px 32px;">
          <h2 style="color: #111827; margin-top: 0;">Ciao, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Il tuo abbonamento TripProfit è stato annullato. Manterrai l'accesso fino alla fine del periodo pagato.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Ci dispiace vederti andare! Se vuoi dirci cosa avremmo potuto fare meglio, rispondi a questa email.
          </p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 7. Day 3
export function day3Email(name: string): { subject: string; html: string } {
  return {
    subject: 'Ai calculat prima cursa? · Hai calcolato il primo viaggio? 🚛',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Buna, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Sunt 3 zile de cand ai creat contul. Ai avut timp sa calculezi prima cursa?
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Dureaza sub 2 minute si iti arata instant daca cursa e profitabila sau nu.
          </p>
          ${ctaButton('https://tripprofit.ro/trip/new', 'Calculeaza o cursa acum →', 'Calcola un viaggio ora →')}
          <p style="color: #6b7280; font-size: 14px;">Ai nevoie de ajutor? Raspunde la acest email.</p>
        </div>

        ${divider}

        <div style="padding: 0 32px 32px;">
          <h2 style="color: #111827; margin-top: 0;">Ciao, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Sono 3 giorni da quando hai creato l'account. Hai avuto tempo di calcolare il primo viaggio?
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Ci vogliono meno di 2 minuti e ti mostra istantaneamente se il viaggio è redditizio o no.
          </p>
          <p style="color: #6b7280; font-size: 14px;">Hai bisogno di aiuto? Rispondi a questa email.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 8. Day 7
export function day7Email(name: string): { subject: string; html: string } {
  return {
    subject: 'Cum merge TripProfit pentru tine? · Come va TripProfit per te?',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Buna, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            O saptamana de TripProfit! Speram ca ti-a fost util pana acum.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Ai descoperit functia de <strong>scor clienti</strong>? Iti arata automat care clienti iti aduc cel mai mult profit si care iti creeaza probleme cu platile.
          </p>
          ${ctaButton('https://tripprofit.ro/clients', 'Vezi scorul clientilor →', 'Vedi il punteggio clienti →')}
        </div>

        ${divider}

        <div style="padding: 0 32px 32px;">
          <h2 style="color: #111827; margin-top: 0;">Ciao, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Una settimana di TripProfit! Speriamo ti sia stato utile finora.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Hai scoperto la funzione <strong>punteggio clienti</strong>? Ti mostra automaticamente quali clienti ti portano più profitto e quali creano problemi con i pagamenti.
          </p>
        </div>
        ${footer}
      </div>
    `,
  };
}