import React, { useState } from 'react';
import { AppPortal, StaffAccount } from '../types/hotel';
import { STAFF_ACCOUNTS, DEMO_LOGIN_IDS } from '../data/smartDineData';
import { sound } from '../utils/audio';
import { 
  ShoppingBag, 
  Utensils, 
  Dumbbell, 
  ChefHat, 
  UserCheck, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  activePortal: AppPortal;
  onSelectPortal: (portal: AppPortal) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  currentTable: string;
  currentRoom: string;
  activeOrdersCount: number;
  pendingRequestsCount: number;
  staffUser: StaffAccount | null;
  onStaffLogin: (account: StaffAccount) => void;
  onStaffLogout: () => void;
  onOpenTableModal: () => void;
  onOpenQrModal?: () => void;
  isPortalAuthenticated: (portal: AppPortal) => boolean;
}

export const SmartHeader: React.FC<Props> = ({
  activePortal,
  onSelectPortal,
  cartCount,
  cartTotal,
  onOpenCart,
  currentTable,
  currentRoom,
  activeOrdersCount,
  pendingRequestsCount,
  staffUser,
  onStaffLogin,
  onStaffLogout,
  onOpenTableModal,
  onOpenQrModal,
  isPortalAuthenticated,
}) => {
  const [showStaffMenu, setShowStaffMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      sound.playSuccess();
    }
  };

  const navItems = [
    { 
      id: 'customer' as AppPortal, 
      label: 'Dining & Menu', 
      icon: Utensils,
      isPublic: true,
      sublabel: 'Public · Indian & Chinese'
    },
    { 
      id: 'fitness' as AppPortal, 
      label: 'Fitness & Nutrition', 
      icon: Dumbbell, 
      isPublic: true,
      sublabel: 'High Protein & Macros'
    },
    { 
      id: 'kitchen' as AppPortal, 
      label: 'Kitchen KDS', 
      icon: ChefHat,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      isPublic: false,
      sublabel: 'Chef ID'
    },
    { 
      id: 'waiter' as AppPortal, 
      label: 'Waiter Floor', 
      icon: UserCheck,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      isPublic: false,
      sublabel: 'Waiter ID'
    },
    { 
      id: 'admin' as AppPortal, 
      label: 'Management', 
      icon: BarChart3,
      isPublic: false,
      sublabel: 'Admin ID'
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080a0f]/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Hotel Brand Logo with Table QR Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playTick();
              onSelectPortal('customer');
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#d4af37] via-[#f59e0b] to-[#fbbf24] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090b10] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
              </div>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-luxury font-bold tracking-tight text-white group-hover:text-[#d4af37] transition-colors">
                SmartDine <span className="text-[11px] font-sans uppercase tracking-widest text-[#d4af37] font-bold">Pro</span>
              </span>
              <div className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold hidden sm:block">
                Indian · Chinese · Fitness
              </div>
            </div>
          </button>

          {/* Table Number Pill - Click to change or enter table number */}
          <button
            onClick={() => {
              sound.playTick();
              onOpenTableModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-xs text-[#d4af37] transition-all cursor-pointer shadow-sm group"
            title="Click to enter or change your table number"
          >
            <Utensils className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-semibold">Table:</span>
            <span className="font-mono font-bold text-white group-hover:text-[#d4af37] transition-colors">#{currentTable}</span>
            <span className="text-[10px] text-[#d4af37] underline hidden sm:inline ml-0.5">Edit</span>
          </button>

          {/* Single Website QR Code Button */}
          {onOpenQrModal && (
            <button
              onClick={() => {
                sound.playTick();
                onOpenQrModal();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-stone-300 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Scan Restaurant Website QR Code on Mobile"
            >
              <QrCode className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="hidden md:inline font-semibold">Website QR</span>
            </button>
          )}
        </div>

        {/* Zone 2: Five Portal Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePortal === item.id;
            const isAuth = item.isPublic || isPortalAuthenticated(item.id);

            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playTick();
                  onSelectPortal(item.id);
                }}
                className={`relative px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="header-active-pill"
                    className="absolute inset-0 bg-[#d4af37]/15 border border-[#d4af37]/45 rounded-xl -z-0"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-[#d4af37]' : 'text-stone-400'}`} />
                <span className="relative z-10">{item.label}</span>

                {!item.isPublic && !isAuth && (
                  <Lock className="w-2.5 h-2.5 text-stone-500 relative z-10" />
                )}

                {item.badge !== undefined && (
                  <span className="relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[#d4af37] text-black tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sound Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-[#d4af37]/10 border-[#d4af37]/30 text-[#d4af37]'
                : 'bg-white/5 border-white/10 text-stone-500'
            }`}
            title={soundEnabled ? 'Mute Interaction Sounds' : 'Enable Interaction Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Staff ID Login / Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStaffMenu(!showStaffMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                staffUser
                  ? 'bg-[#d4af37]/10 border-[#d4af37]/35 text-[#d4af37]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-stone-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="font-medium hidden sm:inline-block">
                {staffUser ? staffUser.id : 'Terminal ID'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <AnimatePresence>
              {showStaffMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 glass-panel-elevated rounded-2xl p-2.5 z-50 shadow-2xl border border-white/10"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1.5">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] flex items-center justify-between">
                      <span>Staff ID Authentication</span>
                      <span className="text-[9px] text-stone-400 font-normal">ID-Only</span>
                    </div>
                    <div className="text-xs text-stone-300 mt-0.5">
                      {staffUser ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active ID: <b>{staffUser.id}</b> ({staffUser.name})</span>
                        </div>
                      ) : (
                        'Tap any ID below to authenticate instantly:'
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                    {DEMO_LOGIN_IDS.map((badge) => {
                      const isCurrent = staffUser?.id === badge.id;
                      return (
                        <button
                          key={badge.id}
                          onClick={() => {
                            sound.playSuccess();
                            const acc: StaffAccount = {
                              id: badge.id,
                              name: badge.name,
                              role: badge.role,
                              label: badge.department,
                              avatarColor: '#d4af37'
                            };
                            onStaffLogin(acc);
                            setShowStaffMenu(false);
                            onSelectPortal(badge.portal);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold border border-[#d4af37]/40'
                              : 'text-stone-300 hover:bg-white/5'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-white">{badge.name}</div>
                            <div className="text-[10px] text-stone-400">{badge.department}</div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-[#d4af37]">{badge.id}</span>
                        </button>
                      );
                    })}
                  </div>

                  {staffUser && (
                    <div className="pt-2 border-t border-white/10 mt-1.5">
                      <button
                        onClick={() => {
                          sound.playTick();
                          onStaffLogout();
                          setShowStaffMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out / Clear Active Terminal ID</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart / Order Tray Trigger */}
          <button
            onClick={() => {
              sound.playTick();
              onOpenCart();
            }}
            className="relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e0be4d] hover:brightness-105 active:scale-95 text-stone-950 text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Tray</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-black text-[#d4af37] font-mono font-extrabold text-[10px]">
                {cartCount}
              </span>
            )}
            {cartTotal > 0 && (
              <span className="hidden md:inline font-mono font-bold pl-1 border-l border-black/20">
                ₹{cartTotal}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Portal Navigation Strip */}
      <div className="flex lg:hidden items-center justify-between px-4 py-2 border-t border-white/5 overflow-x-auto gap-2 bg-[#06080c]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePortal === item.id;
          const isAuth = item.isPublic || isPortalAuthenticated(item.id);

          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playTick();
                onSelectPortal(item.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#d4af37] text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {!item.isPublic && !isAuth && (
                <Lock className="w-2.5 h-2.5 opacity-60" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
