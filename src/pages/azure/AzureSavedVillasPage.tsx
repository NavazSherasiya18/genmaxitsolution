import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark } from 'lucide-react';
import { AzureLayout } from '../../components/azure/AzureLayout';
import { VillaCard } from '../../components/azure/VillaCard';
import { AZURE_VILLAS } from '../../data/azureCatalog';
import { useAzureStore } from '../../context/AzureStoreContext';

export const AzureSavedVillasPage: React.FC = () => {
  const { savedVillaIds, searchDraft } = useAzureStore();
  const savedVillas = AZURE_VILLAS.filter((v) => savedVillaIds.includes(v.id));

  return (
    <AzureLayout title="Saved Shortlist">
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DDD4C6]">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#2E7D8C] font-semibold inline-flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#A88443]" />
                Personal Shortlist
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[#09263B]">
                Saved Coastal Villas ({savedVillas.length})
              </h1>
              <p className="text-sm text-[#394B59]">
                Your bookmarked houses remain saved locally in this browser across visits.
              </p>
            </div>

            <Link
              to="/showcase/azure-escapes/villas"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#09263B] hover:text-[#2E7D8C]"
            >
              <span>Browse All Villas</span>
              <ArrowRight className="w-4 h-4 text-[#A88443]" />
            </Link>
          </div>

          {savedVillas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {savedVillas.map((villa) => (
                <VillaCard
                  key={villa.id}
                  villa={villa}
                  checkIn={searchDraft.checkIn}
                  checkOut={searchDraft.checkOut}
                  guests={searchDraft.guests}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#FCFBF8] border border-[#DDD4C6] p-12 text-center space-y-4">
              <h2 className="text-2xl font-semibold text-[#09263B]">Your shortlist is currently empty</h2>
              <p className="text-sm text-[#394B59] max-w-md mx-auto">
                Bookmark villas across Santorini, the Amalfi Coast, or Bali to compare nightly rates
                and seasonal availability side by side.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  to="/showcase/azure-escapes/villas/caldera-house"
                  className="px-5 py-3 bg-[#09263B] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.15em]"
                >
                  Inspect Caldera House
                </Link>
                <Link
                  to="/showcase/azure-escapes/villas"
                  className="px-5 py-3 border border-[#09263B] text-[#09263B] text-xs font-semibold uppercase tracking-[0.15em]"
                >
                  Explore All Villas
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </AzureLayout>
  );
};
