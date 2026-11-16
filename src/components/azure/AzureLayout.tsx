import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Bookmark, Compass, Menu, X } from 'lucide-react';
import { AzureBrandLogo, useAzureFavicon } from './AzureBrandLogo';
import { useAzureStore } from '../../context/AzureStoreContext';
import { CurrencyCode, DEMO_CURRENCY_RATES } from '../../data/azureCatalog';

interface AzureLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export const AzureLayout: React.FC<AzureLayoutProps> = ({ title, children }) => {
  const location = useLocation();
  const { savedVillaIds, currency, setCurrency } = useAzureStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useAzureFavicon(true);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | Azure Escapes` : 'Azure Escapes — Luxury Coastal Villas';
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const isActive = (path: string) =>
    path === '/showcase/azure-escapes'
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <div className="azure-showcase min-h-screen flex flex-col bg-[#F6F2EB] text-[#112333]">
      {/* Discreet Showcase Attribution Bar */}
      <div className="bg-[#09263B] text-[#F6F2EB] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-[11px] tracking-[0.14em] uppercase">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#D4B06A]">Interactive Concept Website</span>
            <span className="hidden sm:inline text-white/35">|</span>
            <span className="hidden sm:inline text-[#CBD5E1] normal-case tracking-normal text-xs">
              Fictional villa portfolio &amp; browser-local reservation demonstration
            </span>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-[#F6F2EB] hover:text-[#D4B06A] transition-colors font-medium whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Genmax Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Main Coastal Masthead */}
      <header className="sticky top-0 z-40 bg-[#F6F2EB]/95 backdrop-blur-md border-b border-[#DDD4C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Mobile Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-[#09263B] hover:text-[#2E7D8C] transition-colors"
            aria-label="Open Azure Escapes navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Left Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-[0.12em] uppercase font-medium">
            <Link
              to="/showcase/azure-escapes/destinations/santorini"
              className={`transition-colors ${
                isActive('/showcase/azure-escapes/destinations')
                  ? 'text-[#09263B] underline underline-offset-8 decoration-[#A88443]'
                  : 'text-[#394B59] hover:text-[#09263B]'
              }`}
            >
              Destinations
            </Link>
            <Link
              to="/showcase/azure-escapes/villas"
              className={`transition-colors ${
                isActive('/showcase/azure-escapes/villas') ||
                isActive('/showcase/azure-escapes/search')
                  ? 'text-[#09263B] underline underline-offset-8 decoration-[#A88443]'
                  : 'text-[#394B59] hover:text-[#09263B]'
              }`}
            >
              Villas
            </Link>
            <Link
              to="/showcase/azure-escapes/experiences"
              className={`transition-colors ${
                isActive('/showcase/azure-escapes/experiences')
                  ? 'text-[#09263B] underline underline-offset-8 decoration-[#A88443]'
                  : 'text-[#394B59] hover:text-[#09263B]'
              }`}
            >
              Experiences
            </Link>
            <Link
              to="/showcase/azure-escapes/concierge"
              className={`transition-colors ${
                isActive('/showcase/azure-escapes/concierge')
                  ? 'text-[#09263B] underline underline-offset-8 decoration-[#A88443]'
                  : 'text-[#394B59] hover:text-[#09263B]'
              }`}
            >
              Concierge
            </Link>
          </nav>

          {/* Center Brand Crest */}
          <Link
            to="/showcase/azure-escapes"
            className="flex items-center justify-center shrink-0"
            aria-label="Azure Escapes Home"
          >
            <span className="hidden sm:inline-flex">
              <AzureBrandLogo variant="full" tone="dark" size="md" showDescriptor />
            </span>
            <span className="inline-flex sm:hidden">
              <AzureBrandLogo variant="compact" tone="dark" size="sm" showDescriptor={false} />
            </span>
          </Link>

          {/* Right Utilities: Currency Selector + Saved Villas */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex items-center gap-1.5 border border-[#DDD4C6] bg-[#FCFBF8] px-2.5 py-1.5 text-xs text-[#112333]">
              <label htmlFor="az-currency-select" className="sr-only">
                Display Currency
              </label>
              <select
                id="az-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-xs font-medium tracking-wider uppercase text-[#09263B] cursor-pointer focus:outline-none"
                title="Base rates in EUR. Secondary currencies use fixed demo rates."
              >
                {Object.values(DEMO_CURRENCY_RATES).map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} ({item.symbol})
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/showcase/azure-escapes/saved"
              className={`inline-flex items-center gap-1.5 text-xs tracking-[0.12em] uppercase font-medium transition-colors whitespace-nowrap ${
                isActive('/showcase/azure-escapes/saved')
                  ? 'text-[#09263B] underline underline-offset-8 decoration-[#A88443]'
                  : 'text-[#394B59] hover:text-[#09263B]'
              }`}
            >
              <Bookmark className="w-4 h-4 text-[#A88443]" />
              <span className="hidden md:inline">Saved</span>
              <span className="az-tabular text-[#09263B] font-semibold">
                ({savedVillaIds.length})
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Azure Escapes Mobile Menu"
        >
          <div
            className="fixed inset-0 bg-[#09263B]/55 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-80 max-w-[85vw] bg-[#09263B] text-[#F6F2EB] h-full flex flex-col justify-between p-6 overflow-y-auto shadow-2xl">
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-5 border-b border-white/15">
                <AzureBrandLogo variant="compact" tone="light" size="sm" showDescriptor />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white/80 hover:text-white"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4B06A] font-semibold">
                  Coastal Regions
                </p>
                <div className="flex flex-col space-y-3 pl-1 text-base">
                  <Link
                    to="/showcase/azure-escapes/destinations/santorini"
                    className="hover:text-[#D4B06A] transition-colors"
                  >
                    Santorini, Greece
                  </Link>
                  <Link
                    to="/showcase/azure-escapes/destinations/amalfi-coast"
                    className="hover:text-[#D4B06A] transition-colors"
                  >
                    Amalfi Coast, Italy
                  </Link>
                  <Link
                    to="/showcase/azure-escapes/destinations/bali"
                    className="hover:text-[#D4B06A] transition-colors"
                  >
                    Bali, Indonesia
                  </Link>
                </div>

                <div className="pt-4 border-t border-white/15 flex flex-col space-y-3.5 text-base font-medium">
                  <Link to="/showcase/azure-escapes" className="hover:text-[#D4B06A]">
                    Collection Home
                  </Link>
                  <Link to="/showcase/azure-escapes/villas" className="hover:text-[#D4B06A]">
                    Explore All 12 Villas
                  </Link>
                  <Link to="/showcase/azure-escapes/experiences" className="hover:text-[#D4B06A]">
                    Curated Experiences
                  </Link>
                  <Link to="/showcase/azure-escapes/saved" className="hover:text-[#D4B06A]">
                    Saved Shortlist ({savedVillaIds.length})
                  </Link>
                  <Link to="/showcase/azure-escapes/concierge" className="hover:text-[#D4B06A]">
                    Private Concierge Inquiry
                  </Link>
                </div>

                <div className="pt-4 border-t border-white/15 space-y-2">
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-white/60">
                    Display Currency
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['EUR', 'USD', 'INR'] as CurrencyCode[]).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setCurrency(code)}
                        className={`py-2 text-xs font-medium tracking-wider uppercase border transition-colors ${
                          currency === code
                            ? 'border-[#D4B06A] bg-[#D4B06A] text-[#09263B]'
                            : 'border-white/25 text-white/80 hover:border-white/50'
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/15 space-y-3 text-xs text-white/70">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-[#D4B06A] hover:underline font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Genmax Portfolio
              </Link>
              <p className="leading-relaxed">
                Demo platform created by Genmax IT Solution. Simulated dates &amp; instant reservations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <div className="flex-1">{children}</div>

      {/* Editorial Coastal Footer */}
      <footer className="bg-[#09263B] text-[#F6F2EB] border-t border-[#17415E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/15">
            <div className="md:col-span-5 space-y-5">
              <AzureBrandLogo variant="full" tone="light" size="md" showDescriptor />
              <p className="text-sm text-[#CBD5E1] leading-relaxed max-w-md">
                Private coastal sanctuaries curated across Santorini, the Amalfi Coast, and Bali.
                Interactive hospitality booking demonstration featuring live calendar availability,
                multi-season rate calculation, and bespoke coastal charters.
              </p>
              <div className="text-xs text-[#94A3B8] space-y-1">
                <p>Base tariff currency: EUR (€). Fixed demo conversion applied for USD &amp; INR display.</p>
                <p>No live charges, outbound emails, or external API reservations take place.</p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D4B06A]">
                Destinations
              </h3>
              <ul className="space-y-2.5 text-sm text-[#E2E8F0]">
                <li>
                  <Link
                    to="/showcase/azure-escapes/destinations/santorini"
                    className="hover:text-[#D4B06A] transition-colors"
                  >
                    Santorini
                  </Link>
                </li>
                <li>
                  <Link
                    to="/showcase/azure-escapes/destinations/amalfi-coast"
                    className="hover:text-[#D4B06A] transition-colors"
                  >
                    Amalfi Coast
                  </Link>
                </li>
                <li>
                  <Link
                    to="/showcase/azure-escapes/destinations/bali"
                    className="hover:text-[#D4B06A] transition-colors"
                  >
                    Bali
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D4B06A]">
                Booking Desk
              </h3>
              <ul className="space-y-2.5 text-sm text-[#E2E8F0]">
                <li>
                  <Link
                    to="/showcase/azure-escapes/villas"
                    className="hover:text-[#D4B06A] transition-colors"
                  >
                    Search All Villas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/showcase/azure-escapes/villas/caldera-house"
                    className="hover:text-[#D4B06A] transition-colors"
                  >
                    Caldera House
                  </Link>
                </li>
                <li>
                  <Link
                    to="/showcase/azure-escapes/experiences"
                    className="hover:text-[#D4B06A] transition-colors"
                  >
                    Experiences &amp; Charters
                  </Link>
                </li>
                <li>
                  <Link
                    to="/showcase/azure-escapes/concierge"
                    className="hover:text-[#D4B06A] transition-colors"
                  >
                    Concierge Request
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D4B06A]">
                Concept Showcase
              </h3>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Interested in a custom hospitality platform or villa reservation engine built with
                this architecture?
              </p>
              <div className="pt-1 flex flex-col gap-2.5">
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#D4B06A] hover:text-white transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Back to Genmax Portfolio
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#94A3B8]">
            <p>© {new Date().getFullYear()} Azure Escapes — Interactive Concept Website by Genmax IT Solution.</p>
            <p>All properties, tariffs, and dates are fictional concept demonstration data.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
