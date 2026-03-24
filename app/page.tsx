"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">

      {/* NAV */}
      <nav className="border-b border-[#1e1e1e] px-10 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Trip<span className="text-[#f5a623]">Profit</span></div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500 cursor-pointer hover:text-white">Funcții</span>
          <span className="text-sm text-gray-500 cursor-pointer hover:text-white">Prețuri</span>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white">Intră în cont</Link>
          <Link href="/register" className="bg-[#f5a623] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#e8951a] transition">
            Încearcă gratuit
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="text-center px-6 pt-24 pb-12">
        <div className="inline-block bg-[#1a1a00] text-[#f5a623] border border-[#3a3000] text-xs px-4 py-2 rounded-full mb-8">
          Pentru firme mici de transport (1-10 camioane)
        </div>
        <h1 className="text-5xl font-semibold leading-tight mb-5 max-w-3xl mx-auto">
          În 10 secunde știi dacă o cursă<br />
          îți aduce <span className="text-[#f5a623]">bani sau pierdere.</span>
        </h1>
        <p className="text-lg text-gray-500 mb-4 max-w-xl mx-auto">
          Introduci cursa. Vezi instant dacă merită sau pierzi bani.
        </p>
        <p className="text-sm text-gray-600 mb-10 max-w-md mx-auto">
          Nu e un soft complicat. E un instrument care îți arată dacă merită sau pierzi bani.
        </p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Link href="/register" className="bg-[#f5a623] text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#e8951a] transition text-base">
            Încearcă 30 zile gratuit
          </Link>
          <Link href="/login" className="border border-[#2e2e2e] text-gray-400 px-8 py-4 rounded-lg hover:text-white hover:border-[#3a3a3a] transition text-base">
            Intră în cont
          </Link>
        </div>
        <p className="text-xs text-gray-600">Fără card. Fără angajament.</p>
      </div>

      {/* DEMO VERDICT */}
      <div className="max-w-md mx-auto px-6 mb-20">
        <div className="bg-[#0a1f0a] border border-green-900 rounded-xl p-6 text-center">
          <div className="text-xs text-gray-600 mb-3">Cursă București → München · 1.200 km · 1.850€</div>
          <div className="text-4xl font-semibold text-green-400 mb-2">+482 €</div>
          <div className="text-xl font-semibold text-green-400 mb-2">ACCEPTĂ</div>
          <div className="text-xs text-gray-600">1.54 €/km · peste pragul tău de 1.30 €/km</div>
        </div>
      </div>

      {/* CREDIBILITATE */}
      <div className="border-t border-b border-[#1e1e1e] bg-[#111] py-6 px-6 text-center mb-20">
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Pentru firme mici de transport (1-10 camioane) care nu au timp sau bani pentru un manager de transport dedicat.{" "}
          <strong className="text-gray-400">TripProfit calculează înainte să te coste.</strong>
        </p>
      </div>

      {/* PROBLEMA */}
      <div className="max-w-4xl mx-auto px-6 mb-20 text-center">
        <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-4">Problema</div>
        <h2 className="text-3xl font-semibold mb-3">Lucrezi mult și câștigi puțin?</h2>
        <p className="text-gray-500 mb-12">Nu problema e cât muncești. Problema e că nu vezi unde pierzi bani.</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { t: "Accepți curse pe minus fără să știi", d: "Prețul pare ok. Dar după combustibil, taxe drum, leasing și salariu — ești pe pierdere. Fără calcul nu ai cum să știi." },
            { t: "Nu știi care camion îți pierde bani", d: "Ai 3 camioane. Unul e pe minus de 2 luni. Nu știi care. Pierzi bani în fiecare zi fără să realizezi." },
            { t: "Clienți care îți aduc de fapt pierderi", d: "Plătesc la 90 zile, cer prețuri mici. Crezi că merge bine — dar la final luna e pe minus." },
            { t: "Rămâi fără bani pe neașteptate", d: "Ai facturi neîncasate dar nu ai bani să plătești leasingul săptămâna viitoare. Știi prea târziu." },
          ].map((item, i) => (
            <div key={i} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6 text-left">
              <div className="font-semibold text-white mb-2">{item.t}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{item.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SOLUTIA */}
      <div className="bg-[#0a0a0a] border-t border-b border-[#1e1e1e] py-20 px-6 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-4">Soluția</div>
          <h2 className="text-3xl font-semibold mb-3">TripProfit îți spune direct ce trebuie să știi</h2>
          <p className="text-gray-500 mb-12">Fără rapoarte complicate. Primești alerta înainte să pierzi bani.</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { n: "01", t: "Verdict instant per cursă", d: "Introduci km și prețul. Primești ACCEPTĂ, NEGOCIAZĂ sau REFUZĂ — în 10 secunde." },
              { n: "02", t: "Care camion îți pierde bani", d: "Raport per camion — profit, €/km, curse. Vezi imediat ce camion trage firma în jos." },
              { n: "03", t: "Scor pentru fiecare client", d: "Fiecare client primește un scor 1-10 bazat pe profit, timp de plată și preț mediu." },
              { n: "04", t: "Vezi exact când nu mai ai bani", d: "\"În 18 zile rămâi fără bani dacă nu încasezi.\" Știi dinainte, nu după ce s-a întâmplat." },
              { n: "05", t: "Costul tău real per km", d: "Calculat din leasing, asigurare, salariu, combustibil. Din datele tale — nu estimat." },
              { n: "06", t: "Afli problema înainte să te coste", d: "\"Camionul 2 e pe pierdere.\" \"Clientul ăsta plătește lent.\" Primești alerta direct." },
            ].map((f, i) => (
              <div key={i} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5 text-left">
                <div className="text-xs text-[#f5a623] mb-2">{f.n}</div>
                <div className="font-semibold text-white mb-2">{f.t}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{f.d}</div>
              </div>
            ))}
          </div>

          {/* OBIECTIE */}
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6 max-w-xl mx-auto mt-10 text-left">
            <div className="text-gray-400 mb-2">"Încă un soft complicat pe care nu am timp să îl învăț?"</div>
            <div className="text-white text-sm leading-relaxed">
              Configurezi firma în 2 minute. Introduci costurile o singură dată. De acolo, fiecare cursă se calculează automat.
              Nu ai nevoie de training sau experiență tehnică.
            </div>
          </div>
        </div>
      </div>

      {/* PRETURI */}
      <div className="max-w-4xl mx-auto px-6 mb-20 text-center">
        <div className="text-xs text-[#f5a623] uppercase tracking-widest mb-4">Prețuri</div>
        <h2 className="text-3xl font-semibold mb-3">Simplu. Fără surprize.</h2>
        <p className="text-gray-500 mb-12">30 zile gratuit pentru orice plan. Fără card la înregistrare.</p>
        <div className="grid grid-cols-3 gap-5">

          {/* BASIC */}
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-7 text-left">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Basic</div>
            <div className="text-4xl font-semibold text-white mb-1">
              <sup className="text-lg">€</sup>30<sub className="text-sm font-normal text-gray-500">/lună</sub>
            </div>
            <div className="text-xs text-gray-500 mb-5">Nu mai accepți curse pe minus</div>
            <div className="border-t border-[#2a2a2a] pt-4 mb-6 space-y-2">
              {["Calculator cursă + verdict", "Cost real per km", "1 camion", "Istoric curse"].map(f => (
                <div key={f} className="flex gap-2 text-xs text-gray-300"><span className="text-green-400">✓</span>{f}</div>
              ))}
              {["Raport per camion", "Raport per client", "Cashflow tracking"].map(f => (
                <div key={f} className="flex gap-2 text-xs text-gray-600"><span>✗</span>{f}</div>
              ))}
            </div>
            <Link href="/register" className="block text-center border border-[#2e2e2e] text-white py-2.5 rounded-lg text-sm hover:bg-[#1e1e1e] transition">
              Începe gratuit
            </Link>
          </div>

          {/* PRO */}
          <div className="bg-[#16143a] border-2 border-[#4f46e5] rounded-xl p-7 text-left relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f5a623] text-black text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
              Cel mai popular
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Pro</div>
            <div className="text-4xl font-semibold text-white mb-1">
              <sup className="text-lg">€</sup>49<sub className="text-sm font-normal text-gray-500">/lună</sub>
            </div>
            <div className="text-xs text-gray-500 mb-5">Înțelegi exact unde se duc banii</div>
            <div className="border-t border-[#2a2a2a] pt-4 mb-6 space-y-2">
              {["Tot din Basic", "Camioane nelimitate", "Raport per camion", "Raport per client + scor", "Dashboard firmă", "Alerte costuri depășite"].map(f => (
                <div key={f} className="flex gap-2 text-xs text-gray-300"><span className="text-green-400">✓</span>{f}</div>
              ))}
              {["Cashflow tracking"].map(f => (
                <div key={f} className="flex gap-2 text-xs text-gray-600"><span>✗</span>{f}</div>
              ))}
            </div>
            <Link href="/register" className="block text-center bg-[#4f46e5] text-white py-2.5 rounded-lg text-sm hover:bg-[#4338ca] transition font-semibold">
              Începe gratuit
            </Link>
          </div>

          {/* PREMIUM */}
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-7 text-left">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Premium</div>
            <div className="text-4xl font-semibold text-white mb-1">
              <sup className="text-lg">€</sup>79<sub className="text-sm font-normal text-gray-500">/lună</sub>
            </div>
            <div className="text-xs text-gray-500 mb-5">Vezi exact când nu mai ai bani</div>
            <div className="border-t border-[#2a2a2a] pt-4 mb-6 space-y-2">
              {["Tot din Pro", "Cashflow tracking", "Alertă blocaj financiar", "Scor risc clienți", "Simulări decizii", "Recomandări automate", "Suport prioritar"].map(f => (
                <div key={f} className="flex gap-2 text-xs text-gray-300"><span className="text-green-400">✓</span>{f}</div>
              ))}
            </div>
            <Link href="/register" className="block text-center border border-[#2e2e2e] text-white py-2.5 rounded-lg text-sm hover:bg-[#1e1e1e] transition">
              Începe gratuit
            </Link>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0a0a0a] border-t border-[#1e1e1e] py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">Gata să știi dacă<br />faci sau pierzi bani?</h2>
        <p className="text-gray-500 mb-8">Configurezi firma în 2 minute. Prima cursă calculată instant.</p>
        <Link href="/register" className="bg-[#f5a623] text-black font-semibold px-10 py-4 rounded-lg hover:bg-[#e8951a] transition text-base inline-block">
          Încearcă 30 zile gratuit
        </Link>
        <p className="text-xs text-gray-600 mt-4">Fără card. Fără angajament. Anulezi oricând.</p>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#1e1e1e] py-6 px-10 flex items-center justify-between">
        <div className="text-sm font-semibold">Trip<span className="text-[#f5a623]">Profit</span></div>
        <div className="flex gap-6 text-xs text-gray-600">
          <Link href="/terms" className="hover:text-gray-400">Termeni</Link>
          <Link href="/privacy" className="hover:text-gray-400">Confidențialitate</Link>
          <span>contact@tripprofit.app</span>
        </div>
      </footer>

    </div>
  );
}