"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#1e1e1e] px-10 py-4 flex items-center justify-between">

        <Link href="/" className="text-lg font-semibold">
          Trip<span className="text-[#f5a623]">Profit</span>
        </Link>
        <Link href="/login" className="text-sm text-gray-400 hover:text-white">
          Intră în cont
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-2">Politica de confidențialitate</h1>
        <p className="text-gray-500 text-sm mb-10">Ultima actualizare: Martie 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Ce date colectăm</h2>
            <p className="text-sm mb-2">Colectăm următoarele categorii de date:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Date de cont: email, nume, numele firmei</li>
              <li>Date de utilizare: curse salvate, camioane, clienți, facturi</li>
              <li>Date tehnice: adresă IP, tipul browserului, date de sesiune</li>
              <li>Date de plată: procesate exclusiv prin Stripe, nu stocăm date de card</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Cum folosim datele</h2>
            <p className="text-sm mb-2">Datele tale sunt folosite exclusiv pentru:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Furnizarea și îmbunătățirea serviciului TripProfit</li>
              <li>Comunicări legate de cont și serviciu</li>
              <li>Procesarea plăților prin Stripe</li>
              <li>Suport tehnic și rezolvarea problemelor</li>
            </ul>
            <p className="text-sm mt-3 text-gray-400">
              Nu vindem, nu închiriem și nu distribuim datele tale către terți în scop comercial.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Stocarea datelor</h2>
            <p className="text-sm">
              Datele sunt stocate în Google Firebase (Firestore) pe servere localizate în Europa (regiunea eur3).
              Datele sunt protejate prin criptare în tranzit și în repaus. Accesul la date este restricționat
              prin reguli de securitate Firebase — fiecare utilizator poate accesa doar propriile date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Servicii terțe</h2>
            <p className="text-sm mb-2">Folosim următoarele servicii terțe:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li><strong className="text-gray-300">Firebase (Google)</strong> — autentificare și bază de date</li>
              <li><strong className="text-gray-300">Stripe</strong> — procesare plăți</li>
              <li><strong className="text-gray-300">Vercel</strong> — hosting aplicație</li>
            </ul>
            <p className="text-sm mt-3 text-gray-400">
              Aceste servicii au propriile politici de confidențialitate și sunt conforme cu GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Drepturile tale (GDPR)</h2>
            <p className="text-sm mb-2">Conform GDPR, ai dreptul la:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Acces la datele tale personale</li>
              <li>Rectificarea datelor incorecte</li>
              <li>Ștergerea datelor ("dreptul de a fi uitat")</li>
              <li>Portabilitatea datelor</li>
              <li>Opoziție față de prelucrarea datelor</li>
            </ul>
            <p className="text-sm mt-3 text-gray-400">
              Pentru a exercita aceste drepturi, contactează-ne la{" "}
              <a href="mailto:contact@tripprofit.app" className="text-[#f5a623] hover:underline">
                contact@tripprofit.app
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Cookie-uri</h2>
            <p className="text-sm">
              Folosim doar cookie-uri esențiale pentru funcționarea aplicației (sesiune de autentificare).
              Nu folosim cookie-uri de tracking sau publicitare.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Retenția datelor</h2>
            <p className="text-sm">
              Datele tale sunt păstrate atât timp cât ai un cont activ. La ștergerea contului, datele sunt
              eliminate în termen de 30 de zile, cu excepția datelor necesare pentru obligații legale
              (ex: evidențe financiare).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Modificări ale politicii</h2>
            <p className="text-sm">
              Dacă modificăm această politică în mod semnificativ, te vom notifica prin email cu cel puțin
              14 zile înainte de intrarea în vigoare.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
            <p className="text-sm">
              Pentru orice întrebări legate de datele tale personale:{" "}
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
          <Link href="/terms" className="hover:text-gray-400">Termeni</Link>
          <Link href="/privacy" className="text-gray-400">Confidențialitate</Link>
        </div>
      </footer>
    </div>
  );
}