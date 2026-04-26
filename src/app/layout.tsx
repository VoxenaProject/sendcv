import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SendCV.ai — Candidature complète en 60 secondes",
  description: "59% des CV sont filtrés par des robots. SendCV personnalise chaque candidature avec l'IA : CV sur-mesure, lettre de motivation, préparation entretien. 3 candidatures gratuites.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://sendcv.ai"),
  alternates: {
    canonical: "/",
    languages: { "fr-FR": "/", "fr-BE": "/" },
  },
  openGraph: {
    title: "SendCV.ai — Arrête d'envoyer le même CV partout",
    description: "L'IA personnalise chaque candidature en 60 secondes. CV + lettre + préparation entretien. 3 candidatures gratuites.",
    url: "https://sendcv.ai",
    siteName: "SendCV.ai",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SendCV.ai — Candidature complète en 60 secondes",
    description: "59% des CV sont filtrés par des robots avant d'être vus. SendCV résout ça.",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SendCV",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#4338ca",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="canonical" href="https://sendcv.ai" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "SendCV.ai",
              "url": "https://sendcv.ai",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "description": "Agent IA de candidature. Personnalise chaque CV, lettre de motivation et préparation d'entretien en 60 secondes.",
              "offers": [
                { "@type": "Offer", "price": "0", "priceCurrency": "EUR", "name": "Free — 3 candidatures gratuites" },
                { "@type": "Offer", "price": "19", "priceCurrency": "EUR", "name": "Pro — Tout illimité", "billingIncrement": "P1M" },
                { "@type": "Offer", "price": "79", "priceCurrency": "EUR", "name": "Lifetime — Accès à vie" },
              ],
              "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "127" },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overscroll-none">
        {children}
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` }} />
      </body>
    </html>
  );
}
