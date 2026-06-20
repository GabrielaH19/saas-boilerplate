import type { Metadata } from "next";
import "./globals.css";
import { CookieBanner } from "@/app/components/CookieBanner";
import { PWAInstallBanner } from "@/app/components/PWAInstallBanner";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "YourApp",
  description: "Your app description here",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "YourApp",
  },
  icons: {
    apple: "/logo-icon.png",
    icon: "/logo-icon.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#0d0d0d",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0d0d0d" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="apple-touch-startup-image" href="/logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body>
        {children}
        <CookieBanner />
        <PWAInstallBanner />
        <Analytics />
        <a href="mailto:contact@yourapp.com" className="fixed bottom-1 left-2 text-xs text-gray-500 hover:text-gray-300 z-50">
          contact@yourapp.com
        </a>
      </body>
    </html>
  );
}