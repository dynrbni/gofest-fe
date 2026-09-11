import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, TrendingUp, Calendar, ArrowRight, 
  MapPin, QrCode, ShieldCheck, Zap 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import HeroBanner from '../../components/buyer/HeroBanner';
import EventCard from '../../components/buyer/EventCard';
import CategoryFilter from '../../components/buyer/CategoryFilter';
import CityCard from '../../components/buyer/CityCard';

const EXPLORE_CITIES = [
  {
    name: 'DKI Jakarta',
    filter: 'Jakarta',
    image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=400&q=80',
    imageAlt: 'Bundaran HI, Jakarta',
    gradient: 'from-orange-400 to-rose-500',
  },
  {
    name: 'Kota Tangerang',
    filter: 'Tangerang',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    imageAlt: 'Panggung konser di Tangerang',
    gradient: 'from-sky-400 to-blue-600',
  },
  {
    name: 'Yogyakarta',
    filter: 'Yogyakarta',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80',
    imageAlt: 'Kerumunan festival di Yogyakarta',
    gradient: 'from-violet-400 to-purple-600',
  },
  {
    name: 'Kota Surabaya',
    filter: 'Surabaya',
    image: 'https://images.unsplash.com/photo-1589041127168-9b1915731dc3?auto=format&fit=crop&w=400&q=80',
    imageAlt: 'Jembatan Suramadu, Surabaya',
    gradient: 'from-emerald-400 to-teal-600',
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  const publishedEvents = useMemo(() => {
    return StorageService.getPublishedEvents();
  }, []);

  const featuredEvents = useMemo(() => {
    return publishedEvents.filter(e => e.featured);
  }, [publishedEvents]);

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
    <div className="pb-16">
      {/* Hero Banner */}
      <HeroBanner featuredEvents={featuredEvents} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Category & City Filter */}
        <section className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 -mt-6 relative z-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-sm">
              <span className="text-slate-400 font-medium flex items-center gap-1 pl-1">
                <MapPin className="w-3.5 h-3.5" />
                Kota:
              </span>
              {cities.map(c => {
                const val = c === 'Semua Kota' ? 'all' : c;
                const active = selectedCity === val;
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedCity(val)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition text-sm ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Jelajahi Event di Kotamu */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </span>
                Jelajahi Event di Kotamu
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Pilih kotamu dan temukan event yang sedang berlangsung di sana.
              </p>
            </div>

            <Link
              to="/jelajah"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition shrink-0"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {EXPLORE_CITIES.map((city) => (
              <CityCard key={city.filter} city={city} />
            ))}
          </div>
        </section>

        {/* Rekomendasi Event */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                Rekomendasi Event
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Event paling diminati minggu ini
              </p>
            </div>

            <Link
              to="/jelajah"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recommendedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendedEvents.slice(0, 8).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-12 text-center border border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <div className="text-slate-800 font-semibold text-base">Tidak ada event yang sesuai filter</div>
              <p className="text-slate-500 text-sm mt-1">Coba pilih kategori atau kota lain.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedCity('all'); }}
                className="mt-4 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* Kenapa Beli di GoFest */}
        <section className="bg-slate-50 rounded-2xl p-8 md:p-10 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Kenapa beli tiket di GoFest?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Guest Checkout Instan', desc: 'Tidak perlu daftar akun. Cukup email & WhatsApp, e-ticket langsung terbit.' },
              { icon: QrCode, title: 'E-Ticket QR Code', desc: 'Setiap tiket memiliki QR code unik anti-duplikasi yang langsung bisa divalidasi.' },
              { icon: ShieldCheck, title: 'Garansi Tiket Resmi', desc: 'Seluruh Event Organizer telah melewati verifikasi identitas oleh tim GoFest.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending */}
        {trendingEvents.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  Sedang Trending
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Tiket cepat habis — jangan sampai ketinggalan
                </p>
              </div>

              <Link
                to="/jelajah"
                className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition"
              >
                <span>Eksplor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Partner CTA */}
        <section className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Untuk Penyelenggara Event
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
              Ingin menjual tiket event Anda di GoFest?
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Daftarkan organisasi Anda, buat event, atur kuota tiket, dan pantau laporan penjualan secara real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/eo/register"
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-6 py-3 rounded-lg transition text-center"
            >
              Daftar Jadi Partner
            </Link>
            <Link
              to="/login"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm px-6 py-3 rounded-lg transition text-center"
            >
              Masuk Portal EO
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
