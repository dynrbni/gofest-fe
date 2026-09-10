import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Ticket, LayoutDashboard, Calendar, PlusCircle, Users, 
  BarChart3, ShieldCheck, CheckSquare, QrCode, LogOut, 
  ExternalLink, Menu, X, ChevronRight, UserCheck, CreditCard 
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Akses Terbatas</h2>
          <p className="text-sm text-slate-500">Anda harus masuk terlebih dahulu.</p>
          <Link to="/login" className="block w-full bg-slate-900 text-white font-medium text-sm py-3 rounded-lg">
            Menuju Login
          </Link>
        </div>
      </div>
    );
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Peran Tidak Sesuai</h2>
          <p className="text-sm text-slate-500">
            Halaman ini khusus untuk <strong>{requiredRole.toUpperCase()}</strong>. Anda login sebagai <strong>{currentUser.role.toUpperCase()}</strong>.
          </p>
          <button
            onClick={() => {
              if (currentUser.role === 'admin') navigate('/admin/dashboard');
              else if (currentUser.role === 'eo') navigate('/eo/dashboard');
              else if (currentUser.role === 'staff') navigate('/staff/scanner');
              else navigate('/');
            }}
            className="block w-full bg-slate-900 text-white font-medium text-sm py-3 rounded-lg"
          >
            Dashboard Sesuai Akun
          </button>
        </div>
      </div>
    );
  }

  // Navigation items
  let navItems = [];

  if (currentUser.role === 'eo') {
    navItems = [
      { name: 'Dashboard', path: '/eo/dashboard', icon: LayoutDashboard },
      { name: 'Kelola Event', path: '/eo/events', icon: Calendar },
      { name: 'Buat Event', path: '/eo/events/new', icon: PlusCircle },
      { name: 'Manajemen Staf', path: '/eo/staff', icon: Users },
      { name: 'Laporan', path: '/eo/reports', icon: BarChart3 },
    ];
  } else if (currentUser.role === 'admin') {
    navItems = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Approval EO', path: '/admin/eo-approvals', icon: UserCheck },
      { name: 'Approval Event', path: '/admin/event-approvals', icon: CheckSquare },
      { name: 'Transaksi', path: '/admin/transactions', icon: CreditCard },
    ];
  } else if (currentUser.role === 'staff') {
    navItems = [
      { name: 'Scanner QR', path: '/staff/scanner', icon: QrCode },
      { name: 'Event Saya', path: '/staff/events', icon: Calendar },
    ];
  }

  const roleLabel = {
    admin: { name: 'Admin', color: 'bg-emerald-100 text-emerald-700' },
    eo: { name: 'Organizer', color: 'bg-amber-100 text-amber-700' },
    staff: { name: 'Staff', color: 'bg-violet-100 text-violet-700' },
  }[currentUser.role] || { name: currentUser.role, color: 'bg-slate-100 text-slate-700' };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 text-slate-900 p-4 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <Ticket className="w-3.5 h-3.5" />
          </div>
          <span className="font-black text-lg">GoFest<span className="text-brand-600">.</span></span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-600 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* White Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-60 bg-white border-r border-slate-200 flex flex-col justify-between p-5 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                <Ticket className="w-3.5 h-3.5" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                GoFest<span className="text-brand-600">.</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {currentUser.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="font-semibold text-sm text-slate-900 truncate">{currentUser.name}</div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${roleLabel.color}`}>
                  {roleLabel.name}
                </span>
              </div>
            </div>
            {currentUser.organization && (
              <div className="text-xs text-slate-500 truncate pt-1 border-t border-slate-200">
                {currentUser.organization}
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 pb-2">
              Menu
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="pt-4 border-t border-slate-200 space-y-1 text-sm">
          <Link
            to="/"
            className="flex items-center justify-between text-slate-500 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Halaman Publik</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={() => {
              logout();
              success('Berhasil keluar');
              navigate('/');
            }}
            className="w-full flex items-center gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
