import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  QrCode, Camera, CheckCircle2, AlertTriangle, XCircle, 
  Clock, User, Ticket, Calendar, MapPin, Search, ArrowRight, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storage';
import { formatDateTimeIndo, formatDateIndo } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function StaffScannerPage() {
  const { currentUser } = useAuth();
  const { success, error, info } = useToast();

  const [scannerActive, setScannerActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [checkinLogs, setCheckinLogs] = useState(() => StorageService.getCheckinLogs());

  const scannerRef = useRef(null);
  const html5QrCodeInstance = useRef(null);

  // Load events assigned to this staff member (PRD STF-02)
  const assignedEvents = useMemo(() => {
    const all = StorageService.getEvents();
    if (!currentUser?.assignedEventIds || currentUser.assignedEventIds.length === 0) {
      return all; // fallback
    }
    return all.filter(e => currentUser.assignedEventIds.includes(e.id));
  }, [currentUser]);

  // Set default selected event
  useEffect(() => {
    if (assignedEvents.length > 0 && selectedEventId === 'all') {
      setSelectedEventId(assignedEvents[0].id);
    }
  }, [assignedEvents, selectedEventId]);

  // Initialize and clean up html5-qrcode
  useEffect(() => {
    return () => {
      if (html5QrCodeInstance.current && html5QrCodeInstance.current.isScanning) {
        html5QrCodeInstance.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleStartScanner = async () => {
    try {
      setScannerActive(true);
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeInstance.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          handleValidateTicket(decodedText);
        },
        (errorMessage) => {
          // ignore frame scan errors
        }
      );
    } catch (err) {
      console.warn('Camera access issue:', err);
      setScannerActive(false);
      info('Kamera tidak dapat diakses atau diblokir. Anda dapat menggunakan tombol demo atau input kode tiket manual di bawah.');
    }
  };

  const handleStopScanner = async () => {
    if (html5QrCodeInstance.current && html5QrCodeInstance.current.isScanning) {
      try {
        await html5QrCodeInstance.current.stop();
        html5QrCodeInstance.current = null;
      } catch (err) {
        console.error('Stop scanner error:', err);
      }
    }
    setScannerActive(false);
  };

  // Ticket Validation Logic (PRD STF-04 & STF-05)
  const handleValidateTicket = (ticketCode) => {
    if (!ticketCode || !ticketCode.trim()) {
      error('Harap masukkan kode tiket');
      return;
    }

    const cleanCode = ticketCode.trim().toUpperCase();
    const result = StorageService.validateAndCheckinTicket(cleanCode, currentUser);

    setValidationResult(result);
    setCheckinLogs(StorageService.getCheckinLogs());

    if (result.success) {
      success(`TIKET VALID! Pengunjung: ${result.ticket?.buyerName}`);
    } else if (result.status === 'already_used') {
      error('PERINGATAN: Tiket sudah digunakan sebelumnya!');
    } else {
      error('Tiket TIDAK DITEMUKAN / TIDAK VALID!');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleValidateTicket(manualCode);
    setManualCode('');
  };

  // Get demo tickets for 1-click evaluation
  const allTickets = useMemo(() => StorageService.getTickets(), [validationResult]);
  const sampleUnused = allTickets.find(t => t.status === 'unused');
  const sampleUsed = allTickets.find(t => t.status === 'used');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <QrCode className="w-7 h-7 text-purple-600" />
            <span>Scanner Tiket Lapangan (Gate In)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Staf: <strong>{currentUser?.name}</strong> • Validasi e-ticket QR Code buyer secara real-time (PRD STF-03 s/d STF-05)
          </p>
        </div>

        {/* Assigned Event Selector (PRD STF-02) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Event Aktif:</span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:border-purple-600 cursor-pointer max-w-xs"
          >
            {assignedEvents.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Validation Result Box (PRD STF-04: Valid / Digunakan / Tidak Ditemukan) */}
      {validationResult && (
        <div
          className={`p-6 rounded-3xl border shadow-lg animate-in zoom-in-95 duration-200 ${
            validationResult.status === 'valid'
              ? 'bg-emerald-900 text-white border-emerald-700 shadow-emerald-950/20'
              : validationResult.status === 'already_used'
              ? 'bg-rose-900 text-white border-rose-700 shadow-rose-950/20'
              : 'bg-amber-900 text-white border-amber-700 shadow-amber-950/20'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                  validationResult.status === 'valid'
                    ? 'bg-emerald-800 text-emerald-300'
                    : validationResult.status === 'already_used'
                    ? 'bg-rose-800 text-rose-300 animate-pulse'
                    : 'bg-amber-800 text-amber-300'
                }`}
              >
                {validationResult.status === 'valid' && <CheckCircle2 className="w-8 h-8" />}
                {validationResult.status === 'already_used' && <XCircle className="w-8 h-8" />}
                {validationResult.status === 'not_found' && <AlertTriangle className="w-8 h-8" />}
              </div>

              <div className="space-y-1">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    validationResult.status === 'valid'
                      ? 'bg-emerald-800 text-emerald-200'
                      : validationResult.status === 'already_used'
                      ? 'bg-rose-800 text-rose-200'
                      : 'bg-amber-800 text-amber-200'
                  }`}
                >
                  {validationResult.status === 'valid'
                    ? 'TIKET VALID — CHECK-IN SUKSES'
                    : validationResult.status === 'already_used'
                    ? 'PERINGATAN: TIKET SUDAH PERNAH DIPAKAI'
                    : 'TIKET TIDAK DITEMUKAN / TIDAK VALID'}
                </span>

                <h3 className="text-xl font-black">
                  {validationResult.message}
                </h3>

                {validationResult.ticket && (
                  <div className="text-xs space-y-1 pt-2 opacity-90">
                    <div>
                      Pemegang Tiket: <strong className="underline">{validationResult.ticket.buyerName}</strong> ({validationResult.ticket.buyerEmail})
                    </div>
                    <div>
                      Kategori: <strong>{validationResult.ticket.ticketTypeName}</strong> • Event: {validationResult.ticket.eventTitle}
                    </div>
                    {validationResult.ticket.usedAt && (
                      <div className="text-[11px] text-rose-200 font-semibold pt-1">
                        Riwayat Check-in: {formatDateTimeIndo(validationResult.ticket.usedAt)} oleh staf {validationResult.ticket.usedByStaffName}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setValidationResult(null)}
              className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-2 rounded-xl transition self-start sm:self-center shrink-0"
            >
              Tutup / Scan Tiket Berikutnya
            </button>
          </div>
        </div>
      )}

      {/* Main Scanner & Manual Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Camera Scanner (PRD STF-03: html5-qrcode) */}
        <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-sm text-slate-900">Kamera Pemindai QR Code (Device)</h2>
            </div>
            {scannerActive ? (
              <button
                onClick={handleStopScanner}
                className="bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-rose-200 transition"
              >
                Hentikan Kamera
              </button>
            ) : (
              <button
                onClick={handleStartScanner}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition"
              >
                Aktifkan Kamera Scanner
              </button>
            )}
          </div>

          {/* html5-qrcode container */}
          <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-white border-2 border-slate-800">
            <div id="qr-reader" className="w-full h-full"></div>

            {!scannerActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/90 z-10">
                <QrCode className="w-16 h-16 text-purple-400 stroke-1" />
                <div className="space-y-1">
                  <div className="font-bold text-sm text-white">Kamera Belum Aktif</div>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Klik tombol di bawah untuk mengaktifkan kamera smartphone atau webcam Anda.
                  </p>
                </div>
                <button
                  onClick={handleStartScanner}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition"
                >
                  Buka Kamera Device
                </button>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            Arahkan QR Code tiket pembeli tepat ke dalam kotak bidik kamera.
          </div>
        </div>

        {/* Right Column: Manual Code Input & 1-Click Demo Evaluation */}
        <div className="md:col-span-5 space-y-6">
          {/* Manual Input Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Ticket className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-sm text-slate-900">Input Manual Kode Tiket</h3>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kode Tiket E-Ticket
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Contoh: GF-TIX-1001A"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-purple-600 focus:bg-white text-xs uppercase"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>Validasi Tiket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* 1-Click Demo Testing Presets */}
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-3xl p-6 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-purple-950">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>Pengujian Cepat (1-Klik):</span>
            </div>
            <p className="text-[11px] text-purple-800 leading-relaxed">
              Klik salah satu tombol di bawah untuk menguji validasi tanpa perlu scan kamera fisik:
            </p>

            <div className="space-y-2">
              {sampleUnused && (
                <button
                  type="button"
                  onClick={() => handleValidateTicket(sampleUnused.ticketCode)}
                  className="w-full bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-left p-2.5 rounded-xl transition shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-[11px]">Tes Tiket Sah (Belum Dipakai)</div>
                    <div className="font-mono text-[10px] text-slate-500">{sampleUnused.ticketCode} • {sampleUnused.buyerName}</div>
                  </div>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Uji Valid
                  </span>
                </button>
              )}

              {sampleUsed && (
                <button
                  type="button"
                  onClick={() => handleValidateTicket(sampleUsed.ticketCode)}
                  className="w-full bg-white hover:bg-rose-50 border border-rose-300 text-rose-800 text-left p-2.5 rounded-xl transition shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-[11px]">Tes Tiket Sudah Digunakan</div>
                    <div className="font-mono text-[10px] text-slate-500">{sampleUsed.ticketCode} • {sampleUsed.buyerName}</div>
                  </div>
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Uji Duplicate
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleValidateTicket('GF-PALSU-99999')}
                className="w-full bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 text-left p-2.5 rounded-xl transition shadow-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[11px]">Tes Tiket Palsu / Tidak Terdaftar</div>
                  <div className="font-mono text-[10px] text-slate-500">GF-PALSU-99999</div>
                </div>
                <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Uji Invalid
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Check-in Log Table (PRD STF-05) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Riwayat Check-In Tiket (Audit Log Real-Time)</h3>
              <p className="text-xs text-slate-500">Tercatat dengan waktu kedatangan & nama staf verifikator (PRD STF-05)</p>
            </div>
          </div>

          <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
            {checkinLogs.length} Pengunjung Masuk
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Kode Tiket</th>
                <th className="p-4">Nama Pengunjung</th>
                <th className="p-4">Jenis Tiket</th>
                <th className="p-4">Waktu Check-In</th>
                <th className="p-4">Staf Verifikator</th>
                <th className="p-4 text-right">Status Gate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {checkinLogs.length > 0 ? (
                checkinLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-mono font-bold text-purple-700">{log.ticketCode}</td>
                    <td className="p-4 font-bold text-slate-900">{log.buyerName}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium text-[11px]">
                        {log.ticketTypeName}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{formatDateTimeIndo(log.timestamp)}</td>
                    <td className="p-4 text-slate-700 font-medium">{log.staffName}</td>
                    <td className="p-4 text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        CHECKED IN
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Belum ada pengunjung yang melakukan check-in pada gate ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
