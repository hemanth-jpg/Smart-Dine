import React, { useState } from 'react';
import { CartItem, DeliveryType, BillingOption, HotelOrder } from '../types/hotel';
import { X, Trash2, Plus, Minus, ShieldCheck, CheckCircle2, BedDouble, UtensilsCrossed, Hotel } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onPlaceOrder: (order: HotelOrder) => void;
  currentRoom: string;
  guestName: string;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  currentRoom,
  guestName,
}) => {
  if (!isOpen) return null;

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('room_service');
  const [roomNumber, setRoomNumber] = useState(currentRoom || 'Suite 704');
  const [guest, setGuest] = useState(guestName || 'Lord / Lady Guest');
  const [tableNumber, setTableNumber] = useState('Table 14 - Conservatory');
  const [billingOption, setBillingOption] = useState<BillingOption>('charge_to_room');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  // In luxury hotel dining: No hidden service fee or 0% complimentary room delivery
  const serviceCharge = 0;
  const total = subtotal + serviceCharge;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SLS-${randomSuffix}`;

    const newOrder: HotelOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: 'Just now',
      guestName: guest,
      roomNumber: deliveryType === 'room_service' ? roomNumber : 'Restaurant Area',
      deliveryType,
      tableOrCabanaNumber: deliveryType !== 'room_service' ? tableNumber : undefined,
      billingOption,
      items: [...cartItems],
      subtotal,
      serviceCharge: 0,
      total,
      status: 'received',
      estimatedDeliveryMinutes: 25,
      timeRemainingSeconds: 25 * 60,
      butlerName: 'Butler James Sterling',
      butlerPhone: 'Ext. 7001',
      notes: deliveryNotes.trim() || undefined
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onPlaceOrder(newOrder);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101319] border-l border-stone-800 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-[#131720]">
            <div>
              <h2 className="text-xl font-luxury font-bold text-stone-100 flex items-center gap-2">
                <Hotel className="w-5 h-5 text-[#d4af37]" />
                In-Room Dining Tray
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                {cartItems.length} {cartItems.length === 1 ? 'curated dish' : 'curated dishes'} selected
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-white/5 transition-colors"
              aria-label="Close tray"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto mb-4 text-stone-500">
                  <UtensilsCrossed className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-stone-200">Your Tray is Empty</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                  Explore our Executive Chef&apos;s creations and add gourmet dishes directly to your room service order.
                </p>
              </div>
            ) : (
              <>
                {/* Item List */}
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Selected Dishes
                  </span>
                  {cartItems.map((cartItem, idx) => (
                    <div
                      key={`${cartItem.item.id}-${idx}`}
                      className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-stone-100">
                            {cartItem.item.name}
                          </h4>
                          <span className="text-xs text-[#d4af37] font-medium tabular-nums">
                            ${cartItem.item.price} each
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(idx)}
                          className="text-stone-500 hover:text-rose-400 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customization specifics */}
                      {(cartItem.doneness || cartItem.specialInstructions) && (
                        <div className="text-xs text-stone-400 bg-black/30 px-2 py-1 rounded border border-white/5 space-y-0.5">
                          {cartItem.doneness && (
                            <div>
                              <span className="text-stone-500 font-medium">Doneness: </span>
                              {cartItem.doneness}
                            </div>
                          )}
                          {cartItem.specialInstructions && (
                            <div>
                              <span className="text-stone-500 font-medium">Note: </span>
                              {cartItem.specialInstructions}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quantity & line price */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-stone-400">
                          {cartItem.cutleryCount} {cartItem.cutleryCount === 1 ? 'place setting' : 'place settings'}
                        </span>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded border border-stone-800">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(idx, cartItem.quantity - 1)}
                              className="text-stone-400 hover:text-stone-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-4 text-center tabular-nums font-bold text-stone-200">
                              {cartItem.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(idx, cartItem.quantity + 1)}
                              className="text-stone-400 hover:text-stone-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold tabular-nums text-stone-200 w-12 text-right">
                            ${cartItem.item.price * cartItem.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Destination Options */}
                <div className="space-y-3 pt-2 border-t border-stone-800">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Delivery Destination
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('room_service')}
                      className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                        deliveryType === 'room_service'
                          ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-semibold'
                          : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <BedDouble className="w-4 h-4" />
                      In-Room Dining
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('table_service')}
                      className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                        deliveryType === 'table_service'
                          ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-semibold'
                          : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <UtensilsCrossed className="w-4 h-4" />
                      Restaurant / Table
                    </button>
                  </div>

                  {/* Dynamic inputs based on delivery type */}
                  {deliveryType === 'room_service' ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] text-stone-400 block mb-1">Room / Suite No.</label>
                        <input
                          type="text"
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          required
                          placeholder="e.g. Suite 704"
                          className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-stone-400 block mb-1">Guest Name</label>
                        <input
                          type="text"
                          value={guest}
                          onChange={(e) => setGuest(e.target.value)}
                          required
                          placeholder="Guest Name"
                          className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs">
                      <label className="text-[11px] text-stone-400 block mb-1">Table or Cabana Identifier</label>
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        required
                        placeholder="e.g. Table 14 - Terrace or Cabana 3"
                        className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  )}
                </div>

                {/* Explicit Hotel Settlement (Zero Payment Method Required) */}
                <div className="space-y-3 pt-2 border-t border-stone-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      Hotel Settlement Method
                    </span>
                    <span className="text-[10px] text-[#d4af37] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Zero Online Payment Required
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label 
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        billingOption === 'charge_to_room'
                          ? 'bg-[#d4af37]/10 border-[#d4af37] text-stone-100'
                          : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="billing"
                        checked={billingOption === 'charge_to_room'}
                        onChange={() => setBillingOption('charge_to_room')}
                        className="mt-0.5 accent-[#d4af37]"
                      />
                      <div>
                        <div className="font-semibold text-stone-200">
                          Charge Directly to Room Folio
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5 leading-normal">
                          Charges will be posted automatically to your room account and settled upon checkout.
                        </div>
                      </div>
                    </label>

                    <label 
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        billingOption === 'executive_club_credit'
                          ? 'bg-[#d4af37]/10 border-[#d4af37] text-stone-100'
                          : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="billing"
                        checked={billingOption === 'executive_club_credit'}
                        onChange={() => setBillingOption('executive_club_credit')}
                        className="mt-0.5 accent-[#d4af37]"
                      />
                      <div>
                        <div className="font-semibold text-stone-200">
                          Executive Club / Suite Complimentary Dining
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5 leading-normal">
                          Applied against your daily VIP food & beverage allowance.
                        </div>
                      </div>
                    </label>

                    <label 
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        billingOption === 'pay_on_delivery_cash'
                          ? 'bg-[#d4af37]/10 border-[#d4af37] text-stone-100'
                          : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="billing"
                        checked={billingOption === 'pay_on_delivery_cash'}
                        onChange={() => setBillingOption('pay_on_delivery_cash')}
                        className="mt-0.5 accent-[#d4af37]"
                      />
                      <div>
                        <div className="font-semibold text-stone-200">
                          Pay Butler upon Room Delivery (Cash / Physical Card)
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5 leading-normal">
                          Your floor butler will present the printed receipt upon delivering your heated tray.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Delivery Notes */}
                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Butler Delivery Instructions
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Ring chime once, leave outside door on tray rack"
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer / Confirmation */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-stone-800 bg-[#131720] space-y-4">
              <div className="space-y-1.5 text-xs text-stone-400">
                <div className="flex justify-between">
                  <span>Dishes Subtotal</span>
                  <span className="tabular-nums font-medium text-stone-200">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Butler Cloche Service & Delivery</span>
                  <span className="tabular-nums text-emerald-400 font-medium">Complimentary ($0)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-800 text-sm font-bold text-stone-100">
                  <span>Total Posted to Folio</span>
                  <span className="tabular-nums text-lg text-[#d4af37]">${total}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitOrder}
                className="w-full py-3.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-[0.98] text-stone-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                    Transmitting to Executive Kitchen...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-stone-950" />
                    Dispatch In-Room Order (No Payment Needed)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
