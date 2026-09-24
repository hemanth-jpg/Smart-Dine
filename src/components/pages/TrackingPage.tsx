import React, { useState, useEffect } from 'react';
import { HotelOrder, OrderStatus } from '../../types/hotel';
import { 
  CheckCircle2, 
  Clock, 
  Utensils, 
  UserCheck, 
  ConciergeBell, 
  Phone, 
  FileText, 
  BedDouble, 
  Sparkles, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';

interface Props {
  orders: HotelOrder[];
  onAdvanceOrderStatus: (orderId: string) => void;
  onClearDeliveredTray: (orderId: string) => void;
  onSelectOrderToTrack?: (orderId: string) => void;
}

export const TrackingPage: React.FC<Props> = ({
  orders,
  onAdvanceOrderStatus,
  onClearDeliveredTray,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.length > 0 ? orders[0].id : ''
  );
  const [searchInput, setSearchInput] = useState('');
  const [trayClearRequested, setTrayClearRequested] = useState<Record<string, boolean>>({});

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const steps: { key: OrderStatus; label: string; desc: string; icon: React.ElementType }[] = [
    {
      key: 'received',
      label: 'Order Confirmed',
      desc: 'Folio verified & kitchen ticket printed',
      icon: FileText
    },
    {
      key: 'in_kitchen',
      label: 'Executive Kitchen',
      desc: 'Chef Laurent & line firing pans',
      icon: Utensils
    },
    {
      key: 'plating',
      label: 'Cloche Assembly',
      desc: 'Temperature QA & heated silver dome placement',
      icon: Sparkles
    },
    {
      key: 'out_for_delivery',
      label: 'Butler En Route',
      desc: 'Ascending via private service elevator to suite',
      icon: ConciergeBell
    },
    {
      key: 'delivered',
      label: 'Suite Delivered',
      desc: 'Presented in-room; billed to room folio',
      icon: CheckCircle2
    }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 0;
      case 'in_kitchen': return 1;
      case 'plating': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const handleRequestClear = (orderId: string) => {
    setTrayClearRequested(prev => ({ ...prev, [orderId]: true }));
    onClearDeliveredTray(orderId);
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="space-y-8 pb-20">
      
      {/* Page Title */}
      <div className="border-b border-stone-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
            Live Concierge Dispatch
          </div>
          <h1 className="text-3xl sm:text-4xl font-luxury font-bold text-stone-100 mt-1">
            In-Room Dining Tracker
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Real-time status updates from our central executive kitchen to your hotel suite door.
          </p>
        </div>

        {/* Quick Order Selector / Switcher */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-stone-500 font-medium">Active Orders:</span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setSelectedOrderId(ord.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeOrder?.id === ord.id
                    ? 'bg-[#d4af37] text-stone-950 shadow-sm'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {ord.orderNumber} ({ord.roomNumber})
              </button>
            ))}
          </div>
        )}
      </div>

      {!activeOrder ? (
        <div className="text-center py-20 p-8 rounded-2xl bg-[#11141a] border border-stone-800">
          <ConciergeBell className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h2 className="text-lg font-luxury font-bold text-stone-200">No Orders in Transit</h2>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            You do not currently have an active in-room dining order. Explore our menu to place your first suite order.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Tracker Panel (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Progress Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#11141a] border border-stone-800/80 space-y-6">
              
              {/* Header stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-luxury font-bold text-stone-100">
                      Order {activeOrder.orderNumber}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      · {activeOrder.createdAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                    <span className="flex items-center gap-1 text-stone-300 font-medium">
                      <BedDouble className="w-3.5 h-3.5 text-[#d4af37]" />
                      {activeOrder.roomNumber}
                    </span>
                    <span>·</span>
                    <span>Guest: {activeOrder.guestName}</span>
                  </div>
                </div>

                {/* Status indicator badge */}
                <div className="flex items-center gap-3">
                  {activeOrder.status === 'delivered' ? (
                    <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Delivered to Suite
                    </div>
                  ) : (
                    <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 animate-spin text-[#d4af37]" />
                      Est. Delivery: ~{activeOrder.estimatedDeliveryMinutes} min
                    </div>
                  )}

                  {/* Simulate next stage action */}
                  {activeOrder.status !== 'delivered' && (
                    <button
                      onClick={() => onAdvanceOrderStatus(activeOrder.id)}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors"
                      title="Advance to next step for demonstration"
                    >
                      Advance Status
                    </button>
                  )}
                </div>
              </div>

              {/* Visual 5-Step Pipeline */}
              <div className="relative pt-4 pb-2">
                <div className="space-y-8 relative">
                  {/* Vertical bar on mobile, horizontal on larger screens */}
                  <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-stone-800 -z-0" />
                  <div 
                    className="hidden sm:block absolute top-5 left-6 h-0.5 bg-[#d4af37] transition-all duration-500 -z-0"
                    style={{ width: `${(currentStepIdx / (steps.length - 1)) * 92}%` }}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
                    {steps.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx < currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step.key} className="flex sm:flex-col items-start sm:items-center gap-3 sm:text-center relative z-10">
                          {/* Step icon circle */}
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-500 text-stone-950 font-bold'
                                : isCurrent
                                  ? 'bg-[#d4af37] text-stone-950 font-bold ring-4 ring-[#d4af37]/20 animate-pulse'
                                  : 'bg-stone-900 border border-stone-800 text-stone-600'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Step labels */}
                          <div className="space-y-0.5">
                            <div
                              className={`text-xs font-semibold transition-colors ${
                                isCurrent
                                  ? 'text-[#d4af37] font-bold'
                                  : isCompleted
                                    ? 'text-stone-200'
                                    : 'text-stone-500'
                              }`}
                            >
                              {step.label}
                            </div>
                            <div className="text-[11px] text-stone-400 sm:max-w-[120px] leading-tight">
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Current Status Callout */}
              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-stone-200">
                    Live Status: {steps[currentStepIdx].label}
                  </span>
                  <p className="text-stone-400 leading-normal">
                    {currentStepIdx === 0 && "Your suite request has been authenticated against the hotel guest registry and sent to the hot line."}
                    {currentStepIdx === 1 && "Executive Chef Laurent Mercier's culinary team is hand-preparing your dishes using fresh artisan ingredients."}
                    {currentStepIdx === 2 && "Dishes have passed culinary inspection, cloche domes are heated to 65°C, and custom silverware place settings are laid."}
                    {currentStepIdx === 3 && `${activeOrder.butlerName} is traveling via priority guest elevators with your in-room heated service trolley.`}
                    {currentStepIdx === 4 && "Delivered in suite. Please enjoy your meal. Silverware and table clearing service is available at your convenience."}
                  </p>
                </div>
              </div>

              {/* Delivered Post-Meal Actions */}
              {activeOrder.status === 'delivered' && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
                  <div className="text-xs text-stone-300">
                    <span className="font-bold text-emerald-400">Tray Finished? </span>
                    Request our floor butler to collect your dining tray and glassware from your suite.
                  </div>
                  <button
                    onClick={() => handleRequestClear(activeOrder.id)}
                    disabled={trayClearRequested[activeOrder.id]}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold transition-colors whitespace-nowrap disabled:opacity-60"
                  >
                    {trayClearRequested[activeOrder.id] ? 'Butler Dispatched for Tray' : 'Request Tray Collection'}
                  </button>
                </div>
              )}
            </div>

            {/* Dedicated Floor Butler Profile */}
            <div className="p-6 rounded-2xl bg-[#11141a] border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-[#d4af37] font-luxury text-xl font-bold">
                  {activeOrder.butlerName.split(' ')[1]?.[0] || 'B'}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold">
                    Assigned Floor Butler
                  </div>
                  <h3 className="text-base font-luxury font-bold text-stone-100">
                    {activeOrder.butlerName}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Solis Grand Suite Butler Services · Floor Wings 5–15
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`tel:${activeOrder.butlerPhone}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Dialing Butler direct line: ${activeOrder.butlerPhone}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                  Direct Concierge {activeOrder.butlerPhone}
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Hotel Folio Invoice & Order Summary */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#11141a] border border-stone-800 space-y-5">
              <div className="border-b border-stone-800 pb-4">
                <div className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold">
                  Hotel Folio Receipt
                </div>
                <h3 className="text-lg font-luxury font-bold text-stone-100 mt-0.5">
                  Itemized Suite Folio
                </h3>
                <div className="text-xs text-stone-400 mt-1">
                  Settlement: {activeOrder.billingOption === 'charge_to_room' && 'Charged to Room Folio (Checkout)'}
                  {activeOrder.billingOption === 'executive_club_credit' && 'VIP Club Suite Dining Allowance'}
                  {activeOrder.billingOption === 'pay_on_delivery_cash' && 'Cash on Delivery to Butler'}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {activeOrder.items.map((cartItem, idx) => (
                  <div key={idx} className="text-xs space-y-1 pb-2 border-b border-stone-800/60 last:border-0">
                    <div className="flex justify-between items-start text-stone-200">
                      <span>
                        <span className="font-bold text-[#d4af37]">{cartItem.quantity}x</span> {cartItem.item.name}
                      </span>
                      <span className="tabular-nums font-semibold">
                        ${cartItem.item.price * cartItem.quantity}
                      </span>
                    </div>
                    {cartItem.doneness && (
                      <div className="text-[11px] text-stone-400 pl-4">
                        Doneness: {cartItem.doneness}
                      </div>
                    )}
                    {cartItem.specialInstructions && (
                      <div className="text-[11px] text-stone-400 pl-4 italic">
                        &quot;{cartItem.specialInstructions}&quot;
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Financials (Zero Hidden Fee) */}
              <div className="pt-3 border-t border-stone-800 space-y-2 text-xs text-stone-400">
                <div className="flex justify-between">
                  <span>Culinary Subtotal</span>
                  <span className="text-stone-200 tabular-nums">${activeOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Suite Cloche Delivery</span>
                  <span className="text-emerald-400 tabular-nums">Complimentary ($0)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-800 font-bold text-sm text-stone-100">
                  <span>Total Billed to Room</span>
                  <span className="text-base text-[#d4af37] tabular-nums">${activeOrder.total}</span>
                </div>
              </div>

              {/* Authenticity notice */}
              <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80 text-[11px] text-stone-400 leading-normal">
                <div className="font-semibold text-stone-300 mb-0.5">Zero Payment Notice:</div>
                This invoice is billed directly to your registered hotel folio for {activeOrder.roomNumber}. No online card processing was executed.
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
