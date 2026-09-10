import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Ticket, Search, User, LogOut, LayoutDashboard, ChevronDown, 
  Menu, X, Shield, Building2, QrCode, RefreshCw 
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
    { name: 'Tentang', path: '/tentang' },
    { name: 'Kontak', path: '/kontak' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Thin Demo Role Switcher Bar */}
      <div className="bg-slate-900 text-slate-400 text-[11px] py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-medium">
              Platform Ticketing Event Indonesia
            </span>
            <span className="hidden md:inline text-slate-600">·</span>
            <span className="hidden md:inline text-slate-500 hover:text-slate-300 transition cursor-pointer" onClick={() => navigate('/eo/register')}>
              Gabung Sebagai Penyelenggara
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-2.5 py-1 rounded text-[11px] transition border border-slate-700"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Demo: <strong className="text-white capitalize">{currentUser?.role || 'Buyer'}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {switcherOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                    Ganti Peran Demo
                  </div>
                  {[
                    { role: 'guest', icon: User, color: 'text-slate-500', label: 'Pembeli (Buyer)', desc: 'Checkout tanpa perlu login' },
                    { role: 'eo', icon: Building2, color: 'text-amber-500', label: 'Event Organizer', desc: 'Buat event, kelola staf' },
                    { role: 'admin', icon: Shield, color: 'text-emerald-500', label: 'Admin Platform', desc: 'Approve EO & Event' },
                    { role: 'staff', icon: QrCode, color: 'text-violet-500', label: 'Staff Verifikator', desc: 'Scan QR Code tiket' },
                  ].map(item => (
                    <button
                      key={item.role}
                      onClick={() => handleRoleSwitch(item.role)}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition"
                    >
                      <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <div>
                        <div className="font-semibold text-slate-800">{item.label}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1"></div>
                  <button
                    onClick={handleResetData}
                    className="w-full text-left px-3 py-1.5 text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Data Demo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main White Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-slate-800 transition">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              GoFest<span className="text-brand-600">.</span>
            </span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'text-slate-900 bg-slate-100 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari event, artis, kota..."
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/eo/register"
              className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
            >
              Jadi Penyelenggara
            </Link>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-white text-[11px] font-bold">
                    {currentUser.name?.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-sm">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="font-semibold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-xs text-slate-500 capitalize">
                        {currentUser.role} {currentUser.organization ? `· ${currentUser.organization}` : ''}
                      </div>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Dashboard Admin</span>
                      </Link>
                    )}

                    {isEO && (
                      <Link
                        to="/eo/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Dashboard EO</span>
                      </Link>
                    )}

                    {isStaff && (
                      <Link
                        to="/staff/scanner"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm"
                      >
                        <QrCode className="w-4 h-4 text-slate-400" />
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
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 text-rose-600 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-slate-600 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pt-4 pb-2 border-t border-slate-100 mt-3 space-y-1">
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari event, artis, kota..."
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm pl-9 pr-4 py-2.5 rounded-lg border border-slate-200"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/eo/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Daftar Sebagai Penyelenggara
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
