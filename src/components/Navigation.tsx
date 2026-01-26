"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const CALCULATOR_PAGES = [
  { href: "/", label: "SDLT Calculator", short: "Home" },
  { href: "/first-time-buyer", label: "First-Time Buyer", short: "FTB" },
  { href: "/second-home", label: "Second Home", short: "2nd Home" },
  { href: "/buy-to-let", label: "Buy-to-Let", short: "BTL" },
  { href: "/scotland", label: "Scotland LBTT", short: "Scotland" },
  { href: "/wales", label: "Wales LTT", short: "Wales" },
];

const MORE_PAGES = [
  { href: "/northern-ireland", label: "Northern Ireland" },
  { href: "/commercial", label: "Commercial Property" },
  { href: "/london", label: "London Calculator" },
  { href: "/investment-property", label: "Investment Property" },
  { href: "/company-purchase", label: "Company/SPV" },
  { href: "/holiday-let", label: "Holiday Let" },
  { href: "/non-resident", label: "Non-Resident" },
  { href: "/mixed-use", label: "Mixed-Use Property" },
  { href: "/land", label: "Land Purchase" },
  { href: "/refund", label: "Stamp Duty Refund" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SD</span>
            </div>
            <span className="font-bold text-zinc-900 dark:text-white hidden sm:block">
              Stamp Duty Calculator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {CALCULATOR_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(page.href)
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {page.label}
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                onBlur={() => setTimeout(() => setMoreMenuOpen(false), 150)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  MORE_PAGES.some((p) => isActive(p.href))
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                More
                <svg
                  className={`w-4 h-4 transition-transform ${moreMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 py-2">
                  {MORE_PAGES.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      className={`block px-4 py-2 text-sm ${
                        isActive(page.href)
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {page.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-2 gap-2">
              {[...CALCULATOR_PAGES, ...MORE_PAGES].map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(page.href)
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {page.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
