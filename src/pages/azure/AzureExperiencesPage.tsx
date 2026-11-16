import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { AzureLayout } from '../../components/azure/AzureLayout';
import {
  AZURE_EXPERIENCES,
  AZURE_VILLAS,
  DestinationSlug,
  formatMoney,
} from '../../data/azureCatalog';
import { useAzureStore } from '../../context/AzureStoreContext';

export const AzureExperiencesPage: React.FC = () => {
  const { currency, reservationDraft, toggleDraftExtra } = useAzureStore();
  const [regionFilter, setRegionFilter] = useState<DestinationSlug | 'all'>('all');

  const items = AZURE_EXPERIENCES.filter((exp) =>
    regionFilter === 'all' ? true : exp.destination === regionFilter || exp.destination === 'all'
  );

  const recommendedVillaSlug = (dest: DestinationSlug | 'all') => {
    if (dest === 'all') return 'caldera-house';
    return AZURE_VILLAS.find((v) => v.destination === dest)?.slug || 'caldera-house';
  };

  return (
    <AzureLayout title="Coastal Experiences & Charters">
      <section className="bg-[#09263B] text-[#F6F2EB] py-14 border-b border-[#17415E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[#D4B06A] font-semibold">
            Private Charters &amp; Culinary Tables
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#FCFBF8]">
            Destination Experiences
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
            Pre-select private boat charters, sommelier tastings, and in-villa dining. Any added
            experience recalculates dynamically by stay, guest count, or nightly host service at
            reservation review.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="bg-[#EDE6DA] border-b border-[#DDD4C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Regions' },
              { id: 'santorini', label: 'Santorini' },
              { id: 'amalfi-coast', label: 'Amalfi Coast' },
              { id: 'bali', label: 'Bali' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRegionFilter(tab.id as DestinationSlug | 'all')}
                className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-semibold cursor-pointer transition-colors ${
                  regionFilter === tab.id
                    ? 'bg-[#09263B] text-[#F6F2EB]'
                    : 'bg-[#FCFBF8] text-[#09263B] border border-[#DDD4C6] hover:border-[#2E7D8C]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link
            to={`/showcase/azure-escapes/villas/${recommendedVillaSlug(regionFilter)}`}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2E7D8C] hover:text-[#09263B]"
          >
            Continue to Villa Quote →
          </Link>
        </div>
      </div>

      {/* Experiences Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map((exp) => {
            const selected = reservationDraft.selectedExtraIds.includes(exp.id);
            const unitLabel =
              exp.pricingBasis === 'per_stay'
                ? 'flat rate per stay'
                : exp.pricingBasis === 'per_guest'
                ? 'per guest'
                : 'per night';

            return (
              <article
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
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[#85652E] font-semibold">
                      <span>{exp.destinationLabel}</span>
                      <span className="text-[#526372]">{exp.duration}</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-[#09263B]">{exp.title}</h2>
                    <p className="text-sm text-[#394B59] leading-relaxed">{exp.summary}</p>
                    <ul className="space-y-1.5 pt-2 border-t border-[#EAE2D6] text-xs text-[#394B59]">
                      {exp.includes.map((inc) => (
                        <li key={inc} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#2E7D8C] mt-0.5 shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 py-4 bg-[#F6F2EB]/70 border-t border-[#DDD4C6] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-[#526372] capitalize">{unitLabel}</span>
                    <span className="text-lg font-semibold text-[#09263B] az-tabular">
                      {formatMoney(exp.priceEur, currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleDraftExtra(exp.id)}
                      aria-pressed={selected}
                      className={`flex-1 py-2.5 px-3 text-xs font-semibold uppercase tracking-[0.14em] border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#2E7D8C] border-[#2E7D8C] text-white'
                          : 'bg-white border-[#09263B] text-[#09263B] hover:bg-[#09263B] hover:text-white'
                      }`}
                    >
                      {selected ? 'Added to Stay Draft' : 'Add to Stay'}
                    </button>
                    <Link
                      to={`/showcase/azure-escapes/villas/${recommendedVillaSlug(exp.destination)}`}
                      className="p-2.5 bg-[#09263B] text-[#F6F2EB] hover:bg-[#0F3854]"
                      aria-label={`View villa in ${exp.destinationLabel}`}
                      title={`Book in ${exp.destinationLabel}`}
                    >
                      <ArrowRight className="w-4 h-4 text-[#D4B06A]" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </AzureLayout>
  );
};
