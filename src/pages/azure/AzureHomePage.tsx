import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  Compass,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { AzureLayout } from '../../components/azure/AzureLayout';
import { BookingBar } from '../../components/azure/BookingBar';
import { VillaCard } from '../../components/azure/VillaCard';
import {
  AZURE_DESTINATIONS,
  AZURE_EXPERIENCES,
  AZURE_FAQS,
  AZURE_VILLAS,
  formatMoney,
} from '../../data/azureCatalog';
import { useAzureStore } from '../../context/AzureStoreContext';

export const AzureHomePage: React.FC = () => {
  const { currency, searchDraft } = useAzureStore();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const flagshipVillas = AZURE_VILLAS.filter((v) => v.flagship);
  const additionalFeatured = AZURE_VILLAS.filter((v) => !v.flagship).slice(0, 3);
  const heroPhoto = AZURE_DESTINATIONS[0].heroImage;

  return (
    <AzureLayout title="Luxury Coastal Villas">
      {/* 1. CINEMATIC HERO + BOOKING BAR */}
      <section className="relative bg-[#09263B] text-[#F6F2EB]">
        <div className="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex items-end">
          <img
            src={heroPhoto}
            alt="Sunset across the Caldera House infinity terrace overlooking the Santorini caldera"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Controlled contrast scrim leaving center villa pool & horizon crisp */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(9,38,59,0.42) 0%, rgba(9,38,59,0.22) 45%, rgba(9,38,59,0.88) 100%)',
            }}
          />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 lg:pb-12">
            <div className="max-w-2xl space-y-4 mb-8">
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.26em] text-[#D4B06A] font-semibold">
                Santorini · Amalfi Coast · Bali
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold leading-[1.06] tracking-tight text-[#FCFBF8]">
                Find your place by the sea
              </h1>
              <p className="text-sm sm:text-base text-[#E2E8F0] leading-relaxed max-w-xl">
                Twelve architectural coastal villas with seasonal rate calendars, private cliffside
                pools, and direct local concierge coordination.
              </p>
            </div>

            {/* Mobile One-Tap Search Trigger + Flagship Link */}
            <div className="flex flex-col sm:hidden gap-3">
              <button
                type="button"
                onClick={() => setMobileSearchOpen(true)}
                className="w-full py-3.5 px-5 bg-[#FCFBF8] text-[#09263B] text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar className="w-4 h-4 text-[#2E7D8C]" />
                <span>Search Dates &amp; Destination</span>
              </button>
              <Link
                to="/showcase/azure-escapes/villas/caldera-house"
                className="w-full py-3 px-5 border border-white/40 bg-[#09263B]/70 text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2"
              >
                <span>Explore Caldera House</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4B06A]" />
              </Link>
            </div>

            {/* Desktop / Tablet Full Booking Bar */}
            <div className="hidden sm:block">
              <BookingBar variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Search Sheet Modal */}
      {mobileSearchOpen && (
        <div
          className="fixed inset-0 z-50 sm:hidden flex items-end bg-[#09263B]/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search villa availability"
        >
          <div className="w-full bg-[#F6F2EB] p-5 border-t border-[#DDD4C6] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDD4C6] pb-3">
              <h2 className="text-xl font-semibold text-[#09263B]">Check Coastal Availability</h2>
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="p-1.5 text-[#09263B]"
                aria-label="Close search sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <BookingBar variant="compact" />
          </div>
        </div>
      )}

      {/* 2. FEATURED DESTINATIONS */}
      <section className="py-16 lg:py-22 border-b border-[#DDD4C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-[#2E7D8C] font-semibold">
                Three Distinct Shorelines
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#09263B]">
                Curated Coastal Regions
              </h2>
            </div>
            <Link
              to="/showcase/azure-escapes/villas"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#09263B] hover:text-[#2E7D8C] transition-colors"
            >
              <span>Browse All 12 Villas</span>
              <ArrowRight className="w-4 h-4 text-[#A88443]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {AZURE_DESTINATIONS.map((dest) => (
              <Link
                key={dest.slug}
                to={`/showcase/azure-escapes/destinations/${dest.slug}`}
                className="group bg-[#FCFBF8] border border-[#DDD4C6] hover:border-[#2E7D8C] transition-colors flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#EDE6DA]">
                  <img
                    src={dest.heroImage}
                    alt={dest.heroAlt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#85652E] font-semibold">
                      {dest.country}
                    </p>
                    <h3 className="text-2xl font-semibold text-[#09263B] group-hover:text-[#2E7D8C] transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-sm text-[#394B59] leading-relaxed">{dest.tagline}</p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-[#EAE2D6] flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[#09263B]">
                    <span>4 Coastal Villas</span>
                    <ArrowRight className="w-4 h-4 text-[#A88443]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FLAGSHIP & FEATURED VILLAS */}
      <section className="py-16 lg:py-22 bg-[#EDE6DA]/45 border-b border-[#DDD4C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-[#2E7D8C] font-semibold">
                Signature Portfolio
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#09263B]">
                Flagship Coastal Residences
              </h2>
              <p className="text-sm sm:text-base text-[#394B59]">
                Start with Caldera House in Santorini or explore our flagship properties across the
                Amalfi Coast and Uluwatu, Bali.
              </p>
            </div>
            <Link
              to="/showcase/azure-escapes/villas/caldera-house"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#09263B] hover:bg-[#0F3854] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em] transition-colors self-start md:self-auto"
            >
              <span>Inspect Caldera House</span>
              <ArrowRight className="w-4 h-4 text-[#D4B06A]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {flagshipVillas.map((villa) => (
              <VillaCard
                key={villa.id}
                villa={villa}
                checkIn={searchDraft.checkIn}
                checkOut={searchDraft.checkOut}
                guests={searchDraft.guests}
              />
            ))}
          </div>

          {/* Secondary Row of Coastal Favorites */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-[#09263B]">Additional Handpicked Villas</h3>
              <Link
                to="/showcase/azure-escapes/villas"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2E7D8C] hover:text-[#09263B]"
              >
                View Full Inventory →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {additionalFeatured.map((villa) => (
                <VillaCard key={villa.id} villa={villa} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATED EXPERIENCES PREVIEW */}
      <section className="py-16 lg:py-22 border-b border-[#DDD4C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-[#2E7D8C] font-semibold">
                Private Sea &amp; Table
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#09263B]">
                Destination Experiences
              </h2>
              <p className="text-sm sm:text-base text-[#394B59]">
                Add private wooden yacht charters, vineyard tastings, or in-villa coastal chefs
                directly to your reservation quote.
              </p>
            </div>
            <Link
              to="/showcase/azure-escapes/experiences"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#09263B] hover:text-[#2E7D8C]"
            >
              <span>All Experiences</span>
              <ArrowRight className="w-4 h-4 text-[#A88443]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {AZURE_EXPERIENCES.slice(0, 3).map((exp) => (
              <div
                key={exp.id}
                className="bg-[#FCFBF8] border border-[#DDD4C6] flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-[#EDE6DA]">
                    <img
                      src={exp.image}
                      alt={exp.imageAlt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[#85652E] font-semibold">
                      <span>{exp.destinationLabel}</span>
                      <span className="text-[#526372]">{exp.duration}</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-[#09263B]">{exp.title}</h3>
                    <p className="text-sm text-[#394B59] leading-relaxed">{exp.summary}</p>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-[#EAE2D6] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#09263B] az-tabular">
                    {formatMoney(exp.priceEur, currency)}{' '}
                    <span className="font-normal text-[#526372]">
                      /{' '}
                      {exp.pricingBasis === 'per_stay'
                        ? 'charter'
                        : exp.pricingBasis === 'per_guest'
                        ? 'guest'
                        : 'night'}
                    </span>
                  </span>
                  <Link
                    to="/showcase/azure-escapes/experiences"
                    className="font-semibold uppercase tracking-[0.14em] text-[#2E7D8C] hover:text-[#09263B]"
                  >
                    Configure →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BOOKING GUARANTEES & SEASONAL PRICING TRANSPARENCY */}
      <section className="py-16 lg:py-20 bg-[#09263B] text-[#F6F2EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-[#D4B06A] font-semibold">
                Clarity By Design
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#FCFBF8]">
                Direct Villa Standards
              </h2>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Every stay across Azure Escapes includes transparent seasonal rate splits, clear
                turnaround windows, and dedicated destination support.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="border border-white/15 bg-white/[0.03] p-6 space-y-2.5">
                <ShieldCheck className="w-5 h-5 text-[#D4B06A]" />
                <h3 className="text-xl font-semibold text-white">Seasonal Rate Breakdown</h3>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  Multi-night stays crossing shoulder and quiet dates automatically itemize exact
                  per-season nightly tariffs.
                </p>
              </div>
              <div className="border border-white/15 bg-white/[0.03] p-6 space-y-2.5">
                <Calendar className="w-5 h-5 text-[#6BB8C5]" />
                <h3 className="text-xl font-semibold text-white">Turnaround Flexibility</h3>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  Half-open availability allows seamless morning departures on the check-in day of
                  incoming reservations.
                </p>
              </div>
              <div className="border border-white/15 bg-white/[0.03] p-6 space-y-2.5">
                <Compass className="w-5 h-5 text-[#D4B06A]" />
                <h3 className="text-xl font-semibold text-white">On-Island Concierge</h3>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  Pre-arrival airport escorts, daily housekeeping, and optional sea charters priced
                  transparently in EUR base rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQS + CONCIERGE BANNER */}
      <section className="py-16 lg:py-22">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.22em] text-[#2E7D8C] font-semibold">
                Demonstration Notes
              </p>
              <h2 className="text-3xl font-semibold text-[#09263B]">Frequently Asked Questions</h2>
            </div>

            <div className="border-t border-[#DDD4C6]">
              {AZURE_FAQS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={item.question} className="border-b border-[#DDD4C6]">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full py-4 flex items-center justify-between gap-4 text-left text-base font-medium text-[#09263B] hover:text-[#2E7D8C] cursor-pointer"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-[#2E7D8C]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="pb-5 text-sm text-[#394B59] leading-relaxed">{item.answer}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Private Concierge CTA Panel */}
          <div className="lg:col-span-5 bg-[#EDE6DA] border border-[#DDD4C6] p-8 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#85652E] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Bespoke Coastal Planning</span>
            </div>
            <h3 className="text-3xl font-semibold text-[#09263B]">
              Planning a multi-villa coastal celebration or private charter?
            </h3>
            <p className="text-sm text-[#394B59] leading-relaxed">
              Test our tailored hospitality inquiry desk for group transfers, connecting villas, or
              custom private chef itineraries.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/showcase/azure-escapes/concierge"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#09263B] hover:bg-[#0F3854] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
              >
                <span>Open Concierge Desk</span>
                <ArrowRight className="w-4 h-4 text-[#D4B06A]" />
              </Link>
              <Link
                to="/showcase/azure-escapes/villas/caldera-house"
                className="inline-flex items-center gap-2 px-5 py-3 border border-[#09263B] text-[#09263B] hover:bg-[#09263B] hover:text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
              >
                <span>Try Caldera House</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AzureLayout>
  );
};
