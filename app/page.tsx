"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">

      {/* NAV */}
      <nav className="border-b border-[#1e1e1e] px-10 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Trip<span className="text-[#f5a623]">Profit</span></div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-400 cursor-pointer hover:text-white">Funcții</span>
          <span className="text-sm text-gray-400 cursor-pointer hover:text-white">Prețuri</span>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white">Intră în cont</Link>
          <Link href="/register" className="bg-[#f5a623] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#e8951a] transition">
            Încearcă gratuit
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="text-center px-6 pt-24 pb-14">
        <div className="inline-block bg-[#1a1a00] text-[#f5a623] border border-[#3a3000] text-xs px-4 py-2 rounded-full mb-8">
          Pentru firme mici de transport · 1-10 camioane
        </div>
        <h1 className="text-6xl font-semibold leading-tight mb-6 max-w-3xl mx-auto text-white">
          În 10 secunde știi dacă<br />
          o cursă <span className="text-[#f5a623]">merită sau nu.</span>
        </h1>
        <p className="text-xl text-gray-300 mb-4 max-w-xl mx-auto">
          Introduci cursa. TripProfit calculează tot și îți spune direct: ACCEPTĂ, NEGOCIAZĂ sau REFUZĂ.
        </p>
        <p className="text-sm text-gray-500 mb-10 max-w-md mx-auto">
          Nu e un soft complicat. E un instrument care știe costurile tale reale.
        </p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Link href="/register" className="bg-[#f5a623] text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#e8951a] transition text-base">
            Încearcă 30 zile gratuit
          </Link>
          <Link href="/login" className="border border-[#3a3a3a] text-gray-300 px-8 py-4 rounded-lg hover:text-white hover:border-[#555] transition text-base">
            Intră în cont
          </Link>
        </div>
        <p className="text-xs text-gray-600">Fără card. Fără angajament.</p>
      </div>

      {/* DEMO VERDICT */}
      <div className="max-w-md mx-auto px-6 mb-24">
        <div className="bg-[#0a1f0a] border border-green-900 rounded-xl p-6 text-center">
          <div className="text-sm text-gray-500 mb-3">Cursă București → München · 1.200 km · 1.850€</div>
          <div className="text-5xl font-semibold text-green-400 mb-2">+482 €</div>
          <div className="text-2xl font-semibold text-green-400 mb-3">ACCEPTĂ</div>
          <div className="text-sm text-gray-500">1.54 €/km · peste pragul tău de 1.30 €/km</div>
        </div>
      </div>

      {/* CREDIBILITATE */}
      <div className="border-t border-b border-[#1e1e1e] bg-[#111] py-7 px-6 text-center mb-24">
        <p className="text-base text-gray-300 max-w-lg mx-auto">
          Construit pentru firme mici de transport care gestionează curse internaționale.{" "}
          <strong className="text-white">TripProfit calculează înainte să te coste.</strong>
        </p>
      </div>

      {/* PROBLEMA */}
      <div className="max-w-4xl mx-auto px-6 mb-24 text-center">
        <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-5">Problema</div>
        <h2 className="text-4xl font-semibold mb-4 text-white">De ce pierd bani firmele mici de transport?</h2>
        <p className="text-lg text-gray-400 mb-14">Nu din lipsă de muncă. Din lipsă de vizibilitate asupra costurilor reale.</p>
        <div className="grid grid-cols-2 gap-5">
          {[
            { t: "Curse acceptate pe minus fără să știi", d: "Prețul pare ok. Dar după combustibil, taxe drum, leasing și salariu — ești pe pierdere. Fără calcul nu ai cum să știi." },
            { t: "Nu știi care camion îți produce pierderi", d: "Ai 3 camioane. Unul e pe minus de 2 luni. Nu știi care. Pierzi bani în fiecare zi fără să realizezi." },
            { t: "Clienți care par buni dar nu sunt", d: "Plătesc la 90 zile, cer prețuri mici. Luna pare ok — dar la final cifrele nu se leagă." },
            { t: "Rămâi fără lichidități pe neașteptate", d: "Ai facturi neîncasate dar nu ai bani să plătești leasingul săptămâna viitoare. Știi prea târziu." },
          ].map((item, i) => (
            <div key={i} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-7 text-left">
              <div className="text-lg font-semibold text-white mb-3">{item.t}</div>
              <div className="text-sm text-gray-400 leading-relaxed">{item.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SOLUTIA */}
      <div className="bg-[#0a0a0a] border-t border-b border-[#1e1e1e] py-24 px-6 mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-5">Soluția</div>
          <h2 className="text-4xl font-semibold mb-4 text-white">TripProfit îți spune direct ce trebuie să știi</h2>
          <p className="text-lg text-gray-400 mb-14">Fără rapoarte complicate. Primești alerta înainte să apară problema.</p>
          <div className="grid grid-cols-3 gap-5">
            {[
              { n: "01", t: "Verdict instant per cursă", d: "Introduci km și prețul. Primești ACCEPTĂ, NEGOCIAZĂ sau REFUZĂ — în 10 secunde." },
              { n: "02", t: "Care camion produce pierderi", d: "Raport per camion — profit, €/km, curse. Vezi imediat ce camion trage firma în jos." },
              { n: "03", t: "Scor pentru fiecare client", d: "Fiecare client primește un scor 1-10 bazat pe profit, timp de plată și preț mediu." },
              { n: "04", t: "Alertă înainte de blocaj financiar", d: "\"În 18 zile nu mai ai suficienți bani în firmă.\" Știi dinainte, nu după ce s-a întâmplat." },
              { n: "05", t: "Costul tău real per km", d: "Calculat din leasing, asigurare, salariu, combustibil. Din datele tale — nu estimat." },
              { n: "06", t: "Afli problema înainte să te coste", d: "\"Camionul 2 e pe pierdere.\" \"Clientul ăsta plătește lent.\" Primești alerta direct." },
            ].map((f, i) => (
              <div key={i} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6 text-left">
                <div className="text-xs text-[#f5a623] mb-3">{f.n}</div>
                <div className="text-base font-semibold text-white mb-2">{f.t}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{f.d}</div>
              </div>
            ))}
          </div>

          {/* OBIECTIE */}
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-7 max-w-xl mx-auto mt-12 text-left">
            <div className="text-base text-gray-300 mb-3 italic">"Încă un soft complicat pe care nu am timp să îl învăț?"</div>
            <div className="text-sm text-gray-400 leading-relaxed">
              Configurezi firma în 2 minute. Introduci costurile o singură dată. De acolo, fiecare cursă se calculează automat.
              Nu ai nevoie de training sau experiență tehnică.
            </div>
          </div>
        </div>
      </div>

      {/* PRETURI */}
      <div className="max-w-4xl mx-auto px-6 mb-24 text-center">
        <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-5">Prețuri</div>
        <h2 className="text-4xl font-semibold mb-4 text-white">Transparent. Fără costuri ascunse.</h2>
        <p className="text-lg text-gray-400 mb-14">30 zile gratuit pentru orice plan. Fără card la înregistrare.</p>
        <div className="grid grid-cols-3 gap-5">

          {/* BASIC */}
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-8 text-left">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Basic</div>
            <div className="text-5xl font-semibold text-white mb-1">
              <sup className="text-xl">€</sup>30<sub className="text-sm font-normal text-gray-500">/lună</sub>
            </div>
            <div className="text-sm text-gray-400 mb-6 mt-2">Nu mai accepți curse pe minus</div>
            <div className="border-t border-[#2a2a2a] pt-5 mb-7 space-y-2.5">
              {["Calculator cursă + verdict", "Cost real per km", "1 camion", "Istoric curse"].map(f => (
                <div key={f} className="flex gap-2 text-sm text-gray-300"><span className="text-green-400">✓</span>{f}</div>
              ))}
              {["Raport per camion", "Raport per client", "Cashflow tracking"].map(f => (
                <div key={f} className="flex gap-2 text-sm text-gray-600"><span>✗</span>{f}</div>
              ))}
            </div>
            <Link href="/register" className="block text-center border border-[#333] text-white py-3 rounded-lg text-sm hover:bg-[#1e1e1e] transition">
              Începe gratuit
            </Link>
          </div>

          {/* PRO */}
          <div className="bg-[#16143a] border-2 border-[#4f46e5] rounded-xl p-8 text-left relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f5a623] text-black text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
              Cel mai popular
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Pro</div>
            <div className="text-5xl font-semibold text-white mb-1">
              <sup className="text-xl">€</sup>49<sub className="text-sm font-normal text-gray-500">/lună</sub>
            </div>
            <div className="text-sm text-gray-400 mb-6 mt-2">Înțelegi exact unde se duc banii</div>
            <div className="border-t border-[#2a2a2a] pt-5 mb-7 space-y-2.5">
              {["Tot din Basic", "Camioane nelimitate", "Raport per camion", "Raport per client + scor", "Dashboard firmă", "Alerte costuri depășite"].map(f => (
                <div key={f} className="flex gap-2 text-sm text-gray-300"><span className="text-green-400">✓</span>{f}</div>
              ))}
              {["Cashflow tracking"].map(f => (
                <div key={f} className="flex gap-2 text-sm text-gray-600"><span>✗</span>{f}</div>
              ))}
            </div>
            <Link href="/register" className="block text-center bg-[#4f46e5] text-white py-3 rounded-lg text-sm hover:bg-[#4338ca] transition font-semibold">
              Începe gratuit
            </Link>
          </div>

          {/* PREMIUM */}
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-8 text-left">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Premium</div>
            <div className="text-5xl font-semibold text-white mb-1">
              <sup className="text-xl">€</sup>79<sub className="text-sm font-normal text-gray-500">/lună</sub>
            </div>
            <div className="text-sm text-gray-400 mb-6 mt-2">Control financiar complet al firmei</div>
            <div className="border-t border-[#2a2a2a] pt-5 mb-7 space-y-2.5">
              {["Tot din Pro", "Cashflow tracking", "Alertă blocaj financiar", "Scor risc clienți", "Simulări decizii", "Recomandări automate", "Suport prioritar"].map(f => (
                <div key={f} className="flex gap-2 text-sm text-gray-300"><span className="text-green-400">✓</span>{f}</div>
              ))}
            </div>
            <Link href="/register" className="block text-center border border-[#333] text-white py-3 rounded-lg text-sm hover:bg-[#1e1e1e] transition">
              Începe gratuit
            </Link>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0a0a0a] border-t border-[#1e1e1e] py-24 px-6 text-center">
        <h2 className="text-4xl font-semibold mb-5 text-white">
          Gata să ai control<br />asupra firmei tale?
        </h2>
        <p className="text-lg text-gray-400 mb-10">Configurezi firma în 2 minute. Prima cursă calculată instant.</p>
        <Link href="/register" className="bg-[#f5a623] text-black font-semibold px-10 py-4 rounded-lg hover:bg-[#e8951a] transition text-base inline-block">
          Încearcă 30 zile gratuit
        </Link>
        <p className="text-sm text-gray-600 mt-5">Fără card. Fără angajament. Anulezi oricând.</p>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#1e1e1e] py-6 px-10 flex items-center justify-between">
        <div className="text-sm font-semibold">Trip<span className="text-[#f5a623]">Profit</span></div>
        <div className="flex gap-6 text-sm text-gray-600">
          <Link href="/terms" className="hover:text-gray-400">Termeni</Link>
          <Link href="/privacy" className="hover:text-gray-400">Confidențialitate</Link>
          <span>contact@tripprofit.app</span>
        </div>
      </footer>

    </div>
  );
}