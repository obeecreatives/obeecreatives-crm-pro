import React, { useState } from 'react';
import { X, FileSpreadsheet, Plus, Trash2, Building2, Receipt, Printer } from 'lucide-react';
import { Quotation, Client, DocumentLineItem, QuotationStatus } from '../../types';
import { computeDocumentTotals, formatRupiah, todayIso } from '../../utils/formatters';

interface QuotationModalProps {
  initial?: Quotation | null;
  clients: Client[];
  onSave: (quotation: Quotation) => void;
  onClose: () => void;
  onConvertToInvoice?: (quotation: Quotation) => void;
  onPrintPreview?: (quotation: Quotation) => void;
}

const QUOTATION_STATUSES: QuotationStatus[] = ['Draft', 'Terkirim', 'Disetujui', 'Ditolak'];
const UNITS = ['Package', 'Pcs', 'Sesi', 'Jam', 'Hari', 'Project'];

export const QuotationModal: React.FC<QuotationModalProps> = ({
  initial,
  clients,
  onSave,
  onClose,
  onConvertToInvoice,
  onPrintPreview,
}) => {
  const [form, setForm] = useState<Partial<Quotation>>({
    id: initial?.id || `QUO-${Date.now().toString().slice(-6)}`,
    clientId: initial?.clientId || (clients[0]?.id || ''),
    quotationNumber: initial?.quotationNumber || `60${Math.floor(Math.random() * 90 + 10)}/QUO/OV/OC/X/2026`,
    quotationDate: initial?.quotationDate || todayIso(),
    paymentTerms: initial?.paymentTerms || 'Bank Transfer (BCA)',
    purchaseOrder: initial?.purchaseOrder || '',
    orderNumber: initial?.orderNumber || '',
    proposeToName: initial?.proposeToName || '',
    proposeToAttn: initial?.proposeToAttn || '',
    servicePeriod: initial?.servicePeriod || 'OKTOBER 2026',
    items: initial?.items ? [...initial.items] : [
      { productNumber: 'PROD-01', description: 'Paket Pembuatan Konten Visual', qty: 1, unit: 'Package', unitPrice: 3500000, taxRate: 0 },
    ],
    discount: initial?.discount || 0,
    status: initial?.status || 'Draft',
    notes: initial?.notes || 'Harga sudah termasuk revisi minor 2 kali.',
    createdAt: initial?.createdAt || todayIso(),
  });

  const [savedRecord, setSavedRecord] = useState<Quotation | null>(initial || null);

  // Auto-fill ProposeToName when client is selected
  const handleClientChange = (cId: string) => {
    const c = clients.find((client) => client.id === cId);
    setForm((prev) => ({
      ...prev,
      clientId: cId,
      proposeToName: c ? (c.company || c.name) : prev.proposeToName,
      proposeToAttn: c ? c.name : prev.proposeToAttn,
    }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { productNumber: '', description: '', qty: 1, unit: 'Package', unitPrice: 0, taxRate: 0 },
      ],
    }));
  };

  const updateItem = (index: number, field: keyof DocumentLineItem, val: string | number) => {
    setForm((prev) => {
      const items = [...(prev.items || [])];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, items };
    });
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  };

  const totals = computeDocumentTotals(form.items || [], Number(form.discount) || 0);

  const handleSave = () => {
    const complete: Quotation = {
      id: form.id!,
      clientId: form.clientId || '',
      quotationNumber: form.quotationNumber?.trim() || 'QUO/001',
      quotationDate: form.quotationDate || todayIso(),
      paymentTerms: form.paymentTerms?.trim() || 'Bank Transfer',
      purchaseOrder: form.purchaseOrder?.trim() || '',
      orderNumber: form.orderNumber?.trim() || '',
      proposeToName: form.proposeToName?.trim() || (clients.find(c => c.id === form.clientId)?.company || 'Klien'),
      proposeToAttn: form.proposeToAttn?.trim() || '',
      servicePeriod: form.servicePeriod?.trim() || '',
      items: form.items || [],
      discount: Number(form.discount) || 0,
      status: (form.status as QuotationStatus) || 'Draft',
      notes: form.notes?.trim() || '',
      createdAt: form.createdAt || todayIso(),
    };

    onSave(complete);
    setSavedRecord(complete);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#1E293B] border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-[#0F172A]">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="text-purple-400" size={22} />
            <div>
              <h2 className="text-base font-bold text-white">
                {initial ? 'Edit Quotation Penawaran' : 'Buat Surat Penawaran (Quotation)'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Format resmi penawaran obeecreatives dengan opsi konversi instan ke Invoice
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

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Header Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nomor Quotation *
              </label>
              <input
                type="text"
                value={form.quotationNumber}
                onChange={(e) => setForm({ ...form, quotationNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tanggal Penawaran
              </label>
              <input
                type="date"
                value={form.quotationDate}
                onChange={(e) => setForm({ ...form, quotationDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status Penawaran
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as QuotationStatus })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-[#DC2626]"
              >
                {QUOTATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Payment Terms
              </label>
              <input
                type="text"
                value={form.paymentTerms}
                onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Purchase Order (PO)
              </label>
              <input
                type="text"
                value={form.purchaseOrder}
                onChange={(e) => setForm({ ...form, purchaseOrder: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Service Periode
              </label>
              <input
                type="text"
                value={form.servicePeriod}
                onChange={(e) => setForm({ ...form, servicePeriod: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          {/* Propose To */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-300 block">
              Tujuan Penawaran (Propose To)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Building2 size={12} />
                  <span>Klien dari CRM</span>
                </label>
                <select
                  value={form.clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                >
                  <option value="">— Pilih Klien —</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company ? `${c.company} (${c.name || 'PIC'})` : c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nama Perusahaan / Klien *</label>
                <input
                  type="text"
                  value={form.proposeToName}
                  onChange={(e) => setForm({ ...form, proposeToName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Attention (Up Bapak/Ibu)</label>
                <input
                  type="text"
                  value={form.proposeToAttn}
                  onChange={(e) => setForm({ ...form, proposeToAttn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                Item Layanan & Harga Penawaran
              </span>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Tambah Baris</span>
              </button>
            </div>

            <div className="space-y-3">
              {(form.items || []).map((it, idx) => {
                const lineNet = (it.qty || 0) * (it.unitPrice || 0);
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Product No / Kode"
                        value={it.productNumber}
                        onChange={(e) => updateItem(idx, 'productNumber', e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white font-mono"
                      />
                      <textarea
                        rows={2}
                        placeholder="Deskripsi layanan (gunakan enter untuk sub-poin detail)"
                        value={it.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        className="sm:col-span-3 px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Qty</span>
                        <input
                          type="number"
                          value={it.qty}
                          onChange={(e) => updateItem(idx, 'qty', Number(e.target.value) || 1)}
                          className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-center font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Satuan</span>
                        <select
                          value={it.unit}
                          onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white"
                        >
                          {UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Harga Satuan (Rp)</span>
                        <input
                          type="number"
                          value={it.unitPrice}
                          onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value) || 0)}
                          className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Subtotal</span>
                        <div className="px-2 py-1 text-white font-bold font-mono">
                          {formatRupiah(lineNet)}
                        </div>
                      </div>
                      <div className="text-right">
                        {(form.items || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discount & Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Diskon Penawaran (Rp)
              </label>
              <input
                type="number"
                value={form.discount || ''}
                onChange={(e) => setForm({ ...form, discount: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
              <label className="block text-xs font-semibold text-slate-300 mt-2 mb-1">
                Catatan / Terms Penawaran
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Net Amount:</span>
                <span className="font-mono font-semibold">{formatRupiah(totals.net)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Diskon:</span>
                <span className="font-mono font-semibold text-red-400">-{formatRupiah(totals.discount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="font-mono text-[#EF4444]">{formatRupiah(totals.grand)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-700 bg-[#0F172A]">
          <div className="flex items-center gap-2">
            {savedRecord && onConvertToInvoice && (
              <button
                type="button"
                onClick={() => {
                  onConvertToInvoice(savedRecord);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Receipt size={14} />
                <span>→ Convert ke Invoice Baru</span>
              </button>
            )}

            {savedRecord && onPrintPreview && (
              <button
                type="button"
                onClick={() => onPrintPreview(savedRecord)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
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
              Simpan Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
