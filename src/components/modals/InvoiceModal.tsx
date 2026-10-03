import React, { useState } from 'react';
import { X, Receipt, Plus, Trash2, Building2, Printer, CreditCard } from 'lucide-react';
import { Invoice, Client, DocumentLineItem, InvoiceStatus } from '../../types';
import { computeDocumentTotals, formatRupiah, todayIso } from '../../utils/formatters';

interface InvoiceModalProps {
  initial?: Invoice | null;
  clients: Client[];
  onSave: (invoice: Invoice) => void;
  onClose: () => void;
  onPrintPreview?: (invoice: Invoice) => void;
  onCreatePayment?: (invoice: Invoice) => void;
}

const INVOICE_STATUSES: InvoiceStatus[] = ['Draft', 'Belum Dibayar', 'Lunas'];
const UNITS = ['Package', 'Pcs', 'Sesi', 'Jam', 'Hari', 'Project'];

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  initial,
  clients,
  onSave,
  onClose,
  onPrintPreview,
  onCreatePayment,
}) => {
  const [form, setForm] = useState<Partial<Invoice>>({
    id: initial?.id || `INV-${Date.now().toString().slice(-6)}`,
    clientId: initial?.clientId || (clients[0]?.id || ''),
    invoiceNumber: initial?.invoiceNumber || `70${Math.floor(Math.random() * 90 + 10)}/INV/BKR/OC/X/2026`,
    invoiceDate: initial?.invoiceDate || todayIso(),
    poNumber: initial?.poNumber || '',
    orderNumber: initial?.orderNumber || '',
    paymentTerms: initial?.paymentTerms || 'Bank Transfer (BCA)',
    billToName: initial?.billToName || '',
    billToAddress: initial?.billToAddress || '',
    servicePeriod: initial?.servicePeriod || 'OKTOBER 2026',
    items: initial?.items ? [...initial.items] : [
      { productNumber: 'INV-SMM', description: 'Jasa Social Media Management Periode Berjalan', qty: 1, unit: 'Package', unitPrice: 3500000, taxRate: 0 },
    ],
    discount: initial?.discount || 0,
    status: initial?.status || 'Belum Dibayar',
    notes: initial?.notes || 'Pembayaran via transfer BCA 0190448703 a/c Lalu Mahendra Ali Akbar.',
    createdAt: initial?.createdAt || todayIso(),
  });

  const [savedRecord, setSavedRecord] = useState<Invoice | null>(initial || null);

  const handleClientChange = (cId: string) => {
    const c = clients.find((client) => client.id === cId);
    setForm((prev) => ({
      ...prev,
      clientId: cId,
      billToName: c ? (c.company || c.name) : prev.billToName,
      billToAddress: c && c.notes ? c.notes : prev.billToAddress,
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
    const complete: Invoice = {
      id: form.id!,
      clientId: form.clientId || '',
      invoiceNumber: form.invoiceNumber?.trim() || 'INV/001',
      invoiceDate: form.invoiceDate || todayIso(),
      poNumber: form.poNumber?.trim() || '',
      orderNumber: form.orderNumber?.trim() || '',
      paymentTerms: form.paymentTerms?.trim() || 'Bank Transfer',
      billToName: form.billToName?.trim() || (clients.find(c => c.id === form.clientId)?.company || 'Klien'),
      billToAddress: form.billToAddress?.trim() || '',
      servicePeriod: form.servicePeriod?.trim() || '',
      items: form.items || [],
      discount: Number(form.discount) || 0,
      status: (form.status as InvoiceStatus) || 'Belum Dibayar',
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
            <Receipt className="text-red-400" size={22} />
            <div>
              <h2 className="text-base font-bold text-white">
                {initial ? 'Edit Faktur Tagihan (Invoice)' : 'Terbitkan Invoice Tagihan Baru'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Dokumen penagihan resmi dengan snapshot profil & monitoring status pelunasan
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
                Nomor Invoice *
              </label>
              <input
                type="text"
                value={form.invoiceNumber}
                onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tanggal Invoice
              </label>
              <input
                type="date"
                value={form.invoiceDate}
                onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status Tagihan
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as InvoiceStatus })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-[#DC2626]"
              >
                {INVOICE_STATUSES.map((s) => (
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
                value={form.poNumber}
                onChange={(e) => setForm({ ...form, poNumber: e.target.value })}
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

          {/* Bill To */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-300 block">
              Ditagihkan Kepada (Bill To)
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
                  value={form.billToName}
                  onChange={(e) => setForm({ ...form, billToName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Alamat Tagihan</label>
                <input
                  type="text"
                  placeholder="Kota / Alamat lengkap"
                  value={form.billToAddress}
                  onChange={(e) => setForm({ ...form, billToAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                Item Tagihan Layanan
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
                const lineTax = lineNet * ((it.taxRate || 0) / 100);
                const lineTotal = lineNet + lineTax;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Kode / Product No"
                        value={it.productNumber}
                        onChange={(e) => updateItem(idx, 'productNumber', e.target.value)}
                        className="px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Deskripsi layanan tagihan"
                        value={it.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        className="sm:col-span-3 px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center">
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
                        <span className="text-[10px] text-slate-400 block">Pajak (%)</span>
                        <input
                          type="number"
                          value={it.taxRate}
                          onChange={(e) => updateItem(idx, 'taxRate', Number(e.target.value) || 0)}
                          className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-center font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total Item</span>
                        <div className="px-2 py-1 text-white font-bold font-mono">
                          {formatRupiah(lineTotal)}
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
                Diskon Faktur (Rp)
              </label>
              <input
                type="number"
                value={form.discount || ''}
                onChange={(e) => setForm({ ...form, discount: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
              <label className="block text-xs font-semibold text-slate-300 mt-2 mb-1">
                Catatan Rekening / Instruksi Bayar
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
                <span>Taxes:</span>
                <span className="font-mono font-semibold">{formatRupiah(totals.tax)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Diskon:</span>
                <span className="font-mono font-semibold text-red-400">-{formatRupiah(totals.discount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Tagihan (Grand Total):</span>
                <span className="font-mono text-[#EF4444]">{formatRupiah(totals.grand)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-700 bg-[#0F172A]">
          <div className="flex items-center gap-2">
            {savedRecord && onCreatePayment && (
              <button
                type="button"
                onClick={() => {
                  onCreatePayment(savedRecord);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <CreditCard size={14} />
                <span>+ Buat Bukti Pembayaran</span>
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
              Simpan Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
