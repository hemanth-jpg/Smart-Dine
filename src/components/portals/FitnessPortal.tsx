import React, { useState, useMemo } from 'react';
import { SmartMenuItem, OrderItemDetail, DietaryTag } from '../../types/hotel';
import { sound } from '../../utils/audio';
import { 
  Flame, 
  Dumbbell, 
  HeartPulse, 
  Apple, 
  Plus, 
  SlidersHorizontal, 
  Clock, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Droplet, 
  Layers,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  menu: SmartMenuItem[];
  cart: OrderItemDetail[];
  onOpenItemModal: (item: SmartMenuItem) => void;
  onQuickAdd: (item: SmartMenuItem) => void;
  onRequestService: (type: 'Waiter Call' | 'Water Refill' | 'Silverware / Napkins' | 'Bill / Folio Summary') => void;
  currentTable: string;
  currentRoom: string;
  onOpenTableModal: () => void;
}

export const FitnessPortal: React.FC<Props> = ({
  menu,
  cart,
  onOpenItemModal,
  onQuickAdd,
  onRequestService,
  currentTable,
  currentRoom,
  onOpenTableModal,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<'All' | 'High Protein' | 'Lean Cut' | 'Keto' | 'Clean Fuel'>('All');
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState<'All' | 'Indian' | 'Chinese' | 'Fitness'>('All');
  const [targetCalories, setTargetCalories] = useState<number>(2000);
  const [targetProtein, setTargetProtein] = useState<number>(120);

  // Compute live cart macros
  const cartMacros = useMemo(() => {
    return cart.reduce(
      (acc, cartItem) => {
        const itemMacros = cartItem.item.macros || {
          protein: 20,
          carbs: 30,
          fats: 10,
          calories: cartItem.item.calories || 350,
        };
        return {
          protein: acc.protein + (itemMacros.protein || 0) * cartItem.quantity,
          carbs: acc.carbs + (itemMacros.carbs || 0) * cartItem.quantity,
          fats: acc.fats + (itemMacros.fats || 0) * cartItem.quantity,
          calories: acc.calories + (cartItem.item.calories || itemMacros.calories || 300) * cartItem.quantity,
        };
      },
      { protein: 0, carbs: 0, fats: 0, calories: 0 }
    );
  }, [cart]);

  // Filter fitness and macro-conscious dishes
  const fitnessDishes = useMemo(() => {
    return menu.filter((item) => {
      // Cuisine filter
      if (selectedCuisineFilter !== 'All') {
        if (selectedCuisineFilter === 'Indian' && item.cuisine !== 'Indian') return false;
        if (selectedCuisineFilter === 'Chinese' && item.cuisine !== 'Chinese') return false;
        if (selectedCuisineFilter === 'Fitness' && item.cuisine !== 'Fitness' && item.category !== 'Fitness') return false;
      }

      // Goal-based filtering
      const protein = item.macros?.protein || 0;
      const calories = item.calories || item.macros?.calories || 500;
      const carbs = item.macros?.carbs || 50;

      if (selectedGoal === 'High Protein' && protein < 25) return false;
      if (selectedGoal === 'Lean Cut' && calories > 400) return false;
      if (selectedGoal === 'Keto' && carbs > 20) return false;
      if (selectedGoal === 'Clean Fuel' && !item.dietaryTags?.includes('Clean Fuel')) return false;

      return true;
    });
  }, [menu, selectedGoal, selectedCuisineFilter]);

  return (
    <div className="space-y-10 pb-28">
      
      {/* 1. Futuristic Hero Banner: Fitness & Macro Lab */}
      <section className="relative overflow-hidden rounded-3xl glass-panel-elevated p-6 sm:p-10 border border-white/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#38bdf8]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-400 uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SmartDine Wellness · Macro & Fitness Nutrition Kitchen</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-luxury font-bold text-white tracking-tight leading-tight">
              Gourmet Precision Fuel, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Crafted For Your Body Goals.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
              Engineered for athletes, hotel gym-goers, and clean eaters. Explore high-protein Indian grills, 
              steamed Asian delicacies, and nutrient-dense macro bowls with certified calorie and macronutrient breakdowns.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" /> High Protein (30g+ / dish)
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Controlled Calories
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" /> Clean Unprocessed Oils
              </span>
            </div>
          </div>

          {/* Real-time Live Cart Macro Dashboard */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/70 border border-emerald-500/30 space-y-4 shrink-0 min-w-[290px] shadow-2xl">
            <div className="flex items-center justify-between text-xs text-stone-300 border-b border-white/10 pb-2.5">
              <span className="font-semibold flex items-center gap-1.5 text-white">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Your Tray Macro Total</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Live Sync
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-stone-400 font-medium">Protein</div>
                <div className="text-lg font-bold text-emerald-400 font-mono">
                  {cartMacros.protein}g
                </div>
                <div className="text-[9px] text-stone-500">Target: {targetProtein}g</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-stone-400 font-medium">Calories</div>
                <div className="text-lg font-bold text-amber-400 font-mono">
                  {cartMacros.calories}
                </div>
                <div className="text-[9px] text-stone-500">Target: {targetCalories}</div>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-stone-400 font-medium">Carbs</div>
                <div className="text-sm font-bold text-sky-400 font-mono">
                  {cartMacros.carbs}g
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-stone-400 font-medium">Fats</div>
                <div className="text-sm font-bold text-purple-400 font-mono">
                  {cartMacros.fats}g
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-1 border-t border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Table {currentTable} · No upfront card payment required</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Fitness Goal & Cuisine Segmented Filter Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Fitness Goal Pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-stone-400 flex items-center gap-1">
              <Dumbbell className="w-3 h-3 text-emerald-400" /> Filter by Fitness Goal:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'High Protein', 'Lean Cut', 'Keto', 'Clean Fuel'] as const).map((goal) => (
                <button
                  key={goal}
                  onClick={() => {
                    sound.playTick();
                    setSelectedGoal(goal);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedGoal === goal
                      ? 'bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20 scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10'
                  }`}
                >
                  {goal === 'High Protein' && '💪 '}
                  {goal === 'Lean Cut' && '🔥 '}
                  {goal === 'Keto' && '🥑 '}
                  {goal === 'Clean Fuel' && '🌱 '}
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Filter */}
          <div className="space-y-1.5 self-start md:self-auto">
            <span className="text-[11px] uppercase font-bold tracking-wider text-stone-400">
              Cuisine Origin:
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
              {(['All', 'Indian', 'Chinese', 'Fitness'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    sound.playTick();
                    setSelectedCuisineFilter(c);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCuisineFilter === c
                      ? 'bg-white text-stone-950 font-bold shadow'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Nutrition & Macro Food Cards Grid */}
      <section>
        {fitnessDishes.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl glass-panel border border-white/10 space-y-3">
            <Apple className="w-10 h-10 text-stone-500 mx-auto" />
            <div className="text-sm font-semibold text-stone-300">
              No fitness dishes match the selected combination.
            </div>
            <button
              onClick={() => {
                setSelectedGoal('All');
                setSelectedCuisineFilter('All');
              }}
              className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              Reset Fitness Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fitnessDishes.map((item, idx) => {
              const macros = item.macros || {
                protein: 24,
                carbs: 28,
                fats: 10,
                calories: item.calories || 320,
              };

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.4) }}
                  whileHover={{ y: -4 }}
                  className="group rounded-3xl glass-panel hover:glass-panel-elevated border border-white/10 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl"
                >
                  <div>
                    {/* Unique Food Photo Header */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-900 border-b border-white/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/60 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-xs">
                          <span className={`w-2 h-2 rounded-full ${item.type === 'Veg' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span className="font-semibold text-stone-200 text-[11px]">{item.type}</span>
                          <span className="text-stone-500">·</span>
                          <span className="text-emerald-300 font-semibold text-[11px]">{item.cuisine || item.category}</span>
                        </div>

                        <div className="flex items-center gap-1 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/40 text-xs text-emerald-300 font-bold tabular-nums">
                          <Dumbbell className="w-3 h-3 text-emerald-400" />
                          <span>{macros.protein}g Protein</span>
                        </div>
                      </div>

                      {/* Bottom Image Stats (Calories & Prep Time) */}
                      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] text-stone-300 z-10">
                        <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{item.time || item.preparationTime || '15 min'}</span>
                        </div>
                        <div className="bg-amber-500/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-amber-500/30 tabular-nums text-amber-300 text-[11px] font-bold">
                          {macros.calories} kcal
                        </div>
                      </div>
                    </div>

                    {/* Dish Metadata & Macro Pill Breakdown */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-luxury font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                          {item.name}
                        </h3>
                        <span className="text-lg font-bold tabular-nums text-emerald-400 font-mono shrink-0">
                          ₹{item.price}
                        </span>
                      </div>

                      <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Macro Breakdown Bar */}
                      <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                          <div className="text-[10px] text-emerald-300 font-sans font-semibold">PROTEIN</div>
                          <div className="text-xs font-bold text-white">{macros.protein}g</div>
                        </div>
                        <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/25">
                          <div className="text-[10px] text-sky-300 font-sans font-semibold">CARBS</div>
                          <div className="text-xs font-bold text-white">{macros.carbs}g</div>
                        </div>
                        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/25">
                          <div className="text-[10px] text-purple-300 font-sans font-semibold">FATS</div>
                          <div className="text-xs font-bold text-white">{macros.fats}g</div>
                        </div>
                      </div>

                      {item.ingredients && (
                        <div className="text-[11px] text-stone-400 pt-1 truncate">
                          <span className="text-stone-500">Ingredients: </span>
                          {item.ingredients.join(' · ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
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
                      <span>Custom Prep</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playSuccess();
                        onQuickAdd(item);
                      }}
                      className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-stone-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add to Tray</span>
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
