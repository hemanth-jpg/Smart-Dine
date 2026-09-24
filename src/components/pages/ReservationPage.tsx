import React, { useState } from 'react';
import { TableReservation } from '../../types/hotel';
import { 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Wine, 
  UtensilsCrossed, 
  Building2, 
  Heart,
  ChevronRight
} from 'lucide-react';

interface Props {
  reservations: TableReservation[];
  onAddReservation: (res: TableReservation) => void;
  currentRoom: string;
}

export const ReservationPage: React.FC<Props> = ({
  reservations,
  onAddReservation,
  currentRoom,
}) => {
  const [guestName, setGuestName] = useState('Lord / Lady Guest');
  const [roomNumber, setRoomNumber] = useState(currentRoom || 'Suite 704');
  const [contactPhone, setContactPhone] = useState('+1 (555) 700-1420');
  const [venue, setVenue] = useState<TableReservation['venue']>('The Grand Conservatory');
  const [date, setDate] = useState('Tomorrow');
  const [time, setTime] = useState('19:30');
  const [guestsCount, setGuestsCount] = useState(2);
  const [occasion, setOccasion] = useState<TableReservation['occasion']>('Casual Dining');
  const [specialRequests, setSpecialRequests] = useState('Window seating with quiet ambient view');
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  const venuesList = [
    {
      name: 'The Grand Conservatory',
      desc: 'Fine dining under an illuminated glass botanical dome. Michelin star tasting menu.',
      hours: '18:00 – 22:30',
      dressCode: 'Smart Elegant'
    },
    {
      name: 'Rooftop Horizon Terrace',
      desc: 'Panoramic skyline & harbor views with open-flame artisanal grill and craft cocktails.',
      hours: '17:00 – 00:00',
      dressCode: 'Resort Chic'
    },
    {
      name: 'La Veranda Wine Cellar',
      desc: 'Intimate subterranean vaulted cellar with 4,000 vintage labels & sommelier pairing.',
      hours: '19:00 – 23:00',
      dressCode: 'Formal'
    },
    {
      name: 'In-Suite Private Chef',
      desc: 'Exclusive culinary theater: Executive Chef prepares a 5-course degustation in your suite.',
      hours: 'By Appointment',
      dressCode: 'Private Sanctuary'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRes: TableReservation = {
      id: `res-${Date.now()}`,
      reservationCode: code,
      guestName,
      roomNumber: roomNumber.trim() || undefined,
      contactPhone,
      venue,
      date: `${date}, ${time}`,
      time,
      guestsCount,
      occasion,
      specialRequests: specialRequests.trim() || undefined,
      status: 'Confirmed',
      createdAt: 'Just now'
    };

    onAddReservation(newRes);
    setConfirmationNotice(`Reservation ${code} confirmed at ${venue}.`);
    setTimeout(() => {
      setConfirmationNotice(null);
    }, 6000);
  };

  return (
    <div className="space-y-12 pb-24">
      
      {/* Header */}
      <div className="border-b border-stone-800 pb-6">
        <div className="text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
          Fine Dining & Experiences
        </div>
        <h1 className="text-3xl sm:text-4xl font-luxury font-bold text-stone-100 mt-1">
          Table & In-Suite Private Dining Reservations
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Reserve an exquisite table at our award-winning venues or book an executive chef in-suite degustation.
        </p>
      </div>

      {confirmationNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{confirmationNotice}</span>
        </div>
      )}

      {/* Venues Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {venuesList.map((v) => (
          <div
            key={v.name}
            onClick={() => setVenue(v.name as TableReservation['venue'])}
            className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
              venue === v.name
                ? 'bg-[#181d28] border-[#d4af37] shadow-lg ring-1 ring-[#d4af37]'
                : 'bg-[#11141a] border-stone-800 hover:border-stone-700'
            }`}
          >
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-base font-luxury font-bold text-stone-100">
                  {v.name}
                </h3>
                {venue === v.name && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                {v.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-800/80 mt-4 space-y-1 text-[11px] text-stone-400">
              <div>Hours: <span className="text-stone-300 font-medium">{v.hours}</span></div>
              <div>Attire: <span className="text-stone-300 font-medium">{v.dressCode}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Reservation Booking Form & Existing Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Container (2 cols) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-[#11141a] border border-stone-800 space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h2 className="text-xl font-luxury font-bold text-stone-100">
              Confirm Your Dining Reservation
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Zero upfront booking fee. Priority access for registered Solis Grand hotel guests.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 font-medium mb-1.5">Guest Full Name</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-medium mb-1.5">Room / Suite No. (If Resident)</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. Suite 704"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-stone-400 font-medium mb-1.5">Date</label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Tonight">Tonight</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Friday Evening">Friday Evening</option>
                  <option value="Saturday Evening">Saturday Evening</option>
                  <option value="Sunday Brunch">Sunday Brunch</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 font-medium mb-1.5">Seating Time</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="18:00">18:00 (Early Dinner)</option>
                  <option value="19:00">19:00 (Prime Seating)</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30 (Sunset View)</option>
                  <option value="21:30">21:30 (Late Seating)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 font-medium mb-1.5">Party Size</label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 font-medium mb-1.5">Dining Occasion</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value as TableReservation['occasion'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Casual Dining">Casual Dining</option>
                  <option value="Anniversary">Anniversary Celebration</option>
                  <option value="Business Dinner">Business Dinner</option>
                  <option value="Honeymoon">Honeymoon Romantic Dinner</option>
                  <option value="Private Celebration">Private Celebration</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 font-medium mb-1.5">Contact Phone / Extension</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 font-medium mb-1.5">
                Special Table Location, Allergies or Sommelier Requests
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={2}
                placeholder="e.g. Corner alcove table, celebration champagne on arrival, shellfish allergy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-[0.98] text-stone-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-stone-950" />
              Complete Reservation (Guaranteed Without Deposit)
            </button>
          </form>
        </div>

        {/* Existing Guest Reservations (1 col) */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#11141a] border border-stone-800 space-y-4">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="text-base font-luxury font-bold text-stone-100">
                Your Confirmed Tables
              </h3>
              <p className="text-[11px] text-stone-400">
                Manage your hotel dining reservations
              </p>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-500">
                No active reservations found.
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-stone-100">
                          {res.venue}
                        </div>
                        <div className="text-[11px] text-[#d4af37] font-mono font-semibold">
                          {res.reservationCode}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                        {res.status}
                      </span>
                    </div>

                    <div className="text-stone-300 flex items-center gap-2 text-[11px]">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{res.date}</span>
                      <span>·</span>
                      <Users className="w-3 h-3 text-stone-400" />
                      <span>{res.guestsCount} guests</span>
                    </div>

                    <div className="text-[11px] text-stone-400">
                      Guest: {res.guestName} {res.roomNumber && `(${res.roomNumber})`}
                    </div>

                    {res.specialRequests && (
                      <div className="text-[11px] text-stone-400 italic pt-1 border-t border-stone-800/60">
                        &quot;{res.specialRequests}&quot;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Concierge Desk Support */}
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs space-y-2">
            <div className="font-bold text-stone-200">
              Private Dining & Special Events
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              For gatherings exceeding 12 guests or bespoke wine cellar tastings with Head Sommelier, please contact the Maitre d&apos; directly at Extension 7020.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
