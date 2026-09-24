import React, { useState } from 'react';
import { AppPortal, StaffAccount } from '../types/hotel';
import { DEMO_LOGIN_IDS, STAFF_ACCOUNTS } from '../data/smartDineData';
import { sound } from '../utils/audio';
import { 
  KeyRound, 
  ChefHat, 
  UserCheck, 
  BarChart3, 
  Activity, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Delete,
  CornerDownLeft,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  targetPortal: AppPortal;
  onSuccessLogin: (account: StaffAccount, targetPortal: AppPortal) => void;
  onCancelToCustomer: () => void;
}

export const IdLoginGate: React.FC<Props> = ({
  targetPortal,
  onSuccessLogin,
  onCancelToCustomer,
}) => {
  const [idInput, setIdInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const getPortalMeta = () => {
    switch (targetPortal) {
      case 'kitchen':
        return {
          title: 'Kitchen Display Terminal (KDS)',
          subtitle: 'Chef Line, Expediter Station & Live Cook Display',
          icon: ChefHat,
          accent: '#f59e0b',
          recommendedPrefix: 'KTN-1001',
          defaultRole: 'kitchen' as const,
        };
      case 'waiter':
        return {
          title: 'Floor Butler & Waiter Terminal',
          subtitle: 'Table Radar, Service Call Alerts & Folio Assistance',
          icon: UserCheck,
          accent: '#38bdf8',
          recommendedPrefix: 'WTR-1001',
          defaultRole: 'waiter' as const,
        };
      case 'admin':
      default:
        return {
          title: 'Executive Admin & Operations Hub',
          subtitle: 'Live Menu Publishing, Sales Analytics & Floor Oversight',
          icon: BarChart3,
          accent: '#a855f7',
          recommendedPrefix: 'ADM-1001',
          defaultRole: 'admin' as const,
        };
    }
  };

  const meta = getPortalMeta();
  const Icon = meta.icon;

  const handleSubmitId = (enteredId: string) => {
    const clean = enteredId.trim().toUpperCase();
    if (!clean) {
      setErrorMsg('Please enter a valid Staff or Terminal ID.');
      sound.playTick();
      return;
    }

    // Match against known staff accounts
    let account: StaffAccount | null = null;
    const knownKeys = Object.keys(STAFF_ACCOUNTS) as Array<'waiter' | 'kitchen' | 'admin' | 'management'>;
    for (const key of knownKeys) {
      if (STAFF_ACCOUNTS[key].id.toUpperCase() === clean) {
        account = STAFF_ACCOUNTS[key];
        break;
      }
    }

    // Match against demo list
    if (!account) {
      const demoMatch = DEMO_LOGIN_IDS.find((d) => d.id.toUpperCase() === clean);
      if (demoMatch) {
        account = {
          id: demoMatch.id,
          name: demoMatch.name,
          role: demoMatch.role,
          label: demoMatch.department,
          avatarColor: meta.accent,
        };
      }
    }

    // If custom ID entered (e.g. KTN-01, CHEF-99, WTR-05, ADM-02, ORD-xxx)
    if (!account) {
      let assignedRole: 'waiter' | 'kitchen' | 'admin' | 'management' = meta.defaultRole;
      if (clean.startsWith('KTN') || clean.startsWith('CHEF') || clean.startsWith('COOK')) {
        assignedRole = 'kitchen';
      } else if (clean.startsWith('WTR') || clean.startsWith('WAIT') || clean.startsWith('BUTLER')) {
        assignedRole = 'waiter';
      } else if (clean.startsWith('ADM') || clean.startsWith('MGT') || clean.startsWith('GM')) {
        assignedRole = 'admin';
      }

      account = {
        id: clean,
        name: `Terminal Operator (${clean})`,
        role: assignedRole,
        label: `${meta.title} User`,
        avatarColor: meta.accent,
      };
    }

    setIsSuccess(true);
    sound.playSuccess();
    setErrorMsg(null);

    setTimeout(() => {
      onSuccessLogin(account!, targetPortal);
    }, 400);
  };

  const handleKeypadPress = (val: string) => {
    sound.playTick();
    setErrorMsg(null);
    if (val === 'CLEAR') {
      setIdInput('');
    } else if (val === 'BACK') {
      setIdInput((prev) => prev.slice(0, -1));
    } else if (val === 'ENTER') {
      handleSubmitId(idInput);
    } else {
      setIdInput((prev) => (prev + val).toUpperCase());
    }
  };

  return (
    <div className="py-6 sm:py-12 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8 relative overflow-hidden"
      >
        {/* Subtle Ambient Glow */}
        <div 
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: meta.accent }}
        />

        {/* Top return link & status */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <button
            onClick={() => {
              sound.playTick();
              onCancelToCustomer();
            }}
            className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Dining (No Login Required)</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-400">
            <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>ID-Only Terminal Gate</span>
          </div>
        </div>

        {/* Portal Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/10"
              style={{ backgroundColor: `${meta.accent}20`, color: meta.accent }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-luxury font-bold text-white tracking-tight">
                {meta.title}
              </h2>
              <p className="text-xs text-stone-400">
                {meta.subtitle}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-stone-300 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span>
              Authentication requires <b>ID only</b> (no password needed). Enter your authorized ID or choose a demo badge below.
            </span>
          </div>
        </div>

        {/* ID Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitId(idInput);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#d4af37]" />
                Enter Terminal / Staff ID
              </span>
              <span className="text-[11px] font-mono text-stone-500 font-normal">
                Format e.g. {meta.recommendedPrefix}
              </span>
            </label>

            <div className="relative">
              <input
                type="text"
                value={idInput}
                onChange={(e) => {
                  setErrorMsg(null);
                  setIdInput(e.target.value.toUpperCase());
                }}
                placeholder={meta.recommendedPrefix.split(' ')[0]}
                autoFocus
                className="w-full px-5 py-3.5 rounded-2xl bg-black/60 border-2 border-white/15 focus:border-[#d4af37] text-white text-base sm:text-lg font-mono tracking-wider placeholder:text-stone-600 focus:outline-none transition-colors shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 text-xs font-bold transition-all shadow flex items-center gap-1.5"
              >
                <span>Authorize</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Error / Success Banners */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Access Granted! Opening {meta.title}...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Rapid Touch Keypad for POS/Tablet Terminals */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="text-[11px] font-semibold text-stone-400 flex items-center justify-between">
            <span>Terminal Rapid Touch Keypad:</span>
            <span className="text-[10px] text-stone-500 font-mono">Instant Entry</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {['1', '2', '3', 'KTN-'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleKeypadPress(key)}
                className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white font-mono text-sm font-semibold transition-all"
              >
                {key}
              </button>
            ))}
            {['4', '5', '6', 'WTR-'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleKeypadPress(key)}
                className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white font-mono text-sm font-semibold transition-all"
              >
                {key}
              </button>
            ))}
            {['7', '8', '9', 'ADM-'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleKeypadPress(key)}
                className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white font-mono text-sm font-semibold transition-all"
              >
                {key}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleKeypadPress('CLEAR')}
              className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 border border-rose-500/20 text-rose-300 font-mono text-xs font-semibold transition-all"
            >
              CLR
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white font-mono text-sm font-semibold transition-all"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('BACK')}
              className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-stone-300 font-mono text-xs flex items-center justify-center font-semibold transition-all"
            >
              <Delete className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('ENTER')}
              className="py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e0be4d] active:scale-95 text-stone-950 font-bold text-xs transition-all"
            >
              OK
            </button>
          </div>
        </div>

        {/* 1-Tap Authorized Demo ID Chips */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              Tap Any Official Hotel Demo ID To Sign In:
            </span>
            <span className="text-[10px] text-stone-500">1-Tap Quick Fill</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DEMO_LOGIN_IDS.map((badge) => {
              const isTargetType = badge.portal === targetPortal || (targetPortal === 'admin' && (badge.role === 'admin' || badge.role === 'management'));
              return (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => {
                    setIdInput(badge.id);
                    handleSubmitId(badge.id);
                  }}
                  className={`text-left p-3 rounded-2xl border transition-all text-xs flex items-center justify-between group ${
                    isTargetType
                      ? 'bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border-[#d4af37]/40 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-white group-hover:text-[#d4af37] transition-colors">
                        {badge.id}
                      </span>
                      {isTargetType && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-[#d4af37] text-stone-950">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-300 font-medium">
                      {badge.name}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate">
                      {badge.department}
                    </div>
                  </div>
                  <div className="text-stone-500 group-hover:text-white transition-colors text-xs font-mono font-semibold pl-2">
                    ➔
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </motion.div>
    </div>
  );
};
