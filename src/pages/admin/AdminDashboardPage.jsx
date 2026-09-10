import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, DollarSign, Calendar, Ticket, UserCheck, 
  CheckSquare, ArrowRight, AlertTriangle, TrendingUp, Sparkles, Building2 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';

export default function AdminDashboardPage() {
  const users = useMemo(() => StorageService.getUsers(), []);
  const events = useMemo(() => StorageService.getEvents(), []);
  const orders = useMemo(() => StorageService.getOrders(), []);

  // Platform Metrics (PRD ADM-06)
  const stats = useMemo(() => {
    let totalTicketsSold = 0;
    let totalGMV = 0;

    events.forEach(ev => {
      ev.ticketTypes?.forEach(tt => {
        const sold = Number(tt.sold || 0);
        const price = Number(tt.price || 0);
        totalTicketsSold += sold;
        totalGMV += sold * price;
      });
    });

    const pendingEOs = users.filter(u => u.role === 'eo' && u.status === 'pending');
    const pendingEvents = events.filter(e => e.status === 'pending_review');
    const approvedEOs = users.filter(u => u.role === 'eo' && u.status === 'approved');
    const publishedEvents = events.filter(e => e.status === 'published');

    return {
      totalGMV,
      totalTicketsSold,
      totalOrders: orders.length,
      pendingEOCount: pendingEOs.length,
      pendingEventCount: pendingEvents.length,
      approvedEOCount: approvedEOs.length,
      publishedEventCount: publishedEvents.length,
    };
  }, [users, events, orders]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Pengelola Platform (Admin)
          </h1>
          <p className="text-xs text-slate-500">
            Monitoring seluruh transaksi marketplace, verifikasi promotor, dan approval event baru (PRD ADM-06)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Platform Operasional Normal</span>
          </span>
        </div>
      </div>

      {/* Urgent Action Alert Cards (ADM-02 & ADM-04) */}
      {(stats.pendingEOCount > 0 || stats.pendingEventCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.pendingEOCount > 0 && (
            <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-amber-950">
                    {stats.pendingEOCount} Pendaftaran EO Menunggu Approval
                  </div>
                  <div className="text-xs text-amber-800">
                    Verifikasi berkas organisasi promotor sebelum mereka membuat event
                  </div>
                </div>
              </div>
              <Link
                to="/admin/eo-approvals"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs shrink-0"
              >
                Tinjau EO
              </Link>
            </div>
          )}

          {stats.pendingEventCount > 0 && (
            <div className="bg-blue-50 border border-blue-300/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-200 text-blue-900 flex items-center justify-center font-bold">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-blue-950">
                    {stats.pendingEventCount} Pengajuan Event Menunggu Review
                  </div>
                  <div className="text-xs text-blue-800">
                    Review kelayakan event dan harga tiket sebelum tayang ke marketplace
                  </div>
                </div>
              </div>
              <Link
                to="/admin/event-approvals"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs shrink-0"
              >
                Tinjau Event
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Primary KPI Metrics (ADM-06) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
            <span>Total GMV Transaksi</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{formatRupiah(stats.totalGMV)}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Volume Penjualan Seluruh Event</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
            <span>Total Tiket Terjual</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-slate-700 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalTicketsSold.toLocaleString('id-ID')}</div>
          <div className="text-[11px] text-slate-500">
            Dari {stats.totalOrders} transaksi berhasil
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
            <span>Event Published (Live)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.publishedEventCount}</div>
          <div className="text-[11px] text-slate-500">
            Aktif dapat dibeli pengunjung publik
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
            <span>Mitra Promotor (EO)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.approvedEOCount}</div>
          <div className="text-[11px] text-slate-500">
            Penyelenggara Terverifikasi
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/eo-approvals"
          className="bg-white hover:bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs transition group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-slate-900 text-base pt-2">Approval Pendaftaran EO</h3>
          <p className="text-xs text-slate-500">
            Kelola persetujuan dan penolakan pendaftaran organisasi promotor baru.
          </p>
        </Link>

        <Link
          to="/admin/event-approvals"
          className="bg-white hover:bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs transition group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-slate-800 flex items-center justify-center font-bold">
              <CheckSquare className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-slate-900 text-base pt-2">Approval Event Baru</h3>
          <p className="text-xs text-slate-500">
            Tinjau detail konser/festival, kuota, dan harga tiket sebelum disetujui tayang.
          </p>
        </Link>

        <Link
          to="/admin/transactions"
          className="bg-white hover:bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs transition group space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-bold text-slate-900 text-base pt-2">Monitoring Transaksi</h3>
          <p className="text-xs text-slate-500">
            Lihat seluruh riwayat pembelian e-ticket, buyer info, dan status pembayaran.
          </p>
        </Link>
      </div>
    </div>
  );
}
