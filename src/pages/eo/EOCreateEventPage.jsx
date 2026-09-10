import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, Trash2, Calendar, MapPin, Ticket, Image, 
  Sparkles, CheckCircle2, ChevronLeft, ArrowRight, ShieldCheck, Info 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { formatRupiah } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function EOCreateEventPage() {
  const { currentUser, quickSwitch } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Curated banner presets for easy testing
  const bannerPresets = [
    { label: 'Festival Musik Indie', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Konser Pop / Lighting', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Stadium Festival Rock', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Seminar & Konferensi Tech', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Pameran & Pop-Up Art', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' },
  ];

  const [form, setForm] = useState({
    title: '',
    category: 'Musik',
    date: '2026-11-20',
    time: '18:00 - 23:00 WIB',
    location: 'Istora Senayan, GBK',
    city: 'Jakarta Pusat',
    banner: bannerPresets[0].url,
    description: '',
  });

  // Multi-tier tickets (PRD EO-04)
  const [ticketTypes, setTicketTypes] = useState([
    { name: 'Early Bird Festival', price: 95000, quota: 250, description: 'Kuota terbatas masuk area festival' },
    { name: 'Presale Regular', price: 150000, quota: 500, description: 'Akses masuk standard' },
    { name: 'VIP Front Row', price: 300000, quota: 100, description: 'Area terdekat panggung + merchandise lanyard' },
  ]);

  const handleAddTicketTier = () => {
    setTicketTypes([
      ...ticketTypes,
      { name: `Tiket Kategori ${ticketTypes.length + 1}`, price: 100000, quota: 100, description: '' }
    ]);
  };

  const handleRemoveTicketTier = (index) => {
    if (ticketTypes.length <= 1) {
      error('Event harus memiliki minimal 1 jenis tiket');
      return;
    }
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const handleTicketChange = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.location.trim()) {
      error('Harap isi judul dan lokasi event');
      return;
    }

    if (ticketTypes.length === 0) {
      error('Harap tambahkan minimal 1 jenis tiket');
      return;
    }

    try {
      // Create new event in pending_review status (PRD EO-05 & Flow 5.2)
      const newEvent = StorageService.createEvent(
        { ...form, ticketTypes },
        currentUser
      );

      success('Event berhasil diajukan ke Admin untuk ditinjau!');
      navigate('/eo/events');
    } catch (err) {
      error(err.message || 'Gagal membuat event');
    }
  };

  const totalQuotaSum = ticketTypes.reduce((acc, t) => acc + Number(t.quota || 0), 0);
  const potentialRevenue = ticketTypes.reduce((acc, t) => acc + (Number(t.price || 0) * Number(t.quota || 0)), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/eo/events"
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Buat Event Baru
            </h1>
            <p className="text-xs text-slate-500">
              Isi data lengkap acara dan konfigurasikan jenis tiket bertingkat (multi-tier)
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* Section 1: Informasi Acara */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-5 h-5 text-slate-700" />
            <h2 className="font-bold text-base text-slate-900">1. Informasi Umum Acara</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Nama / Judul Event <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: Soundrenaline Fest 2026: The Sonic Horizon"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kategori Event <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white cursor-pointer"
              >
                <option value="Musik">Musik</option>
                <option value="Konser">Konser</option>
                <option value="Festival">Festival</option>
                <option value="Fanmeeting">Fanmeeting</option>
                <option value="Seminar">Seminar & Workshop</option>
                <option value="Pameran">Pameran & Kreatif</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tanggal Acara <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Waktu Pelaksanaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="15:00 - 23:00 WIB"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Gedung / Venue <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Contoh: Istora Senayan, GBK"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kota / Wilayah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Contoh: Jakarta Pusat"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>
          </div>

          {/* Banner URL & Preset Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Poster / Banner Gambar Event (Rasio 16:9) <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              value={form.banner}
              onChange={(e) => setForm({ ...form, banner: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white mb-2"
            />

            {/* Quick preset chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Pilihan Preset:
              </span>
              {bannerPresets.map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setForm({ ...form, banner: preset.url })}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                    form.banner === preset.url
                      ? 'bg-slate-50 border-slate-400 text-slate-800 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Preview Banner */}
            {form.banner && (
              <div className="mt-3 relative aspect-[16/9] max-h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src={form.banner} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  Live Poster Preview
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Deskripsi Lengkap Event <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tuliskan line-up artis pengisi acara, rundown, tata tertib, dan keunggulan festival Anda..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
            ></textarea>
          </div>
        </div>

        {/* Section 2: Multi-Tier Tickets (PRD EO-04) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-slate-700" />
              <div>
                <h2 className="font-bold text-base text-slate-900">2. Konfigurasi Jenis & Harga Tiket (Multi-Tier)</h2>
                <p className="text-[11px] text-slate-500">Tentukan nama kategori tiket, harga dalam Rupiah, dan batasan kuota</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddTicketTier}
              className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kategori Tiket</span>
            </button>
          </div>

          {/* Ticket Tiers List */}
          <div className="space-y-3">
            {ticketTypes.map((tier, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-xs">
                    Kategori #{idx + 1}
                  </span>
                  {ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTicketTier(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition"
                      title="Hapus Kategori Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nama Tiket</label>
                    <input
                      type="text"
                      required
                      value={tier.name}
                      onChange={(e) => handleTicketChange(idx, 'name', e.target.value)}
                      placeholder="Contoh: Presale 1 Regular"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={1000}
                      value={tier.price}
                      onChange={(e) => handleTicketChange(idx, 'price', Number(e.target.value))}
                      placeholder="150000"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-slate-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Kuota Tiket</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={tier.quota}
                      onChange={(e) => handleTicketChange(idx, 'quota', Number(e.target.value))}
                      placeholder="500"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-slate-400 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-slate-600 font-semibold mb-1">Keterangan / Benefit Tiket</label>
                    <input
                      type="text"
                      value={tier.description}
                      onChange={(e) => handleTicketChange(idx, 'description', e.target.value)}
                      placeholder="Contoh: Termasuk 1 minuman gratis & tempat duduk bernomor"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sum Summary Card */}
          <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-slate-600 font-medium">Total Kapasitas Penjualan:</div>
              <div className="text-lg font-bold text-slate-900">
                {totalQuotaSum.toLocaleString('id-ID')} Tiket ({ticketTypes.length} Kategori)
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-600 font-medium">Potensi Omzet Maksimal:</div>
              <div className="text-lg font-bold text-slate-800">
                {formatRupiah(potentialRevenue)}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Card & Admin Review Notice (PRD EO-05 & Flow 5.2) */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-base text-white">
                Alur Approval Admin (PRD Bagian 5.2)
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Setelah Anda menekan tombol di bawah, event akan otomatis masuk ke antrean <strong>Pending Review</strong> tim Admin GoFest. Setelah disetujui Admin, event akan langsung tayang secara otomatis di halaman utama marketplace dan dapat dibeli publik.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 bg-slate-500 hover:bg-slate-900 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Ajukan Event ke Admin (Submit for Review)</span>
            </button>

            <Link
              to="/eo/events"
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-center transition"
            >
              Batal
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
