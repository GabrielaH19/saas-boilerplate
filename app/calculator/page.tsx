"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { t } from "../lib/translations";

type Locale = "ro" | "it";

export default function CalculatorPage() {
  const [locale, setLocale] = useState<Locale>("ro");
  const [consumption, setConsumption] = useState("32");
  const [fixedCostPerKm, setFixedCostPerKm] = useState("0.45");
  const [loadedKm, setLoadedKm] = useState("1200");
  const [emptyKm, setEmptyKm] = useState("200");
  const [fuelPrice, setFuelPrice] = useState("1.68");
  const [tolls, setTolls] = useState("120");
  const [days, setDays] = useState("3");
  const [waitHours, setWaitHours] = useState("3");
  const [dailyAllowance, setDailyAllowance] = useState("65");
  const [revenue, setRevenue] = useState("1850");
  const [showModal, setShowModal] = useState(false);
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tp_lang") as Locale;
    if (saved && (saved === "ro" || saved === "it")) {
      setLocale(saved);
      return;
    }
    fetch("https://ip-api.com/json/?fields=countryCode")
      .then((r) => r.json())
      .then((data) => {
        const detected: Locale = data.countryCode === "IT" ? "it" : "ro";
        setLocale(detected);
        localStorage.setItem("tp_lang", detected);
      })
      .catch(() => {});
  }, []);

  const switchLocale = (l: Locale) => {
    setLocale(l);
    localStorage.setItem("tp_lang", l);
  };

  const tr = t[locale];

  const rRevenue = parseFloat(revenue) || 0;
  const rLoadedKm = parseFloat(loadedKm) || 0;
  const rEmptyKm = parseFloat(emptyKm) || 0;
  const rFuelPrice = parseFloat(fuelPrice) || 0;
  const rTolls = parseFloat(tolls) || 0;
  const rDays = parseFloat(days) || 0;
  const rWaitHours = parseFloat(waitHours) || 0;
  const rDailyAllowance = parseFloat(dailyAllowance) || 0;
  const rConsumption = parseFloat(consumption) || 32;
  const rFixedCostPerKm = parseFloat(fixedCostPerKm) || 0;

  const totalKm = rLoadedKm + rEmptyKm;
  const fuelCost = Math.round((rConsumption / 100) * rFuelPrice * totalKm);
  const emptyCost = Math.round((rConsumption / 100) * rFuelPrice * rEmptyKm);
  const extraCost = Math.round(rTolls + rDays * rDailyAllowance);
  const waitCost = Math.round(rWaitHours * 17);
  const truckFixedCost = Math.round(rFixedCostPerKm * rLoadedKm);
  const totalCost = fuelCost + extraCost + truckFixedCost + waitCost;
  const profit = rRevenue - totalCost;
  const revenuePerLoadedKm = rLoadedKm > 0 ? rRevenue / rLoadedKm : 0;
  const minBreakEvenPerKm = rLoadedKm > 0 ? totalCost / rLoadedKm : 0;
  const minRecommendedPerKm = minBreakEvenPerKm + 0.15;
  const verdict: "accept" | "negotiate" | "reject" =
    revenuePerLoadedKm >= minRecommendedPerKm ? "accept" :
    revenuePerLoadedKm >= minBreakEvenPerKm ? "negotiate" : "reject";

  const inp = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f5a623]";
  const lbl = "block text-xs text-gray-400 mb-1";

  const handleCalculate = () => {
    setCalculated(true);
    setShowModal(true);
    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const modalFeatures = locale === "it"
    ? ["Storico viaggi illimitato", "Gestione camion e clienti", "Rapporto mensile automatico via email", "Cashflow e simulazioni"]
    : ["Istoric curse nelimitat", "Gestiune camioane și clienți", "Raport lunar automat pe email", "Cashflow și simulări"];

  const calcLabel = locale === "it" ? "Calcola verdetto" : "Calculează verdict";
  const truckDataLabel = locale === "it" ? "Dati camion" : "Date camion";
  const fixedCostLabel = locale === "it" ? "Costo fisso (€/km)" : "Cost fix (€/km)";
  const fixedCostHint = locale === "it" ? "Leasing + assicurazione + stipendio" : "Leasing + asigurare + salariu";
  const consumptionLabel = locale === "it" ? "Consumo (l/100km)" : "Consum (l/100km)";
  const kmRevenueLabel = locale === "it" ? "Km e ricavo" : "Km și venit";
  const extraCostsLabel = locale === "it" ? "Costi aggiuntivi" : "Costuri suplimentare";
  const calcDetailsLabel = locale === "it" ? "Dettagli calcolo" : "Detalii calcul";
  const totalLabel = locale === "it" ? "Totale" : "Total";
  const waitLabel = locale === "it" ? "Ore attesa banchina" : "Ore așteptare rampă";
  const daysLabel = locale === "it" ? "Giorni viaggio" : "Zile deplasare";
  const dailyLabel = locale === "it" ? "Indennità/giorno (€)" : "Diurnă/zi (€)";
  const tollsLabel = locale === "it" ? "Pedaggi (€)" : "Taxe drum (€)";
  const lostCostLabel = locale === "it" ? "Costo perso" : "Cost pierdut";
  const fuelPriceLabel = locale === "it" ? "Prezzo gasolio (€/l)" : "Preț motorină (€/l)";
  const loadedKmLabel = locale === "it" ? "Km caricati" : "Km încărcați";
  const emptyKmLabel = locale === "it" ? "Km vuoti" : "Km goi";
  const revenueLabel = locale === "it" ? "Ricavo viaggio (€)" : "Tarif cursă (€)";
  const badgeLabel = locale === "it" ? "Calcolatore gratuito · Senza account" : "Calculator gratuit · Fără cont";
  const titleLabel = locale === "it" ? "Calcolatore profitto viaggio" : "Calculator profit cursă transport";
  const subtitleLabel = locale === "it"
    ? "Inserisci i dati del viaggio e scopri subito se vale — ACCETTA, NEGOZIA o RIFIUTA."
    : "Introdu datele cursei și află instant dacă merită — ACCEPTĂ, NEGOCIAZĂ sau REFUZĂ.";
  const tryFreeLabel = locale === "it" ? "Prova gratis" : "Încearcă gratuit";
  const modalTitle = locale === "it" ? "Salva questo viaggio" : "Salvează această cursă";
  const modalSub = locale === "it"
    ? "Con TripProfit hai lo storico di tutti i viaggi, gestione camion, clienti e cashflow — tutto in un unico posto."
    : "Cu TripProfit ai istoricul tuturor curselor, gestiunea camioanelor, clienților și cashflow — totul într-un singur loc.";
  const tryFreeFullLabel = locale === "it" ? "Prova gratis 30 giorni" : "Încearcă gratuit 30 de zile";
  const continueLabel = locale === "it" ? "Continua senza account" : "Continuă fără cont";
  const estLabel = locale === "it" ? "* I calcoli sono stime basate sui dati inseriti." : "* Calculele sunt estimative, bazate pe datele introduse.";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Nav */}
      <nav className="border-b border-[#1e1e1e] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          <span className="text-white">Trip</span><span className="text-[#f5a623]">Profit</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => switchLocale("ro")}
              className={`px-2 py-1 rounded ${locale === "ro" ? "text-[#f5a623] font-bold" : "text-gray-400 hover:text-white"}`}
            >RO</button>
            <span className="text-gray-600">/</span>
            <button
              onClick={() => switchLocale("it")}
              className={`px-2 py-1 rounded ${locale === "it" ? "text-[#f5a623] font-bold" : "text-gray-400 hover:text-white"}`}
            >IT</button>
          </div>
          <Link href="/register" className="bg-[#f5a623] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#e8951a] transition">
            {tryFreeLabel}
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block bg-[#f5a623]/10 text-[#f5a623] text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {badgeLabel}
          </div>
          <h1 className="text-3xl font-bold mb-2">{titleLabel}</h1>
          <p className="text-gray-400 text-sm">{subtitleLabel}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{truckDataLabel}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>{consumptionLabel}</label>
                  <input type="number" className={inp} value={consumption} onChange={e => setConsumption(e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>{fixedCostLabel}</label>
                  <input type="number" step="0.01" className={inp} value={fixedCostPerKm} onChange={e => setFixedCostPerKm(e.target.value)} />
                  <p className="text-xs text-gray-600 mt-1">{fixedCostHint}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{kmRevenueLabel}</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={lbl}>{loadedKmLabel}</label>
                  <input type="number" className={inp} value={loadedKm} onChange={e => setLoadedKm(e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>{emptyKmLabel}</label>
                  <input type="number" className={inp} value={emptyKm} onChange={e => setEmptyKm(e.target.value)} />
                  <p className="text-xs text-gray-600 mt-1">{totalLabel}: {totalKm} km</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>{revenueLabel}</label>
                  <input type="number" className={inp} value={revenue} onChange={e => setRevenue(e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>{fuelPriceLabel}</label>
                  <input type="number" step="0.01" className={inp} value={fuelPrice} onChange={e => setFuelPrice(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{extraCostsLabel}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>{tollsLabel}</label>
                  <input type="number" className={inp} value={tolls} onChange={e => setTolls(e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>{waitLabel}</label>
                  <input type="number" className={inp} value={waitHours} onChange={e => setWaitHours(e.target.value)} />
                  <p className="text-xs text-gray-600 mt-1">{lostCostLabel}: {waitCost}€</p>
                </div>
                <div>
                  <label className={lbl}>{daysLabel}</label>
                  <input type="number" className={inp} value={days} onChange={e => setDays(e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>{dailyLabel}</label>
                  <input type="number" className={inp} value={dailyAllowance} onChange={e => setDailyAllowance(e.target.value)} />
                </div>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-[#f5a623] text-black font-bold py-3 rounded-lg hover:bg-[#e8951a] transition text-sm"
            >
              {calcLabel}
            </button>
          </div>

          {/* Result */}
          <div id="result" className="space-y-4">
            {calculated ? (
              <>
                <div className={`rounded-xl p-5 text-center border ${verdict === "accept" ? "bg-[#0a1f0a] border-green-800" : verdict === "negotiate" ? "bg-[#1f1a00] border-yellow-800" : "bg-[#1f0a0a] border-red-800"}`}>
                  <div className={`text-3xl font-bold mb-1 ${verdict === "accept" ? "text-green-400" : verdict === "negotiate" ? "text-[#f5a623]" : "text-red-400"}`}>
                    {verdict === "accept" ? `✓ ${tr.accept}` : verdict === "negotiate" ? `⚡ ${tr.negotiate}` : `✗ ${tr.reject}`}
                  </div>
                  <div className="text-sm text-gray-400">
                    {verdict === "accept" ? tr.acceptSub : verdict === "negotiate" ? tr.negotiateSub : tr.rejectSub}
                  </div>
                </div>

                <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{calcDetailsLabel}</p>
                  {[
                    { label: tr.fuelCost, val: `${fuelCost} €` },
                    { label: `${tr.emptyKmCost} (${rEmptyKm} km)`, val: `-${emptyCost} €`, red: true },
                    { label: tr.taxesDiurna, val: `${extraCost} €` },
                    { label: tr.truckFixedCost, val: `${truckFixedCost} €` },
                    { label: `${waitLabel} (${rWaitHours}h)`, val: `-${waitCost} €`, red: true },
                    { label: tr.totalCost, val: `${totalCost} €` },
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between py-1.5 border-b border-[#1e1e1e] text-sm">
                      <span className="text-gray-400">{r.label}</span>
                      <span className={`${r.red ? "text-red-400" : "text-white"} font-medium`}>{r.val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 text-sm mt-1">
                    <span className="text-white font-semibold">{tr.netProfit}</span>
                    <span className={`font-bold text-base ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>{profit >= 0 ? "+" : ""}{profit} €</span>
                  </div>
                </div>

                <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-5">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: tr.metricLoadedKm, val: revenuePerLoadedKm.toFixed(2) + " €/km", highlight: true },
                      { label: tr.breakEvenMin, val: minBreakEvenPerKm.toFixed(2) + " €/km" },
                      { label: tr.recommendedMin, val: minRecommendedPerKm.toFixed(2) + " €/km" },
                      { label: totalLabel + " km", val: totalKm + " km" },
                    ].map((m, i) => (
                      <div key={i} className="bg-[#1f1f1f] rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">{m.label}</div>
                        <div className={`font-semibold ${m.highlight ? "text-[#f5a623]" : "text-white"}`}>{m.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-600 text-center">{estLabel}</p>
              </>
            ) : (
              <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-10 text-center">
                <div className="text-4xl mb-3">⚡</div>
                <p className="text-gray-400 text-sm">
                  {locale === "it"
                    ? "Compila i dati e premi Calcola verdetto per vedere se il viaggio vale."
                    : "Completează datele și apasă Calculează verdict pentru a vedea dacă cursa merită."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-lg font-bold mb-1">{modalTitle}</h3>
              <p className="text-gray-400 text-sm">{modalSub}</p>
            </div>
            <div className="space-y-2 mb-5">
              {modalFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span> {f}
                </div>
              ))}
            </div>
            <Link href="/register" className="w-full bg-[#f5a623] text-black font-bold py-3 rounded-lg hover:bg-[#e8951a] transition block text-center text-sm mb-3">
              {tryFreeFullLabel}
            </Link>
            <button onClick={() => setShowModal(false)} className="w-full text-gray-500 text-sm py-2 hover:text-gray-300 transition">
              {continueLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}