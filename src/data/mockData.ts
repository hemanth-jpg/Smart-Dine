import { MenuItem, HotelOrder, TableReservation } from '../types/hotel';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Signatures
  {
    id: 'sig-1',
    name: 'Prime Wagyu Tenderloin M9+',
    category: 'signatures',
    categoryLabel: "Chef's Signature",
    description: 'Charred Australian wagyu tenderloin, winter black truffle reduction, smoked parsnip mousseline, and heirloom glazed baby carrots.',
    price: 68,
    preparationTime: '25-30 min',
    calories: 780,
    dietaryTags: ['Chef Special', 'Gluten-Free', 'Halal'],
    ingredients: ['M9+ Wagyu', 'Black Truffle', 'Parsnip', 'Heirloom Carrots', 'Red Wine Jus'],
    chefRecommended: true,
    pairingNote: 'Recommended with Estate Reserve Pinot Noir or Sparkling San Pellegrino',
    badge: 'Award Winning'
  },
  {
    id: 'sig-2',
    name: 'Pan-Roasted Glacier 51 Toothfish',
    category: 'signatures',
    categoryLabel: "Chef's Signature",
    description: 'Wild Antarctic sea bass fillet, miso-mirin emulsion, maitake mushrooms, baby bok choy, and ginger scallion broth.',
    price: 54,
    preparationTime: '20-25 min',
    calories: 620,
    dietaryTags: ['Chef Special', 'Gluten-Free', 'Halal'],
    ingredients: ['Glacier 51 Toothfish', 'White Miso', 'Maitake', 'Bok Choy', 'Ginger Scallion Broth'],
    chefRecommended: true,
    pairingNote: 'Exceptional with citrus-infused sparkling botanical water'
  },
  {
    id: 'sig-3',
    name: 'Handcrafted Truffle & Porcini Risotto',
    category: 'signatures',
    categoryLabel: "Chef's Signature",
    description: 'Aged Acquerello carnaroli rice, wild mountain porcini, aged Parmigiano-Reggiano 36-month, and fresh shaved Perigord truffle.',
    price: 42,
    preparationTime: '20-25 min',
    calories: 690,
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'Chef Special'],
    ingredients: ['Acquerello Rice', 'Fresh Truffle', 'Porcini', 'Parmigiano-Reggiano', 'Cultured Butter'],
    chefRecommended: true,
    pairingNote: 'Paired with cold-pressed Italian white grape elixir'
  },

  // Mains
  {
    id: 'main-1',
    name: 'The Solis Grand Heritage Club',
    category: 'mains',
    categoryLabel: 'All-Day Mains',
    description: 'Triple-decker toasted brioche, slow-roasted heritage turkey breast, crispy smoked beef bacon, avocado, heirloom tomato, and Dijon emulsion.',
    price: 32,
    preparationTime: '15-20 min',
    calories: 710,
    dietaryTags: ['Halal'],
    ingredients: ['Brioche', 'Roasted Turkey', 'Smoked Beef Bacon', 'Avocado', 'Heirloom Tomato', 'Dijon'],
    chefRecommended: false,
    badge: 'Hotel Classic'
  },
  {
    id: 'main-2',
    name: 'Dry-Aged Black Angus Burger',
    category: 'mains',
    categoryLabel: 'All-Day Mains',
    description: '28-day dry-aged beef patty, aged English cheddar, caramelized shallot marmalade, brioche bun, and hand-cut truffle parmesan fries.',
    price: 36,
    preparationTime: '20 min',
    calories: 880,
    dietaryTags: ['Halal'],
    ingredients: ['Black Angus Beef', 'English Cheddar', 'Shallot Jam', 'Brioche', 'Truffle Fries'],
    chefRecommended: true,
    pairingNote: 'Served with signature house-made smoked paprika aioli'
  },
  {
    id: 'main-3',
    name: 'Handmade Saffron Tiger Prawn Tagliatelle',
    category: 'mains',
    categoryLabel: 'All-Day Mains',
    description: 'Fresh egg tagliatelle infused with Persian saffron, grilled jumbo tiger prawns, charred sweet peppers, shellfish reduction, and micro basil.',
    price: 44,
    preparationTime: '20-25 min',
    calories: 650,
    dietaryTags: ['Halal'],
    ingredients: ['Handmade Pasta', 'Persian Saffron', 'Tiger Prawns', 'San Marzano Glaze', 'Basil'],
    chefRecommended: true
  },
  {
    id: 'main-4',
    name: 'Free-Range Moroccan Spiced Spatchcock Chicken',
    category: 'mains',
    categoryLabel: 'All-Day Mains',
    description: 'Half organic chicken roasted with sumac, preserved lemon, roasted garlic cloves, pomegranate molasses, and warm spiced pearl couscous.',
    price: 38,
    preparationTime: '25-30 min',
    calories: 740,
    dietaryTags: ['Halal', 'Organic'],
    ingredients: ['Organic Chicken', 'Preserved Lemon', 'Sumac', 'Pearl Couscous', 'Pomegranate'],
    chefRecommended: false
  },

  // Breakfast & Brunch
  {
    id: 'brk-1',
    name: 'Imperial Royal Eggs Benedict',
    category: 'breakfast',
    categoryLabel: 'Artisan Breakfast',
    description: 'Two organic poached eggs, toasted English crumpet, Loch Fyne Scottish smoked salmon, Oscietra caviar pearl garnish, and Meyer lemon hollandaise.',
    price: 34,
    preparationTime: '15-20 min',
    calories: 580,
    dietaryTags: ['Chef Special', 'Halal'],
    ingredients: ['Organic Poached Eggs', 'Scottish Salmon', 'Oscietra Caviar', 'Crumpet', 'Lemon Hollandaise'],
    chefRecommended: true,
    badge: 'Guest Favorite'
  },
  {
    id: 'brk-2',
    name: 'Vanilla Bean French Toast & Wild Berries',
    category: 'breakfast',
    categoryLabel: 'Artisan Breakfast',
    description: 'Thick cut golden brioche soaked in Madagascar vanilla custard, chantilly cream, macerated organic berries, and pure Quebec amber maple syrup.',
    price: 26,
    preparationTime: '15 min',
    calories: 540,
    dietaryTags: ['Vegetarian'],
    ingredients: ['Brioche', 'Madagascar Vanilla', 'Wild Berries', 'Chantilly Cream', 'Quebec Maple Syrup'],
    chefRecommended: false
  },
  {
    id: 'brk-3',
    name: 'Hass Avocado & Heirloom Tartine',
    category: 'breakfast',
    categoryLabel: 'Artisan Breakfast',
    description: 'Toasted sourdough, hand-mashed Hass avocado, shaved radish, toasted pumpkin seeds, organic feta crumble, and chili cold-pressed oil.',
    price: 24,
    preparationTime: '10-15 min',
    calories: 420,
    dietaryTags: ['Vegetarian', 'Organic'],
    ingredients: ['Artisan Sourdough', 'Hass Avocado', 'Greek Feta', 'Radish', 'Pumpkin Seeds'],
    chefRecommended: false
  },

  // Beverages
  {
    id: 'bev-1',
    name: 'Cold-Pressed Royal Golden Elixir',
    category: 'beverages',
    categoryLabel: 'Beverages & Cellar',
    description: 'Freshly pressed organic Valencia oranges, turmeric root, ginger, passionfruit, and royal blossom honey.',
    price: 14,
    preparationTime: '5-10 min',
    calories: 120,
    dietaryTags: ['Vegan', 'Gluten-Free', 'Organic'],
    ingredients: ['Valencia Orange', 'Fresh Turmeric', 'Ginger', 'Passionfruit'],
    chefRecommended: false
  },
  {
    id: 'bev-2',
    name: 'Imperial Jasmine Pearl White Tea',
    category: 'beverages',
    categoryLabel: 'Beverages & Cellar',
    description: 'Hand-rolled silver needle tea pearls infused with night-blooming jasmine flowers, served in a fine bone china pot.',
    price: 16,
    preparationTime: '10 min',
    calories: 0,
    dietaryTags: ['Vegan', 'Gluten-Free', 'Organic'],
    ingredients: ['Hand-rolled Jasmine Pearls', 'Mineral Water'],
    chefRecommended: true
  },
  {
    id: 'bev-3',
    name: 'Smoked Rosemary & Yuzu Botanical Spritz',
    category: 'beverages',
    categoryLabel: 'Beverages & Cellar',
    description: 'Japanese yuzu juice, charred fresh rosemary sprig, sparkling elderflower, and artisanal tonic water.',
    price: 18,
    preparationTime: '8 min',
    calories: 85,
    dietaryTags: ['Vegan', 'Gluten-Free', 'Halal'],
    ingredients: ['Yuzu Juice', 'Smoked Rosemary', 'Elderflower', 'Sparkling Tonic'],
    chefRecommended: true,
    badge: 'Non-Alcoholic Craft'
  },

  // Desserts
  {
    id: 'des-1',
    name: 'Valrhona 70% Dark Chocolate Grand Soufflé',
    category: 'desserts',
    categoryLabel: 'Patisserie & Nightcap',
    description: 'Freshly baked molten dark chocolate soufflé, Tahitian vanilla bean crème anglaise poured tableside, and edible 24k gold leaf.',
    price: 24,
    preparationTime: '20-25 min',
    calories: 490,
    dietaryTags: ['Vegetarian'],
    ingredients: ['Valrhona Guanaja 70%', 'Tahitian Vanilla', 'Egg Whites', '24k Gold Leaf', 'Creme Anglaise'],
    chefRecommended: true,
    badge: 'Baked to Order'
  },
  {
    id: 'des-2',
    name: 'Madagascar Bourbon Vanilla Crème Brûlée',
    category: 'desserts',
    categoryLabel: 'Patisserie & Nightcap',
    description: 'Silky rich egg custard infused with whole Bourbon vanilla beans, brittle caramelized cane sugar crust, and fresh raspberry compote.',
    price: 19,
    preparationTime: '10 min',
    calories: 430,
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    ingredients: ['Bourbon Vanilla Bean', 'Egg Yolks', 'Heavy Cream', 'Turbinado Sugar', 'Raspberry'],
    chefRecommended: false
  },
  {
    id: 'des-3',
    name: 'Artisanal Affineur Cheese Trolley Selection',
    category: 'desserts',
    categoryLabel: 'Patisserie & Nightcap',
    description: 'Four curated aged artisanal cheeses, honeycomb harvested from hotel rooftop hives, fig preserve, and walnut sourdough crisps.',
    price: 28,
    preparationTime: '10 min',
    calories: 520,
    dietaryTags: ['Vegetarian'],
    ingredients: ['Comte 24-Mo', 'Truffled Brie', 'Blue d’Auvergne', 'Honeycomb', 'Fig Jam'],
    chefRecommended: false
  }
];

export const INITIAL_ORDERS: HotelOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'SLS-8821',
    createdAt: '12 mins ago',
    guestName: 'Eleanor Vance',
    roomNumber: 'Penthouse 1402',
    deliveryType: 'room_service',
    billingOption: 'charge_to_room',
    items: [
      {
        item: INITIAL_MENU_ITEMS[0], // Wagyu
        quantity: 1,
        doneness: 'Medium Rare',
        specialInstructions: 'Extra red wine reduction, cloche dome heated',
        cutleryCount: 2
      },
      {
        item: INITIAL_MENU_ITEMS[8], // Jasmine tea
        quantity: 1,
        cutleryCount: 2
      }
    ],
    subtotal: 84,
    serviceCharge: 0,
    total: 84,
    status: 'plating',
    estimatedDeliveryMinutes: 25,
    timeRemainingSeconds: 540,
    butlerName: 'Master Butler William Thornton',
    butlerPhone: 'Ext. 7041',
    notes: 'VIP Gold tier guest. Anniversary stay.'
  },
  {
    id: 'ord-102',
    orderNumber: 'SLS-8822',
    createdAt: '4 mins ago',
    guestName: 'Marcus Sterling',
    roomNumber: 'Suite 804',
    deliveryType: 'room_service',
    billingOption: 'executive_club_credit',
    items: [
      {
        item: INITIAL_MENU_ITEMS[4], // Angus Burger
        quantity: 2,
        doneness: 'Medium',
        specialInstructions: 'No onions on one burger please',
        cutleryCount: 2
      },
      {
        item: INITIAL_MENU_ITEMS[9], // Spritz
        quantity: 2,
        cutleryCount: 2
      }
    ],
    subtotal: 108,
    serviceCharge: 0,
    total: 108,
    status: 'in_kitchen',
    estimatedDeliveryMinutes: 20,
    timeRemainingSeconds: 960,
    butlerName: 'Concierge Butler Cedric Hall',
    butlerPhone: 'Ext. 7042',
    notes: 'Executive Club privileges verified.'
  },
  {
    id: 'ord-103',
    orderNumber: 'SLS-8819',
    createdAt: '35 mins ago',
    guestName: 'Sophia Lindqvist',
    roomNumber: 'Deluxe Room 318',
    deliveryType: 'room_service',
    billingOption: 'charge_to_room',
    items: [
      {
        item: INITIAL_MENU_ITEMS[6], // Royal Eggs Benedict
        quantity: 2,
        specialInstructions: 'Gluten-free bread if possible, extra lemon',
        cutleryCount: 2
      },
      {
        item: INITIAL_MENU_ITEMS[7], // Golden Elixir
        quantity: 2,
        cutleryCount: 2
      }
    ],
    subtotal: 96,
    serviceCharge: 0,
    total: 96,
    status: 'delivered',
    estimatedDeliveryMinutes: 25,
    timeRemainingSeconds: 0,
    butlerName: 'Butler Julian Rossi',
    butlerPhone: 'Ext. 7044',
    notes: 'Delivered to room table with fresh floral arrangement.'
  }
];

export const INITIAL_RESERVATIONS: TableReservation[] = [
  {
    id: 'res-501',
    reservationCode: 'RES-9014',
    guestName: 'Lord & Lady Alistair',
    roomNumber: 'Presidential Suite 1501',
    contactPhone: '+1 (555) 234-8901',
    venue: 'Rooftop Horizon Terrace',
    date: 'Today, 20:30',
    time: '20:30',
    guestsCount: 4,
    occasion: 'Anniversary',
    specialRequests: 'Private corner alcove table with sunset and harbor skyline view',
    status: 'Confirmed',
    createdAt: '2 hours ago'
  },
  {
    id: 'res-502',
    reservationCode: 'RES-9015',
    guestName: 'Dr. Hiroshi Tanaka',
    roomNumber: 'Suite 912',
    contactPhone: '+1 (555) 892-4112',
    venue: 'The Grand Conservatory',
    date: 'Tomorrow, 19:00',
    time: '19:00',
    guestsCount: 2,
    occasion: 'Business Dinner',
    specialRequests: 'Quiet booth, sommelier tasting pairing requested',
    status: 'Confirmed',
    createdAt: '4 hours ago'
  }
];
