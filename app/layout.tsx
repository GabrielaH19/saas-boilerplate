import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./lib/LanguageContext";
import { CookieBanner } from "@/app/components/CookieBanner";

export const metadata: Metadata = {
  title: "TripProfit",
  description: "Calculator profit curse TIR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>
        <LanguageProvider>
          {children}
          <CookieBanner />
        <a href="mailto:contact@tripprofit.ro" className="fixed bottom-1 left-2 text-xs text-gray-500 hover:text-gray-300 z-50">contact@tripprofit.ro</a>
        </LanguageProvider>
      </body>
    </html>
  );
}