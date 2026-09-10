import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, HelpCircle, ScrollText } from 'lucide-react';

const TERMS_SECTIONS = [
  {
    title: 'Definisi',
    body: [
      'GoFest adalah platform marketplace ticketing daring yang mempertemukan penyelenggara event dengan pembeli tiket di Indonesia.',
      'Event Organizer (EO) adalah pihak yang menyelenggarakan event dan menjual tiket melalui platform setelah lolos verifikasi. Pembeli adalah pihak yang membeli tiket, dan E-Ticket adalah tiket digital berkode QR unik yang diterbitkan sistem.',
    ],
  },
  {
    title: 'Akun dan Peran Pengguna',
    body: [
      'Pembeli dapat bertransaksi tanpa membuat akun menggunakan email dan nomor WhatsApp aktif.',
      'Penyelenggara wajib mendaftar sebagai Partner EO dan menunggu verifikasi Admin Platform sebelum dapat membuat atau mempublikasikan event. Staf verifikator hanya dapat memindai tiket pada event yang ditugaskan oleh EO-nya.',
    ],
  },
  {
    title: 'Pembelian Tiket',
    body: [
      'Harga, kelas kuota, dan jumlah maksimum tiket per transaksi ditentukan oleh penyelenggara masing-masing event.',
      'Pesanan mengikat setelah pembayaran terkonfirmasi dan e-ticket diterbitkan. Kuota yang tersedia dapat berubah sewaktu-waktu mengikuti penjualan berjalan.',
    ],
  },
  {
    title: 'Pembayaran',
    body: [
      'GoFest menerima pembayaran melalui Virtual Account, QRIS, dan e-wallet. Konfirmasi pembayaran berjalan otomatis begitu dana diterima.',
      'Seluruh biaya yang dikenakan ditampilkan sebelum pembayaran diselesaikan. GoFest tidak meminta pembayaran di luar kanal resmi platform.',
    ],
  },
  {
    title: 'E-Ticket dan Check-in',
    body: [
      'Setiap e-ticket berisi kode QR unik yang hanya dapat digunakan satu kali untuk check-in. Sistem akan menolak tiket palsu, ganda, atau yang tidak terdaftar pada event tersebut.',
      'Menjual ulang tiket dengan harga lebih tinggi di luar GoFest tidak dianjurkan dan melewati seluruh perlindungan pembeli platform.',
    ],
  },
  {
    title: 'Refund dan Pembatalan',
    body: [
      'Ketentuan pembatalan dan refund mengikuti kebijakan penyelenggara sebagaimana tercantum pada halaman detail event.',
      'Apabila event dibatalkan tanpa pengganti, pembeli berhak mengajukan refund sesuai ketentuan penyelenggara melalui kanal bantuan GoFest.',
    ],
  },
  {
    title: 'Kewajiban Penyelenggara',
    body: [
      'Penyelenggara bertanggung jawab atas keakuratan informasi event, jadwal, kuota, serta kelengkapan izin penyelenggaraan.',
      'Laporan penjualan tersedia di portal EO, dan pencairan dana dilakukan paling lambat 3 hari kerja setelah event berakhir.',
    ],
  },
  {
    title: 'Perubahan Ketentuan',
    body: [
      'GoFest dapat memperbarui ketentuan ini sewaktu-waktu. Versi terbaru selalu tersedia di halaman ini dan berlaku sejak dipublikasikan.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <ScrollText className="w-3.5 h-3.5" />
          Legal
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Syarat & Ketentuan
        </h1>
        <p className="text-sm text-slate-500">
          Ketentuan penggunaan platform GoFest bagi pembeli tiket dan penyelenggara event.
          Terakhir diperbarui: 1 September 2026.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {TERMS_SECTIONS.map((section, idx) => (
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

      {/* Related Links */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Dokumen terkait</div>
            <div className="text-xs text-slate-500">
              Baca juga Kebijakan Privasi dan FAQ kami sebelum bertransaksi.
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            to="/kebijakan-privasi"
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg transition"
          >
            Kebijakan Privasi
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
  );
}
