import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Building2, ShieldCheck, 
  AlertCircle, Minus, Plus, ShoppingCart, ChevronLeft, 
  Share2, Heart, CheckCircle2, Info, Ticket 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { error } = useToast();

  const event = useMemo(() => StorageService.getEventById(id), [id]);

  const [quantities, setQuantities] = useState({});
  const [activeTab, setActiveTab] = useState('deskripsi');

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Event Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500">Event yang Anda cari mungkin telah berakhir atau belum dipublikasikan.</p>
        <Link to="/jelajah" className="inline-block bg-slate-900 text-white font-medium text-sm px-5 py-2.5 rounded-lg">
          Kembali ke Jelajah
        </Link>
      </div>
    );
  }

  const updateQuantity = (ticketTypeId, delta, maxAvailable) => {
    setQuantities(prev => {
      const current = prev[ticketTypeId] || 0;
      const next = Math.max(0, Math.min(maxAvailable, current + delta));
      return { ...prev, [ticketTypeId]: next };
    });
  };

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
      error('Silakan pilih minimal 1 tiket sebelum melanjutkan');
      return;
    }

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

  const tabs = [
    { id: 'deskripsi', label: 'Deskripsi' },
    { id: 'syarat', label: 'Syarat & Ketentuan' },
    { id: 'lokasi', label: 'Lokasi' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-700 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Kembali</span>
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Image */}
        <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto bg-slate-100">
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-slate-700">
              {event.category}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* EO */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Oleh <strong className="text-slate-700">{event.eoName}</strong></span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {event.title}
            </h1>

            {/* Date & Location */}
            <div className="space-y-2.5 pt-2 text-sm">
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-900">{formatDateIndo(event.date)}</div>
                  {event.time && <div className="text-slate-500 text-xs mt-0.5">{event.time}</div>}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-900">{event.location}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{event.city}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Tiket Resmi Terverifikasi</span>
            </div>
            <div className="text-slate-400">
              Instant E-Ticket
            </div>
          </div>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Tabs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex border-b border-slate-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'deskripsi' && (
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 space-y-4 text-sm text-slate-700 leading-relaxed">
              <h3 className="text-base font-semibold text-slate-900">Tentang Event Ini</h3>
              <p className="whitespace-pre-line text-slate-600">
                {event.description}
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600 space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5 text-slate-800">
                  <Info className="w-4 h-4 text-slate-400" /> Informasi Penting:
                </div>
                <p>• Pintu masuk dibuka 2 jam sebelum acara.</p>
                <p>• Siapkan e-ticket dengan QR Code saat check-in.</p>
                <p>• Dilarang membawa makanan/minuman dari luar.</p>
              </div>
            </div>
          )}

          {activeTab === 'syarat' && (
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 space-y-4 text-sm text-slate-700 leading-relaxed">
              <h3 className="text-base font-semibold text-slate-900">Syarat & Ketentuan</h3>
              <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                <li>Tiket sah hanya dibeli melalui platform resmi GoFest.</li>
                <li>Maksimal 5 tiket per jenis dalam satu transaksi.</li>
                <li>E-ticket dikirim ke email setelah pembayaran terkonfirmasi.</li>
                <li>Tiket tidak dapat di-refund kecuali acara dibatalkan penyelenggara.</li>
                <li>Penyelenggara berhak menolak pengunjung tanpa QR code valid.</li>
              </ul>
            </div>
          )}

          {activeTab === 'lokasi' && (
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 space-y-4 text-sm">
              <h3 className="text-base font-semibold text-slate-900">Lokasi Acara</h3>
              <div className="flex items-start gap-2.5 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-900">{event.location}</div>
                  <div>{event.city}, Indonesia</div>
                </div>
              </div>
              <div className="w-full h-56 bg-slate-50 rounded-lg overflow-hidden border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <MapPin className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Peta Lokasi Venue</span>
                <span className="text-xs text-slate-400">{event.location}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Ticket Selector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 sticky top-24 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pilih Tiket</h2>
              <p className="text-sm text-slate-500 mt-0.5">Pilih jenis dan jumlah tiket</p>
            </div>

            {/* Ticket Tiers */}
            <div className="space-y-3">
              {event.ticketTypes?.map(tier => {
                const remaining = (tier.quota || 0) - (tier.sold || 0);
                const isSoldOut = remaining <= 0;
                const qty = quantities[tier.id] || 0;
                const maxAllowed = Math.min(5, remaining);

                return (
                  <div
                    key={tier.id}
                    className={`p-4 rounded-lg border transition-all ${
                      qty > 0
                        ? 'border-slate-900 bg-slate-50'
                        : isSoldOut
                        ? 'border-slate-100 bg-slate-50 opacity-60'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900">{tier.name}</h4>
                        {tier.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{tier.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-slate-900">
                          {formatRupiah(tier.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                      <div className="text-xs">
                        {isSoldOut ? (
                          <span className="text-rose-500 font-medium">Habis</span>
                        ) : remaining <= 10 ? (
                          <span className="text-amber-600 font-medium">Sisa {remaining} tiket</span>
                        ) : (
                          <span className="text-slate-500">Tersedia ({remaining})</span>
                        )}
                      </div>

                      {isSoldOut ? (
                        <span className="text-xs text-slate-400 font-medium">Sold Out</span>
                      ) : (
                        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(tier.id, -1, maxAllowed)}
                            disabled={qty === 0}
                            className="w-7 h-7 rounded bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition border border-slate-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center text-slate-900">{qty}</span>
                          <button
                            onClick={() => updateQuantity(tier.id, 1, maxAllowed)}
                            disabled={qty >= maxAllowed}
                            className="w-7 h-7 rounded bg-white text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition border border-slate-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Total Tiket:</span>
                <span className="font-medium text-slate-900">{totalTickets}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-slate-200">
                <span className="text-slate-700 font-medium">Total Bayar:</span>
                <span className="text-lg font-bold text-slate-900">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleProceedCheckout}
              disabled={totalTickets === 0}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-medium text-sm py-3.5 rounded-lg transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Beli Sekarang</span>
            </button>

            <div className="text-center">
              <span className="text-xs text-slate-400">
                Tanpa registrasi akun · E-ticket ke email
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
