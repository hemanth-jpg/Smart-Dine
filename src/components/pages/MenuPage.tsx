import React, { useState, useMemo } from 'react';
import { MenuItem, DietaryTag, CartItem } from '../../types/hotel';
import { CulinaryVisual } from '../CulinaryVisual';
import { Search, Filter, Sparkles, Plus, Clock, ShoppingBag } from 'lucide-react';

interface Props {
  menuItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const MenuPage: React.FC<Props> = ({
  menuItems,
  onSelectItem,
  onQuickAdd,
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'signatures', label: 'Michelin Signatures' },
    { id: 'mains', label: 'All-Day Mains' },
    { id: 'breakfast', label: 'Artisan Breakfast' },
    { id: 'beverages', label: 'Beverages & Cellar' },
    { id: 'desserts', label: 'Patisserie & Nightcap' },
  ];

  const dietaryFilters = ['All', 'Chef Special', 'Vegetarian', 'Gluten-Free', 'Halal', 'Organic'];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Dietary match
      if (selectedDietary !== 'All' && !(item.dietaryTags && item.dietaryTags.includes(selectedDietary as DietaryTag))) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesIngr = item.ingredients ? item.ingredients.some((i: string) => i.toLowerCase().includes(query)) : false;
        if (!matchesName && !matchesDesc && !matchesIngr) {
          return false;
        }
      }
      return true;
    });
  }, [menuItems, selectedCategory, selectedDietary, searchQuery]);

  return (
    <div className="space-y-8 pb-24">
      
      {/* Page Header */}
      <div className="border-b border-stone-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
              In-Room Dining Catalog
            </div>
            <h1 className="text-3xl sm:text-4xl font-luxury font-bold text-stone-100 mt-1">
              Curated Haute Cuisine Menu
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Hand-crafted dishes prepared with peak seasonal ingredients. Billed directly to your room folio upon checkout.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-stone-400 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">
              <span className="text-stone-500">Service: </span>
              <span className="text-emerald-400 font-semibold">24/7 Cloche Delivery</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients (e.g. Wagyu, Truffle, Caviar)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-[#d4af37] placeholder:text-stone-500"
            />
          </div>

          {/* Category Filter Pills / Buttons (Functional filter buttons per Section 1.A) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#d4af37] text-stone-950 shadow-sm'
                    : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Dietary Preference Selectors */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto text-xs text-stone-400">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold shrink-0">
            Dietary:
          </span>
          {dietaryFilters.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedDietary(tag)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors shrink-0 ${
                selectedDietary === tag
                  ? 'bg-stone-800 text-stone-100 font-medium'
                  : 'hover:text-stone-200 text-stone-500'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Item Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-2xl bg-[#11141a] border border-stone-800">
          <div className="text-stone-400 text-sm font-medium">
            No dishes found matching your current filter criteria.
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDietary('All');
              setSearchQuery('');
            }}
            className="mt-3 text-xs text-[#d4af37] hover:underline font-semibold"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-[#11141a] border border-stone-800/80 overflow-hidden hover:border-stone-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <CulinaryVisual item={item} className="h-48" />

                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-luxury font-bold text-stone-100 group-hover:text-[#d4af37] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-base font-semibold tabular-nums text-[#d4af37]">
                      ${item.price}
                    </span>
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed min-h-[3rem]">
                    {item.description}
                  </p>

                  {/* Clean unboxed text metadata per Section 1.A */}
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-1">
                    {item.dietaryTags && item.dietaryTags.map((tag: string, idx: number) => (
                      <React.Fragment key={tag}>
                        <span>{tag}</span>
                        {idx < (item.dietaryTags?.length ?? 1) - 1 && <span>·</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="text-[11px] text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-500" />
                    <span>Prep: {item.preparationTime || item.time || '15 min'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectItem(item)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-800 transition-colors text-center"
                >
                  Custom Preferences
                </button>
                <button
                  type="button"
                  onClick={() => onQuickAdd(item)}
                  className="py-2.5 px-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 text-xs font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to Tray
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Bottom Bar if Cart Has Items */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[90%] bg-[#121620]/95 backdrop-blur-md border border-[#d4af37]/40 shadow-2xl rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37] text-stone-950 flex items-center justify-center font-bold text-sm">
              {cartCount}
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-200">
                {cartCount} {cartCount === 1 ? 'Dish' : 'Dishes'} in In-Room Tray
              </div>
              <div className="text-[11px] text-stone-400">
                Total Folio: <span className="text-[#d4af37] font-semibold tabular-nums">${cartTotal}</span> (Zero Card Payment)
              </div>
            </div>
          </div>

          <button
            onClick={onOpenCart}
            className="py-2.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shadow"
          >
            <ShoppingBag className="w-4 h-4" />
            Review & Dispatch
          </button>
        </div>
      )}

    </div>
  );
};
