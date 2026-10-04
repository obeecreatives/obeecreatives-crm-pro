import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  Users,
  Calculator,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Clock,
  Sparkles,
  PieChart,
  Shield,
  FileDown,
} from 'lucide-react';
import { Client, Invoice, PaymentConfirmation, Estimasi, Lead, Meeting } from '../../types';
import {
  formatRupiah,
  formatDate,
  computeDocumentTotals,
  DIVISIONS,
} from '../../utils/formatters';
import { FUTURE_FEATURES_ROADMAP } from '../../data/featureRoadmap';

interface ReportsViewProps {
  clients: Client[];
  invoices: Invoice[];
  payments: PaymentConfirmation[];
  estimasiList: Estimasi[];
  leads: Lead[];
  meetings: Meeting[];
  onSelectTab: (tab: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  clients,
  invoices,
  payments,
  estimasiList,
  leads,
  meetings,
  onSelectTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'financial' | 'divisions' | 'export' | 'roadmap'>('financial');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // --- Financial Calculations ---
  // Clean deduplicated invoices
  const safeInvoices = (invoices || []).reduce<Invoice[]>((acc, inv) => {
    if (!inv) return acc;
    const invNum = String(inv.invoiceNumber || '').trim();
    const existingIdx = acc.findIndex((x) => String(x.invoiceNumber || '').trim() === invNum && invNum !== '');
    if (existingIdx >= 0) {
      if ((inv.items || []).length > (acc[existingIdx].items || []).length) {
        acc[existingIdx] = inv;
      }
    } else {
      acc.push(inv);
    }
    return acc;
  }, []);

  const totalInvoicedValue = safeInvoices.reduce((sum, inv) => {
    return sum + computeDocumentTotals(inv.items, inv.discount).grand;
  }, 0);

  const unpaidInvoices = safeInvoices.filter((i) => i.status === 'Belum Dibayar');
  const unpaidTotal = unpaidInvoices.reduce((sum, inv) => {
    return sum + computeDocumentTotals(inv.items, inv.discount).grand;
  }, 0);

  const paidInvoices = safeInvoices.filter((i) => i.status === 'Lunas');
  const paidInvoiceTotal = paidInvoices.reduce((sum, inv) => {
    return sum + computeDocumentTotals(inv.items, inv.discount).grand;
  }, 0);

  const totalPaymentsReceived = (payments || []).reduce((sum, p) => {
    return sum + computeDocumentTotals(p.items, p.discount).grand;
  }, 0);

  const dealLeads = (leads || []).filter((l) => l.stage === 'Deal');
  const dealLeadsTotal = dealLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);

  // Estimasi Profit, Infaq, Saham
  const totalEstimasiAnggaran = (estimasiList || []).reduce((sum, e) => sum + (Number(e.anggaran) || 0), 0);
  const totalEstimasiBiaya = (estimasiList || []).reduce((sum, e) => sum + (Number(e.totalBiaya) || 0), 0);
  const totalEstimasiLabaKotor = (estimasiList || []).reduce((sum, e) => sum + (Number(e.labaKotor) || 0), 0);
  const totalInfaq = (estimasiList || []).reduce((sum, e) => sum + (Number(e.infaq) || 0), 0);
  const totalSaham = (estimasiList || []).reduce((sum, e) => sum + (Number(e.saham) || 0), 0);
  const totalEstimasiLabaBersih = (estimasiList || []).reduce((sum, e) => sum + (Number(e.labaBersih) || 0), 0);

  // Division Breakdown
  const divisionStats = DIVISIONS.map((div) => {
    const divClients = (clients || []).filter((c) => String(c.division || '').toLowerCase().includes(div.toLowerCase()));
    const divLeads = (leads || []).filter((l) => String(l.division || '').toLowerCase().includes(div.toLowerCase()));
    const divDealTotal = divLeads.filter((l) => l.stage === 'Deal').reduce((s, l) => s + (Number(l.value) || 0), 0);

    return {
      name: div,
      clientCount: divClients.length,
      leadCount: divLeads.length,
      dealValue: divDealTotal,
    };
  });

  // --- CSV Export Helpers ---
  const downloadCsv = (filename: string, rows: string[][]) => {
    const csvContent =
      '\uFEFF' +
      rows
        .map((r) =>
          r
            .map((field) => {
              const str = String(field ?? '').replace(/"/g, '""');
              return `"${str}"`;
            })
            .join(',')
        )
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(`Berhasil mengekspor ${filename}.csv`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleExportInvoices = () => {
    const rows: string[][] = [
      ['No. Invoice', 'Tanggal', 'Klien', 'Periode', 'Terms', 'Jumlah Item', 'Grand Total (Rp)', 'Status', 'Catatan'],
    ];
    safeInvoices.forEach((inv) => {
      const totals = computeDocumentTotals(inv.items, inv.discount);
      const client = clients.find((c) => c.id === inv.clientId);
      rows.push([
        inv.invoiceNumber,
        inv.invoiceDate,
        client?.company || client?.name || inv.billToName || '-',
        inv.servicePeriod || '-',
        inv.paymentTerms || '-',
        String((inv.items || []).length),
        String(totals.grand),
        inv.status,
        inv.notes || '',
      ]);
    });
    downloadCsv('Laporan_Invoices_Obeecreatives', rows);
  };

  const handleExportPayments = () => {
    const rows: string[][] = [
      ['No. Konfirmasi', 'Tanggal Bayar', 'Klien', 'Metode Bayar', 'Bank Pengirim', 'Bank Penerima', 'Nominal Diterima (Rp)', 'Status', 'Catatan'],
    ];
    (payments || []).forEach((p) => {
      const totals = computeDocumentTotals(p.items, p.discount);
      const client = clients.find((c) => c.id === p.clientId);
      rows.push([
        p.confirmationNumber,
        p.paymentDate,
        client?.company || client?.name || p.confirmToName || '-',
        p.paymentMethod || '-',
        p.bankSource || '-',
        p.bankBenef || 'BCA Lalu Mahendra',
        String(totals.grand),
        p.status,
        p.notes || '',
      ]);
    });
    downloadCsv('Laporan_Kas_Masuk_Pembayaran', rows);
  };

  const handleExportEstimasi = () => {
    const rows: string[][] = [
      ['Klien', 'Jenis Jasa / Proyek', 'Jadwal', 'Deadline', 'Anggaran (Rp)', 'Total Biaya (Rp)', 'Laba Kotor (Rp)', 'Infaq 2.5% (Rp)', 'Saham 10% (Rp)', 'Laba Bersih (Rp)', 'Status'],
    ];
    (estimasiList || []).forEach((e) => {
      const client = clients.find((c) => c.id === e.clientId);
      rows.push([
        client?.company || client?.name || '-',
        e.jenisJasa,
        e.jadwal || '-',
        e.deadline || '-',
        String(e.anggaran || 0),
        String(e.totalBiaya || 0),
        String(e.labaKotor || 0),
        String(e.infaq || 0),
        String(e.saham || 0),
        String(e.labaBersih || 0),
        e.status,
      ]);
    });
    downloadCsv('Laporan_Estimasi_RAB_Produksi', rows);
  };

  const handleExportClients = () => {
    const rows: string[][] = [
      ['Nama Perusahaan / Brand', 'Nama PIC', 'Nomor Telepon', 'Email', 'Divisi Layanan', 'Catatan', 'Tanggal Bergabung'],
    ];
    (clients || []).forEach((c) => {
      rows.push([
        c.company || '-',
        c.name || '-',
        c.phone || '-',
        c.email || '-',
        c.division || '-',
        c.notes || '',
        c.createdAt || '-',
      ]);
    });
    downloadCsv('Database_Klien_Obeecreatives', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="text-[#DC2626]" size={20} />
            <span>Laporan & Pusat Ekspor Agensi</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 font-mono">
              Live Verified
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Rekapitulasi keuangan, performa omset per divisi, ekspor file CSV/Excel, dan arsip rencana fitur.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('financial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'financial' ? 'bg-[#DC2626] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ikhtisar Finansial
          </button>
          <button
            onClick={() => setActiveSubTab('divisions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'divisions' ? 'bg-[#DC2626] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Performa Divisi
          </button>
          <button
            onClick={() => setActiveSubTab('export')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeSubTab === 'export' ? 'bg-[#DC2626] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pusat Ekspor Data
          </button>
          <button
            onClick={() => setActiveSubTab('roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'roadmap' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <Clock size={12} />
            <span>Catatan Fitur Mendatang</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Sub-Tab 1: Financial Overview */}
      {activeSubTab === 'financial' && (
        <div className="space-y-6">
          {/* Top 6 KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Omset */}
            <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Total Omset / Realisasi Kas</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {formatRupiah(totalPaymentsReceived || paidInvoiceTotal)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>{paidInvoices.length} Faktur Terverifikasi Lunas</span>
                </div>
              </div>
            </div>

            {/* Total Invoiced */}
            <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Total Tagihan Diterbitkan</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Receipt size={16} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatRupiah(totalInvoicedValue)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Dari total {safeInvoices.length} dokumen tagihan resmi
                </div>
              </div>
            </div>

            {/* Unpaid Receivables */}
            <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">Piutang Belum Dibayar</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <AlertCircle size={16} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {formatRupiah(unpaidTotal)}
                </div>
                <div className="text-[11px] text-amber-300/80 mt-1 flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>{unpaidInvoices.length} Invoice aktif menunggu pembayaran</span>
                </div>
              </div>
            </div>

            {/* Estimasi RAB Anggaran */}
            <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Proyeksi Anggaran RAB</span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Calculator size={16} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-purple-400 font-mono">
                  {formatRupiah(totalEstimasiAnggaran)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Total Biaya Pokok: {formatRupiah(totalEstimasiBiaya)}
                </div>
              </div>
            </div>

            {/* Laba Bersih RAB */}
            <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Proyeksi Laba Bersih</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatRupiah(totalEstimasiLabaBersih)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Margin sehat pasca biaya inventaris & kru
                </div>
              </div>
            </div>

            {/* Infaq & Saham Allocation */}
            <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700/80 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Alokasi Infaq & Saham</span>
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <Shield size={16} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Infaq (2.5%):</span>
                  <span className="font-bold text-amber-400 font-mono">{formatRupiah(totalInfaq)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Saham (10%):</span>
                  <span className="font-bold text-blue-400 font-mono">{formatRupiah(totalSaham)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Export Bar */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#1E293B] border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
                <FileDown size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Butuh Laporan untuk Pembukuan Agensi?</h4>
                <p className="text-xs text-slate-400">
                  Unduh rekaman tagihan, pembayaran kas, dan RAB produksi dalam format Excel / CSV berstandar internasional.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveSubTab('export')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
            >
              <Download size={14} />
              <span>Buka Menu Ekspor CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Division Performance */}
      {activeSubTab === 'divisions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {divisionStats.map((div) => (
              <div
                key={div.name}
                className="bg-[#1E293B] border border-slate-700/80 p-5 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-sm font-bold text-white">{div.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {div.clientCount} Klien
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Prospek Pipeline:</span>
                      <span className="font-semibold text-slate-200">{div.leadCount} Prospek</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Nilai Proyek Deal:</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {formatRupiah(div.dealValue)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTab('clients')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Lihat Klien {div.name}</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Export Center */}
      {activeSubTab === 'export' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            Format CSV yang dihasilkan menggunakan <strong>UTF-8 BOM</strong> sehingga saat dibuka di Microsoft Excel, Google Sheets, atau Apple Numbers langsung menampilkan angka desimal, simbol mata uang, dan teks berbahasa Indonesia tanpa distorsi.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export Invoices */}
            <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                  <Receipt size={18} className="text-amber-400" />
                  <span>Ekspor Laporan Invoices & Tagihan</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Berisi daftar nomor invoice, nama klien, tanggal penerbitan, periode layanan, rincian grand total, dan status lunas / belum dibayar.
                </p>
                <div className="mt-3 text-xs font-mono text-slate-300">
                  Data: {safeInvoices.length} dokumen invoice terdaftar
                </div>
              </div>
              <button
                onClick={handleExportInvoices}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Unduh CSV Invoices</span>
              </button>
            </div>

            {/* Export Payments */}
            <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                  <CreditCard size={18} className="text-emerald-400" />
                  <span>Ekspor Riwayat Kas Masuk (Payments)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Berisi daftar kuitansi pembayaran resmi, bank asal transfer, bank tujuan penerima (BCA Lalu Mahendra), nominal, dan tanggal pelunasan.
                </p>
                <div className="mt-3 text-xs font-mono text-slate-300">
                  Data: {(payments || []).length} transaksi pembayaran
                </div>
              </div>
              <button
                onClick={handleExportPayments}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Unduh CSV Kas Masuk</span>
              </button>
            </div>

            {/* Export Estimasi RAB */}
            <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                  <Calculator size={18} className="text-purple-400" />
                  <span>Ekspor Rekap Estimasi RAB & Profit</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Rincian anggaran produksi jasa, total biaya alat/jasa, kalkulasi infaq 2.5%, saham 10%, dan laba bersih proyek.
                </p>
                <div className="mt-3 text-xs font-mono text-slate-300">
                  Data: {(estimasiList || []).length} dokumen RAB tersimpan
                </div>
              </div>
              <button
                onClick={handleExportEstimasi}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Unduh CSV Estimasi RAB</span>
              </button>
            </div>

            {/* Export Clients Database */}
            <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-700 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                  <Users size={18} className="text-blue-400" />
                  <span>Ekspor Database Klien & Kontak</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Berisi nama perusahaan, nama PIC, nomor WhatsApp, email, dan divisi layanan dari seluruh klien aktif.
                </p>
                <div className="mt-3 text-xs font-mono text-slate-300">
                  Data: {(clients || []).length} kontak klien aktif
                </div>
              </div>
              <button
                onClick={handleExportClients}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Unduh CSV Data Klien</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Future Roadmap & Notes (Standby - Waiting for User Instructions) */}
      {activeSubTab === 'roadmap' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 leading-relaxed flex items-start gap-3">
            <Clock size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">
                Daftar Catatan Fitur Masa Depan (Standby - Menunggu Instruksi Anda)
              </strong>
              Sesuai instruksi Anda, seluruh saran fitur di bawah ini telah dicatat secara terstruktur dan tidak akan dieksekusi secara otomatis sebelum Anda memberikan instruksi spesifik. Kapan pun Anda siap mengeksekusi salah satu atau seluruh fitur ini, Anda tinggal menginstruksikannya.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FUTURE_FEATURES_ROADMAP.map((item) => (
              <div
                key={item.id}
                className="bg-[#1E293B] border border-slate-700/80 p-5 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/40 font-mono whitespace-nowrap">
                      ⏳ Menunggu Instruksi
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="mt-3 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                      Cakupan Teknis:
                    </span>
                    <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                      {item.technicalScope.map((scope, idx) => (
                        <li key={idx}>{scope}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <strong className="text-slate-300">Dampak Bisnis:</strong> {item.estimatedImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
