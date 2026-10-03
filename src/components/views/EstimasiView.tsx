import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Building2,
  Calendar,
  FileSpreadsheet,
  Printer,
  Trash2,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { Estimasi, Client } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';

interface EstimasiViewProps {
  estimasiList: Estimasi[];
  clients: Client[];
  onAddEstimasi: () => void;
  onEditEstimasi: (estimasi: Estimasi) => void;
  onDeleteEstimasi: (estimasi: Estimasi) => void;
  onConvertQuotation: (estimasi: Estimasi) => void;
  onPrintPreview: (estimasi: Estimasi) => void;
}

export const EstimasiView: React.FC<EstimasiViewProps> = ({
  estimasiList,
  clients,
  onAddEstimasi,
  onEditEstimasi,
  onDeleteEstimasi,
  onConvertQuotation,
  onPrintPreview,
}) => {
  const getClientName = (cId: string) => {
    const c = clients.find((client) => client.id === cId);
    return c ? (c.company || c.name) : '—';
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Calculator className="text-emerald-400" size={20} />
            <span>Estimasi Biaya Produksi (RAB)</span>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {estimasiList.length} RAB Tersimpan
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Kalkulasi komprehensif inventaris alat, fee jasa, infaq 2.5% dan dividen saham 10%.
          </p>
        </div>

        <button
          onClick={onAddEstimasi}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>+ Buat Estimasi RAB</span>
        </button>
      </div>

      {estimasiList.length === 0 ? (
        <div className="p-12 text-center bg-[#1E293B] rounded-2xl border border-dashed border-slate-700 text-slate-400 space-y-2">
          <Calculator size={32} className="mx-auto text-slate-500 opacity-60" />
          <div className="text-sm font-bold text-white">Belum ada dokumen Estimasi RAB</div>
          <p className="text-xs text-slate-400">
            Buat kalkulasi kebutuhan alat kamera, lighting, modifier, dan jasa produksi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {estimasiList.map((est) => (
            <div
              key={est.id}
              className="bg-[#1E293B] border border-[#1E293B] hover:border-slate-700 p-5 rounded-2xl shadow-sm flex flex-col justify-between transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-slate-900 text-emerald-400 px-2 py-0.5 rounded border border-slate-800">
                      {est.id}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                      {est.jenisJasa}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onPrintPreview(est)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Preview / Print PDF"
                    >
                      <Printer size={14} />
                    </button>
                    <button
                      onClick={() => onEditEstimasi(est)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Edit Estimasi"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteEstimasi(est)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40"
                      title="Hapus Estimasi"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 mt-2">
                  <Building2 size={12} className="text-slate-400" />
                  <span>{getClientName(est.clientId)}</span>
                  {est.jadwal && (
                    <>
                      <span>·</span>
                      <span className="text-slate-400">{est.jadwal}</span>
                    </>
                  )}
                </div>

                {/* Items Summary Pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded font-mono">
                    {est.items.length} Item Rincian
                  </span>
                  <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded font-mono">
                    Anggaran: {formatRupiah(est.anggaran)}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border
                      ${
                        est.status === 'Dikonversi ke Quotation'
                          ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                  >
                    {est.status}
                  </span>
                </div>

                {/* Financial Summary Grid */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Total Biaya</span>
                    <span className="font-bold text-white">{formatRupiah(est.totalBiaya)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-red-400 block font-sans">Infaq (2.5%)</span>
                    <span className="text-red-400 font-bold">-{formatRupiah(est.infaq)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 block font-sans">Laba Bersih</span>
                    <span className="text-emerald-400 font-bold">{formatRupiah(est.labaBersih)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 block font-sans">Saham (10%)</span>
                    <span className="text-amber-400 font-bold">{formatRupiah(est.saham)}</span>
                  </div>
                </div>
              </div>

              {/* Action convert */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Dibuat: {formatDate(est.createdAt)}
                </span>
                {est.status !== 'Dikonversi ke Quotation' ? (
                  <button
                    onClick={() => onConvertQuotation(est)}
                    className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-950/40 hover:bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-900/50 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet size={13} />
                    <span>→ Convert ke Quotation</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-purple-400 font-semibold font-mono">
                    ✓ Sudah Ditransfer ke Quotation
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
