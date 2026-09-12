import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, TrendingUp, Calendar, ArrowRight, 
  MapPin, QrCode, ShieldCheck, Zap 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import HeroBanner from '../../components/buyer/HeroBanner';
import EventCard from '../../components/buyer/EventCard';
import CityFilter from '../../components/buyer/CityFilter';
import CityCard from '../../components/buyer/CityCard';
import DecorativeQR from '../../components/common/DecorativeQR';

const EXPLORE_CITIES = [
  {
    name: 'DKI Jakarta',
    filter: 'Jakarta',
    landmark: 'monas',
    tileBg: 'bg-orange-50',
    gradient: 'from-orange-400 to-rose-500',
  },
  {
    name: 'Kota Tangerang',
    filter: 'Tangerang',
    landmark: 'masjid',
    tileBg: 'bg-sky-50',
    gradient: 'from-sky-400 to-blue-600',
  },
  {
    name: 'Yogyakarta',
    filter: 'Yogyakarta',
    landmark: 'tugu',
    tileBg: 'bg-violet-50',
    gradient: 'from-violet-400 to-purple-600',
  },
  {
    name: 'Kota Surabaya',
    filter: 'Surabaya',
    landmark: 'suramadu',
    tileBg: 'bg-teal-50',
    gradient: 'from-emerald-400 to-teal-600',
  },
];

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState('all');

  const publishedEvents = useMemo(() => {
    return StorageService.getPublishedEvents();
  }, []);

  const featuredEvents = useMemo(() => {
    return publishedEvents.filter(e => e.featured);
  }, [publishedEvents]);

  const recommendedEvents = useMemo(() => {
    let filtered = publishedEvents;
    if (selectedCity !== 'all') {
      filtered = filtered.filter(e => e.city?.toLowerCase().includes(selectedCity.toLowerCase()));
    }
    return filtered;
  }, [publishedEvents, selectedCity]);

  const trendingEvents = useMemo(() => {
    return publishedEvents.filter(e => e.trending);
  }, [publishedEvents]);

  return (
    <div className="pb-16">
      {/* Hero Banner */}
      <HeroBanner featuredEvents={featuredEvents} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Filter row */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 sm:p-6 -mt-6 relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CityFilter
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
          />

          <Link
            to="/jelajah"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shrink-0"
          >
            <span>Semua Event</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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
              <p className="text-slate-500 text-sm mt-1">Coba pilih kota lain.</p>
              <button
                onClick={() => setSelectedCity('all')}
                className="mt-4 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* Kenapa Beli di GoFest */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Kenapa beli tiket di GoFest
              </span>
              <h3 className="text-2xl md:text-3xl font-bold leading-snug">
                Tiketnya asli. Masuknya mulus.
              </h3>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                Dari checkout sampai gerbang venue — semua cepat, tercatat, dan bisa diverifikasi.
              </p>
            </div>

            <ul className="divide-y divide-white/10">
              {[
                { icon: Zap, title: 'Checkout tanpa akun', desc: 'Isi nama, email, dan WhatsApp. E-ticket terbit begitu pembayaran terkonfirmasi.' },
                { icon: QrCode, title: 'Satu QR, satu kali masuk', desc: 'Tiap tiket punya kode QR unik yang dipindai staf di gate. Duplikat otomatis ditolak.' },
                { icon: ShieldCheck, title: 'EO lolos kurasi admin', desc: 'Penyelenggara diverifikasi tim GoFest lebih dulu sebelum boleh menjual tiket.' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Link
              to="/cek-pesanan?nomor=GF-2026-88912"
              className="group/ticket relative w-full max-w-xs -rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <div className="bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-12">
                <div className="col-span-8 p-4 space-y-2.5">
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    BELUM DIGUNAKAN
                  </span>
                  <h4 className="font-bold text-sm leading-snug line-clamp-2">
                    Remember Fest 2026: The Nostalgic Sound
                  </h4>
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>7 Nov 2026</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Gambir Expo, Jakarta</span>
                    </div>
                  </div>
                  <div className="pt-2.5 border-t border-slate-100">
                    <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nomor Tiket</div>
                    <div className="font-mono text-xs font-bold">GF-TIX-1001A</div>
                  </div>
                </div>

                <div className="col-span-4 relative bg-slate-50 border-l-2 border-dashed border-slate-300 p-4 flex flex-col items-center justify-center gap-2.5">
                  <div className="relative">
                    <DecorativeQR cell={5} />
                    <div className="absolute left-0 right-0 h-[3px] bg-brand-500 rounded-full opacity-0 group-hover/ticket:animate-[scan-sweep_1.6s_ease-in-out_infinite]"></div>
                  </div>
                  <div className="text-[9px] font-semibold text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified by GoFest
                  </div>
                </div>
              </div>
            </Link>
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
