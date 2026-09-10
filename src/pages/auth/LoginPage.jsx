import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Ticket, Shield, Building2, QrCode, Lock, Mail, 
  Eye, EyeOff, ArrowRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('eo');
  const [email, setEmail] = useState('eo@rememberfest.id');
  const [password, setPassword] = useState('eo123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = {
    eo: {
      email: 'eo@rememberfest.id',
      pass: 'eo123',
      label: 'Demo: Event Organizer',
      desc: 'Remember Musik Fest Indo',
    },
    admin: {
      email: 'admin@gofest.id',
      pass: 'admin123',
      label: 'Demo: Super Admin',
      desc: 'Platform Administrator',
    },
    staff: {
      email: 'staff@gofest.id',
      pass: 'staff123',
      label: 'Demo: Staff Verifikator',
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
      success(`Selamat datang, ${user.name}!`);

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
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-slate-800 transition">
            <Ticket className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            GoFest<span className="text-slate-700">.</span>
          </span>
        </Link>
        <h1 className="text-xl font-bold text-slate-900">
          Masuk ke Portal
        </h1>
        <p className="text-sm text-slate-500">
          Dashboard untuk Admin, Penyelenggara, dan Staf
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 border border-slate-200 rounded-2xl space-y-6">
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
            {[
              { id: 'eo', icon: Building2, label: 'Event Org' },
              { id: 'admin', icon: Shield, label: 'Admin' },
              { id: 'staff', icon: QrCode, label: 'Staff' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Demo Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between text-sm">
            <div>
              <div className="font-medium text-slate-800">{demoAccounts[activeTab].label}</div>
              <div className="text-xs text-slate-500">{demoAccounts[activeTab].desc}</div>
            </div>
            <button
              type="button"
              onClick={() => handleTabChange(activeTab)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition"
            >
              Auto-Fill
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@organisasi.com"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-slate-400 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-10 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-slate-400 transition"
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
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 text-center text-sm text-slate-500 space-y-2">
            <div>
              Belum punya akun EO?{' '}
              <Link to="/eo/register" className="font-medium text-slate-900 hover:underline">
                Daftar sebagai EO
              </Link>
            </div>
            <div>
              <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">
                ← Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
