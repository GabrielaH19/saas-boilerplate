import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Cum calculezi profitul real al unei curse de transport | TripProfit",
  description: "Majoritatea firmelor de transport calculează greșit profitul unei curse. Află cum se calculează corect și ce costuri uită aproape toată lumea.",
  keywords: "profit cursă transport, cum calculez profitul transport, cost real km camion, calculator transport marfuri",
};

export default function ArticolProfitCursa() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", color: "#111" }}>

      {/* Nav */}
      <div style={{ borderBottom: "1px solid #eee", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "sans-serif" }}>
        <Link href="/" style={{ fontWeight: "800", fontSize: "20px", textDecoration: "none", color: "#111" }}>
          Trip<span style={{ color: "#f5a623" }}>Profit</span>
        </Link>
        <Link href="/calculator" style={{ backgroundColor: "#f5a623", color: "#000", padding: "8px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>
          Calculator gratuit
        </Link>
      </div>

      {/* Hero Image */}
      <div style={{ width: "100%", height: "420px", position: "relative", overflow: "hidden" }}>
        <Image
          src="/blog/hero.jpg"
          alt="Camion pe autostradă"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 32px", maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ display: "inline-block", backgroundColor: "#f5a623", color: "#000", fontSize: "12px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px", marginBottom: "16px", fontFamily: "sans-serif" }}>
            Ghid pentru firme de transport
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "800", color: "#fff", lineHeight: "1.2", margin: 0, fontFamily: "sans-serif" }}>
            Cum calculezi profitul real al unei curse de transport
          </h1>
        </div>
      </div>

      {/* Article body */}
      <div style={{ maxWidth: "740px", margin: "0 auto", padding: "48px 24px 80px", fontFamily: "Georgia, serif" }}>

        {/* Meta */}
        <div style={{ display: "flex", gap: "16px", color: "#888", fontSize: "14px", marginBottom: "40px", fontFamily: "sans-serif", alignItems: "center" }}>
          <span>📅 Iunie 2025</span>
          <span>·</span>
          <span>⏱ 5 minute de citit</span>
          <span>·</span>
          <Link href="/blog" style={{ color: "#f5a623", textDecoration: "none" }}>Blog TripProfit</Link>
        </div>

        <p style={{ fontSize: "20px", lineHeight: "1.75", marginBottom: "28px", color: "#1a1a1a" }}>
          Îți spune cineva că o cursă aduce 1.800€. Trimiți camionul. La finalul lunii te uiți în cont și nu înțelegi unde s-au dus banii.
        </p>

        <p style={{ fontSize: "17px", lineHeight: "1.85", marginBottom: "28px", color: "#333" }}>
          Asta se întâmplă pentru că <strong>tariful nu e același lucru cu profitul.</strong> Între cele două stau costuri pe care majoritatea firmelor mici le ignoră sau le uită complet.
        </p>

        <h2 style={{ fontSize: "24px", fontWeight: "800", marginTop: "52px", marginBottom: "20px", fontFamily: "sans-serif", color: "#111" }}>
          Costurile pe care le știe toată lumea
        </h2>

        <p style={{ fontSize: "17px", lineHeight: "1.85", marginBottom: "28px", color: "#333" }}>
          Combustibilul, taxele de drum și diurna șoferului. Acestea le calculează aproape toți. Dar nu sunt suficiente.
        </p>

        <h2 style={{ fontSize: "24px", fontWeight: "800", marginTop: "52px", marginBottom: "20px", fontFamily: "sans-serif", color: "#111" }}>
          Costurile pe care le uită aproape toată lumea
        </h2>

        <h3 style={{ fontSize: "19px", fontWeight: "700", marginTop: "36px", marginBottom: "12px", fontFamily: "sans-serif" }}>
          1. Kilometrii goi
        </h3>
        <p style={{ fontSize: "17px", lineHeight: "1.85", marginBottom: "16px", color: "#333" }}>
          Când trimiți camionul gol de la Timișoara la București ca să ia o marfă — acei 550 km costă combustibil real. Dacă nu îi incluzi în calculul cursei, mănânci din profit fără să știi.
        </p>
        <p style={{ fontSize: "17px", lineHeight: "1.85", marginBottom: "32px", color: "#333" }}>
          <strong>Regula:</strong> calculează întotdeauna pe km totali (încărcați + goi), nu doar pe km cu marfă.
        </p>

        <h3 style={{ fontSize: "19px", fontWeight: "700", marginTop: "36px", marginBottom: "12px", fontFamily: "sans-serif" }}>
          2. Orele de așteptare la rampă
        </h3>

        {/* Rampa image */}
        <div style={{ borderRadius: "12px", overflow: "hidden", margin: "24px 0 28px", position: "relative", height: "280px" }}>
          <Image
            src="/blog/rampa.jpg"
            alt="Rampă de încărcare camion"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        <p style={{ fontSize: "17px", lineHeight: "1.85", marginBottom: "16px", color: "#333" }}>
          Camionul stă 6 ore la descărcare. Șoferul e plătit. Tu pierzi timp din care ai fi putut face altă cursă.
        </p>
        <p style={{ fontSize: "17px", lineHeight: "1.85", marginBottom: "32px", color: "#333" }}>
          Fiecare oră de așteptare costă în medie <strong>15-20€</strong>. La 6 ore — 90-120€ pierduți, necontabilizați nicăieri.
        </p>

        <h3 style={{ fontSize: "19px", fontWeight: "700", marginTop: "36px", marginBottom: "12px", fontFamily: "sans-serif" }}>
          3. Cota din costurile fixe ale camionului
        </h3>
        <p style={{ fontSize: "17px", lineHeight: "1.85", marginBottom: "32px", color: "#333" }}>
          Leasingul, asigurarea, salariul șoferului pe lună, întreținerea — toate astea există indiferent dacă camionul face sau nu o cursă. Dacă costurile fixe sunt 3.000€/lună și camionul face 10.000 km, înseamnă <strong>0,30€ cost fix per km</strong> — bani pe care trebuie să îi acoperi din tarif.
        </p>

        {/* Example box */}
        <div style={{ backgroundColor: "#fffbf0", border: "2px solid #f5a623", borderRadius: "16px", padding: "28px", margin: "48px 0" }}>
          <p style={{ fontWeight: "800", fontSize: "16px", marginBottom: "20px", fontFamily: "sans-serif", color: "#111" }}>
            📊 Exemplu concret — cursă București → München
          </p>
          <div style={{ fontSize: "15px", lineHeight: "2.2", fontFamily: "sans-serif" }}>
            {[
              ["Tarif cursă", "1.800€", false, true],
              ["— Combustibil (1.500km × 32l × 1,68€)", "-807€", true, false],
              ["— Taxe drum", "-120€", true, false],
              ["— Diurnă (3 zile × 65€)", "-195€", true, false],
              ["— Cost fix camion (0,30€ × 1.300km)", "-390€", true, false],
              ["— Așteptare rampă (4h)", "-68€", true, false],
            ].map(([label, val, red, bold], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f0e0c0", paddingBottom: "4px" }}>
                <span style={{ color: red ? "#666" : "#111" }}>{label as string}</span>
                <span style={{ color: red ? "#c00" : "#111", fontWeight: bold ? "700" : "400" }}>{val as string}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "8px", borderTop: "2px solid #f5a623", fontWeight: "800", fontSize: "18px", fontFamily: "sans-serif" }}>
              <span>Profit real</span>
              <span style={{ color: "#16a34a" }}>+220€</span>
            </div>
          </div>
          <p style={{ fontSize: "13px", color: "#888", marginTop: "16px", fontFamily: "sans-serif" }}>
            Nu 1.800€. Nu 993€. <strong>220€.</strong> Asta e profitul real al acestei curse.
          </p>
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: "800", marginTop: "52px", marginBottom: "20px", fontFamily: "sans-serif", color: "#111" }}>
          Cum știi dacă o cursă merită acceptată
        </h2>

        <p style={{ fontSize: "17px", lineHeight: "1.85", marginBottom: "20px", color: "#333" }}>
          Există un indicator simplu: <strong>€/km încărcat.</strong> Calculezi tariful împărțit la km încărcați și compari cu costul tău real per km.
        </p>
        <p style={{ fontSize: "17px", lineHeight: "1.85", marginBottom: "20px", color: "#333" }}>
          Dacă tariful per km e mai mare decât costul per km plus 0,15€ — cursa merită. Dacă nu — negociezi sau refuzi.
        </p>
        <p style={{ fontSize: "17px", lineHeight: "1.85", marginBottom: "40px", color: "#333" }}>
          De exemplu: dacă costul tău real e 1,10€/km și ți se oferă 1,35€/km — cursă bună. La 0,95€/km — pierzi bani cu fiecare kilometru.
        </p>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)", borderRadius: "16px", padding: "40px 32px", textAlign: "center", marginTop: "56px", color: "#fff" }}>
          <div style={{ fontSize: "32px", marginBottom: "16px" }}>⚡</div>
          <p style={{ fontSize: "22px", fontWeight: "800", marginBottom: "12px", fontFamily: "sans-serif" }}>
            Calculează orice cursă în câteva secunde
          </p>
          <p style={{ fontSize: "15px", color: "#aaa", marginBottom: "24px", lineHeight: "1.6", fontFamily: "sans-serif" }}>
            TripProfit face toate calculele de mai sus automat și îți dă un verdict instant — ACCEPTĂ, NEGOCIAZĂ sau REFUZĂ. Fără Excel, fără hârtii.
          </p>
          <Link href="/calculator" style={{ display: "inline-block", backgroundColor: "#f5a623", color: "#000", padding: "14px 32px", borderRadius: "10px", fontWeight: "800", textDecoration: "none", fontSize: "16px", fontFamily: "sans-serif" }}>
            Încearcă calculatorul gratuit →
          </Link>
          <p style={{ fontSize: "12px", color: "#666", marginTop: "12px", fontFamily: "sans-serif" }}>
            Fără cont, fără date personale
          </p>
        </div>

      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #eee", padding: "24px 32px", textAlign: "center", fontSize: "13px", color: "#aaa", fontFamily: "sans-serif" }}>
        © 2025 TripProfit ·{" "}
        <Link href="/privacy" style={{ color: "#aaa", textDecoration: "none" }}>Confidențialitate</Link>
        {" · "}
        <Link href="/terms" style={{ color: "#aaa", textDecoration: "none" }}>Termeni</Link>
      </div>
    </div>
  );
}