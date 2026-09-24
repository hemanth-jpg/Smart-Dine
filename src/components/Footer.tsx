import React from 'react';
import { PageTab } from './Header';
import { Hotel, Phone, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface Props {
  onNavigate: (tab: PageTab) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#0a0c10] border-t border-stone-800 text-stone-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-3">
            <div className="text-lg font-luxury font-bold text-stone-100 flex items-center gap-2">
              <Hotel className="w-5 h-5 text-[#d4af37]" />
              Solis Grand Hotel
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Forbes Five-Star hospitality and Michelin-calibre culinary arts. 24-hour dedicated in-suite dining service.
            </p>
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>450 Grand Avenue, Harbor View Promenade</span>
            </div>
          </div>

          {/* Column 2: In-Room Dining Guidelines */}
          <div className="space-y-2">
            <h4 className="text-stone-200 font-semibold uppercase tracking-wider text-[11px]">
              Suite Dining Policy
            </h4>
            <ul className="space-y-1.5 text-stone-400 text-xs">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero upfront credit card needed</span>
              </li>
              <li>Billed directly to verified room folios</li>
              <li>All hot dishes served under heated cloches</li>
              <li>Tray clearance available 24/7 via tracker</li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-stone-200 font-semibold uppercase tracking-wider text-[11px]">
              Culinary Portals
            </h4>
            <ul className="space-y-1.5 text-stone-400 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Overview & Highlights
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('menu')} 
                  className="hover:text-[#d4af37] transition-colors"
                >
                  In-Room Haute Cuisine Menu
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('tracking')} 
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Live Butler Tracking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('kitchen')} 
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Kitchen KDS & Hotel Management
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('reservations')} 
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Table & Suite Reservations
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Concierge & Butler Contacts */}
          <div className="space-y-2">
            <h4 className="text-stone-200 font-semibold uppercase tracking-wider text-[11px]">
              Direct In-House Dialing
            </h4>
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex items-center gap-2 text-stone-300">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="font-semibold">Dial &apos;0&apos; or Ext. 7000</span> (Concierge)
              </div>
              <div>Ext. 7040 — Executive Kitchen Hot Line</div>
              <div>Ext. 7020 — Maitre d&apos; & Sommelier Cellar</div>
              <div className="flex items-center gap-1.5 text-stone-500 pt-1 text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>Executive Service: 24 Hours Daily</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} Solis Grand Hotel & Resort. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>In-Room Dining Protocol</span>
            <span>·</span>
            <span>Food & Beverage Folio Billing</span>
            <span>·</span>
            <span>Dietary & Allergen Certification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
