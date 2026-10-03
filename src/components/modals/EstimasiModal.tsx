import React, { useState } from 'react';
import {
  X,
  Calculator,
  Search,
  Plus,
  Trash2,
  Building2,
  Calendar,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Estimasi, Client, EquipmentItem, EstimasiItem } from '../../types';
import {
  computeEstimasiSummary,
  formatRupiah,
  todayIso,
} from '../../utils/formatters';

interface EstimasiModalProps {
  initial?: Estimasi | null;
  clients: Client[];
  equipmentList: EquipmentItem[];
  onSave: (estimasi: Estimasi) => void;
  onClose: () => void;
  onConvert?: (estimasi: Estimasi) => void;
  onPrintPreview?: (estimasi: Estimasi) => void;
}

export const EstimasiModal: React.FC<EstimasiModalProps> = ({
  initial,
  clients,
  equipmentList,
  onSave,
  onClose,
  onConvert,
  onPrintPreview,
}) => {
  const [form, setForm] = useState<Partial<Estimasi>>({
    id: initial?.id || `EST-${Date.now().toString().slice(-6)}`,
    clientId: initial?.clientId || (clients[0]?.id || ''),
    jenisJasa: initial?.jenisJasa || '',
    anggaran: initial?.anggaran || 0,
    jadwal: initial?.jadwal || '',
    deadline: initial?.deadline || '',
    skillset: initial?.skillset || 0,
    items: initial?.items ? [...initial.items] : [],
    status: initial?.status || 'Draft',
    notes: initial?.notes || '',
    createdAt: initial?.createdAt || todayIso(),
  });

  const [savedRecord, setSavedRecord] = useState<Estimasi | null>(initial || null);
  const [eqSearch, setEqSearch] = useState('');
  const [eqCatFilter, setEqCatFilter] = useState('');

  // Manual Item Add States
  const [manualNama, setManualNama] = useState('');
  const [manualKategori, setManualKategori] = useState<'Biaya Jasa' | 'Biaya Bahan'>('Biaya Jasa');
  const [manualHarga, setManualHarga] = useState<number | ''>('');
  const [manualQty, setManualQty] = useState<number>(1);

  // Equipment categories
  const eqCategories = Array.from(new Set(equipmentList.map((e) => e.kategori).filter(Boolean))).sort();

  const filteredEquipment = eqSearch.trim()
    ? equipmentList
        .filter((item) => {
          const matchName = item.namaBarang.toLowerCase().includes(eqSearch.toLowerCase());
          const matchCat = !eqCatFilter || item.kategori === eqCatFilter;
          return matchName && matchCat;
        })
        .slice(0, 15)
    : [];

  const addEquipmentItem = (eq: EquipmentItem) => {
    const newItem: EstimasiItem = {
      nama: eq.namaBarang,
      kategori: 'Biaya Peralatan',
      hargaSatuan: eq.hargaSewa || 0,
      qty: 1,
    };
    setForm((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));
  };

  const addManualItem = () => {
    if (!manualNama.trim() || !manualHarga) return;
    const newItem: EstimasiItem = {
      nama: manualNama.trim(),
      kategori: manualKategori,
      hargaSatuan: Number(manualHarga) || 0,
      qty: Number(manualQty) || 1,
    };
    setForm((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));
    setManualNama('');
    setManualHarga('');
    setManualQty(1);
  };

  const updateItemQty = (index: number, newQty: number) => {
    setForm((prev) => {
      const items = [...(prev.items || [])];
      items[index] = { ...items[index], qty: Math.max(1, newQty) };
      return { ...prev, items };
    });
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  };

  // Real-time calculation summary
  const summary = computeEstimasiSummary(
    form.items || [],
    Number(form.skillset) || 0,
    Number(form.anggaran) || 0
  );

  const handleSave = () => {
    if (!form.clientId) return;
    const completeEstimasi: Estimasi = {
      id: form.id!,
      clientId: form.clientId,
      jenisJasa: form.jenisJasa?.trim() || 'Estimasi Produksi',
      anggaran: Number(form.anggaran) || 0,
      jadwal: form.jadwal?.trim() || '',
      deadline: form.deadline?.trim() || '',
      skillset: Number(form.skillset) || 0,
      items: form.items || [],
      totalBiaya: summary.totalBiaya,
      labaKotor: summary.labaKotor,
      infaq: summary.infaq,
      labaBersih: summary.labaBersih,
      saham: summary.saham,
      status: form.status || 'Draft',
      quotationId: form.quotationId,
      notes: form.notes?.trim() || '',
      createdAt: form.createdAt || todayIso(),
    };

    onSave(completeEstimasi);
    setSavedRecord(completeEstimasi);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#1E293B] border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-[#0F172A]">
          <div className="flex items-center gap-2.5">
            <Calculator className="text-emerald-400" size={22} />
            <div>
              <h2 className="text-base font-bold text-white">
                {initial ? 'Edit Estimasi Biaya (RAB)' : 'Buat Estimasi Biaya Produksi Baru'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Formula resmi: Biaya Total → Laba Kotor → Infaq (2.5%) → Laba Bersih → Saham (10%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 size={13} className="text-slate-400" />
                <span>Klien (CRM) *</span>
              </label>
              <select
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#DC2626]"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company ? `${c.company} (${c.name || 'PIC'})` : c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jenis Jasa / Nama Proyek
              </label>
              <input
                type="text"
                placeholder="Contoh: Pemotretan Produk Makanan"
                value={form.jenisJasa}
                onChange={(e) => setForm({ ...form, jenisJasa: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Anggaran Disepakati / Ditargetkan (Rp)
              </label>
              <input
                type="number"
                placeholder="Contoh: 5000000"
                value={form.anggaran || ''}
                onChange={(e) => setForm({ ...form, anggaran: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#DC2626]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                <span>Jadwal Produksi</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: 10-12 Oktober 2026"
                value={form.jadwal}
                onChange={(e) => setForm({ ...form, jadwal: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Deadline Penyerahan Hasil
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Skillset / Overhead Produksi (Rp)
              </label>
              <input
                type="number"
                placeholder="Contoh: 500000"
                value={form.skillset || ''}
                onChange={(e) => setForm({ ...form, skillset: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#DC2626]"
              />
            </div>
          </div>

          {/* Section: Ambil Alat dari Equipment Hub */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">
                  🔍 Tarik Inventaris dari Equipment Hub
                </span>
                <span className="text-[10px] bg-red-950/60 text-red-300 border border-red-800/40 px-2 py-0.5 rounded font-mono">
                  {equipmentList.length} Item Tersedia
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama alat (Sony A6400, Godox, Meike, Weebill, dll)..."
                  value={eqSearch}
                  onChange={(e) => setEqSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
              <select
                value={eqCatFilter}
                onChange={(e) => setEqCatFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              >
                <option value="">Semua Kategori</option>
                {eqCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipment Search Results */}
            {eqSearch.trim() && (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/70 p-1 divide-y divide-slate-800/50">
                {filteredEquipment.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400">
                    Alat tidak ditemukan. Coba kata kunci lain.
                  </div>
                ) : (
                  filteredEquipment.map((eq) => (
                    <div
                      key={eq.id}
                      className="flex items-center justify-between p-2 hover:bg-slate-800/60 rounded transition-colors text-xs"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{eq.namaBarang}</span>
                          {eq.kondisiAlat && eq.kondisiAlat.toLowerCase() !== 'baik' && (
                            <span className="flex items-center gap-1 text-[10px] bg-red-950/80 text-red-400 px-1.5 py-0.5 rounded border border-red-800">
                              <AlertTriangle size={10} />
                              {eq.kondisiAlat}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {eq.kategori} · Biaya Sewa: {formatRupiah(eq.hargaSewa)} / hari
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addEquipmentItem(eq)}
                        className="px-2.5 py-1 rounded bg-[#DC2626] hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} />
                        Tambah
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Section: Tambah Fee Jasa / Bahan Manual */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-300">
              + Tambah Fee Jasa / Properti Bahan
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Nama item (Fotografer, Food Stylist, Piring Props...)"
                value={manualNama}
                onChange={(e) => setManualNama(e.target.value)}
                className="sm:col-span-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              />
              <select
                value={manualKategori}
                onChange={(e) => setManualKategori(e.target.value as 'Biaya Jasa' | 'Biaya Bahan')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              >
                <option value="Biaya Jasa">Biaya Jasa</option>
                <option value="Biaya Bahan">Biaya Bahan</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Harga (Rp)"
                  value={manualHarga}
                  onChange={(e) => setManualHarga(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={addManualItem}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold cursor-pointer shrink-0"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>

          {/* Table: Item List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                Daftar Rincian Biaya Produksi ({(form.items || []).length} Item)
              </span>
            </div>

            {(form.items || []).length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                Belum ada rincian biaya. Tambahkan alat dari Equipment Hub atau masukkan fee jasa/bahan di atas.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-700">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F172A] text-slate-300 uppercase text-[10px] font-mono border-b border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Item Layanan / Alat</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                      <th className="py-2.5 px-3 text-center w-20">Qty</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                      <th className="py-2.5 px-3 text-center w-12">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {(form.items || []).map((it, idx) => {
                      const sub = (it.qty || 1) * (it.hargaSatuan || 0);
                      const catBadge =
                        it.kategori === 'Biaya Peralatan'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                          : it.kategori === 'Biaya Jasa'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                          : 'bg-amber-950/60 text-amber-300 border-amber-800/40';

                      return (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-semibold text-white">{it.nama}</td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${catBadge}`}>
                              {it.kategori}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">{formatRupiah(it.hargaSatuan)}</td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              min="1"
                              value={it.qty}
                              onChange={(e) => updateItemQty(idx, parseInt(e.target.value) || 1)}
                              className="w-14 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-white text-xs text-center font-mono"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-white font-mono">
                            {formatRupiah(sub)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(idx)}
                              className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Real-time Calculation Breakdown Box */}
          <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-4 space-y-2 text-xs">
            <div className="font-bold text-slate-300 pb-1 border-b border-slate-800 flex justify-between items-center">
              <span>Ringkasan Finansial RAB</span>
              <span className="text-[10px] text-emerald-400 font-mono">Obee Formula v2</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1 text-slate-300">
              <div>
                <span className="text-slate-400 text-[11px] block">Biaya Alat</span>
                <span className="font-mono font-bold">{formatRupiah(summary.byCategory['Biaya Peralatan'])}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Biaya Jasa</span>
                <span className="font-mono font-bold">{formatRupiah(summary.byCategory['Biaya Jasa'])}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Biaya Bahan</span>
                <span className="font-mono font-bold">{formatRupiah(summary.byCategory['Biaya Bahan'])}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Skillset / Overhead</span>
                <span className="font-mono font-bold">{formatRupiah(summary.skillset)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Total Biaya</span>
                <span className="font-mono font-bold text-white text-sm">{formatRupiah(summary.totalBiaya)}</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Laba Kotor</span>
                <span className="font-mono font-bold text-slate-200 text-sm">{formatRupiah(summary.labaKotor)}</span>
              </div>

              <div className="bg-red-950/30 p-2.5 rounded-lg border border-red-900/40">
                <span className="text-[10px] text-red-400 block uppercase">Infaq (2.5%)</span>
                <span className="font-mono font-bold text-red-400 text-sm">-{formatRupiah(summary.infaq)}</span>
              </div>

              <div className="bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/40">
                <span className="text-[10px] text-emerald-400 block uppercase">Laba Bersih</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{formatRupiah(summary.labaBersih)}</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-amber-400 block uppercase">Saham (10%)</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{formatRupiah(summary.saham)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-700 bg-[#0F172A]">
          <div className="flex items-center gap-2">
            {savedRecord && onConvert && (
              <button
                type="button"
                onClick={() => {
                  onConvert(savedRecord);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <FileSpreadsheet size={14} />
                <span>→ Convert ke Quotation</span>
              </button>
            )}

            {savedRecord && onPrintPreview && (
              <button
                type="button"
                onClick={() => onPrintPreview(savedRecord)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Printer size={14} />
                <span>Print / Preview PDF</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-950/40 cursor-pointer"
            >
              Simpan Estimasi RAB
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
