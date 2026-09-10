import React, { useState, useEffect } from 'react';
import { 
  X, Clock, Copy, Check, ShieldCheck, CreditCard, 
  Building2, QrCode, AlertTriangle, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatRupiah } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  orderData, 
  paymentMethod, 
  onPaymentSuccess, 
  onPaymentCancel 
}) {
  const { info, success } = useToast();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes countdown (BUY-07)
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onPaymentCancel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, onPaymentCancel]);

  if (!isOpen || !orderData) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const vaNumber = `80012026${orderData.totalTickets || 1}${Math.floor(100000 + Math.random() * 900000)}`;

  const handleCopyVA = () => {
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    info('Nomor Virtual Account berhasil disalin ke clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header with Midtrans Sandbox Branding */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
              GF
            </div>
            <div>
              <div className="font-bold text-sm flex items-center gap-1.5">
                <span>GoFest Payment Gateway</span>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  SANDBOX
                </span>
              </div>
              <div className="text-xs text-slate-400">Metode: {paymentMethod}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Bar (PRD BUY-07: Batas Waktu Pembayaran) */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Selesaikan pembayaran dalam:</span>
          </div>
          <div className="font-mono font-bold text-sm text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
            {formattedTime}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Total Amount Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Total Tagihan</div>
              <div className="text-xl font-bold text-slate-800">
                {formatRupiah(orderData.totalAmount)}
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>{orderData.totalTickets} Tiket</div>
              <div className="text-emerald-700 font-semibold">Bebas Biaya Admin</div>
            </div>
          </div>

          {/* Payment Method Specific Instructions */}
          {paymentMethod.includes('QRIS') ? (
            <div className="text-center space-y-3">
              <div className="text-xs text-slate-600 font-medium">
                Pindai kode QRIS menggunakan GoPay, OVO, Dana, ShopeePay, atau BCA Mobile:
              </div>
              <div className="inline-block p-4 bg-white border-2 border-slate-300 rounded-2xl shadow-inner">
                <QRCodeSVG
                  value={`https://gofest.id/pay/qris/${orderData.totalAmount}`}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="text-[11px] text-slate-500">
                NMID: ID102026GF998811 • PT GOFEST TIKET INDONESIA
              </div>
            </div>
          ) : paymentMethod.includes('Kartu') ? (
            <div className="space-y-3 text-xs">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-blue-900">
                <strong>Simulasi Kartu Kredit/Debit:</strong> Masukkan nomor kartu tes atau langsung klik tombol verifikasi di bawah.
              </div>
              <div className="space-y-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Kartu (Demo)</label>
                  <input
                    type="text"
                    readOnly
                    value="4111 2222 3333 4444"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Berlaku Hingga</label>
                    <input
                      type="text"
                      readOnly
                      value="12/28"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">CVV</label>
                    <input
                      type="text"
                      readOnly
                      value="123"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Virtual Account (BCA / Mandiri) */
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Transfer tepat sesuai nominal tagihan ke nomor Virtual Account di bawah:
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    Nomor Virtual Account {paymentMethod}
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-900 tracking-wider">
                    {vaNumber}
                  </div>
                </div>

                <button
                  onClick={handleCopyVA}
                  className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="text-xs text-slate-600 space-y-1.5 pl-2">
                <div className="font-bold text-slate-800">Petunjuk Pembayaran ATM / Mobile Banking:</div>
                <p>1. Buka aplikasi m-Banking atau ATM bank pilihan Anda.</p>
                <p>2. Pilih menu <strong>Transfer &gt; Virtual Account</strong>.</p>
                <p>3. Masukkan nomor VA di atas, nominal akan terisi otomatis.</p>
                <p>4. Konfirmasi transaksi dan simpan bukti pembayaran Anda.</p>
              </div>
            </div>
          )}

          {/* Action Simulation Buttons */}
          <div className="pt-4 border-t border-slate-200 space-y-2.5">
            <button
              onClick={handleSimulateSuccess}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi Pembayaran...</span>
                </div>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Simulasi Bayar Berhasil (Webhook Auto-Confirm)</span>
                </>
              )}
            </button>

            <button
              onClick={onPaymentCancel}
              className="w-full text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 py-2 rounded-xl transition"
            >
              Batalkan Pesanan (Kembalikan Kuota)
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Dilindungi Enkripsi 256-Bit SSL • Midtrans Sandbox Mode</span>
        </div>
      </div>
    </div>
  );
}
