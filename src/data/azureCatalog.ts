import heroCalderaImg from '../assets/images/azure_hero_caldera_1794822423923.jpg';
import calderaLivingImg from '../assets/images/caldera_house_living_1794822422730.jpg';
import calderaBedroomImg from '../assets/images/caldera_house_bedroom_1794822423815.jpg';
import aegeanVillaImg from '../assets/images/travel_showcase_1794460750941.jpg';
import amalfiLimoneImg from '../assets/images/amalfi_villa_limone_1794822423810.jpg';
import amalfiInteriorImg from '../assets/images/amalfi_villa_interior_1794822425626.jpg';
import amalfiTerraceImg from '../assets/images/azure_amalfi_terrace_1794548652897.jpg';
import baliBanyanImg from '../assets/images/bali_banyan_courtyard_1794822426080.jpg';
import baliSuiteImg from '../assets/images/bali_villa_suite_1794822426957.jpg';
import coastalCharterImg from '../assets/images/azure_experiences_sailing_1794822427137.jpg';

export type DestinationSlug = 'santorini' | 'amalfi-coast' | 'bali';
export type CurrencyCode = 'EUR' | 'USD' | 'INR';

/**
 * Clearly documented fixed demo FX rates relative to base EUR (€).
 * Used strictly for optional client-side display comparison in this concept showcase.
 */
export const DEMO_CURRENCY_RATES: Record<
  CurrencyCode,
  { code: CurrencyCode; symbol: string; rate: number; label: string }
> = {
  EUR: { code: 'EUR', symbol: '€', rate: 1, label: 'EUR (€ Base)' },
  USD: { code: 'USD', symbol: '$', rate: 1.09, label: 'USD (Fixed demo 1.09)' },
  INR: { code: 'INR', symbol: '₹', rate: 91.5, label: 'INR (Fixed demo 91.50)' },
};

export interface DestinationInfo {
  slug: DestinationSlug;
  name: string;
  country: string;
  eyebrow: string;
  tagline: string;
  description: string;
  architectureNote: string;
  bestMonths: string;
  transferNote: string;
  heroImage: string;
  heroAlt: string;
  highlights: { title: string; detail: string }[];
}

export interface VillaPhoto {
  src: string;
  alt: string;
  caption: string;
}

export interface BlockedRange {
  start: string; // Check-in day of existing hold (checkout IS allowed on this day)
  end: string;   // Check-out day of existing hold (check-in IS allowed on this day)
  label: string;
}

export interface AzureVilla {
  id: string;
  slug: string;
  name: string;
  destination: DestinationSlug;
  destinationLabel: string;
  locationArea: string;
  flagship: boolean;
  headline: string;
  summary: string;
  editorialStory: string;
  baseNightlyEur: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  interiorSqm: number;
  minNights: number;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  hasPrivatePool: boolean;
  hasSeaView: boolean;
  familyFriendly: boolean;
  architecturalTags: string[];
  includedServices: string[];
  amenities: string[];
  gallery: VillaPhoto[];
  blockedRanges: BlockedRange[];
}

export type ExperiencePricingBasis = 'per_stay' | 'per_guest' | 'per_night';

export interface AzureExperience {
  id: string;
  title: string;
  destination: DestinationSlug | 'all';
  destinationLabel: string;
  duration: string;
  pricingBasis: ExperiencePricingBasis;
  priceEur: number;
  summary: string;
  includes: string[];
  image: string;
  imageAlt: string;
}

export interface SeasonRule {
  id: 'peak' | 'high' | 'quiet';
  label: string;
  multiplier: number;
  note: string;
}

export interface SeasonalNightBreakdown {
  seasonId: SeasonRule['id'];
  seasonLabel: string;
  nights: number;
  nightlyEur: number;
  subtotalEur: number;
}

export interface VillaQuote {
  valid: boolean;
  error?: string;
  nights: number;
  guests: number;
  baseAccommodationEur: number;
  seasonalBreakdown: SeasonalNightBreakdown[];
  extrasBreakdown: {
    id: string;
    title: string;
    pricingBasis: ExperiencePricingBasis;
    unitEur: number;
    subtotalEur: number;
  }[];
  extrasTotalEur: number;
  serviceFeeEur: number;
  touristTaxEur: number;
  totalEur: number;
}

// ============================================================================
// Pure Calendar-Date ISO Math (YYYY-MM-DD in UTC day units, zero TZ drift)
// ============================================================================

const MS_PER_DAY = 86_400_000;

export function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(iso: string): { year: number; month: number; day: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const utc = Date.UTC(y, m - 1, d);
  const check = new Date(utc);
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  ) {
    return null;
  }
  return { year: y, month: m, day: d };
}

export function isoToUtcMs(iso: string): number {
  const parsed = parseIsoDate(iso);
  if (!parsed) return NaN;
  return Date.UTC(parsed.year, parsed.month - 1, parsed.day);
}

export function addDaysIso(iso: string, days: number): string {
  const ms = isoToUtcMs(iso);
  if (Number.isNaN(ms)) return iso;
  const next = new Date(ms + days * MS_PER_DAY);
  const y = next.getUTCFullYear();
  const m = String(next.getUTCMonth() + 1).padStart(2, '0');
  const d = String(next.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function diffNights(checkIn: string, checkOut: string): number {
  const start = isoToUtcMs(checkIn);
  const end = isoToUtcMs(checkOut);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.round((end - start) / MS_PER_DAY);
}

export function enumerateStayNights(checkIn: string, checkOut: string): string[] {
  const nights = diffNights(checkIn, checkOut);
  if (nights <= 0 || nights > 60) return [];
  const list: string[] = [];
  for (let i = 0; i < nights; i += 1) {
    list.push(addDaysIso(checkIn, i));
  }
  return list;
}

export function formatShortDate(iso: string): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  const dt = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(dt);
}

export function formatMoney(amountEur: number, currency: CurrencyCode): string {
  const cfg = DEMO_CURRENCY_RATES[currency];
  const converted = Math.round(amountEur * cfg.rate);
  if (currency === 'INR') {
    return `₹${converted.toLocaleString('en-IN')}`;
  }
  return `${cfg.symbol}${converted.toLocaleString('en-US')}`;
}

export function getSeasonForDate(iso: string): SeasonRule {
  const parsed = parseIsoDate(iso);
  if (!parsed) {
    return {
      id: 'quiet',
      label: 'Quiet Sea Season',
      multiplier: 1,
      note: 'Standard seasonal tariff',
    };
  }
  const mmdd = parsed.month * 100 + parsed.day;

  // Peak Summer (Jun 15 – Sep 15) & Festive Year-End (Dec 20 – Jan 05)
  if ((mmdd >= 615 && mmdd <= 915) || mmdd >= 1220 || mmdd <= 105) {
    return {
      id: 'peak',
      label: 'Peak Coastal Season',
      multiplier: 1.35,
      note: 'Prime summer & festive tariff (+35%)',
    };
  }

  // High Shoulder Season (Apr 01 – Jun 14 and Sep 16 – Nov 22)
  if ((mmdd >= 401 && mmdd <= 614) || (mmdd >= 916 && mmdd <= 1122)) {
    return {
      id: 'high',
      label: 'High Shoulder Season',
      multiplier: 1.15,
      note: 'Mid-season coastal tariff (+15%)',
    };
  }

  // Quiet Sea Season (Nov 23 – Dec 19 and Jan 06 – Mar 31)
  return {
    id: 'quiet',
    label: 'Quiet Sea Season',
    multiplier: 1.0,
    note: 'Standard value-season tariff',
  };
}

export function checkVillaAvailability(
  villa: AzureVilla,
  checkIn: string,
  checkOut: string,
  guests = 2
): {
  available: boolean;
  reason?: string;
  conflictRange?: BlockedRange;
} {
  if (!checkIn || !checkOut) {
    return { available: false, reason: 'Select valid check-in and check-out dates.' };
  }
  const today = getTodayIso();
  if (checkIn < today) {
    return { available: false, reason: 'Check-in date cannot be in the past.' };
  }
  const nights = diffNights(checkIn, checkOut);
  if (nights <= 0) {
    return { available: false, reason: 'Check-out must be at least one night after check-in.' };
  }
  if (nights < villa.minNights) {
    return {
      available: false,
      reason: `${villa.name} requires a minimum stay of ${villa.minNights} nights.`,
    };
  }
  if (guests > villa.maxGuests) {
    return {
      available: false,
      reason: `${villa.name} accommodates up to ${villa.maxGuests} guests.`,
    };
  }

  // Exact interval overlap rule: checkout on block.start IS allowed; checkin on block.end IS allowed.
  const conflict = villa.blockedRanges.find(
    (range) => checkIn < range.end && checkOut > range.start
  );
  if (conflict) {
    return {
      available: false,
      reason: `Reserved window overlaps with ${formatShortDate(conflict.start)} – ${formatShortDate(conflict.end)}.`,
      conflictRange: conflict,
    };
  }

  return { available: true };
}

export function findNextAvailableWindow(
  villa: AzureVilla,
  requestedNights?: number,
  startOffsetDays = 1
): { checkIn: string; checkOut: string } {
  const nights = Math.max(requestedNights ?? villa.minNights, villa.minNights);
  const today = getTodayIso();
  for (let offset = startOffsetDays; offset < 120; offset += 1) {
    const candidateIn = addDaysIso(today, offset);
    const candidateOut = addDaysIso(candidateIn, nights);
    const status = checkVillaAvailability(villa, candidateIn, candidateOut, Math.min(2, villa.maxGuests));
    if (status.available) {
      return { checkIn: candidateIn, checkOut: candidateOut };
    }
  }
  const fallbackIn = addDaysIso(today, 30);
  return { checkIn: fallbackIn, checkOut: addDaysIso(fallbackIn, nights) };
}

/**
 * Picks a realistic future sample stay window that demonstrates cross-season pricing when possible.
 */
export function findSampleStayWindow(villa: AzureVilla): { checkIn: string; checkOut: string; guests: number } {
  const today = getTodayIso();
  const minNights = Math.max(villa.minNights, 3);
  // Look forward up to 35 days for a clean available window that touches two seasons if possible
  for (let offset = 1; offset <= 35; offset += 1) {
    const start = addDaysIso(today, offset);
    const end = addDaysIso(start, minNights);
    const check = checkVillaAvailability(villa, start, end, Math.min(4, villa.maxGuests));
    if (!check.available) continue;
    const nightList = enumerateStayNights(start, end);
    const seasons = new Set(nightList.map((d) => getSeasonForDate(d).id));
    if (seasons.size > 1) {
      return { checkIn: start, checkOut: end, guests: Math.min(4, villa.maxGuests) };
    }
  }
  const firstOpen = findNextAvailableWindow(villa, minNights, 1);
  return { ...firstOpen, guests: Math.min(4, villa.maxGuests) };
}

export function calculateVillaQuote(params: {
  villa: AzureVilla;
  checkIn: string;
  checkOut: string;
  guests: number;
  selectedExtraIds: string[];
}): VillaQuote {
  const { villa, checkIn, checkOut, guests, selectedExtraIds } = params;
  const availability = checkVillaAvailability(villa, checkIn, checkOut, guests);
  const nightDates = enumerateStayNights(checkIn, checkOut);
  const nights = nightDates.length;

  if (!availability.available || nights <= 0) {
    return {
      valid: false,
      error: availability.reason || 'Select valid travel dates to view your stay quote.',
      nights: Math.max(0, nights),
      guests,
      baseAccommodationEur: 0,
      seasonalBreakdown: [],
      extrasBreakdown: [],
      extrasTotalEur: 0,
      serviceFeeEur: 0,
      touristTaxEur: 0,
      totalEur: 0,
    };
  }

  const seasonBuckets = new Map<
    SeasonRule['id'],
    { seasonLabel: string; nights: number; nightlyEur: number; subtotalEur: number }
  >();

  for (const iso of nightDates) {
    const rule = getSeasonForDate(iso);
    const nightlyEur = Math.round(villa.baseNightlyEur * rule.multiplier);
    const existing = seasonBuckets.get(rule.id);
    if (existing) {
      existing.nights += 1;
      existing.subtotalEur += nightlyEur;
    } else {
      seasonBuckets.set(rule.id, {
        seasonLabel: rule.label,
        nights: 1,
        nightlyEur,
        subtotalEur: nightlyEur,
      });
    }
  }

  const seasonalBreakdown: SeasonalNightBreakdown[] = Array.from(seasonBuckets.entries()).map(
    ([seasonId, val]) => ({
      seasonId,
      seasonLabel: val.seasonLabel,
      nights: val.nights,
      nightlyEur: val.nightlyEur,
      subtotalEur: val.subtotalEur,
    })
  );

  const baseAccommodationEur = seasonalBreakdown.reduce((acc, s) => acc + s.subtotalEur, 0);

  const extrasBreakdown = AZURE_EXPERIENCES.filter(
    (exp) =>
      selectedExtraIds.includes(exp.id) &&
      (exp.destination === 'all' || exp.destination === villa.destination)
  ).map((exp) => {
    let subtotalEur = exp.priceEur;
    if (exp.pricingBasis === 'per_guest') {
      subtotalEur = exp.priceEur * guests;
    } else if (exp.pricingBasis === 'per_night') {
      subtotalEur = exp.priceEur * nights;
    }
    return {
      id: exp.id,
      title: exp.title,
      pricingBasis: exp.pricingBasis,
      unitEur: exp.priceEur,
      subtotalEur,
    };
  });

  const extrasTotalEur = extrasBreakdown.reduce((acc, ex) => acc + ex.subtotalEur, 0);
  const serviceFeeEur = Math.round(baseAccommodationEur * 0.06);
  const touristTaxEur = nights * guests * 4;
  const totalEur = baseAccommodationEur + extrasTotalEur + serviceFeeEur + touristTaxEur;

  return {
    valid: true,
    nights,
    guests,
    baseAccommodationEur,
    seasonalBreakdown,
    extrasBreakdown,
    extrasTotalEur,
    serviceFeeEur,
    touristTaxEur,
    totalEur,
  };
}

// ============================================================================
// Destinations Catalog (Santorini, Amalfi Coast, Bali)
// ============================================================================

export const AZURE_DESTINATIONS: DestinationInfo[] = [
  {
    slug: 'santorini',
    name: 'Santorini',
    country: 'Cyclades, Greece',
    eyebrow: 'Aegean Caldera Escapes',
    tagline: 'Whitewashed cliffside terraces suspended above volcanic waters.',
    description:
      'Carved into basalt and pumice cliffs from Oia to Akrotiri, our Santorini houses pair serene Cycladic plaster silhouettes with private heated plunge pools and unbroken western sunset views.',
    architectureNote: 'Cycladic vaulted masonry, honed Aegean marble, and open caldera loggias.',
    bestMonths: 'May – October (mild seas into late November)',
    transferNote: '25 mins private chauffeured transfer from JTR Santorini Airport',
    heroImage: heroCalderaImg,
    heroAlt: 'Whitewashed Santorini cliffside villa terrace with infinity pool overlooking the caldera at golden hour',
    highlights: [
      { title: 'Oia & Finikia Ridge', detail: 'Pedestrian stone alleys with unobstructed caldera horizon terraces.' },
      { title: 'Imerovigli Heights', detail: 'Quiet architectural sanctuary 300 meters above sea level.' },
      { title: 'Akrotiri Southern Tip', detail: 'Expansive private compounds near Red Beach and volcanic coves.' },
    ],
  },
  {
    slug: 'amalfi-coast',
    name: 'Amalfi Coast',
    country: 'Campania, Italy',
    eyebrow: 'Tyrrhenian Limestone Manors',
    tagline: 'Lemon-scented cliffside pergolas above emerald coastal coves.',
    description:
      'Set along the ancient mule paths of Ravello, Positano, and Conca dei Marini, each Amalfi residence restores terraced stone architecture, shaded pergola dining, and direct water access.',
    architectureNote: 'Hand-troweled Campania limewash, terracotta-limestone paving, and terraced citrus gardens.',
    bestMonths: 'April – November',
    transferNote: '65 mins private Mercedes V-Class or Riva boat transfer from Naples (NAP)',
    heroImage: amalfiLimoneImg,
    heroAlt: 'Amalfi Coast limestone pergola terrace shaded by lemon trees overlooking turquoise Mediterranean sea',
    highlights: [
      { title: 'Ravello Upper Cliffs', detail: 'Elevated silence above the coastline surrounded by centuries-old orchards.' },
      { title: 'Positano Cove Steps', detail: 'Sun-drenched sea balconies moments from Spiaggia Grande moorings.' },
      { title: 'Conca dei Marini', detail: 'Historic watchtower estates with private cliff lifts to the Tyrrhenian Sea.' },
    ],
  },
  {
    slug: 'bali',
    name: 'Bali',
    country: 'Bukit & Southwest Coast, Indonesia',
    eyebrow: 'Indian Ocean Sanctuary Pavilions',
    tagline: 'Indoor-outdoor teak pavilions framed by basalt pools and lush courtyards.',
    description:
      'Anchored in Uluwatu’s limestone headlands and Pererenan’s quiet coastal paddies, our Bali villas embrace monsoon breeze corridors, volcanic stone, and calm courtyard seclusion.',
    architectureNote: 'Reclaimed Javanese teak louvers, pale paras kerobokan stone, and seamless garden courtyards.',
    bestMonths: 'April – October & quiet coastal retreats year-round',
    transferNote: '45 mins private airport arrival escort from Denpasar (DPS)',
    heroImage: baliBanyanImg,
    heroAlt: 'Modern indoor-outdoor luxury pavilion villa in Bali beside basalt infinity pool and frangipani trees',
    highlights: [
      { title: 'Uluwatu Cliffside', detail: 'Elevated Indian Ocean pavilions above reef breaks and golden sand coves.' },
      { title: 'Pererenan Shore', detail: 'Gated tropical courtyard compounds minutes from black-sand surf beaches.' },
      { title: 'Nusa Dua Southern Reef', detail: 'Lagoon-side family estates with deep lawns and still turquoise shallows.' },
    ],
  },
];

// ============================================================================
// Seeded Relative Blocked Date Windows (Deterministic relative to current day)
// ============================================================================

function seedBlockedRanges(index: number): BlockedRange[] {
  const today = getTodayIso();
  const offsetA = 4 + (index % 3);
  const offsetB = 15 + (index % 4);
  return [
    {
      start: addDaysIso(today, offsetA),
      end: addDaysIso(today, offsetA + 3),
      label: 'Existing guest hold',
    },
    {
      start: addDaysIso(today, offsetB),
      end: addDaysIso(today, offsetB + 4),
      label: 'Owner coastal reserve',
    },
  ];
}

// ============================================================================
// 12 Curated Luxury Coastal Villas (4 per destination)
// ============================================================================

export const AZURE_VILLAS: AzureVilla[] = [
  // --- SANTORINI (4 Villas) ---
  {
    id: 'villa-caldera-house',
    slug: 'caldera-house',
    name: 'Caldera House',
    destination: 'santorini',
    destinationLabel: 'Santorini, Greece',
    locationArea: 'Oia Cliffside',
    flagship: true,
    headline: 'Vaulted Cycladic architecture suspended over the caldera edge.',
    summary:
      'Private cliffside residence with heated infinity plunge pool, vaulted limestone salon, and unbroken western sunset views across Thirassia.',
    editorialStory:
      'Originally carved by island masons in 1924 and restored for quiet coastal living, Caldera House steps down three private limestone terraces facing open water. Interiors balance cool Cycladic lime plaster, brushed brass sconces, oak cabinetry, and wide folding doors onto the heated pool deck.',
    baseNightlyEur: 1450,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    interiorSqm: 260,
    minNights: 3,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Full refund up to 14 days before arrival · 50% credit up to 7 days prior (demo terms).',
    hasPrivatePool: true,
    hasSeaView: true,
    familyFriendly: true,
    architecturalTags: ['Heated Infinity Pool', 'Caldera Sunset', 'Daily Breakfast'],
    includedServices: [
      'Private airport arrival escort from JTR',
      'Daily Aegean breakfast served on the pool terrace',
      'Dedicated morning housekeeping & evening turndown',
      'Curated Santorini volcanic cellar welcome',
    ],
    amenities: [
      'Heated saltwater infinity pool (8.5m)',
      'Vaulted Cycladic living salon',
      'Three sea-view en-suite bedrooms',
      'Outdoor limestone pergola dining table',
      'High-speed Starlink workspace mesh',
      'Gaggenau kitchen & wine climate cabinet',
    ],
    gallery: [
      {
        src: heroCalderaImg,
        alt: 'Caldera House main cliffside terrace and infinity pool overlooking the Santorini caldera at sunset',
        caption: 'West-facing limestone infinity terrace above the Oia caldera rim',
      },
      {
        src: calderaLivingImg,
        alt: 'Caldera House vaulted whitewashed living room opening directly onto sea terrace',
        caption: 'Cycladic barrel-vaulted salon opening straight onto the terrace',
      },
      {
        src: calderaBedroomImg,
        alt: 'Caldera House primary suite with linen bedding and arched window framing deep blue Aegean water',
        caption: 'Primary caldera suite with carved arched sea window',
      },
      {
        src: aegeanVillaImg,
        alt: 'Upper sun deck and infinity pool perspective across whitewashed Santorini cliffs',
        caption: 'Upper sunset deck and heated infinity plunge horizon',
      },
      {
        src: coastalCharterImg,
        alt: 'Private wooden yacht cruising past coastal cliffs for day charters departing Oia marina',
        caption: 'Direct skipper boarding available from Ammoudi Bay below',
      },
    ],
    blockedRanges: seedBlockedRanges(0),
  },
  {
    id: 'villa-oia-horizon-suite',
    slug: 'oia-horizon-suite',
    name: 'Villa Thalassa Oia',
    destination: 'santorini',
    destinationLabel: 'Santorini, Greece',
    locationArea: 'Finikia Ridge, Oia',
    flagship: false,
    headline: 'Minimalist Cycladic couples retreat perched above north Oia vineyards.',
    summary:
      'Quiet two-bedroom sandstone hideaway with shaded dining loggia, plunge pool, and dual horizon exposures.',
    editorialStory:
      'Set slightly above the pedestrian steps of Finikia, Villa Thalassa offers rare silence alongside direct walkable access to Oia’s cliffside galleries and Ammoudi seafood tavernas.',
    baseNightlyEur: 890,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    interiorSqm: 155,
    minNights: 2,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Free cancellation up to 10 days before check-in (demo terms).',
    hasPrivatePool: true,
    hasSeaView: true,
    familyFriendly: false,
    architecturalTags: ['Couple Retreat', 'Heated Plunge Pool', 'Vineyard Ridge'],
    includedServices: [
      'Private JTR arrival transfer',
      'Daily artisanal pastry & orchard delivery',
      'Housekeeping every morning',
    ],
    amenities: [
      'Heated cliffside plunge pool',
      'Outdoor dining pergola for four',
      'Linen canopy bedding & rain showers',
      'High-speed Wi-Fi & Sonos audio',
    ],
    gallery: [
      {
        src: aegeanVillaImg,
        alt: 'Villa Thalassa Oia sunlit infinity terrace overlooking the Aegean Sea',
        caption: 'Terrace plunge pool facing north Aegean waters',
      },
      {
        src: calderaBedroomImg,
        alt: 'Sunlit Cycladic suite bedroom at Villa Thalassa Oia',
        caption: 'Primary bedroom suite with Aegean horizon light',
      },
      {
        src: calderaLivingImg,
        alt: 'Bright limestone salon at Villa Thalassa Oia',
        caption: 'Whitewashed salon and terrace lounge',
      },
    ],
    blockedRanges: seedBlockedRanges(1),
  },
  {
    id: 'villa-imerovigli-residence',
    slug: 'imerovigli-cliffside-residence',
    name: 'Imerovigli Horizon Residence',
    destination: 'santorini',
    destinationLabel: 'Santorini, Greece',
    locationArea: 'Imerovigli Ridge',
    flagship: false,
    headline: 'Three-level cliff sanctuary overlooking Skaros Rock and the central caldera.',
    summary:
      'Elevated family residence featuring sweeping panoramic terraces, indoor-outdoor kitchen, and heated infinity pool.',
    editorialStory:
      'Anchored at Santorini’s highest ridge in Imerovigli, this three-bedroom architectural home captures wide 200-degree views stretching from Oia to Akrotiri lighthouse.',
    baseNightlyEur: 1220,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    interiorSqm: 230,
    minNights: 3,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Full refund up to 14 days prior to arrival (demo terms).',
    hasPrivatePool: true,
    hasSeaView: true,
    familyFriendly: true,
    architecturalTags: ['Skaros Rock View', 'Family Layout', 'Heated Pool'],
    includedServices: [
      'Airport meet & greet in private minivan',
      'Daily Greek breakfast table setup',
      'Evening concierge coordination',
    ],
    amenities: [
      'Private 7m caldera pool',
      'Shaded pergola outdoor dining for eight',
      'Three independent suites with sea terraces',
      'Concierge chef table setup available',
    ],
    gallery: [
      {
        src: calderaLivingImg,
        alt: 'Imerovigli Horizon Residence vaulted salon looking out across the caldera',
        caption: 'Central vaulted salon open to the cliff deck',
      },
      {
        src: heroCalderaImg,
        alt: 'Caldera infinity pool terrace in Imerovigli overlooking the volcanic bay',
        caption: 'Main infinity deck overlooking Skaros Rock',
      },
      {
        src: calderaBedroomImg,
        alt: 'Arched primary suite at Imerovigli Horizon Residence',
        caption: 'Upper sunset suite looking out to sea',
      },
    ],
    blockedRanges: seedBlockedRanges(2),
  },
  {
    id: 'villa-akrotiri-estate',
    slug: 'akrotiri-horizon-estate',
    name: 'Akrotiri Limestone Estate',
    destination: 'santorini',
    destinationLabel: 'Santorini, Greece',
    locationArea: 'Akrotiri Peninsula',
    flagship: false,
    headline: 'Secluded four-bedroom compound on Santorini’s peaceful southern headland.',
    summary:
      'Expansive gated cliffside estate ideal for extended families, complete with private gardens, sunset lap pool, and wine terrace.',
    editorialStory:
      'Located far from cruise-ship crowds near the Akrotiri lighthouse, this stone-and-plaster estate spreads generously across two private acres overlooking volcanic cliffs and quiet coves.',
    baseNightlyEur: 1680,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 5,
    interiorSqm: 340,
    minNights: 3,
    checkInTime: '16:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Full refund up to 21 days prior to check-in (demo terms).',
    hasPrivatePool: true,
    hasSeaView: true,
    familyFriendly: true,
    architecturalTags: ['Private Compound', '4 Suites', 'Lap Pool'],
    includedServices: [
      'Private port/airport chauffeur',
      'Dedicated house manager & daily breakfast',
      'Curated island itinerary planning',
    ],
    amenities: [
      '12m heated infinity lap pool',
      'Gated Mediterranean dry-stone courtyard',
      'Separate guest casita suite',
      'Wood-fired outdoor kitchen pergola',
    ],
    gallery: [
      {
        src: aegeanVillaImg,
        alt: 'Akrotiri Limestone Estate lap pool overlooking coastal horizon',
        caption: 'Southern peninsula infinity lap pool deck',
      },
      {
        src: heroCalderaImg,
        alt: 'Limestone lounge terrace overlooking Santorini sea at dusk',
        caption: 'West sunset terrace and daybeds',
      },
      {
        src: calderaLivingImg,
        alt: 'Vaulted plaster living hall at Akrotiri Estate',
        caption: 'Main reception salon',
      },
    ],
    blockedRanges: seedBlockedRanges(3),
  },

  // --- AMALFI COAST (4 Villas) ---
  {
    id: 'villa-limone',
    slug: 'villa-limone',
    name: 'Villa Limone',
    destination: 'amalfi-coast',
    destinationLabel: 'Amalfi Coast, Italy',
    locationArea: 'Ravello & Minori Cliffs',
    flagship: true,
    headline: 'Sunlit limestone pergola framed by terraced Amalfi lemon groves.',
    summary:
      'Three-suite Italian coastal estate with travertine dining terrace, arched French doors above the bay, and private citrus gardens.',
    editorialStory:
      'Set among historic stone retaining walls above the sea between Ravello and Minori, Villa Limone captures classic Campania craftsmanship: hand-painted ceramic wainscoting, reclaimed walnut doors, and a fragrant Sfusato lemon pergola built for long coastal lunches.',
    baseNightlyEur: 1580,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 4,
    interiorSqm: 295,
    minNights: 3,
    checkInTime: '15:00',
    checkOutTime: '10:30',
    cancellationPolicy: 'Full refund up to 14 days prior to check-in · Flexible reschedule credit (demo terms).',
    hasPrivatePool: true,
    hasSeaView: true,
    familyFriendly: true,
    architecturalTags: ['Lemon Grove Pergola', 'Sea Balcony', 'Family Kitchen'],
    includedServices: [
      'Private Naples transfer coordination',
      'Daily Italian pastry breakfast beneath the pergola',
      'Daily housekeeping & garden care',
      'Welcome tasting of Amalfi cellar wines',
    ],
    amenities: [
      'Terraced travertine outdoor dining pergola',
      'Private cliffside plunge pool in lush citrus garden',
      'Tall timber-shuttered Tyrrhenian balconies',
      'Air-conditioned limewash salon & dining hall',
      'Private elevator from coastal road garage',
    ],
    gallery: [
      {
        src: amalfiLimoneImg,
        alt: 'Villa Limone outdoor travertine dining table beneath fruiting Amalfi lemon pergola overlooking sea',
        caption: 'Signature lemon-shaded pergola overlooking the Amalfi shoreline',
      },
      {
        src: amalfiInteriorImg,
        alt: 'Villa Limone bright coastal salon with open wooden doors onto Amalfi balcony',
        caption: 'Upper salon opening onto twin Tyrrhenian balconies',
      },
      {
        src: amalfiTerraceImg,
        alt: 'Sunlit coastal infinity terrace along Amalfi cliffs',
        caption: 'Lower Mediterranean sun terrace & plunge deck',
      },
      {
        src: coastalCharterImg,
        alt: 'Artisanal wooden cruiser off the Amalfi cliffs below Positano',
        caption: 'Private Riva & wooden gozzo charters available daily',
      },
    ],
    blockedRanges: seedBlockedRanges(4),
  },
  {
    id: 'villa-ravello-belvedere',
    slug: 'ravello-belvedere',
    name: 'Casa Belvedere Ravello',
    destination: 'amalfi-coast',
    destinationLabel: 'Amalfi Coast, Italy',
    locationArea: 'Scala Terrace, Ravello',
    flagship: false,
    headline: 'Elevated ceramic-tiled manor facing Ravello’s green amphitheater and sea.',
    summary:
      'Refined two-bedroom Amalfi sanctuary featuring French balcony shutters, olive-tree courtyard, and heated hillside pool.',
    editorialStory:
      'Quietly tucked across the ravine from Villa Cimbrone, Casa Belvedere pairs high vaulted ceilings with uninterrupted morning light over the Gulf of Salerno.',
    baseNightlyEur: 980,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    interiorSqm: 170,
    minNights: 2,
    checkInTime: '15:00',
    checkOutTime: '10:30',
    cancellationPolicy: 'Full refund up to 10 days before arrival (demo terms).',
    hasPrivatePool: true,
    hasSeaView: true,
    familyFriendly: false,
    architecturalTags: ['Ravello Views', 'Shuttered Balconies', 'Couple Friendly'],
    includedServices: [
      'Luggage porterage & arrival espresso welcome',
      'Morning garden housekeeping',
    ],
    amenities: [
      'Private olive-garden heated plunge pool',
      'French coastal balconies off every room',
      'Travertine kitchen & outdoor grill terrace',
      'Fibre internet workspace',
    ],
    gallery: [
      {
        src: amalfiInteriorImg,
        alt: 'Casa Belvedere Ravello cream limewash salon opening onto coastal terrace',
        caption: 'Timber-shuttered doors opening above the Gulf of Salerno',
      },
      {
        src: amalfiTerraceImg,
        alt: 'Pool terrace surrounded by Mediterranean palms and stone walls',
        caption: 'Hillside garden pool terrace',
      },
      {
        src: amalfiLimoneImg,
        alt: 'Shaded pergola dining table looking toward the sea',
        caption: 'Al fresco travertine dining corner',
      },
    ],
    blockedRanges: seedBlockedRanges(5),
  },
  {
    id: 'villa-positano-pergola',
    slug: 'positano-pergola-estate',
    name: 'Palazzo Pergola Positano',
    destination: 'amalfi-coast',
    destinationLabel: 'Amalfi Coast, Italy',
    locationArea: 'Positano Coastal Ridge',
    flagship: false,
    headline: 'MultilevelPositano stone villa with cantilevered sea terrace.',
    summary:
      'Three-bedroom residence suspended above Positano’s pastel cascade, featuring sunset aperitivo loggia and plunge pool.',
    editorialStory:
      'Steps from Positano’s quiet upper footpaths, Palazzo Pergola balances vibrant coastal views with cool stone interiors and shaded wicker lounge terraces.',
    baseNightlyEur: 1490,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    interiorSqm: 245,
    minNights: 3,
    checkInTime: '15:00',
    checkOutTime: '10:30',
    cancellationPolicy: 'Full refund up to 14 days prior to arrival (demo terms).',
    hasPrivatePool: true,
    hasSeaView: true,
    familyFriendly: true,
    architecturalTags: ['Positano Panorama', 'Plunge Pool', 'Historic Stone'],
    includedServices: [
      'Dedicated local villa assistant',
      'Morning breakfast service',
      'Daily towel & linen refresh',
    ],
    amenities: [
      'Sea-facing plunge pool & limestone deck',
      'Chef-grade Campania stone kitchen',
      'Direct footpath to beach moorings',
      'Covered terrace dining for eight',
    ],
    gallery: [
      {
        src: amalfiTerraceImg,
        alt: 'Palazzo Pergola Positano terrace overlooking coastal cliffs',
        caption: 'Panoramic terrace above Positano bay',
      },
      {
        src: amalfiLimoneImg,
        alt: 'Pergola dining space shaded by citrus foliage above the sea',
        caption: 'Sunset pergola dining area',
      },
      {
        src: amalfiInteriorImg,
        alt: 'Bright Positano living salon with balcony sea breeze',
        caption: 'Coastal reception room',
      },
    ],
    blockedRanges: seedBlockedRanges(6),
  },
  {
    id: 'villa-conca-marini',
    slug: 'conca-dei-marini-villa',
    name: 'Villa Torre Saracena',
    destination: 'amalfi-coast',
    destinationLabel: 'Amalfi Coast, Italy',
    locationArea: 'Conca dei Marini',
    flagship: false,
    headline: 'Historic coastal cliff estate with deep terraces and private sea mooring.',
    summary:
      'Four-bedroom residence with panoramic salt-water pool, terraced botanical paths, and private cove access for wooden launches.',
    editorialStory:
      'Set along the quiet cove of Conca dei Marini halfway between Amalfi and Positano, Villa Torre Saracena hosts extended groups with seamless coastal mooring access.',
    baseNightlyEur: 1920,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 5,
    interiorSqm: 380,
    minNights: 3,
    checkInTime: '16:00',
    checkOutTime: '10:30',
    cancellationPolicy: 'Full refund up to 21 days prior to check-in (demo terms).',
    hasPrivatePool: true,
    hasSeaView: true,
    familyFriendly: true,
    architecturalTags: ['8 Guests', 'Coastal Mooring', 'Saltwater Pool'],
    includedServices: [
      'Private boat mooring coordination',
      'Daily continental breakfast & housekeeping',
      'House concierge on call',
    ],
    amenities: [
      'Panoramic 11m saltwater cliff pool',
      'Four independent sea-facing bedrooms',
      'Wood-fired pizza terrace',
      'Private stone steps toward sea deck',
    ],
    gallery: [
      {
        src: coastalCharterImg,
        alt: 'Classic wooden yacht approaching Conca dei Marini cliffs near Villa Torre Saracena',
        caption: 'Private tender pickup directly along Conca cove',
      },
      {
        src: amalfiLimoneImg,
        alt: 'Sunlit stone dining terrace above the Amalfi sea',
        caption: 'Long pergola lunch terrace',
      },
      {
        src: amalfiInteriorImg,
        alt: 'Elegant coastal drawing room with sea doors',
        caption: 'Main sea salon',
      },
    ],
    blockedRanges: seedBlockedRanges(7),
  },

  // --- BALI (4 Villas) ---
  {
    id: 'villa-banyan-residence',
    slug: 'the-banyan-residence',
    name: 'The Banyan Residence',
    destination: 'bali',
    destinationLabel: 'Bali, Indonesia',
    locationArea: 'Uluwatu Limestone Cliff',
    flagship: true,
    headline: 'Teak louver pavilions nestled beneath mature banyan shade above Uluwatu surf.',
    summary:
      'Architectural indoor-outdoor sanctuary with dark volcanic basalt pool, courtyard gardens, and three serene garden-opening bedrooms.',
    editorialStory:
      'Designed around a 90-year-old courtyard banyan and clusters of white frangipani, The Banyan Residence opens completely to sea breezes through floor-to-ceiling teak louvers while framing dramatic south-west Indian Ocean swells.',
    baseNightlyEur: 1180,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    interiorSqm: 320,
    minNights: 3,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Full refund up to 14 days prior to check-in · Date-shift flexibility (demo terms).',
    hasPrivatePool: true,
    hasSeaView: true,
    familyFriendly: true,
    architecturalTags: ['Basalt Infinity Pool', 'Teak Architecture', 'Indian Ocean Cliff'],
    includedServices: [
      'VIP DPS arrival escort & luggage transfer',
      'Daily freshly cooked Balinese & continental breakfast',
      'Full-time private villa attendant & garden care',
      'Complimentary evening sound bath setup on request',
    ],
    amenities: [
      '14m black basalt cliffside infinity pool',
      'Carved limestone open-living dining pavilion',
      'Three teak & stone courtyard bedroom suites',
      'Rainwater outdoor soaking tubs',
      'High-speed Wi-Fi across pavilions',
    ],
    gallery: [
      {
        src: baliBanyanImg,
        alt: 'The Banyan Residence Bali indoor-outdoor teak pavilion beside dark basalt infinity pool and frangipani blossoms overlooking the Indian Ocean',
        caption: 'Teak dining pavilion, ancient banyan tree, and basalt ocean-edge pool',
      },
      {
        src: baliSuiteImg,
        alt: 'The Banyan Residence Balinese timber canopy bedroom sliding completely open onto lush courtyard stone plunge pool',
        caption: 'Garden courtyard suite sliding completely open to moss stepping stones',
      },
      {
        src: baliBanyanImg,
        alt: 'Evening glow across timber louver gallery overlooking Uluwatu surf swells',
        caption: 'Dusk along the Uluwatu headland louver gallery',
      },
    ],
    blockedRanges: seedBlockedRanges(8),
  },
  {
    id: 'villa-uluwatu-pavilion',
    slug: 'uluwatu-cliff-pavilion',
    name: 'Pecatu Limestone Pavilion',
    destination: 'bali',
    destinationLabel: 'Bali, Indonesia',
    locationArea: 'Pecatu Cliffs, Uluwatu',
    flagship: false,
    headline: 'Contemporary two-suite glass and teak pavilion above Bingin reefs.',
    summary:
      'Quiet cliff-edge escape tailored for two to four guests seeking minimal tropical warmth, private infinity pool, and sunset decks.',
    editorialStory:
      'Cut cleanly into white Pecatu limestone, this compact pavilion embraces effortless indoor-outdoor circulation with natural breeze corridors and tranquil reflection ponds.',
    baseNightlyEur: 760,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    interiorSqm: 210,
    minNights: 2,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Full refund up to 10 days prior to arrival (demo terms).',
    hasPrivatePool: true,
    hasSeaView: true,
    familyFriendly: false,
    architecturalTags: ['Minimalist Bali', 'Ocean Swell View', 'Private Pool'],
    includedServices: [
      'Private airport pickup from Denpasar',
      'Daily organic tropical fruit & coffee breakfast',
    ],
    amenities: [
      '10m infinity plunge pool',
      'Carved stone soaking tub',
      'Enclosed air-conditioned study',
      'Walkable access to Bingin cove steps',
    ],
    gallery: [
      {
        src: baliSuiteImg,
        alt: 'Pecatu Limestone Pavilion open bedroom opening to tropical garden plunge pool',
        caption: 'Suite pavilion open to the private plunge garden',
      },
      {
        src: baliBanyanImg,
        alt: 'Teak terrace pavilion above Indian Ocean swell',
        caption: 'West-facing ocean terrace deck',
      },
    ],
    blockedRanges: seedBlockedRanges(9),
  },
  {
    id: 'villa-canggu-sanctuary',
    slug: 'canggu-courtyard-sanctuary',
    name: 'Desa Courtyard Sanctuary',
    destination: 'bali',
    destinationLabel: 'Bali, Indonesia',
    locationArea: 'Pererenan Shore, Bali',
    flagship: false,
    headline: 'Secluded three-bedroom courtyard villa minutes from Pererenan black-sand surf.',
    summary:
      'Lively tropical courtyard sanctuary pairing enclosed stone garden walls, covered bale lounge, and warm family living areas.',
    editorialStory:
      'Surrounded by tranquil palms five minutes on foot from Pererenan shore, Desa Courtyard Sanctuary separates sleeping suites cleanly around a central jade stone lap pool.',
    baseNightlyEur: 840,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    interiorSqm: 275,
    minNights: 2,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Full refund up to 10 days prior to arrival (demo terms).',
    hasPrivatePool: true,
    hasSeaView: false,
    familyFriendly: true,
    architecturalTags: ['Tropical Courtyard', 'Walk to Beach', 'Family Safe'],
    includedServices: [
      'Daily morning breakfast & linen service',
      'Private driver available for island outings',
    ],
    amenities: [
      '12m jade greenstone courtyard pool',
      'Covered outdoor dining bale',
      'Enclosed acoustic media pavilion',
      'Shallow wading ledge for younger guests',
    ],
    gallery: [
      {
        src: baliSuiteImg,
        alt: 'Desa Courtyard Sanctuary garden bedroom suite with stepping stones',
        caption: 'Private bedroom suite facing tropical garden pool',
      },
      {
        src: baliBanyanImg,
        alt: 'Covered teak living pavilion at Desa Courtyard Sanctuary',
        caption: 'Open-sided teak lounge & pool terrace',
      },
    ],
    blockedRanges: seedBlockedRanges(10),
  },
  {
    id: 'villa-nusa-dua-estate',
    slug: 'nusa-dua-lagoon-estate',
    name: 'Bukit Lagoon Residence',
    destination: 'bali',
    destinationLabel: 'Bali, Indonesia',
    locationArea: 'Nusa Dua Southern Reef',
    flagship: false,
    headline: 'Grand five-suite coastal compound set amid palm lawns and calm lagoon waters.',
    summary:
      'Multi-generational residence with 18m ocean-facing pool, dedicated dining pavilion, private wellness room, and full house team.',
    editorialStory:
      'Designed for milestone celebrations and extended family coastal holidays, Bukit Lagoon pairs generous garden lawns with tranquil eastern sunrise light over calm reef waters.',
    baseNightlyEur: 1620,
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 6,
    interiorSqm: 480,
    minNights: 3,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Full refund up to 21 days prior to check-in (demo terms).',
    hasPrivatePool: true,
    hasSeaView: true,
    familyFriendly: true,
    architecturalTags: ['10 Guests', '5 Suites', 'Wellness Room'],
    includedServices: [
      'Dedicated Villa Manager & two private attendants',
      'Complimentary airport round-trip vans',
      'Daily cooked-to-order island breakfast',
    ],
    amenities: [
      '18m oceanfront pool & sunset bale',
      'Dedicated private massage & spa pavilion',
      'Kids garden pergola & lawn',
      'Full gourmet kitchen with bar service area',
    ],
    gallery: [
      {
        src: baliBanyanImg,
        alt: 'Bukit Lagoon Residence main ocean-facing infinity pool and teak pavilions',
        caption: 'Main lagoon-view pavilion & infinity pool lawn',
      },
      {
        src: baliSuiteImg,
        alt: 'Guest suite pavilion with private plunge garden at Bukit Lagoon Residence',
        caption: 'Independent guest suite opening to mossy garden path',
      },
    ],
    blockedRanges: seedBlockedRanges(11),
  },
];

// ============================================================================
// Optional Experiences & Stay Extras Catalog
// ============================================================================

export const AZURE_EXPERIENCES: AzureExperience[] = [
  {
    id: 'exp-caldera-sailing',
    title: 'Private Caldera Sunset Sail',
    destination: 'santorini',
    destinationLabel: 'Santorini',
    duration: '5 Hours · Afternoon into dusk',
    pricingBasis: 'per_stay',
    priceEur: 950,
    summary:
      'Private wooden yacht charter from Ammoudi Bay along the volcanic hot springs, White Beach coves, and caldera sunset anchorage.',
    includes: ['Dedicated skipper & deckhand', 'Mediterranean mezze table & chilled Assyrtiko wine', 'Snorkeling equipment & towels'],
    image: coastalCharterImg,
    imageAlt: 'Private wooden yacht cruising past dramatic coastal limestone cliffs at late afternoon',
  },
  {
    id: 'exp-volcanic-cellar',
    title: 'Sommelier Volcanic Vineyard Tasting',
    destination: 'santorini',
    destinationLabel: 'Santorini',
    duration: '2.5 Hours · Private villa terrace',
    pricingBasis: 'per_guest',
    priceEur: 125,
    summary:
      'Guided tasting of rare pre-phylloxera Santorini Assyrtiko and Vinsanto vintages hosted privately on your villa deck at dusk.',
    includes: ['5 single-vineyard pours', 'Paired artisanal Cycladic cheeses', 'Local wine historian'],
    image: heroCalderaImg,
    imageAlt: 'Sunset vineyard tasting overlooking Santorini cliffs',
  },
  {
    id: 'exp-amalfi-riva',
    title: 'Amalfi Wooden Riva Coastal Charter',
    destination: 'amalfi-coast',
    destinationLabel: 'Amalfi Coast',
    duration: 'Full Day · 7 Hours',
    pricingBasis: 'per_stay',
    priceEur: 1180,
    summary:
      'Classic artisanal mahogany boat day from Amalfi along Positano, Li Galli islands, and secluded emerald grottos toward Capri.',
    includes: ['Private captain & fuel along Amalfi shoreline', 'Campania mozzarella lunch basket', 'Fresh beach linen'],
    image: coastalCharterImg,
    imageAlt: 'Artisanal wooden boat cruising off coastal Italian cliffs',
  },
  {
    id: 'exp-lemon-pergola-dinner',
    title: 'Private Chef’s Lemon-Grove Dinner',
    destination: 'amalfi-coast',
    destinationLabel: 'Amalfi Coast',
    duration: 'Evening · 4-Course Table',
    pricingBasis: 'per_guest',
    priceEur: 165,
    summary:
      'Campania private chef preparing handmade scialatielli pasta, line-caught sea bass, and Amalfi lemon tart directly beneath your villa pergola.',
    includes: ['Four bespoke seasonal courses', 'Local organic ingredients & sommelier pairing option', 'Tableware & full clean-up'],
    image: amalfiLimoneImg,
    imageAlt: 'Travertine dining table beneath lemon pergola in Amalfi',
  },
  {
    id: 'exp-bali-wellness-dining',
    title: 'In-Villa Chef & Evening Sound Ritual',
    destination: 'bali',
    destinationLabel: 'Bali',
    duration: 'Evening · Courtyard setting',
    pricingBasis: 'per_guest',
    priceEur: 110,
    summary:
      'Candlelit Indonesian coastal tasting table set beside the banyan courtyard pool, preceded by a quiet Balinese acoustic gong session.',
    includes: ['Acoustic courtyard practitioner', 'Three-course coastal Balinese dinner', 'Botanical herbal mocktails'],
    image: baliBanyanImg,
    imageAlt: 'Bali indoor-outdoor pavilion lit warmly beside infinity pool',
  },
  {
    id: 'exp-concierge-breakfast',
    title: 'Daily Private Morning Host & Fresh Table',
    destination: 'all',
    destinationLabel: 'All Destinations',
    duration: 'Daily · Morning service',
    pricingBasis: 'per_night',
    priceEur: 85,
    summary:
      'Dedicated morning chef-host preparing eggs, seasonal coastal fruit, espresso, and regional pastries tailored to each guest’s waking hour.',
    includes: ['Customized morning menu daily', 'Fresh local market sourcing', 'Served in-courtyard or sea terrace'],
    image: calderaLivingImg,
    imageAlt: 'Morning sunlight across coastal villa terrace salon',
  },
];

// ============================================================================
// Guarantees & FAQ Content
// ============================================================================

export const AZURE_FAQS: { question: string; answer: string }[] = [
  {
    question: 'Is this a live villa booking website or an interactive demonstration?',
    answer:
      'Azure Escapes is an interactive concept showcase designed and engineered by Genmax IT Solution. Availability windows, seasonal nightly rates, extras calculation, and reservation confirmations run deterministically in-browser with no payments or external APIs.',
  },
  {
    question: 'How does seasonal pricing work across date boundaries?',
    answer:
      'Each night of a selected stay is evaluated individually against Quiet Sea, High Shoulder, and Peak Coastal seasonal tariffs. If your check-in and check-out span a boundary date, the itemized quote splits and sums both nightly rates automatically.',
  },
  {
    question: 'Can I check out on the same morning another guest checks in?',
    answer:
      'Yes. Following luxury hospitality turnaround standards, our availability engine treats reservation windows as half-open intervals [check-in, check-out), allowing clean same-day morning departure when another hold begins that afternoon.',
  },
  {
    question: 'What happens when I confirm a demo reservation?',
    answer:
      'Confirming generates a formatted Azure Escapes reservation reference (AZR-DEMO-XXXX) preserving villa details, travel dates, guests, selected experiences, and itemized totals in browser storage—while deliberately omitting personal contact details from persistent storage.',
  },
];

export function getVillaBySlug(slug?: string): AzureVilla | undefined {
  if (!slug) return undefined;
  return AZURE_VILLAS.find((v) => v.slug === slug);
}

export function getDestinationBySlug(slug?: string): DestinationInfo | undefined {
  if (!slug) return undefined;
  return AZURE_DESTINATIONS.find((d) => d.slug === slug);
}
