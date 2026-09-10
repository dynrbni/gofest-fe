import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { formatDateIndo, formatRupiah } from '../../utils/formatters';

export default function HeroBanner({ featuredEvents = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = featuredEvents.length > 0 ? featuredEvents : [
    {
      id: 'ev-1',
      title: 'Remember Fest 2026: The Nostalgic Sound',
      category: 'Festival Musik',
      date: '2026-11-07',
      location: 'Gambir Expo Kemayoran, Jakarta',
      banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      minPrice: 135000,
    },
    {
      id: 'ev-5',
      title: '2026 GONG YOO ASIA FANMEETING TOUR <THE LONG TAKE>',
      category: 'Fanmeeting',
      date: '2026-10-17',
      location: 'Istora Senayan, Jakarta Pusat',
      banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      minPrice: 1750000,
    },
    {
      id: 'ev-2',
      title: "SYNC 2026 'Luminaria' feat. Adrian Khalif",
      category: 'Konser',
      date: '2026-10-17',
      location: 'Grand Studio BSD, Tangerang',
      banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      minPrice: 80000,
    },
    {
      id: 'ev-3',
      title: 'Ayo Fest 2026: Youth & Indie Explosion',
      category: 'Festival',
      date: '2026-09-20',
      location: 'Stadion Kridosono, Yogyakarta',
      banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
      minPrice: 125000,
    }
  ];

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
    <div className="relative bg-slate-50 pt-6 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Event Pilihan
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Jangan lewatkan event-event terbaik yang sedang berlangsung
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center min-h-[320px] md:min-h-[400px]">
          {/* Prev */}
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-2 md:left-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition hover:scale-105 active:scale-95 border border-slate-200/60"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slides */}
          <div className="relative w-full max-w-4xl h-[300px] md:h-[380px] flex items-center justify-center">
            {banners.map((item, index) => {
              const total = banners.length;
              let offset = (index - currentIndex + total) % total;
              if (offset > total / 2) offset -= total;

              const isCenter = offset === 0;
              const isLeft = offset === -1 || (offset < 0 && offset >= -2);
              const isRight = offset === 1 || (offset > 0 && offset <= 2);
              const isVisible = Math.abs(offset) <= 1;

              let transformStyle = '';
              let opacityStyle = 0;
              let zIndex = 10;

              if (isCenter) {
                transformStyle = 'translateX(0%) scale(1) rotateY(0deg)';
                opacityStyle = 1;
                zIndex = 25;
              } else if (isLeft) {
                transformStyle = 'translateX(-55%) scale(0.88) rotateY(12deg)';
                opacityStyle = 0.5;
                zIndex = 15;
              } else if (isRight) {
                transformStyle = 'translateX(55%) scale(0.88) rotateY(-12deg)';
                opacityStyle = 0.5;
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
                  className={`absolute w-full h-full transition-all duration-700 ease-out cursor-pointer rounded-2xl overflow-hidden shadow-lg select-none ${
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 md:top-5 md:left-5">
                      <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg">
                        {item.category || 'Featured'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 text-white">
                      <h2 className="text-lg md:text-2xl font-bold leading-tight line-clamp-2 max-w-2xl mb-3">
                        {item.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-white/80">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{formatDateIndo(item.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[180px] md:max-w-xs">{item.location}</span>
                        </div>
                        <div className="ml-auto bg-white text-slate-900 font-semibold px-3 py-1 rounded-lg text-xs">
                          {formatRupiah(lowestPrice)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Next */}
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-2 md:right-4 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition hover:scale-105 active:scale-95 border border-slate-200/60"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-5">
          {banners.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                dotIdx === currentIndex
                  ? 'w-6 bg-slate-900'
                  : 'w-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
