import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  CreditCard,
  Printer,
  Trash2,
  Edit2,
  Search,
} from 'lucide-react';
import { Invoice, Client, InvoiceStatus } from '../../types';
import { formatRupiah, formatDate, computeDocumentTotals } from '../../utils/formatters';

interface InvoicesViewProps {
  invoices: Invoice[];
  clients: Client[];
  onAddInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoice: Invoice) => void;
  onCreatePayment: (invoice: Invoice) => void;
  onPrintPreview: (invoice: Invoice) => void;
  onUpdateStatus: (invoiceId: string, status: InvoiceStatus) => void;
}

const STATUS_BADGES: Record<InvoiceStatus, { bg: string; text: string }> = {
  'Draft': { bg: 'bg-slate-800 border-slate-700', text: 'text-slate-300' },
  'Belum Dibayar': { bg: 'bg-amber-950/60 border-amber-800', text: 'text-amber-300' },
  'Lunas': { bg: 'bg-emerald-950/60 border-emerald-800', text: 'text-emerald-300' },
};

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  clients,
  onAddInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onCreatePayment,
  onPrintPreview,
  onUpdateStatus,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Clean up ghost duplicate empty invoices
  const cleanInvoices = (invoices || []).reduce<Invoice[]>((acc, inv) => {
    if (!inv) return acc;
    const invNum = String(inv.invoiceNumber || '').trim();
    const existingIdx = acc.findIndex((x) => String(x.invoiceNumber || '').trim() === invNum);
    if (existingIdx === -1) {
      acc.push(inv);
    } else {
      const existingItemsTotal = (acc[existingIdx].items || []).reduce((sum, it) => sum + (Number(it.unitPrice) || 0), 0);
      const newItemsTotal = (inv.items || []).reduce((sum, it) => sum + (Number(it.unitPrice) || 0), 0);
      if (existingItemsTotal === 0 && newItemsTotal > 0) {
        acc[existingIdx] = inv;
      }
    }
    return acc;
  }, []);

  const filtered = cleanInvoices.filter((i) => {
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    const s = search.toLowerCase();
    const matchSearch =
      !s ||
      String(i.invoiceNumber || '').toLowerCase().includes(s) ||
      String(i.billToName || '').toLowerCase().includes(s) ||
      String(i.servicePeriod || '').toLowerCase().includes(s);
    return matchStatus && matchSearch;
  });

  const unpaidTotal = cleanInvoices
    .filter((i) => i && i.status === 'Belum Dibayar')
    .reduce((acc, i) => acc + computeDocumentTotals(Array.isArray(i.items) ? i.items : [], i.discount).grand, 0);

  const lunasTotal = cleanInvoices
    .filter((i) => i && i.status === 'Lunas')
    .reduce((acc, i) => acc + computeDocumentTotals(Array.isArray(i.items) ? i.items : [], i.discount).grand, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Receipt className="text-red-400" size={20} />
            <span>Faktur Tagihan (Invoices)</span>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {filtered.length} Tagihan
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Penagihan klien resmi dengan snapshot data alamat dan status pembayaran.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <span className="text-[10px] text-slate-400 uppercase block">Total Belum Dibayar</span>
            <span className="text-xs font-bold text-amber-400 font-mono">
              {formatRupiah(unpaidTotal)}
            </span>
          </div>

          <button
            onClick={onAddInvoice}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>+ Buat Invoice</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor invoice, nama klien, atau periode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#DC2626]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'Belum Dibayar', 'Lunas', 'Draft'].map((st) => (
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

      {/* Grid of Invoice Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#1E293B] rounded-2xl border border-dashed border-slate-700 text-slate-400 space-y-2">
          <Receipt size={32} className="mx-auto text-slate-500 opacity-60" />
          <div className="text-sm font-bold text-white">Tidak ada dokumen invoice yang cocok</div>
          <p className="text-xs text-slate-400">
            Invoice baru dapat dibuat langsung atau hasil convert dari Quotation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((inv) => {
            const totals = computeDocumentTotals(inv.items, inv.discount);
            const badge = STATUS_BADGES[inv.status] || STATUS_BADGES['Draft'];

            return (
              <div
                key={inv.id}
                className="bg-[#1E293B] border border-[#1E293B] hover:border-slate-700 p-5 rounded-2xl shadow-sm flex flex-col justify-between transition-all space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-slate-900 text-red-400 px-2 py-0.5 rounded border border-slate-800">
                        {inv.invoiceNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                        {inv.billToName}
                      </h3>
                      {inv.billToAddress && (
                        <div className="text-[11px] text-slate-400 truncate">{inv.billToAddress}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onPrintPreview(inv)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Print / Preview PDF"
                      >
                        <Printer size={14} />
                      </button>
                      <button
                        onClick={() => onEditInvoice(inv)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Invoice"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => onDeleteInvoice(inv)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40"
                        title="Hapus Invoice"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Tanggal: {formatDate(inv.invoiceDate)}</span>
                    <span>Periode: {inv.servicePeriod || '-'}</span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-sans">
                      {inv.items.length} Item Tagihan
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-sans">Grand Total</span>
                      <span className="text-base font-bold text-white font-mono">
                        {formatRupiah(totals.grand)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <select
                    value={inv.status}
                    onChange={(e) => onUpdateStatus(inv.id, e.target.value as InvoiceStatus)}
                    className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-none ${badge.bg} ${badge.text}`}
                  >
                    <option value="Belum Dibayar">Belum Dibayar</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Draft">Draft</option>
                  </select>

                  {inv.status !== 'Lunas' ? (
                    <button
                      onClick={() => onCreatePayment(inv)}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-900/50 transition-colors cursor-pointer"
                    >
                      <CreditCard size={13} />
                      <span>+ Konfirmasi Bayar</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-semibold font-mono">
                      ✓ Lunas Terverifikasi
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
