import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Filter, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { AzureLayout } from '../../components/azure/AzureLayout';
import { BookingBar } from '../../components/azure/BookingBar';
import { VillaCard } from '../../components/azure/VillaCard';
import {
  AZURE_VILLAS,
  DestinationSlug,
  checkVillaAvailability,
  formatShortDate,
} from '../../data/azureCatalog';
import { useAzureStore } from '../../context/AzureStoreContext';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'capacity';

export const AzureSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchDraft, updateSearchDraft } = useAzureStore();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const destination = (searchParams.get('destination') as DestinationSlug | 'all') || 'all';
  const checkIn = searchParams.get('checkIn') || searchDraft.checkIn;
  const checkOut = searchParams.get('checkOut') || searchDraft.checkOut;
  const guests = Number(searchParams.get('guests') || searchDraft.guests || 2);

  const minBedrooms = Number(searchParams.get('bedrooms') || 0);
  const maxRateEur = Number(searchParams.get('maxPrice') || 0);
  const onlyPool = searchParams.get('pool') === '1';
  const onlySeaView = searchParams.get('seaView') === '1';
  const onlyFamily = searchParams.get('family') === '1';
  const availableOnly = searchParams.get('available') === '1';
  const sortBy = (searchParams.get('sort') as SortOption) || 'featured';

  useEffect(() => {
    updateSearchDraft({ destination, checkIn, checkOut, guests });
  }, [destination, checkIn, checkOut, guests, updateSearchDraft]);

  const setFilterParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '0') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const resetAllFilters = () => {
    const next = new URLSearchParams();
    if (checkIn) next.set('checkIn', checkIn);
    if (checkOut) next.set('checkOut', checkOut);
    next.set('guests', '2');
    setSearchParams(next, { replace: true });
  };

  const filteredVillas = useMemo(() => {
    const list = AZURE_VILLAS.filter((villa) => {
      if (destination !== 'all' && villa.destination !== destination) return false;
      if (guests > villa.maxGuests) return false;
      if (minBedrooms > 0 && villa.bedrooms < minBedrooms) return false;
      if (maxRateEur > 0 && villa.baseNightlyEur > maxRateEur) return false;
      if (onlyPool && !villa.hasPrivatePool) return false;
      if (onlySeaView && !villa.hasSeaView) return false;
      if (onlyFamily && !villa.familyFriendly) return false;
      if (availableOnly && checkIn && checkOut) {
        const status = checkVillaAvailability(villa, checkIn, checkOut, guests);
        if (!status.available) return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.baseNightlyEur - b.baseNightlyEur);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.baseNightlyEur - a.baseNightlyEur);
    }
    if (sortBy === 'capacity') {
      return [...list].sort((a, b) => b.maxGuests - a.maxGuests);
    }
    return [...list].sort((a, b) => Number(b.flagship) - Number(a.flagship));
  }, [
    destination,
    guests,
    minBedrooms,
    maxRateEur,
    onlyPool,
    onlySeaView,
    onlyFamily,
    availableOnly,
    checkIn,
    checkOut,
    sortBy,
  ]);

  const activeFilterCount =
    (destination !== 'all' ? 1 : 0) +
    (minBedrooms > 0 ? 1 : 0) +
    (maxRateEur > 0 ? 1 : 0) +
    (onlyPool ? 1 : 0) +
    (onlySeaView ? 1 : 0) +
    (onlyFamily ? 1 : 0) +
    (availableOnly ? 1 : 0);

  const filterControls = (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#DDD4C6] pb-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#09263B] inline-flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#2E7D8C]" />
          Refine Inventory
        </span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="text-xs font-medium text-[#2E7D8C] hover:text-[#09263B] inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <label className="block text-[11px] uppercase tracking-[0.16em] text-[#526372] font-semibold">
          Region
        </label>
        <div className="flex flex-col gap-1.5">
          {[
            { value: 'all', label: 'All Regions (12)' },
            { value: 'santorini', label: 'Santorini, Greece (4)' },
            { value: 'amalfi-coast', label: 'Amalfi Coast, Italy (4)' },
            { value: 'bali', label: 'Bali, Indonesia (4)' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilterParam('destination', opt.value)}
              className={`text-left px-3 py-2 text-xs font-medium border transition-colors cursor-pointer ${
                destination === opt.value
                  ? 'bg-[#09263B] text-[#F6F2EB] border-[#09263B]'
                  : 'bg-[#FCFBF8] text-[#09263B] border-[#DDD4C6] hover:border-[#2E7D8C]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <label
          htmlFor="az-filter-beds"
          className="block text-[11px] uppercase tracking-[0.16em] text-[#526372] font-semibold"
        >
          Minimum Bedrooms
        </label>
        <select
          id="az-filter-beds"
          value={minBedrooms}
          onChange={(e) => setFilterParam('bedrooms', e.target.value)}
          className="w-full h-10 px-3 bg-[#FCFBF8] border border-[#DDD4C6] text-xs font-medium text-[#09263B]"
        >
          <option value="0">Any bedroom count</option>
          <option value="2">2+ Bedrooms</option>
          <option value="3">3+ Bedrooms</option>
          <option value="4">4+ Bedrooms</option>
          <option value="5">5 Bedrooms (Estates)</option>
        </select>
      </div>

      {/* Max Base Rate */}
      <div className="space-y-2">
        <label
          htmlFor="az-filter-price"
          className="block text-[11px] uppercase tracking-[0.16em] text-[#526372] font-semibold"
        >
          Max Nightly Base Tariff (EUR)
        </label>
        <select
          id="az-filter-price"
          value={maxRateEur}
          onChange={(e) => setFilterParam('maxPrice', e.target.value)}
          className="w-full h-10 px-3 bg-[#FCFBF8] border border-[#DDD4C6] text-xs font-medium text-[#09263B]"
        >
          <option value="0">Any nightly tariff</option>
          <option value="900">Up to €900 / night</option>
          <option value="1300">Up to €1,300 / night</option>
          <option value="1600">Up to €1,600 / night</option>
        </select>
      </div>

      {/* Architectural Preferences */}
      <div className="space-y-2.5">
        <span className="block text-[11px] uppercase tracking-[0.16em] text-[#526372] font-semibold">
          Features &amp; Availability
        </span>
        {[
          { key: 'available', active: availableOnly, label: 'Available on selected dates' },
          { key: 'seaView', active: onlySeaView, label: 'Direct Sea Horizon View' },
          { key: 'pool', active: onlyPool, label: 'Private Infinity / Plunge Pool' },
          { key: 'family', active: onlyFamily, label: 'Family Friendly Layout' },
        ].map((item) => (
          <label
            key={item.key}
            className="flex items-center gap-2.5 text-xs text-[#09263B] cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={item.active}
              onChange={(e) => setFilterParam(item.key, e.target.checked ? '1' : null)}
              className="w-4 h-4 accent-[#09263B]"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <AzureLayout title="Search Coastal Villas">
      {/* Header & Integrated Booking Bar */}
      <section className="bg-[#EDE6DA]/70 border-b border-[#DDD4C6] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#2E7D8C] font-semibold">
              Live Concept Availability &amp; Rates
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#09263B]">
              Coastal Villa Collection
            </h1>
          </div>

          <BookingBar
            variant="compact"
            initialDestination={destination}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialGuests={guests}
            onSubmitCustom={(params) => {
              const next = new URLSearchParams(searchParams);
              if (params.destination === 'all') next.delete('destination');
              else next.set('destination', params.destination);
              next.set('checkIn', params.checkIn);
              next.set('checkOut', params.checkOut);
              next.set('guests', String(params.guests));
              setSearchParams(next, { replace: true });
            }}
          />
        </div>
      </section>

      {/* Main Filter + Grid Body */}
      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 bg-[#FCFBF8] border border-[#DDD4C6] p-6 sticky top-24">
            {filterControls}
          </aside>

          {/* Results Column */}
          <div className="lg:col-span-9 space-y-6">
            {/* Toolbar: Count, Mobile Filter Trigger, Sort */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#DDD4C6]">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-[#09263B] az-tabular">
                  {filteredVillas.length} {filteredVillas.length === 1 ? 'villa' : 'villas'} matching
                </p>
                {checkIn && checkOut && (
                  <p className="text-xs text-[#526372] az-tabular">
                    Stay: {formatShortDate(checkIn)} – {formatShortDate(checkOut)} · {guests}{' '}
                    {guests === 1 ? 'guest' : 'guests'}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 border border-[#DDD4C6] bg-[#FCFBF8] text-xs font-semibold uppercase tracking-[0.12em] text-[#09263B]"
                >
                  <Filter className="w-3.5 h-3.5 text-[#2E7D8C]" />
                  <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
                </button>

                <label htmlFor="az-sort" className="sr-only">
                  Sort villas
                </label>
                <select
                  id="az-sort"
                  value={sortBy}
                  onChange={(e) => setFilterParam('sort', e.target.value)}
                  className="h-9 px-3 bg-[#FCFBF8] border border-[#DDD4C6] text-xs font-medium text-[#09263B]"
                >
                  <option value="featured">Sort: Featured First</option>
                  <option value="price-asc">Nightly Rate: Low to High</option>
                  <option value="price-desc">Nightly Rate: High to Low</option>
                  <option value="capacity">Largest Guest Capacity</option>
                </select>
              </div>
            </div>

            {/* Active Filter Summary Strip */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {destination !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setFilterParam('destination', 'all')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EDE6DA] border border-[#DDD4C6] text-[#09263B] cursor-pointer"
                  >
                    <span>Region: {destination}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {minBedrooms > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilterParam('bedrooms', '0')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EDE6DA] border border-[#DDD4C6] text-[#09263B] cursor-pointer"
                  >
                    <span>{minBedrooms}+ Bedrooms</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {maxRateEur > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilterParam('maxPrice', '0')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EDE6DA] border border-[#DDD4C6] text-[#09263B] cursor-pointer"
                  >
                    <span>Max €{maxRateEur}/night</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {onlySeaView && (
                  <button
                    type="button"
                    onClick={() => setFilterParam('seaView', null)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EDE6DA] border border-[#DDD4C6] text-[#09263B] cursor-pointer"
                  >
                    <span>Sea Horizon View</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {onlyFamily && (
                  <button
                    type="button"
                    onClick={() => setFilterParam('family', null)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EDE6DA] border border-[#DDD4C6] text-[#09263B] cursor-pointer"
                  >
                    <span>Family Friendly</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {availableOnly && (
                  <button
                    type="button"
                    onClick={() => setFilterParam('available', null)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EDE6DA] border border-[#DDD4C6] text-[#09263B] cursor-pointer"
                  >
                    <span>Available on dates</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[#2E7D8C] font-semibold hover:underline ml-1 cursor-pointer"
                >
                  Reset all
                </button>
              </div>
            )}

            {/* Villa Cards Grid or Clear Empty State */}
            {filteredVillas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {filteredVillas.map((villa) => (
                  <VillaCard
                    key={villa.id}
                    villa={villa}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    guests={guests}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#FCFBF8] border border-[#DDD4C6] p-10 text-center space-y-4">
                <h2 className="text-2xl font-semibold text-[#09263B]">
                  No villas match this combination of filters
                </h2>
                <p className="text-sm text-[#394B59] max-w-md mx-auto">
                  Relax your bedroom, nightly rate, or date filters to view all twelve curated
                  houses across Santorini, Amalfi Coast, and Bali.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-5 py-2.5 bg-[#09263B] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.14em] cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                  <Link
                    to="/showcase/azure-escapes/villas/caldera-house"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#09263B] text-[#09263B] text-xs font-semibold uppercase tracking-[0.14em]"
                  >
                    <span>Explore Caldera House</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Filter coastal villas"
        >
          <div
            className="fixed inset-0 bg-[#09263B]/55 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative z-10 w-80 max-w-[85vw] bg-[#F6F2EB] h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#DDD4C6]">
                <h2 className="text-xl font-semibold text-[#09263B]">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-[#09263B]"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterControls}
            </div>

            <div className="pt-6 border-t border-[#DDD4C6] mt-6">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#09263B] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em]"
              >
                Show {filteredVillas.length} Villas
              </button>
            </div>
          </div>
        </div>
      )}
    </AzureLayout>
  );
};
