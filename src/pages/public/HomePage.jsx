import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, Sparkles, TrendingUp, Calendar, ArrowRight, 
  MapPin, CheckCircle2, QrCode, ShieldCheck, Zap 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import HeroBanner from '../../components/buyer/HeroBanner';
import EventCard from '../../components/buyer/EventCard';
import CategoryFilter from '../../components/buyer/CategoryFilter';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  // Load published events
  const publishedEvents = useMemo(() => {
    return StorageService.getPublishedEvents();
  }, []);

  // Featured events for Hero Banner
  const featuredEvents = useMemo(() => {
    return publishedEvents.filter(e => e.featured);
  }, [publishedEvents]);

  // Recommended & Trending Events
  const recommendedEvents = useMemo(() => {
    let filtered = publishedEvents;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedCity !== 'all') {
      filtered = filtered.filter(e => e.city?.toLowerCase().includes(selectedCity.toLowerCase()));
    }
    return filtered;
  }, [publishedEvents, selectedCategory, selectedCity]);

  const trendingEvents = useMemo(() => {
    return publishedEvents.filter(e => e.trending);
  }, [publishedEvents]);

  const cities = ['Semua Kota', 'Jakarta', 'Yogyakarta', 'Tangerang', 'Surabaya'];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Coverflow Banner Section */}
      <HeroBanner featuredEvents={featuredEvents} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 2. Category & City Filter Section */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 -mt-8 relative z-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* City Quick Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1 pl-1">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                Kota:
              </span>
              {cities.map(c => {
                const val = c === 'Semua Kota' ? 'all' : c;
                const active = selectedCity === val;
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedCity(val)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      active
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Rekomendasi Event (Artatix Style Header) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Rekomendasi Event
                </h2>
                <p className="text-xs text-slate-500">
                  Pilihan konser musik dan festival paling diminati minggu ini
                </p>
              </div>
            </div>

            <Link
              to="/jelajah"
              className="text-xs md:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:gap-2 transition-all"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid Cards */}
          {recommendedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedEvents.slice(0, 8).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <div className="text-slate-800 font-bold text-base">Tidak ada event yang sesuai filter</div>
              <p className="text-slate-500 text-xs mt-1">Coba pilih kategori atau kota lain untuk menemukan event menarik.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedCity('all'); }}
                className="mt-4 bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-brand-700 transition"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* 4. Banner Callout: "Kenapa Beli Tiket di GoFest?" */}
        <section className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white mb-1">Guest Checkout Instan</h4>
                <p className="text-xs text-brand-100 leading-relaxed">
                  Tidak perlu ribet daftar akun baru atau isi formulir panjang. Cukup email & nomor WhatsApp, e-ticket langsung terbit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-400 shrink-0">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white mb-1">E-Ticket QR Code Terenkripsi</h4>
                <p className="text-xs text-brand-100 leading-relaxed">
                  Setiap tiket memiliki token QR code unik anti-duplikasi yang langsung dapat divalidasi staf di pintu masuk venue.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-accent-teal shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white mb-1">Garansi Tiket Resmi 100%</h4>
                <p className="text-xs text-brand-100 leading-relaxed">
                  Seluruh Event Organizer telah melewati verifikasi identitas & kurasi ketat tim Admin GoFest sebelum membuka penjualan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Lagi Trending (Loket Style Header) */}
        {trendingEvents.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-accent-orange" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Lagi Trending & Laris Manis
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tiket cepat habis! Jangan lewatkan kesempatan menonton musisi favoritmu
                  </p>
                </div>
              </div>

              <Link
                to="/jelajah"
                className="text-xs md:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Eksplor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* 6. Partner Organizer CTA */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Penyelenggara Event (EO)
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-snug">
              Ingin Menjual Tiket Event Anda Sendiri di GoFest?
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Daftarkan organisasi atau komunitas Anda, buat event, atur kuota dan jenis tiket, serta pantau laporan penjualan secara real-time. Dilengkapi fitur manajemen staf scanner di lokasi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/eo/register"
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-brand-600/20 transition-all text-center"
            >
              Daftar Jadi Partner EO
            </Link>
            <Link
              to="/login"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-2xl transition-all text-center"
            >
              Masuk ke Portal EO
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
