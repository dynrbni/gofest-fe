import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Calendar, MapPin, Ticket, Edit3, ExternalLink, 
  Clock, AlertCircle, CheckCircle2, Search, Filter 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';

export default function EOEventsPage() {
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const myEvents = useMemo(() => {
    const all = StorageService.getEvents();
    return all.filter(e => e.eoId === currentUser?.id);
  }, [currentUser]);

  const filteredEvents = useMemo(() => {
    return myEvents.filter(e => {
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchQuery = !searchQuery.trim() || e.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [myEvents, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Title and Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Event Promotor
          </h1>
          <p className="text-xs text-slate-500">
            Daftar seluruh event yang telah diajukan dan sedang dipasarkan
          </p>
        </div>

        <Link
          to="/eo/events/new"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Event Baru</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto text-xs">
          {[
            { id: 'all', label: 'Semua Event' },
            { id: 'published', label: 'Published (Live)' },
            { id: 'pending_review', label: 'Menunggu Review' },
            { id: 'rejected', label: 'Ditolak' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold transition shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul event..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Events List Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const totalQuota = event.ticketTypes?.reduce((acc, t) => acc + (t.quota || 0), 0) || 0;
            const totalSold = event.ticketTypes?.reduce((acc, t) => acc + (t.sold || 0), 0) || 0;
            const percent = totalQuota > 0 ? Math.round((totalSold / totalQuota) * 100) : 0;
            const canEdit = event.status !== 'published'; // PRD EO-06

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] bg-slate-100">
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {event.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {event.status === 'published' ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          PUBLISHED
                        </span>
                      ) : event.status === 'pending_review' ? (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          PENDING REVIEW
                        </span>
                      ) : (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          DITOLAK
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1 leading-snug">
                      {event.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-700" />
                        <span>{formatDateIndo(event.date)} {event.time ? `• ${event.time}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-700" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Sales Progress Bar */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-medium">Tiket Terjual</span>
                        <span className="font-bold text-slate-900">{totalSold} / {totalQuota} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-800 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, percent)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <div>
                    {canEdit ? (
                      <span className="text-amber-600 text-[11px] font-medium">
                        Dapat diedit (Belum tayang)
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">
                        Terkunci (Sudah published)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {event.status === 'published' && (
                      <Link
                        to={`/event/${event.id}`}
                        target="_blank"
                        className="text-slate-700 hover:text-slate-800 flex items-center gap-1"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                    <Link
                      to="/eo/reports"
                      className="bg-white hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-800 transition"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">Tidak Ada Event Ditemukan</h3>
          <p className="text-xs text-slate-500">Mulai buat event baru untuk mengajukan promosi tiket ke Admin.</p>
          <Link
            to="/eo/events/new"
            className="inline-block bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            Buat Event Sekarang
          </Link>
        </div>
      )}
    </div>
  );
}
