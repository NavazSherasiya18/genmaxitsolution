import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Bookmark,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Expand,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { AzureLayout } from '../../components/azure/AzureLayout';
import { VillaCard } from '../../components/azure/VillaCard';
import {
  AZURE_EXPERIENCES,
  AZURE_VILLAS,
  addDaysIso,
  calculateVillaQuote,
  checkVillaAvailability,
  findNextAvailableWindow,
  findSampleStayWindow,
  formatMoney,
  formatShortDate,
  getTodayIso,
  getVillaBySlug,
} from '../../data/azureCatalog';
import { useAzureStore } from '../../context/AzureStoreContext';

export const AzureVillaDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingPanelRef = useRef<HTMLDivElement>(null);

  const villa = getVillaBySlug(slug);
  const {
    currency,
    isVillaSaved,
    toggleSaveVilla,
    reservationDraft,
    updateReservationDraft,
    toggleDraftExtra,
  } = useAzureStore();

  const today = getTodayIso();

  const initialWindow = useMemo(() => {
    if (!villa) return { checkIn: addDaysIso(today, 8), checkOut: addDaysIso(today, 12), guests: 2 };
    const qpIn = searchParams.get('checkIn');
    const qpOut = searchParams.get('checkOut');
    const qpGuests = Number(searchParams.get('guests') || reservationDraft.guests || 2);
    if (qpIn && qpOut && qpOut > qpIn) {
      return {
        checkIn: qpIn,
        checkOut: qpOut,
        guests: Math.min(Math.max(1, qpGuests), villa.maxGuests),
      };
    }
    if (reservationDraft.villaSlug === villa.slug && reservationDraft.checkIn && reservationDraft.checkOut) {
      return {
        checkIn: reservationDraft.checkIn,
        checkOut: reservationDraft.checkOut,
        guests: Math.min(Math.max(1, reservationDraft.guests), villa.maxGuests),
      };
    }
    const open = findSampleStayWindow(villa);
    return open;
  }, [villa, searchParams, reservationDraft.villaSlug, reservationDraft.checkIn, reservationDraft.checkOut, reservationDraft.guests, today]);

  const [checkIn, setCheckIn] = useState(initialWindow.checkIn);
  const [checkOut, setCheckOut] = useState(initialWindow.checkOut);
  const [guests, setGuests] = useState(initialWindow.guests);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setCheckIn(initialWindow.checkIn);
    setCheckOut(initialWindow.checkOut);
    setGuests(initialWindow.guests);
    setActivePhotoIndex(0);
  }, [slug, initialWindow.checkIn, initialWindow.checkOut, initialWindow.guests]);

  useEffect(() => {
    if (!lightboxOpen || !villa) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % villa.gallery.length);
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + villa.gallery.length) % villa.gallery.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, villa]);

  if (!villa) {
    return (
      <AzureLayout title="Villa Not Found">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
          <h1 className="text-4xl font-semibold text-[#09263B]">Residence Not Found</h1>
          <p className="text-sm text-[#394B59]">
            This villa URL does not match our current collection. Explore Caldera House in
            Santorini or browse all 12 villas.
          </p>
          <div className="flex justify-center gap-4 pt-2">
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
              View All Villas
            </Link>
          </div>
        </div>
      </AzureLayout>
    );
  }

  const saved = isVillaSaved(villa.id);
  const destinationExtras = AZURE_EXPERIENCES.filter(
    (exp) => exp.destination === villa.destination || exp.destination === 'all'
  );
  const availability = checkVillaAvailability(villa, checkIn, checkOut, guests);
  const quote = calculateVillaQuote({
    villa,
    checkIn,
    checkOut,
    guests,
    selectedExtraIds: reservationDraft.selectedExtraIds,
  });

  const handleApplySampleStay = () => {
    const sample = findSampleStayWindow(villa);
    setCheckIn(sample.checkIn);
    setCheckOut(sample.checkOut);
    setGuests(sample.guests);
  };

  const handleJumpToAvailable = () => {
    const open = findNextAvailableWindow(villa, Math.max(villa.minNights, 3), 1);
    setCheckIn(open.checkIn);
    setCheckOut(open.checkOut);
  };

  const handleProceedToReserve = () => {
    if (!availability.available || !quote.valid) return;
    updateReservationDraft({
      villaSlug: villa.slug,
      checkIn,
      checkOut,
      guests,
    });
    const params = new URLSearchParams({
      villa: villa.slug,
      checkIn,
      checkOut,
      guests: String(guests),
    });
    navigate(`/showcase/azure-escapes/reserve?${params.toString()}`);
  };

  const scrollToBookingPanel = () => {
    bookingPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const relatedVillas = AZURE_VILLAS.filter(
    (v) => v.slug !== villa.slug && v.destination === villa.destination
  ).slice(0, 2);

  const activePhoto = villa.gallery[activePhotoIndex] || villa.gallery[0];

  return (
    <AzureLayout title={villa.name}>
      {/* Breadcrumb Strip */}
      <div className="bg-[#EDE6DA]/70 border-b border-[#DDD4C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#526372]">
          <div className="flex items-center gap-2">
            <Link to="/showcase/azure-escapes" className="hover:text-[#09263B]">
              Azure Escapes
            </Link>
            <span>/</span>
            <Link
              to={`/showcase/azure-escapes/destinations/${villa.destination}`}
              className="hover:text-[#09263B]"
            >
              {villa.destinationLabel.split(',')[0]}
            </Link>
            <span>/</span>
            <span className="text-[#09263B] font-medium">{villa.name}</span>
          </div>

          <button
            type="button"
            onClick={() => toggleSaveVilla(villa.id)}
            aria-pressed={saved}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#09263B] hover:text-[#2E7D8C] cursor-pointer"
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-[#A88443] text-[#A88443]' : ''}`} />
            <span>{saved ? 'Saved in Shortlist' : 'Save Residence'}</span>
          </button>
        </div>
      </div>

      <section className="py-8 lg:py-12 pb-28 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Property Headline */}
          <div className="max-w-3xl space-y-3 mb-7">
            <p className="text-xs uppercase tracking-[0.2em] text-[#85652E] font-semibold">
              {villa.flagship ? 'Flagship Residence · ' : ''}
              {villa.locationArea} · {villa.destinationLabel}
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#09263B]">{villa.name}</h1>
            <p className="text-base sm:text-lg text-[#394B59] leading-relaxed">{villa.headline}</p>
          </div>

          {/* 2-Column Editorial Layout: Left Gallery + Details / Right Sticky Booking Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT COLUMN: Gallery, Story, Details, Blocked Dates Info */}
            <div className="lg:col-span-7 space-y-10">
              {/* Interactive Gallery */}
              <div className="space-y-3">
                <div className="relative aspect-[4/3] bg-[#EDE6DA] border border-[#DDD4C6] overflow-hidden group">
                  <img
                    src={activePhoto.src}
                    alt={activePhoto.alt}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-3 right-3 px-3 py-2 bg-[#09263B]/85 hover:bg-[#09263B] text-[#F6F2EB] text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                    aria-label="Open full-screen photo gallery"
                  >
                    <Expand className="w-3.5 h-3.5" />
                    <span>Expand Gallery ({activePhotoIndex + 1}/{villa.gallery.length})</span>
                  </button>
                </div>

                <p className="text-xs text-[#526372] italic">{activePhoto.caption}</p>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  {villa.gallery.map((photo, idx) => (
                    <button
                      key={`${photo.caption}-${idx}`}
                      type="button"
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`aspect-[4/3] overflow-hidden border transition-all cursor-pointer ${
                        idx === activePhotoIndex
                          ? 'border-[#09263B] ring-1 ring-[#09263B]'
                          : 'border-[#DDD4C6] opacity-75 hover:opacity-100'
                      }`}
                      aria-label={`View gallery image ${idx + 1}: ${photo.caption}`}
                    >
                      <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Architectural Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-[#DDD4C6] az-tabular">
                <div>
                  <span className="block text-[11px] uppercase tracking-[0.14em] text-[#526372]">
                    Guests
                  </span>
                  <span className="text-lg font-semibold text-[#09263B]">Up to {villa.maxGuests}</span>
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-[0.14em] text-[#526372]">
                    Suites
                  </span>
                  <span className="text-lg font-semibold text-[#09263B]">
                    {villa.bedrooms} Bed / {villa.bathrooms} Bath
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-[0.14em] text-[#526372]">
                    Footprint
                  </span>
                  <span className="text-lg font-semibold text-[#09263B]">{villa.interiorSqm} m²</span>
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-[0.14em] text-[#526372]">
                    Check-in / Out
                  </span>
                  <span className="text-lg font-semibold text-[#09263B]">
                    {villa.checkInTime} / {villa.checkOutTime}
                  </span>
                </div>
              </div>

              {/* Story & Residence Description */}
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#09263B]">
                  The Residence
                </h2>
                <p className="text-sm sm:text-base text-[#394B59] leading-relaxed">
                  {villa.summary}
                </p>
                <p className="text-sm sm:text-base text-[#394B59] leading-relaxed">
                  {villa.editorialStory}
                </p>
              </div>

              {/* Included Hospitality & Architectural Amenities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-[#DDD4C6]">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-[#09263B]">Included Services</h3>
                  <ul className="space-y-2.5 text-sm text-[#394B59]">
                    {villa.includedServices.map((srv) => (
                      <li key={srv} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#2E7D8C] mt-0.5 shrink-0" />
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-[#09263B]">Architecture &amp; Living</h3>
                  <ul className="space-y-2.5 text-sm text-[#394B59]">
                    {villa.amenities.map((am) => (
                      <li key={am} className="flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#A88443] mt-0.5 shrink-0" />
                        <span>{am}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Live Seeded Availability Calendar Notice */}
              <div className="bg-[#EDE6DA] border border-[#DDD4C6] p-6 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold text-[#09263B]">
                    Current Availability Calendar Notes
                  </h3>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#526372] font-semibold">
                    Min {villa.minNights} nights
                  </span>
                </div>
                <p className="text-xs text-[#394B59] leading-relaxed">
                  To test calendar conflict handling or same-day turnaround behavior, note the
                  currently reserved windows below. Morning check-out is allowed on a hold’s arrival
                  date.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {villa.blockedRanges.map((block) => (
                    <div
                      key={`${block.start}-${block.end}`}
                      className="bg-[#FCFBF8] border border-[#DDD4C6] px-4 py-3 text-xs space-y-1"
                    >
                      <span className="block font-semibold text-[#8C4A27]">{block.label}</span>
                      <span className="block text-[#09263B] az-tabular">
                        Occupied: {formatShortDate(block.start)} – {formatShortDate(block.end)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-xs text-[#526372] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D8C] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#09263B]">Cancellation Terms:</strong>{' '}
                    {villa.cancellationPolicy}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Availability & Seasonal Quote Module */}
            <aside ref={bookingPanelRef} className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-[#FCFBF8] border border-[#DDD4C6] p-6 sm:p-7 shadow-lg space-y-6">
                {/* Header & Try Sample Stay Button */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#DDD4C6]">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[#526372] block">
                      Base Tariff From
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-semibold text-[#09263B] az-tabular">
                        {formatMoney(villa.baseNightlyEur, currency)}
                      </span>
                      <span className="text-xs text-[#526372]">/ night</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplySampleStay}
                    className="px-3 py-1.5 border border-[#2E7D8C] text-[#2E7D8C] hover:bg-[#2E7D8C] hover:text-white text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
                  >
                    Try Sample Stay
                  </button>
                </div>

                {/* Date & Guest Pickers */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="az-detail-checkin"
                        className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                      >
                        Check-in
                      </label>
                      <input
                        id="az-detail-checkin"
                        type="date"
                        min={today}
                        value={checkIn}
                        onChange={(e) => {
                          const nextIn = e.target.value;
                          setCheckIn(nextIn);
                          if (nextIn && checkOut <= nextIn) {
                            setCheckOut(addDaysIso(nextIn, villa.minNights));
                          }
                        }}
                        className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm font-medium text-[#09263B] az-tabular"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="az-detail-checkout"
                        className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                      >
                        Check-out
                      </label>
                      <input
                        id="az-detail-checkout"
                        type="date"
                        min={checkIn ? addDaysIso(checkIn, 1) : addDaysIso(today, 1)}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm font-medium text-[#09263B] az-tabular"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="az-detail-guests"
                      className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#2E7D8C]" />
                        Guests
                      </span>
                      <span>Max {villa.maxGuests}</span>
                    </label>
                    <select
                      id="az-detail-guests"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm font-medium text-[#09263B] az-tabular"
                    >
                      {Array.from({ length: villa.maxGuests }, (_, idx) => idx + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Availability Status Alert */}
                {!availability.available && (
                  <div className="bg-[#FDF4EE] border border-[#E5B89B] p-4 space-y-2.5 text-xs text-[#7A3B1E]">
                    <p className="flex items-start gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{availability.reason}</span>
                    </p>
                    <button
                      type="button"
                      onClick={handleJumpToAvailable}
                      className="inline-flex items-center gap-1.5 font-semibold underline hover:text-[#09263B] cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Jump to next available {villa.minNights}-night dates
                    </button>
                  </div>
                )}

                {/* Optional Destination Experiences Checkboxes */}
                <div className="space-y-3 pt-2 border-t border-[#DDD4C6]">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#526372] font-semibold">
                    Optional Experiences
                  </p>
                  <div className="space-y-2">
                    {destinationExtras.map((exp) => {
                      const checked = reservationDraft.selectedExtraIds.includes(exp.id);
                      const basisText =
                        exp.pricingBasis === 'per_stay'
                          ? 'per stay'
                          : exp.pricingBasis === 'per_guest'
                          ? `per guest (${guests})`
                          : `per night (${quote.nights || villa.minNights})`;
                      return (
                        <label
                          key={exp.id}
                          className={`flex items-start justify-between gap-3 p-3 border text-xs cursor-pointer transition-colors ${
                            checked
                              ? 'border-[#2E7D8C] bg-[#E5F1F3]/50'
                              : 'border-[#DDD4C6] bg-white hover:border-[#2E7D8C]'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleDraftExtra(exp.id)}
                              className="mt-0.5 w-4 h-4 accent-[#09263B]"
                            />
                            <div>
                              <span className="block font-semibold text-[#09263B]">
                                {exp.title}
                              </span>
                              <span className="text-[#526372]">
                                {exp.duration} · {basisText}
                              </span>
                            </div>
                          </div>
                          <span className="font-semibold text-[#09263B] whitespace-nowrap az-tabular">
                            +{formatMoney(exp.priceEur, currency)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Live Itemized Seasonal Quote */}
                {quote.valid && (
                  <div className="space-y-2.5 pt-4 border-t border-[#DDD4C6] text-xs">
                    {quote.seasonalBreakdown.map((seg) => (
                      <div
                        key={seg.seasonId}
                        className="flex items-center justify-between text-[#394B59] az-tabular"
                      >
                        <span>
                          {seg.nights} {seg.nights === 1 ? 'night' : 'nights'} · {seg.seasonLabel} (
                          {formatMoney(seg.nightlyEur, currency)}/nt)
                        </span>
                        <span className="font-medium text-[#09263B]">
                          {formatMoney(seg.subtotalEur, currency)}
                        </span>
                      </div>
                    ))}

                    {quote.extrasBreakdown.map((ex) => (
                      <div
                        key={ex.id}
                        className="flex items-center justify-between text-[#394B59] az-tabular"
                      >
                        <span>{ex.title}</span>
                        <span className="font-medium text-[#09263B]">
                          {formatMoney(ex.subtotalEur, currency)}
                        </span>
                      </div>
                    ))}

                    <div className="flex items-center justify-between text-[#526372] az-tabular">
                      <span>Concierge &amp; House Prep (6%)</span>
                      <span>{formatMoney(quote.serviceFeeEur, currency)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#526372] az-tabular">
                      <span>Coastal Municipality Levy (€4/guest/nt)</span>
                      <span>{formatMoney(quote.touristTaxEur, currency)}</span>
                    </div>

                    <div className="pt-3 border-t border-[#DDD4C6] flex items-baseline justify-between">
                      <div>
                        <span className="block text-sm font-semibold text-[#09263B]">
                          Estimated Stay Total
                        </span>
                        {currency !== 'EUR' && (
                          <span className="block text-[11px] text-[#526372] az-tabular">
                            Base €{quote.totalEur.toLocaleString('en-US')} · Fixed demo FX
                          </span>
                        )}
                      </div>
                      <span className="text-2xl font-semibold text-[#09263B] az-tabular">
                        {formatMoney(quote.totalEur, currency)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!availability.available || !quote.valid}
                  onClick={handleProceedToReserve}
                  className="w-full py-3.5 px-5 bg-[#09263B] hover:bg-[#0F3854] disabled:bg-[#94A3B8] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Reserve Demo Stay</span>
                  <ArrowRight className="w-4 h-4 text-[#D4B06A]" />
                </button>

                <p className="text-[11px] text-center text-[#526372]">
                  Demo reservation · No payment charged · Instant browser confirmation
                </p>
              </div>
            </aside>
          </div>

          {/* Related Residences */}
          {relatedVillas.length > 0 && (
            <div className="mt-16 pt-12 border-t border-[#DDD4C6] space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#2E7D8C] font-semibold">
                    Nearby Residences
                  </p>
                  <h2 className="text-3xl font-semibold text-[#09263B]">
                    More in {villa.destinationLabel.split(',')[0]}
                  </h2>
                </div>
                <Link
                  to={`/showcase/azure-escapes/destinations/${villa.destination}`}
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-[#09263B] hover:text-[#2E7D8C]"
                >
                  View Region →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {relatedVillas.map((rel) => (
                  <VillaCard key={rel.id} villa={rel} checkIn={checkIn} checkOut={checkOut} guests={guests} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Sticky "Check Availability" Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#FCFBF8]/96 backdrop-blur-md border-t border-[#DDD4C6] px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
        <div>
          {quote.valid ? (
            <>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#526372]">
                {quote.nights} nights · {guests} guests
              </p>
              <p className="text-base font-semibold text-[#09263B] az-tabular">
                {formatMoney(quote.totalEur, currency)}
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#526372]">From</p>
              <p className="text-base font-semibold text-[#09263B] az-tabular">
                {formatMoney(villa.baseNightlyEur, currency)} / night
              </p>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={scrollToBookingPanel}
          className="px-5 py-3 bg-[#09263B] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2"
        >
          <Clock className="w-3.5 h-3.5 text-[#D4B06A]" />
          <span>{quote.valid ? 'Book or Edit Dates' : 'Check Availability'}</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#09263B]/95 flex flex-col justify-between p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${villa.name} photo gallery`}
        >
          <div className="flex items-center justify-between text-[#F6F2EB]">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#D4B06A]">{villa.name}</p>
              <p className="text-xs text-[#CBD5E1]">
                Image {activePhotoIndex + 1} of {villa.gallery.length} — {activePhoto.caption}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-white hover:text-[#D4B06A]"
              aria-label="Close photo lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 min-h-0">
            <button
              type="button"
              onClick={() =>
                setActivePhotoIndex((prev) => (prev - 1 + villa.gallery.length) % villa.gallery.length)
              }
              className="absolute left-2 sm:left-4 p-3 bg-[#09263B]/80 border border-white/20 text-white hover:border-[#D4B06A]"
              aria-label="Previous gallery image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <img
              src={activePhoto.src}
              alt={activePhoto.alt}
              className="max-h-full max-w-full object-contain"
            />

            <button
              type="button"
              onClick={() => setActivePhotoIndex((prev) => (prev + 1) % villa.gallery.length)}
              className="absolute right-2 sm:right-4 p-3 bg-[#09263B]/80 border border-white/20 text-white hover:border-[#D4B06A]"
              aria-label="Next gallery image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#94A3B8]">
            <MapPin className="w-3.5 h-3.5 text-[#D4B06A]" />
            <span>{villa.locationArea}, {villa.destinationLabel}</span>
          </div>
        </div>
      )}
    </AzureLayout>
  );
};
