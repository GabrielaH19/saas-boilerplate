import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cum calculezi profitul real al unei curse de transport | TripProfit",
  description: "Majoritatea firmelor de transport calculează greșit profitul unei curse. Află cum se calculează corect și ce costuri uită aproape toată lumea.",
  keywords: "profit cursă transport, cum calculez profitul transport, cost real km camion, calculator transport marfuri",
  openGraph: {
    title: "Cum calculezi profitul real al unei curse de transport",
    description: "Află cum se calculează corect profitul unei curse și ce costuri uită aproape toată lumea.",
    url: "https://tripprofit.ro/blog/cum-calculezi-profitul-unei-curse",
    siteName: "TripProfit",
  },
};

export default function ArticolProfitCursa() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Nav */}
      <nav className="border-b border-[#1e1e1e] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          <span className="text-white">Trip</span><span className="text-[#f5a623]">Profit</span>
        </Link>
        <Link href="/register" className="bg-[#f5a623] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#e8951a] transition">
          Încearcă gratuit
        </Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-300">TripProfit</Link>
          <span className="mx-2">→</span>
          <Link href="/blog" className="hover:text-gray-300">Blog</Link>
          <span className="mx-2">→</span>
          <span>Profit cursă transport</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-block bg-[#f5a623]/10 text-[#f5a623] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Ghid pentru firme de transport
          </div>
          <h1 className="text-3xl font-bold leading-tight mb-4">
            Cum calculezi profitul real al unei curse de transport
          </h1>
          <p className="text-gray-400 text-sm">
            5 minute de citit · Actualizat iunie 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed">

          <p className="text-lg text-white">
            Îți spune cineva că o cursă aduce 1.800€. Suni șoferul, îl trimiți. Și la final lunii te uiți în cont și nu înțelegi unde s-au dus banii.
          </p>

          <p>
            Asta se întâmplă pentru că <strong className="text-white">tariful nu e același lucru cu profitul.</strong> Între cele două stau zeci de costuri pe care majoritatea le ignoră sau le uită.
          </p>

          <h2 className="text-xl font-bold text-white mt-10 mb-4">Ce înseamnă profitul real al unei curse</h2>

          <p>
            Profitul real = tariful curse minus <em>toate</em> costurile aferente. Nu doar combustibilul. Toate.
          </p>

          <p>
            Problema e că "toate costurile" e mai complicat decât pare. Hai să le luăm pe rând.
          </p>

          <h2 className="text-xl font-bold text-white mt-10 mb-4">Costurile pe care le știe toată lumea</h2>

          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Combustibil</span>
              <span className="text-white">consum (l/100km) × preț motorină × km totali</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Taxe drum</span>
              <span className="text-white">rovignietă, vinietă, autostrăzi</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Diurnă șofer</span>
              <span className="text-white">nr. zile × diurnă/zi</span>
            </div>
          </div>

          <p>
            Astea le calculează aproape toți. Problema vine de la ce urmează.
          </p>

          <h2 className="text-xl font-bold text-white mt-10 mb-4">Costurile pe care le uită aproape toată lumea</h2>

          <h3 className="text-base font-bold text-white mt-6 mb-2">1. Kilometrii goi</h3>
          <p>
            Când trimiți camionul gol de la Timișoara la București ca să ia o marfă — acei 550 km costă combustibil real. Dacă nu îi incluzi în calculul cursei, mănânci din profit fără să știi.
          </p>
          <p>
            <strong className="text-white">Regula:</strong> calculează întotdeauna pe km totali (încărcați + goi), nu doar pe km cu marfă.
          </p>

          <h3 className="text-base font-bold text-white mt-6 mb-2">2. Orele de așteptare la rampă</h3>
          <p>
            Camionul stă 6 ore la descărcare. Șoferul e plătit. Motorul poate merge. Tu pierzi timp din care ai fi putut face altă cursă.
          </p>
          <p>
            Fiecare oră de așteptare costă în medie <strong className="text-white">15-20€</strong> dacă calculezi salariul șoferului pe oră. La 6 ore — 90-120€ pierduți, necontabilizați nicăieri.
          </p>

          <h3 className="text-base font-bold text-white mt-6 mb-2">3. Cota din costurile fixe</h3>
          <p>
            Leasingul, asigurarea, salariul șoferului pe lună, întreținerea — toate astea există indiferent dacă camionul face sau nu o cursă.
          </p>
          <p>
            Dacă camionul face 10.000 km/lună și costurile fixe sunt 3.000€/lună, înseamnă <strong className="text-white">0,30€ cost fix per km</strong>. O cursă de 2.000 km îți costă 600€ din costuri fixe — bani pe care trebuie să îi acoperi din tarif.
          </p>

          <div className="bg-yellow-900/30 border border-yellow-800 rounded-xl p-5 my-8">
            <p className="text-yellow-400 font-semibold text-sm mb-2">⚠️ Exemplu concret</p>
            <p className="text-sm text-gray-300">
              Cursă București → München, 1.300 km încărcați, 200 km goi, tarif 1.800€.
            </p>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Combustibil (32l/100km × 1,68€ × 1.500km)</span><span className="text-white">807€</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Taxe drum</span><span className="text-white">120€</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Diurnă (3 zile × 65€)</span><span className="text-white">195€</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Cost fix camion (0,30€ × 1.300km)</span><span className="text-white">390€</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Așteptare rampă (4h)</span><span className="text-white">68€</span></div>
              <div className="border-t border-yellow-800/50 mt-2 pt-2 flex justify-between font-bold"><span className="text-white">Total costuri</span><span className="text-white">1.580€</span></div>
              <div className="flex justify-between font-bold text-lg mt-1"><span className="text-green-400">Profit real</span><span className="text-green-400">+220€</span></div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Nu 1.800€. Nu 993€. 220€. Asta e profitul real al acestei curse.
            </p>
          </div>

          <h2 className="text-xl font-bold text-white mt-10 mb-4">Formula completă de calcul</h2>

          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5 font-mono text-sm space-y-2">
            <p className="text-gray-400">Profit = Tarif</p>
            <p className="text-gray-400">— combustibil × (km încărcați + km goi)</p>
            <p className="text-gray-400">— taxe drum</p>
            <p className="text-gray-400">— diurnă × nr. zile</p>
            <p className="text-gray-400">— cost fix/km × km încărcați</p>
            <p className="text-gray-400">— ore așteptare × cost/oră</p>
            <p className="text-[#f5a623] font-bold mt-2">= Profit real</p>
          </div>

          <h2 className="text-xl font-bold text-white mt-10 mb-4">Cum știi dacă o cursă merită acceptată</h2>

          <p>
            Există un indicator simplu: <strong className="text-white">€/km încărcat.</strong>
          </p>
          <p>
            Calculezi tariful împărțit la km încărcați și compari cu costul tău real per km. Dacă tariful per km e mai mare decât costul per km plus o marjă de minim 0,15€ — cursa merită. Dacă nu — negociezi sau refuzi.
          </p>
          <p>
            De exemplu: dacă costul tău real e 1,10€/km și ți se oferă 1,20€/km — ești pe plus dar abia. La 1,35€/km — cursă bună. La 0,95€/km — pierzi bani cu fiecare kilometru.
          </p>

          <h2 className="text-xl font-bold text-white mt-10 mb-4">Cât durează să faci acest calcul manual</h2>

          <p>
            Dacă ai toate datele la îndemână și faci calculul în Excel — 10-15 minute per cursă. Dacă faci 20 de curse pe lună, asta înseamnă 3-5 ore doar pe calcule.
          </p>
          <p>
            Și mai e o problemă: Excel nu îți dă un verdict. Îți dă niște numere pe care trebuie să le interpretezi tu. Greșelile de calcul sunt frecvente, mai ales când ești grăbit.
          </p>

          {/* CTA */}
          <div className="bg-[#161616] border border-[#f5a623]/30 rounded-xl p-6 mt-10 text-center">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-white mb-2">Calculează orice cursă în câteva secunde</h3>
            <p className="text-gray-400 text-sm mb-4">
              TripProfit face toate calculele de mai sus automat și îți dă un verdict instant — ACCEPTĂ, NEGOCIAZĂ sau REFUZĂ. Fără Excel, fără hârtii.
            </p>
            <Link
              href="/calculator"
              className="inline-block bg-[#f5a623] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#e8951a] transition text-sm mb-3"
            >
              Încearcă calculatorul gratuit →
            </Link>
            <p className="text-xs text-gray-600">Fără cont, fără date personale</p>
          </div>

        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-[#1e1e1e] px-6 py-6 text-center text-xs text-gray-600 mt-10">
        © 2025 TripProfit · <Link href="/privacy" className="hover:text-gray-400">Confidențialitate</Link> · <Link href="/terms" className="hover:text-gray-400">Termeni</Link>
      </footer>
    </div>
  );
}