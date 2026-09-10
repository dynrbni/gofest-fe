import React from 'react';
import { Music, Sparkles, Tent, Heart, Mic2, Palette, Layers } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Semua', icon: Layers },
  { id: 'Musik', label: 'Musik', icon: Music },
  { id: 'Konser', label: 'Konser', icon: Mic2 },
  { id: 'Festival', label: 'Festival', icon: Tent },
  { id: 'Fanmeeting', label: 'Fanmeeting', icon: Heart },
  { id: 'Seminar', label: 'Seminar', icon: Sparkles },
  { id: 'Pameran', label: 'Pameran', icon: Palette },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isSelected
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
