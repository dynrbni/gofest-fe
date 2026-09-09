import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Building2, ArrowRight } from 'lucide-react';
import { formatRupiah, formatDateIndo, getCategoryColor } from '../../utils/formatters';

export default function EventCard({ event }) {
  if (!event) return null;

  // Compute lowest available price from ticket types
  const lowestPrice = event.ticketTypes?.length
    ? Math.min(...event.ticketTypes.map(t => t.price))
    : 0;

  // Check total remaining quota
  const totalQuota = event.ticketTypes?.reduce((acc, t) => acc + (t.quota || 0), 0) || 0;
  const totalSold = event.ticketTypes?.reduce((acc, t) => acc + (t.sold || 0), 0) || 0;
  const isSoldOut = totalQuota > 0 && totalSold >= totalQuota;

  const categoryStyle = getCategoryColor(event.category);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-brand-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Poster Image Container with 16:9 ratio */}
      <Link to={`/event/${event.id}`} className="relative block aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={event.banner}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border ${categoryStyle.bg}`}>
            {event.category || 'Event'}
          </span>
        </div>

        {/* Sold out badge */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-600 text-white font-extrabold text-xs uppercase tracking-wider px-3 py-1.5 rounded-md shadow-lg rotate-[-4deg]">
              Tiket Habis (Sold Out)
            </span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & City Tag */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">{event.city || 'Indonesia'}</span>
            <span className="text-slate-300">•</span>
            <span className="truncate">{event.location?.split(',')[0]}</span>
          </div>

          {/* Event Title */}
          <Link to={`/event/${event.id}`}>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-brand-600 transition-colors line-clamp-2 mb-2.5">
              {event.title}
            </h3>
          </Link>

          {/* Date info */}
          <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
            <Calendar className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span className="font-medium">{formatDateIndo(event.date)}</span>
            {event.time && (
              <>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 text-[11px]">{event.time}</span>
              </>
            )}
          </div>
        </div>

        {/* Bottom Organizer & Price Section */}
        <div>
          {/* Organizer attribution */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-dashed border-slate-200 mb-3">
            <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px] shrink-0">
              <Building2 className="w-3 h-3" />
            </div>
            <span className="truncate text-slate-600">Oleh <strong className="text-slate-800 font-semibold">{event.eoName}</strong></span>
          </div>

          {/* Price & Action Button */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Mulai dari</div>
              <div className="text-base font-extrabold text-brand-700">
                {formatRupiah(lowestPrice)}
              </div>
            </div>

            <Link
              to={`/event/${event.id}`}
              className="bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 group-hover:bg-brand-600 group-hover:text-white"
            >
              <span>Beli</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
