import React, { useState } from 'react';
import { SmartDineOrder, ServiceRequest, StaffAccount } from '../../types/hotel';
import { sound } from '../../utils/audio';
import { 
  UserCheck, 
  Bell, 
  Droplets, 
  Receipt, 
  Utensils, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Layers,
  MapPin,
  Sparkles,
  KeyRound,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  orders: SmartDineOrder[];
  serviceRequests: ServiceRequest[];
  onAdvanceOrder: (orderId: string) => void;
  onResolveServiceRequest: (reqId: string) => void;
  onSelectTable: (table: string) => void;
  authenticatedStaff?: StaffAccount | null;
  onLogoutTerminal?: () => void;
}

export const WaiterPortal: React.FC<Props> = ({
  orders,
  serviceRequests,
  onAdvanceOrder,
  onResolveServiceRequest,
  onSelectTable,
  authenticatedStaff,
  onLogoutTerminal,
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'orders' | 'tables'>('requests');

  // Simulated 24 floor tables
  const floorTables = Array.from({ length: 24 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    const tableOrder = orders.find((o) => o.table === num && o.status !== 'Served' && o.status !== 'Cancelled');
    const tableReq = serviceRequests.find((r) => r.target === `Table ${num}` && r.status !== 'Resolved');

    let status = 'Available';
    if (tableReq) status = 'Needs Attention';
    else if (tableOrder) status = 'Occupied & Dining';

    return {
      table: num,
      status,
      order: tableOrder,
      request: tableReq,
    };
  });

  const pendingRequests = serviceRequests.filter((r) => r.status !== 'Resolved');

  return (
    <div className="space-y-8 pb-28">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
            <KeyRound className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Floor Terminal Authenticated · Waiter ID: <b>{authenticatedStaff?.id || 'WTR-1001'}</b></span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-luxury font-bold text-white mt-1">
            Waiter & Floor Service Hub
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Real-time table calls, floor assistance radar, and table folio settlement.
          </p>
        </div>

        {/* Staff badge & Tab switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {authenticatedStaff && (
            <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs self-start sm:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
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
                  className="ml-2 text-stone-400 hover:text-rose-400 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Switch ID"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Switch</span>
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
            <button
              onClick={() => { sound.playTick(); setActiveTab('requests'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'requests'
                  ? 'bg-[#d4af37] text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Calls ({pendingRequests.length})</span>
            </button>

            <button
              onClick={() => { sound.playTick(); setActiveTab('orders'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#d4af37] text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tickets ({orders.length})</span>
            </button>

            <button
              onClick={() => { sound.playTick(); setActiveTab('tables'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'tables'
                  ? 'bg-[#d4af37] text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Tables (24)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Live Guest Calls & Service Alerts */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-luxury font-bold text-white uppercase tracking-wider">
              Floor Service Attention Queue
            </h2>
            <span className="text-xs text-stone-400">
              {pendingRequests.length} active service call(s)
            </span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-20 p-8 rounded-3xl glass-panel border border-white/10 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="text-base font-bold text-white">All Floor Calls Attended</div>
              <p className="text-xs text-stone-400">
                No tables currently require assistance. The floor is running smoothly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {pendingRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-5 rounded-2xl glass-panel-elevated border border-amber-500/40 space-y-4 shadow-xl relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                          {req.type === 'Water Refill' && <Droplets className="w-5 h-5" />}
                          {req.type === 'Silverware / Napkins' && <Utensils className="w-5 h-5" />}
                          {req.type === 'Bill / Folio Summary' && <Receipt className="w-5 h-5" />}
                          {req.type === 'Waiter Call' && <Bell className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="text-base font-bold text-white">{req.target}</div>
                          <div className="text-xs text-amber-300 font-medium">{req.type}</div>
                        </div>
                      </div>

                      <span className="text-[10px] text-stone-400 font-mono">
                        {req.time}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                      <button
                        onClick={() => {
                          const tableNum = req.target.replace('Table ', '').trim();
                          onSelectTable(tableNum);
                        }}
                        className="text-xs text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <span>Focus Table</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => {
                          sound.playSuccess();
                          onResolveServiceRequest(req.id);
                        }}
                        className="py-1.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-stone-950 font-bold text-xs transition-all shadow flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Resolve Call</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Live Kitchen & Service Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="text-base font-bold font-mono text-white">{order.id}</div>
                    <div className="text-xs text-stone-400">
                      Table <b className="text-white">{order.table}</b> · {order.guestName}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono ${
                    order.status === 'Ready'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : order.status === 'Preparing'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Items preview with thumbnails */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {order.detailedItems.map((cartItem, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-300">
                      <img
                        src={cartItem.item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                        alt={cartItem.item.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{cartItem.item.name}</div>
                        <div className="text-[10px] text-stone-500">Qty: {cartItem.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-stone-400 font-mono">
                    Total: <b className="text-white">₹{order.amount}</b>
                  </div>
                  {order.status !== 'Served' && (
                    <button
                      onClick={() => {
                        sound.playSuccess();
                        onAdvanceOrder(order.id);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Advance</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive 24-Table Floor Radar */}
      {activeTab === 'tables' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-luxury font-bold text-white uppercase tracking-wider">
              24-Table Floor Layout Radar
            </h2>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Available</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>Dining</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Attention</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {floorTables.map((t) => (
              <button
                key={t.table}
                onClick={() => {
                  sound.playTick();
                  onSelectTable(t.table);
                }}
                className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer ${
                  t.status === 'Needs Attention'
                    ? 'bg-amber-500/15 border-amber-500/60 shadow-lg'
                    : t.status === 'Occupied & Dining'
                      ? 'bg-sky-500/10 border-sky-500/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-mono text-white group-hover:text-[#d4af37] transition-colors">
                    T-{t.table}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    t.status === 'Needs Attention' ? 'bg-amber-400 animate-ping' : t.status === 'Occupied & Dining' ? 'bg-sky-400' : 'bg-emerald-400'
                  }`} />
                </div>
                <div className="text-[11px] text-stone-400 mt-2 truncate font-medium">
                  {t.status}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
