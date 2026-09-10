import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, QrCode, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { formatDateIndo } from '../../utils/formatters';

export default function StaffEventsPage() {
  const { currentUser } = useAuth();

  const assignedEvents = useMemo(() => {
    const all = StorageService.getEvents();
    if (!currentUser?.assignedEventIds || currentUser.assignedEventIds.length === 0) {
      return all;
    }
    return all.filter(e => currentUser.assignedEventIds.includes(e.id));
  }, [currentUser]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Event yang Ditugaskan Kepada Anda
        </h1>
        <p className="text-xs text-slate-500">
          Staf hanya memiliki otorisasi verifikasi tiket untuk event-event di bawah ini (PRD STF-02)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignedEvents.map(event => (
          <div
            key={event.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] bg-slate-900">
                <img
                  src={event.banner}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {event.category}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Building2 className="w-3.5 h-3.5 text-slate-700" />
                  <span>Promotor: <strong className="text-slate-800">{event.eoName}</strong></span>
                </div>

                <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug">
                  {event.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span>{formatDateIndo(event.date)} {event.time ? `• ${event.time}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Otorisasi Check-In Aktif</span>
              </span>

              <Link
                to="/staff/scanner"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Buka Scanner</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
