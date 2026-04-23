const baseStyle = `
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
`;

const header = `
  <div style="background: #f97316; padding: 24px 32px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">TripProfit</h1>
    <p style="color: #fed7aa; margin: 4px 0 0 0; font-size: 14px;">Profitabilitate în 10 secunde</p>
  </div>
`;

const footer = `
  <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; font-size: 13px; margin: 0;">
      Echipa TripProfit · <a href="mailto:contact@tripprofit.ro" style="color: #f97316;">contact@tripprofit.ro</a>
    </p>
    <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
      © 2025 TripProfit. Toate drepturile rezervate.
    </p>
  </div>
`;

const ctaButton = (url: string, text: string) => `
  <div style="text-align: center; margin: 32px 0;">
    <a href="${url}" style="background: #f97316; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
      ${text}
    </a>
  </div>
`;

// 1. Bun venit după înregistrare
export function welcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Bun venit la TripProfit! 🚛',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Bună, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Bun venit la <strong>TripProfit</strong> — platforma care îți spune în 10 secunde dacă o cursă merită acceptată sau nu.
          </p>
          <p style="color: #374151; line-height: 1.6;">Contul tău este activ și ai <strong>30 de zile gratuit</strong> pentru a testa toate funcțiile:</p>
          <ul style="color: #374151; line-height: 2;">
            <li>📊 Calculator cursă cu verdict instant</li>
            <li>🚛 Management multi-camion</li>
            <li>👥 Scor clienți automat</li>
            <li>💰 Tracking cashflow și facturi</li>
            <li>📈 Simulări și rapoarte</li>
          </ul>
          ${ctaButton('https://tripprofit.ro/dashboard', 'Intră în cont →')}
          <p style="color: #6b7280; font-size: 14px;">Dacă ai întrebări, răspundem la contact@tripprofit.ro.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 2. Reminder trial expiră în 3 zile
export function trialExpiringSoonEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Perioada ta gratuită expiră în 3 zile',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Bună, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Perioada ta gratuită de 30 de zile <strong>expiră în 3 zile</strong>.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Pentru a continua să folosești TripProfit fără întrerupere, alege un plan care se potrivește firmei tale:
          </p>
          <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">🥉 Basic — 30€/lună</p>
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">Până la 2 camioane, calculator cursă, istoric</p>
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">🥈 Pro — 49€/lună</p>
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">Până la 5 camioane, cashflow, simulări</p>
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">🥇 Premium — 79€/lună</p>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Camioane nelimitate, toate funcțiile</p>
          </div>
          ${ctaButton('https://tripprofit.ro/pricing', 'Alege planul tău →')}
        </div>
        ${footer}
      </div>
    `,
  };
}

// 3. Trial expirat
export function trialExpiredEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Perioada gratuită a expirat — continuă cu TripProfit',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Bună, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Perioada ta gratuită de 30 de zile a expirat. Sperăm că TripProfit ți-a fost util!
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Pentru a continua să calculezi profitabilitatea curselor și să ai acces la toate datele tale, activează un abonament acum.
          </p>
          ${ctaButton('https://tripprofit.ro/pricing', 'Activează abonamentul →')}
          <p style="color: #6b7280; font-size: 14px;">Ai întrebări? Scrie-ne la contact@tripprofit.ro și îți răspundem în aceeași zi.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 4. Plată procesată cu succes
export function paymentSuccessEmail(name: string, plan: string, amount: number): { subject: string; html: string } {
  return {
    subject: 'Plată confirmată — TripProfit',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Mulțumim, ${name}! ✅</h2>
          <p style="color: #374151; line-height: 1.6;">Plata ta a fost procesată cu succes.</p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #374151;"><strong>Plan:</strong> ${plan}</p>
            <p style="margin: 0; color: #374151;"><strong>Sumă:</strong> ${amount}€/lună</p>
          </div>
          <p style="color: #374151; line-height: 1.6;">Acum ai acces complet la toate funcțiile planului tău.</p>
          ${ctaButton('https://tripprofit.ro/dashboard', 'Mergi la dashboard →')}
        </div>
        ${footer}
      </div>
    `,
  };
}

// 5. Plată eșuată
export function paymentFailedEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Problemă cu plata — acțiune necesară',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Bună, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Nu am putut procesa plata pentru abonamentul tău TripProfit.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Te rugăm să actualizezi metoda de plată pentru a evita întreruperea accesului.
          </p>
          ${ctaButton('https://tripprofit.ro/settings', 'Actualizează plata →')}
          <p style="color: #6b7280; font-size: 14px;">Dacă crezi că e o eroare, contactează-ne la contact@tripprofit.ro.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 6. Abonament anulat
export function subscriptionCancelledEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Abonamentul tău TripProfit a fost anulat',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Bună, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Abonamentul tău TripProfit a fost anulat. Vei păstra accesul până la sfârșitul perioadei plătite.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Ne pare rău că pleci! Dacă vrei să ne spui ce am fi putut face mai bine, răspunde la acest email.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Dacă te-ai răzgândit, poți reactiva oricând abonamentul:
          </p>
          ${ctaButton('https://tripprofit.ro/pricing', 'Reactivează abonamentul →')}
        </div>
        ${footer}
      </div>
    `,
  };
}

// 7. Email ziua 3 după înregistrare (onboarding)
export function day3Email(name: string): { subject: string; html: string } {
  return {
    subject: 'Ai calculat prima cursă? 🚛',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Bună, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Sunt 3 zile de când ai creat contul. Ai avut timp să calculezi prima cursă?
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Dacă nu ai făcut-o încă, durează sub 2 minute și îți arată instant dacă cursa e profitabilă sau nu.
          </p>
          ${ctaButton('https://tripprofit.ro/trip/new', 'Calculează o cursă acum →')}
          <p style="color: #6b7280; font-size: 14px;">Ai nevoie de ajutor? Răspunde la acest email și te ajutăm.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 8. Email ziua 7 după înregistrare
export function day7Email(name: string): { subject: string; html: string } {
  return {
    subject: 'Cum merge TripProfit pentru tine?',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Bună, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            O săptămână de TripProfit! Sperăm că ți-a fost util până acum.
          </p>
          <p style="color: #374151; line-height: 1.6;">Ai descoperit funcția de <strong>scor clienți</strong>? Îți arată automat care clienți îți aduc cel mai mult profit și care îți creează probleme cu plățile.</p>
          ${ctaButton('https://tripprofit.ro/clients', 'Vezi scorul clienților →')}
        </div>
        ${footer}
      </div>
    `,
  };
}