import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Download, Printer, Mail, Calendar, 
  MapPin, Ticket, Sparkles, Copy, ArrowRight, Share2, ShieldCheck 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateIndo, formatDateTimeIndo } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function TicketSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { info, success } = useToast();

  const order = useMemo(() => {
    const orders = StorageService.getOrders();
    return orders.find(o => o.id === orderId);
  }, [orderId]);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Ticket className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Pesanan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">Nomor pesanan mungkin tidak valid atau sudah kedaluwarsa.</p>
        <Link to="/" className="inline-block bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    success(`Kode tiket ${code} berhasil disalin!`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Success Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto text-white shadow-inner">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-1">
          <span className="bg-emerald-800/60 text-emerald-100 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Transaksi Sukses • Status: LUNAS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Pembayaran Berhasil Dikonfirmasi!
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-lg mx-auto">
            Terima kasih, <strong>{order.buyerName}</strong>. E-ticket resmi Anda telah diterbitkan dan siap ditunjukkan kepada staf saat memasuki venue.
          </p>
        </div>

        {/* Email sent notification box (PRD BUY-06) */}
        <div className="bg-emerald-950/40 border border-emerald-400/30 rounded-2xl p-3 max-w-md mx-auto flex items-center justify-center gap-2 text-xs text-emerald-100">
          <Mail className="w-4 h-4 text-amber-300 shrink-0" />
          <span>Salinan e-ticket otomatis terkirim ke <strong>{order.buyerEmail}</strong></span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <div className="text-xs text-slate-600">
          No. Transaksi: <strong className="font-mono text-slate-900">{order.orderNumber}</strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Unduh PDF</span>
          </button>

          <Link
            to="/"
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition"
          >
            <span>Selesai & Beranda</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Individual Digital E-Tickets (PRD 7: QR Code Unik) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-brand-600" />
            <span>E-Ticket Digital ({order.tickets?.length || 1} Tiket)</span>
          </h2>
          <span className="text-xs text-slate-500">Tunjukkan QR code ini di pintu masuk (gate)</span>
        </div>

        {order.tickets?.map((tix, idx) => (
          <div
            key={tix.id || idx}
            className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12 relative print:border-2 print:border-black"
          >
            {/* Left side: Event Info & Buyer Details */}
            <div className="md:col-span-8 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-brand-50 text-brand-700 border border-brand-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {tix.ticketTypeName}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>BELUM DIGUNAKAN</span>
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 leading-snug mb-2">
                  {order.eventTitle}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-2">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Tanggal Acara</div>
                      <div>{formatDateIndo(order.eventDate)}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-800">Lokasi Venue</div>
                      <div className="line-clamp-2">{order.eventLocation}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendee Info & Security Token */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-end justify-between gap-4 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pemegang Tiket</div>
                  <div className="font-bold text-slate-900 text-sm">{order.buyerName}</div>
                  <div className="text-slate-500 text-[11px]">{order.buyerEmail} • {order.buyerPhone}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nomor Tiket</div>
                  <div className="flex items-center gap-1.5 font-mono font-black text-brand-700 text-sm">
                    <span>{tix.ticketCode}</span>
                    <button
                      onClick={() => handleCopyCode(tix.ticketCode)}
                      title="Salin Kode Tiket"
                      className="text-slate-400 hover:text-brand-600 transition print:hidden"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Tear Notch (Visual perforations) */}
            <div className="hidden md:block absolute left-[66.666%] -top-3 -bottom-3 w-0 border-r-2 border-dashed border-slate-300 z-10 pointer-events-none"></div>

            {/* Right side: Scannable QR Code */}
            <div className="md:col-span-4 bg-slate-50/80 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-3 border-t md:border-t-0 md:border-l border-slate-200">
              <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs inline-block">
                <QRCodeSVG
                  value={tix.ticketCode}
                  size={140}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-0.5">
                <div className="font-mono text-xs font-bold text-slate-800 tracking-widest">
                  {tix.ticketCode}
                </div>
                <div className="text-[10px] text-slate-400">
                  Scan di pintu masuk dengan kamera staf
                </div>
              </div>

              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified by GoFest</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
