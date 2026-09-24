import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Sparkles, 
  ArrowRight, 
  Check, 
  BedDouble, 
  User, 
  Hash, 
  QrCode,
  BellRing,
  X
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  currentTable: string;
  currentRoom: string;
  guestName: string;
  onConfirmTable: (table: string, room: string, guestName: string) => void;
  canClose?: boolean;
}

export const TableEntryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentTable,
  currentRoom,
  guestName: initialGuestName,
  onConfirmTable,
  canClose = true,
}) => {
  const [tableInput, setTableInput] = useState(currentTable || '07');
  const [roomInput, setRoomInput] = useState(currentRoom || 'Suite 704');
  const [nameInput, setNameInput] = useState(initialGuestName || 'Guest');
  const [hasRoom, setHasRoom] = useState(Boolean(currentRoom));

  if (!isOpen) return null;

  const quickTables = [
    '01', '02', '03', '04', '05', '06', 
    '07', '08', '09', '10', '11', '12', 
    '14', '15', '18', '20', '22', '24'
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalTable = tableInput.trim() || '07';
    const finalRoom = hasRoom ? (roomInput.trim() || 'Suite 704') : 'Walk-in Table';
    const finalName = nameInput.trim() || 'Guest';

    // Play audible alert alarm tone to signal table activation
    sound.playAlarm();
    onConfirmTable(finalTable, finalRoom, finalName);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg glass-panel-elevated rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SmartDine Fine Dining</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-luxury font-bold text-white tracking-tight">
              Enter Your Table Number
            </h2>
            <p className="text-xs text-stone-300">
              Welcome to the website! Enter your table number below to open our live Indian, Chinese &amp; Fitness food menu.
            </p>
          </div>

          {canClose && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Table Input */}
          <div className="space-y-3">
            <label className="flex items-center justify-between text-xs text-stone-200 font-semibold">
              <span className="flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-[#d4af37]" />
                <span>Your Table Number:</span>
              </span>
              <span className="text-[11px] text-[#d4af37] font-mono">Required to Order</span>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                <Hash className="w-5 h-5 text-[#d4af37]" />
              </div>
              <input
                type="text"
                autoFocus
                value={tableInput}
                onChange={(e) => setTableInput(e.target.value)}
                placeholder="e.g. 07 or Table 12"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/60 border-2 border-[#d4af37]/60 text-white font-mono text-lg font-bold placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/30 transition-all shadow-inner"
              />
            </div>

            {/* Quick 1-Tap Table Presets */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] text-stone-400 flex items-center justify-between">
                <span>Or tap your table number directly:</span>
                <span className="text-stone-500 font-mono">18 Dining Tables</span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-6 gap-1.5">
                {quickTables.map((t) => {
                  const isSelected = tableInput === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        sound.playTick();
                        setTableInput(t);
                      }}
                      className={`py-2 px-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#d4af37] text-stone-950 shadow-md scale-105 border border-[#d4af37]'
                          : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Hotel In-House Guest Toggle (Room / Suite) */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-stone-200 font-semibold cursor-pointer">
                <BedDouble className="w-4 h-4 text-[#38bdf8]" />
                <span>Are you staying in a Hotel Room / Suite?</span>
              </label>
              <input
                type="checkbox"
                checked={hasRoom}
                onChange={(e) => setHasRoom(e.target.checked)}
                className="w-4 h-4 accent-[#38bdf8] cursor-pointer rounded"
              />
            </div>

            {hasRoom && (
              <div className="space-y-2 pt-2 animate-in fade-in duration-150">
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value)}
                  placeholder="e.g. Suite 704 or Deluxe 318"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-[#38bdf8]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Suite 704', 'Suite 802', 'Deluxe 318', 'Penthouse 1402'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRoomInput(s)}
                      className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                        roomInput === s
                          ? 'bg-[#38bdf8] text-black font-bold'
                          : 'bg-white/5 text-stone-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Guest Name Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs text-stone-300 font-semibold">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>Guest Name (For your order folio):</span>
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Lady Eleanor Vance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Action Button: Enter Webpage of Food */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#fbbf24] text-stone-950 font-luxury font-bold text-sm sm:text-base shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span>Enter Webpage of Food &amp; Start Ordering</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[11px] text-center text-stone-400">
            🔔 An alert chime &amp; alarm will confirm your table activation upon entering.
          </p>
        </form>

      </div>
    </div>
  );
};
