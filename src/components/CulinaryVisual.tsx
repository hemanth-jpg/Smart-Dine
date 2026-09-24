import React from 'react';
import { MenuItem } from '../types/hotel';
import { Utensils, Award, Clock, Sparkles, Coffee, Flame } from 'lucide-react';

interface Props {
  item: MenuItem;
  className?: string;
}

export const CulinaryVisual: React.FC<Props> = ({ item, className = 'h-52' }) => {
  // Bespoke luxury visual backdrop gradients based on category
  const getGradientTheme = () => {
    switch (item.category) {
      case 'signatures':
        return 'from-[#1c1815] via-[#2a1e17] to-[#120f0d] border-[#d4af37]/25';
      case 'mains':
        return 'from-[#171c1b] via-[#1a2624] to-[#0f1413] border-[#38bdf8]/20';
      case 'breakfast':
        return 'from-[#231e15] via-[#2e2617] to-[#14120c] border-[#f59e0b]/20';
      case 'beverages':
        return 'from-[#141b24] via-[#172333] to-[#0d131a] border-[#60a5fa]/20';
      case 'desserts':
        return 'from-[#25151e] via-[#331c29] to-[#140b10] border-[#f43f5e]/20';
      default:
        return 'from-[#1a1d24] via-[#222731] to-[#101217] border-white/10';
    }
  };

  const getAccentColor = () => {
    switch (item.category) {
      case 'signatures': return '#d4af37'; // gold
      case 'mains': return '#38bdf8'; // sky
      case 'breakfast': return '#f59e0b'; // amber
      case 'beverages': return '#60a5fa'; // azure
      case 'desserts': return '#f43f5e'; // rose
      default: return '#e2e8f0';
    }
  };

  const accent = getAccentColor();

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br ${getGradientTheme()} border-b flex flex-col justify-between p-5 transition-transform duration-300 group-hover:scale-[1.01] ${className}`}
    >
      {/* Ambient background glow orb */}
      <div 
        className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: accent }}
      />
      <div 
        className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full blur-2xl opacity-10 pointer-events-none"
        style={{ backgroundColor: accent }}
      />

      {/* Top row: Category tag & prep time */}
      <div className="relative z-10 flex items-center justify-between">
        <span 
          className="text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5"
          style={{ color: accent }}
        >
          {item.chefRecommended && <Sparkles className="w-3.5 h-3.5" />}
          {item.categoryLabel}
        </span>

        <div className="flex items-center gap-1.5 text-xs text-stone-400 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded border border-white/5">
          <Clock className="w-3 h-3 text-stone-400" />
          <span className="tabular-nums font-medium">{item.preparationTime || item.time || '15 min'}</span>
        </div>
      </div>

      {/* Central luxury emblem motif */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-2">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center bg-black/30 border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-300"
          style={{ boxShadow: `0 0 25px ${accent}15` }}
        >
          {item.category === 'signatures' && <Award className="w-7 h-7 text-[#d4af37]" />}
          {item.category === 'mains' && <Flame className="w-7 h-7 text-[#38bdf8]" />}
          {item.category === 'breakfast' && <Utensils className="w-7 h-7 text-[#f59e0b]" />}
          {item.category === 'beverages' && <Coffee className="w-7 h-7 text-[#60a5fa]" />}
          {item.category === 'desserts' && <Sparkles className="w-7 h-7 text-[#f43f5e]" />}
        </div>
        
        {item.badge && (
          <span className="mt-2 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-stone-300 border border-white/10 font-medium">
            {item.badge}
          </span>
        )}
      </div>

      {/* Bottom row: Calories & Dietary tags */}
      <div className="relative z-10 flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1 text-[11px]">
          {item.dietaryTags && item.dietaryTags.slice(0, 2).map((tag: string, idx: number) => (
            <React.Fragment key={tag}>
              <span>{tag}</span>
              {idx < Math.min((item.dietaryTags?.length ?? 1) - 1, 1) && <span className="text-stone-600">·</span>}
            </React.Fragment>
          ))}
        </div>

        {item.calories && (
          <span className="text-[11px] tabular-nums text-stone-500">
            {item.calories} kcal
          </span>
        )}
      </div>
    </div>
  );
};
