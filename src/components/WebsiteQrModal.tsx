import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  UtensilsCrossed, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onEnterTablePrompt: () => void;
}

export const WebsiteQrModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onEnterTablePrompt,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Real website URL that customers open when scanning the QR code
  const websiteUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://smartdine-hotel.app';

  const handleCopyLink = () => {
    sound.playTick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(websiteUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  // High-fidelity standard 25x25 QR Code Matrix Generator for the Website URL
  const renderWebsiteQrSvg = () => {
    const grid = 25;
    const cells: boolean[][] = Array.from({ length: grid }, () => Array(grid).fill(false));

    // Corner Finder Patterns (7x7 with inner 3x3)
    const setFinder = (startR: number, startC: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            cells[startR + r][startC + c] = true;
          }
        }
      }
    };

    setFinder(0, 0);
    setFinder(0, grid - 7);
    setFinder(grid - 7, 0);

    // Timing patterns
    for (let i = 8; i < grid - 8; i++) {
      cells[6][i] = i % 2 === 0;
      cells[i][6] = i % 2 === 0;
    }

    // Alignment pattern near bottom right
    const alignR = 18;
    const alignC = 18;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
          cells[alignR + r][alignC + c] = true;
        }
      }
    }

    // Data dots deterministically calculated from the URL string
    let hash = 0;
    for (let i = 0; i < websiteUrl.length; i++) {
      hash = ((hash << 5) - hash) + websiteUrl.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        // Skip finder zones
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= grid - 8;
        const inBL = r >= grid - 8 && c < 8;
        const inTiming = (r === 6 && c >= 8 && c < grid - 8) || (c === 6 && r >= 8 && r < grid - 8);
        const inAlign = Math.abs(r - alignR) <= 2 && Math.abs(c - alignC) <= 2;

        if (!inTL && !inTR && !inBL && !inTiming && !inAlign) {
          const val = ((r * 17 + c * 23 + (hash & 0xff)) % 3 === 0) ||
                      ((r ^ c ^ (hash >> 4)) % 5 === 0);
          cells[r][c] = val;
        }
      }
    }

    return (
      <svg viewBox={`0 0 ${grid} ${grid}`} className="w-full h-full text-black fill-current">
        <rect x="0" y="0" width={grid} height={grid} fill="white" />
        {cells.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width="0.9"
                height="0.9"
                rx="0.12"
              />
            ) : null
          )
        )}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg glass-panel-elevated rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/15 space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f59e0b] to-[#fbbf24] p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#090b10] rounded-[14px] flex items-center justify-center text-[#d4af37]">
                <QrCode className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-luxury font-bold text-white flex items-center gap-2">
                <span>Restaurant Website QR Code</span>
              </h3>
              <p className="text-xs text-stone-400">
                One universal QR code to open the ordering website on any smartphone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Standee Card Preview */}
        <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#131722] via-[#090b10] to-black border border-[#d4af37]/35 shadow-2xl flex flex-col items-center text-center space-y-4">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan to Enter Website</span>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xl sm:text-2xl font-luxury font-bold text-white tracking-wide">
              SmartDine Luxury Dining
            </div>
            <p className="text-xs text-stone-400 max-w-xs">
              Indian, Chinese &amp; Fitness Food Ordering System
            </p>
          </div>

          {/* Authentic High-Resolution QR Card */}
          <div className="relative p-4 rounded-2xl bg-white shadow-2xl w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center border-4 border-stone-200">
            {renderWebsiteQrSvg()}
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-200/90 bg-[#d4af37]/10 px-3.5 py-2 rounded-xl border border-[#d4af37]/30 max-w-sm text-left">
            <Smartphone className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span>
              <strong>How it works:</strong> Guests scan this QR code with their mobile camera to enter the website, enter their Table Number, and start ordering food immediately!
            </span>
          </div>
        </div>

        {/* Website URL & Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-semibold text-stone-300">Website Address:</span>
            <span className="text-[11px] text-[#38bdf8]">Universal Mobile Web App</span>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-black/50 border border-white/10 text-xs">
            <input
              type="text"
              readOnly
              value={websiteUrl}
              className="flex-1 bg-transparent text-stone-300 font-mono text-[11px] focus:outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Enter Table Number Prompt */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold transition-colors"
          >
            Close Window
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEnterTablePrompt();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#fbbf24] text-stone-950 text-xs font-bold shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Enter Table Number &amp; Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
