import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Ticket, Shield, Building2, QrCode, Lock, Mail, 
  Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('eo'); // 'eo' | 'admin' | 'staff'
  const [email, setEmail] = useState('eo@rememberfest.id');
  const [password, setPassword] = useState('eo123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Preset demo accounts
  const demoAccounts = {
    eo: {
      email: 'eo@rememberfest.id',
      pass: 'eo123',
      label: 'Demo Akun: EO (Approved)',
      desc: 'Remember Musik Fest Indo',
    },
    admin: {
      email: 'admin@gofest.id',
      pass: 'admin123',
      label: 'Demo Akun: Super Admin',
      desc: 'Platform Administrator',
    },
    staff: {
      email: 'staff@gofest.id',
      pass: 'staff123',
      label: 'Demo Akun: Staff Verifikator',
      desc: 'Rian Lapangan (Gate Staff)',
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEmail(demoAccounts[tab].email);
    setPassword(demoAccounts[tab].pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = login(email, password);
      success(`Selamat datang kembali, ${user.name}!`);

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'eo') {
        navigate('/eo/dashboard');
      } else if (user.role === 'staff') {
        navigate('/staff/scanner');
      } else {
        navigate('/');
      }
    } catch (err) {
      error(err.message || 'Gagal masuk akun');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-orange flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition">
            <Ticket className="w-6 h-6" />
          </div>
          <span className="text-3xl font-black text-brand-950 tracking-tight">
            GoFest<span className="text-accent-orange">.</span>
          </span>
        </Link>
        <h1 className="text-xl font-bold text-slate-900">
          Masuk ke Portal Manajemen
        </h1>
        <p className="text-xs text-slate-500">
          Akses dashboard terpusat untuk Admin, Penyelenggara Event, dan Staf
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200/80 space-y-6">
          {/* Role Tabs Selection */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTabChange('eo')}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'eo'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Event Org</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('staff')}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'staff'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Staf Scan</span>
            </button>
          </div>

          {/* Quick Demo Credentials Reminder */}
          <div className="bg-brand-50/80 border border-brand-200/60 rounded-xl p-3 flex items-center justify-between text-xs text-brand-900">
            <div>
              <div className="font-bold">{demoAccounts[activeTab].label}</div>
              <div className="text-[11px] text-brand-600">{demoAccounts[activeTab].desc}</div>
            </div>
            <button
              type="button"
              onClick={() => handleTabChange(activeTab)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-xs transition"
            >
              Auto-Fill
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Alamat Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@organisasi.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kata Sandi (Password)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-brand-500 focus:bg-white transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-brand-600/20 transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Masuk Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note & register link */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
            <div>
              Belum punya akun Event Organizer?{' '}
              <Link to="/eo/register" className="font-bold text-brand-600 hover:underline">
                Daftar sebagai EO
              </Link>
            </div>
            <div>
              <Link to="/" className="text-[11px] text-slate-400 hover:text-slate-600">
                ← Kembali ke Beranda Pembeli
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
