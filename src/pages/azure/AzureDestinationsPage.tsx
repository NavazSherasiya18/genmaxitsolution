import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Compass, Plane, Sun } from 'lucide-react';
import { AzureLayout } from '../../components/azure/AzureLayout';
import { VillaCard } from '../../components/azure/VillaCard';
import {
  AZURE_DESTINATIONS,
  AZURE_EXPERIENCES,
  AZURE_VILLAS,
  DestinationSlug,
  formatMoney,
  getDestinationBySlug,
} from '../../data/azureCatalog';
import { useAzureStore } from '../../context/AzureStoreContext';

export const AzureDestinationsPage: React.FC = () => {
  const { destination } = useParams<{ destination: string }>();
  const { currency, searchDraft } = useAzureStore();

  const currentDest =
    getDestinationBySlug(destination) ?? AZURE_DESTINATIONS[0];

  const regionalVillas = AZURE_VILLAS.filter(
    (v) => v.destination === currentDest.slug
  );
  const regionalExperiences = AZURE_EXPERIENCES.filter(
    (exp) => exp.destination === currentDest.slug || exp.destination === 'all'
  );

  return (
    <AzureLayout title={`${currentDest.name} Villas`}>
      {/* Destination Switcher Bar */}
      <div className="bg-[#EDE6DA] border-b border-[#DDD4C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#526372] font-semibold mr-2">
              Region:
            </span>
            {AZURE_DESTINATIONS.map((d) => {
              const active = d.slug === currentDest.slug;
              return (
                <Link
                  key={d.slug}
                  to={`/showcase/azure-escapes/destinations/${d.slug}`}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-[0.14em] font-semibold transition-colors ${
                    active
                      ? 'bg-[#09263B] text-[#F6F2EB]'
                      : 'text-[#09263B] hover:bg-[#FCFBF8] border border-transparent hover:border-[#DDD4C6]'
                  }`}
                >
                  {d.name}
                </Link>
              );
            })}
          </div>

          <Link
            to={`/showcase/azure-escapes/villas?destination=${currentDest.slug as DestinationSlug}`}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2E7D8C] hover:text-[#09263B]"
          >
            Search {currentDest.name} With Dates →
          </Link>
        </div>
      </div>

      {/* Destination Hero Banner */}
      <section className="relative bg-[#09263B] text-[#F6F2EB]">
        <div className="relative min-h-[380px] sm:min-h-[440px] flex items-end">
          <img
            src={currentDest.heroImage}
            alt={currentDest.heroAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(9,38,59,0.35) 0%, rgba(9,38,59,0.88) 100%)',
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <p className="text-xs uppercase tracking-[0.24em] text-[#D4B06A] font-semibold mb-2">
              {currentDest.eyebrow} · {currentDest.country}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#FCFBF8] mb-3">
              {currentDest.name}
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-[#E2E8F0] leading-relaxed">
              {currentDest.description}
            </p>
          </div>
        </div>
      </section>

      {/* Regional Highlights & Travel Practicalities */}
      <section className="py-12 border-b border-[#DDD4C6] bg-[#FCFBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl font-semibold text-[#09263B]">Architecture &amp; Arrival</h2>
            <div className="space-y-3 text-sm text-[#394B59]">
              <p className="flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-[#2E7D8C] mt-0.5 shrink-0" />
                <span>{currentDest.architectureNote}</span>
              </p>
              <p className="flex items-start gap-2.5">
                <Sun className="w-4 h-4 text-[#A88443] mt-0.5 shrink-0" />
                <span>
                  <strong className="text-[#09263B]">Ideal Season:</strong> {currentDest.bestMonths}
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-[#2E7D8C] mt-0.5 shrink-0" />
                <span>
                  <strong className="text-[#09263B]">Arrival Escort:</strong> {currentDest.transferNote}
                </span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentDest.highlights.map((h) => (
              <div key={h.title} className="bg-[#F6F2EB] border border-[#DDD4C6] p-5 space-y-1.5">
                <h3 className="text-lg font-semibold text-[#09263B]">{h.title}</h3>
                <p className="text-xs text-[#394B59] leading-relaxed">{h.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Villas Grid */}
      <section className="py-14 lg:py-18 border-b border-[#DDD4C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#2E7D8C] font-semibold">
                {regionalVillas.length} Private Houses
              </p>
              <h2 className="text-3xl font-semibold text-[#09263B]">
                Villas in {currentDest.name}
              </h2>
            </div>
            <Link
              to={`/showcase/azure-escapes/villas?destination=${currentDest.slug}&checkIn=${searchDraft.checkIn}&checkOut=${searchDraft.checkOut}&guests=${searchDraft.guests}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#09263B] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.14em]"
            >
              <span>Filter {currentDest.name} by Dates</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4B06A]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {regionalVillas.map((villa) => (
              <VillaCard
                key={villa.id}
                villa={villa}
                checkIn={searchDraft.checkIn}
                checkOut={searchDraft.checkOut}
                guests={searchDraft.guests}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Regional Experiences */}
      <section className="py-14 bg-[#EDE6DA]/45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#85652E] font-semibold">
                Local Curations
              </p>
              <h2 className="text-3xl font-semibold text-[#09263B]">
                Available in {currentDest.name}
              </h2>
            </div>
            <Link
              to="/showcase/azure-escapes/experiences"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[#09263B] hover:text-[#2E7D8C]"
            >
              All Experiences →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regionalExperiences.map((exp) => (
              <div key={exp.id} className="bg-[#FCFBF8] border border-[#DDD4C6] p-6 space-y-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#2E7D8C] font-semibold">
                  {exp.duration}
                </p>
                <h3 className="text-2xl font-semibold text-[#09263B]">{exp.title}</h3>
                <p className="text-sm text-[#394B59] leading-relaxed">{exp.summary}</p>
                <div className="pt-3 border-t border-[#EAE2D6] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#09263B] az-tabular">
                    {formatMoney(exp.priceEur, currency)}
                  </span>
                  <Link
                    to={`/showcase/azure-escapes/villas/${regionalVillas[0].slug}`}
                    className="font-semibold uppercase tracking-[0.14em] text-[#09263B] hover:text-[#2E7D8C]"
                  >
                    Pair with Stay →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AzureLayout>
  );
};
