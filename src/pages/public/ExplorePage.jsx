import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { StorageService } from '../../services/storage';
import EventCard from '../../components/buyer/EventCard';
import CategoryFilter from '../../components/buyer/CategoryFilter';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc'); // 'date-asc' | 'price-asc' | 'price-desc'

  const allEvents = useMemo(() => StorageService.getPublishedEvents(), []);

  const filteredEvents = useMemo(() => {
    let result = [...allEvents];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.city?.toLowerCase().includes(q) ||
        e.eoName?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(e => e.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // City filter
    if (selectedCity !== 'all') {
      result = result.filter(e => e.city?.toLowerCase().includes(selectedCity.toLowerCase()));
    }

    // Sorting
    result.sort((a, b) => {
      const getMinPrice = (ev) => ev.ticketTypes?.length ? Math.min(...ev.ticketTypes.map(t => t.price)) : 0;

      if (sortBy === 'price-asc') {
        return getMinPrice(a) - getMinPrice(b);
      } else if (sortBy === 'price-desc') {
        return getMinPrice(b) - getMinPrice(a);
      } else {
        // Date ascending
        return new Date(a.date) - new Date(b.date);
      }
    });

    return result;
  }, [allEvents, searchQuery, selectedCategory, selectedCity, sortBy]);

  const cities = ['Semua Kota', 'Jakarta', 'Yogyakarta', 'Tangerang', 'Surabaya'];

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Jelajah & Beli Tiket Event
        </h1>
        <p className="text-sm text-slate-500">
          Temukan ratusan festival musik, konser, seminar, dan hiburan favorit di berbagai kota.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Top search & Sort Row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul event, artis, atau promotor..."
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-slate-900 font-bold cursor-pointer"
              >
                <option value="date-asc">Waktu Terdekat</option>
                <option value="price-asc">Harga Termurah</option>
                <option value="price-desc">Harga Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="border-t border-slate-100 pt-3">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            Pilih Lokasi:
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
                    ? 'bg-brand-900 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <div>
          Menampilkan <strong className="text-slate-900">{filteredEvents.length}</strong> event tersedia
          {searchQuery && <span> untuk kata kunci "<strong className="text-brand-700">{searchQuery}</strong>"</span>}
        </div>
        {(searchQuery || selectedCategory !== 'all' || selectedCity !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedCity('all');
              searchParams.delete('category');
              searchParams.delete('q');
              setSearchParams(searchParams);
            }}
            className="text-brand-600 hover:text-brand-700 font-bold hover:underline"
          >
            Hapus Semua Filter
          </button>
        )}
      </div>

      {/* Grid of Events */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Event tidak ditemukan</h3>
          <p className="text-xs text-slate-500">
            Maaf, kami tidak dapat menemukan event dengan kriteria filter tersebut. Coba gunakan kata kunci lain atau pilih semua kategori.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedCity('all');
            }}
            className="mt-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow"
          >
            Tampilkan Semua Event
          </button>
        </div>
      )}
    </div>
  );
}
