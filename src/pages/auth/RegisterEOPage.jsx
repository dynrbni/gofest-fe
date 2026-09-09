import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, Ticket, CheckCircle2, ArrowRight, ShieldAlert, 
  Sparkles, Mail, Lock, Phone, User, FileText, ChevronLeft 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function RegisterEOPage() {
  const { registerEO, quickSwitch } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    password: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [createdEO, setCreatedEO] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.organization || !form.email || !form.password) {
      error('Harap lengkapi formulir pendaftaran');
      return;
    }

    try {
      const newEO = registerEO(form);
      setCreatedEO(newEO);
      setSubmitted(true);
      success('Pendaftaran berhasil! Akun Anda sedang menunggu approval Admin.');
    } catch (err) {
      error(err.message || 'Gagal mendaftar');
    }
  };

  const handleDemoAdminApproval = () => {
    // Quick switch to admin to approve this EO
    quickSwitch('admin');
    navigate('/admin/approvals');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-orange flex items-center justify-center text-white shadow-lg">
            <Ticket className="w-6 h-6" />
          </div>
          <span className="text-3xl font-black text-brand-950 tracking-tight">
            GoFest<span className="text-accent-orange">.</span>
          </span>
        </Link>
        <h1 className="text-2xl font-black text-slate-900">
          Daftar Sebagai Event Organizer
        </h1>
        <p className="text-xs text-slate-500">
          Mulai publikasikan event, jual tiket secara resmi, dan kelola gate check-in Anda
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl rounded-3xl border border-slate-200/80">
          {submitted ? (
            /* Success State - Explaining Admin Approval Flow (PRD 5.1) */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  Status: PENDING REVIEW
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Pendaftaran EO Berhasil Diajukan!
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                  Organisasi <strong>{createdEO?.organization}</strong> telah tercatat di sistem. Sesuai PRD Bagian 4.1 & 5.1, akun EO baru memerlukan verifikasi oleh tim <strong>Admin Platform</strong> sebelum dapat membuat dan mempublikasikan event.
                </p>
              </div>

              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 text-xs text-brand-900 space-y-3 text-left">
                <div className="font-bold flex items-center gap-1.5 text-brand-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Mode Pengujian / Demo Evaluasi:
                </div>
                <p className="text-[11px] text-brand-700">
                  Anda dapat langsung beralih ke akun <strong>Admin</strong> untuk menyetujui (approve) pendaftaran organisasi ini di menu Approval EO!
                </p>
                <button
                  type="button"
                  onClick={handleDemoAdminApproval}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <span>Buka Dashboard Admin untuk Approve</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ← Kembali ke Halaman Login
                </Link>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Organisasi / Komunitas <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      placeholder="PT Nada Kreasi Nusantara"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white text-xs"
                    />
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Penanggung Jawab (PIC) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Dian Sastro"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white text-xs"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Alamat Email Resmi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="partner@organisasi.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white text-xs"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    No. Handphone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="081234567890"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white text-xs"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white text-xs"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Profil Singkat / Portofolio Penyelenggara
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Ceritakan jenis event yang sering Anda selenggarakan (misal konser indie, festival kuliner, dsb)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white text-xs"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-brand-600/20 transition flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Daftarkan Organisasi EO</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-slate-500">Sudah memiliki akun promotor? </span>
                <Link to="/login" className="font-bold text-brand-600 hover:underline">
                  Masuk disini
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
