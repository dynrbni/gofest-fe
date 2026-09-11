import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Ticket, DollarSign, Users, Plus, ArrowRight, 
  Clock, CheckCircle2, AlertCircle, TrendingUp, Sparkles, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';

export default function EODashboardPage() {
  const { currentUser } = useAuth();

  // Load events belonging to this EO
  const myEvents = useMemo(() => {
    const all = StorageService.getEvents();
    return all.filter(e => e.eoId === currentUser?.id);
  }, [currentUser]);

  // Aggregate metrics
  const stats = useMemo(() => {
    let totalQuota = 0;
    let totalSold = 0;
    let estimatedRevenue = 0;

    myEvents.forEach(e => {
      e.ticketTypes?.forEach(tt => {
        totalQuota += Number(tt.quota || 0);
        totalSold += Number(tt.sold || 0);
        estimatedRevenue += Number(tt.sold || 0) * Number(tt.price || 0);
      });
    });

    const publishedCount = myEvents.filter(e => e.status === 'published').length;
    const pendingCount = myEvents.filter(e => e.status === 'pending_review').length;

    return {
      totalEvents: myEvents.length,
      publishedCount,
      pendingCount,
      totalSold,
      totalQuota,
      soldPercentage: totalQuota > 0 ? Math.round((totalSold / totalQuota) * 100) : 0,
      estimatedRevenue,
    };
  }, [myEvents]);

  // Status badge style helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>PUBLISHED</span>;
      case 'pending_review':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>MENUNGGU ADMIN</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>REJECTED</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full w-fit">DRAFT</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Create */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Penyelenggara Event
          </h1>
          <p className="text-xs text-slate-500">
            Selamat datang, <strong>{currentUser?.name}</strong> • Promotor: {currentUser?.organization}
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

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Event</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-slate-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalEvents}</div>
          <div className="text-[11px] text-slate-500">
            <span className="text-emerald-700 font-bold">{stats.publishedCount} Tayang</span> • {stats.pendingCount} Review
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Tiket Terjual</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalSold.toLocaleString('id-ID')}</div>
          <div className="text-[11px] text-slate-500">
            Dari total kapasitas <strong className="text-slate-700">{stats.totalQuota.toLocaleString('id-ID')}</strong> ({stats.soldPercentage}%)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Estimasi Omzet</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{formatRupiah(stats.estimatedRevenue)}</div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Pendapatan Kotor Penjualan</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Status Kemitraan</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Terverifikasi</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Akun EO Resmi GoFest
          </div>
        </div>
      </div>

      {/* Events Table Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Daftar Event Promotor Anda</h2>
            <p className="text-xs text-slate-500">Pantau status approval Admin dan kuota tiket terjual</p>
          </div>

          <Link
            to="/eo/events"
            className="text-xs font-bold text-slate-700 hover:text-slate-800 flex items-center gap-1"
          >
            <span>Semua Event</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Event</th>
                <th className="p-4">Tanggal & Lokasi</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tiket Terjual</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myEvents.map(event => {
                const totalQuota = event.ticketTypes?.reduce((acc, t) => acc + (t.quota || 0), 0) || 0;
                const totalSold = event.ticketTypes?.reduce((acc, t) => acc + (t.sold || 0), 0) || 0;
                const percent = totalQuota > 0 ? Math.round((totalSold / totalQuota) * 100) : 0;

                return (
                  <tr key={event.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={event.banner}
                          alt={event.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{event.title}</div>
                          <div className="text-[11px] text-slate-400 font-medium">{event.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <div>{formatDateIndo(event.date)}</div>
                      <div className="text-[11px] text-slate-400">{event.city}</div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-800">
                          {totalSold} / {totalQuota} <span className="text-slate-400 font-normal">({percent}%)</span>
                        </div>
                        <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-slate-800 h-full rounded-full"
                            style={{ width: `${Math.min(100, percent)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {event.status === 'published' && (
                        <Link
                          to={`/event/${event.id}`}
                          target="_blank"
                          className="text-slate-700 hover:text-slate-800 font-semibold"
                        >
                          Lihat Publik
                        </Link>
                      )}
                      <Link
                        to="/eo/reports"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg font-bold"
                      >
                        Laporan
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
