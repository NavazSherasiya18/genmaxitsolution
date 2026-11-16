import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Search, Users } from 'lucide-react';
import {
  DestinationSlug,
  addDaysIso,
  getTodayIso,
} from '../../data/azureCatalog';
import { useAzureStore } from '../../context/AzureStoreContext';

interface BookingBarProps {
  initialDestination?: DestinationSlug | 'all';
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  variant?: 'hero' | 'compact';
  onSubmitCustom?: (params: {
    destination: DestinationSlug | 'all';
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => void;
}

export const BookingBar: React.FC<BookingBarProps> = ({
  initialDestination,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  variant = 'hero',
  onSubmitCustom,
}) => {
  const navigate = useNavigate();
  const { searchDraft, updateSearchDraft } = useAzureStore();
  const today = getTodayIso();

  const [destination, setDestination] = useState<DestinationSlug | 'all'>(
    initialDestination ?? searchDraft.destination
  );
  const [checkIn, setCheckIn] = useState<string>(initialCheckIn ?? searchDraft.checkIn);
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut ?? searchDraft.checkOut);
  const [guests, setGuests] = useState<number>(initialGuests ?? searchDraft.guests);
  const [dateWarning, setDateWarning] = useState<string>('');

  const handleCheckInChange = (val: string) => {
    setDateWarning('');
    setCheckIn(val);
    if (val && checkOut <= val) {
      setCheckOut(addDaysIso(val, 3));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setDateWarning('Select a check-out date after check-in.');
      return;
    }
    const payload = { destination, checkIn, checkOut, guests };
    updateSearchDraft(payload);

    if (onSubmitCustom) {
      onSubmitCustom(payload);
      return;
    }

    const query = new URLSearchParams();
    if (destination !== 'all') query.set('destination', destination);
    query.set('checkIn', checkIn);
    query.set('checkOut', checkOut);
    query.set('guests', String(guests));
    navigate(`/showcase/azure-escapes/villas?${query.toString()}`);
  };

  const containerCls =
    variant === 'hero'
      ? 'bg-[#FCFBF8]/95 backdrop-blur-md border border-[#DDD4C6] shadow-2xl p-4 sm:p-5'
      : 'bg-[#FCFBF8] border border-[#DDD4C6] p-4 shadow-sm';

  return (
    <form onSubmit={handleSubmit} className={containerCls} aria-label="Search available villas">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4 items-end">
        {/* Destination */}
        <div className="lg:col-span-3">
          <label
            htmlFor={`az-dest-${variant}`}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-[#2E7D8C]" />
            Destination
          </label>
          <select
            id={`az-dest-${variant}`}
            value={destination}
            onChange={(e) => setDestination(e.target.value as DestinationSlug | 'all')}
            className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm font-medium text-[#09263B] focus:border-[#2E7D8C] focus:outline-none"
          >
            <option value="all">All Coastal Destinations</option>
            <option value="santorini">Santorini, Greece</option>
            <option value="amalfi-coast">Amalfi Coast, Italy</option>
            <option value="bali">Bali, Indonesia</option>
          </select>
        </div>

        {/* Check-in */}
        <div className="lg:col-span-3">
          <label
            htmlFor={`az-in-${variant}`}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-[#2E7D8C]" />
            Check-in
          </label>
          <input
            id={`az-in-${variant}`}
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => handleCheckInChange(e.target.value)}
            className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm font-medium text-[#09263B] az-tabular focus:border-[#2E7D8C] focus:outline-none"
            required
          />
        </div>

        {/* Check-out */}
        <div className="lg:col-span-3">
          <label
            htmlFor={`az-out-${variant}`}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-[#2E7D8C]" />
            Check-out
          </label>
          <input
            id={`az-out-${variant}`}
            type="date"
            min={checkIn ? addDaysIso(checkIn, 1) : addDaysIso(today, 1)}
            value={checkOut}
            onChange={(e) => {
              setDateWarning('');
              setCheckOut(e.target.value);
            }}
            className="w-full h-11 px-3 bg-white border border-[#DDD4C6] text-sm font-medium text-[#09263B] az-tabular focus:border-[#2E7D8C] focus:outline-none"
            required
          />
        </div>

        {/* Guests */}
        <div className="lg:col-span-1">
          <label
            htmlFor={`az-guests-${variant}`}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#526372] font-semibold mb-1.5"
          >
            <Users className="w-3.5 h-3.5 text-[#2E7D8C]" />
            Guests
          </label>
          <select
            id={`az-guests-${variant}`}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full h-11 px-2.5 bg-white border border-[#DDD4C6] text-sm font-medium text-[#09263B] az-tabular focus:border-[#2E7D8C] focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="sm:col-span-2 lg:col-span-2">
          <button
            type="submit"
            className="w-full h-11 px-5 bg-[#09263B] hover:bg-[#0F3854] text-[#F6F2EB] text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Search className="w-4 h-4 text-[#D4B06A]" />
            <span>Search Villas</span>
          </button>
        </div>
      </div>

      {dateWarning && (
        <p className="mt-2.5 text-xs font-medium text-amber-800">{dateWarning}</p>
      )}
    </form>
  );
};
