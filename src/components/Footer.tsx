import Link from "next/link";

const CALCULATOR_LINKS = [
  { href: "/", label: "SDLT Calculator" },
  { href: "/first-time-buyer", label: "First-Time Buyer" },
  { href: "/second-home", label: "Second Home" },
  { href: "/buy-to-let", label: "Buy-to-Let" },
  { href: "/investment-property", label: "Investment Property" },
  { href: "/company-purchase", label: "Company/SPV" },
  { href: "/holiday-let", label: "Holiday Let" },
  { href: "/non-resident", label: "Non-Resident" },
  { href: "/mixed-use", label: "Mixed-Use" },
  { href: "/land", label: "Land Purchase" },
  { href: "/refund", label: "Stamp Duty Refund" },
];

const REGIONAL_LINKS = [
  { href: "/scotland", label: "Scotland LBTT" },
  { href: "/wales", label: "Wales LTT" },
  { href: "/northern-ireland", label: "Northern Ireland" },
  { href: "/london", label: "London Calculator" },
  { href: "/commercial", label: "Commercial Property" },
];

const AUTHORITY_LINKS = [
  { href: "https://www.gov.uk/stamp-duty-land-tax", label: "HMRC SDLT Guide", description: "Official government guidance" },
  { href: "https://www.gov.uk/stamp-duty-land-tax/residential-property-rates", label: "SDLT Rates", description: "Current HMRC rates" },
  { href: "https://revenue.scot/taxes/land-buildings-transaction-tax", label: "Revenue Scotland", description: "Official LBTT information" },
  { href: "https://www.gov.wales/land-transaction-tax-guide", label: "Welsh Revenue Authority", description: "Official LTT guide" },
  { href: "https://www.gov.uk/guidance/stamp-duty-land-tax-relief-for-first-time-buyers", label: "FTB Relief Guide", description: "First-time buyer relief" },
  { href: "https://www.gov.uk/stamp-duty-land-tax/higher-rates-for-additional-properties", label: "Additional Property Rates", description: "5% surcharge guidance" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Calculators Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stamp Duty Calculators</h3>
            <ul className="space-y-2">
              {CALCULATOR_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Regional Calculators</h3>
            <ul className="space-y-2">
              {REGIONAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Official Resources</h3>
            <ul className="space-y-2">
              {AUTHORITY_LINKS.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors text-sm flex items-center gap-1"
                  >
                    {link.label}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <p className="text-sm mb-4">
              Free UK stamp duty calculator for England, Scotland, and Wales.
              Calculate SDLT, LBTT, and LTT with AI-powered assistance.
            </p>
            <p className="text-xs text-zinc-500">
              This calculator provides estimates only. Always consult a qualified
              solicitor or tax advisor for official guidance.
            </p>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 pt-8 border-t border-zinc-800">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
            <span>Data sourced from official government sources</span>
            <span>•</span>
            <span>Updated for 2024/25 tax year</span>
            <span>•</span>
            <span>Calculations verified against HMRC rates</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs">
              © {currentYear} Stamp Duty Calculator UK. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
