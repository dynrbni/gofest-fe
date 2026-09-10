import React, { useState, useMemo } from 'react';
import { 
  Users, UserPlus, QrCode, Calendar, Trash2, KeyRound, 
  Copy, Check, ShieldCheck, Mail, Phone, Plus, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { useToast } from '../../context/ToastContext';

export default function EOStaffPage() {
  const { currentUser } = useAuth();
  const { success, error, info } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Load events created by this EO
  const myEvents = useMemo(() => {
    return StorageService.getEvents().filter(e => e.eoId === currentUser?.id);
  }, [currentUser]);

  // Load staff created by or assigned to this EO
  const staffList = useMemo(() => {
    const users = StorageService.getUsers();
    return users.filter(u => u.role === 'staff' && (u.eoId === currentUser?.id || !u.eoId));
  }, [currentUser]);

  // New staff form state (PRD EO-07 & Flow 5.4)
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'staff123',
    assignedEventIds: [],
  });

  const handleToggleEvent = (eventId) => {
    setNewStaff(prev => {
      const exists = prev.assignedEventIds.includes(eventId);
      return {
        ...prev,
        assignedEventIds: exists
          ? prev.assignedEventIds.filter(id => id !== eventId)
          : [...prev.assignedEventIds, eventId]
      };
    });
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();

    if (!newStaff.name.trim() || !newStaff.email.trim()) {
      error('Harap lengkapi nama dan email staf');
      return;
    }

    if (newStaff.assignedEventIds.length === 0) {
      error('Pilih minimal 1 event yang ditugaskan kepada staf ini');
      return;
    }

    try {
      StorageService.addStaff(currentUser.id, newStaff);
      success(`Akun staf "${newStaff.name}" berhasil dibuat!`);
      setIsModalOpen(false);
      setNewStaff({
        name: '',
        email: '',
        phone: '',
        password: 'staff123',
        assignedEventIds: [],
      });
    } catch (err) {
      error(err.message || 'Gagal menambahkan staf');
    }
  };

  const handleCopyCredentials = (staff) => {
    const text = `Akun Scanner GoFest Anda:\nEmail: ${staff.email}\nPassword: ${staff.password || 'staff123'}\nLink: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopiedId(staff.id);
    info('Kredensial login staf berhasil disalin!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Staf Scanner Tiket (Verifikator)
          </h1>
          <p className="text-xs text-slate-500">
            Daftarkan staf lapangan dan berikan hak akses pemindaian QR code pada event tertentu (PRD EO-07)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition w-fit"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Staf Baru</span>
        </button>
      </div>

      {/* Info Notice (PRD Flow 5.4) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-900">
        <QrCode className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Alur Penugasan Staf Lapangan:</span>
          <p className="text-slate-800 mt-0.5 leading-relaxed">
            Staf lapangan yang Anda buat dapat langsung login di pintu gate menggunakan email dan password yang Anda tentukan. Mereka hanya dapat memvalidasi dan memindai tiket pada event yang Anda pilihkan.
          </p>
        </div>
      </div>

      {/* Staff Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map(staff => {
          const assignedEvents = myEvents.filter(e => staff.assignedEventIds?.includes(e.id));

          return (
            <div
              key={staff.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm shadow-xs">
                      {staff.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{staff.name}</h3>
                      <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                        STAF VERIFIKATOR
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{staff.email}</span>
                  </div>
                  {staff.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{staff.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 font-mono">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    <span>Password: <strong className="text-slate-800">{staff.password || 'staff123'}</strong></span>
                  </div>
                </div>

                {/* Assigned Events List */}
                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-700" />
                    <span>Event yang Ditugaskan ({assignedEvents.length}):</span>
                  </div>
                  {assignedEvents.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {assignedEvents.map(ev => (
                        <span
                          key={ev.id}
                          className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-1 rounded-lg border border-slate-100 truncate max-w-[200px]"
                        >
                          {ev.title}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-600 italic">Belum ada event yang ditugaskan</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleCopyCredentials(staff)}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition"
                >
                  {copiedId === staff.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === staff.id ? 'Tersalin' : 'Bagi Kredensial'}</span>
                </button>

                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Aktif</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Staff (PRD EO-07) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-base text-slate-900">Tambah Akun Staf Lapangan</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap Staf <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Contoh: Rian Verifikator"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Login Staf <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="staf.gate1@gofest.id"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kata Sandi Sementara <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-slate-400 focus:bg-white font-mono"
                />
                <span className="text-[10px] text-slate-400">Kredensial ini dapat diinformasikan secara manual ke staf.</span>
              </div>

              {/* Event Assignment Checkboxes */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Tugaskan Staf ke Event (Pilih Minimal 1) <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {myEvents.map(ev => {
                    const checked = newStaff.assignedEventIds.includes(ev.id);
                    return (
                      <label
                        key={ev.id}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition ${
                          checked
                            ? 'bg-slate-50 border-slate-300 text-slate-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleEvent(ev.id)}
                          className="rounded text-slate-700 focus:ring-slate-400"
                        />
                        <span className="truncate">{ev.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Simpan & Buat Akun Staf</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
