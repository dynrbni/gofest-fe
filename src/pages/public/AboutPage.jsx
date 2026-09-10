import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ShieldCheck, Zap, QrCode, Building2, Percent, Wallet, ArrowRight, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const location = useLocation();

  // Scroll to #fee / #scanner sections when arriving via footer deep links
  useEffect(() => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (!target) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [location.hash]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Tentang Kami
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Solusi Ticketing Terpercaya untuk Setiap Momen Spesial
        </h1>
        <p className="text-slate-600 text-sm">
          GoFest hadir untuk menjembatani ribuan Event Organizer dengan para penikmat musik, festival, dan edukasi di seluruh nusantara.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
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

      {/* Fee Structure (deep-linked from footer: /tentang#fee) */}
      <section id="fee" className="scroll-mt-32 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Struktur Biaya & Komisi</h2>
            <p className="text-xs text-slate-500 mt-1">
              Transparan untuk penyelenggara — yang Anda lihat adalah yang Anda bayar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Komisi GoFest',
              value: '5%',
              desc: 'dari penjualan tiket, dipotong otomatis saat pencairan dana',
            },
            {
              title: 'Biaya Payment Gateway',
              value: 'Mulai 1,7%',
              desc: 'sesuai metode pembayaran yang dipilih pembeli',
            },
            {
              title: 'Pencairan Dana',
              value: 'H+3',
              desc: 'paling lambat 3 hari kerja setelah event berakhir',
            },
          ].map((item) => (
            <div key={item.title} className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {item.title}
              </div>
              <div className="text-xl font-bold text-slate-900">{item.value}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Tanpa biaya pendaftaran dan tanpa biaya bulanan. Pembeli tidak dikenakan biaya
            tambahan di luar harga tiket yang tertera.
          </span>
        </div>
      </section>

      {/* QR Scanner System (deep-linked from footer: /tentang#scanner) */}
      <section id="scanner" className="scroll-mt-32 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Sistem QR Scanner</h2>
            <p className="text-xs text-slate-400 mt-1">
              Check-in di gate berjalan cepat, terverifikasi, dan anti-kecurangan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: '1',
              title: 'EO menugaskan staf',
              desc: 'Penyelenggara menetapkan staf verifikator dan event yang boleh mereka akses dari portal EO.',
            },
            {
              step: '2',
              title: 'Staf memindai QR',
              desc: 'Di pintu masuk, staf memindai QR code pada e-ticket menggunakan aplikasi scanner GoFest.',
            },
            {
              step: '3',
              title: 'Sistem memvalidasi',
              desc: 'Tiket palsu, ganda, atau dari event lain ditolak otomatis. Setiap check-in tercatat pada log real-time.',
            },
          ].map((item) => (
            <div key={item.step} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
              <span className="inline-flex w-6 h-6 rounded-lg bg-white text-slate-900 font-bold text-xs items-center justify-center">
                {item.step}
              </span>
              <h3 className="font-bold text-sm">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5" />
            Hasil scan masuk ke laporan penjualan & kehadiran Anda secara langsung.
          </p>
          <Link
            to="/eo/register"
            className="inline-flex items-center gap-1.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs px-4 py-2.5 rounded-lg transition"
          >
            <span>Mulai Jadi Partner EO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Verification Note */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Setiap EO melewati kurasi Admin</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
              Pendaftaran promotor direview Admin Platform sebelum bisa menjual tiket —
              sehingga semua event di GoFest berasal dari penyelenggara terverifikasi.
            </p>
          </div>
        </div>
        <Link
          to="/penyelenggara"
          className="shrink-0 inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition"
        >
          <span>Lihat Daftar Penyelenggara</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
