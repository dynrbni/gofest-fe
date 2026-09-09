import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ContactPage() {
  const { success } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    success('Pesan Anda berhasil dikirim! Tim GoFest akan menghubungi Anda segera.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900">Hubungi Tim GoFest</h1>
        <p className="text-slate-500 text-xs">Punya pertanyaan seputar pembelian tiket atau ingin kerjasama event? Kami siap membantu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 bg-brand-900 text-white p-8 rounded-3xl space-y-6 shadow-xl">
          <h3 className="text-lg font-bold">Informasi Kontak</h3>
          <p className="text-xs text-brand-200 leading-relaxed">
            Layanan pelanggan dan kemitraan promotor beroperasi setiap hari kerja pukul 08:00 - 20:00 WIB.
          </p>

          <div className="space-y-4 text-xs pt-4 border-t border-brand-800">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-300" />
              <span>support@gofest.id</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-300" />
              <span>+62 821-2345-6789</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-300 shrink-0 mt-0.5" />
              <span>Senayan Park Level 3, Jl. Gerbang Pemuda No.3, Jakarta Pusat</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Terima Kasih!</h3>
              <p className="text-xs text-slate-500">Pesan Anda telah kami terima dan akan direspon melalui email dalam 1x24 jam.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-4 text-xs font-bold text-brand-600 hover:underline"
              >
                Kirim pesan baru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Rian Pratama"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Aktif</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nama@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subjek / Topik</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Pertanyaan seputar tiket / Kerjasama EO"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Pesan</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tuliskan pertanyaan atau kebutuhan Anda secara detail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
