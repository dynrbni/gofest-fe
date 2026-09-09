import React from 'react';
import { ShieldCheck, Zap, QrCode, Sparkles, Building2, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Tentang Kami
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Solusi Ticketing Terpercaya untuk Setiap Momen Spesial
        </h1>
        <p className="text-slate-600 text-sm">
          GoFest hadir untuk menjembatani ribuan Event Organizer dengan para penikmat musik, festival, dan edukasi di seluruh nusantara.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Frictionless Checkout</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pembeli dapat menyelesaikan transaksi tiket dalam waktu kurang dari 60 detik tanpa wajib membuat akun terlebih dahulu.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Keamanan QR Code Unik</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Setiap e-ticket dibekali kode token acak terenkripsi yang mencegah pemalsuan dan double check-in di gate venue.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Ekosistem EO Terintegrasi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Promotor memiliki kendali penuh atas harga tiket bertingkat, penugasan staf pemindai tiket, dan transparansi laporan penjualan.
          </p>
        </div>
      </div>
    </div>
  );
}
