import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Compass, Mail, MapPin } from 'lucide-react';
import { AzureLayout } from '../../components/azure/AzureLayout';

export const AzureConciergePage: React.FC = () => {
  const [requestType, setRequestType] = useState('Private Villa Advisory');
  const [destination, setDestination] = useState('Santorini, Greece');
  const [preferredDates, setPreferredDates] = useState('');
  const [guests, setGuests] = useState('4');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setError('Please include a brief note about your coastal plans.');
      return;
    }
    const code = `AZR-CONC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setSubmittedRef(code);
  };

  return (
    <AzureLayout title="Private Concierge">
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Editorial Intro Column */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[#2E7D8C] font-semibold">
              Bespoke Coastal Desk
            </p>
            <h1 className="text-4xl font-semibold text-[#09263B]">
              Private Concierge Inquiry
            </h1>
            <p className="text-sm sm:text-base text-[#394B59] leading-relaxed">
              Coordinate side-by-side multi-villa bookings, private Riva transfers from Naples or
              Fira, or in-residence celebratory menus across Santorini, Amalfi Coast, and Bali.
            </p>

            <div className="bg-[#EDE6DA] border border-[#DDD4C6] p-6 space-y-4 text-xs text-[#394B59]">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A88443] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#09263B] block">Regional Houses Covered:</strong>
                  Oia &amp; Akrotiri (Santorini) · Ravello &amp; Positano (Amalfi) · Uluwatu &amp;
                  Pererenan (Bali)
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#2E7D8C] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#09263B] block">Demo Behavior:</strong>
                  Submissions produce an immediate in-browser confirmation reference with zero
                  external network transmission.
                </span>
              </p>
            </div>
          </div>

          {/* Concierge Form / In-Demo Confirmation Card */}
          <div className="lg:col-span-7 bg-[#FCFBF8] border border-[#DDD4C6] p-7 sm:p-9 shadow-sm">
            {submittedRef ? (
              <div className="space-y-5 py-4">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#1F6A52] font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Inquiry Logged in Demo</span>
                </div>
                <h2 className="text-3xl font-semibold text-[#09263B]">
                  Concierge brief received
                </h2>
                <p className="text-sm text-[#394B59] leading-relaxed">
                  Reference <strong className="text-[#09263B] az-tabular">{submittedRef}</strong> has
                  been generated for your{' '}
                  <strong className="text-[#09263B]">{requestType}</strong> request regarding{' '}
                  <strong className="text-[#09263B]">{destination}</strong>.
                </p>
                <p className="text-xs text-[#526372] bg-[#F6F2EB] border border-[#DDD4C6] p-4">
                  This is an interactive hospitality showcase by Genmax IT Solution—no external
                  emails or CRM records are transmitted.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setMessage('');
                    }}
                    className="px-5 py-3 bg-[#09263B] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.14em] cursor-pointer"
                  >
                    Submit Another Note
                  </button>
                  <Link
                    to="/showcase/azure-escapes/villas"
                    className="px-5 py-3 border border-[#09263B] text-[#09263B] text-xs font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore All Villas</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <p className="p-3 bg-[#FDF4EE] border border-[#E5B89B] text-xs font-medium text-[#7A3B1E]">
                    {error}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="az-conc-type"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                    >
                      Request Type
                    </label>
                    <select
                      id="az-conc-type"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B]"
                    >
                      <option>Private Villa Advisory</option>
                      <option>Private Yacht or Riva Charter</option>
                      <option>Multi-Villa Group Celebration</option>
                      <option>Helicopter &amp; Arrival Logistics</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="az-conc-dest"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                    >
                      Destination
                    </label>
                    <select
                      id="az-conc-dest"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B]"
                    >
                      <option>Santorini, Greece</option>
                      <option>Amalfi Coast, Italy</option>
                      <option>Bali, Indonesia</option>
                      <option>Flexible Across Regions</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="az-conc-dates"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                    >
                      Target Travel Window
                    </label>
                    <input
                      id="az-conc-dates"
                      type="text"
                      value={preferredDates}
                      onChange={(e) => setPreferredDates(e.target.value)}
                      placeholder="e.g., June 12 – June 18"
                      className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="az-conc-guests"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                    >
                      Estimated Guests
                    </label>
                    <select
                      id="az-conc-guests"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B] az-tabular"
                    >
                      {['2', '4', '6', '8', '10+'].map((g) => (
                        <option key={g} value={g}>
                          {g} Guests
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="az-conc-name"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                    >
                      Your Name *
                    </label>
                    <input
                      id="az-conc-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Marcus Vance"
                      className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B]"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="az-conc-email"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="az-conc-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="az-conc-msg"
                    className="block text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
                  >
                    Coastal Brief &amp; Preferences *
                  </label>
                  <textarea
                    id="az-conc-msg"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share preferred cliffside location, private boat schedule, or bedroom configuration..."
                    className="w-full p-3 bg-white border border-[#DDD4C6] text-sm text-[#09263B]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 bg-[#09263B] hover:bg-[#0F3854] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Send Demo Concierge Request</span>
                  <ArrowRight className="w-4 h-4 text-[#D4B06A]" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </AzureLayout>
  );
};
