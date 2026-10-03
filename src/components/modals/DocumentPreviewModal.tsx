import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { Quotation, Invoice, PaymentConfirmation, Estimasi, Client } from '../../types';
import {
  COMPANY_INFO,
  formatRupiah,
  formatDate,
  computeDocumentTotals,
} from '../../utils/formatters';

interface DocumentPreviewModalProps {
  type: 'quotation' | 'invoice' | 'payment' | 'estimasi';
  data: Quotation | Invoice | PaymentConfirmation | Estimasi;
  client?: Client;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  type,
  data,
  client,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const clientName = client ? (client.company || client.name) : '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#1E293B] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-[#0F172A] print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Preview Dokumen Resmi
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({type.toUpperCase()})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>Cetak / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable White Sheet Document View */}
        <div className="p-6 sm:p-10 bg-white text-slate-900 max-h-[85vh] overflow-y-auto print:max-h-none print:p-0 print:m-0 print:overflow-visible font-sans text-xs">
          {/* Header Brand */}
          <div className="flex justify-between items-start pb-6 border-b border-slate-300">
            <div>
              <div className="text-2xl font-black tracking-tight">
                <span>obee</span>
                <span className="text-[#E30000]">creatives</span>
                <span className="text-xs font-normal text-slate-500 ml-2">visual maker</span>
              </div>
              <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                <div>{COMPANY_INFO.addressLine1}</div>
                <div>{COMPANY_INFO.addressLine2}, {COMPANY_INFO.addressLine3}</div>
                <div>{COMPANY_INFO.website}</div>
              </div>
            </div>

            {/* Document Meta Info */}
            <div className="text-right text-[11px] space-y-1">
              <div className="text-base font-black uppercase text-[#E30000]">
                {type === 'quotation' && 'QUOTATION'}
                {type === 'invoice' && 'INVOICE'}
                {type === 'payment' && 'PAYMENT CONFIRMATION'}
                {type === 'estimasi' && 'ESTIMASI BIAYA (RAB)'}
              </div>
              {type === 'quotation' && (
                <>
                  <div><strong>No:</strong> {(data as Quotation).quotationNumber}</div>
                  <div><strong>Tanggal:</strong> {formatDate((data as Quotation).quotationDate)}</div>
                  <div><strong>Terms:</strong> {(data as Quotation).paymentTerms}</div>
                  <div><strong>Periode:</strong> {(data as Quotation).servicePeriod}</div>
                </>
              )}
              {type === 'invoice' && (
                <>
                  <div><strong>No:</strong> {(data as Invoice).invoiceNumber}</div>
                  <div><strong>Tanggal:</strong> {formatDate((data as Invoice).invoiceDate)}</div>
                  <div><strong>Terms:</strong> {(data as Invoice).paymentTerms}</div>
                  <div><strong>Status:</strong> <span className="font-bold">{(data as Invoice).status}</span></div>
                </>
              )}
              {type === 'payment' && (
                <>
                  <div><strong>No:</strong> {(data as PaymentConfirmation).confirmationNumber}</div>
                  <div><strong>Tanggal:</strong> {formatDate((data as PaymentConfirmation).paymentDate)}</div>
                  <div><strong>Metode:</strong> {(data as PaymentConfirmation).paymentMethod}</div>
                  <div><strong>Status:</strong> <span className="text-emerald-700 font-bold">{(data as PaymentConfirmation).status}</span></div>
                </>
              )}
              {type === 'estimasi' && (
                <>
                  <div><strong>Kode:</strong> {(data as Estimasi).id}</div>
                  <div><strong>Tanggal:</strong> {formatDate((data as Estimasi).createdAt)}</div>
                  <div><strong>Jadwal:</strong> {(data as Estimasi).jadwal || '-'}</div>
                </>
              )}
            </div>
          </div>

          {/* Destination / Client Block */}
          <div className="py-4 border-b border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {type === 'quotation' ? 'Propose To' : type === 'invoice' ? 'Bill To' : type === 'payment' ? 'Confirmation To' : 'Klien'}
            </div>
            <div className="font-bold text-sm text-slate-900">
              {type === 'quotation' && ((data as Quotation).proposeToName || clientName)}
              {type === 'invoice' && ((data as Invoice).billToName || clientName)}
              {type === 'payment' && ((data as PaymentConfirmation).confirmToName || clientName)}
              {type === 'estimasi' && clientName}
            </div>
            {type === 'invoice' && (data as Invoice).billToAddress && (
              <div className="text-slate-600 text-[11px]">{(data as Invoice).billToAddress}</div>
            )}
            {type === 'quotation' && (data as Quotation).proposeToAttn && (
              <div className="text-slate-600 text-[11px]">Up: {(data as Quotation).proposeToAttn}</div>
            )}
            {type === 'estimasi' && (
              <div className="text-slate-700 font-semibold mt-1">
                Jasa: {(data as Estimasi).jenisJasa}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] uppercase font-mono">
                  <th className="py-2 px-3">Item / Layanan</th>
                  {type === 'estimasi' ? (
                    <>
                      <th className="py-2 px-3">Kategori</th>
                      <th className="py-2 px-3 text-right">Harga</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2 px-3">Deskripsi</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Harga Satuan</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {type === 'estimasi' ? (
                  (data as Estimasi).items.map((it, idx) => (
                    <tr key={idx} className="text-[11px]">
                      <td className="py-2 px-3 font-semibold text-slate-900">{it.nama}</td>
                      <td className="py-2 px-3 text-slate-600">{it.kategori}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatRupiah(it.hargaSatuan)}</td>
                      <td className="py-2 px-3 text-center font-mono">{it.qty}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">{formatRupiah(it.qty * it.hargaSatuan)}</td>
                    </tr>
                  ))
                ) : (
                  ((data as Quotation | Invoice | PaymentConfirmation).items || []).map((it, idx) => (
                    <tr key={idx} className="text-[11px]">
                      <td className="py-2 px-3 font-semibold text-slate-900">{it.productNumber || '-'}</td>
                      <td className="py-2 px-3 text-slate-700 whitespace-pre-line">{it.description}</td>
                      <td className="py-2 px-3 text-center font-mono">{it.qty} {it.unit}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatRupiah(it.unitPrice)}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">
                        {formatRupiah((it.qty || 1) * (it.unitPrice || 0))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Calculations / Summary */}
          <div className="flex justify-end pt-2 pb-6 border-b border-slate-200">
            <div className="w-64 space-y-1.5 text-[11px]">
              {type === 'estimasi' ? (
                <>
                  <div className="flex justify-between">
                    <span>Skillset / Overhead:</span>
                    <span className="font-mono font-semibold">{formatRupiah((data as Estimasi).skillset)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Biaya Produksi:</span>
                    <span className="font-mono">{formatRupiah((data as Estimasi).totalBiaya)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Anggaran:</span>
                    <span className="font-mono">{formatRupiah((data as Estimasi).anggaran)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Laba Kotor:</span>
                    <span className="font-mono">{formatRupiah((data as Estimasi).labaKotor)}</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Infaq (2.5%):</span>
                    <span className="font-mono">-{formatRupiah((data as Estimasi).infaq)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-300 pt-1 text-xs">
                    <span>Laba Bersih:</span>
                    <span className="font-mono">{formatRupiah((data as Estimasi).labaBersih)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 text-[10px]">
                    <span>Alokasi Saham (10%):</span>
                    <span className="font-mono">{formatRupiah((data as Estimasi).saham)}</span>
                  </div>
                </>
              ) : (
                (() => {
                  const doc = data as Quotation | Invoice | PaymentConfirmation;
                  const totals = computeDocumentTotals(doc.items, doc.discount);
                  return (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>Net Amount:</span>
                        <span className="font-mono font-semibold">{formatRupiah(totals.net)}</span>
                      </div>
                      {totals.tax > 0 && (
                        <div className="flex justify-between text-slate-600">
                          <span>Taxes:</span>
                          <span className="font-mono font-semibold">{formatRupiah(totals.tax)}</span>
                        </div>
                      )}
                      {totals.discount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount:</span>
                          <span className="font-mono font-semibold">-{formatRupiah(totals.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-black border-t-2 border-slate-900 pt-1.5 text-slate-900">
                        <span>Grand Total:</span>
                        <span className="font-mono text-[#E30000]">{formatRupiah(totals.grand)}</span>
                      </div>
                    </>
                  );
                })()
              )}
            </div>
          </div>

          {/* Payment receipt bank block */}
          {type === 'payment' && (
            <div className="py-3 bg-slate-50 p-3 rounded-lg border border-slate-200 my-4 text-[11px] space-y-1">
              <div className="font-bold text-slate-800 uppercase text-[10px]">Payment Receipt Verification</div>
              <div>Bank Source: <strong>{(data as PaymentConfirmation).bankSource}</strong></div>
              <div>Bank Beneficiary: <strong>{(data as PaymentConfirmation).bankBenef}</strong></div>
            </div>
          )}

          {/* Bank Account Information */}
          <div className="grid grid-cols-2 gap-4 pt-6 text-[11px]">
            <div>
              <div className="font-bold text-slate-800 uppercase text-[10px] mb-1">
                Informasi Rekening Resmi
              </div>
              <div className="text-slate-700">
                <div><strong>Bank:</strong> {COMPANY_INFO.bankName}</div>
                <div><strong>No. Rekening:</strong> {COMPANY_INFO.bankAccount}</div>
                <div><strong>Atas Nama:</strong> {COMPANY_INFO.bankHolder}</div>
              </div>

              {data.notes && (
                <div className="mt-3 text-[10px] text-slate-500 italic">
                  *Catatan: {data.notes}
                </div>
              )}
            </div>

            {/* Signature Block */}
            <div className="text-center flex flex-col justify-end items-center">
              <div className="text-slate-600 mb-12">
                Hormat kami,<br />
                <strong className="text-slate-900">obeecreatives visual maker</strong>
              </div>
              <div className="border-t border-slate-400 w-44 pt-1 font-bold text-slate-900">
                {COMPANY_INFO.signatureName}
              </div>
              <div className="text-[10px] text-slate-500">Finance & Operational</div>
            </div>
          </div>

          <div className="mt-8 text-center text-[9px] text-slate-400 print:text-[8px] pt-4 border-t border-slate-200">
            Dokumen sah diterbitkan secara digital oleh Unified Workspace OS · obeecreatives
          </div>
        </div>
      </div>
    </div>
  );
};
