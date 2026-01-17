import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import "@copilotkit/react-ui/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UK Stamp Duty Calculator 2025 | SDLT, LBTT & LTT",
    template: "%s | Stamp Duty Calculator UK",
  },
  description:
    "Free UK stamp duty calculator with AI assistant. Calculate SDLT for England, LBTT for Scotland, and LTT for Wales. First-time buyer relief, buy-to-let, and second home rates included.",
  keywords: [
    "stamp duty calculator",
    "stamp duty calculator uk",
    "sdlt calculator",
    "lbtt calculator",
    "ltt calculator",
    "first time buyer stamp duty",
    "second home stamp duty",
    "buy to let stamp duty",
    "stamp duty 2025",
    "uk property tax calculator",
  ],
  authors: [{ name: "Stamp Duty Calculator UK" }],
  creator: "Stamp Duty Calculator UK",
  publisher: "Stamp Duty Calculator UK",
  metadataBase: new URL("https://stampdutycalculator.quest"),
  alternates: {
    canonical: "https://stampdutycalculator.quest",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://stampdutycalculator.quest",
    siteName: "UK Stamp Duty Calculator",
    title: "UK Stamp Duty Calculator 2025 | Free SDLT, LBTT & LTT Calculator",
    description:
      "Calculate UK stamp duty instantly. Free calculator for England (SDLT), Scotland (LBTT), and Wales (LTT). Includes first-time buyer relief and additional property surcharges.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Stamp Duty Calculator 2025",
    description:
      "Free stamp duty calculator for England, Scotland and Wales. Calculate SDLT, LBTT and LTT with AI assistance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD structured data
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://stampdutycalculator.quest/#website",
  name: "UK Stamp Duty Calculator",
  alternateName: ["SDLT Calculator", "Stamp Duty Calculator UK", "LBTT Calculator"],
  url: "https://stampdutycalculator.quest",
  description:
    "Free UK stamp duty calculator for England, Scotland and Wales. Calculate SDLT, LBTT and LTT instantly.",
  inLanguage: "en-GB",
  publisher: {
    "@type": "Organization",
    "@id": "https://stampdutycalculator.quest/#organization",
    name: "Stamp Duty Calculator UK",
    url: "https://stampdutycalculator.quest",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://stampdutycalculator.quest/#app",
  name: "UK Stamp Duty Calculator",
  description:
    "Free online stamp duty calculator for UK property purchases. Calculate SDLT (England), LBTT (Scotland), and LTT (Wales).",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
  },
  featureList: [
    "SDLT calculation for England & Northern Ireland",
    "LBTT calculation for Scotland",
    "LTT calculation for Wales",
    "First-time buyer relief calculator",
    "Additional property surcharge calculator",
    "AI-powered assistance",
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Stamp Duty Calculator",
      item: "https://stampdutycalculator.quest",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Stamp Duty Calculator" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
