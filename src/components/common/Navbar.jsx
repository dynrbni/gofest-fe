import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Ticket, Search, User, LogOut, LayoutDashboard, ChevronDown, 
  Menu, X, Sparkles, Shield, Building2, QrCode, RefreshCw 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';

export default function Navbar() {
  const { currentUser, logout, quickSwitch, isAdmin, isEO, isStaff } = useAuth();
  const { success, info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jelajah?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleRoleSwitch = (role) => {
    quickSwitch(role);
    setSwitcherOpen(false);
    if (role === 'admin') {
      success('Beralih ke peran: Admin Platform');
      navigate('/admin/dashboard');
    } else if (role === 'eo') {
      success('Beralih ke peran: Event Organizer (Approved)');
      navigate('/eo/dashboard');
    } else if (role === 'staff') {
      success('Beralih ke peran: Staff Verifikator');
      navigate('/staff/scanner');
    } else {
      info('Beralih ke mode: Pembeli (Tamu/Public)');
      navigate('/');
    }
  };

  const handleResetData = () => {
    StorageService.resetData();
    success('Database demo berhasil di-reset ke data awal!');
    setTimeout(() => window.location.reload(), 600);
  };

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Jelajah Event', path: '/jelajah' },
    { name: 'Tentang GoFest', path: '/tentang' },
    { name: 'Hubungi Kami', path: '/kontak' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Utility Bar with Demo Role Switcher */}
      <div className="bg-brand-950 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-brand-800/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 text-brand-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              #1 Marketplace Ticketing Event Indonesia
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/eo/register')}>
              Ingin Buat Event? Gabung Sebagai EO
            </span>
          </div>

          {/* Quick Role Switcher Banner */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-1.5 bg-brand-800 hover:bg-brand-700 text-white font-medium px-2.5 py-1 rounded-full text-xs transition shadow-sm border border-brand-600/50"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Role Demo: <strong className="text-amber-300 capitalize">{currentUser?.role || 'Buyer (Guest)'}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {switcherOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    Ganti Peran Demo (1-Klik)
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('guest')}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-brand-900/60 flex items-center gap-2.5"
                  >
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <div>
                      <div className="font-semibold text-white">Pembeli (Buyer)</div>
                      <div className="text-[10px] text-slate-400">Checkout tanpa perlu login</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('eo')}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-brand-900/60 flex items-center gap-2.5"
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="font-semibold text-white">Event Organizer (EO)</div>
                      <div className="text-[10px] text-slate-400">Buat event, kelola staf & kuota</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-brand-900/60 flex items-center gap-2.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-white">Admin Platform</div>
                      <div className="text-[10px] text-slate-400">Approve EO & Review Event baru</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('staff')}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-brand-900/60 flex items-center gap-2.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                      <div className="font-semibold text-white">Staff Verifikator</div>
                      <div className="text-[10px] text-slate-400">Scan QR Code tiket di gate masuk</div>
                    </div>
                  </button>
                  <div className="border-t border-slate-800 my-1"></div>
                  <button
                    onClick={handleResetData}
                    className="w-full text-left px-3 py-1.5 text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Data Demo ke Semula</span>
                  </button>
                </div>
              )}
            </div>

            <span className="hidden sm:inline bg-brand-900 px-2 py-0.5 rounded text-[11px] font-mono text-brand-200">
              🇮🇩 ID
            </span>
          </div>
        </div>
      </div>

      {/* Main Artatix-style Royal Blue Navigation Bar */}
      <div className="bg-brand-900 text-white px-4 sm:px-8 py-3.5 border-b border-brand-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-orange flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                GoFest<span className="text-accent-orange text-3xl leading-none">.</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-brand-200 -mt-1 font-semibold">
                Event Marketplace
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Pill Style like Artatix) */}
          <nav className="hidden lg:flex items-center bg-brand-950/60 p-1 rounded-full border border-brand-800/80">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-brand-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar (Loket & Artatix style) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari event konser, artis, kota..."
              className="w-full bg-brand-950/70 text-white placeholder-slate-400 text-xs pl-9 pr-4 py-2 rounded-full border border-brand-700/60 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Create Event Button for Organizers */}
            <Link
              to="/eo/register"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-100 hover:text-white px-3 py-1.5 rounded-full border border-brand-700/80 hover:bg-brand-800/60 transition"
            >
              <span>Kerjasama EO</span>
            </Link>

            {/* Auth Dropdown or Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-brand-800/90 hover:bg-brand-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition border border-brand-600/40"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-white text-[11px] font-bold">
                    {currentUser.name?.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-slate-500 text-[11px] uppercase font-semibold text-brand-600">
                        {currentUser.role} {currentUser.organization ? `• ${currentUser.organization}` : ''}
                      </div>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-600" />
                        <span>Dashboard Admin</span>
                      </Link>
                    )}

                    {isEO && (
                      <Link
                        to="/eo/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600" />
                        <span>Dashboard EO</span>
                      </Link>
                    )}

                    {isStaff && (
                      <Link
                        to="/staff/scanner"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        <QrCode className="w-4 h-4 text-purple-600" />
                        <span>Scanner Tiket</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        success('Berhasil keluar akun');
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md hover:shadow-brand-500/20 transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk / Akun</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-slate-200 hover:text-white p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-3 pb-2 border-t border-brand-800 mt-3 space-y-2">
            <form onSubmit={handleSearchSubmit} className="relative mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari event konser, artis, kota..."
                className="w-full bg-brand-950 text-white placeholder-slate-400 text-xs pl-9 pr-4 py-2 rounded-full border border-brand-700"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>

            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 text-slate-200"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/eo/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-amber-300 hover:bg-brand-800"
              >
                Daftar Sebagai Penyelenggara (EO)
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
