import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, Check, X, Calendar, MapPin, Ticket, 
  ExternalLink, Building2, Search, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function AdminEventApprovalsPage() {
  const { success, info } = useToast();
  const [statusFilter, setStatusFilter] = useState('pending_review');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const allEvents = useMemo(() => {
    return StorageService.getEvents();
  }, [refreshKey]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => {
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchSearch = !searchQuery.trim() || 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.eoName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [allEvents, statusFilter, searchQuery]);

  const handleApprove = (event) => {
    StorageService.updateEventStatus(event.id, 'published', 'Disetujui oleh Admin Platform');
    success(`Event "${event.title}" disetujui dan langsung tayang di Marketplace Publik!`);
    setRefreshKey(k => k + 1);
    setSelectedEvent(null);
  };

  const handleReject = (event) => {
    StorageService.updateEventStatus(event.id, 'rejected', 'Data event kurang lengkap / melanggar ketentuan.');
    info(`Event "${event.title}" ditolak.`);
    setRefreshKey(k => k + 1);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Approval Pengajuan Event Baru
        </h1>
        <p className="text-xs text-slate-500">
          Tinjau detail konser, harga tiket, dan legalitas acara sebelum disetujui tayang ke publik (PRD ADM-04 & ADM-05)
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto text-xs">
          {[
            { id: 'pending_review', label: 'Menunggu Review (Pending)' },
            { id: 'published', label: 'Sudah Tayang (Published)' },
            { id: 'rejected', label: 'Ditolak (Rejected)' },
            { id: 'all', label: 'Semua Event' },
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

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul event/promotor..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Event & Poster</th>
                <th className="p-4">Penyelenggara (EO)</th>
                <th className="p-4">Tanggal & Lokasi</th>
                <th className="p-4">Jenis & Harga Tiket</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => {
                  const minPrice = event.ticketTypes?.length
                    ? Math.min(...event.ticketTypes.map(t => t.price))
                    : 0;
                  const totalQuota = event.ticketTypes?.reduce((acc, t) => acc + (t.quota || 0), 0) || 0;

                  return (
                    <tr key={event.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.banner}
                            alt={event.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1 max-w-xs">{event.title}</div>
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                              {event.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{event.eoName}</td>
                      <td className="p-4 text-slate-600">
                        <div>{formatDateIndo(event.date)}</div>
                        <div className="text-[11px] text-slate-400">{event.city}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{formatRupiah(minPrice)}</div>
                        <div className="text-[11px] text-slate-500">{totalQuota} tiket ({event.ticketTypes?.length || 0} tier)</div>
                      </td>
                      <td className="p-4">
                        {event.status === 'published' ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            PUBLISHED (LIVE)
                          </span>
                        ) : event.status === 'pending_review' ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse">
                            PENDING REVIEW
                          </span>
                        ) : (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            REJECTED
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {event.status === 'pending_review' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(event)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition"
                            >
                              Approve & Tayangkan
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(event)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-1.5 rounded-lg border border-rose-200 transition"
                            >
                              Reject
                            </button>
                          </>
                        ) : event.status === 'published' ? (
                          <Link
                            to={`/event/${event.id}`}
                            target="_blank"
                            className="text-slate-700 hover:text-slate-800 font-bold flex items-center gap-1 justify-end"
                          >
                            <span>Buka di Publik</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic">Ditolak</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Tidak ada event pada status "{statusFilter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
