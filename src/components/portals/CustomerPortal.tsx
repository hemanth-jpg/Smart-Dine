import React, { useState, useMemo } from 'react';
import { SmartMenuItem, OrderItemDetail, DietaryTag } from '../../types/hotel';
import { sound } from '../../utils/audio';
import { 
  Search, 
  Sparkles, 
  Plus, 
  Clock, 
  Flame, 
  Bell, 
  Droplets, 
  Utensils, 
  Receipt, 
  CheckCircle2,
  ShieldCheck,
  Star,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  CookingPot,
  Heart,
  QrCode,
  Scan,
  Dumbbell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  menu: SmartMenuItem[];
  onOpenItemModal: (item: SmartMenuItem) => void;
  onQuickAdd: (item: SmartMenuItem) => void;
  onRequestService: (type: 'Waiter Call' | 'Water Refill' | 'Silverware / Napkins' | 'Bill / Folio Summary') => void;
  currentTable: string;
  currentRoom: string;
  onOpenTableModal: () => void;
  onOpenQrModal?: () => void;
}

export const CustomerPortal: React.FC<Props> = ({
  menu,
  onOpenItemModal,
  onQuickAdd,
  onRequestService,
  currentTable,
  currentRoom,
  onOpenTableModal,
  onOpenQrModal,
}) => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<'All' | 'Veg' | 'Non-veg'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceActionNotice, setServiceActionNotice] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string | number, boolean>>({});

  const cuisines = ['All', 'Indian', 'Chinese', 'Fitness'];
  const categories = ['All', 'Main Course', 'Biryani', 'Starters', 'Breads', 'Desserts', 'Fitness'];

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      // Cuisine filter
      if (selectedCuisine !== 'All') {
        if (selectedCuisine === 'Indian' && item.cuisine !== 'Indian') return false;
        if (selectedCuisine === 'Chinese' && item.cuisine !== 'Chinese') return false;
        if (selectedCuisine === 'Fitness' && item.cuisine !== 'Fitness' && item.category !== 'Fitness') return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      // Veg / Non-veg
      if (selectedType !== 'All' && item.type !== selectedType) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesCuisine = item.cuisine?.toLowerCase().includes(q);
        const matchesIng = item.ingredients?.some((i) => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesCuisine && !matchesIng) return false;
      }

      return true;
    });
  }, [menu, selectedCuisine, selectedCategory, selectedType, searchQuery]);

  const triggerServiceRequest = (type: 'Waiter Call' | 'Water Refill' | 'Silverware / Napkins' | 'Bill / Folio Summary') => {
    sound.playAlarm(); // Play priority alarm sound when alert comes to staff / guest
    onRequestService(type);
    setServiceActionNotice(`🚨 Alert Sent: ${type} alarm transmitted to floor butler for Table ${currentTable} & ${currentRoom}`);
    setTimeout(() => {
      setServiceActionNotice(null);
    }, 4500);
  };

  const toggleFavorite = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playTick();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-10 pb-28">
      
      {/* 1. Futuristic Luxury Hero Banner with QR Table Login Callout */}
      <section className="relative overflow-hidden rounded-3xl glass-panel-elevated p-6 sm:p-10 border border-white/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#d4af37]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#38bdf8]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider text-[#d4af37] uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SmartDine Luxury Dining · Table #{currentTable} Active</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-luxury font-bold text-white tracking-tight leading-tight">
              Indian, Chinese &amp; Fitness Delights, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#fbbf24]">
                Fired Straight to Your Table.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
              Authentic Indian curries, wok-fired Chinese dishes, and clean high-protein fitness meal preps. 
              Enjoy seamless dining with zero payment required upfront—all charges post directly to your table or room folio.
            </p>

            {/* Table Number & Website QR Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  sound.playTick();
                  onOpenTableModal();
                }}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#e0be4d] text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:brightness-110 transition-all cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>Table #{currentTable} (Click to Change)</span>
              </button>

              {onOpenQrModal && (
                <button
                  onClick={() => {
                    sound.playTick();
                    onOpenQrModal();
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#38bdf8]" />
                  <span>Scan Website QR Code</span>
                </button>
              )}

              <div className="text-xs text-stone-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Folio: Table {currentTable} ({currentRoom})</span>
              </div>
            </div>
          </div>

          {/* Quick Dining Location & Table Info Card */}
          <div className="p-5 rounded-2xl bg-black/70 border border-white/15 space-y-4 shrink-0 min-w-[280px] shadow-2xl">
            <div className="flex items-center justify-between text-xs text-stone-400 border-b border-white/10 pb-2.5">
              <span className="font-semibold text-stone-300">Your Active Table:</span>
              <button
                onClick={() => {
                  sound.playTick();
                  onOpenTableModal();
                }}
                className="text-[11px] text-[#d4af37] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Utensils className="w-3 h-3" /> Change Table <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <span>Table {currentTable}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    Active
                  </span>
                </div>
                <div className="text-xs text-stone-400 font-medium">
                  {currentRoom} · Direct Folio Service
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero card payment needed</span>
              </div>
              {onOpenQrModal && (
                <button
                  onClick={() => {
                    sound.playTick();
                    onOpenQrModal();
                  }}
                  className="text-[11px] text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <QrCode className="w-3 h-3" /> Website QR
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floor Butler Instant Service Request Bar */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Instant Floor Butler Assistance (1-Tap Floor Dispatch)</span>
          </h2>
          <span className="text-[11px] text-stone-500">Zero Wait Time</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerServiceRequest('Waiter Call')}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-3 transition-colors text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Call Waiter</div>
              <div className="text-[10px] text-stone-400">Summon to table</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerServiceRequest('Water Refill')}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-3 transition-colors text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Water Refill</div>
              <div className="text-[10px] text-stone-400">Still or Sparkling</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerServiceRequest('Silverware / Napkins')}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-3 transition-colors text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Extra Cutlery</div>
              <div className="text-[10px] text-stone-400">Plates & Linen</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerServiceRequest('Bill / Folio Summary')}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-3 transition-colors text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Request Bill</div>
              <div className="text-[10px] text-stone-400">Cash / Folio Check</div>
            </div>
          </motion.button>
        </div>

        {/* Live Service Feedback Banner */}
        <AnimatePresence>
          {serviceActionNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 font-medium shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{serviceActionNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. Primary Cuisine Filter (Indian, Chinese, Fitness) & Search */}
      <section className="space-y-4">
        
        {/* Row 1: Search & Cuisine Selector */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Cuisine Origin Pill Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
              Cuisine:
            </span>
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => {
                  sound.playTick();
                  setSelectedCuisine(c);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCuisine === c
                    ? c === 'Indian'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md scale-[1.02]'
                      : c === 'Chinese'
                        ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-md scale-[1.02]'
                        : c === 'Fitness'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 shadow-md scale-[1.02]'
                          : 'bg-[#d4af37] text-stone-950 shadow-md scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                }`}
              >
                {c === 'Indian' && '🍛 Indian Cuisine'}
                {c === 'Chinese' && '🥢 Chinese Cuisine'}
                {c === 'Fitness' && '💪 Fitness & Nutrition'}
                {c === 'All' && '✨ All Cuisines'}
              </button>
            ))}
          </div>

          {/* Search Bar & Veg/Non-Veg */}
          <div className="flex items-center gap-2 self-stretch md:self-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search butter chicken, noodles, salmon..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 shrink-0">
              {(['All', 'Veg', 'Non-veg'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    sound.playTick();
                    setSelectedType(t);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === t
                      ? t === 'Veg'
                        ? 'bg-emerald-500 text-stone-950 shadow-md font-bold'
                        : t === 'Non-veg'
                          ? 'bg-rose-500 text-white shadow-md font-bold'
                          : 'bg-white text-stone-950 shadow-md font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {t === 'Veg' && '🟢 '}
                  {t === 'Non-veg' && '🔴 '}
                  {t}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Row 2: Secondary Category Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playTick();
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white/20 text-white border border-white/30 font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-stone-400 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Food Cards Grid with High-Resolution Photography */}
      <section>
        {filteredMenu.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl glass-panel border border-white/10 space-y-3">
            <CookingPot className="w-10 h-10 text-stone-500 mx-auto" />
            <div className="text-sm font-semibold text-stone-300">
              No dishes found matching your current filter.
            </div>
            <button
              onClick={() => {
                setSelectedCuisine('All');
                setSelectedCategory('All');
                setSelectedType('All');
                setSearchQuery('');
              }}
              className="text-xs text-[#d4af37] hover:underline font-semibold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item, idx) => {
              const isFav = !!favorites[item.id];
              const dishImage = item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
              const macros = item.macros;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.4) }}
                  whileHover={{ y: -4 }}
                  className="group rounded-3xl glass-panel hover:glass-panel-elevated border border-white/10 hover:border-[#d4af37]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl"
                >
                  <div>
                    {/* Real Food Photography Visual Header */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-900 border-b border-white/5">
                      <img
                        src={dishImage}
                        alt={item.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none" />

                      {/* Top Row Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-xs">
                          <span className={`w-2 h-2 rounded-full ${item.type === 'Veg' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span className="font-semibold text-stone-200 text-[11px]">{item.type}</span>
                          <span className="text-stone-500">·</span>
                          <span className={`text-[11px] font-bold ${
                            item.cuisine === 'Indian' ? 'text-amber-400' :
                            item.cuisine === 'Chinese' ? 'text-rose-400' :
                            'text-emerald-400'
                          }`}>
                            {item.cuisine || item.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.rating && (
                            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[11px] text-amber-300 font-semibold tabular-nums">
                              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                              <span>{item.rating}</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={(e) => toggleFavorite(item.id, e)}
                            className="p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-stone-300 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Favorite dish"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Image Stats (Prep Time & Calories) */}
                      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] text-stone-300 z-10">
                        <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10">
                          <Clock className="w-3 h-3 text-[#d4af37]" />
                          <span>{item.time || item.preparationTime || '15-20 min'}</span>
                        </div>
                        {item.calories && (
                          <div className="bg-black/65 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 tabular-nums text-stone-300 text-[10px]">
                            {item.calories} kcal
                            {macros && <span className="text-emerald-400 ml-1 font-bold">· {macros.protein}g P</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dish Details */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-luxury font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                          {item.name}
                        </h3>
                        <span className="text-lg font-bold tabular-nums text-[#d4af37] font-mono shrink-0">
                          ₹{item.price}
                        </span>
                      </div>

                      <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Macro highlight if available */}
                      {macros && (
                        <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-stone-400">
                          <span className="text-emerald-400 font-bold">{macros.protein}g Protein</span>
                          <span className="text-stone-600">|</span>
                          <span>{macros.carbs}g Carbs</span>
                          <span className="text-stone-600">|</span>
                          <span>{macros.fats}g Fats</span>
                        </div>
                      )}

                      {item.ingredients && (
                        <div className="text-[11px] text-stone-400 pt-1 truncate">
                          <span className="text-stone-500">Key: </span>
                          {item.ingredients.join(' · ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playTick();
                        onOpenItemModal(item);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
                      <span>Customize</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playSuccess();
                        onQuickAdd(item);
                      }}
                      className="py-2.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
