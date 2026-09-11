import React from 'react';
import { MapPin } from 'lucide-react';

const CITIES = ['Jakarta', 'Yogyakarta', 'Tangerang', 'Surabaya'];

export default function CityFilter({ selectedCity, onSelectCity }) {
  const pillClass = (isActive) =>
    `px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 shrink-0 ${
      isActive
        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
        : 'bg-white text-slate-500 border-slate-200 hover:text-slate-900 hover:border-slate-300 hover:-translate-y-px'
    }`;

  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 shrink-0">
        <MapPin className="w-3.5 h-3.5" />
        Kota
      </span>
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar min-w-0">
        <button
          onClick={() => onSelectCity('all')}
          className={pillClass(selectedCity === 'all')}
        >
          Semua Kota
        </button>
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => onSelectCity(city)}
            className={pillClass(selectedCity === city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
