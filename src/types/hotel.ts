export type DietaryTag = 'Veg' | 'Non-veg' | 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Halal' | 'Chef Special' | 'Organic' | 'High-Protein' | 'Low-Carb' | 'Keto' | 'Clean Fuel';

export interface SmartMenuItem {
  id: string | number;
  name: string;
  category: 'Main Course' | 'Starters' | 'Biryani' | 'Breads' | 'Desserts' | 'Beverages' | 'Signatures' | 'Fitness' | string;
  price: number;
  image?: string;
  time?: string;
  preparationTime?: string;
  rating?: string;
  type?: 'Veg' | 'Non-veg';
  tone?: 'saffron' | 'moss' | 'clay' | 'cream' | 'gold' | 'azure';
  description: string;
  calories?: number;
  dietaryTags?: (DietaryTag | string)[];
  ingredients?: string[];
  chefRecommended?: boolean;
  categoryLabel?: string;
  badge?: string;
  pairingNote?: string;
  cuisine?: 'Indian' | 'Chinese' | 'Fitness';
  macros?: {
    protein: number; // in grams
    carbs: number;   // in grams
    fats: number;    // in grams
    calories: number; // kcal
  };
}

// Backward-compatible type aliases
export type MenuItem = SmartMenuItem;

export type OrderStage = 'New' | 'Preparing' | 'Ready' | 'Served' | 'Cancelled';

export type OrderStatus = 'received' | 'in_kitchen' | 'plating' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type DeliveryType = 'room_service' | 'dine_in' | 'table_service';
export type DeliveryMode = 'table' | 'room_service';

export type BillingOption = 
  | 'table_folio'
  | 'charge_to_room' 
  | 'pay_at_counter_cash'
  | 'pay_on_delivery_cash'
  | 'executive_club_credit';

export interface CartItem {
  item: SmartMenuItem;
  quantity: number;
  doneness?: string;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Chef Authentic' | string;
  specialInstructions?: string;
  cutleryCount?: number;
}

export type OrderItemDetail = CartItem;

export interface SmartDineOrder {
  id: string;
  table: string;
  roomNumber?: string;
  guestName: string;
  deliveryMode: DeliveryMode;
  itemsCount: number;
  itemsSummary: string;
  detailedItems: OrderItemDetail[];
  amount: number;
  status: OrderStage;
  payment: 'Pending' | 'Paid' | 'Charged to Folio';
  billingOption: BillingOption;
  age: string;
  timestamp: number;
  assignedStaff?: string;
  specialNotes?: string;
}

export interface HotelOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  guestName: string;
  roomNumber: string;
  tableOrCabanaNumber?: string;
  deliveryType: DeliveryType;
  billingOption: BillingOption;
  items: CartItem[];
  subtotal: number;
  serviceCharge: number;
  total: number;
  status: OrderStatus;
  estimatedDeliveryMinutes: number;
  timeRemainingSeconds: number;
  butlerName: string;
  butlerPhone: string;
  notes?: string;
}

export interface TableReservation {
  id: string;
  reservationCode: string;
  guestName: string;
  roomNumber?: string;
  contactPhone: string;
  venue: 'The Grand Conservatory' | 'Rooftop Horizon Terrace' | 'La Veranda Wine Cellar' | 'In-Suite Private Chef';
  date: string;
  time: string;
  guestsCount: number;
  occasion: 'Casual Dining' | 'Anniversary' | 'Business Dinner' | 'Honeymoon' | 'Private Celebration';
  specialRequests?: string;
  status: 'Confirmed' | 'Seated' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  target: string;
  type: 'Waiter Call' | 'Water Refill' | 'Silverware / Napkins' | 'Bill / Folio Summary' | 'Clear Tray';
  time: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  timestamp: number;
}

export type AppPortal = 'customer' | 'fitness' | 'kitchen' | 'waiter' | 'admin' | 'management' | 'tracker';

export interface StaffAccount {
  id: string;
  name: string;
  role: 'waiter' | 'kitchen' | 'admin' | 'management';
  label: string;
  avatarColor?: string;
}
