import React, { useState, useMemo } from 'react';
import { 
  UserCheck, Check, X, ShieldAlert, Building2, 
  Mail, Phone, Calendar, Search, ExternalLink, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatDateIndo } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function AdminEOApprovalsPage() {
  const { success, error, info } = useToast();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedEO, setSelectedEO] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Reload trigger
  const [refreshKey, setRefreshKey] = useState(0);

  const eoUsers = useMemo(() => {
    const users = StorageService.getUsers();
    return users.filter(u => u.role === 'eo');
  }, [refreshKey]);

  const filteredEOs = useMemo(() => {
    return eoUsers.filter(u => {
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      const matchSearch = !searchQuery.trim() || 
        u.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [eoUsers, statusFilter, searchQuery]);

  const handleApprove = (eoUser) => {
    StorageService.updateUserStatus(eoUser.id, 'approved');
    success(`Organisasi "${eoUser.organization}" berhasil disetujui (Approved)!`);
    setRefreshKey(k => k + 1);
    setSelectedEO(null);
  };

  const handleReject = (eoUser) => {
    StorageService.updateUserStatus(eoUser.id, 'rejected');
    info(`Pendaftaran organisasi "${eoUser.organization}" ditolak.`);
    setRefreshKey(k => k + 1);
    setSelectedEO(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Approval Pendaftaran Event Organizer (EO)
        </h1>
        <p className="text-xs text-slate-500">
          Verifikasi keabsahan profil promotor sebelum mereka diberi izin membuat event (PRD ADM-02 & ADM-03)
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto text-xs">
          {[
            { id: 'pending', label: 'Menunggu Approval (Pending)' },
            { id: 'approved', label: 'Disetujui (Approved)' },
            { id: 'rejected', label: 'Ditolak (Rejected)' },
            { id: 'all', label: 'Semua EO' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold transition shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama organisasi/email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
          />
        </div>
      </div>

      {/* EO Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Organisasi Promotor</th>
                <th className="p-4">Penanggung Jawab (PIC)</th>
                <th className="p-4">Kontak & Email</th>
                <th className="p-4">Tanggal Daftar</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEOs.length > 0 ? (
                filteredEOs.map(eo => {
                  return (
                    <tr key={eo.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{eo.organization}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{eo.description || 'Promotor Event'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{eo.name}</td>
                      <td className="p-4 text-slate-600">
                        <div>{eo.email}</div>
                        <div className="text-[11px] text-slate-400">{eo.phone || '-'}</div>
                      </td>
                      <td className="p-4 text-slate-600">{formatDateIndo(eo.createdAt)}</td>
                      <td className="p-4">
                        {eo.status === 'approved' ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            APPROVED
                          </span>
                        ) : eo.status === 'pending' ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            PENDING REVIEW
                          </span>
                        ) : (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                            REJECTED
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {eo.status === 'pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(eo)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(eo)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-1.5 rounded-lg border border-rose-200 transition"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedEO(eo)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            Detail Profil
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Tidak ada pendaftaran EO pada status "{statusFilter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Profil Organisasi Promotor</h3>
              <button
                onClick={() => setSelectedEO(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Nama Organisasi:</span>
                <span className="text-sm font-bold text-slate-900">{selectedEO.organization}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Penanggung Jawab:</span>
                <span className="font-semibold text-slate-800">{selectedEO.name}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Kontak:</span>
                <span className="text-slate-800">{selectedEO.email} • {selectedEO.phone}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Profil & Portofolio:</span>
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
                  {selectedEO.description || 'Tidak ada deskripsi yang dicantumkan.'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Status Saat Ini:</span>
                <span className="font-bold uppercase text-slate-800">{selectedEO.status}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedEO(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
