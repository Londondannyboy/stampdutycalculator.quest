import { Metadata } from "next";

export interface PageSEO {
  title: string;
  description: string;
  keywords: readonly string[] | string[];
  canonical: string;
  ogImage?: string;
}

const SITE_URL = "https://stampdutycalculator.quest";
const SITE_NAME = "UK Stamp Duty Calculator";

export function generateMetadata(page: PageSEO): Metadata {
  const fullTitle = `${page.title} | ${SITE_NAME}`;
  const ogImage = page.ogImage || `${SITE_URL}/og-image.png`;

  return {
    title: fullTitle,
    description: page.description,
    keywords: [...page.keywords] as string[],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: page.canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: page.canonical,
      siteName: SITE_NAME,
      title: page.title,
      description: page.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [ogImage],
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
}

// JSON-LD Schema generators
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: ["SDLT Calculator", "Stamp Duty Calculator UK", "LBTT Calculator"],
    url: SITE_URL,
    description: "Free UK stamp duty calculator for England, Scotland and Wales. Calculate SDLT, LBTT and LTT instantly.",
    inLanguage: "en-GB",
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function generateCalculatorSchema(page: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${page.url}/#app`,
    name: page.name,
    description: page.description,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
    },
    featureList: [
      "Instant SDLT calculation",
      "First-time buyer relief",
      "Additional property surcharge",
      "Scotland LBTT rates",
      "Wales LTT rates",
      "AI-powered assistance",
    ],
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Page-specific SEO configs
export const PAGE_SEO = {
  home: {
    title: "UK Stamp Duty Calculator 2025 | SDLT, LBTT & LTT",
    description: "Free UK stamp duty calculator for 2025. Calculate SDLT for England, LBTT for Scotland, and LTT for Wales. Includes first-time buyer relief and additional property surcharges.",
    keywords: [
      "stamp duty calculator",
      "stamp duty calculator uk",
      "sdlt calculator",
      "uk stamp duty calculator",
      "stamp duty 2025",
      "lbtt calculator",
      "stamp calculator uk",
    ],
    canonical: SITE_URL,
  },
  buyToLet: {
    title: "Buy-to-Let Stamp Duty Calculator 2025 | BTL SDLT Rates",
    description: "Calculate stamp duty on buy-to-let property purchases. Includes 5% additional rate surcharge. Compare BTL vs residential rates and company purchase options.",
    keywords: [
      "buy to let stamp duty calculator",
      "btl stamp duty calculator",
      "buy to let stamp duty",
      "btl sdlt calculator",
      "buy to let sdlt",
      "stamp duty buy to let",
      "investment property stamp duty",
    ],
    canonical: `${SITE_URL}/buy-to-let`,
  },
  secondHome: {
    title: "Second Home Stamp Duty Calculator 2025 | Additional Property SDLT",
    description: "Calculate stamp duty on second homes and additional properties. Includes 5% surcharge for England, 6% ADS for Scotland. Free instant calculation.",
    keywords: [
      "second home stamp duty calculator",
      "stamp duty calculator second home",
      "additional property stamp duty",
      "second property stamp duty",
      "stamp duty surcharge calculator",
      "additional dwelling supplement calculator",
    ],
    canonical: `${SITE_URL}/second-home`,
  },
  firstTimeBuyer: {
    title: "First-Time Buyer Stamp Duty Calculator 2025 | FTB Relief",
    description: "Calculate stamp duty as a first-time buyer. Pay £0 on properties up to £425,000. Check eligibility and see how much you save with first-time buyer relief.",
    keywords: [
      "first time buyer stamp duty calculator",
      "ftb stamp duty calculator",
      "stamp duty first time buyer",
      "first time buyer relief",
      "stamp duty calculator first time buyer",
    ],
    canonical: `${SITE_URL}/first-time-buyer`,
  },
  scotland: {
    title: "Scotland LBTT Calculator 2025 | Land and Buildings Transaction Tax",
    description: "Calculate LBTT for property purchases in Scotland. Includes Additional Dwelling Supplement (ADS) and first-time buyer relief. Current 2025 rates.",
    keywords: [
      "lbtt calculator",
      "scotland stamp duty calculator",
      "land and buildings transaction tax calculator",
      "scottish stamp duty",
      "lbtt rates",
      "ads scotland",
    ],
    canonical: `${SITE_URL}/scotland`,
  },
  wales: {
    title: "Wales LTT Calculator 2025 | Land Transaction Tax",
    description: "Calculate Land Transaction Tax (LTT) for property purchases in Wales. Current 2025 rates and higher rates for additional properties.",
    keywords: [
      "ltt calculator",
      "wales stamp duty calculator",
      "land transaction tax calculator",
      "welsh stamp duty",
      "ltt rates wales",
    ],
    canonical: `${SITE_URL}/wales`,
  },
  commercial: {
    title: "Commercial Property Stamp Duty Calculator | Non-Residential SDLT",
    description: "Calculate SDLT on commercial and non-residential property purchases. Different rates apply to business premises, mixed-use properties, and land.",
    keywords: [
      "commercial stamp duty calculator",
      "commercial property sdlt",
      "non residential stamp duty",
      "business property stamp duty",
      "sdlt commercial calculator",
    ],
    canonical: `${SITE_URL}/commercial`,
  },
  london: {
    title: "London Stamp Duty Calculator 2025 | SDLT for London Properties",
    description: "Calculate stamp duty on London property purchases. See typical SDLT amounts for London house prices with our free calculator.",
    keywords: [
      "london stamp duty calculator",
      "stamp duty calculator london",
      "sdlt london",
      "stamp duty london property",
    ],
    canonical: `${SITE_URL}/london`,
  },
  holidayLet: {
    title: "Holiday Let Stamp Duty Calculator 2025 | Furnished Holiday Let SDLT",
    description: "Calculate stamp duty on holiday let property purchases. Understand when the 5% surcharge applies and compare with buy-to-let options.",
    keywords: [
      "holiday let stamp duty calculator",
      "stamp duty holiday let",
      "furnished holiday let stamp duty",
      "holiday property stamp duty",
    ],
    canonical: `${SITE_URL}/holiday-let`,
  },
  refund: {
    title: "Stamp Duty Refund Calculator | Claim Back SDLT",
    description: "Check if you can claim a stamp duty refund. Calculate potential refund amount when selling your previous main residence within 3 years.",
    keywords: [
      "stamp duty refund calculator",
      "sdlt refund",
      "stamp duty refund claim",
      "claim back stamp duty",
    ],
    canonical: `${SITE_URL}/refund`,
  },
} as const;
