import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, Ticket, Calendar, MapPin, ReceiptText, PackageSearch,
  RotateCcw, User, Mail, Wallet, ShieldCheck, SearchX
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateIndo, formatDateTimeIndo } from '../../utils/formatters';

const DEMO_ORDER_NUMBER = 'GF-2026-88912';

const PAYMENT_STATUS = {
  paid: { label: 'LUNAS', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { label: 'MENUNGGU PEMBAYARAN', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  expired: { label: 'KEDALUWARSA', className: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function OrderLookupPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialNumber = searchParams.get('nomor') || '';

  const [query, setQuery] = useState(initialNumber);
  const [searchedNumber, setSearchedNumber] = useState(initialNumber || null);

  const order = useMemo(() => {
    if (!searchedNumber) return null;
    const q = searchedNumber.toLowerCase();
    return StorageService.getOrders().find(
      (o) => o.orderNumber?.toLowerCase() === q || o.id?.toLowerCase() === q
    );
  }, [searchedNumber]);

  const event = useMemo(
    () => (order ? StorageService.getEventById(order.eventId) : null),
    [order]
  );

  const tickets = useMemo(
    () => (order ? StorageService.getOrderTickets(order) : []),
    [order]
  );

  const notFound = searchedNumber !== null && !order;

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = query.trim();
    if (!value) return;
    setSearchedNumber(value);
    setSearchParams({ nomor: value });
  };

  const handleReset = () => {
    setQuery('');
    setSearchedNumber(null);
    setSearchParams({});
  };

  const handleDemoFill = () => {
    setQuery(DEMO_ORDER_NUMBER);
    setSearchedNumber(DEMO_ORDER_NUMBER);
    setSearchParams({ nomor: DEMO_ORDER_NUMBER });
  };

  const paymentStatus = order ? PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS.pending : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <ReceiptText className="w-3.5 h-3.5" />
          Cek Status Pesanan
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Lacak Pesanan & E-Ticket Anda
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Masukkan nomor pesanan Anda (tercantum pada email konfirmasi, contoh:{' '}
          <span className="font-mono text-slate-700">GF-2026-88912</span>) untuk melihat
          detail pembayaran dan seluruh tiket.
        </p>
      </div>

      {/* Lookup Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Masukkan nomor pesanan, mis. GF-2026-88912"
            className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white transition font-mono"
          />
        </div>
        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition shrink-0"
        >
          Cari Pesanan
        </button>
      </form>

      {/* Demo Hint */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <span>
          Mode demo: coba nomor pesanan contoh{' '}
          <span className="font-mono font-bold text-slate-800">{DEMO_ORDER_NUMBER}</span>
        </span>
        <button
          type="button"
          onClick={handleDemoFill}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg transition shrink-0"
        >
          Isi Otomatis
        </button>
      </div>

      {/* Not Found State */}
      {notFound && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white border border-rose-200 flex items-center justify-center mx-auto text-rose-500">
            <SearchX className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900">Pesanan tidak ditemukan</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Nomor <span className="font-mono font-semibold">"{searchedNumber}"</span> tidak
            terdaftar di sistem. Periksa kembali penulisannya — format yang benar misalnya{' '}
            <span className="font-mono">GF-2026-88912</span> — atau hubungi{' '}
            <a href="mailto:support@gofest.id" className="font-semibold text-slate-800 hover:underline">
              support@gofest.id
            </a>
            .
          </p>
          <button
            onClick={handleReset}
            className="mt-2 inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-4 py-2 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Cari Nomor Lain</span>
          </button>
        </div>
      )}

      {/* Result */}
      {order && (
        <div className="space-y-5">
          {/* Summary Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Nomor Pesanan
                </div>
                <div className="font-mono font-bold text-slate-900">{order.orderNumber}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border ${paymentStatus.className}`}>
                {paymentStatus.label}
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-lg transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Pesanan Lain</span>
              </button>
            </div>
          </div>

          {/* Event Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {event?.banner && (
              <div className="aspect-[21/9] overflow-hidden bg-slate-100">
                <img
                  src={event.banner}
                  alt={order.eventTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  {event?.category || 'Event'}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-2.5 leading-snug">
                  {order.eventTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">Tanggal Acara</div>
                    <div>{formatDateIndo(order.eventDate)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-800">Lokasi Venue</div>
                    <div className="line-clamp-2">{order.eventLocation}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-400 font-semibold">Pembeli</div>
                    <div className="font-semibold text-slate-800">{order.buyerName}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-slate-400 font-semibold">Email</div>
                    <div className="text-slate-700 truncate">{order.buyerEmail}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Wallet className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-400 font-semibold">Metode Bayar</div>
                    <div className="font-semibold text-slate-800">{order.paymentMethod}</div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="text-slate-700">
                      <span className="font-medium">{item.ticketName}</span>
                      <span className="text-slate-400"> × {item.quantity}</span>
                    </div>
                    <div className="font-semibold text-slate-900">
                      {formatRupiah(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-sm">
                  <span className="font-semibold text-slate-500">Total Pembayaran</span>
                  <span className="font-bold text-slate-900">{formatRupiah(order.totalAmount)}</span>
                </div>
                {order.paidAt && (
                  <p className="text-[11px] text-slate-400">
                    Dikonfirmasi otomatis pada {formatDateTimeIndo(order.paidAt)}.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* E-Tickets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-slate-700" />
                <span>E-Ticket ({tickets.length} Tiket)</span>
              </h3>
              <span className="text-xs text-slate-500">Tunjukkan QR di gate venue</span>
            </div>

            {tickets.map((tix) => (
              <div
                key={tix.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-12 relative"
              >
                <div className="md:col-span-8 p-5 sm:p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {tix.ticketTypeName}
                    </span>
                    {tix.status === 'used' ? (
                      <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        SUDAH DIGUNAKAN
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        BELUM DIGUNAKAN
                      </span>
                    )}
                  </div>

                  <div className="font-mono font-bold text-slate-900 tracking-widest">
                    {tix.ticketCode}
                  </div>

                  <div className="text-xs text-slate-500">
                    {tix.status === 'used'
                      ? `Check-in pada ${formatDateTimeIndo(tix.usedAt)} oleh ${tix.usedByStaffName || 'staf lapangan'}.`
                      : 'Tiket aktif dan siap dipindai satu kali saat memasuki venue.'}
                  </div>
                </div>

                <div className="hidden md:block absolute left-[66.666%] -top-3 -bottom-3 w-0 border-r-2 border-dashed border-slate-300 z-10 pointer-events-none"></div>

                <div className="md:col-span-4 bg-slate-50/80 p-5 sm:p-6 flex flex-col items-center justify-center text-center space-y-2.5 border-t md:border-t-0 md:border-l border-slate-200">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl inline-block">
                    <QRCodeSVG value={tix.ticketCode} size={110} level="H" includeMargin={false} />
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified by GoFest</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Idle Helper */}
      {searchedNumber === null && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <PackageSearch className="w-5 h-5" />
          </div>
          <div className="text-sm text-slate-600 leading-relaxed">
            <div className="font-semibold text-slate-900 mb-1">Nomor pesanan tidak ada di tangan?</div>
            Tiket dan nomor pesanan otomatis dikirim ke email pembeli setelah transaksi.
            Buka kembali email konfirmasi GoFest, atau hubungi kami melalui{' '}
            <Link to="/kontak" className="font-semibold text-slate-800 hover:underline">
              halaman kontak
            </Link>
            .
          </div>
        </div>
      )}
    </div>
  );
}
