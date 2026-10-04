import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Building2,
  Calendar,
  Receipt,
  Printer,
  Trash2,
  Edit2,
  Search,
  MessageSquare,
} from 'lucide-react';
import { Quotation, Client, QuotationStatus } from '../../types';
import { formatRupiah, formatDate, computeDocumentTotals } from '../../utils/formatters';

interface QuotationsViewProps {
  quotations: Quotation[];
  clients: Client[];
  onAddQuotation: () => void;
  onEditQuotation: (quotation: Quotation) => void;
  onDeleteQuotation: (quotation: Quotation) => void;
  onConvertToInvoice: (quotation: Quotation) => void;
  onPrintPreview: (quotation: Quotation) => void;
  onUpdateStatus: (quotationId: string, status: QuotationStatus) => void;
  onSendWhatsApp?: (quotation: Quotation) => void;
}

const STATUS_BADGES: Record<QuotationStatus, { bg: string; text: string }> = {
  'Draft': { bg: 'bg-slate-800 border-slate-700', text: 'text-slate-300' },
  'Terkirim': { bg: 'bg-blue-950/60 border-blue-800', text: 'text-blue-300' },
  'Disetujui': { bg: 'bg-emerald-950/60 border-emerald-800', text: 'text-emerald-300' },
  'Ditolak': { bg: 'bg-red-950/60 border-red-800', text: 'text-red-300' },
};

export const QuotationsView: React.FC<QuotationsViewProps> = ({
  quotations,
  clients,
  onAddQuotation,
  onEditQuotation,
  onDeleteQuotation,
  onConvertToInvoice,
  onPrintPreview,
  onUpdateStatus,
  onSendWhatsApp,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = quotations.filter((q) => {
    const matchStatus = filterStatus === 'all' || q.status === filterStatus;
    const s = search.toLowerCase();
    const matchSearch =
      !s ||
      String(q.quotationNumber || '').toLowerCase().includes(s) ||
      String(q.proposeToName || '').toLowerCase().includes(s) ||
      String(q.servicePeriod || '').toLowerCase().includes(s);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="text-purple-400" size={20} />
            <span>Surat Penawaran (Quotation)</span>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {filtered.length} Penawaran
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Penawaran resmi dengan rincian layanan, diskon, dan tombol konversi otomatis ke Invoice.
          </p>
        </div>

        <button
          onClick={onAddQuotation}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>+ Buat Quotation</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor penawaran, nama klien, atau periode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#DC2626]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'Draft', 'Terkirim', 'Disetujui', 'Ditolak'].map((st) => (
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

      {/* Grid of Quotation Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#1E293B] rounded-2xl border border-dashed border-slate-700 text-slate-400 space-y-2">
          <FileSpreadsheet size={32} className="mx-auto text-slate-500 opacity-60" />
          <div className="text-sm font-bold text-white">Tidak ada dokumen penawaran yang cocok</div>
          <p className="text-xs text-slate-400">
            Penawaran dapat dibuat langsung atau dihasilkan dari modul Estimasi Biaya (RAB).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((quo) => {
            const totals = computeDocumentTotals(quo.items, quo.discount);
            const badge = STATUS_BADGES[quo.status] || STATUS_BADGES['Draft'];

            return (
              <div
                key={quo.id}
                className="bg-[#1E293B] border border-[#1E293B] hover:border-slate-700 p-5 rounded-2xl shadow-sm flex flex-col justify-between transition-all space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-slate-900 text-purple-400 px-2 py-0.5 rounded border border-slate-800">
                        {quo.quotationNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                        {quo.proposeToName}
                      </h3>
                      {quo.proposeToAttn && (
                        <div className="text-[11px] text-slate-400">Up: {quo.proposeToAttn}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onPrintPreview(quo)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Print / Preview PDF"
                      >
                        <Printer size={14} />
                      </button>
                      {onSendWhatsApp && (
                        <button
                          onClick={() => onSendWhatsApp(quo)}
                          className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-600/30 transition-colors"
                          title="Kirim Penawaran via WhatsApp"
                        >
                          <MessageSquare size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => onEditQuotation(quo)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Quotation"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => onDeleteQuotation(quo)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40"
                        title="Hapus Quotation"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Tanggal: {formatDate(quo.quotationDate)}</span>
                    <span>Periode: {quo.servicePeriod || '-'}</span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-sans">
                      {quo.items.length} Item Layanan
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-sans">Total Penawaran</span>
                      <span className="text-base font-bold text-white font-mono">
                        {formatRupiah(totals.grand)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <select
                    value={quo.status}
                    onChange={(e) => onUpdateStatus(quo.id, e.target.value as QuotationStatus)}
                    className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-none ${badge.bg} ${badge.text}`}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Terkirim">Terkirim</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>

                  <div className="flex items-center gap-1.5">
                    {onSendWhatsApp && (
                      <button
                        onClick={() => onSendWhatsApp(quo)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-900/50 transition-colors cursor-pointer"
                        title="Kirim Penawaran ke WhatsApp"
                      >
                        <MessageSquare size={12} />
                        <span>Kirim WA</span>
                      </button>
                    )}

                    <button
                      onClick={() => onConvertToInvoice(quo)}
                      className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-900/50 transition-colors cursor-pointer"
                    >
                      <Receipt size={13} />
                      <span>→ Convert ke Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
