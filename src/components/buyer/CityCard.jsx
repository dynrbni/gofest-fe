import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import CityLandmark from './CityLandmarks';

export default function CityCard({ city }) {
  return (
    <Link
      to={`/jelajah?kota=${encodeURIComponent(city.filter)}`}
      className="group relative bg-white border border-slate-200 rounded-xl p-4 pb-5 flex items-stretch justify-between gap-3 hover:border-brand-400 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
    >
      <div className="flex flex-col justify-between min-w-0">
        <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors duration-300 leading-snug">
          {city.name}
        </h3>
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 mt-3" />
      </div>

      <div className={`w-24 h-24 sm:h-28 rounded-lg overflow-hidden shrink-0 ${city.tileBg}`}>
        <div className="w-full h-full group-hover:scale-110 group-hover:-translate-y-1 group-hover:-rotate-2 transition-transform duration-500 ease-out">
          <CityLandmark type={city.landmark} />
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-4 right-4 h-1 rounded-full bg-gradient-to-r ${city.gradient} opacity-60 group-hover:opacity-100 group-hover:left-0 group-hover:right-0 transition-all duration-300`}
      ></div>
    </Link>
  );
}
