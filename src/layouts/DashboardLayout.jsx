import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Ticket, LayoutDashboard, Calendar, PlusCircle, Users, 
  BarChart3, ShieldCheck, CheckSquare, QrCode, LogOut, 
  ExternalLink, Menu, X, ChevronRight, UserCheck, CreditCard, Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function DashboardLayout({ requiredRole }) {
  const { currentUser, logout, isAdmin, isEO, isStaff } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role validation
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Akses Terbatas</h2>
          <p className="text-xs text-slate-500">Anda harus masuk ke akun terlebih dahulu untuk mengakses dashboard ini.</p>
          <Link to="/login" className="block w-full bg-brand-600 text-white font-bold text-xs py-3 rounded-xl shadow">
            Menuju Halaman Login
          </Link>
        </div>
      </div>
    );
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Peran Tidak Sesuai</h2>
          <p className="text-xs text-slate-500">
            Halaman ini khusus untuk <strong>{requiredRole.toUpperCase()}</strong>. Anda saat ini login sebagai <strong>{currentUser.role.toUpperCase()}</strong>.
          </p>
          <button
            onClick={() => {
              if (currentUser.role === 'admin') navigate('/admin/dashboard');
              else if (currentUser.role === 'eo') navigate('/eo/dashboard');
              else if (currentUser.role === 'staff') navigate('/staff/scanner');
              else navigate('/');
            }}
            className="block w-full bg-brand-600 text-white font-bold text-xs py-3 rounded-xl shadow"
          >
            Menuju Dashboard Sesuai Akun
          </button>
        </div>
      </div>
    );
  }

  // Navigation Links based on Role
  let navItems = [];

  if (currentUser.role === 'eo') {
    navItems = [
      { name: 'Ringkasan Dashboard', path: '/eo/dashboard', icon: LayoutDashboard },
      { name: 'Kelola Event Saya', path: '/eo/events', icon: Calendar },
      { name: 'Buat Event Baru', path: '/eo/events/new', icon: PlusCircle },
      { name: 'Manajemen Staf Scanner', path: '/eo/staff', icon: Users },
      { name: 'Laporan Penjualan', path: '/eo/reports', icon: BarChart3 },
    ];
  } else if (currentUser.role === 'admin') {
    navItems = [
      { name: 'Ringkasan Platform', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Approval Event Organizer', path: '/admin/eo-approvals', icon: UserCheck },
      { name: 'Approval Event Baru', path: '/admin/event-approvals', icon: CheckSquare },
      { name: 'Monitoring Transaksi', path: '/admin/transactions', icon: CreditCard },
    ];
  } else if (currentUser.role === 'staff') {
    navItems = [
      { name: 'Pemindai Kamera QR', path: '/staff/scanner', icon: QrCode },
      { name: 'Daftar Event Ditugaskan', path: '/staff/events', icon: Calendar },
    ];
  }

  const roleLabel = {
    admin: { name: 'Admin Platform', color: 'bg-emerald-500 text-white' },
    eo: { name: 'Event Organizer', color: 'bg-amber-500 text-white' },
    staff: { name: 'Staf Verifikator', color: 'bg-purple-600 text-white' },
  }[currentUser.role] || { name: currentUser.role, color: 'bg-brand-600 text-white' };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-brand-950 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link to="/" className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-accent-orange" />
          <span className="font-black text-lg">GoFest.</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-300 hover:text-white p-1"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-brand-950 text-white flex flex-col justify-between p-5 border-r border-brand-800 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-orange flex items-center justify-center text-white">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                GoFest<span className="text-accent-orange">.</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="bg-brand-900/80 border border-brand-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                {currentUser.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs text-white truncate">{currentUser.name}</div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-block mt-0.5 ${roleLabel.color}`}>
                  {roleLabel.name}
                </span>
              </div>
            </div>
            {currentUser.organization && (
              <div className="text-[11px] text-brand-300 truncate pt-1 border-t border-brand-800/80">
                {currentUser.organization}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
              Menu Utama
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-brand-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-brand-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-brand-900 space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center justify-between text-slate-400 hover:text-white px-3.5 py-2 rounded-xl hover:bg-brand-900/60 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Halaman Publik</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <button
            onClick={() => {
              logout();
              success('Berhasil keluar dari dashboard');
              navigate('/');
            }}
            className="w-full flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3.5 py-2 rounded-xl transition font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
