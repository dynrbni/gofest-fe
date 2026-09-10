import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Calendar, DollarSign, Ticket, Download, 
  TrendingUp, Users, ArrowUpRight, Filter 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateIndo, formatDateTimeIndo } from '../../utils/formatters';

export default function EOReportsPage() {
  const { currentUser } = useAuth();
  const [selectedEventId, setSelectedEventId] = useState('all');

  const myEvents = useMemo(() => {
    const all = StorageService.getEvents();
    return all.filter(e => e.eoId === currentUser?.id);
  }, [currentUser]);

  // Selected events to analyze
  const targetEvents = useMemo(() => {
    if (selectedEventId === 'all') return myEvents;
    return myEvents.filter(e => e.id === selectedEventId);
  }, [myEvents, selectedEventId]);

  // Aggregate statistics (PRD EO-08)
  const reportStats = useMemo(() => {
    let totalSold = 0;
    let totalQuota = 0;
    let totalRevenue = 0;

    targetEvents.forEach(ev => {
      ev.ticketTypes?.forEach(tt => {
        const sold = Number(tt.sold || 0);
        const price = Number(tt.price || 0);
        const quota = Number(tt.quota || 0);
        totalSold += sold;
        totalQuota += quota;
        totalRevenue += sold * price;
      });
    });

    const remainingQuota = totalQuota - totalSold;
    const soldPercentage = totalQuota > 0 ? Math.round((totalSold / totalQuota) * 100) : 0;

    return {
      totalSold,
      totalQuota,
      remainingQuota,
      totalRevenue,
      soldPercentage,
    };
  }, [targetEvents]);

  // Get orders related to these events
  const relevantOrders = useMemo(() => {
    const orders = StorageService.getOrders();
    const eventIds = targetEvents.map(e => e.id);
    return orders.filter(o => eventIds.includes(o.eventId));
  }, [targetEvents]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Laporan Penjualan & Kuota Tiket
          </h1>
          <p className="text-xs text-slate-500">
            Data real-time kuota terjual, sisa tiket, dan estimasi omzet per jenis kategori (PRD EO-08)
          </p>
        </div>

        {/* Event Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Pilih Event:</span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:border-slate-400 cursor-pointer max-w-xs"
          >
            <option value="all">Semua Event Promotor ({myEvents.length})</option>
            {myEvents.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards (PRD EO-08) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
            <span>Estimasi Omzet Kotor</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {formatRupiah(reportStats.totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Terverifikasi dari Pembelian Buyer</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
            <span>Total Tiket Terjual</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {reportStats.totalSold.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">Tiket</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Tingkat Penjualan: <strong className="text-slate-800 font-bold">{reportStats.soldPercentage}%</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
            <span>Sisa Kuota Tersedia</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {reportStats.remainingQuota.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400">Tiket</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Dari total alokasi {reportStats.totalQuota.toLocaleString('id-ID')} tiket
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs text-slate-500 font-semibold flex items-center justify-between">
            <span>Total Transaksi Pesanan</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {relevantOrders.length} <span className="text-sm font-normal text-slate-400">Pesanan</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Checkout selesai via Sandbox Gateway
          </div>
        </div>
      </div>

      {/* Breakdown Table Per Ticket Tier (PRD EO-08) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Rincian Penjualan per Kategori Tiket</h3>
            <p className="text-xs text-slate-500">Monitoring sisa kuota dan pendapatan per tier</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Event</th>
                <th className="p-4">Jenis Tiket</th>
                <th className="p-4">Harga Tiket</th>
                <th className="p-4">Kuota Awal</th>
                <th className="p-4">Terjual</th>
                <th className="p-4">Sisa Kuota</th>
                <th className="p-4">Persentase</th>
                <th className="p-4 text-right">Total Omzet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {targetEvents.flatMap(ev => 
                (ev.ticketTypes || []).map(tt => {
                  const sold = Number(tt.sold || 0);
                  const quota = Number(tt.quota || 0);
                  const price = Number(tt.price || 0);
                  const remaining = quota - sold;
                  const percent = quota > 0 ? Math.round((sold / quota) * 100) : 0;
                  const tierRevenue = sold * price;

                  return (
                    <tr key={`${ev.id}-${tt.id}`} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-semibold text-slate-900 max-w-[200px] truncate">
                        {ev.title}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {tt.name}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-semibold text-slate-800">
                        {formatRupiah(price)}
                      </td>
                      <td className="p-4 font-mono text-slate-600">{quota}</td>
                      <td className="p-4 font-mono font-bold text-emerald-700">{sold}</td>
                      <td className="p-4 font-mono">
                        {remaining === 0 ? (
                          <span className="text-rose-600 font-bold">HABIS</span>
                        ) : (
                          <span className="text-slate-700 font-semibold">{remaining}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-slate-800 h-full rounded-full"
                              style={{ width: `${Math.min(100, percent)}%` }}
                            ></div>
                          </div>
                          <span className="text-slate-500 font-medium">{percent}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-slate-800">
                        {formatRupiah(tierRevenue)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Riwayat Transaksi Masuk Terkini</h3>
            <p className="text-xs text-slate-500">Daftar pesanan pembeli pada event promotor Anda</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">No. Order</th>
                <th className="p-4">Nama Pembeli (Buyer)</th>
                <th className="p-4">Waktu Pembayaran</th>
                <th className="p-4">Metode Bayar</th>
                <th className="p-4">Rincian Tiket</th>
                <th className="p-4 text-right">Total Bayar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {relevantOrders.length > 0 ? (
                relevantOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-mono font-bold text-slate-800">{ord.orderNumber}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{ord.buyerName}</div>
                      <div className="text-[11px] text-slate-400">{ord.buyerEmail}</div>
                    </td>
                    <td className="p-4 text-slate-600">{formatDateTimeIndo(ord.paidAt || ord.createdAt)}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">
                      {ord.items?.map(it => `${it.quantity}x ${it.ticketName}`).join(', ')}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-800">
                      {formatRupiah(ord.totalAmount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Belum ada transaksi pembelian tiket pada event ini.
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
