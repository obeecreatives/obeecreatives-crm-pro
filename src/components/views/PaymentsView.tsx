import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Printer,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  Receipt,
} from 'lucide-react';
import { PaymentConfirmation, Client, Invoice, PaymentStatus } from '../../types';
import { formatRupiah, formatDate, computeDocumentTotals } from '../../utils/formatters';

interface PaymentsViewProps {
  payments: PaymentConfirmation[];
  clients: Client[];
  invoices: Invoice[];
  onAddPayment: () => void;
  onEditPayment: (payment: PaymentConfirmation) => void;
  onDeletePayment: (payment: PaymentConfirmation) => void;
  onPrintPreview: (payment: PaymentConfirmation) => void;
  onUpdateStatus: (paymentId: string, status: PaymentStatus) => void;
}

const STATUS_BADGES: Record<PaymentStatus, { bg: string; text: string }> = {
  'Paid Off': { bg: 'bg-emerald-950/60 border-emerald-800', text: 'text-emerald-300' },
  'Partial': { bg: 'bg-amber-950/60 border-amber-800', text: 'text-amber-300' },
  'Pending': { bg: 'bg-slate-800 border-slate-700', text: 'text-slate-300' },
};

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  clients,
  invoices,
  onAddPayment,
  onEditPayment,
  onDeletePayment,
  onPrintPreview,
  onUpdateStatus,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = payments.filter((p) => {
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const s = search.toLowerCase();
    const matchSearch =
      !s ||
      p.confirmationNumber.toLowerCase().includes(s) ||
      p.confirmToName.toLowerCase().includes(s) ||
      p.bankSource.toLowerCase().includes(s);
    return matchStatus && matchSearch;
  });

  const totalPaidOff = payments
    .filter((p) => p.status === 'Paid Off')
    .reduce((acc, p) => acc + computeDocumentTotals(p.items, p.discount).grand, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="text-emerald-400" size={20} />
            <span>Konfirmasi Pembayaran (Payment Receipt)</span>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {filtered.length} Bukti Bayar
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Bukti verifikasi transfer klien. Status Paid Off otomatis memperbarui Invoice menjadi Lunas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <span className="text-[10px] text-slate-400 uppercase block">Total Dana Terverifikasi</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {formatRupiah(totalPaidOff)}
            </span>
          </div>

          <button
            onClick={onAddPayment}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>+ Catat Pembayaran</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor konfirmasi, nama klien, atau bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#DC2626]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'Paid Off', 'Partial', 'Pending'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                ${filterStatus === st ? 'bg-[#DC2626] text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {st === 'all' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Payments Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#1E293B] rounded-2xl border border-dashed border-slate-700 text-slate-400 space-y-2">
          <CreditCard size={32} className="mx-auto text-slate-500 opacity-60" />
          <div className="text-sm font-bold text-white">Belum ada bukti pembayaran yang cocok</div>
          <p className="text-xs text-slate-400">
            Catat bukti pembayaran masuk dari transfer BCA atau tunai.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((pay) => {
            const totals = computeDocumentTotals(pay.items, pay.discount);
            const badge = STATUS_BADGES[pay.status] || STATUS_BADGES['Paid Off'];
            const linkedInv = invoices.find((inv) => inv.id === pay.invoiceId);

            return (
              <div
                key={pay.id}
                className="bg-[#1E293B] border border-[#1E293B] hover:border-slate-700 p-5 rounded-2xl shadow-sm flex flex-col justify-between transition-all space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-slate-900 text-emerald-400 px-2 py-0.5 rounded border border-slate-800">
                        {pay.confirmationNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                        {pay.confirmToName}
                      </h3>
                      {pay.confirmToAttn && (
                        <div className="text-[11px] text-slate-400">Up: {pay.confirmToAttn}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onPrintPreview(pay)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Print / Preview PDF"
                      >
                        <Printer size={14} />
                      </button>
                      <button
                        onClick={() => onEditPayment(pay)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Bukti Bayar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => onDeletePayment(pay)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40"
                        title="Hapus Bukti Bayar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                      <span>Tanggal: {formatDate(pay.paymentDate)}</span>
                      <span>Metode: {pay.paymentMethod}</span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Bank Pengirim: <strong className="text-slate-200">{pay.bankSource}</strong> ➔ Bank Agensi: <strong className="text-slate-200">{pay.bankBenef}</strong>
                    </div>

                    {linkedInv && (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
                        <Receipt size={12} />
                        <span>Terhubung Invoice: {linkedInv.invoiceNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-sans">
                      Dana Pembayaran Masuk
                    </span>
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      {formatRupiah(totals.grand)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Status Pembayaran:</span>
                  <select
                    value={pay.status}
                    onChange={(e) => onUpdateStatus(pay.id, e.target.value as PaymentStatus)}
                    className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${badge.bg} ${badge.text}`}
                  >
                    <option value="Paid Off">Paid Off (Lunas)</option>
                    <option value="Partial">Partial (Sebagian)</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
