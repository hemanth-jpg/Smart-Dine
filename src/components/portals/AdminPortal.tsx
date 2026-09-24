import React, { useState } from 'react';
import { SmartMenuItem, SmartDineOrder, StaffAccount } from '../../types/hotel';
import { sound } from '../../utils/audio';
import { 
  BarChart3, 
  TrendingUp, 
  Plus, 
  Sparkles, 
  Utensils, 
  Layers, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Download,
  KeyRound,
  LogOut,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  menu: SmartMenuItem[];
  orders: SmartDineOrder[];
  onAddMenuItem: (item: Omit<SmartMenuItem, 'id'>) => void;
  authenticatedStaff?: StaffAccount | null;
  onLogoutTerminal?: () => void;
}

export const AdminPortal: React.FC<Props> = ({
  menu,
  orders,
  onAddMenuItem,
  authenticatedStaff,
  onLogoutTerminal,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'menu'>('analytics');

  // New Menu Item Draft State
  const [draftName, setDraftName] = useState('');
  const [draftCategory, setDraftCategory] = useState<SmartMenuItem['category']>('Main Course');
  const [draftPrice, setDraftPrice] = useState('240');
  const [draftTime, setDraftTime] = useState('15-20 min');
  const [draftType, setDraftType] = useState<'Veg' | 'Non-veg'>('Veg');
  const [draftImage, setDraftImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
  const [draftDescription, setDraftDescription] = useState('');
  const [publishSuccessNotice, setPublishSuccessNotice] = useState<string | null>(null);

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);

  const revenueBars = [
    { day: 'Mon', height: 54, val: '₹22,400' },
    { day: 'Tue', height: 72, val: '₹31,200' },
    { day: 'Wed', height: 48, val: '₹19,800' },
    { day: 'Thu', height: 87, val: '₹38,900' },
    { day: 'Fri', height: 68, val: '₹29,500' },
    { day: 'Sat', height: 95, val: '₹44,800' },
    { day: 'Sun', height: 78, val: '₹34,600' },
  ];

  const handlePublishMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftName.trim() || !draftPrice || !draftDescription.trim()) return;

    sound.playSuccess();
    onAddMenuItem({
      name: draftName.trim(),
      category: draftCategory,
      price: Number(draftPrice),
      time: draftTime,
      image: draftImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      type: draftType,
      rating: '4.9',
      tone: draftType === 'Veg' ? 'moss' : 'clay',
      description: draftDescription.trim(),
      calories: 450,
      chefRecommended: true,
      dietaryTags: [draftType]
    });

    setPublishSuccessNotice(`"${draftName.trim()}" published live to guest menus!`);
    setDraftName('');
    setDraftDescription('');
    setTimeout(() => {
      setPublishSuccessNotice(null);
    }, 4500);
  };

  return (
    <div className="space-y-8 pb-28">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#d4af37]">
            <KeyRound className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Executive Admin Authenticated · ID: <b>{authenticatedStaff?.id || 'ADM-1001'}</b></span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-luxury font-bold text-white mt-1">
            Admin & Sales Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Hotel food operations telemetry, sales mix, and real-time live menu broadcasting.
          </p>
        </div>

        {/* Staff badge & Tab switch */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {authenticatedStaff && (
            <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs self-start sm:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
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
              onClick={() => { sound.playTick(); setActiveTab('analytics'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#d4af37] text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Telemetry</span>
            </button>

            <button
              onClick={() => { sound.playTick(); setActiveTab('menu'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-[#d4af37] text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Menu Lab ({menu.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Financial & Food Performance Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-1 shadow-lg">
              <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Today&apos;s Revenue</div>
              <div className="text-3xl font-bold font-mono text-white">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-emerald-400 font-medium pt-1">↑ +14.2% vs last week</div>
            </div>

            <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-1 shadow-lg">
              <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Active Tickets</div>
              <div className="text-3xl font-bold font-mono text-[#d4af37]">{orders.length}</div>
              <div className="text-xs text-stone-400 pt-1">Across 24 floor tables</div>
            </div>

            <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-1 shadow-lg">
              <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Catalog Offerings</div>
              <div className="text-3xl font-bold font-mono text-white">{menu.length}</div>
              <div className="text-xs text-sky-400 pt-1">Instant broadcasting active</div>
            </div>

            <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-1 shadow-lg">
              <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Avg Dining Prep</div>
              <div className="text-3xl font-bold font-mono text-white">14.6 min</div>
              <div className="text-xs text-emerald-400 pt-1">Under 20m target</div>
            </div>
          </div>

          {/* Revenue Telemetry Bar Graph */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-luxury font-bold text-white">7-Day Dining Revenue Curve</h3>
                <p className="text-xs text-stone-400">Peak dining hours between 19:30 - 22:00 IST</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#d4af37] px-3 py-1 rounded-full bg-[#d4af37]/15">
                Week 38
              </span>
            </div>

            <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-4 border-b border-white/10 pb-4">
              {revenueBars.map((b) => (
                <div key={b.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity">
                    {b.val}
                  </span>
                  <div className="w-full max-w-[48px] bg-white/5 rounded-t-xl overflow-hidden h-36 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${b.height}%` }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="w-full bg-gradient-to-t from-[#d4af37] to-[#f59e0b] group-hover:brightness-110 transition-all rounded-t-lg"
                    />
                  </div>
                  <span className="text-xs font-semibold text-stone-400">{b.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Menu Lab & Real-Time Item Creator */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Creator Form (1 col) */}
          <div className="p-6 rounded-3xl glass-panel-elevated border border-white/10 space-y-5 shadow-2xl">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37]">
                Live Broadcaster
              </div>
              <h3 className="text-xl font-luxury font-bold text-white mt-0.5">
                Publish New Dish
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Dishes immediately appear on all active guest tablets and phones.
              </p>
            </div>

            <form onSubmit={handlePublishMenu} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-stone-300 font-semibold">Dish Title</label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="e.g. Saffron Chilean Sea Bass"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300 font-semibold">Category</label>
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/10 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Main Course">Main Course</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Starters">Starters</option>
                    <option value="Breads">Breads</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Signatures">Signatures</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 font-semibold">Price (₹)</label>
                  <input
                    type="number"
                    value={draftPrice}
                    onChange={(e) => setDraftPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-semibold flex items-center justify-between">
                  <span>Photo URL</span>
                  <span className="text-[10px] text-stone-500">Unsplash/Direct</span>
                </label>
                <input
                  type="url"
                  value={draftImage}
                  onChange={(e) => setDraftImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Instant Image Preview */}
              {draftImage && (
                <div className="relative h-28 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                  <img
                    src={draftImage}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                    <span className="text-[10px] text-stone-300 font-mono">Live Photo Preview</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300 font-semibold">Dietary Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDraftType('Veg')}
                      className={`flex-1 py-1.5 rounded-lg font-semibold border ${
                        draftType === 'Veg'
                          ? 'bg-emerald-500 text-stone-950 border-emerald-500 font-bold'
                          : 'bg-white/5 text-stone-400 border-white/10'
                      }`}
                    >
                      Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraftType('Non-veg')}
                      className={`flex-1 py-1.5 rounded-lg font-semibold border ${
                        draftType === 'Non-veg'
                          ? 'bg-rose-500 text-white border-rose-500 font-bold'
                          : 'bg-white/5 text-stone-400 border-white/10'
                      }`}
                    >
                      Non-veg
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 font-semibold">Prep Time</label>
                  <input
                    type="text"
                    value={draftTime}
                    onChange={(e) => setDraftTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-semibold">Culinary Description</label>
                <textarea
                  rows={2}
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  placeholder="Aromatic notes, preparation style, pairings..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 font-bold text-xs transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Publish to Live Menu</span>
              </button>

              <AnimatePresence>
                {publishSuccessNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{publishSuccessNotice}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Current Live Menu Catalog (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-luxury font-bold text-white uppercase tracking-wider">
                Live Menu Catalog ({menu.length} Items Active)
              </h3>
              <span className="text-xs text-[#d4af37] font-semibold">Broadcasting to Tables</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[640px] overflow-y-auto pr-1">
              {menu.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3 flex flex-col justify-between shadow-lg"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-white truncate text-xs">{item.name}</span>
                        <span className="font-mono font-bold text-[#d4af37] text-xs shrink-0">₹{item.price}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">{item.category} · {item.type}</div>
                      <p className="text-[10px] text-stone-500 line-clamp-2 mt-1">{item.description}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400">
                    <span>Prep: {item.time || item.preparationTime}</span>
                    <span className="text-emerald-400 font-medium">● Live</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
