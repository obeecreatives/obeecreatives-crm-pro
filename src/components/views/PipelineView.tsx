import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  DollarSign,
  Building2,
  Trash2,
  Edit2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Lead, Client, LeadStage } from '../../types';
import { STAGES, formatRupiah, formatDate } from '../../utils/formatters';

interface PipelineViewProps {
  leads: Lead[];
  clients: Client[];
  onAddLead: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onMoveStage: (leadId: string, nextStage: LeadStage) => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  leads,
  clients,
  onAddLead,
  onEditLead,
  onDeleteLead,
  onMoveStage,
}) => {
  const getClientLabel = (cId: string) => {
    const c = (clients || []).find((client) => client && client.id === cId);
    return c ? (c.company || c.name) : '—';
  };

  const totalPipelineValue = (leads || [])
    .filter((l) => l && l.stage !== 'Lost')
    .reduce((acc, l) => acc + (Number(l.value) || 0), 0);

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Kanban className="text-blue-400" size={20} />
            <span>Pipeline Leads</span>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {leads.length} Prospek Total
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Papan Kanban peluang kerja sama dari prospek awal hingga closing deal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 uppercase block">Total Nilai Pipeline</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {formatRupiah(totalPipelineValue)}
            </span>
          </div>

          <button
            onClick={onAddLead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Tambah Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Horizontal Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x">
        {STAGES.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.id);
          const colValue = colLeads.reduce((acc, l) => acc + (l.value || 0), 0);

          return (
            <div
              key={col.id}
              className="w-72 shrink-0 bg-[#0B1120] border border-[#1E293B] rounded-2xl p-3 flex flex-col justify-between snap-start"
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    <span className="text-xs font-bold text-white tracking-wide">
                      {col.label}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                      {colLeads.length}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-semibold text-slate-400">
                    {formatRupiah(colValue)}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 min-h-[350px]">
                  {colLeads.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-400 border border-dashed border-slate-800/80 rounded-xl">
                      Kosong
                    </div>
                  ) : (
                    colLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-[#1E293B] border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl shadow-xs space-y-2 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                            {lead.title}
                          </h4>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => onEditLead(lead)}
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                              title="Edit Lead"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              onClick={() => onDeleteLead(lead)}
                              className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/40"
                              title="Hapus Lead"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Client & Division */}
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                          <Building2 size={11} className="shrink-0 text-slate-400" />
                          <span className="truncate font-medium text-slate-300">
                            {getClientLabel(lead.clientId)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono truncate max-w-[120px]">
                            {lead.division}
                          </span>
                          <span className="text-xs font-bold font-mono text-emerald-400">
                            {formatRupiah(lead.value)}
                          </span>
                        </div>

                        {/* Move Stage Selector */}
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Pindah Stage:</span>
                          <select
                            value={lead.stage}
                            onChange={(e) => onMoveStage(lead.id, e.target.value as LeadStage)}
                            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
