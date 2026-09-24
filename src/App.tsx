import React, { useState, useEffect, useRef } from 'react';
import { 
  SmartMenuItem, 
  OrderItemDetail, 
  SmartDineOrder, 
  ServiceRequest, 
  AppPortal, 
  StaffAccount, 
  OrderStage 
} from './types/hotel';
import { 
  INITIAL_SMART_MENU, 
  INITIAL_SMART_ORDERS, 
  INITIAL_SERVICE_REQUESTS, 
  STAFF_ACCOUNTS,
  DEMO_LOGIN_IDS
} from './data/smartDineData';
import { SmartHeader } from './components/SmartHeader';
import { TableEntryModal } from './components/TableEntryModal';
import { WebsiteQrModal } from './components/WebsiteQrModal';
import { SmartItemModal } from './components/SmartItemModal';
import { SmartCartDrawer } from './components/SmartCartDrawer';
import { IdLoginGate } from './components/IdLoginGate';
import { CustomerPortal } from './components/portals/CustomerPortal';
import { FitnessPortal } from './components/portals/FitnessPortal';
import { KitchenPortal } from './components/portals/KitchenPortal';
import { WaiterPortal } from './components/portals/WaiterPortal';
import { AdminPortal } from './components/portals/AdminPortal';
import { sound } from './utils/audio';

const STORAGE_KEYS = {
  MENU: 'smartdine_menu',
  ORDERS: 'smartdine_orders',
  REQUESTS: 'smartdine_requests',
  CART: 'smartdine_cart',
  STAFF: 'smartdine_staff',
  TABLE: 'smartdine_table',
  ROOM: 'smartdine_room',
  AUTH_PORTALS: 'smartdine_auth_portals',
  TABLE_ENTERED: 'smartdine_table_entered',
};

export default function App() {
  const [activePortal, setActivePortal] = useState<AppPortal>('customer');
  const [currentTable, setCurrentTable] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TABLE) || '07';
  });
  const [currentRoom, setCurrentRoom] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ROOM) || 'Suite 704';
  });
  const [guestName, setGuestName] = useState<string>('Lady Eleanor Vance');

  // Customer table entrance gate state
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const [staffUser, setStaffUser] = useState<StaffAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Track which staff terminals have had an ID authorized in this session
  const [authorizedPortals, setAuthorizedPortals] = useState<Record<string, StaffAccount>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_PORTALS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Data collections
  const [menu, setMenu] = useState<SmartMenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      return saved ? JSON.parse(saved) : INITIAL_SMART_MENU;
    } catch {
      return INITIAL_SMART_MENU;
    }
  });

  const [orders, setOrders] = useState<SmartDineOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_SMART_ORDERS;
    } catch {
      return INITIAL_SMART_ORDERS;
    }
  });

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_SERVICE_REQUESTS;
    } catch {
      return INITIAL_SERVICE_REQUESTS;
    }
  });

  const [cart, setCart] = useState<OrderItemDetail[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [modalItem, setModalItem] = useState<SmartMenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const liveChannel = useRef<BroadcastChannel | null>(null);

  // Sound Alarm and Toast Helper
  const showToast = (msg: string) => {
    sound.playAlarm(); // Play unmistakable alert alarm sound for every notification
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Website QR Code URL Auto-Detection (?table=07&room=Suite+704)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      const roomParam = params.get('room');

      if (tableParam) {
        const cleanTable = tableParam.replace(/^table_/i, '').trim();
        setCurrentTable(cleanTable);
        localStorage.setItem(STORAGE_KEYS.TABLE, cleanTable);
        localStorage.setItem(STORAGE_KEYS.TABLE_ENTERED, 'true');

        if (roomParam) {
          const cleanRoom = roomParam.trim();
          setCurrentRoom(cleanRoom);
          localStorage.setItem(STORAGE_KEYS.ROOM, cleanRoom);
        }

        showToast(`🚨 Table ${cleanTable} Confirmed! Welcome to SmartDine Food Webpage.`);
      }
    } catch {
      // ignore
    }
  }, []);

  // Cross-tab real-time sync with BroadcastChannel
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('smartdine-live');
      liveChannel.current = channel;

      channel.onmessage = (event: MessageEvent) => {
        const { type, payload } = event.data || {};
        if (type === 'menu' && Array.isArray(payload)) {
          setMenu(payload);
        } else if (type === 'orders' && Array.isArray(payload)) {
          setOrders(payload);
          sound.playAlarm();
        } else if (type === 'requests' && Array.isArray(payload)) {
          setServiceRequests(payload);
          sound.playAlarm();
        }
      };
    } catch {
      // Fallback if BroadcastChannel unavailable
    }

    return () => {
      channel?.close();
    };
  }, []);

  // Save changes to localStorage and broadcast
  const broadcastSync = (type: 'menu' | 'orders' | 'requests', payload: any) => {
    try {
      liveChannel.current?.postMessage({ type, payload });
    } catch {
      // ignore
    }
  };

  const updateOrdersState = (newOrders: SmartDineOrder[]) => {
    setOrders(newOrders);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));
    broadcastSync('orders', newOrders);
  };

  const updateMenuState = (newMenu: SmartMenuItem[]) => {
    setMenu(newMenu);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(newMenu));
    broadcastSync('menu', newMenu);
  };

  const updateServiceRequestsState = (newReqs: ServiceRequest[]) => {
    setServiceRequests(newReqs);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(newReqs));
    broadcastSync('requests', newReqs);
  };

  const updateCartState = (newCart: OrderItemDetail[]) => {
    setCart(newCart);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newCart));
  };

  // Check if a portal is authenticated
  const isPortalAuthenticated = (portal: AppPortal): boolean => {
    // Both Customer Dining and Fitness Nutrition portals are 100% public for hotel guests!
    if (portal === 'customer' || portal === 'fitness') return true;

    // Check specific portal authorized record
    if (authorizedPortals[portal]) return true;

    // Check global staff login
    if (!staffUser) return false;

    if (staffUser.role === 'management' || staffUser.role === 'admin') return true;
    if (portal === 'kitchen' && staffUser.role === 'kitchen') return true;
    if (portal === 'waiter' && staffUser.role === 'waiter') return true;

    return false;
  };

  // Handle successful login via ID Login Gate
  const handleIdLoginSuccess = (account: StaffAccount, targetPortal: AppPortal) => {
    setStaffUser(account);
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(account));

    const updated = { ...authorizedPortals, [targetPortal]: account };
    setAuthorizedPortals(updated);
    localStorage.setItem(STORAGE_KEYS.AUTH_PORTALS, JSON.stringify(updated));

    showToast(`Access granted: ${account.name} (${account.id})`);
  };

  // Handle Staff login from Header dropdown
  const handleStaffLogin = (account: StaffAccount) => {
    setStaffUser(account);
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(account));
    
    const targetPortal: AppPortal = 
      account.role === 'kitchen' ? 'kitchen' :
      account.role === 'waiter' ? 'waiter' : 'admin';

    const updated = { ...authorizedPortals, [targetPortal]: account };
    setAuthorizedPortals(updated);
    localStorage.setItem(STORAGE_KEYS.AUTH_PORTALS, JSON.stringify(updated));

    showToast(`Logged in as ${account.name} (${account.id})`);
  };

  // Handle logout
  const handleStaffLogout = () => {
    setStaffUser(null);
    setAuthorizedPortals({});
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.AUTH_PORTALS);
    showToast('Signed out of terminal. Customer dining active.');
  };

  const handleLogoutSingleTerminal = (portal: AppPortal) => {
    const updated = { ...authorizedPortals };
    delete updated[portal];
    setAuthorizedPortals(updated);
    localStorage.setItem(STORAGE_KEYS.AUTH_PORTALS, JSON.stringify(updated));
    showToast(`Signed out of ${portal} terminal. Enter ID to re-authenticate.`);
  };

  // Cart operations
  const handleAddToCart = (detail: OrderItemDetail) => {
    const existingIdx = cart.findIndex(
      (c) => c.item.id === detail.item.id && 
             c.spiceLevel === detail.spiceLevel && 
             c.doneness === detail.doneness &&
             c.specialInstructions === detail.specialInstructions
    );

    let updatedCart: OrderItemDetail[];
    if (existingIdx >= 0) {
      updatedCart = [...cart];
      updatedCart[existingIdx].quantity += detail.quantity;
    } else {
      updatedCart = [...cart, detail];
    }

    updateCartState(updatedCart);
    showToast(`Added ${detail.item.name} (×${detail.quantity}) to Tray`);
  };

  const handleQuickAdd = (item: SmartMenuItem) => {
    handleAddToCart({
      item,
      quantity: 1,
      spiceLevel: 'Medium',
      cutleryCount: 1,
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    const updated = [...cart];
    updated[index].quantity = newQty;
    updateCartState(updated);
  };

  const handleRemoveCartItem = (index: number) => {
    const updated = cart.filter((_, idx) => idx !== index);
    updateCartState(updated);
  };

  // Order Placement (Zero payment - Direct Table/Room Folio)
  const handlePlaceOrder = (newOrder: SmartDineOrder) => {
    const updatedOrders = [newOrder, ...orders];
    updateOrdersState(updatedOrders);
    updateCartState([]);

    showToast(`🚨 Order ${newOrder.id} fired straight to the Kitchen! Folio: Table ${newOrder.table}.`);
  };

  // Order Status Flow Advance
  const handleAdvanceOrder = (orderId: string) => {
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      let nextStatus: OrderStage = o.status;
      if (o.status === 'New') nextStatus = 'Preparing';
      else if (o.status === 'Preparing') nextStatus = 'Ready';
      else if (o.status === 'Ready') nextStatus = 'Served';

      return {
        ...o,
        status: nextStatus,
        payment: nextStatus === 'Served' ? ('Charged to Folio' as const) : o.payment
      };
    });

    updateOrdersState(updated);
    showToast(`🚨 Order ${orderId} updated to "${orders.find(o => o.id === orderId)?.status}"`);
  };

  const handleUpdateOrderStatus = (orderId: string, stage: OrderStage) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: stage } : o));
    updateOrdersState(updated);
    showToast(`🚨 Order ${orderId} status set to "${stage}"`);
  };

  // Service Request Handlers
  const handleRequestService = (type: 'Waiter Call' | 'Water Refill' | 'Silverware / Napkins' | 'Bill / Folio Summary') => {
    const randomId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: ServiceRequest = {
      id: randomId,
      type,
      target: `Table ${currentTable}`,
      status: 'Pending',
      time: 'Just now',
      timestamp: Date.now(),
    };

    const updated = [newReq, ...serviceRequests];
    updateServiceRequestsState(updated);
    showToast(`🚨 ${type} beacon transmitted to Floor Captain!`);
  };

  const handleResolveServiceRequest = (reqId: string) => {
    const updated = serviceRequests.map((r) =>
      r.id === reqId ? { ...r, status: 'Resolved' as const } : r
    );
    updateServiceRequestsState(updated);
    showToast('Service call resolved and cleared.');
  };

  // Admin New Dish Handlers
  const handleAddMenuItem = (itemData: Omit<SmartMenuItem, 'id'>) => {
    const newId = `item-${Date.now()}`;
    const newItem: SmartMenuItem = {
      ...itemData,
      id: newId,
    };
    const updated = [newItem, ...menu];
    updateMenuState(updated);
    showToast(`"${newItem.name}" added to menu catalog live!`);
  };

  // Customer table confirmed
  const handleSaveTableAndRoom = (table: string, room: string, guest: string) => {
    setCurrentTable(table);
    setCurrentRoom(room);
    setGuestName(guest);
    localStorage.setItem(STORAGE_KEYS.TABLE, table);
    localStorage.setItem(STORAGE_KEYS.ROOM, room);
    localStorage.setItem(STORAGE_KEYS.TABLE_ENTERED, 'true');
    showToast(`🚨 Table ${table} Confirmed! Entered food webpage as ${guest}.`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Served' && o.status !== 'Cancelled').length;
  const pendingRequestsCount = serviceRequests.filter((r) => r.status !== 'Resolved').length;

  // Active terminal operator account
  const currentTerminalStaff = authorizedPortals[activePortal] || staffUser;

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e2e8f0] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-white">
      
      {/* Toast Notification Container with Audible Alarm Beep */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl glass-panel-elevated shadow-2xl text-xs text-white flex items-center gap-3 animate-in slide-in-from-top-2 border border-[#d4af37]/70 max-w-md shadow-[0_0_25px_rgba(212,175,55,0.25)]">
          <span className="w-3 h-3 rounded-full bg-[#d4af37] animate-ping shrink-0" />
          <span className="font-semibold leading-relaxed text-amber-100">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white ml-2 text-xs cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header with Table Selection & Single Website QR Modal Trigger */}
      <SmartHeader
        activePortal={activePortal}
        onSelectPortal={setActivePortal}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        currentTable={currentTable}
        currentRoom={currentRoom}
        activeOrdersCount={activeOrdersCount}
        pendingRequestsCount={pendingRequestsCount}
        staffUser={staffUser}
        onStaffLogin={handleStaffLogin}
        onStaffLogout={handleStaffLogout}
        onOpenTableModal={() => setIsTableModalOpen(true)}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        isPortalAuthenticated={isPortalAuthenticated}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Page 1: Customer Dining Experience & Instant Menu (Indian, Chinese, Fitness) */}
        {activePortal === 'customer' && (
          <CustomerPortal
            menu={menu}
            onOpenItemModal={setModalItem}
            onQuickAdd={handleQuickAdd}
            onRequestService={handleRequestService}
            currentTable={currentTable}
            currentRoom={currentRoom}
            onOpenTableModal={() => setIsTableModalOpen(true)}
            onOpenQrModal={() => setIsQrModalOpen(true)}
          />
        )}

        {/* Page 2: Fitness & Nutrition Hub (Macro Lab & Clean Dining) */}
        {activePortal === 'fitness' && (
          <FitnessPortal
            menu={menu}
            cart={cart}
            onOpenItemModal={setModalItem}
            onQuickAdd={handleQuickAdd}
            onRequestService={handleRequestService}
            currentTable={currentTable}
            currentRoom={currentRoom}
            onOpenTableModal={() => setIsTableModalOpen(true)}
          />
        )}

        {/* Page 3: Kitchen Display System (KDS Kanban) (Protected: Chef ID-Only Login Gate) */}
        {activePortal === 'kitchen' && (
          !isPortalAuthenticated('kitchen') ? (
            <IdLoginGate
              targetPortal="kitchen"
              onSuccessLogin={handleIdLoginSuccess}
              onCancelToCustomer={() => setActivePortal('customer')}
            />
          ) : (
            <KitchenPortal
              orders={orders}
              onAdvanceOrder={handleAdvanceOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              authenticatedStaff={currentTerminalStaff}
              onLogoutTerminal={() => handleLogoutSingleTerminal('kitchen')}
            />
          )
        )}

        {/* Page 4: Waiter Floor Service Hub (Protected: Waiter ID-Only Login Gate) */}
        {activePortal === 'waiter' && (
          !isPortalAuthenticated('waiter') ? (
            <IdLoginGate
              targetPortal="waiter"
              onSuccessLogin={handleIdLoginSuccess}
              onCancelToCustomer={() => setActivePortal('customer')}
            />
          ) : (
            <WaiterPortal
              orders={orders}
              serviceRequests={serviceRequests}
              onAdvanceOrder={handleAdvanceOrder}
              onResolveServiceRequest={handleResolveServiceRequest}
              onSelectTable={(table) => {
                setCurrentTable(table);
                showToast(`Switched active focus to Table ${table}`);
              }}
              authenticatedStaff={currentTerminalStaff}
              onLogoutTerminal={() => handleLogoutSingleTerminal('waiter')}
            />
          )
        )}

        {/* Page 5: Executive Admin & Sales Analytics (Protected: Admin ID-Only Login Gate) */}
        {activePortal === 'admin' && (
          !isPortalAuthenticated('admin') ? (
            <IdLoginGate
              targetPortal="admin"
              onSuccessLogin={handleIdLoginSuccess}
              onCancelToCustomer={() => setActivePortal('customer')}
            />
          ) : (
            <AdminPortal
              menu={menu}
              orders={orders}
              onAddMenuItem={handleAddMenuItem}
              authenticatedStaff={currentTerminalStaff}
              onLogoutTerminal={() => handleLogoutSingleTerminal('admin')}
            />
          )
        )}

      </main>

      {/* Put Table Number & Enter Webpage of Food Modal */}
      <TableEntryModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        currentTable={currentTable}
        currentRoom={currentRoom}
        guestName={guestName}
        onConfirmTable={handleSaveTableAndRoom}
      />

      {/* Single Website QR Code Modal (Scan to open website on phone) */}
      <WebsiteQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onEnterTablePrompt={() => setIsTableModalOpen(true)}
      />

      {/* Item Customization Modal */}
      <SmartItemModal
        item={modalItem}
        onClose={() => setModalItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Tray Drawer */}
      <SmartCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
        currentTable={currentTable}
        currentRoom={currentRoom}
        guestName={guestName}
      />

      {/* Footer */}
      <footer className="w-full bg-[#05060a] border-t border-white/10 text-stone-500 text-xs py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-luxury font-bold text-white text-sm">SmartDine Pro</span>
            <span>·</span>
            <span>Indian, Chinese &amp; Fitness Hotel Food Ordering System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="text-[#38bdf8] hover:underline cursor-pointer"
            >
              Scan Website QR Code
            </button>
            <span>·</span>
            <button
              onClick={() => setIsTableModalOpen(true)}
              className="text-[#d4af37] hover:underline cursor-pointer"
            >
              Enter Table Number ({currentTable})
            </button>
            <span>·</span>
            <span>Staff Terminals: Chef/Waiter/Admin ID</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
