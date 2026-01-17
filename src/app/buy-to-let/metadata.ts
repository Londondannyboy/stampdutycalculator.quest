import { Metadata } from "next";
import { generateMetadata, PAGE_SEO, generateCalculatorSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateMetadata(PAGE_SEO.buyToLet);

export const jsonLd = {
  calculator: generateCalculatorSchema({
    name: "Buy-to-Let Stamp Duty Calculator",
    description: "Calculate SDLT on buy-to-let property purchases including the 5% additional property surcharge",
    url: PAGE_SEO.buyToLet.canonical,
  }),
  faq: generateFAQSchema([
    {
      question: "What is the buy-to-let stamp duty surcharge?",
      answer: "If you're buying a buy-to-let property and already own another property, you'll pay an additional 5% on top of standard SDLT rates. This surcharge applies to the entire purchase price.",
    },
    {
      question: "Do I pay the surcharge on my first buy-to-let?",
      answer: "Yes, if you already own a residential property (including your main home), you'll pay the 5% surcharge on any buy-to-let purchase.",
    },
    {
      question: "Can I claim first-time buyer relief on a buy-to-let?",
      answer: "No. First-time buyer relief only applies to properties you intend to live in as your main residence.",
    },
    {
      question: "Is it better to buy through a limited company?",
      answer: "Companies also pay the 5% surcharge. For properties over £500,000, there may be a 15% flat rate. Consult a tax advisor for your situation.",
    },
  ]),
  breadcrumb: generateBreadcrumbSchema([
    { name: "Home", url: "https://stampdutycalculator.quest" },
    { name: "Buy-to-Let Calculator", url: "https://stampdutycalculator.quest/buy-to-let" },
  ]),
};
