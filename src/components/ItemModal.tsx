import React, { useState } from 'react';
import { MenuItem, CartItem } from '../types/hotel';
import { X, Plus, Minus, Check, Clock, AlertCircle } from 'lucide-react';
import { CulinaryVisual } from './CulinaryVisual';

interface Props {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ItemModal: React.FC<Props> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [doneness, setDoneness] = useState<string>(
    item.name.toLowerCase().includes('wagyu') || item.name.toLowerCase().includes('steak') 
      ? 'Medium Rare' 
      : item.name.toLowerCase().includes('burger') 
        ? 'Medium' 
        : ''
  );
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [cutleryCount, setCutleryCount] = useState(1);

  const needsDoneness = item.name.toLowerCase().includes('wagyu') ||
    item.name.toLowerCase().includes('steak') ||
    item.name.toLowerCase().includes('burger');

  const handleAdd = () => {
    onAddToCart({
      item,
      quantity,
      doneness: needsDoneness ? doneness : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      cutleryCount
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#12151b] border border-stone-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-stone-400 hover:text-stone-100 hover:bg-black/90 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual header */}
        <CulinaryVisual item={item} className="h-44" />

        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-luxury font-bold text-stone-100">
                {item.name}
              </h2>
              <span className="text-xl font-semibold tabular-nums text-[#d4af37]">
                ${item.price}
              </span>
            </div>
            <p className="mt-2 text-sm text-stone-300 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Ingredients & Pairings */}
          <div className="p-3.5 bg-stone-900/80 rounded-xl border border-stone-800/80 space-y-2 text-xs">
            <div className="text-stone-400">
              <span className="text-stone-300 font-semibold">Ingredients: </span>
              {item.ingredients ? item.ingredients.join(', ') : 'Fresh seasonal selection'}
            </div>
            {item.pairingNote && (
              <div className="text-[#d4af37]/90 italic">
                <span className="font-semibold text-[#d4af37]">Sommelier Note: </span>
                {item.pairingNote}
              </div>
            )}
          </div>

          {/* Doneness Options if applicable */}
          {needsDoneness && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Temperature / Doneness
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {['Rare', 'Medium Rare', 'Medium', 'Well Done'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDoneness(level)}
                    className={`py-2 px-2 rounded-lg border text-center transition-all ${
                      doneness === level
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-semibold'
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cutlery Sets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Silverware & Place Settings
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCutleryCount(num)}
                  className={`flex-1 py-2 text-xs rounded-lg border transition-all ${
                    cutleryCount === num
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-semibold'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </button>
              ))}
            </div>
          </div>

          {/* Special Preparation Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Special Chef Instructions & Allergies
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Dressing on the side, extra warm cloche, nut allergy alert..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-200 text-xs placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Order Quantity
            </div>
            <div className="flex items-center gap-3 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-stone-400 hover:text-stone-100 transition-colors p-1"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center tabular-nums text-sm font-bold text-stone-100">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="text-stone-400 hover:text-stone-100 transition-colors p-1"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-stone-400">Total Billed to Room</div>
            <div className="text-xl font-bold tabular-nums text-[#d4af37]">
              ${item.price * quantity}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 px-5 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-[0.98] text-stone-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 text-stone-950" />
            Add to Room Service Tray
          </button>
        </div>
      </div>
    </div>
  );
};
