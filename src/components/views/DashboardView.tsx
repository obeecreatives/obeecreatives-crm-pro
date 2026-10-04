import React, { useState } from 'react';
import {
  Users,
  Kanban,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  CalendarDays,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Calculator,
  AlertCircle,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import {
  Client,
  Lead,
  Meeting,
  Invoice,
  PaymentConfirmation,
  Quotation,
  Estimasi,
} from '../../types';
import {
  formatRupiah,
  formatDate,
  computeDocumentTotals,
  todayIso,
  sanitizeWhatsAppPhone,
} from '../../utils/formatters';

interface DashboardViewProps {
  clients: Client[];
  leads: Lead[];
  meetings: Meeting[];
  invoices: Invoice[];
  payments: PaymentConfirmation[];
  quotations: Quotation[];
  estimasiList: Estimasi[];
  onNavigateTab: (tab: string) => void;
  onOpenClient: (client: Client) => void;
  onNewClient: () => void;
  onNewMeeting: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  clients,
  leads,
  meetings,
  invoices,
  payments,
  quotations,
  estimasiList,
  onNavigateTab,
  onOpenClient,
  onNewClient,
  onNewMeeting,
}) => {
  const [clientCategoryTab, setClientCategoryTab] = useState<'all' | 'smm' | 'other'>('all');

  const safeClients = Array.isArray(clients) ? clients : [];
  const safeLeads = Array.isArray(leads) ? leads : [];
  const safeMeetings = Array.isArray(meetings) ? meetings : [];
  const safeInvoices = Array.isArray(invoices) ? invoices : [];
  const safePayments = Array.isArray(payments) ? payments : [];
  const safeQuotations = Array.isArray(quotations) ? quotations : [];
  const safeEstimasi = Array.isArray(estimasiList) ? estimasiList : [];

  // Clients categorization
  const smmClients = safeClients.filter(
    (c) => c && String(c.division || '').toLowerCase().includes('social media')
  );
  const otherClients = safeClients.filter(
    (c) => c && !String(c.division || '').toLowerCase().includes('social media')
  );

  const displayedClients =
    clientCategoryTab === 'smm'
      ? smmClients
      : clientCategoryTab === 'other'
      ? otherClients
      : safeClients;

  // Pipeline Leads calculations
  const openLeads = safeLeads.filter((l) => l && l.stage !== 'Deal' && l.stage !== 'Lost');
  const openPipelineValue = openLeads.reduce((acc, l) => acc + (Number(l.value) || 0), 0);
  const dealLeads = safeLeads.filter((l) => l && l.stage === 'Deal');
  const dealLeadsValue = dealLeads.reduce((acc, l) => acc + (Number(l.value) || 0), 0);

  // Invoices deduplication (remove ghost/duplicate empty invoice lines)
  const uniqueInvoices = safeInvoices.reduce<Invoice[]>((acc, inv) => {
    if (!inv) return acc;
    const invNum = String(inv.invoiceNumber || '').trim();
    const existingIdx = acc.findIndex((x) => String(x.invoiceNumber || '').trim() === invNum);
    if (existingIdx === -1) {
      acc.push(inv);
    } else {
      const existingItemsTotal = (acc[existingIdx].items || []).reduce(
        (sum, it) => sum + (Number(it.unitPrice) || 0),
        0
      );
      const newItemsTotal = (inv.items || []).reduce(
        (sum, it) => sum + (Number(it.unitPrice) || 0),
        0
      );
      if (existingItemsTotal === 0 && newItemsTotal > 0) {
        acc[existingIdx] = inv;
      }
    }
    return acc;
  }, []);

  const unpaidInvoices = uniqueInvoices.filter((i) => i && i.status === 'Belum Dibayar');
  const unpaidInvoiceTotal = unpaidInvoices.reduce((acc, i) => {
    return acc + computeDocumentTotals(Array.isArray(i.items) ? i.items : [], i.discount).grand;
  }, 0);

  const paidInvoices = uniqueInvoices.filter((i) => i && i.status === 'Lunas');
  const paidInvoiceTotal = paidInvoices.reduce((acc, i) => {
    return acc + computeDocumentTotals(Array.isArray(i.items) ? i.items : [], i.discount).grand;
  }, 0);

  // Payments calculations
  const paidPayments = safePayments.filter((p) => p && p.status === 'Paid Off');
  const totalPaymentsReceived = paidPayments.reduce(
    (acc, p) => acc + computeDocumentTotals(Array.isArray(p.items) ? p.items : [], p.discount).grand,
    0
  );

  // Estimasi Biaya calculations
  const draftEstimasi = safeEstimasi.filter((e) => e && e.status === 'Draft');
  const totalEstimasiAnggaran = draftEstimasi.reduce((acc, e) => acc + (Number(e.anggaran) || 0), 0);
  const totalEstimasiBiaya = draftEstimasi.reduce((acc, e) => acc + (Number(e.totalBiaya) || 0), 0);
  const totalEstimasiLaba = draftEstimasi.reduce((acc, e) => acc + (Number(e.labaBersih) || 0), 0);

  // Quotations calculations
  const pendingQuotations = safeQuotations.filter(
    (q) => q && (q.status === 'Draft' || q.status === 'Terkirim')
  );
  const pendingQuotationValue = pendingQuotations.reduce((acc, q) => {
    return acc + computeDocumentTotals(Array.isArray(q.items) ? q.items : [], q.discount).grand;
  }, 0);

  // Closed deal display logic (shows won leads if any, or verified paid invoices)
  const dealClosedDisplayValue = dealLeadsValue > 0 ? dealLeadsValue : paidInvoiceTotal;
  const dealClosedSubtext =
    dealLeads.length > 0
      ? `${dealLeads.length} Prospek Deal Closing`
      : `${paidInvoices.length} Faktur Lunas Terverifikasi`;

  // Meetings: show all scheduled meetings or recent agendas (avoid falsely blanking out)
  const today = todayIso();
  const activeMeetings = [...safeMeetings]
    .filter((m) => m && (m.status === 'Terjadwal' || !m.status))
    .sort((a, b) => String(b.meetingDate || '').localeCompare(String(a.meetingDate || '')))
    .slice(0, 5);

  const displayedMeetings =
    activeMeetings.length > 0
      ? activeMeetings
      : [...safeMeetings]
          .sort((a, b) => String(b.meetingDate || '').localeCompare(String(a.meetingDate || '')))
          .slice(0, 5);

  const kpis = [
    {
      label: 'Total Klien Terdaftar',
      value: safeClients.length.toString(),
      subtext: `${smmClients.length} SMM · ${otherClients.length} Non-SMM`,
      icon: Users,
      color: 'text-[#EF4444]',
      bg: 'bg-red-500/10',
      tab: 'clients',
    },
    {
      label: 'Nilai Pipeline Leads',
      value: formatRupiah(openPipelineValue),
      subtext: `${openLeads.length} Prospek aktif dalam proses`,
      icon: Kanban,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      tab: 'pipeline',
    },
    {
      label: 'Total Deal Closed / Omset',
      value: formatRupiah(dealClosedDisplayValue),
      subtext: dealClosedSubtext,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      tab: dealLeads.length > 0 ? 'pipeline' : 'invoices',
    },
    {
      label: pendingQuotations.length > 0 ? 'Quotation Menunggu' : 'Estimasi Biaya Draft',
      value:
        pendingQuotations.length > 0
          ? formatRupiah(pendingQuotationValue)
          : formatRupiah(totalEstimasiAnggaran),
      subtext:
        pendingQuotations.length > 0
          ? `${pendingQuotations.length} penawaran diajukan`
          : `${draftEstimasi.length} Estimasi siap diajukan (Laba ${formatRupiah(totalEstimasiLaba)})`,
      icon: pendingQuotations.length > 0 ? FileSpreadsheet : Calculator,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      tab: pendingQuotations.length > 0 ? 'quotations' : 'estimasi',
    },
    {
      label: 'Piutang Belum Dibayar',
      value: formatRupiah(unpaidInvoiceTotal),
      subtext: `${unpaidInvoices.length} tagihan belum lunas (${unpaidInvoices[0]?.invoiceNumber || 'Invoice Aktif'})`,
      icon: Receipt,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      tab: 'invoices',
    },
    {
      label: 'Dana Masuk (Paid Off)',
      value: formatRupiah(totalPaymentsReceived),
      subtext: `${paidPayments.length} Pembayaran kas terverifikasi`,
      icon: CreditCard,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      tab: 'payments',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              onClick={() => onNavigateTab(kpi.tab)}
              className="bg-[#1E293B] border border-[#1E293B] hover:border-slate-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    {kpi.label}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 font-mono">
                    {kpi.value}
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="truncate">{kpi.subtext}</span>
                <span className="flex items-center gap-0.5 text-slate-400 group-hover:text-white transition-colors">
                  Buka <ArrowUpRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main 2-Column Split: Meetings & Client Hub Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Agenda Meeting & Follow-up */}
        <div className="bg-[#1E293B] border border-[#1E293B] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <CalendarDays size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Agenda Meeting & Jadwal</h3>
                <span className="text-[11px] text-slate-400">
                  {safeMeetings.length} agenda tersinkron dari Google Sheets
                </span>
              </div>
            </div>
            <button
              onClick={onNewMeeting}
              className="text-xs font-bold text-[#DC2626] hover:text-red-400 flex items-center gap-1 cursor-pointer"
            >
              + Jadwal Baru
            </button>
          </div>

          {displayedMeetings.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
              Tidak ada agenda meeting yang tersimpan.
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayedMeetings.map((m) => {
                const client = safeClients.find((c) => c && c.id === m.clientId);
                const isPast = String(m.meetingDate || '') < today;
                return (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{m.title}</span>
                        <span className="text-[10px] font-mono bg-blue-950/60 text-blue-300 border border-blue-900/40 px-1.5 py-0.2 rounded">
                          {m.meetingType || 'Meeting'}
                        </span>
                        {isPast ? (
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-900/40 px-1.5 py-0.2 rounded">
                            Perlu Follow-up
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-1.5 py-0.2 rounded">
                            Terjadwal
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Building2 size={12} className="text-slate-400" />
                        <span className="font-semibold text-slate-300">
                          {client ? client.company || client.name : 'Internal Agenda'}
                        </span>
                        {m.location && (
                          <>
                            <span>·</span>
                            <span className="truncate max-w-[180px]">{m.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-amber-400 font-mono">
                        {formatDate(m.meetingDate)}
                      </div>
                      {m.startTime && (
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 justify-end">
                          <Clock size={10} />
                          <span>
                            {m.startTime} - {m.endTime || 'selesai'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-2 text-right">
            <button
              onClick={() => onNavigateTab('meetings')}
              className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Lihat Seluruh Agenda ({safeMeetings.length}) →
            </button>
          </div>
        </div>

        {/* Right: Direktori Klien Hub (Filterable Spotlight) */}
        <div className="bg-[#1E293B] border border-[#1E293B] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-500/10 text-[#DC2626]">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Direktori Klien</h3>
                <span className="text-[11px] text-slate-400">
                  {safeClients.length} Klien aktif terhubung
                </span>
              </div>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setClientCategoryTab('all')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  clientCategoryTab === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua ({safeClients.length})
              </button>
              <button
                onClick={() => setClientCategoryTab('smm')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  clientCategoryTab === 'smm'
                    ? 'bg-red-950 text-red-300 font-bold border border-red-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SMM ({smmClients.length})
              </button>
              <button
                onClick={() => setClientCategoryTab('other')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  clientCategoryTab === 'other'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Lainnya ({otherClients.length})
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {displayedClients.slice(0, 5).map((c) => (
              <div
                key={c.id}
                onClick={() => onOpenClient(c)}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-red-900/40 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-900/40 text-red-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    {(c.company || c.name || 'KL').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      {c.company || c.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      PIC: {c.name || 'PIC Klien'}{' '}
                      {c.phone ? `· WA: ${sanitizeWhatsAppPhone(c.phone)}` : ''}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      String(c.division || '').toLowerCase().includes('social media')
                        ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/40'
                        : 'text-blue-400 bg-blue-950/40 border-blue-900/40'
                    }`}
                  >
                    {c.division || 'Umum'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={onNewClient}
              className="text-xs font-semibold text-[#DC2626] hover:text-red-400 cursor-pointer"
            >
              + Tambah Klien
            </button>
            <button
              onClick={() => onNavigateTab('clients')}
              className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Buka Direktori Klien Hub ({safeClients.length}) →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Ringkasan Estimasi Biaya Produksi (Google Sheets Estimasi Hub) */}
      <div className="bg-[#1E293B] border border-[#1E293B] p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Calculator size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ringkasan Estimasi Biaya Produksi</h3>
              <span className="text-[11px] text-slate-400">
                {safeEstimasi.length} formulir estimasi tersinkron dari Google Sheets
              </span>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Total Anggaran:</span>
              <span className="font-bold text-white font-mono">{formatRupiah(totalEstimasiAnggaran)}</span>
            </div>
            <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Total Biaya:</span>
              <span className="font-bold text-amber-400 font-mono">{formatRupiah(totalEstimasiBiaya)}</span>
            </div>
            <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Proyeksi Laba:</span>
              <span className="font-bold text-emerald-400 font-mono">{formatRupiah(totalEstimasiLaba)}</span>
            </div>
          </div>
        </div>

        {safeEstimasi.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
            Belum ada data Estimasi Biaya yang ditarik.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {safeEstimasi.slice(0, 6).map((est) => {
              const client = safeClients.find((c) => c && c.id === est.clientId);
              return (
                <div
                  key={est.id}
                  onClick={() => onNavigateTab('estimasi')}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-900/50 cursor-pointer transition-colors flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        {est.jenisJasa || 'Jasa Kreatif'}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building2 size={11} />
                        <span className="truncate max-w-[150px]">
                          {client ? client.company || client.name : 'Klien'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 border border-purple-900/30">
                      {est.status || 'Draft'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 text-[10px]">Anggaran:</span>
                    <span className="font-bold text-white">{formatRupiah(est.anggaran)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2 text-right">
          <button
            onClick={() => onNavigateTab('estimasi')}
            className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
          >
            Lihat Seluruh Estimasi Biaya ({safeEstimasi.length}) →
          </button>
        </div>
      </div>
    </div>
  );
};
