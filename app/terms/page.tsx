"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="border-b border-[#1e1e1e] px-10 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Trip<span className="text-[#f5a623]">Profit</span>
        </Link>
        <Link href="/login" className="text-sm text-gray-400 hover:text-white">
          Intră în cont
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-2">Termeni și condiții</h1>
        <p className="text-gray-500 text-sm mb-10">Ultima actualizare: Martie 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Acceptarea termenilor</h2>
            <p className="text-sm">
              Prin accesarea și utilizarea platformei TripProfit, ești de acord cu acești termeni și condiții.
              Dacă nu ești de acord cu oricare dintre aceștia, te rugăm să nu folosești serviciul.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Descrierea serviciului</h2>
            <p className="text-sm">
              TripProfit este o platformă software destinată firmelor mici de transport rutier de marfă.
              Serviciul oferă instrumente pentru calculul profitabilității curselor, gestionarea camioanelor,
              urmărirea clienților și monitorizarea cashflow-ului.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Contul de utilizator</h2>
            <p className="text-sm mb-2">
              Pentru a utiliza TripProfit trebuie să creezi un cont cu o adresă de email validă.
              Ești responsabil pentru:
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Menținerea confidențialității parolei</li>
              <li>Toate activitățile care au loc în contul tău</li>
              <li>Notificarea imediată a oricărei utilizări neautorizate</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Planuri și plăți</h2>
            <p className="text-sm mb-2">
              TripProfit oferă mai multe planuri de abonament: Basic (30€/lună), Pro (49€/lună) și Premium (79€/lună).
              Toate planurile includ o perioadă de testare gratuită de 30 de zile.
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Plățile se procesează lunar prin Stripe</li>
              <li>Poți anula abonamentul oricând din setări</li>
              <li>Nu se oferă rambursări pentru perioadele deja plătite</li>
              <li>Prețurile pot fi modificate cu notificare prealabilă de 30 de zile</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Utilizare acceptabilă</h2>
            <p className="text-sm mb-2">Nu este permisă utilizarea TripProfit pentru:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Activități ilegale sau frauduloase</li>
              <li>Distribuirea de conținut dăunător sau ofensator</li>
              <li>Tentative de acces neautorizat la sistemele noastre</li>
              <li>Revânzarea sau redistribuirea serviciului fără acordul nostru</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Proprietate intelectuală</h2>
            <p className="text-sm">
              Toate elementele platformei TripProfit — cod, design, conținut — sunt proprietatea exclusivă a
              TripProfit. Nu ai dreptul să copiezi, modifici sau distribuii niciun element fără permisiune explicită.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Limitarea răspunderii</h2>
            <p className="text-sm">
              TripProfit oferă instrumente de calcul și estimare. Calculele sunt orientative și nu constituie
              consultanță financiară sau juridică. Nu suntem responsabili pentru deciziile de afaceri luate
              pe baza datelor din platformă. Utilizatorul este singurul responsabil pentru deciziile sale comerciale.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Disponibilitatea serviciului</h2>
            <p className="text-sm">
              Ne străduim să menținem platforma disponibilă 24/7, dar nu garantăm disponibilitatea neîntreruptă.
              Ne rezervăm dreptul de a efectua întreținere și actualizări care pot cauza întreruperi temporare.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Modificarea termenilor</h2>
            <p className="text-sm">
              Ne rezervăm dreptul de a modifica acești termeni oricând. Vei fi notificat prin email cu cel
              puțin 14 zile înainte de intrarea în vigoare a modificărilor semnificative.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Contact</h2>
            <p className="text-sm">
              Pentru orice întrebări legate de acești termeni, ne poți contacta la:{" "}
              <a href="mailto:contact@tripprofit.app" className="text-[#f5a623] hover:underline">
                contact@tripprofit.app
              </a>
            </p>
          </section>

        </div>
      </div>

      <footer className="border-t border-[#1e1e1e] py-6 px-10 flex items-center justify-between mt-10">
        <div className="text-sm font-semibold">Trip<span className="text-[#f5a623]">Profit</span></div>
        <div className="flex gap-6 text-xs text-gray-600">
          <Link href="/terms" className="text-gray-400">Termeni</Link>
          <Link href="/privacy" className="hover:text-gray-400">Confidențialitate</Link>
        </div>
      </footer>
    </div>
  );
}