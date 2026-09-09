import React from 'react';
import { Music, Sparkles, Tent, Heart, Mic2, Palette, Layers } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Semua Event', icon: Layers },
  { id: 'Musik', label: 'Musik', icon: Music },
  { id: 'Konser', label: 'Konser', icon: Mic2 },
  { id: 'Festival', label: 'Festival', icon: Tent },
  { id: 'Fanmeeting', label: 'Fanmeeting', icon: Heart },
  { id: 'Seminar', label: 'Seminar & Tech', icon: Sparkles },
  { id: 'Pameran', label: 'Pameran & Art', icon: Palette },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2.5 min-w-max pb-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-brand-900 text-white shadow-md shadow-brand-900/20 scale-102 border border-brand-800'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 shadow-xs'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
