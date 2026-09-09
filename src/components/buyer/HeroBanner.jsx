import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Sparkles } from 'lucide-react';
import { formatDateIndo, formatRupiah } from '../../utils/formatters';

export default function HeroBanner({ featuredEvents = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback banners if not enough featured events
  const banners = featuredEvents.length > 0 ? featuredEvents : [
    {
      id: 'ev-1',
      title: 'Remember Fest 2026: The Nostalgic Sound',
      tagline: '#SOLUSITIKET EVENTMU',
      category: 'Festival Musik',
      date: '2026-11-07',
      location: 'Gambir Expo Kemayoran, Jakarta',
      banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      minPrice: 135000,
    },
    {
      id: 'ev-5',
      title: '2026 GONG YOO ASIA FANMEETING TOUR <THE LONG TAKE>',
      tagline: 'THE LONG TAKE • LIVE IN JAKARTA',
      category: 'Fanmeeting',
      date: '2026-10-17',
      location: 'Istora Senayan, Jakarta Pusat',
      banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      minPrice: 1750000,
    },
    {
      id: 'ev-2',
      title: "SYNC 2026 'Luminaria' feat. Adrian Khalif",
      tagline: 'LIVE PERFORMANCE & LIGHT EXPERIENCE',
      category: 'Konser',
      date: '2026-10-17',
      location: 'Grand Studio BSD, Tangerang',
      banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      minPrice: 80000,
    },
    {
      id: 'ev-3',
      title: 'Ayo Fest 2026: Youth & Indie Explosion',
      tagline: 'FESTIVAL MUSIK & KREATIF TERBESAR',
      category: 'Festival',
      date: '2026-09-20',
      location: 'Stadion Kridosono, Yogyakarta',
      banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
      minPrice: 125000,
    }
  ];

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative bg-gradient-to-b from-brand-900 via-brand-800 to-slate-50 pt-6 pb-12 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-accent-orange/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel Viewport with Artatix-style 3D Coverflow Perspective */}
        <div className="relative flex items-center justify-center min-h-[360px] md:min-h-[420px]">
          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-2 md:left-6 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-brand-900 shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Slides Container */}
          <div className="relative w-full max-w-4xl h-[340px] md:h-[400px] flex items-center justify-center">
            {banners.map((item, index) => {
              // Calculate relative offset for coverflow positioning
              const total = banners.length;
              let offset = (index - currentIndex + total) % total;
              if (offset > total / 2) offset -= total;

              const isCenter = offset === 0;
              const isLeft = offset === -1 || (offset < 0 && offset >= -2);
              const isRight = offset === 1 || (offset > 0 && offset <= 2);
              const isVisible = Math.abs(offset) <= 1;

              // Calculate style transforms
              let transformStyle = '';
              let opacityStyle = 0;
              let zIndex = 10;

              if (isCenter) {
                transformStyle = 'translateX(0%) scale(1) rotateY(0deg)';
                opacityStyle = 1;
                zIndex = 25;
              } else if (isLeft) {
                transformStyle = 'translateX(-55%) scale(0.85) rotateY(15deg)';
                opacityStyle = 0.55;
                zIndex = 15;
              } else if (isRight) {
                transformStyle = 'translateX(55%) scale(0.85) rotateY(-15deg)';
                opacityStyle = 0.55;
                zIndex = 15;
              } else {
                transformStyle = offset > 0 ? 'translateX(100%) scale(0.6)' : 'translateX(-100%) scale(0.6)';
                opacityStyle = 0;
                zIndex = 5;
              }

              const lowestPrice = item.ticketTypes
                ? Math.min(...item.ticketTypes.map(t => t.price))
                : item.minPrice || 100000;

              return (
                <div
                  key={item.id || index}
                  className={`absolute w-full h-full transition-all duration-700 ease-out cursor-pointer rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/20 select-none ${
                    !isVisible ? 'pointer-events-none' : ''
                  }`}
                  style={{
                    transform: transformStyle,
                    opacity: opacityStyle,
                    zIndex: zIndex,
                  }}
                  onClick={() => {
                    if (!isCenter) setCurrentIndex(index);
                  }}
                >
                  <Link to={`/event/${item.id}`} className="block w-full h-full relative group">
                    <img
                      src={item.banner}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                    {/* Badge Slogan in Artatix style */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2">
                      <span className="bg-brand-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-brand-400/40 shadow-md flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        {item.category || 'Featured Event'}
                      </span>
                    </div>

                    {/* Banner Content Details */}
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-8 md:right-8 text-white">
                      <div className="text-amber-400 font-extrabold tracking-wider text-xs md:text-sm uppercase mb-1 drop-shadow">
                        {item.tagline || `#SOLUSITIKET EVENTMU`}
                      </div>

                      <h2 className="text-lg md:text-2xl lg:text-3xl font-black leading-tight drop-shadow-md line-clamp-2 max-w-2xl mb-2">
                        {item.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-3 md:gap-5 text-xs text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-brand-300 shrink-0" />
                          <span>{formatDateIndo(item.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-brand-300 shrink-0" />
                          <span className="truncate max-w-[200px] md:max-w-xs">{item.location}</span>
                        </div>
                        <div className="ml-auto bg-accent-orange text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg">
                          Mulai {formatRupiah(lowestPrice)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-2 md:right-6 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-brand-900 shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {banners.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              className={`h-2 transition-all duration-300 rounded-full ${
                dotIdx === currentIndex
                  ? 'w-8 bg-brand-600'
                  : 'w-2 bg-brand-300/60 hover:bg-brand-400'
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
