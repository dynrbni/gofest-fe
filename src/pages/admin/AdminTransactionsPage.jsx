import React, { useState, useMemo } from 'react';
import { 
  CreditCard, Search, Calendar, DollarSign, Ticket, 
  Download, Filter, CheckCircle2, User, Building2 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateTimeIndo } from '../../utils/formatters';

export default function AdminTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const orders = useMemo(() => StorageService.getOrders(), []);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchMethod = methodFilter === 'all' || o.paymentMethod.includes(methodFilter);
      const matchSearch = !searchQuery.trim() ||
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMethod && matchSearch;
    });
  }, [orders, methodFilter, searchQuery]);

  const totalGMV = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalTickets = orders.reduce((acc, o) => acc + (o.tickets?.length || 1), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Monitoring Transaksi Platform
          </h1>
          <p className="text-xs text-slate-500">
            Log seluruh transaksi pembelian e-ticket lintas event dan promotor di GoFest (PRD ADM-06)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-xs">
            Total GMV: <span className="text-brand-700 font-black">{formatRupiah(totalGMV)}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari no. order, nama pembeli, judul event..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>

        {/* Method Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Metode Bayar:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 cursor-pointer"
          >
            <option value="all">Semua Metode</option>
            <option value="BCA">BCA Virtual Account</option>
            <option value="Mandiri">Mandiri Virtual Account</option>
            <option value="QRIS">QRIS</option>
            <option value="Kartu">Kartu Kredit/Debit</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">No. Order</th>
                <th className="p-4">Event</th>
                <th className="p-4">Data Pembeli (Buyer)</th>
                <th className="p-4">Waktu Transaksi</th>
                <th className="p-4">Metode Bayar</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Total Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-mono font-bold text-brand-700">{ord.orderNumber}</td>
                    <td className="p-4 max-w-[200px]">
                      <div className="font-bold text-slate-900 truncate">{ord.eventTitle}</div>
                      <div className="text-[11px] text-slate-400">{ord.eventLocation?.split(',')[0]}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{ord.buyerName}</div>
                      <div className="text-[11px] text-slate-500">{ord.buyerEmail} • {ord.buyerPhone}</div>
                    </td>
                    <td className="p-4 text-slate-600">{formatDateTimeIndo(ord.paidAt || ord.createdAt)}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        PAID (LUNAS)
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-black text-brand-700">
                      {formatRupiah(ord.totalAmount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada transaksi yang cocok dengan pencarian.
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
