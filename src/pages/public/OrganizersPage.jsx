import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ShieldCheck, Calendar, MapPin, ArrowRight, Building2
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';

const SORT_OPTIONS = [
  { id: 'events', label: 'Terbanyak Event' },
  { id: 'date', label: 'Event Terdekat' },
  { id: 'name', label: 'Nama A-Z' },
];

export default function OrganizersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('events');

  const organizers = useMemo(() => {
    const publishedEvents = StorageService.getPublishedEvents();
    const groups = new Map();

    publishedEvents.forEach((event) => {
      const name = event.eoName || 'Penyelenggara';
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(event);
    });

    const today = new Date().setHours(0, 0, 0, 0);

    return Array.from(groups.entries()).map(([name, events]) => {
      const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
      const prices = events
        .flatMap((e) => (e.ticketTypes || []).map((t) => t.price))
        .filter((p) => p > 0);

      return {
        name,
        events: sorted,
        eventCount: events.length,
        categories: [...new Set(events.map((e) => e.category).filter(Boolean))],
        cities: [...new Set(events.map((e) => e.city).filter(Boolean))],
        nextEvent: sorted.find((e) => new Date(e.date).getTime() >= today) || null,
        minPrice: prices.length ? Math.min(...prices) : 0,
      };
    });
  }, []);

  const filteredOrganizers = useMemo(() => {
    let result = organizers;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((o) =>
        o.name.toLowerCase().includes(q) ||
        o.categories.some((c) => c.toLowerCase().includes(q)) ||
        o.cities.some((c) => c.toLowerCase().includes(q))
      );
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') {
        const da = a.nextEvent ? new Date(a.nextEvent.date).getTime() : Infinity;
        const db = b.nextEvent ? new Date(b.nextEvent.date).getTime() : Infinity;
        return da - db;
      }
      return b.eventCount - a.eventCount;
    });
  }, [organizers, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          Terkurasi & Terverifikasi
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Daftar Penyelenggara Event
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Seluruh promotor di bawah telah lolos verifikasi Admin Platform GoFest sebelum
          boleh menjual tiket. Temukan penyelenggara favorit Anda dan jelajahi seluruh
          event aktif mereka.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari penyelenggara, kategori, atau kota..."
            className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 shrink-0">
          <span className="text-slate-400 font-medium">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-slate-800 font-medium cursor-pointer text-sm"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-500">
        Menampilkan <strong className="text-slate-900">{filteredOrganizers.length}</strong> penyelenggara
        {searchQuery && <span> untuk "<strong className="text-slate-700">{searchQuery}</strong>"</span>}
      </div>

      {/* Organizer Grid */}
      {filteredOrganizers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredOrganizers.map((org) => (
            <div
              key={org.name}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col gap-4 hover:border-slate-300 hover:shadow-card-hover transition-all duration-300"
            >
              {/* Identity */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-lg shrink-0">
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 leading-snug truncate">
                      {org.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1">
                      <ShieldCheck className="w-3 h-3" />
                      Terverifikasi Admin
                    </span>
                  </div>
                </div>
                <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg font-semibold shrink-0">
                  {org.eventCount} Event
                </span>
              </div>

              {/* Categories */}
              {org.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {org.categories.slice(0, 3).map((cat) => (
                    <span
                      key={cat}
                      className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      {cat}
                    </span>
                  ))}
                  {org.categories.length > 3 && (
                    <span className="text-[11px] text-slate-400 self-center">
                      +{org.categories.length - 3} kategori lain
                    </span>
                  )}
                </div>
              )}

              {/* Cities */}
              {org.cities.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {org.cities.slice(0, 2).join(' · ')}
                    {org.cities.length > 2 ? ` · +${org.cities.length - 2} kota` : ''}
                  </span>
                </div>
              )}

              {/* Next Event */}
              {org.nextEvent ? (
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    <strong className="text-slate-800 font-semibold">
                      {formatDateIndo(org.nextEvent.date)}
                    </strong>
                    <span className="text-slate-300 mx-1.5">·</span>
                    {org.nextEvent.title}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>Saat ini belum ada event mendatang</span>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Tiket mulai dari
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {org.minPrice > 0 ? formatRupiah(org.minPrice) : '-'}
                  </div>
                </div>
                <Link
                  to={`/jelajah?q=${encodeURIComponent(org.name)}`}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0"
                >
                  <span>Lihat Event</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-16 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
          <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Penyelenggara tidak ditemukan</h3>
          <p className="text-sm text-slate-500">
            Coba kata kunci lain, misalnya nama promotor, kategori, atau kota.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition"
          >
            Tampilkan Semua
          </button>
        </div>
      )}

      {/* Join CTA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Ingin tampil di halaman ini?
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
            Daftarkan organisasi Anda sebagai Partner EO GoFest
          </h3>
          <p className="text-slate-500 text-sm">
            Lolos verifikasi Admin, publikasikan event, dan mulai menjual tiket resmi
            dengan sistem QR check-in.
          </p>
        </div>
        <Link
          to="/eo/register"
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm px-6 py-3 rounded-lg transition shrink-0 text-center"
        >
          Daftar Jadi Partner EO
        </Link>
      </div>
    </div>
  );
}
