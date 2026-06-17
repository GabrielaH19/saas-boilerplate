import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculator profit cursă transport | TripProfit",
  description: "Calculează instant dacă o cursă de transport merită — verdict ACCEPTĂ, NEGOCIAZĂ sau REFUZĂ. Gratuit, fără cont.",
  keywords: "calculator profit transport, cursă transport rentabilă, calculator cost km camion, profit cursă TIR",
  openGraph: {
    title: "Calculator profit cursă transport | TripProfit",
    description: "Verdict instant pentru orice cursă de transport. Gratuit.",
    url: "https://tripprofit.ro/calculator",
    siteName: "TripProfit",
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}