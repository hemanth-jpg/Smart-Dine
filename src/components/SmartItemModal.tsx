import React, { useState } from 'react';
import { SmartMenuItem, OrderItemDetail } from '../types/hotel';
import { sound } from '../utils/audio';
import { 
  X, 
  Plus, 
  Minus, 
  Flame, 
  Clock, 
  Utensils, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  item: SmartMenuItem | null;
  onClose: () => void;
  onAddToCart: (detail: OrderItemDetail) => void;
}

export const SmartItemModal: React.FC<Props> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Hot' | 'Chef Authentic'>('Medium');
  const [doneness, setDoneness] = useState<string>('Medium Rare');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [cutleryCount, setCutleryCount] = useState(1);

  const isMeatOrSteak = item.name.toLowerCase().includes('wagyu') || 
                        item.name.toLowerCase().includes('steak') || 
                        item.name.toLowerCase().includes('tenderloin');

  const dishImage = item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    onAddToCart({
      item,
      quantity,
      spiceLevel: !isMeatOrSteak ? spiceLevel : undefined,
      doneness: isMeatOrSteak ? doneness : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      cutleryCount,
    });
    onClose();
  };

  const totalPrice = item.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg glass-panel-elevated rounded-3xl shadow-2xl border border-white/10 max-h-[92vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Image */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-stone-900 shrink-0">
          <img
            src={dishImage}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-black/40 to-black/60 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              sound.playTick();
              onClose();
            }}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 backdrop-blur-md text-stone-300 hover:text-white border border-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category & Rating Badges */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-xs text-stone-200">
              <span className={`w-2 h-2 rounded-full ${item.type === 'Veg' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span className="font-semibold text-[11px]">{item.type}</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-300 text-[11px]">{item.category}</span>
            </div>

            {item.rating && (
              <div className="flex items-center gap-1 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[11px] text-amber-300 font-semibold tabular-nums">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>{item.rating}</span>
              </div>
            )}
          </div>

          {/* Title & Price overlay */}
          <div className="absolute bottom-3 left-5 right-5 z-10 flex items-baseline justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-luxury font-bold text-white drop-shadow-md">
              {item.name}
            </h2>
            <div className="text-xl font-bold font-mono text-[#d4af37] shrink-0 drop-shadow">
              ₹{item.price}
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <p className="text-xs text-stone-300 leading-relaxed">
            {item.description}
          </p>

          {item.ingredients && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-400">
              <span className="text-stone-300 font-semibold">Ingredients: </span>
              {item.ingredients.join(', ')}
            </div>
          )}

          <form onSubmit={handleConfirm} className="space-y-5 text-xs">
            
            {/* Spice Level */}
            {!isMeatOrSteak && (
              <div className="space-y-2">
                <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Spice Level Preference</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Mild', 'Medium', 'Hot', 'Chef Authentic'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        sound.playTick();
                        setSpiceLevel(lvl);
                      }}
                      className={`py-2 px-1 rounded-xl text-center font-medium transition-all border cursor-pointer ${
                        spiceLevel === lvl
                          ? 'bg-[#d4af37] text-stone-950 border-[#d4af37] font-bold shadow-sm'
                          : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Meat Doneness */}
            {isMeatOrSteak && (
              <div className="space-y-2">
                <label className="text-stone-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Steak Temperature / Doneness</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Rare', 'Medium Rare', 'Medium', 'Well Done'].map((dn) => (
                    <button
                      key={dn}
                      type="button"
                      onClick={() => {
                        sound.playTick();
                        setDoneness(dn);
                      }}
                      className={`py-2 px-1 rounded-xl text-center font-medium transition-all border cursor-pointer ${
                        doneness === dn
                          ? 'bg-[#d4af37] text-stone-950 border-[#d4af37] font-bold shadow-sm'
                          : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {dn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cutlery Count */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-stone-400" />
                <span className="text-stone-300 font-semibold">Cutlery / Fork Sets</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTick();
                    setCutleryCount(Math.max(1, cutleryCount - 1));
                  }}
                  className="w-7 h-7 rounded-lg bg-white/10 text-stone-300 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-white w-6 text-center">{cutleryCount}</span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playTick();
                    setCutleryCount(cutleryCount + 1);
                  }}
                  className="w-7 h-7 rounded-lg bg-white/10 text-stone-300 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-1.5">
              <label className="text-stone-300 font-semibold">Special Culinary Requests</label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Less oil, extra cilantro, sauce on the side..."
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Quantity and Submit */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    sound.playTick();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  className="w-8 h-8 rounded-lg bg-white/10 text-stone-300 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-white text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playTick();
                    setQuantity(quantity + 1);
                  }}
                  className="w-8 h-8 rounded-lg bg-white/10 text-stone-300 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                className="flex-1 py-3 px-5 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 text-xs font-bold transition-all shadow-lg flex items-center justify-between cursor-pointer"
              >
                <span>Add to Order Tray</span>
                <span className="font-mono text-sm font-extrabold">₹{totalPrice}</span>
              </button>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};
