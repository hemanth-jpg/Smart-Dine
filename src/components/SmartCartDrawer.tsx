import React, { useState } from 'react';
import { OrderItemDetail, SmartDineOrder, BillingOption } from '../types/hotel';
import { sound } from '../utils/audio';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  CheckCircle2, 
  UtensilsCrossed, 
  BedDouble, 
  Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItemDetail[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onPlaceOrder: (order: SmartDineOrder) => void;
  currentTable: string;
  currentRoom: string;
  guestName: string;
}

export const SmartCartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  currentTable,
  currentRoom,
  guestName,
}) => {
  if (!isOpen) return null;

  const [billingOption, setBillingOption] = useState<BillingOption>('table_folio');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const total = subtotal;

  const handleFireOrder = () => {
    if (cartItems.length === 0) return;
    sound.playOrderChime();

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const summary = cartItems.map((i) => `${i.item.name} ×${i.quantity}`).join(', ');

    const newOrder: SmartDineOrder = {
      id: `ORD-${randomSuffix}`,
      table: currentTable,
      roomNumber: currentRoom,
      guestName,
      deliveryMode: 'table',
      itemsCount: cartItems.reduce((sum, i) => sum + i.quantity, 0),
      itemsSummary: summary,
      detailedItems: [...cartItems],
      amount: total,
      status: 'New',
      payment: billingOption === 'charge_to_room' ? 'Charged to Folio' : 'Pending',
      billingOption,
      age: '00 min',
      timestamp: Date.now(),
      specialNotes: deliveryNotes.trim() || undefined,
    };

    onPlaceOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0a0d14] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-luxury font-bold text-white">
                  Table Order Tray
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4af37] text-stone-950 font-bold">
                  {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                Ordering for <b className="text-white">Table {currentTable}</b> · {currentRoom}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="text-center py-20 text-stone-500 text-xs space-y-2">
              <UtensilsCrossed className="w-10 h-10 mx-auto text-stone-600" />
              <div>Your dining tray is empty.</div>
              <p className="text-[11px] text-stone-600">
                Browse our live menu and add items to order.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
              {cartItems.map((cartItem, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={cartItem.item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                      alt={cartItem.item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate">{cartItem.item.name}</div>
                      <div className="text-stone-400 text-[11px]">
                        ₹{cartItem.item.price} each
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white text-sm shrink-0">
                      ₹{cartItem.item.price * cartItem.quantity}
                    </span>
                  </div>

                  {cartItem.spiceLevel && (
                    <div className="text-[11px] text-[#d4af37] font-medium">
                      Spice: {cartItem.spiceLevel}
                    </div>
                  )}

                  {cartItem.doneness && (
                    <div className="text-[11px] text-amber-400 font-medium">
                      Doneness: {cartItem.doneness}
                    </div>
                  )}

                  {cartItem.specialInstructions && (
                    <div className="text-[11px] text-stone-400 italic">
                      &quot;{cartItem.specialInstructions}&quot;
                    </div>
                  )}

                  {/* Quantity and Delete */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { sound.playTick(); onUpdateQuantity(idx, cartItem.quantity - 1); }}
                        className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold w-4 text-center text-white">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => { sound.playTick(); onUpdateQuantity(idx, cartItem.quantity + 1); }}
                        className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => { sound.playTick(); onRemoveItem(idx); }}
                      className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions & Zero-Payment Settlement */}
        {cartItems.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-white/10">
            
            {/* Settlement Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                <span>Settlement Protocol</span>
                <span className="text-[#d4af37] flex items-center gap-1 font-normal">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Zero Online Payment
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  billingOption === 'table_folio' ? 'bg-[#d4af37]/10 border-[#d4af37] text-white' : 'bg-white/5 border-white/10 text-stone-400'
                }`}>
                  <input
                    type="radio"
                    name="billing"
                    checked={billingOption === 'table_folio'}
                    onChange={() => setBillingOption('table_folio')}
                    className="mt-0.5 accent-[#d4af37]"
                  />
                  <div>
                    <div className="font-bold text-white">Table Check / Cash to Waiter</div>
                    <div className="text-[10px] text-stone-400">Settle directly with your server when finished</div>
                  </div>
                </label>

                <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  billingOption === 'charge_to_room' ? 'bg-[#d4af37]/10 border-[#d4af37] text-white' : 'bg-white/5 border-white/10 text-stone-400'
                }`}>
                  <input
                    type="radio"
                    name="billing"
                    checked={billingOption === 'charge_to_room'}
                    onChange={() => setBillingOption('charge_to_room')}
                    className="mt-0.5 accent-[#d4af37]"
                  />
                  <div>
                    <div className="font-bold text-white">Post to Hotel Room Folio</div>
                    <div className="text-[10px] text-stone-400">Automatically added to {currentRoom} checkout folio</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Total */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="text-white font-mono">₹{subtotal}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-white pt-1 border-t border-white/10">
                <span>Total Amount Due</span>
                <span className="text-lg font-mono text-[#d4af37]">₹{total}</span>
              </div>
            </div>

            {/* Fire Order Button */}
            <button
              onClick={handleFireOrder}
              className="w-full py-3.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Fire Order to Kitchen Line</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
