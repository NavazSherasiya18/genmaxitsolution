import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { AzureLayout } from '../../components/azure/AzureLayout';
import {
  AZURE_EXPERIENCES,
  AZURE_VILLAS,
  addDaysIso,
  calculateVillaQuote,
  checkVillaAvailability,
  findSampleStayWindow,
  formatMoney,
  formatShortDate,
  getTodayIso,
  getVillaBySlug,
} from '../../data/azureCatalog';
import { useAzureStore } from '../../context/AzureStoreContext';

export const AzureCheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    currency,
    reservationDraft,
    updateReservationDraft,
    toggleDraftExtra,
    saveConfirmation,
  } = useAzureStore();

  const today = getTodayIso();
  const requestedSlug = searchParams.get('villa') || reservationDraft.villaSlug || 'caldera-house';
  const villa = getVillaBySlug(requestedSlug) || AZURE_VILLAS[0];

  const [checkIn, setCheckIn] = useState(
    searchParams.get('checkIn') || reservationDraft.checkIn || findSampleStayWindow(villa).checkIn
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get('checkOut') || reservationDraft.checkOut || findSampleStayWindow(villa).checkOut
  );
  const [guests, setGuests] = useState(
    Math.min(
      Number(searchParams.get('guests') || reservationDraft.guests || 2),
      villa.maxGuests
    )
  );

  // Ephemeral Guest Contact Form State — Intentionally NEVER persisted to localStorage
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [arrivalNotes, setArrivalNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    updateReservationDraft({ villaSlug: villa.slug, checkIn, checkOut, guests });
  }, [villa.slug, checkIn, checkOut, guests, updateReservationDraft]);

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

  const handleApplySampleGuest = () => {
    setFormError('');
    setFirstName('Elena');
    setLastName('Rossi');
    setEmail('elena.rossi@example.com');
    setPhone('+39 06 5550 1842');
    setArrivalNotes('Early afternoon boat arrival; lactose-free breakfast table for two guests.');
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError('');

    // Re-validate availability & quote right before confirming
    const latestAvailability = checkVillaAvailability(villa, checkIn, checkOut, guests);
    const latestQuote = calculateVillaQuote({
      villa,
      checkIn,
      checkOut,
      guests,
      selectedExtraIds: reservationDraft.selectedExtraIds,
    });

    if (!latestAvailability.available || !latestQuote.valid) {
      setFormError(latestAvailability.reason || 'Selected dates are no longer valid.');
      setStep(1);
      return;
    }

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirst || !trimmedLast) {
      setFormError('Please enter guest first and last name (or click Use Sample Guest Details).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Please enter a valid contact email format.');
      return;
    }

    setIsSubmitting(true);

    const randomCode = Math.random().toString(36).slice(2, 6).toUpperCase();
    const reference = `AZR-DEMO-${randomCode}`;

    saveConfirmation({
      reference,
      createdAtIso: new Date().toISOString(),
      villaId: villa.id,
      villaSlug: villa.slug,
      villaName: villa.name,
      destinationLabel: villa.destinationLabel,
      locationArea: villa.locationArea,
      villaImage: villa.gallery[0].src,
      checkIn,
      checkOut,
      guests,
      currency,
      quote: latestQuote,
      leadGuestFirstName: trimmedFirst,
      specialRequestsNote: arrivalNotes.trim() || undefined,
    });

    navigate('/showcase/azure-escapes/confirmation');
  };

  return (
    <AzureLayout title={`Reserve ${villa.name}`}>
      <section className="py-10 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Return Link & Progress Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDD4C6]">
            <div>
              <Link
                to={`/showcase/azure-escapes/villas/${villa.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#2E7D8C] hover:text-[#09263B] mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to {villa.name}
              </Link>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[#09263B]">
                Reservation Desk
              </h1>
              <p className="text-xs uppercase tracking-[0.16em] text-[#85652E] font-semibold mt-1">
                Demo Reservation · No Payment Required
              </p>
            </div>

            {/* 4-Step Progress Bar */}
            <ol className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs az-tabular">
              {[
                { num: 1, label: 'Stay Review' },
                { num: 2, label: 'Experiences' },
                { num: 3, label: 'Guest Details' },
                { num: 4, label: 'Confirmation' },
              ].map((s) => {
                const isCurrent = step === s.num;
                const isDone = step > s.num;
                return (
                  <li
                    key={s.num}
                    className={`px-3 py-1.5 border font-medium flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-[#09263B] text-[#F6F2EB] border-[#09263B]'
                        : isDone
                        ? 'bg-[#E5F1F3] text-[#09263B] border-[#2E7D8C]'
                        : 'bg-[#FCFBF8] text-[#526372] border-[#DDD4C6]'
                    }`}
                  >
                    <span className="font-semibold">{s.num}.</span>
                    <span>{s.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT FORM STEPS */}
            <div className="lg:col-span-7 space-y-6">
              {formError && (
                <div
                  role="alert"
                  className="bg-[#FDF4EE] border border-[#E5B89B] p-4 text-xs text-[#7A3B1E] flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* STEP 1: STAY REVIEW */}
              <div className="bg-[#FCFBF8] border border-[#DDD4C6] p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between border-b border-[#EAE2D6] pb-3">
                  <h2 className="text-2xl font-semibold text-[#09263B]">
                    1. Stay Review &amp; Travel Dates
                  </h2>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2E7D8C] cursor-pointer"
                    >
                      Edit Dates
                    </button>
                  )}
                </div>

                {step === 1 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="az-res-in"
                          className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                        >
                          Check-in
                        </label>
                        <input
                          id="az-res-in"
                          type="date"
                          min={today}
                          value={checkIn}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCheckIn(val);
                            if (val && checkOut <= val) {
                              setCheckOut(addDaysIso(val, villa.minNights));
                            }
                          }}
                          className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm font-medium text-[#09263B] az-tabular"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="az-res-out"
                          className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                        >
                          Check-out
                        </label>
                        <input
                          id="az-res-out"
                          type="date"
                          min={checkIn ? addDaysIso(checkIn, 1) : addDaysIso(today, 1)}
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm font-medium text-[#09263B] az-tabular"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="az-res-guests"
                          className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                        >
                          Guests (Max {villa.maxGuests})
                        </label>
                        <select
                          id="az-res-guests"
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm font-medium text-[#09263B] az-tabular"
                        >
                          {Array.from({ length: villa.maxGuests }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {!availability.available && (
                      <p className="text-xs font-medium text-[#8C4A27] flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{availability.reason}</span>
                      </p>
                    )}

                    <p className="text-xs text-[#526372]">
                      <strong className="text-[#09263B]">Cancellation Policy:</strong>{' '}
                      {villa.cancellationPolicy}
                    </p>

                    <button
                      type="button"
                      disabled={!availability.available || !quote.valid}
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-[#09263B] hover:bg-[#0F3854] disabled:bg-[#94A3B8] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Optional Experiences</span>
                      <ArrowRight className="w-4 h-4 text-[#D4B06A]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#394B59] az-tabular">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#2E7D8C]" />
                      {formatShortDate(checkIn)} – {formatShortDate(checkOut)} ({quote.nights} nights)
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#2E7D8C]" />
                      {guests} {guests === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                )}
              </div>

              {/* STEP 2: OPTIONAL EXPERIENCES */}
              <div className="bg-[#FCFBF8] border border-[#DDD4C6] p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between border-b border-[#EAE2D6] pb-3">
                  <h2 className="text-2xl font-semibold text-[#09263B]">
                    2. Private Charters &amp; Culinary Extras
                  </h2>
                  {step === 3 && (
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2E7D8C] cursor-pointer"
                    >
                      Modify Extras
                    </button>
                  )}
                </div>

                {step === 2 ? (
                  <div className="space-y-4">
                    <p className="text-xs text-[#394B59]">
                      Optional enhancements recalculate automatically when guest count or nights
                      change.
                    </p>
                    <div className="space-y-2.5">
                      {destinationExtras.map((exp) => {
                        const checked = reservationDraft.selectedExtraIds.includes(exp.id);
                        return (
                          <label
                            key={exp.id}
                            className={`flex items-start justify-between gap-3 p-4 border text-xs cursor-pointer transition-colors ${
                              checked
                                ? 'border-[#2E7D8C] bg-[#E5F1F3]/55'
                                : 'border-[#DDD4C6] bg-white hover:border-[#2E7D8C]'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleDraftExtra(exp.id)}
                                className="mt-0.5 w-4 h-4 accent-[#09263B]"
                              />
                              <div className="space-y-0.5">
                                <span className="block font-semibold text-[#09263B] text-sm">
                                  {exp.title}
                                </span>
                                <span className="block text-[#526372]">{exp.summary}</span>
                              </div>
                            </div>
                            <span className="font-semibold text-[#09263B] whitespace-nowrap az-tabular">
                              {formatMoney(exp.priceEur, currency)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-[#09263B] hover:bg-[#0F3854] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Guest Details</span>
                      <ArrowRight className="w-4 h-4 text-[#D4B06A]" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-[#526372]">
                    {quote.extrasBreakdown.length > 0
                      ? `${quote.extrasBreakdown.length} optional experience(s) included in quote.`
                      : 'No optional experiences selected.'}
                  </p>
                )}
              </div>

              {/* STEP 3: GUEST DETAILS & FINAL SUBMISSION */}
              <form
                onSubmit={handleConfirmReservation}
                className="bg-[#FCFBF8] border border-[#DDD4C6] p-6 sm:p-7 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE2D6] pb-3">
                  <h2 className="text-2xl font-semibold text-[#09263B]">
                    3. Primary Guest Details
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(3);
                      handleApplySampleGuest();
                    }}
                    className="px-3 py-1.5 border border-[#2E7D8C] text-[#2E7D8C] hover:bg-[#2E7D8C] hover:text-white text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer"
                  >
                    Use Sample Guest Details
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="az-guest-first"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                    >
                      First Name *
                    </label>
                    <input
                      id="az-guest-first"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onFocus={() => setStep(3)}
                      placeholder="Elena"
                      className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B]"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="az-guest-last"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                    >
                      Last Name *
                    </label>
                    <input
                      id="az-guest-last"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onFocus={() => setStep(3)}
                      placeholder="Rossi"
                      className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B]"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="az-guest-email"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="az-guest-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setStep(3)}
                      placeholder="guest@example.com"
                      className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B]"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="az-guest-phone"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                    >
                      Telephone (Optional)
                    </label>
                    <input
                      id="az-guest-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onFocus={() => setStep(3)}
                      placeholder="+39 06 5550 1842"
                      className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="az-guest-notes"
                    className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                  >
                    Arrival Transfer &amp; Stay Preferences
                  </label>
                  <textarea
                    id="az-guest-notes"
                    rows={3}
                    value={arrivalNotes}
                    onChange={(e) => setArrivalNotes(e.target.value)}
                    onFocus={() => setStep(3)}
                    placeholder="Flight arrival time, dietary preferences, heated pool setup..."
                    className="w-full p-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B]"
                  />
                </div>

                <div className="bg-[#EDE6DA]/70 border border-[#DDD4C6] p-4 text-xs text-[#394B59] space-y-1">
                  <p className="font-semibold text-[#09263B] inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2E7D8C]" />
                    Demo reservation · No payment required
                  </p>
                  <p>
                    Contact email and phone number are validated for demo interaction and are
                    strictly excluded from persistent browser storage.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !availability.available || !quote.valid}
                  className="w-full py-4 px-6 bg-[#09263B] hover:bg-[#0F3854] disabled:bg-[#94A3B8] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4 text-[#D4B06A]" />
                  <span>{isSubmitting ? 'Confirming Demo Stay...' : 'Confirm Demo Reservation'}</span>
                </button>
              </form>
            </div>

            {/* RIGHT SIDEBAR: LIVE SUMMARY & SEASONAL BREAKDOWN */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-[#FCFBF8] border border-[#DDD4C6] overflow-hidden shadow-md">
                <div className="aspect-[16/10] bg-[#EDE6DA] overflow-hidden">
                  <img
                    src={villa.gallery[0].src}
                    alt={villa.gallery[0].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#85652E] font-semibold">
                      {villa.locationArea} · {villa.destinationLabel}
                    </p>
                    <h2 className="text-2xl font-semibold text-[#09263B] mt-1">{villa.name}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#EAE2D6] text-xs az-tabular">
                    <div>
                      <span className="block text-[#526372]">Check-in</span>
                      <span className="font-semibold text-[#09263B]">
                        {formatShortDate(checkIn)} ({villa.checkInTime})
                      </span>
                    </div>
                    <div>
                      <span className="block text-[#526372]">Check-out</span>
                      <span className="font-semibold text-[#09263B]">
                        {formatShortDate(checkOut)} ({villa.checkOutTime})
                      </span>
                    </div>
                  </div>

                  {quote.valid ? (
                    <div className="space-y-2.5 text-xs az-tabular">
                      {quote.seasonalBreakdown.map((seg) => (
                        <div
                          key={seg.seasonId}
                          className="flex items-center justify-between text-[#394B59]"
                        >
                          <span>
                            {seg.nights} nt × {formatMoney(seg.nightlyEur, currency)} ({seg.seasonLabel})
                          </span>
                          <span className="font-medium text-[#09263B]">
                            {formatMoney(seg.subtotalEur, currency)}
                          </span>
                        </div>
                      ))}

                      {quote.extrasBreakdown.map((ex) => (
                        <div
                          key={ex.id}
                          className="flex items-center justify-between text-[#394B59]"
                        >
                          <span className="inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#A88443]" />
                            {ex.title}
                          </span>
                          <span className="font-medium text-[#09263B]">
                            {formatMoney(ex.subtotalEur, currency)}
                          </span>
                        </div>
                      ))}

                      <div className="flex items-center justify-between text-[#526372]">
                        <span>Concierge &amp; Preparation (6%)</span>
                        <span>{formatMoney(quote.serviceFeeEur, currency)}</span>
                      </div>

                      <div className="flex items-center justify-between text-[#526372]">
                        <span>Coastal Municipality Tax</span>
                        <span>{formatMoney(quote.touristTaxEur, currency)}</span>
                      </div>

                      <div className="pt-3 border-t border-[#DDD4C6] flex items-baseline justify-between">
                        <div>
                          <span className="block text-sm font-semibold text-[#09263B]">
                            Total Quote
                          </span>
                          <span className="block text-[11px] text-[#526372]">
                            Base EUR €{quote.totalEur.toLocaleString('en-US')}
                          </span>
                        </div>
                        <span className="text-2xl font-semibold text-[#09263B]">
                          {formatMoney(quote.totalEur, currency)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#8C4A27] font-medium">{quote.error}</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </AzureLayout>
  );
};
