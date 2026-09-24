import React, { useState } from 'react';
import { HotelOrder, OrderStatus, MenuItem } from '../../types/hotel';
import { 
  ChefHat, 
  Clock, 
  BedDouble, 
  CheckCircle, 
  Filter, 
  Plus, 
  Printer, 
  DollarSign, 
  Users, 
  Flame,
  AlertTriangle,
  RotateCw
} from 'lucide-react';

interface Props {
  orders: HotelOrder[];
  menuItems: MenuItem[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddNewManualOrder: (order: HotelOrder) => void;
}

export const KitchenManagementPage: React.FC<Props> = ({
  orders,
  menuItems,
  onUpdateOrderStatus,
  onAddNewManualOrder,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual order form state
  const [manualRoom, setManualRoom] = useState('Suite 502');
  const [manualGuest, setManualGuest] = useState('Lady Catherine de Bourgh');
  const [manualItemId, setManualItemId] = useState(menuItems[0]?.id || '');
  const [manualNotes, setManualNotes] = useState('Hot tea, extra warm bread');

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter === 'all') return true;
    return ord.status === statusFilter;
  });

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const totalBilled = orders.reduce((sum, o) => sum + o.total, 0);

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const item = menuItems.find(i => i.id === manualItemId) || menuItems[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    
    const newOrder: HotelOrder = {
      id: `ord-man-${Date.now()}`,
      orderNumber: `SLS-${randomSuffix}`,
      createdAt: 'Just now (Concierge)',
      guestName: manualGuest,
      roomNumber: manualRoom,
      deliveryType: 'room_service',
      billingOption: 'charge_to_room',
      items: [
        {
          item,
          quantity: 1,
          specialInstructions: manualNotes.trim() || undefined,
          cutleryCount: 1
        }
      ],
      subtotal: item.price,
      serviceCharge: 0,
      total: item.price,
      status: 'received',
      estimatedDeliveryMinutes: 20,
      timeRemainingSeconds: 20 * 60,
      butlerName: 'Master Butler William Thornton',
      butlerPhone: 'Ext. 7041',
      notes: 'Direct front desk phone order'
    };

    onAddNewManualOrder(newOrder);
    setShowManualModal(false);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return <span className="text-amber-400 font-semibold text-xs">New / Order Received</span>;
      case 'in_kitchen':
        return <span className="text-sky-400 font-semibold text-xs flex items-center gap-1"><Flame className="w-3 h-3" /> Firing on Line</span>;
      case 'plating':
        return <span className="text-purple-400 font-semibold text-xs">Cloche Plating & QA</span>;
      case 'out_for_delivery':
        return <span className="text-[#d4af37] font-semibold text-xs">Butler En Route</span>;
      case 'delivered':
        return <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Delivered to Suite</span>;
      default:
        return <span className="text-stone-400 font-semibold text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Top Header */}
      <div className="border-b border-stone-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
            F&B Operations Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-luxury font-bold text-stone-100 mt-1">
            Kitchen Display & Hotel Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Real-time kitchen order tickets (KOT), room folio ledger postings, and floor butler dispatch console.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Concierge Phone Order
          </button>
        </div>
      </div>

      {/* Hotel Management Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#11141a] border border-stone-800 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
            Active Suite Orders
          </div>
          <div className="text-2xl font-bold tabular-nums text-stone-100">
            {activeOrders.length}
          </div>
          <div className="text-[11px] text-emerald-400">
            Live in executive kitchen
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#11141a] border border-stone-800 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
            Avg. Preparation Latency
          </div>
          <div className="text-2xl font-bold tabular-nums text-[#d4af37]">
            18.4 min
          </div>
          <div className="text-[11px] text-stone-400">
            Target SLA: &lt; 30 min
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#11141a] border border-stone-800 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
            Total Folio Posted
          </div>
          <div className="text-2xl font-bold tabular-nums text-stone-100">
            ${totalBilled}
          </div>
          <div className="text-[11px] text-stone-400">
            Auto-billed to room checkouts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#11141a] border border-stone-800 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
            Kitchen Stations
          </div>
          <div className="text-2xl font-bold tabular-nums text-emerald-400">
            4 / 4 Active
          </div>
          <div className="text-[11px] text-stone-400">
            Grill, Sauté, Garde Manger, Pastry
          </div>
        </div>
      </div>

      {/* Filter Tabs for KDS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-800">
        {[
          { id: 'all', label: `All Orders (${orders.length})` },
          { id: 'received', label: 'New / Received' },
          { id: 'in_kitchen', label: 'Firing on Line' },
          { id: 'plating', label: 'Plating QA' },
          { id: 'out_for_delivery', label: 'In Transit' },
          { id: 'delivered', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              statusFilter === tab.id
                ? 'bg-[#d4af37] text-stone-950'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KDS Kitchen Order Tickets (KOT) Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-[#11141a] border border-stone-800 text-stone-400 text-xs">
          No orders matching filter &quot;{statusFilter}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`rounded-2xl border flex flex-col justify-between p-5 transition-all ${
                order.status === 'received'
                  ? 'bg-[#151922] border-amber-500/40 shadow-lg'
                  : order.status === 'in_kitchen'
                    ? 'bg-[#131720] border-sky-500/30'
                    : order.status === 'delivered'
                      ? 'bg-[#101217] border-stone-800 opacity-80'
                      : 'bg-[#12151c] border-stone-800'
              }`}
            >
              <div>
                {/* KOT Header */}
                <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold font-mono text-stone-100">
                        {order.orderNumber}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        ({order.createdAt})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold mt-0.5">
                      <BedDouble className="w-3.5 h-3.5" />
                      <span>{order.roomNumber}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <div className="text-[11px] text-stone-400 mt-1">
                      Guest: {order.guestName}
                    </div>
                  </div>
                </div>

                {/* Items & Chef Notes */}
                <div className="py-4 space-y-3">
                  {order.items.map((cartItem, idx) => (
                    <div key={idx} className="text-xs space-y-1">
                      <div className="flex items-baseline justify-between font-semibold text-stone-200">
                        <span>
                          <span className="text-amber-400 tabular-nums font-bold mr-1">
                            {cartItem.quantity}x
                          </span>
                          {cartItem.item.name}
                        </span>
                        <span className="tabular-nums text-stone-400 font-normal">
                          ${cartItem.item.price * cartItem.quantity}
                        </span>
                      </div>

                      {/* Doneness / notes alerts */}
                      {cartItem.doneness && (
                        <div className="text-[11px] text-sky-400 font-medium pl-4">
                          Prep Doneness: {cartItem.doneness}
                        </div>
                      )}

                      {cartItem.specialInstructions && (
                        <div className="text-[11px] text-amber-300 font-medium pl-4 bg-amber-950/20 p-1 rounded border border-amber-900/30 flex items-start gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                          <span>Note: &quot;{cartItem.specialInstructions}&quot;</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {order.notes && (
                    <div className="text-[11px] text-stone-400 italic pt-1 border-t border-stone-800/60">
                      Butler Note: {order.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* KOT Footer: Room Folio & Action Transitions */}
              <div className="pt-3 border-t border-stone-800 space-y-3">
                <div className="flex justify-between items-center text-xs text-stone-400">
                  <span>
                    Billing: {order.billingOption === 'charge_to_room' ? 'Room Folio' : 'Cash / Butler'}
                  </span>
                  <span className="font-bold text-stone-200 tabular-nums">
                    Total: ${order.total}
                  </span>
                </div>

                {/* Status Transitions */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {order.status === 'received' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'in_kitchen')}
                      className="col-span-2 py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-stone-950 font-bold transition-colors text-center"
                    >
                      Fire to Kitchen Line
                    </button>
                  )}

                  {order.status === 'in_kitchen' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'plating')}
                      className="col-span-2 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-stone-950 font-bold transition-colors text-center"
                    >
                      Assemble Cloche Dome & Call Butler
                    </button>
                  )}

                  {order.status === 'plating' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'out_for_delivery')}
                      className="col-span-2 py-2 px-3 rounded-lg bg-[#d4af37] hover:bg-[#e0be4d] text-stone-950 font-bold transition-colors text-center"
                    >
                      Handover to Butler James
                    </button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                      className="col-span-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold transition-colors text-center"
                    >
                      Confirm Delivered to Suite
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <div className="col-span-2 text-center py-1.5 text-xs text-emerald-400 bg-emerald-950/20 rounded border border-emerald-900/30">
                      Delivered & Posted to Guest Folio
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Phone Order Intake Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#12151c] border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-lg font-luxury font-bold text-stone-100">
                  Concierge Phone Order Intake
                </h3>
                <p className="text-xs text-stone-400">
                  Take in-room order directly via hotel phone or front desk
                </p>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-stone-500 hover:text-stone-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Room / Suite Number</label>
                <input
                  type="text"
                  value={manualRoom}
                  onChange={(e) => setManualRoom(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Guest Name</label>
                <input
                  type="text"
                  value={manualGuest}
                  onChange={(e) => setManualGuest(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Selected Gourmet Dish</label>
                <select
                  value={manualItemId}
                  onChange={(e) => setManualItemId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-[#d4af37]"
                >
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — ${item.price} ({item.categoryLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Guest Preparation Requests</label>
                <input
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. Medium rare, dressing on side..."
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-[11px] text-stone-400">
                Payment: Automatically billed to Room Folio for {manualRoom} on checkout.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-semibold hover:bg-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#d4af37] text-stone-950 font-bold hover:bg-[#e0be4d]"
                >
                  Post to Kitchen KOT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
