import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, ChevronDown, Compass } from 'lucide-react';
import { ShowcaseProject } from '../../data/showcaseProjects';
import { ProjectBrandLogo } from '../brand/ProjectLogos';

export const AzureLandingPage: React.FC<{ project: ShowcaseProject }> = ({ project }) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const [region, setRegion] = useState<'all' | 'santorini' | 'amalfi' | 'bali'>('all');
  const [nights, setNights] = useState(5);
  const [guests, setGuests] = useState('4 Guests');
  const [reservedVilla, setReservedVilla] = useState<string | null>(null);

  // Experiential Itinerary Tabs & Charter Add-ons
  const [activeItinerary, setActiveItinerary] = useState<'aegean' | 'amalfi' | 'bali'>('aegean');
  const [addonYacht, setAddonYacht] = useState(true);
  const [addonHeli, setAddonHeli] = useState(false);
  const [addonChef, setAddonChef] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const villas = [
    {
      id: 'amalfi-manor',
      region: 'amalfi',
      name: 'Villa Belvedere Cliffside Manor',
      location: 'Ravello, Amalfi Coast, Italy',
      bedrooms: '6 Suites · Private Helipad & Infinity Pool',
      nightlyRate: 2400,
      image: project.secondaryImage,
    },
    {
      id: 'oia-caldera',
      region: 'santorini',
      name: 'Villa Oia Caldera Sanctuary',
      location: 'Oia, Santorini, Greece',
      bedrooms: '4 Suites · Aegean Sunset Plunge Pool & Sommelier',
      nightlyRate: 1850,
      image: project.thumbnail,
    },
    {
      id: 'uluwatu-estate',
      region: 'bali',
      name: 'Uluwatu Oceanfront Limestone Estate',
      location: 'Bukit Peninsula, Bali',
      bedrooms: '5 Suites · Private Beach Funicular & Personal Chef',
      nightlyRate: 1650,
      image: project.secondaryImage,
    },
  ];

  const itineraries = {
    aegean: {
      title: '7-Day Aegean Superyacht & Santorini Caldera Trail',
      subtitle: 'Santorini -> Milos Sea Caves -> Paros Private Vineyard',
      days: [
        'Days 1–2: Private sunset cliff arrival at Oia Caldera with resident Cycladic sommelier.',
        'Days 3–4: Riva 68 Ego tender excursion through Milos Kleftiko turquoise arches.',
        'Days 5–7: Vineyard harvest dinner and helicopter transfer to Athens private jet terminal.',
      ],
    },
    amalfi: {
      title: '7-Day Amalfi Cliffside & Capri Private Charter',
      subtitle: 'Ravello -> Positano -> Isle of Capri',
      days: [
        'Days 1–2: Champagne reception beneath century-old Ravello lemon pergolas.',
        'Days 3–4: Sunrise swim below Faraglioni rocks aboard a private Azimut yacht.',
        'Days 5–7: Two-star Michelin chef residency dinner inside your villa limestone terrace.',
      ],
    },
    bali: {
      title: '7-Day Bukit Sanctuary & Komodo Ocean Expedition',
      subtitle: 'Uluwatu Cliffs -> Nusa Lembongan Reefs -> Private Phinisi',
      days: [
        'Days 1–2: Clifftop Ayurvedic recovery rituals and private beach funicular access.',
        'Days 3–5: Chartered ocean cruise with marine biologist along coral sanctuaries.',
        'Days 6–7: Seaside Balinese tasting menu curated for your private family party.',
      ],
    },
  }[activeItinerary];

  const charterExtrasTotal = (addonYacht ? 3200 : 0) + (addonHeli ? 1950 : 0) + (addonChef ? 850 * nights : 0);
  const visibleVillas = region === 'all' ? villas : villas.filter((v) => v.region === region);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#07243B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-[#07243B] text-white text-xs font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <a href="#top" className="shrink-0">
            <ProjectBrandLogo projectId={project.id} size="md" tone="dark" />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#villas" className="hover:text-[#0284C7] transition-colors whitespace-nowrap shrink-0">Private Villas</a>
            <a href="#itineraries" className="hover:text-[#0284C7] transition-colors whitespace-nowrap shrink-0">Itineraries</a>
            <a href="#charters" className="hover:text-[#0284C7] transition-colors whitespace-nowrap shrink-0">Yacht &amp; Heli</a>
            <a href="#reviews" className="hover:text-[#0284C7] transition-colors whitespace-nowrap shrink-0">Guest Stories</a>
          </nav>

          <a
            href="#villas"
            className="px-5 py-2.5 rounded-xl bg-[#07243B] text-white font-semibold text-xs tracking-wide hover:bg-[#0C3556] transition-colors whitespace-nowrap shrink-0"
          >
            Book Sanctuary
          </a>
        </div>
      </header>

      {/* 2. Hero + Booking Calculator */}
      <section id="top" className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#0284C7]">
              Santorini · Amalfi Coast · Bali · Ibiza
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#07243B] leading-[1.08]"
              style={{ fontFamily: "'Outfit', sans-serif", textWrap: 'balance' }}
            >
              Private Cliffside Sanctuaries Overlooking Open Sea
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              140+ architectural coastal estates vetted by private aviation and Michelin hospitality specialists. Direct booking with zero OTA commissions and 24/7 on-island butler teams.
            </p>

            {/* Interactive Search & Price Estimator */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Coastline</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-[#07243B]"
                  >
                    <option value="all">All Coastlines</option>
                    <option value="santorini">Santorini, Greece</option>
                    <option value="amalfi">Amalfi Coast, Italy</option>
                    <option value="bali">Uluwatu, Bali</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Stay Duration</label>
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold">
                    <button onClick={() => setNights((n) => Math.max(2, n - 1))} className="px-1.5 py-0.5 hover:bg-slate-200 rounded cursor-pointer">-</button>
                    <span className="tabular-nums">{nights} Nights</span>
                    <button onClick={() => setNights((n) => Math.min(21, n + 1))} className="px-1.5 py-0.5 hover:bg-slate-200 rounded cursor-pointer">+</button>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Party Size</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-[#07243B]"
                  >
                    <option>2 Guests</option>
                    <option>4 Guests</option>
                    <option>8+ Family Charter</option>
                  </select>
                </div>
              </div>
              <a
                href="#villas"
                onClick={() => showToast(`Showing estates available for ${nights} nights (${guests})`)}
                className="w-full py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <span>Calculate Stay &amp; Explore Matching Villas</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative">
              <img
                src={project.secondaryImage}
                alt="Amalfi Coast Private Infinity Pool Villa Terrace"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust Metrics Strip */}
      <section className="py-10 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '140+', label: 'Verified Coastal Estates' },
            { num: '99.4%', label: 'Guest Satisfaction Score' },
            { num: '0% Fees', label: 'Direct Owner Parity Rate' },
            { num: '24/7 Butler', label: 'Dedicated On-Island Staff' },
          ].map((s, idx) => (
            <div key={idx}>
              <div className="text-2xl font-bold text-[#0284C7] tabular-nums" style={{ fontFamily: "'Outfit', sans-serif" }}>{s.num}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Curated Villas Grid */}
      <section id="villas" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#0284C7] mb-1">Direct Estate Reservations</div>
              <h2 className="text-3xl font-bold text-[#07243B]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Verified Private Villas ({nights}-Night Calculation)
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Estates' },
                { id: 'santorini', label: 'Santorini' },
                { id: 'amalfi', label: 'Amalfi Coast' },
                { id: 'bali', label: 'Bali' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRegion(r.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    region === r.id ? 'bg-[#07243B] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleVillas.map((v) => {
              const stayTotal = v.nightlyRate * nights + charterExtrasTotal;
              const isReserved = reservedVilla === v.id;
              return (
                <div key={v.id} className="rounded-2xl overflow-hidden bg-[#FAF8F5] border border-slate-200 flex flex-col justify-between">
                  <div className="h-60 overflow-hidden">
                    <img src={v.image} alt={v.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-[#0284C7] font-semibold">{v.location}</div>
                      <h3 className="text-lg font-bold text-[#07243B] mt-0.5">{v.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{v.bedrooms}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500">{nights} nights + selected charters</span>
                        <span className="text-lg font-bold text-[#07243B] tabular-nums">€{stayTotal.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => {
                          setReservedVilla(v.id);
                          showToast(`Hold placed on ${v.name} for ${nights} nights.`);
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          isReserved ? 'bg-emerald-600 text-white' : 'bg-[#07243B] hover:bg-[#0C3556] text-white'
                        }`}
                      >
                        {isReserved ? '✓ Dates Held — Butler Assigned' : 'Reserve Private Stay'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Experiential 7-Day Itineraries */}
      <section id="itineraries" className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold uppercase tracking-widest text-[#0284C7]">Bespoke Coastline Routes</div>
            <h2 className="text-3xl font-bold text-[#07243B]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Curated 7-Day Experiential Itineraries
            </h2>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'aegean', label: 'Aegean Yacht Trail' },
                { id: 'amalfi', label: 'Amalfi & Capri' },
                { id: 'bali', label: 'Bali Sanctuary' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveItinerary(t.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                    activeItinerary === t.id ? 'bg-[#0284C7] text-white' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#07243B]">{itineraries.title}</h3>
                <div className="text-xs font-semibold text-[#0284C7] mt-0.5">{itineraries.subtitle}</div>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {itineraries.days.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Compass className="w-4 h-4 text-[#0284C7] shrink-0 mt-1" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 6. Private Charter Add-Ons Module */}
          <div id="charters" className="lg:col-span-6 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#0284C7]">Door-to-Villa Logistics</div>
              <h3 className="text-2xl font-bold text-[#07243B]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Toggle Private Aviation &amp; Marine Charters
              </h3>
              <p className="text-xs text-slate-500 mt-1">Selected add-ons dynamically update your total across all villas above.</p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Private Riva 68 Yacht Day Charter', price: '€3,200 flat', active: addonYacht, toggle: () => setAddonYacht(!addonYacht) },
                { label: 'Helipad Airport Transfer (Both Ways)', price: '€1,950 flat', active: addonHeli, toggle: () => setAddonHeli(!addonHeli) },
                { label: 'Resident Michelin Chef & Sommelier', price: '€850 / night', active: addonChef, toggle: () => setAddonChef(!addonChef) },
              ].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={opt.toggle}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                    opt.active ? 'bg-sky-50 border-[#0284C7]' : 'bg-[#FAF8F5] border-slate-200'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-[#07243B]">{opt.label}</div>
                    <div className="text-xs text-slate-500 tabular-nums">{opt.price}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${opt.active ? 'bg-[#0284C7] text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {opt.active ? 'Included' : 'Add'}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-sm font-bold">
              <span>Selected Experience Add-Ons Total:</span>
              <span className="text-[#0284C7] tabular-nums">€{charterExtrasTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Guest Stories Triad */}
      <section id="reviews" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: '“Our family’s two-week Amalfi coast itinerary—including boat transfers to Capri—ran with invisible precision.”', author: 'Henrik Lindqvist · Stockholm', villa: 'Villa Belvedere, Ravello' },
              { quote: '“Having a trained cycladic chef prepare breakfast overlooking the Oia caldera every morning felt effortless.”', author: 'Claire Beaumont · London', villa: 'Villa Oia Sanctuary' },
              { quote: '“Zero hidden marketplace fees and the local travel director resolved a flight change before we landed.”', author: 'Siddharth Kapoor · Singapore', villa: 'Uluwatu Limestone Estate' },
            ].map((r, i) => (
              <blockquote key={i} className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200 flex flex-col justify-between space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed italic">{r.quote}</p>
                <div className="pt-3 border-t border-slate-200">
                  <div className="text-xs font-bold text-[#07243B]">{r.author}</div>
                  <div className="text-[11px] text-[#0284C7]">{r.villa}</div>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ & Dossier CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#07243B] text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Concierge &amp; Booking Questions
            </h2>
            {[
              { q: 'Are airport transfers and provisioning included in villa rates?', a: 'Arrival logistics, daily housekeeping, and concierge services are built into every reservation; private yachts and heliports are customized above.' },
              { q: 'What is the cancellation policy for peak Mediterranean summer dates?', a: 'Flexible re-booking applies up to 45 days prior to check-in with complimentary Lloyd’s weather disruption insurance options.' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl bg-white border border-slate-200">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-bold text-[#07243B] cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#0284C7] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && <div className="px-5 pb-4 text-xs text-slate-600">{item.a}</div>}
              </div>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-[#07243B] text-white text-center space-y-5">
            <h3 className="text-2xl font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Plan Your Bespoke 2026 Mediterranean Escape
            </h3>
            {inquirySent ? (
              <div className="p-4 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-200 text-sm font-medium">
                Dossier Requested — Check your inbox for your tailored 2026 Villa Portfolio.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes('@')) {
                    setInquirySent(true);
                    showToast('Custom itinerary brochure sent to your email.');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email for bespoke itineraries..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-sky-300/30 text-white placeholder:text-sky-200/70 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#38BDF8] text-[#07243B] font-bold text-xs uppercase tracking-wider hover:bg-sky-300 cursor-pointer whitespace-nowrap shrink-0"
                >
                  Send Villa Dossier
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="py-12 bg-[#041827] text-sky-200/75 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <ProjectBrandLogo projectId={project.id} size="sm" tone="light" />
            <p>Private architectural sanctuaries across Santorini, Ravello, Ibiza, and Bali.</p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Destinations</div>
            <div>Santorini Caldera</div>
            <div>Amalfi &amp; Capri</div>
            <div>Uluwatu Cliffs, Bali</div>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Services</div>
            <div>Private Superyachts</div>
            <div>Helipad Aviation</div>
            <div>24/7 Butler Teams</div>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-white uppercase">Concierge Desk</div>
            <div>concierge@azureescapes.travel</div>
            <div>Zurich · Athens · Milan</div>
            <div>© 2026 Azure Escapes</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
