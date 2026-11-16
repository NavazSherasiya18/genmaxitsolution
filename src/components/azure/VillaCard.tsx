import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Check, Clock } from 'lucide-react';
import {
  AzureVilla,
  checkVillaAvailability,
  calculateVillaQuote,
  formatMoney,
} from '../../data/azureCatalog';
import { useAzureStore } from '../../context/AzureStoreContext';

interface VillaCardProps {
  villa: AzureVilla;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export const VillaCard: React.FC<VillaCardProps> = ({
  villa,
  checkIn,
  checkOut,
  guests = 2,
}) => {
  const { currency, isVillaSaved, toggleSaveVilla } = useAzureStore();
  const saved = isVillaSaved(villa.id);

  const hasDateQuery = Boolean(checkIn && checkOut);
  const availability = hasDateQuery
    ? checkVillaAvailability(villa, checkIn!, checkOut!, guests)
    : null;
  const quote =
    hasDateQuery && availability?.available
      ? calculateVillaQuote({
          villa,
          checkIn: checkIn!,
          checkOut: checkOut!,
          guests,
          selectedExtraIds: [],
        })
      : null;

  const detailUrl =
    hasDateQuery
      ? `/showcase/azure-escapes/villas/${villa.slug}?checkIn=${encodeURIComponent(
          checkIn!
        )}&checkOut=${encodeURIComponent(checkOut!)}&guests=${guests}`
      : `/showcase/azure-escapes/villas/${villa.slug}`;

  const primaryPhoto = villa.gallery[0];

  return (
    <article className="group bg-[#FCFBF8] border border-[#DDD4C6] flex flex-col justify-between transition-colors hover:border-[#2E7D8C]">
      <div>
        {/* Crisp Architectural Thumbnail Container — No badge clutter overlaid on photos */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE6DA]">
          <Link to={detailUrl} className="block w-full h-full">
            <img
              src={primaryPhoto.src}
              alt={primaryPhoto.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </Link>

          <button
            type="button"
            onClick={() => toggleSaveVilla(villa.id)}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${villa.name} from saved villas` : `Save ${villa.name}`}
            className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center border transition-colors cursor-pointer ${
              saved
                ? 'bg-[#09263B] border-[#09263B] text-[#D4B06A]'
                : 'bg-[#FCFBF8]/92 border-[#DDD4C6] text-[#09263B] hover:border-[#09263B]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#D4B06A]' : ''}`} />
          </button>
        </div>

        {/* Metadata & Editorial Body */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.16em] text-[#526372] font-medium">
            <span>
              {villa.locationArea} · {villa.destinationLabel.split(',')[0]}
            </span>
            {villa.flagship && (
              <span className="text-[#85652E] font-semibold">Flagship</span>
            )}
          </div>

          <h3 className="text-2xl font-semibold text-[#09263B] leading-snug">
            <Link to={detailUrl} className="hover:text-[#2E7D8C] transition-colors">
              {villa.name}
            </Link>
          </h3>

          <p className="text-sm text-[#394B59] leading-relaxed line-clamp-2">
            {villa.headline}
          </p>

          <div className="pt-2 border-t border-[#EAE2D6] flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#526372] az-tabular">
            <span>Up to {villa.maxGuests} guests</span>
            <span>·</span>
            <span>{villa.bedrooms} bedrooms</span>
            <span>·</span>
            <span>{villa.interiorSqm} m²</span>
            <span>·</span>
            <span>Min {villa.minNights} nights</span>
          </div>

          {/* Date-aware Availability Feedback when active */}
          {hasDateQuery && availability && (
            <div className="pt-1">
              {availability.available ? (
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1F6A52]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Available for selected dates</span>
                </p>
              ) : (
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8C4A27]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{availability.reason}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pricing & CTA Footer */}
      <div className="px-5 sm:px-6 py-4 bg-[#F6F2EB]/60 border-t border-[#DDD4C6] flex items-center justify-between gap-3">
        <div>
          {quote && quote.valid ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#526372]">
                {quote.nights}-night stay total
              </p>
              <p className="text-base font-semibold text-[#09263B] az-tabular">
                {formatMoney(quote.totalEur, currency)}
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#526372]">From</p>
              <p className="text-base font-semibold text-[#09263B] az-tabular">
                {formatMoney(villa.baseNightlyEur, currency)}{' '}
                <span className="text-xs font-normal text-[#526372]">/ night</span>
              </p>
            </>
          )}
        </div>

        <Link
          to={detailUrl}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#09263B] hover:bg-[#0F3854] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.14em] transition-colors whitespace-nowrap"
        >
          <span>View Villa</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#D4B06A]" />
        </Link>
      </div>
    </article>
  );
};
