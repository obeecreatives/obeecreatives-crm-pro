import React, { useState } from 'react';
import { X, CreditCard, Building2, Receipt, Printer, CheckCircle2 } from 'lucide-react';
import { PaymentConfirmation, Client, Invoice, PaymentStatus, DocumentLineItem } from '../../types';
import { computeDocumentTotals, formatRupiah, todayIso } from '../../utils/formatters';

interface PaymentModalProps {
  initial?: PaymentConfirmation | null;
  clients: Client[];
  invoices: Invoice[];
  onSave: (payment: PaymentConfirmation) => void;
  onClose: () => void;
  onPrintPreview?: (payment: PaymentConfirmation) => void;
}

const PAYMENT_STATUSES: PaymentStatus[] = ['Paid Off', 'Partial', 'Pending'];
const UNITS = ['Package', 'Pcs', 'Sesi', 'Jam', 'Hari', 'Project'];

export const PaymentModal: React.FC<PaymentModalProps> = ({
  initial,
  clients,
  invoices,
  onSave,
  onClose,
  onPrintPreview,
}) => {
  const [form, setForm] = useState<Partial<PaymentConfirmation>>({
    id: initial?.id || `PAY-${Date.now().toString().slice(-6)}`,
    clientId: initial?.clientId || (clients[0]?.id || ''),
    invoiceId: initial?.invoiceId || '',
    confirmationNumber: initial?.confirmationNumber || `30${Math.floor(Math.random() * 90 + 10)}/PC/PH-OC/X/2026`,
    paymentDate: initial?.paymentDate || todayIso(),
    paymentMethod: initial?.paymentMethod || 'Bank Transfer',
    confirmToName: initial?.confirmToName || '',
    confirmToAttn: initial?.confirmToAttn || '',
    serviceTerm: initial?.serviceTerm || 'Term 1 / Lunas',
    items: initial?.items ? [...initial.items] : [
      { productNumber: 'INV-PAY', description: 'Pelunasan Pembayaran Jasa Kreatif', qty: 1, unit: 'Package', unitPrice: 3500000, taxRate: 0 },
    ],
    discount: initial?.discount || 0,
    bankSource: initial?.bankSource || 'BCA (Klien)',
    bankBenef: initial?.bankBenef || 'BCA 0190448703 a/c Lalu Mahendra',
    status: initial?.status || 'Paid Off',
    notes: initial?.notes || 'Bukti bayar sudah dikonfirmasi masuk rekening agensi.',
    createdAt: initial?.createdAt || todayIso(),
  });

  const [savedRecord, setSavedRecord] = useState<PaymentConfirmation | null>(initial || null);

  // Link invoice selection
  const handleInvoiceChange = (invId: string) => {
    const inv = invoices.find((i) => i.id === invId);
    if (!inv) {
      setForm((prev) => ({ ...prev, invoiceId: '' }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      invoiceId: invId,
      clientId: inv.clientId || prev.clientId,
      confirmToName: inv.billToName || prev.confirmToName,
      serviceTerm: inv.servicePeriod ? `Periode ${inv.servicePeriod}` : prev.serviceTerm,
      items: inv.items && inv.items.length ? [...inv.items] : prev.items,
      discount: inv.discount || 0,
    }));
  };

  const handleClientChange = (cId: string) => {
    const c = clients.find((client) => client.id === cId);
    setForm((prev) => ({
      ...prev,
      clientId: cId,
      confirmToName: c ? (c.company || c.name) : prev.confirmToName,
      confirmToAttn: c ? c.name : prev.confirmToAttn,
    }));
  };

  const updateItem = (index: number, field: keyof DocumentLineItem, val: string | number) => {
    setForm((prev) => {
      const items = [...(prev.items || [])];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, items };
    });
  };

  const totals = computeDocumentTotals(form.items || [], Number(form.discount) || 0);

  const handleSave = () => {
    const complete: PaymentConfirmation = {
      id: form.id!,
      clientId: form.clientId || '',
      invoiceId: form.invoiceId || '',
      confirmationNumber: form.confirmationNumber?.trim() || 'PC/001',
      paymentDate: form.paymentDate || todayIso(),
      paymentMethod: form.paymentMethod?.trim() || 'Bank Transfer',
      confirmToName: form.confirmToName?.trim() || (clients.find(c => c.id === form.clientId)?.company || 'Klien'),
      confirmToAttn: form.confirmToAttn?.trim() || '',
      serviceTerm: form.serviceTerm?.trim() || '-',
      items: form.items || [],
      discount: Number(form.discount) || 0,
      bankSource: form.bankSource?.trim() || '',
      bankBenef: form.bankBenef?.trim() || '',
      status: (form.status as PaymentStatus) || 'Paid Off',
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
            <CreditCard className="text-emerald-400" size={22} />
            <div>
              <h2 className="text-base font-bold text-white">
                {initial ? 'Edit Payment Confirmation' : 'Catat Konfirmasi Pembayaran (Bukti Bayar)'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Pencatatan kas masuk resmi · Status "Paid Off" otomatis menandai Invoice terkait Lunas
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
                Nomor Konfirmasi *
              </label>
              <input
                type="text"
                value={form.confirmationNumber}
                onChange={(e) => setForm({ ...form, confirmationNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tanggal Pembayaran Masuk
              </label>
              <input
                type="date"
                value={form.paymentDate}
                onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status Pembayaran
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as PaymentStatus })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-[#DC2626]"
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Link to Invoice & Client */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-300 block">
              Hubungkan ke Invoice & Klien
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Receipt size={12} className="text-red-400" />
                  <span>Pilih Invoice Tagihan (Opsional - Auto Salin Data)</span>
                </label>
                <select
                  value={form.invoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                >
                  <option value="">— Tidak Terhubung Invoice —</option>
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} — {inv.billToName} ({inv.status})
                    </option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nama di Konfirmasi (Confirm To) *</label>
                <input
                  type="text"
                  value={form.confirmToName}
                  onChange={(e) => setForm({ ...form, confirmToName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Attention (Up)</label>
                <input
                  type="text"
                  value={form.confirmToAttn}
                  onChange={(e) => setForm({ ...form, confirmToAttn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Service Term / Termin</label>
                <input
                  type="text"
                  value={form.serviceTerm}
                  onChange={(e) => setForm({ ...form, serviceTerm: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Bank Receipt Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Metode Pembayaran
              </label>
              <input
                type="text"
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bank Pengirim (Bank Source)
              </label>
              <input
                type="text"
                value={form.bankSource}
                onChange={(e) => setForm({ ...form, bankSource: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bank Penerima (Bank Benef)
              </label>
              <input
                type="text"
                value={form.bankBenef}
                onChange={(e) => setForm({ ...form, bankBenef: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200 block">
              Rincian Layanan yang Dibayarkan
            </span>

            <div className="space-y-2">
              {(form.items || []).map((it, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs items-center"
                >
                  <input
                    type="text"
                    placeholder="INV Ref"
                    value={it.productNumber}
                    onChange={(e) => updateItem(idx, 'productNumber', e.target.value)}
                    className="px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Deskripsi"
                    value={it.description}
                    onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    className="sm:col-span-2 px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white">
                      {formatRupiah((it.qty || 1) * (it.unitPrice || 0))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-lunas notification banner */}
          {form.invoiceId && form.status === 'Paid Off' && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>
                <strong>Aturan Bisnis Aktif:</strong> Invoice terkait ({form.invoiceId}) akan otomatis ditandai status <strong>Lunas</strong> setelah konfirmasi pembayaran ini disimpan.
              </span>
            </div>
          )}

          {/* Totals */}
          <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-4 flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">Total Dana Pembayaran Diterima:</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {formatRupiah(totals.grand)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-700 bg-[#0F172A]">
          <div className="flex items-center gap-2">
            {savedRecord && onPrintPreview && (
              <button
                type="button"
                onClick={() => onPrintPreview(savedRecord)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                <Printer size={14} />
                <span>Print / Preview Bukti Bayar</span>
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
              Simpan Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
