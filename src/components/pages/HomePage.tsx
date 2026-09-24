import React from 'react';
import { MenuItem, CartItem } from '../../types/hotel';
import { CulinaryVisual } from '../CulinaryVisual';
import { 
  Clock, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Utensils, 
  Wine, 
  ConciergeBell,
  BedDouble,
  CheckCircle
} from 'lucide-react';
import { PageTab } from '../Header';

interface Props {
  onNavigate: (tab: PageTab) => void;
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  featuredItems: MenuItem[];
  currentRoom: string;
  onChangeRoom: (room: string) => void;
}

export const HomePage: React.FC<Props> = ({
  onNavigate,
  onSelectItem,
  onQuickAdd,
  featuredItems,
  currentRoom,
  onChangeRoom,
}) => {
  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Showcase */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#161a22] via-[#101319] to-[#0b0d11] border border-stone-800/80 p-8 sm:p-12 lg:p-16">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Solis Grand Luxury In-Room Dining</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-luxury font-bold text-stone-100 leading-tight tracking-tight text-balance">
            Haute Cuisine Delivered Directly to Your Suite.
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
            Savor Michelin-caliber dishes prepared by Executive Chef Laurent Mercier. 
            Delivered under polished silver cloches to your private sanctuary in under 30 minutes, 
            with zero payment hassle—all orders post automatically to your room folio.
          </p>

          {/* Quick Room Verification Input */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center gap-3 p-2 bg-stone-900/90 rounded-2xl border border-stone-700/70 max-w-md w-full">
              <div className="flex items-center gap-2 pl-3 text-xs text-stone-400">
                <BedDouble className="w-4 h-4 text-[#d4af37]" />
                <span className="whitespace-nowrap">Your Room:</span>
              </div>
              <input
                type="text"
                value={currentRoom}
                onChange={(e) => onChangeRoom(e.target.value)}
                placeholder="e.g. Suite 704"
                className="flex-1 min-w-[120px] bg-transparent text-stone-100 text-sm font-semibold focus:outline-none placeholder:text-stone-500"
              />
              <button
                onClick={() => onNavigate('menu')}
                className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 text-xs font-bold transition-all whitespace-nowrap"
              >
                Start In-Room Order
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-400 mt-2 pl-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero credit cards needed · Settled seamlessly at front desk checkout</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('menu')}
              className="px-6 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 font-bold text-sm transition-all shadow-md flex items-center gap-2"
            >
              <Utensils className="w-4 h-4" />
              Browse Dining Menu
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('reservations')}
              className="px-6 py-3.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 font-semibold text-sm transition-all flex items-center gap-2"
            >
              <Wine className="w-4 h-4 text-[#d4af37]" />
              Reserve Table or Private Chef
            </button>

            <button
              onClick={() => onNavigate('tracking')}
              className="px-4 py-3.5 text-xs text-stone-400 hover:text-stone-200 transition-colors flex items-center gap-1.5"
            >
              <ConciergeBell className="w-4 h-4 text-stone-400" />
              Track Existing Order
            </button>
          </div>
        </div>
      </section>

      {/* 2. Hotel Service Standards (3-Column Value Proposition) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#11141b] border border-stone-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-luxury font-bold text-stone-100">
            Guaranteed 30-Minute Dispatch
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed">
            Every dish is prepared freshly to order in our primary executive kitchen and dispatched immediately with insulated cloche domes to preserve temperature and crispness.
          </p>
          <div className="text-[11px] text-stone-500 font-medium pt-1">
            Track live kitchen and butler status in real time.
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#11141b] border border-stone-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-luxury font-bold text-stone-100">
            Frictionless Room Folio Settlement
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed">
            No upfront credit cards, gateways, or payment terminal delays. All dining charges are automatically linked to your verified guest suite ledger.
          </p>
          <div className="text-[11px] text-stone-500 font-medium pt-1">
            Executive Club perks & suite breakfast vouchers apply automatically.
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#11141b] border border-stone-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8]">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-base font-luxury font-bold text-stone-100">
            Dedicated Floor Butler Service
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed">
            White-glove in-suite table arrangement, custom linen place settings, wine uncorking, and prompt post-meal tray retrieval whenever requested.
          </p>
          <div className="text-[11px] text-stone-500 font-medium pt-1">
            Private dining arrangements available upon request.
          </div>
        </div>
      </section>

      {/* 3. Executive Chef's Curated Signatures Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
              Seasonal Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-luxury font-bold text-stone-100 mt-1">
              Executive Chef Laurent Mercier&apos;s Signatures
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-semibold text-[#d4af37] hover:text-[#e0be4d] transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            View Complete In-Room Menu
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-[#11141a] border border-stone-800/80 overflow-hidden hover:border-stone-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <CulinaryVisual item={item} className="h-48" />

                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-luxury font-bold text-stone-100 group-hover:text-[#d4af37] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-base font-semibold tabular-nums text-stone-200">
                      ${item.price}
                    </span>
                  </div>

                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-stone-500">
                    {item.dietaryTags && item.dietaryTags.map((tag: string, idx: number) => (
                      <span key={tag}>
                        {tag}{idx < (item.dietaryTags?.length ?? 1) - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectItem(item)}
                  className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-800 transition-colors text-center"
                >
                  Customize Dish
                </button>
                <button
                  type="button"
                  onClick={() => onQuickAdd(item)}
                  className="py-2 px-3 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 text-xs font-bold transition-all whitespace-nowrap shadow-sm"
                >
                  Quick Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Dining Schedule & Room Service Periods */}
      <section className="p-8 rounded-2xl bg-[#11141a] border border-stone-800 space-y-6">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
            24-Hour Hospitality
          </div>
          <h2 className="text-xl sm:text-2xl font-luxury font-bold text-stone-100 mt-1">
            Service Windows & Specialty Kitchens
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Our culinary team operates around the clock to cater to international travelers and bespoke suite requests.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/80 space-y-2">
            <div className="text-xs font-bold text-amber-400">Sunrise & Artisan Breakfast</div>
            <div className="text-sm font-semibold text-stone-200 tabular-nums">06:00 – 11:00 Daily</div>
            <p className="text-[11px] text-stone-400">
              Freshly baked Parisian viennoiseries, poached cage-free eggs, cold-pressed citrus, and hand-brewed coffee.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/80 space-y-2">
            <div className="text-xs font-bold text-[#38bdf8]">All-Day Haute Cuisine</div>
            <div className="text-sm font-semibold text-stone-200 tabular-nums">11:00 – 23:00 Daily</div>
            <p className="text-[11px] text-stone-400">
              Prime wagyu cuts, handmade saffron pastas, artisan club classics, and sommelier reserve selections.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800/80 space-y-2">
            <div className="text-xs font-bold text-rose-400">Late Night & Nightcap Lounge</div>
            <div className="text-sm font-semibold text-stone-200 tabular-nums">23:00 – 06:00 Daily</div>
            <p className="text-[11px] text-stone-400">
              Artisan affineur cheese boards, warm Valrhona chocolate soufflés, comfort soups, and herbal nighttime infusions.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Concierge & Butler Assurance Note */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-[#141820] to-stone-900 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
            <ConciergeBell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-luxury font-bold text-stone-100">
              Have Specific Dietary Needs or Private Chef Requests?
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Contact your 24/7 dedicated floor concierge directly at Extension 7000 or dial &apos;0&apos; from your room handset.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('reservations')}
          className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors whitespace-nowrap"
        >
          Book Private In-Suite Dining
        </button>
      </section>

    </div>
  );
};
