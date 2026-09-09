import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Building2, ShieldCheck, 
  AlertCircle, Minus, Plus, ShoppingCart, ChevronLeft, 
  Share2, Heart, CheckCircle2, Info, Ticket 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateIndo, getCategoryColor } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error } = useToast();

  const event = useMemo(() => StorageService.getEventById(id), [id]);

  // Selected ticket quantities: { [ticketTypeId]: quantity }
  const [quantities, setQuantities] = useState({});
  const [activeTab, setActiveTab] = useState('deskripsi'); // 'deskripsi' | 'syarat' | 'lokasi'

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <Ticket className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Event Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500">Event yang Anda cari mungkin telah berakhir atau belum dipublikasikan.</p>
        <Link to="/jelajah" className="inline-block bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
          Kembali ke Jelajah
        </Link>
      </div>
    );
  }

  const categoryStyle = getCategoryColor(event.category);

  // Handle quantity changes
  const updateQuantity = (ticketTypeId, delta, maxAvailable) => {
    setQuantities(prev => {
      const current = prev[ticketTypeId] || 0;
      const next = Math.max(0, Math.min(maxAvailable, current + delta));
      return { ...prev, [ticketTypeId]: next };
    });
  };

  // Calculate totals
  const selectedItems = useMemo(() => {
    if (!event.ticketTypes) return [];
    return event.ticketTypes
      .filter(t => (quantities[t.id] || 0) > 0)
      .map(t => ({
        ticketTypeId: t.id,
        ticketName: t.name,
        price: t.price,
        quantity: quantities[t.id],
        subtotal: t.price * quantities[t.id],
      }));
  }, [event.ticketTypes, quantities]);

  const totalTickets = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.subtotal, 0);

  const handleProceedCheckout = () => {
    if (totalTickets === 0) {
      error('Silakan pilih minimal 1 tiket sebelum melanjutkan ke checkout');
      return;
    }

    // Save draft cart into sessionStorage or state navigation
    sessionStorage.setItem('gofest_checkout_draft', JSON.stringify({
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        banner: event.banner,
        eoName: event.eoName,
      },
      items: selectedItems,
      totalAmount: totalPrice,
      totalTickets: totalTickets,
    }));

    navigate(`/checkout/${event.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali</span>
      </button>

      {/* Hero Header Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Poster Image */}
        <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto bg-slate-900">
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${categoryStyle.bg}`}>
              {event.category}
            </span>
          </div>
        </div>

        {/* Quick Info Box */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* EO Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs border border-brand-200">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span>Diselenggarakan oleh <strong className="text-slate-800 font-semibold">{event.eoName}</strong></span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {event.title}
            </h1>

            {/* Date & Time */}
            <div className="space-y-2.5 pt-2 text-xs text-slate-700">
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Calendar className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">{formatDateIndo(event.date)}</div>
                  {event.time && <div className="text-slate-500 mt-0.5">{event.time}</div>}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">{event.location}</div>
                  <div className="text-slate-500 mt-0.5">{event.city}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tiket Resmi Terverifikasi</span>
            </div>
            <div className="text-slate-400">
              Instant E-Ticket Delivery
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details on Left, Ticket Selector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details, Rules, Location */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('deskripsi')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'deskripsi'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Deskripsi Event
            </button>
            <button
              onClick={() => setActiveTab('syarat')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'syarat'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Syarat & Ketentuan
            </button>
            <button
              onClick={() => setActiveTab('lokasi')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'lokasi'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Venue & Akses
            </button>
          </div>

          {/* Tab Content: Deskripsi */}
          {activeTab === 'deskripsi' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm text-slate-700 leading-relaxed">
              <h3 className="text-base font-bold text-slate-900">Tentang Event Ini</h3>
              <p className="whitespace-pre-line text-slate-600">
                {event.description}
              </p>
              <div className="bg-brand-50/70 border border-brand-100 rounded-xl p-4 text-xs text-brand-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-brand-700">
                  <Info className="w-4 h-4" /> Informasi Penting Pengunjung:
                </div>
                <p>• Pintu masuk (gate) dibuka 2 jam sebelum waktu acara dimulai.</p>
                <p>• Harap siapkan e-ticket dengan QR Code yang jelas pada smartphone Anda saat check-in.</p>
                <p>• Dilarang membawa makanan dan minuman dari luar area venue acara.</p>
              </div>
            </div>
          )}

          {/* Tab Content: Syarat & Ketentuan */}
          {activeTab === 'syarat' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm text-slate-700 leading-relaxed">
              <h3 className="text-base font-bold text-slate-900">Syarat & Ketentuan Pembelian Tiket</h3>
              <ul className="space-y-2 text-xs text-slate-600 list-disc pl-5">
                <li>Tiket yang sah hanya dibeli melalui platform resmi GoFest.</li>
                <li>Satu pemesan dapat membeli maksimal 5 tiket per jenis kategori dalam satu transaksi.</li>
                <li>E-ticket akan dikirimkan otomatis ke email yang diisi saat checkout segera setelah pembayaran terkonfirmasi.</li>
                <li>Tiket tidak dapat di-refund atau diuangkan kembali kecuali acara dibatalkan secara sepihak oleh penyelenggara resmi.</li>
                <li>Penyelenggara berhak menolak pengunjung yang tidak dapat menunjukkan QR code tiket yang valid.</li>
              </ul>
            </div>
          )}

          {/* Tab Content: Lokasi */}
          {activeTab === 'lokasi' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4 text-sm">
              <h3 className="text-base font-bold text-slate-900">Lokasi Acara</h3>
              <div className="flex items-start gap-2.5 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">{event.location}</div>
                  <div>{event.city}, Indonesia</div>
                </div>
              </div>
              <div className="w-full h-60 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <MapPin className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold">Peta Interaktif Lokasi Venue</span>
                <span className="text-[11px] text-slate-400">{event.location}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Ticket Selection & Pricing */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sticky top-24 space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Pilih Kategori Tiket</h2>
              <p className="text-xs text-slate-500">Pilih jenis dan jumlah tiket yang ingin dipesan</p>
            </div>

            {/* Ticket Tier Cards */}
            <div className="space-y-3">
              {event.ticketTypes?.map(tier => {
                const remaining = (tier.quota || 0) - (tier.sold || 0);
                const isSoldOut = remaining <= 0;
                const qty = quantities[tier.id] || 0;
                const maxAllowed = Math.min(5, remaining);

                return (
                  <div
                    key={tier.id}
                    className={`p-4 rounded-xl border transition-all ${
                      qty > 0
                        ? 'border-brand-500 bg-brand-50/40 shadow-xs'
                        : isSoldOut
                        ? 'border-slate-200 bg-slate-50/80 opacity-70'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{tier.name}</h4>
                        {tier.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{tier.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-black text-sm text-brand-700">
                          {formatRupiah(tier.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                      {/* Quota tag */}
                      <div className="text-[11px]">
                        {isSoldOut ? (
                          <span className="text-rose-600 font-bold">Habis Terjual</span>
                        ) : remaining <= 10 ? (
                          <span className="text-amber-600 font-semibold">Tersisa {remaining} tiket lagi!</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">Tersedia ({remaining} tiket)</span>
                        )}
                      </div>

                      {/* Stepper controls */}
                      {isSoldOut ? (
                        <span className="text-xs text-slate-400 font-semibold italic">Sold Out</span>
                      ) : (
                        <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(tier.id, -1, maxAllowed)}
                            disabled={qty === 0}
                            className="w-7 h-7 rounded bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold shadow-xs transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-slate-900">{qty}</span>
                          <button
                            onClick={() => updateQuantity(tier.id, 1, maxAllowed)}
                            disabled={qty >= maxAllowed}
                            className="w-7 h-7 rounded bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold shadow-xs transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Calculation Summary */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Tiket Dipilih:</span>
                <span className="font-bold text-slate-900">{totalTickets} Tiket</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-slate-200">
                <span className="text-slate-800 font-bold text-sm">Total Pembayaran:</span>
                <span className="text-lg font-black text-brand-700">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={handleProceedCheckout}
              disabled={totalTickets === 0}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Beli Sekarang (Guest Checkout)</span>
            </button>

            <div className="text-center">
              <span className="text-[11px] text-slate-400">
                ⚡ Tanpa perlu registrasi akun. E-ticket langsung ke email.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
