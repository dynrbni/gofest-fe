import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Ticket, Search, User, LogOut, LayoutDashboard, ChevronDown,
  Menu, X, Shield, Building2, QrCode, RefreshCw, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StorageService } from '../../services/storage';
import { CATEGORIES } from '../../constants/categories';

export default function Navbar() {
  const { currentUser, logout, quickSwitch, isAdmin, isEO, isStaff } = useAuth();
  const { success, info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // Close all menus whenever the route changes
  useEffect(() => {
    setCategoryMenuOpen(false);
    setUserDropdownOpen(false);
    setSwitcherOpen(false);
    setMobileMenuOpen(false);
    setMobileCategoryOpen(false);
  }, [location.pathname]);

  // Close menus on outside click and Escape
  useEffect(() => {
    const handleDocClick = (e) => {
      if (!e.target.closest('[data-menu]')) {
        setCategoryMenuOpen(false);
        setUserDropdownOpen(false);
        setSwitcherOpen(false);
      }
    };
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        setCategoryMenuOpen(false);
        setUserDropdownOpen(false);
        setSwitcherOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('click', handleDocClick);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('click', handleDocClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

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

  const closeAllMenus = () => {
    setCategoryMenuOpen(false);
    setUserDropdownOpen(false);
    setSwitcherOpen(false);
  };

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
            <div className="relative" data-menu>
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
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 relative">
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
            {navLinks.slice(0, 2).map((link) => {
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

            {/* Kategori Dropdown */}
            <div className="relative" data-menu>
              <button
                type="button"
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                aria-expanded={categoryMenuOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  categoryMenuOpen
                    ? 'text-slate-900 bg-slate-100 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>Kategori</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    categoryMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {categoryMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 w-[21rem] bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50">
                  <div className="grid grid-cols-2 gap-1">
                    <Link
                      to="/jelajah"
                      onClick={closeAllMenus}
                      className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition"
                    >
                      <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-semibold text-slate-900">Semua Kategori</span>
                    </Link>

                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/jelajah?category=${cat.id}`}
                        onClick={closeAllMenus}
                        className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition"
                      >
                        <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <cat.icon className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
                          {cat.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) => {
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

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            {/* Expanding Search */}
            <div className="hidden md:block">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <div className="relative">
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari event, artis, kota..."
                      className="w-44 lg:w-56 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm pl-3 pr-8 py-2 rounded-l-lg border border-slate-200 border-r-0 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      aria-label="Tutup pencarian"
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    aria-label="Cari"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-r-lg transition"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Buka pencarian"
                  className="w-9 h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition flex items-center justify-center"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* User Menu / Login */}
            {currentUser ? (
              <div className="relative" data-menu>
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
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition hidden sm:inline-flex"
              >
                Masuk
              </Link>
            )}

            {/* Primary CTA */}
            <Link
              to="/eo/register"
              className="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              Jadi Penyelenggara
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileMenuOpen}
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

            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                {link.name}
              </Link>
            ))}

            <div>
              <button
                type="button"
                onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                aria-expanded={mobileCategoryOpen}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Kategori</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    mobileCategoryOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileCategoryOpen && (
                <div className="grid grid-cols-2 gap-1 pl-2 pt-1">
                  <Link
                    to="/jelajah"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 transition"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-900" />
                    <span>Semua</span>
                  </Link>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/jelajah?category=${cat.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                    >
                      <cat.icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cat.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2 space-y-1">
              <Link
                to="/eo/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition"
              >
                Jadi Penyelenggara
              </Link>
              {!currentUser && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-lg transition"
                >
                  Masuk
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
