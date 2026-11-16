import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle2, Compass, Users } from 'lucide-react';
import { AzureLayout } from '../../components/azure/AzureLayout';
import { AzureBrandLogo } from '../../components/azure/AzureBrandLogo';
import { formatMoney, formatShortDate } from '../../data/azureCatalog';
import { useAzureStore } from '../../context/AzureStoreContext';

export const AzureConfirmationPage: React.FC = () => {
  const { lastConfirmation, currency, clearConfirmation } = useAzureStore();

  if (!lastConfirmation) {
    return (
      <AzureLayout title="Reservation Confirmation">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
          <h1 className="text-4xl font-semibold text-[#09263B]">No Active Demo Reservation</h1>
          <p className="text-sm text-[#394B59] max-w-md mx-auto">
            Select a coastal villa, choose dates, and submit a reservation request to view your
            personalized Azure Escapes booking summary here.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/showcase/azure-escapes/villas/caldera-house"
              className="px-6 py-3 bg-[#09263B] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Inspect Caldera House
            </Link>
            <Link
              to="/showcase/azure-escapes/villas"
              className="px-6 py-3 border border-[#09263B] text-[#09263B] text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Browse Villas
            </Link>
          </div>
        </div>
      </AzureLayout>
    );
  }

  const activeCurrency = currency || lastConfirmation.currency;
  const { quote } = lastConfirmation;

  return (
    <AzureLayout title={`Confirmed ${lastConfirmation.reference}`}>
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Official Crest Confirmation Card */}
          <div className="bg-[#FCFBF8] border border-[#DDD4C6] shadow-xl overflow-hidden">
            {/* Deep Mediterranean Header Band */}
            <div className="bg-[#09263B] text-[#F6F2EB] p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#17415E]">
              <div className="space-y-4">
                <AzureBrandLogo variant="full" tone="light" size="md" showDescriptor />
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#6BB8C5] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#D4B06A]" />
                  <span>Demo Reservation Confirmed</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold text-white">
                  Thank you, {lastConfirmation.leadGuestFirstName}
                </h1>
              </div>

              <div className="bg-white/[0.06] border border-white/15 px-5 py-4 text-left sm:text-right">
                <span className="block text-[11px] uppercase tracking-[0.18em] text-[#D4B06A] font-semibold">
                  Reference Code
                </span>
                <span className="text-xl font-semibold tracking-wider text-white az-tabular">
                  {lastConfirmation.reference}
                </span>
              </div>
            </div>

            {/* Stay Overview Body */}
            <div className="p-8 sm:p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-8 border-b border-[#EAE2D6]">
                <div className="md:col-span-5 aspect-[4/3] overflow-hidden bg-[#EDE6DA] border border-[#DDD4C6]">
                  <img
                    src={lastConfirmation.villaImage}
                    alt={lastConfirmation.villaName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-7 space-y-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#85652E] font-semibold">
                    {lastConfirmation.locationArea} · {lastConfirmation.destinationLabel}
                  </p>
                  <h2 className="text-3xl font-semibold text-[#09263B]">
                    {lastConfirmation.villaName}
                  </h2>

                  <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-[#394B59] az-tabular">
                    <div>
                      <span className="flex items-center gap-1.5 text-[#526372] mb-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#2E7D8C]" />
                        Check-in
                      </span>
                      <strong className="text-sm text-[#09263B]">
                        {formatShortDate(lastConfirmation.checkIn)}
                      </strong>
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-[#526372] mb-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#2E7D8C]" />
                        Check-out
                      </span>
                      <strong className="text-sm text-[#09263B]">
                        {formatShortDate(lastConfirmation.checkOut)}
                      </strong>
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-[#526372] mb-0.5">
                        <Users className="w-3.5 h-3.5 text-[#2E7D8C]" />
                        Party Size
                      </span>
                      <strong className="text-sm text-[#09263B]">
                        {lastConfirmation.guests}{' '}
                        {lastConfirmation.guests === 1 ? 'Guest' : 'Guests'}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[#526372] mb-0.5">Duration</span>
                      <strong className="text-sm text-[#09263B]">{quote.nights} Nights</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Quote Verification */}
              <div className="space-y-3 text-xs sm:text-sm az-tabular">
                <h3 className="text-xl font-semibold text-[#09263B] mb-2">
                  Itemized Seasonal &amp; Experience Summary
                </h3>

                {quote.seasonalBreakdown.map((seg) => (
                  <div
                    key={seg.seasonId}
                    className="flex items-center justify-between text-[#394B59]"
                  >
                    <span>
                      {seg.nights} {seg.nights === 1 ? 'night' : 'nights'} · {seg.seasonLabel} (
                      {formatMoney(seg.nightlyEur, activeCurrency)} / nt)
                    </span>
                    <span className="font-medium text-[#09263B]">
                      {formatMoney(seg.subtotalEur, activeCurrency)}
                    </span>
                  </div>
                ))}

                {quote.extrasBreakdown.map((ex) => (
                  <div key={ex.id} className="flex items-center justify-between text-[#394B59]">
                    <span>Experience: {ex.title}</span>
                    <span className="font-medium text-[#09263B]">
                      {formatMoney(ex.subtotalEur, activeCurrency)}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between text-[#526372]">
                  <span>Concierge &amp; Residence Preparation (6%)</span>
                  <span>{formatMoney(quote.serviceFeeEur, activeCurrency)}</span>
                </div>

                <div className="flex items-center justify-between text-[#526372]">
                  <span>Coastal Municipality Levy</span>
                  <span>{formatMoney(quote.touristTaxEur, activeCurrency)}</span>
                </div>

                <div className="pt-4 border-t border-[#DDD4C6] flex items-baseline justify-between">
                  <div>
                    <span className="block text-base font-semibold text-[#09263B]">
                      Simulated Total
                    </span>
                    <span className="block text-xs text-[#526372]">
                      Base EUR €{quote.totalEur.toLocaleString('en-US')}
                    </span>
                  </div>
                  <span className="text-3xl font-semibold text-[#09263B]">
                    {formatMoney(quote.totalEur, activeCurrency)}
                  </span>
                </div>
              </div>

              {lastConfirmation.specialRequestsNote && (
                <div className="bg-[#F6F2EB] border border-[#DDD4C6] p-4 text-xs text-[#394B59]">
                  <strong className="text-[#09263B] block mb-1">Noted Arrival Preferences:</strong>
                  <span>{lastConfirmation.specialRequestsNote}</span>
                </div>
              )}

              {/* Explicit Demo Privacy Banner */}
              <div className="bg-[#E5F1F3]/65 border border-[#2E7D8C]/35 p-4 text-xs text-[#09263B]">
                <strong>Demo confirmation only:</strong> No payment was collected, no external email
                was sent, and guest contact fields (email/phone) are never saved in persistent
                storage.
              </div>

              {/* Next Navigation Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/showcase/azure-escapes"
                    className="px-5 py-3 bg-[#09263B] hover:bg-[#0F3854] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.15em] inline-flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-[#D4B06A]" />
                    <span>Return to Azure Home</span>
                  </Link>
                  <Link
                    to="/portfolio"
                    className="px-5 py-3 border border-[#09263B] text-[#09263B] hover:bg-[#09263B] hover:text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.15em] inline-flex items-center gap-2 transition-colors"
                  >
                    <span>Back to Genmax Portfolio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={clearConfirmation}
                  className="text-xs text-[#526372] hover:text-[#09263B] underline cursor-pointer"
                >
                  Clear demo record
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AzureLayout>
  );
};
