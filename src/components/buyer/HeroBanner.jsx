import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Ticket, CalendarDays } from 'lucide-react';
import { formatDateIndo, formatRupiah } from '../../utils/formatters';

export default function HeroBanner({ featuredEvents = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  const banners = useMemo(() => {
    if (featuredEvents.length > 0) return featuredEvents;

    return [
      {
        id: 'ev-1',
        title: 'Remember Fest 2026: The Nostalgic Sound',
        category: 'Festival Musik',
        date: '2026-11-07',
        time: '15:00 - 23:00 WIB',
        location: 'Gambir Expo Kemayoran, Jakarta',
        banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        minPrice: 135000,
      },
      {
        id: 'ev-5',
        title: '2026 GONG YOO ASIA FANMEETING TOUR <THE LONG TAKE>',
        category: 'Fanmeeting',
        date: '2026-10-17',
        time: '19:00 - 21:30 WIB',
        location: 'Istora Senayan, Jakarta Pusat',
        banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
        minPrice: 1750000,
      },
      {
        id: 'ev-2',
        title: "SYNC 2026 'Luminaria' feat. Adrian Khalif",
        category: 'Konser',
        date: '2026-10-17',
        time: '18:30 - 22:30 WIB',
        location: 'Grand Studio BSD, Tangerang',
        banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        minPrice: 80000,
      },
      {
        id: 'ev-3',
        title: 'Ayo Fest 2026: Youth & Indie Explosion',
        category: 'Festival',
        date: '2026-09-20',
        time: '14:00 - 23:00 WIB',
        location: 'Stadion Kridosono, Yogyakarta',
        banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
        minPrice: 125000,
      }
    ];
  }, [featuredEvents]);

  const goTo = useCallback((index) => {
    const total = banners.length;
    setCurrentIndex(((index % total) + total) % total);
  }, [banners.length]);

  const handleNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const handlePrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  // Auto-play without resetting on every index change
  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) handlePrev();
      else handleNext();
    }
    touchStartX.current = null;
  };

  const active = banners[currentIndex];

  const lowestPrice = active.ticketTypes
    ? Math.min(...active.ticketTypes.map(t => t.price))
    : active.minPrice || 100000;

  return (
    <div
      className="relative bg-slate-950 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Backdrop layer: stacked crossfading banners */}
      {banners.map((item, index) => (
        <div
          key={item.id || index}
          aria-hidden={index !== currentIndex}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={item.banner}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
        </div>
      ))}

      {/* Foreground content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-16 md:pb-20">
        {/* Section Header */}
        <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Event Pilihan
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Jangan lewatkan event-event terbaik yang sedang berlangsung
            </p>
          </div>

          {/* Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Slide sebelumnya"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Slide berikutnya"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active slide info */}
        <div
          key={active?.id || currentIndex}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end animate-fade-up"
        >
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-block bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg">
              {active?.category || 'Featured'}
            </span>

            <h3 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
              {active?.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{formatDateIndo(active?.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-[220px] md:max-w-xs">{active?.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to={`/event/${active?.id}`}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition"
              >
                <Ticket className="w-4 h-4" />
                <span>Beli Tiket</span>
              </Link>
              <span className="text-sm text-white/70">
                Mulai dari <strong className="text-white font-bold">{formatRupiah(lowestPrice)}</strong>
              </span>
            </div>
          </div>

          {/* Schedule mini-card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white text-slate-900 flex flex-col items-center justify-center shrink-0 leading-none">
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  {new Date(active?.date).toLocaleDateString('id-ID', { month: 'short' })}
                </span>
                <span className="text-sm font-black">
                  {new Date(active?.date).getDate()}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  Jadwal event
                </div>
                <div className="text-sm font-semibold text-white truncate">{active?.time || 'Lihat detail'}</div>
                <div className="text-xs text-white/60 truncate">{active?.location}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile arrows */}
        <div className="flex sm:hidden items-center gap-2 mt-6">
          <button
            onClick={handlePrev}
            aria-label="Slide sebelumnya"
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center transition active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Slide berikutnya"
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center transition active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-6">
          {banners.map((item, dotIdx) => (
            <button
              key={item.id || dotIdx}
              onClick={() => goTo(dotIdx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                dotIdx === currentIndex
                  ? 'w-6 bg-white'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Ke slide ${dotIdx + 1}: ${item.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
