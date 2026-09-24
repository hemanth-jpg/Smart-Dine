import React, { useState } from 'react';
import { SmartDineOrder, OrderStage, StaffAccount } from '../../types/hotel';
import { sound } from '../../utils/audio';
import { 
  ChefHat, 
  Flame, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Sparkles, 
  UtensilsCrossed, 
  Volume2,
  KeyRound,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  orders: SmartDineOrder[];
  onAdvanceOrder: (orderId: string) => void;
  onUpdateOrderStatus: (orderId: string, stage: OrderStage) => void;
  authenticatedStaff?: StaffAccount | null;
  onLogoutTerminal?: () => void;
}

export const KitchenPortal: React.FC<Props> = ({
  orders,
  onAdvanceOrder,
  onUpdateOrderStatus,
  authenticatedStaff,
  onLogoutTerminal,
}) => {
  const [stationFilter, setStationFilter] = useState('All');

  const kanbanColumns: { stage: OrderStage; label: string; tone: string; border: string; glow: string }[] = [
    { 
      stage: 'New', 
      label: 'New Orders', 
      tone: 'text-amber-400', 
      border: 'border-amber-500/40',
      glow: 'bg-amber-500/10'
    },
    { 
      stage: 'Preparing', 
      label: 'Firing on Line', 
      tone: 'text-sky-400', 
      border: 'border-sky-500/40',
      glow: 'bg-sky-500/10'
    },
    { 
      stage: 'Ready', 
      label: 'Plated & Ready to Serve', 
      tone: 'text-emerald-400', 
      border: 'border-emerald-500/40',
      glow: 'bg-emerald-500/10'
    }
  ];

  const activeOrdersCount = orders.filter((o) => o.status !== 'Served' && o.status !== 'Cancelled').length;

  return (
    <div className="space-y-8 pb-28">
      {/* Header & KDS Operations strip */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
            <KeyRound className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>KDS Terminal Authenticated · Station ID: <b>{authenticatedStaff?.id || 'KTN-1001'}</b></span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-luxury font-bold text-white mt-1">
            Kitchen Display System (KDS)
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Live ticket routing, chef plating verification, and line advancement.
          </p>
        </div>

        {/* Live KDS Metrics & Switch ID Button */}
        <div className="flex items-center gap-3">
          {authenticatedStaff && (
            <div className="flex items-center gap-2 p-2 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <div>
                <div className="text-white font-bold">{authenticatedStaff.name}</div>
                <div className="text-[10px] text-stone-400">{authenticatedStaff.label}</div>
              </div>
              {onLogoutTerminal && (
                <button
                  onClick={() => {
                    sound.playTick();
                    onLogoutTerminal();
                  }}
                  className="ml-3 text-stone-400 hover:text-rose-400 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Switch ID"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch</span>
                </button>
              )}
            </div>
          )}

          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Active Fire Tickets</div>
            <div className="text-xl font-bold font-mono text-[#d4af37]">{activeOrdersCount}</div>
          </div>
        </div>
      </div>

      {/* Kanban Service Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kanbanColumns.map((col) => {
          const columnOrders = orders.filter((o) => o.status === col.stage);

          return (
            <div 
              key={col.stage}
              className={`rounded-3xl glass-panel border ${col.border} p-5 flex flex-col min-h-[500px] shadow-xl`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.stage === 'New' ? 'bg-amber-400 animate-ping' : col.stage === 'Preparing' ? 'bg-sky-400' : 'bg-emerald-400'}`} />
                  <h3 className={`text-base font-luxury font-bold ${col.tone}`}>
                    {col.label}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
                  {columnOrders.length}
                </span>
              </div>

              {/* Tickets Column */}
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {columnOrders.length === 0 ? (
                  <div className="text-center py-16 text-stone-500 text-xs space-y-1">
                    <UtensilsCrossed className="w-8 h-8 mx-auto text-stone-600 mb-2" />
                    <div>No tickets in this stage.</div>
                  </div>
                ) : (
                  columnOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 shadow-lg hover:border-white/20 transition-all"
                    >
                      {/* Ticket Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div>
                          <span className="text-sm font-bold font-mono text-white">
                            {order.id}
                          </span>
                          <span className="text-xs text-stone-400 ml-2 font-mono">
                            ({order.age} ago)
                          </span>
                        </div>
                        <div className="text-xs font-mono font-bold text-[#d4af37] px-2.5 py-0.5 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30">
                          Table {order.table}
                        </div>
                      </div>

                      {/* Items with visual photo thumbnails */}
                      <div className="space-y-2 py-1">
                        {order.detailedItems.map((cartItem, idx) => (
                          <div key={idx} className="text-xs space-y-1 bg-white/5 p-2 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2">
                              <img
                                src={cartItem.item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                                alt={cartItem.item.name}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-stone-200 truncate">
                                  <b className="text-[#d4af37] mr-1 font-mono">{cartItem.quantity}x</b>
                                  {cartItem.item.name}
                                </div>
                              </div>
                            </div>

                            {cartItem.spiceLevel && (
                              <div className="text-[11px] text-sky-400 font-medium pl-10">
                                Spice: {cartItem.spiceLevel}
                              </div>
                            )}

                            {cartItem.doneness && (
                              <div className="text-[11px] text-amber-400 font-medium pl-10">
                                Doneness: {cartItem.doneness}
                              </div>
                            )}

                            {cartItem.specialInstructions && (
                              <div className="text-[11px] text-amber-300 bg-amber-950/40 p-1.5 rounded-lg border border-amber-900/50 flex items-start gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                                <span>&quot;{cartItem.specialInstructions}&quot;</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 border-t border-white/10">
                        {order.status === 'New' && (
                          <button
                            onClick={() => {
                              sound.playTick();
                              onUpdateOrderStatus(order.id, 'Preparing');
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-stone-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Start Firing Dishes</span>
                          </button>
                        )}

                        {order.status === 'Preparing' && (
                          <button
                            onClick={() => {
                              sound.playOrderChime();
                              onUpdateOrderStatus(order.id, 'Ready');
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-stone-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Mark Plated & Ready (Ring Butler)</span>
                          </button>
                        )}

                        {order.status === 'Ready' && (
                          <button
                            onClick={() => {
                              sound.playSuccess();
                              onUpdateOrderStatus(order.id, 'Served');
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Complete Table Delivery</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
