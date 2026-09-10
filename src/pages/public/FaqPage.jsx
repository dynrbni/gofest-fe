import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircleQuestion, Send } from 'lucide-react';

const FAQ_GROUPS = [
  {
    id: 'tiket',
    title: 'Tiket & Pembelian',
    items: [
      {
        q: 'Apakah saya harus membuat akun untuk membeli tiket?',
        a: 'Tidak perlu. GoFest mendukung checkout tanpa akun: cukup isi nama, email, dan nomor WhatsApp, lalu e-ticket langsung terbit setelah pembayaran terkonfirmasi.',
      },
      {
        q: 'Bagaimana cara mengecek status pesanan saya?',
        a: 'Buka halaman Cek Status Pesanan, masukkan nomor pesanan Anda (contoh: GF-2026-88912), dan sistem akan menampilkan detail pembayaran beserta seluruh e-ticket.',
      },
      {
        q: 'E-ticket saya belum masuk ke email. Apa yang harus dilakukan?',
        a: 'Periksa folder spam terlebih dahulu. Jika tetap tidak ditemukan, buka Cek Status Pesanan untuk melihat dan menyalin ulang kode tiket Anda, atau hubungi support@gofest.id.',
      },
      {
        q: 'Bisakah saya memindahtangankan tiket ke orang lain?',
        a: 'Setiap e-ticket memiliki QR code unik yang hanya bisa dipindai satu kali. Pastikan pemegang tiket membawa e-ticket asli miliknya saat check-in di gate agar tidak ditolak sistem.',
      },
    ],
  },
  {
    id: 'pembayaran',
    title: 'Pembayaran & Refund',
    items: [
      {
        q: 'Metode pembayaran apa saja yang tersedia?',
        a: 'GoFest menerima Virtual Account (BCA, Mandiri, BNI, BRI), QRIS, serta e-wallet populer. Konfirmasi pembayaran berjalan otomatis begitu dana diterima, tanpa perlu verifikasi manual.',
      },
      {
        q: 'Mengapa harga tiket berbeda-beda di satu event yang sama?',
        a: 'Penyelenggara menjual tiket dalam beberapa kelas kuota. Kelas dengan fasilitas lebih — misalnya zona VIP, tempat duduk bernomor, atau bundling dua hari — dijual dengan harga dan kuota tersendiri.',
      },
      {
        q: 'Bagaimana kebijakan refund tiket?',
        a: 'Ketentuan pembatalan dan refund mengikuti kebijakan masing-masing penyelenggara sebagaimana tercantum pada halaman detail event. Prinsip umumnya dijelaskan pada halaman Syarat & Ketentuan.',
      },
    ],
  },
  {
    id: 'penyelenggara',
    title: 'Untuk Penyelenggara (EO)',
    items: [
      {
        q: 'Bagaimana cara menjadi Partner EO di GoFest?',
        a: 'Daftarkan organisasi Anda melalui halaman Daftar Jadi Partner EO. Tim Admin Platform akan memverifikasi profil organisasi, dan setelah disetujui Anda dapat langsung membuat serta menjual event.',
      },
      {
        q: 'Berapa biaya yang dikenakan GoFest kepada penyelenggara?',
        a: 'GoFest memotong komisi 5% dari penjualan tiket ditambah biaya payment gateway sesuai penyedia. Tidak ada biaya pendaftaran maupun biaya bulanan tersembunyi.',
      },
      {
        q: 'Kapan hasil penjualan tiket bisa dicairkan?',
        a: 'Dana penjualan dicairkan paling lambat 3 hari kerja (H+3) setelah event berakhir, disertai laporan penjualan yang dapat diunduh dari portal EO.',
      },
      {
        q: 'Bagaimana sistem check-in di lokasi event bekerja?',
        a: 'EO menugaskan staf verifikator melalui portal, lalu staf memindai QR code pada e-ticket di gate. Sistem menolak tiket palsu atau ganda secara otomatis, dan setiap check-in tercatat pada log real-time.',
      },
    ],
  },
];

export default function FaqPage() {
  const [openId, setOpenId] = useState('tiket-0');

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <MessageCircleQuestion className="w-3.5 h-3.5" />
          Pusat Bantuan
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Pertanyaan yang Sering Diajukan
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Jawaban singkat seputar pembelian tiket, pembayaran, dan kemitraan penyelenggara.
        </p>
      </div>

      {/* FAQ Groups */}
      {FAQ_GROUPS.map((group) => (
        <section key={group.id} id={group.id} className="scroll-mt-32 space-y-3">
          <h2 className="text-base font-bold text-slate-900 px-1">{group.title}</h2>
          <div className="space-y-2.5">
            {group.items.map((item, idx) => {
              const itemId = `${group.id}-${idx}`;
              const isOpen = openId === itemId;

              return (
                <div
                  key={itemId}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(itemId)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${itemId}`}
                    id={`faq-button-${itemId}`}
                    className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left hover:bg-slate-50 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
                  >
                    <span className="text-sm font-semibold text-slate-800 leading-snug">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-panel-${itemId}`}
                      role="region"
                      aria-labelledby={`faq-button-${itemId}`}
                      className="px-4 sm:px-5 pb-4 -mt-0.5 text-sm text-slate-600 leading-relaxed"
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Contact CTA */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-3">
        <h3 className="text-lg font-bold">Tidak menemukan jawaban Anda?</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Tim kami siap membantu seputar transaksi tiket, e-ticket yang bermasalah, atau
          kebutuhan kemitraan penyelenggara.
        </p>
        <Link
          to="/kontak"
          className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-sm px-5 py-2.5 rounded-lg transition"
        >
          <Send className="w-4 h-4" />
          <span>Hubungi Kami</span>
        </Link>
      </div>
    </div>
  );
}
