import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, ChevronLeft, Calendar, MapPin, 
  User, Mail, Phone, CreditCard, Building2, CheckCircle2, 
  ArrowRight, AlertCircle, Sparkles 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import PaymentModal from '../../components/checkout/PaymentModal';

export default function CheckoutPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { error, success, info } = useToast();

  const [checkoutData, setCheckoutData] = useState(null);
  const [buyerForm, setBuyerForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('BCA Virtual Account');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('gofest_checkout_draft');
    if (!raw) {
      navigate('/jelajah');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setCheckoutData(parsed);
    } catch {
      navigate('/jelajah');
    }
  }, [navigate]);

  if (!checkoutData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">Menyiapkan form checkout tiket...</p>
      </div>
    );
  }

  const { event, items, totalAmount, totalTickets } = checkoutData;

  const paymentOptions = [
    {
      id: 'BCA Virtual Account',
      name: 'BCA Virtual Account',
      desc: 'Verifikasi instan otomatis 24 jam',
      badge: 'Paling Populer',
      category: 'Virtual Account',
    },
    {
      id: 'Mandiri Virtual Account',
      name: 'Mandiri Virtual Account',
      desc: 'Bayar via Livin by Mandiri atau ATM',
      category: 'Virtual Account',
    },
    {
      id: 'QRIS (GoPay/OVO/ShopeePay)',
      name: 'QRIS Interaktif',
      desc: 'Scan dari seluruh e-wallet & m-banking',
      badge: 'Instan',
      category: 'E-Wallet',
    },
    {
      id: 'Kartu Kredit / Debit',
      name: 'Kartu Kredit / Debit Visa & Mastercard',
      desc: 'Pembayaran aman dengan 3D Secure OTP',
      category: 'Kartu',
    },
  ];

  const handleOpenPayment = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!buyerForm.name.trim()) {
      error('Harap masukkan nama lengkap pemesan');
      return;
    }
    if (!buyerForm.email.trim() || !buyerForm.email.includes('@')) {
      error('Harap masukkan alamat email yang valid untuk pengiriman e-ticket');
      return;
    }
    if (!buyerForm.phone.trim() || buyerForm.phone.length < 9) {
      error('Harap masukkan nomor handphone / WhatsApp yang aktif');
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    try {
      // Create persistent order & reduce quota in storage
      const newOrder = StorageService.createOrder({
        event,
        items,
        buyer: buyerForm,
        paymentMethod,
      });

      // Clear draft
      sessionStorage.removeItem('gofest_checkout_draft');
      setIsPaymentModalOpen(false);

      success('Pembayaran Berhasil! E-ticket resmi telah diterbitkan.');
      navigate(`/tiket-berhasil/${newOrder.id}`);
    } catch (err) {
      error(err.message || 'Gagal memproses pesanan');
      setIsPaymentModalOpen(false);
    }
  };

  const handlePaymentCancel = () => {
    setIsPaymentModalOpen(false);
    info('Pembayaran dibatalkan. Kuota tiket telah dikembalikan.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Back & Flow indicator */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Detail Event</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-slate-700">1. Data Pemesan</span>
          <span>&gt;</span>
          <span className="font-semibold text-slate-700">2. Pembayaran</span>
          <span>&gt;</span>
          <span className="text-slate-400">3. E-Ticket</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Guest Buyer Form & Payment Method */}
        <div className="lg:col-span-7 space-y-8">
          {/* Guest Checkout Notice Card (PRD BUY-03 & 7.Usability) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-900">
            <Sparkles className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-sm">Guest Checkout (Tanpa Perlu Akun)</div>
              <p className="text-slate-800 mt-0.5 leading-relaxed">
                Anda tidak perlu login atau membuat password. Pastikan email yang Anda isi aktif, karena seluruh file e-ticket dan barcode QR code akan dikirimkan langsung ke alamat email tersebut.
              </p>
            </div>
          </div>

          {/* 1. Buyer Information Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-slate-700" />
              <h2 className="font-bold text-base">Identitas Pemesan</h2>
            </div>

            <form onSubmit={handleOpenPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap Sesuai KTP / Paspor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={buyerForm.name}
                  onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alamat Email (E-Ticket Dikirim Kesini) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={buyerForm.email}
                  onChange={(e) => setBuyerForm({ ...buyerForm, email: e.target.value })}
                  placeholder="contoh@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor Handphone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={buyerForm.phone}
                  onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white text-xs"
                />
              </div>
            </form>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-slate-700" />
              <h2 className="font-bold text-base">Metode Pembayaran Online</h2>
            </div>

            <div className="space-y-3">
              {paymentOptions.map(opt => {
                const selected = paymentMethod === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selected
                        ? 'border-slate-700 bg-slate-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selected}
                        onChange={() => setPaymentMethod(opt.id)}
                        className="mt-1 text-slate-700 focus:ring-slate-400 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{opt.name}</span>
                          {opt.badge && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sticky top-24 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ringkasan Pesanan</h2>
              <p className="text-xs text-slate-500">Periksa kembali tiket dan kuantitas pesanan Anda</p>
            </div>

            {/* Event Overview */}
            <div className="flex gap-3 pb-4 border-b border-slate-100">
              <img
                src={event.banner}
                alt={event.title}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-900 line-clamp-2 leading-snug">{event.title}</h4>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <span>{formatDateIndo(event.date)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <span className="truncate max-w-[170px]">{event.location}</span>
                </div>
              </div>
            </div>

            {/* Itemized Tickets List */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-700">Daftar Tiket:</div>
              {items.map(item => (
                <div key={item.ticketTypeId} className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-100">
                  <div>
                    <div className="font-bold text-slate-900">{item.ticketName}</div>
                    <div className="text-[11px] text-slate-500">
                      {item.quantity} x {formatRupiah(item.price)}
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Tiket ({totalTickets} tiket)</span>
                <span>{formatRupiah(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biaya Layanan Platform</span>
                <span className="text-emerald-700 font-semibold">GRATIS (Promo)</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-slate-200">
                <span className="font-bold text-sm text-slate-900">Total Tagihan</span>
                <span className="text-xl font-bold text-slate-800">{formatRupiah(totalAmount)}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleOpenPayment}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-slate-900/10 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Lanjut ke Pembayaran ({formatRupiah(totalAmount)})</span>
            </button>

            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transaksi Terenkripsi dan Terjamin Aman</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal Simulator */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={{ ...checkoutData, buyerForm }}
        paymentMethod={paymentMethod}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentCancel={handlePaymentCancel}
      />
    </div>
  );
}
