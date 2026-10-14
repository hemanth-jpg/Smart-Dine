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
import {
  clearStaffAccessToken,
  createOrder,
  createServiceRequest,
  loadMenu,
  loadMongoData,
  logoutStaff,
  saveMenu,
  setOrderStatus,
  setServiceRequestStatus,
  seedMongoData,
} from './lib/mongoData';

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

  const [staffUser, setStaffUser] = useState<StaffAccount | null>(null);

  // Track which staff terminals have had an ID authorized in this session
  const [authorizedPortals, setAuthorizedPortals] = useState<Record<string, StaffAccount>>({});

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

  useEffect(() => {
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.AUTH_PORTALS);
  }, []);

  // The public menu is readable without staff credentials; operational records are not.
  useEffect(() => {
    void loadMenu()
      .then(({ menu: remoteMenu }) => setMenu(remoteMenu))
      .catch((error) => console.error('MongoDB menu hydration failed; continuing with local data.', error));
  }, []);

  // Staff terminals poll shared operational data so updates appear across devices.
  useEffect(() => {
    if (!staffUser) return;

    let active = true;
    let timeout: ReturnType<typeof setTimeout>;
    const refresh = async () => {
      try {
        const remote = await loadMongoData();
        if (active) {
          setMenu(remote.menu);
          setOrders(remote.orders);
          setServiceRequests(remote.serviceRequests);
        }
      } catch (error) {
        console.error('Live staff data refresh failed.', error);
      } finally {
        if (active) timeout = setTimeout(() => void refresh(), 8000);
      }
    };

    timeout = setTimeout(() => void refresh(), 8000);
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [staffUser?.id]);

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

  const updateMenuState = async (newMenu: SmartMenuItem[]) => {
    await saveMenu(newMenu);
    setMenu(newMenu);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(newMenu));
    broadcastSync('menu', newMenu);
  };

  const updateCartState = (newCart: OrderItemDetail[]) => {
    setCart(newCart);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newCart));
  };

  // Check if a portal is authenticated
  const isPortalAuthenticated = (portal: AppPortal): boolean => {
    // Both Customer Dining and Fitness Nutrition portals are 100% public for hotel guests!
    if (portal === 'customer' || portal === 'fitness') return true;

    if (authorizedPortals[portal]) return true;
    if (!staffUser) return false;
    if (staffUser.role === 'admin' || staffUser.role === 'management') return true;
    return (portal === 'kitchen' && staffUser.role === 'kitchen') ||
      (portal === 'waiter' && staffUser.role === 'waiter');
  };

  // Handle successful login via ID Login Gate
  const handleIdLoginSuccess = async (account: StaffAccount, targetPortal: AppPortal) => {
    try {
      if (account.role === 'admin' || account.role === 'management') {
        await seedMongoData(menu, orders, serviceRequests);
      }
      const remote = await loadMongoData();
      setMenu(remote.menu);
      setOrders(remote.orders);
      setServiceRequests(remote.serviceRequests);
      setStaffUser(account);
      setAuthorizedPortals({ [targetPortal]: account });
      showToast(`Access granted: ${account.name} (${account.id})`);
    } catch (error) {
      clearStaffAccessToken();
      throw error;
    }
  };

  // Handle logout
  const handleStaffLogout = () => {
    void logoutStaff().catch((error) => console.error('Staff logout failed.', error));
    setStaffUser(null);
    setAuthorizedPortals({});
    showToast('Signed out of terminal. Customer dining active.');
  };

  const handleLogoutSingleTerminal = (portal: AppPortal) => {
    void logoutStaff().catch((error) => console.error('Staff logout failed.', error));
    setAuthorizedPortals({});
    setStaffUser(null);
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
  const handlePlaceOrder = async (newOrder: SmartDineOrder) => {
    const confirmedOrder = await createOrder(newOrder);
    setOrders((current) => [confirmedOrder, ...current]);
    updateCartState([]);
    showToast(`Order ${confirmedOrder.id} sent to the kitchen. Table ${confirmedOrder.table}.`);
    return confirmedOrder;
  };

  // Order Status Flow Advance
  const handleAdvanceOrder = async (orderId: string) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    const nextStatus: OrderStage = order.status === 'New'
      ? 'Preparing'
      : order.status === 'Preparing'
        ? 'Ready'
        : order.status === 'Ready'
          ? 'Served'
          : order.status;

    try {
      await setOrderStatus(orderId, nextStatus);
      setOrders((current) => current.map((item) => item.id === orderId
        ? { ...item, status: nextStatus, payment: nextStatus === 'Served' ? 'Charged to Folio' : item.payment }
        : item));
      showToast(`Order ${orderId} updated to "${nextStatus}".`);
    } catch (error) {
      console.error('Order status update failed.', error);
      showToast(error instanceof Error ? error.message : 'Unable to update the order.');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, stage: OrderStage) => {
    try {
      await setOrderStatus(orderId, stage);
      setOrders((current) => current.map((item) => item.id === orderId
        ? { ...item, status: stage, payment: stage === 'Served' ? 'Charged to Folio' : item.payment }
        : item));
      showToast(`Order ${orderId} status set to "${stage}".`);
    } catch (error) {
      console.error('Order status update failed.', error);
      showToast(error instanceof Error ? error.message : 'Unable to update the order.');
    }
  };

  // Service Request Handlers
  const handleRequestService = async (type: 'Waiter Call' | 'Water Refill' | 'Silverware / Napkins' | 'Bill / Folio Summary'): Promise<boolean> => {
    try {
      const serviceRequest = await createServiceRequest(type, `Table ${currentTable}`);
      setServiceRequests((current) => [serviceRequest, ...current]);
      showToast(`${type} request sent to the floor team.`);
      return true;
    } catch (error) {
      console.error('Service request submission failed.', error);
      showToast(error instanceof Error ? error.message : 'Unable to send the service request.');
      return false;
    }
  };

  const handleResolveServiceRequest = async (reqId: string) => {
    try {
      await setServiceRequestStatus(reqId, 'Resolved');
      setServiceRequests((current) => current.map((request) =>
        request.id === reqId ? { ...request, status: 'Resolved' } : request
      ));
      showToast('Service call resolved and cleared.');
    } catch (error) {
      console.error('Service request update failed.', error);
      showToast(error instanceof Error ? error.message : 'Unable to resolve the service request.');
    }
  };

  // Admin New Dish Handlers
  const handleAddMenuItem = async (itemData: Omit<SmartMenuItem, 'id'>) => {
    const newId = `item-${Date.now()}`;
    const newItem: SmartMenuItem = {
      ...itemData,
      id: newId,
    };
    const updated = [newItem, ...menu];
    await updateMenuState(updated);
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

        {/* Page 3: Kitchen Display System (KDS Kanban) (Staff authentication required) */}
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

        {/* Page 4: Waiter Floor Service Hub (Staff authentication required) */}
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

        {/* Page 5: Executive Admin & Sales Analytics (Staff authentication required) */}
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
