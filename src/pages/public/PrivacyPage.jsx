import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HelpCircle, Lock } from 'lucide-react';

const PRIVACY_SECTIONS = [
  {
    title: 'Data yang Kami Kumpulkan',
    body: [
      'Untuk pemrosesan pesanan, kami mengumpulkan nama, alamat email, dan nomor WhatsApp pembeli, serta detail transaksi berupa event, jenis tiket, jumlah, dan status pembayaran.',
      'Untuk penyelenggara, kami menyimpan data organisasi, nama penanggung jawab, kontak resmi, dan profil portofolio sebagaimana diisi pada formulir pendaftaran Partner EO.',
    ],
  },
  {
    title: 'Cara Kami Menggunakan Data',
    body: [
      'Data pembeli digunakan untuk menerbitkan e-ticket, mengirim konfirmasi transaksi, dan memungkinkan pengecekan ulang pesanan melalui halaman Cek Status Pesanan.',
      'Data penjualan diproses menjadi laporan bagi penyelenggara terkait, dan data tiket digunakan sistem untuk mencegah pemalsuan serta check-in ganda di gate.',
    ],
  },
  {
    title: 'Penyimpanan dan Keamanan',
    body: [
      'Setiap e-ticket dilindungi kode QR acak unik yang tidak dapat ditebak atau digandakan.',
      'Akses data pembeli di lokasi event dibatasi hanya untuk staf verifikator yang resmi ditugaskan pada event terkait.',
    ],
  },
  {
    title: 'Pembagian Data kepada Pihak Terkait',
    body: [
      'Nama dan kode tiket pembeli dibagikan kepada penyelenggara event terkait sebatas keperluan check-in dan layanan di lokasi.',
      'GoFest tidak menjual dan tidak memperdagangkan data pribadi pengguna kepada pihak ketiga untuk tujuan iklan.',
    ],
  },
  {
    title: 'Hak Anda',
    body: [
      'Anda berhak meminta akses, koreksi, atau penghapusan data pribadi Anda, serta menarik persetujuan pemrosesan data.',
      'Ajukan permintaan melalui support@gofest.id; kami merespons dalam 1x24 jam pada hari kerja.',
    ],
  },
  {
    title: 'Cookie dan Penyimpanan Lokal',
    body: [
      'Situs menyimpan preferensi tampilan dan status sesi pada penyimpanan lokal peramban Anda agar pengalaman penggunaan tetap berjalan.',
      'Penyimpanan lokal ini tidak digunakan untuk melacak aktivitas Anda di situs lain.',
    ],
  },
  {
    title: 'Hubungi Kami',
    body: [
      'Pertanyaan seputar privasi dapat dikirim ke support@gofest.id atau melalui halaman Kontak GoFest.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          Privasi
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Kebijakan Privasi
        </h1>
        <p className="text-sm text-slate-500">
          Bagaimana GoFest mengumpulkan, menggunakan, dan melindungi data Anda.
          Terakhir diperbarui: 1 September 2026.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {PRIVACY_SECTIONS.map((section, idx) => (
          <section key={section.title} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs font-bold text-slate-400">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h2 className="font-bold text-slate-900">{section.title}</h2>
            </div>
            <div className="space-y-2.5 pl-0 sm:pl-8">
              {section.body.map((paragraph, i) => (
                <p key={i} className="text-sm text-slate-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Trust Note + Related Links */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900 mb-1">
            Komitmen kami: data Anda hanya bekerja untuk tiket Anda
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Data pribadi dipakai semata untuk menerbitkan tiket, menjalankan check-in,
            dan laporan penjualan yang Anda minta.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Link
              to="/syarat-ketentuan"
              className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition"
            >
              Syarat & Ketentuan
            </Link>
            <Link
              to="/faq"
              className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition"
            >
              FAQ
            </Link>
            <Link
              to="/kontak"
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition inline-flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
