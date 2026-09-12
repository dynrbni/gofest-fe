import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ShieldCheck, CreditCard, Zap, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Tiket Resmi & Terverifikasi', desc: 'E-ticket dengan QR code unik anti-duplikasi' },
            { icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Pembayaran Aman', desc: 'Virtual Account, QRIS, E-Wallet otomatis' },
            { icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', title: 'Checkout Tanpa Akun', desc: 'Beli tiket instan langsung ke email Anda' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Ticket className="w-3.5 h-3.5" />
            </div>
            <span className="text-lg font-black text-slate-900">
              GoFest<span className="text-brand-600">.</span>
            </span>
          </Link>
          <p className="text-sm text-slate-500 leading-relaxed">
            Platform ticketing marketplace terlengkap di Indonesia untuk konser, festival, konferensi, dan pertunjukan.
          </p>
          <div className="flex items-center gap-2 pt-1">
            {['instagram', 'twitter', 'web'].map((social) => (
              <a
                key={social}
                href={`#${social}`}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition"
                aria-label={social}
              >
                {social === 'instagram' && (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                )}
                {social === 'twitter' && (
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                )}
                {social === 'web' && <Globe className="w-4 h-4" />}
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-4">Kategori Event</h4>
          <ul className="space-y-2.5 text-sm">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link to={`/jelajah?category=${cat.id}`} className="text-slate-500 hover:text-slate-900 transition">
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* For Organizers */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-4">Untuk Penyelenggara</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/penyelenggara" className="text-slate-500 hover:text-slate-900 transition">Daftar Penyelenggara</Link></li>
            <li><Link to="/eo/register" className="text-slate-500 hover:text-slate-900 transition">Daftar Jadi Partner EO</Link></li>
            <li><Link to="/login" className="text-slate-500 hover:text-slate-900 transition">Masuk ke Portal EO</Link></li>
            <li><Link to="/tentang#fee" className="text-slate-500 hover:text-slate-900 transition">Struktur Biaya & Komisi</Link></li>
            <li><Link to="/tentang#scanner" className="text-slate-500 hover:text-slate-900 transition">Sistem QR Scanner</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-4">Pusat Bantuan</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5 text-slate-500">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>support@gofest.id</span>
            </li>
            <li className="flex items-center gap-2.5 text-slate-500">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>+62 821-2345-6789</span>
            </li>
            <li className="flex items-start gap-2.5 text-slate-500">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>Senayan Park Level 3, Jakarta Pusat</span>
            </li>
            <li><Link to="/cek-pesanan" className="text-slate-500 hover:text-slate-900 transition">Cek Status Pesanan</Link></li>
            <li><Link to="/faq" className="text-slate-500 hover:text-slate-900 transition">FAQ</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 py-5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-slate-400">
          <div>
            © {new Date().getFullYear()} <span className="font-medium text-slate-500">GoFest Indonesia</span>
          </div>
          <div className="flex gap-5">
            <Link to="/syarat-ketentuan" className="hover:text-slate-600 transition">Syarat & Ketentuan</Link>
            <Link to="/kebijakan-privasi" className="hover:text-slate-600 transition">Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
