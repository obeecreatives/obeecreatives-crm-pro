import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Copy,
  Check,
  Phone,
  MessageSquare,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileSpreadsheet,
  Receipt,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { Invoice, Quotation, Meeting, PaymentConfirmation, Client } from '../../types';
import {
  COMPANY_INFO,
  formatRupiah,
  formatDate,
  computeDocumentTotals,
  sanitizeWhatsAppPhone,
} from '../../utils/formatters';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'invoice' | 'quotation' | 'meeting' | 'payment';
  data: Invoice | Quotation | Meeting | PaymentConfirmation | null;
  client?: Client;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  type,
  data,
  client,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate initial message template based on document type
  useEffect(() => {
    if (!data) return;

    const initialPhone = sanitizeWhatsAppPhone(
      client?.phone ||
      (type === 'invoice' ? (data as Invoice).poNumber : '') ||
      ''
    );
    setPhoneNumber(initialPhone);

    const clientName = client ? (client.company || client.name) : 'Bpk/Ibu';

    if (type === 'invoice') {
      const inv = data as Invoice;
      const totals = computeDocumentTotals(inv.items, inv.discount);
      const isUnpaid = inv.status === 'Belum Dibayar';

      const text = `Halo *${clientName}*,
Salam hormat dari *${COMPANY_INFO.name}*.

${isUnpaid ? 'Berikut kami sampaikan pengingat tagihan resmi (*Invoice*) untuk periode layanan *' + (inv.servicePeriod || '-') + '*:' : 'Berikut kami sampaikan tagihan resmi (*Invoice*) untuk periode *' + (inv.servicePeriod || '-') + '*:'}

📄 *No. Invoice:* ${inv.invoiceNumber}
🗓 *Tanggal:* ${formatDate(inv.invoiceDate)}
💼 *Terms:* ${inv.paymentTerms || 'Cash / Transfer'}
💰 *Total Tagihan:* *${formatRupiah(totals.grand)}*
📌 *Status:* ${inv.status}

Pembayaran dapat ditransfer melalui rekening resmi kami:
🏦 *Bank ${COMPANY_INFO.bankName}*
💳 *No. Rekening:* ${COMPANY_INFO.bankAccount}
👤 *a/c:* ${COMPANY_INFO.bankHolder}

Mohon konfirmasikan bukti transfer setelah melakukan pembayaran. Terima kasih atas kerja sama dan kepercayaannya! 🙏

--
*${COMPANY_INFO.name}*
${COMPANY_INFO.website}`;
      setMessage(text);
    } else if (type === 'quotation') {
      const q = data as Quotation;
      const totals = computeDocumentTotals(q.items, q.discount);

      const text = `Halo *${clientName}*,
Salam hangat dari *${COMPANY_INFO.name}*.

Terima kasih atas kepercayaannya. Kami telah menyusun Surat Penawaran Resmi (*Quotation*) untuk proyek Anda:

📄 *No. Quotation:* ${q.quotationNumber}
🗓 *Tanggal:* ${formatDate(q.quotationDate)}
💼 *Periode Layanan:* ${q.servicePeriod || '-'}
💰 *Nilai Investasi:* *${formatRupiah(totals.grand)}*
📌 *Status:* ${q.status}

Silakan ditinjau proposal penawaran tersebut. Jika ada pertanyaan atau penyesuaian ruang lingkup kerja, kami siap mendiskusikannya lebih lanjut. 

Terima kasih! 🙏

--
*${COMPANY_INFO.name}*
${COMPANY_INFO.website}`;
      setMessage(text);
    } else if (type === 'meeting') {
      const m = data as Meeting;

      const text = `Halo *${clientName}* / Tim Rekan Kerja,
Salam hangat dari *${COMPANY_INFO.name}*.

Berikut pengingat jadwal koordinasi & agenda kerja kita:

📌 *Agenda:* *${m.title}*
🗓 *Tanggal:* ${formatDate(m.meetingDate)}
⏰ *Waktu:* ${m.startTime} - ${m.endTime} WIB
📍 *Lokasi:* ${m.location || '-'}
👥 *Peserta:* ${m.attendees || '-'}
${m.notes ? '📝 *Catatan:* ' + m.notes : ''}

Mohon konfirmasi kehadirannya. Sampai bertemu di sesi meeting! 🙏

--
*${COMPANY_INFO.name}*`;
      setMessage(text);
    } else if (type === 'payment') {
      const pay = data as PaymentConfirmation;
      const totals = computeDocumentTotals(pay.items, pay.discount);

      const text = `Halo *${clientName}*,
Salam hormat dari *${COMPANY_INFO.name}*.

Kami mengonfirmasi bahwa pembayaran Anda telah *KAMI TERIMA & DIVERIFIKASI LUNAS*:

🧾 *No. Bukti:* ${pay.confirmationNumber}
🗓 *Tanggal Transaksi:* ${formatDate(pay.paymentDate)}
💰 *Nominal Diterima:* *${formatRupiah(totals.grand)}*
🏦 *Metode Pembayaran:* ${pay.paymentMethod || 'Bank Transfer'}
✅ *Status:* LUNAS (Verified)

Terima kasih banyak atas pembayaran dan kemitraan luar biasa yang terjalin. Sukses selalu untuk bisnis Anda! 🙏

--
*${COMPANY_INFO.name}*
${COMPANY_INFO.website}`;
      setMessage(text);
    }
  }, [data, type, client]);

  if (!isOpen || !data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = sanitizeWhatsAppPhone(phoneNumber);
    const encoded = encodeURIComponent(message);
    const targetUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const typeConfig = {
    invoice: { title: 'Kirim Invoice via WhatsApp', icon: Receipt, color: 'text-amber-400' },
    quotation: { title: 'Kirim Quotation via WhatsApp', icon: FileSpreadsheet, color: 'text-blue-400' },
    meeting: { title: 'Kirim Pengingat Meeting via WhatsApp', icon: Calendar, color: 'text-emerald-400' },
    payment: { title: 'Kirim Konfirmasi Lunas via WhatsApp', icon: CreditCard, color: 'text-green-400' },
  }[type];

  const IconComp = typeConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#1E293B] border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 bg-[#0F172A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{typeConfig.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 font-mono">
                  1-Click Direct
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Pesan WhatsApp otomatis siap kirim dengan format terstruktur rapi.
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

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Phone Number Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone size={13} className="text-emerald-400" />
                Nomor WhatsApp Penerima (Klien / PIC)
              </span>
              {client?.phone && (
                <span className="text-[10px] text-slate-400">
                  Dari Profil: <strong className="text-slate-200 font-mono">{client.phone}</strong>
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Contoh: 08123456789 atau 628123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-slate-400">
                Auto Format Indonesia (62)
              </span>
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                Draft Pesan WhatsApp (Bisa Diedit)
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>
            <textarea
              rows={11}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-sans leading-relaxed focus:outline-none focus:border-emerald-500 resize-none"
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span>Mendukung format WhatsApp (*tebal*, _miring_)</span>
              <span>{message.length} karakter</span>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              Tombol di bawah akan langsung membuka <strong className="text-white">WhatsApp Web</strong> di PC/Laptop atau <strong className="text-white">Aplikasi WhatsApp</strong> di smartphone Anda secara mulus.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-700 bg-[#0F172A]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Tersalin' : 'Salin Pesan'}</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Send size={14} />
              <span>Buka & Kirim WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
