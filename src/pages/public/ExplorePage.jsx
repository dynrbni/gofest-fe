import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, ArrowUpDown } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState('date-asc');

  const allEvents = useMemo(() => StorageService.getPublishedEvents(), []);

  const filteredEvents = useMemo(() => {
    let result = [...allEvents];

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

    if (selectedCategory !== 'all') {
      result = result.filter(e => e.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedCity !== 'all') {
      result = result.filter(e => e.city?.toLowerCase().includes(selectedCity.toLowerCase()));
    }

    result.sort((a, b) => {
      const getMinPrice = (ev) => ev.ticketTypes?.length ? Math.min(...ev.ticketTypes.map(t => t.price)) : 0;

      if (sortBy === 'price-asc') {
        return getMinPrice(a) - getMinPrice(b);
      } else if (sortBy === 'price-desc') {
        return getMinPrice(b) - getMinPrice(a);
      } else {
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
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Jelajah Event
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Temukan festival, konser, seminar, dan hiburan di berbagai kota.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari event, artis, atau promotor..."
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white transition"
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

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-slate-800 font-medium cursor-pointer text-sm"
            >
              <option value="date-asc">Waktu Terdekat</option>
              <option value="price-asc">Harga Termurah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="border-t border-slate-100 pt-3">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* City Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-sm">
          <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
            <MapPin className="w-3.5 h-3.5" />
            Lokasi:
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

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <div>
          Menampilkan <strong className="text-slate-900">{filteredEvents.length}</strong> event
          {searchQuery && <span> untuk "<strong className="text-slate-700">{searchQuery}</strong>"</span>}
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
            className="text-slate-500 hover:text-slate-900 font-medium transition"
          >
            Hapus Filter
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-16 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
          <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Event tidak ditemukan</h3>
          <p className="text-sm text-slate-500">
            Coba gunakan kata kunci lain atau pilih semua kategori.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedCity('all');
            }}
            className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition"
          >
            Tampilkan Semua
          </button>
        </div>
      )}
    </div>
  );
}
