import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ShieldCheck, CreditCard, Sparkles, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-slate-400 text-xs border-t border-brand-900 mt-20">
      {/* Trust & Guarantee Banner */}
      <div className="bg-brand-900/60 py-6 border-b border-brand-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-800/80 flex items-center justify-center text-accent-orange shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">100% Tiket Resmi & Terverifikasi</div>
              <div className="text-slate-400 text-xs">E-ticket dilengkapi barcode & QR code unik</div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-800/80 flex items-center justify-center text-accent-teal shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Pembayaran Instan & Aman</div>
              <div className="text-slate-400 text-xs">Virtual Account, QRIS, E-Wallet otomatis</div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-800/80 flex items-center justify-center text-accent-amber shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Checkout Cepat Tanpa Akun</div>
              <div className="text-slate-400 text-xs">Beli tiket instan langsung ke email Anda</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Col */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-orange flex items-center justify-center text-white">
              <Ticket className="w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold text-white">
              GoFest<span className="text-accent-orange">.</span>
            </span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed">
            Platform ticketing marketplace terlengkap di Indonesia untuk pengalaman konser, festival musik, konferensi teknologi, dan pertunjukan tak terlupakan.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#instagram" className="w-8 h-8 rounded-full bg-brand-900 hover:bg-brand-800 flex items-center justify-center text-slate-300 hover:text-white transition" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#twitter" className="w-8 h-8 rounded-full bg-brand-900 hover:bg-brand-800 flex items-center justify-center text-slate-300 hover:text-white transition" aria-label="X/Twitter">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#web" className="w-8 h-8 rounded-full bg-brand-900 hover:bg-brand-800 flex items-center justify-center text-slate-300 hover:text-white transition" aria-label="Website">
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Kategori Event</h4>
          <ul className="space-y-2">
            <li><Link to="/jelajah?category=Musik" className="hover:text-white transition">Konser Musik & Live Gig</Link></li>
            <li><Link to="/jelajah?category=Festival" className="hover:text-white transition">Festival & Karnaval</Link></li>
            <li><Link to="/jelajah?category=Fanmeeting" className="hover:text-white transition">Fanmeeting K-Pop & Aktor</Link></li>
            <li><Link to="/jelajah?category=Seminar" className="hover:text-white transition">Konferensi & Seminar Tech</Link></li>
            <li><Link to="/jelajah?category=Pameran" className="hover:text-white transition">Pameran Seni & Kreatif</Link></li>
          </ul>
        </div>

        {/* Partners & Organizers */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Untuk Penyelenggara (EO)</h4>
          <ul className="space-y-2">
            <li><Link to="/eo/register" className="hover:text-white transition">Daftar Jadi Partner EO</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Masuk ke Portal EO</Link></li>
            <li><Link to="/tentang#fee" className="hover:text-white transition">Struktur Biaya & Komisi</Link></li>
            <li><Link to="/tentang#scanner" className="hover:text-white transition">Sistem Tiket Gelang & QR Scanner</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3">Pusat Bantuan</h4>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-400" />
              <span>support@gofest.id</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-400" />
              <span>+62 821-2345-6789 (WhatsApp)</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span>Senayan Park Level 3, Jakarta Pusat, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-900/80 py-4 px-4 sm:px-8 text-center text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © {new Date().getFullYear()} <strong>GoFest Indonesia</strong>. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex gap-4">
            <a href="#terms" className="hover:text-slate-300">Syarat & Ketentuan</a>
            <a href="#privacy" className="hover:text-slate-300">Kebijakan Privasi</a>
            <a href="#faq" className="hover:text-slate-300">FAQ Pembelian</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
