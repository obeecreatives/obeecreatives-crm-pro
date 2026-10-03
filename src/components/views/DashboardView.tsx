import React from 'react';
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
  AlertCircle,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { Client, Lead, Meeting, Invoice, PaymentConfirmation, Quotation } from '../../types';
import { formatRupiah, formatDate, computeDocumentTotals, todayIso } from '../../utils/formatters';

interface DashboardViewProps {
  clients: Client[];
  leads: Lead[];
  meetings: Meeting[];
  invoices: Invoice[];
  payments: PaymentConfirmation[];
  quotations: Quotation[];
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
  onNavigateTab,
  onOpenClient,
  onNewClient,
  onNewMeeting,
}) => {
  const smmClients = clients.filter((c) => c.division === 'Social Media Management');

  const openLeads = leads.filter((l) => l.stage !== 'Deal' && l.stage !== 'Lost');
  const openPipelineValue = openLeads.reduce((acc, l) => acc + (l.value || 0), 0);
  const dealClosedValue = leads.filter((l) => l.stage === 'Deal').reduce((acc, l) => acc + (l.value || 0), 0);

  const pendingQuotations = quotations.filter((q) => q.status === 'Draft' || q.status === 'Terkirim');
  const pendingQuotationValue = pendingQuotations.reduce((acc, q) => {
    return acc + computeDocumentTotals(q.items, q.discount).grand;
  }, 0);

  const unpaidInvoices = invoices.filter((i) => i.status === 'Belum Dibayar');
  const unpaidInvoiceTotal = unpaidInvoices.reduce((acc, i) => {
    return acc + computeDocumentTotals(i.items, i.discount).grand;
  }, 0);

  const paidInvoices = invoices.filter((i) => i.status === 'Lunas');
  const paidInvoiceTotal = paidInvoices.reduce((acc, i) => {
    return acc + computeDocumentTotals(i.items, i.discount).grand;
  }, 0);

  const totalPaymentsReceived = payments
    .filter((p) => p.status === 'Paid Off')
    .reduce((acc, p) => acc + computeDocumentTotals(p.items, p.discount).grand, 0);

  const upcomingMeetings = [...meetings]
    .filter((m) => m.status === 'Terjadwal' && m.meetingDate >= todayIso())
    .sort((a, b) => a.meetingDate.localeCompare(b.meetingDate))
    .slice(0, 5);

  const kpis = [
    {
      label: 'Total Klien Aktif',
      value: clients.length.toString(),
      subtext: `${smmClients.length} Divisi Social Media Management`,
      icon: Users,
      color: 'text-[#EF4444]',
      bg: 'bg-red-500/10',
      tab: 'clients',
    },
    {
      label: 'Nilai Pipeline Terbuka',
      value: formatRupiah(openPipelineValue),
      subtext: `${openLeads.length} Prospek dalam proses`,
      icon: Kanban,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      tab: 'pipeline',
    },
    {
      label: 'Total Deal Closed',
      value: formatRupiah(dealClosedValue),
      subtext: 'Peluang berhasil closing',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      tab: 'pipeline',
    },
    {
      label: 'Quotation Menunggu',
      value: formatRupiah(pendingQuotationValue),
      subtext: `${pendingQuotations.length} penawaran diajukan`,
      icon: FileSpreadsheet,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      tab: 'quotations',
    },
    {
      label: 'Piutang Belum Dibayar',
      value: formatRupiah(unpaidInvoiceTotal),
      subtext: `${unpaidInvoices.length} tagihan belum lunas`,
      icon: Receipt,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      tab: 'invoices',
    },
    {
      label: 'Dana Masuk (Paid Off)',
      value: formatRupiah(totalPaymentsReceived),
      subtext: 'Terverifikasi masuk kas agensi',
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

      {/* Main 2-Column Split: Upcoming Meetings & SMM Client Hub Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Jadwal Meeting Mendatang */}
        <div className="bg-[#1E293B] border border-[#1E293B] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <CalendarDays size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Meeting Mendatang</h3>
                <span className="text-[11px] text-slate-400">Agenda terdekat klien & internal</span>
              </div>
            </div>
            <button
              onClick={onNewMeeting}
              className="text-xs font-bold text-[#DC2626] hover:text-red-400 flex items-center gap-1 cursor-pointer"
            >
              + Jadwal Baru
            </button>
          </div>

          {upcomingMeetings.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
              Tidak ada agenda meeting yang akan datang.
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingMeetings.map((m) => {
                const client = clients.find((c) => c.id === m.clientId);
                return (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{m.title}</span>
                        <span className="text-[10px] font-mono bg-blue-950/60 text-blue-300 border border-blue-900/40 px-1.5 py-0.2 rounded">
                          {m.meetingType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Building2 size={12} className="text-slate-400" />
                        <span className="font-semibold text-slate-300">
                          {client ? (client.company || client.name) : 'Internal Agenda'}
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
                          <span>{m.startTime} - {m.endTime || 'selesai'}</span>
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
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              Lihat Seluruh Agenda →
            </button>
          </div>
        </div>

        {/* Right: Klien Social Media Management (Integrasi Project Control) */}
        <div className="bg-[#1E293B] border border-[#1E293B] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-500/10 text-[#DC2626]">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Klien Social Media Management</h3>
                <span className="text-[11px] text-slate-400">Siap sinkron ke modul Project Control</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-[rgba(69,10,10,0.6)] text-red-300 border border-red-900/50 px-2 py-0.5 rounded">
              {smmClients.length} Klien SMM
            </span>
          </div>

          <div className="space-y-2">
            {smmClients.slice(0, 5).map((c) => (
              <div
                key={c.id}
                onClick={() => onOpenClient(c)}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-red-900/40 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-900/40 text-red-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    {(c.company || c.name).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      {c.company || c.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      PIC: {c.name || 'PIC Klien'} {c.phone ? `· WA: ${c.phone}` : ''}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded">
                    SMM Active
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
              + Tambah Klien SMM
            </button>
            <button
              onClick={() => onNavigateTab('clients')}
              className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Buka Direktori Klien Hub →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
