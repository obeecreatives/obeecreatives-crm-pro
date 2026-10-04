import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Building2,
  MessageCircle,
  FileDown,
  Tag,
  CheckCircle2,
  Copy,
  Receipt,
  Kanban,
} from 'lucide-react';
import { Client, Lead, Invoice, Meeting } from '../../types';
import { sanitizeWhatsAppPhone, DIVISIONS } from '../../utils/formatters';

interface ClientsViewProps {
  clients: Client[];
  leads: Lead[];
  invoices: Invoice[];
  meetings: Meeting[];
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  leads,
  invoices,
  meetings,
  onAddClient,
  onEditClient,
  onDeleteClient,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      String(c.company || '').toLowerCase().includes(q) ||
      String(c.name || '').toLowerCase().includes(q) ||
      String(c.phone || '').toLowerCase().includes(q) ||
      String(c.email || '').toLowerCase().includes(q) ||
      String(c.notes || '').toLowerCase().includes(q);

    const matchDivision =
      selectedDivision === 'all'
        ? true
        : selectedDivision === 'smm_only'
        ? c.division === 'Social Media Management'
        : c.division === selectedDivision;

    return matchSearch && matchDivision;
  });

  const smmCount = clients.filter((c) => c.division === 'Social Media Management').length;

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportSmmClients = () => {
    const smmList = clients.filter((c) => c.division === 'Social Media Management');
    const blob = new Blob([JSON.stringify(smmList, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `klien_smm_project_control_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="text-[#DC2626]" size={20} />
            <span>CRM Clients Hub</span>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {filteredClients.length} dari {clients.length} Klien
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Source of truth daftar klien resmi agensi. Memprioritaskan nama perusahaan/brand.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export SMM for Project Control */}
          <button
            onClick={exportSmmClients}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            title="Ekspor payload klien SMM untuk integrasi ke Project Control"
          >
            <FileDown size={14} className="text-slate-400" />
            <span className="hidden md:inline">Ekspor SMM (Project Control)</span>
          </button>

          {/* Add Client CTA (Action Red #DC2626) */}
          <button
            onClick={onAddClient}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Tambah Klien</span>
          </button>
        </div>
      </div>

      {/* Filter Presets Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedDivision('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
            ${selectedDivision === 'all' ? 'bg-[#DC2626] text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          Semua Divisi ({clients.length})
        </button>

        <button
          onClick={() => setSelectedDivision('smm_only')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer
            ${selectedDivision === 'smm_only' ? 'bg-[#DC2626] text-white shadow-sm font-bold' : 'bg-[rgba(69,10,10,0.6)] text-red-300 border border-red-900/40 hover:bg-red-950'}`}
        >
          <span>⭐ Khusus Social Media Management ({smmCount})</span>
        </button>

        {DIVISIONS.filter(d => d !== 'Social Media Management').map((div) => (
          <button
            key={div}
            onClick={() => setSelectedDivision(div)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
              ${selectedDivision === div ? 'bg-[#DC2626] text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            {div}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama perusahaan, PIC kontak, nomor WhatsApp, atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#DC2626] transition-colors"
        />
      </div>

      {/* Clients Cards Grid */}
      {filteredClients.length === 0 ? (
        <div className="p-12 text-center bg-[#1E293B] rounded-2xl border border-dashed border-slate-700 text-slate-400 space-y-3">
          <Building2 size={36} className="mx-auto text-slate-500 opacity-60" />
          <div className="text-sm font-bold text-white">Tidak ada data klien yang cocok</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau ganti filter divisi di bagian atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const waNumber = sanitizeWhatsAppPhone(client.phone);
            const clientLeads = leads.filter((l) => l.clientId === client.id);
            const clientInvoices = invoices.filter((i) => i.clientId === client.id);
            const unpaidInvoices = clientInvoices.filter((i) => i.status === 'Belum Dibayar');
            const clientMeetings = meetings.filter((m) => m.clientId === client.id && m.status === 'Terjadwal');

            const isSmm = client.division === 'Social Media Management';

            return (
              <div
                key={client.id}
                className="bg-[#1E293B] border border-[#1E293B] hover:border-slate-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Company First */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="truncate">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
                        {client.company || client.name || '(Tanpa Nama)'}
                      </h3>
                      {client.company && client.name && (
                        <span className="text-[11px] text-slate-400 truncate block">
                          PIC: {client.name}
                        </span>
                      )}
                    </div>

                    {/* Actions Menu */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onEditClient(client)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit Klien"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => onDeleteClient(client)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Hapus Klien (beserta data terkait)"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Division Tag */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border
                        ${
                          isSmm
                            ? 'bg-[rgba(69,10,10,0.6)] text-red-300 border-red-900/50'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                    >
                      {client.division || 'Umum'}
                    </span>

                    {/* UUID copy button */}
                    <button
                      onClick={() => copyId(client.id)}
                      className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                      title="Salin UUID Klien"
                    >
                      <span>{client.id.slice(0, 8)}...</span>
                      {copiedId === client.id ? (
                        <CheckCircle2 size={11} className="text-emerald-400" />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  </div>

                  {/* Contact Channels */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-300">
                    {client.phone ? (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px] font-mono">{client.phone}</span>
                        <a
                          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                            `Halo ${client.name || client.company}, kami dari tim obeecreatives...`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/80 px-2 py-0.5 rounded transition-colors"
                        >
                          <MessageCircle size={12} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic block">Tanpa nomor kontak</span>
                    )}

                    {client.email && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                        <Mail size={12} className="shrink-0" />
                        <a
                          href={`mailto:${client.email}`}
                          className="hover:text-white truncate"
                        >
                          {client.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {client.notes && (
                    <p className="mt-2.5 text-[11px] text-slate-400 line-clamp-2 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      "{client.notes}"
                    </p>
                  )}
                </div>

                {/* Footer Badges (Activity & Invoices) */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    {clientLeads.length > 0 && (
                      <span title="Peluang Aktif">{clientLeads.length} Lead</span>
                    )}
                    {clientMeetings.length > 0 && (
                      <span className="text-amber-400" title="Jadwal Meeting Terdekat">
                        {clientMeetings.length} Jadwal
                      </span>
                    )}
                  </div>

                  <div>
                    {clientInvoices.length > 0 ? (
                      <span
                        className={
                          unpaidInvoices.length > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'
                        }
                      >
                        {unpaidInvoices.length > 0
                          ? `${unpaidInvoices.length} Inv Belum Bayar`
                          : `${clientInvoices.length} Inv Lunas`}
                      </span>
                    ) : (
                      <span className="text-slate-400">0 Invoice</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
