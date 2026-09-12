import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import DecorativeQR from '../../components/common/DecorativeQR';

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 -rotate-1 hover:rotate-0 transition-transform duration-300">
        {/* Left: Message */}
        <div className="sm:col-span-8 p-8 sm:p-10 text-center sm:text-left">
          <span className="inline-block bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Error 404
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mt-4 tracking-tight leading-tight">
            Halaman tidak ditemukan
          </h1>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-sm mx-auto sm:mx-0">
            Alamat yang Anda buka tidak tersedia atau telah dipindahkan. Periksa kembali
            tautan, atau lanjutkan mencari event seru di GoFest.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
            <Link
              to="/jelajah"
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-lg transition"
            >
              <Compass className="w-4 h-4" />
              <span>Jelajah Event</span>
            </Link>
          </div>
        </div>

        {/* Right: Failed Scan */}
        <div className="sm:col-span-4 bg-slate-50 border-t sm:border-t-0 sm:border-l-2 sm:border-dashed sm:border-slate-300 p-8 flex flex-col items-center justify-center gap-4">
          <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-card" role="img" aria-label="Ilustrasi QR code gagal dipindai">
            <DecorativeQR cell={6} />
          </div>
          <div className="text-center space-y-1">
            <div className="font-mono text-[11px] font-bold tracking-[0.2em] text-slate-700">
              SCAN GAGAL
            </div>
            <div className="font-mono text-[10px] tracking-widest text-slate-400">
              TIKET · 404 · TIDAK VALID
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
