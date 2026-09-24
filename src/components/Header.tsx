import React from 'react';
import { ShoppingBag, BellRing, UtensilsCrossed } from 'lucide-react';

export type PageTab = 'home' | 'menu' | 'tracking' | 'kitchen' | 'reservations';

interface Props {
  activeTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  currentRoom: string;
  activeOrdersCount: number;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  cartCount,
  cartTotal,
  onOpenCart,
  currentRoom,
  activeOrdersCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0d11]/95 backdrop-blur-md border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => onSelectTab('home')}
          className="text-xl sm:text-2xl font-luxury font-bold tracking-tight text-[#f3f4f7] hover:text-[#d4af37] transition-colors text-left shrink-0"
        >
          Solis Grand Dining
        </button>

        {/* Zone 2: 5 clean text navigation links with active underlines */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors relative py-1 whitespace-nowrap ${
              activeTab === 'home'
                ? 'text-[#f3f4f7] font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Overview
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4af37]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('menu')}
            className={`transition-colors relative py-1 whitespace-nowrap ${
              activeTab === 'menu'
                ? 'text-[#f3f4f7] font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            In-Room Menu
            {activeTab === 'menu' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4af37]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('tracking')}
            className={`transition-colors relative py-1 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tracking'
                ? 'text-[#f3f4f7] font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Live Tracking
            {activeOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
            {activeTab === 'tracking' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4af37]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('kitchen')}
            className={`transition-colors relative py-1 whitespace-nowrap ${
              activeTab === 'kitchen'
                ? 'text-[#f3f4f7] font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Kitchen Console
            {activeTab === 'kitchen' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4af37]" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('reservations')}
            className={`transition-colors relative py-1 whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'text-[#f3f4f7] font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Table Booking
            {activeTab === 'reservations' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4af37]" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary action controls */}
        <div className="flex items-center gap-3">
          {/* Room quick chip */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-300 bg-stone-900/90 px-3 py-1.5 rounded-lg border border-stone-800">
            <span className="text-stone-500 font-normal">Folio:</span>
            <span className="font-semibold text-stone-200">{currentRoom}</span>
          </div>

          {/* Cart trigger button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-stone-900 bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 transition-all rounded-lg whitespace-nowrap shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-stone-950" />
            <span className="font-semibold text-stone-950">Room Tray</span>
            {cartCount > 0 && (
              <span className="bg-stone-950 text-stone-100 text-xs px-1.5 py-0.2 rounded-full tabular-nums font-bold">
                {cartCount}
              </span>
            )}
            {cartTotal > 0 && (
              <span className="hidden sm:inline-block pl-1 border-l border-stone-800/40 text-xs tabular-nums font-semibold text-stone-950">
                ${cartTotal}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile sub-row navigation tabs for smaller screens */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 border-t border-stone-800/60 overflow-x-auto text-xs gap-4">
        <button
          onClick={() => onSelectTab('home')}
          className={`whitespace-nowrap px-2 py-1 ${activeTab === 'home' ? 'text-[#d4af37] font-semibold' : 'text-stone-400'}`}
        >
          Overview
        </button>
        <button
          onClick={() => onSelectTab('menu')}
          className={`whitespace-nowrap px-2 py-1 ${activeTab === 'menu' ? 'text-[#d4af37] font-semibold' : 'text-stone-400'}`}
        >
          Menu
        </button>
        <button
          onClick={() => onSelectTab('tracking')}
          className={`whitespace-nowrap px-2 py-1 flex items-center gap-1 ${activeTab === 'tracking' ? 'text-[#d4af37] font-semibold' : 'text-stone-400'}`}
        >
          Live Tracking
          {activeOrdersCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
        </button>
        <button
          onClick={() => onSelectTab('kitchen')}
          className={`whitespace-nowrap px-2 py-1 ${activeTab === 'kitchen' ? 'text-[#d4af37] font-semibold' : 'text-stone-400'}`}
        >
          Kitchen KDS
        </button>
        <button
          onClick={() => onSelectTab('reservations')}
          className={`whitespace-nowrap px-2 py-1 ${activeTab === 'reservations' ? 'text-[#d4af37] font-semibold' : 'text-stone-400'}`}
        >
          Reservations
        </button>
      </div>
    </header>
  );
};
