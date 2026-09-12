import React from 'react';
import { Layers } from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';

const ALL_CATEGORIES = [{ id: 'all', label: 'Semua', icon: Layers }, ...CATEGORIES];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 shrink-0">
        <Layers className="w-3.5 h-3.5" />
        Kategori
      </span>
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar min-w-0">
        {ALL_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900 hover:border-slate-300 hover:-translate-y-px'
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
