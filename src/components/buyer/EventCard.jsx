import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Building2, ArrowRight } from 'lucide-react';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';

export default function EventCard({ event }) {
  if (!event) return null;

  const lowestPrice = event.ticketTypes?.length
    ? Math.min(...event.ticketTypes.map(t => t.price))
    : 0;

  const totalQuota = event.ticketTypes?.reduce((acc, t) => acc + (t.quota || 0), 0) || 0;
  const totalSold = event.ticketTypes?.reduce((acc, t) => acc + (t.sold || 0), 0) || 0;
  const isSoldOut = totalQuota > 0 && totalSold >= totalQuota;

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <Link to={`/event/${event.id}`} className="relative block aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={event.banner}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Category */}
        <div className="absolute top-3 left-3">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm">
            {event.category || 'Event'}
          </span>
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-slate-900 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="font-medium text-slate-500 truncate">{event.city || 'Indonesia'}</span>
          </div>

          {/* Title */}
          <Link to={`/event/${event.id}`}>
            <h3 className="font-semibold text-slate-900 text-[15px] leading-snug group-hover:text-slate-600 transition-colors line-clamp-2 mb-3">
              {event.title}
            </h3>
          </Link>

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{formatDateIndo(event.date)}</span>
            {event.time && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-slate-400">{event.time}</span>
              </>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-3 border-t border-slate-100">
          {/* Organizer */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Building2 className="w-3 h-3 shrink-0" />
            <span className="truncate">{event.eoName}</span>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Mulai dari</div>
              <div className="text-sm font-bold text-slate-900">
                {formatRupiah(lowestPrice)}
              </div>
            </div>

            <Link
              to={`/event/${event.id}`}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition flex items-center gap-1"
            >
              <span>Beli</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
