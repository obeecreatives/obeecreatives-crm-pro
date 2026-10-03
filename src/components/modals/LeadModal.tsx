import React, { useState } from 'react';
import { X, Kanban, DollarSign, Building2, Tag } from 'lucide-react';
import { Lead, Client, LeadStage } from '../../types';
import { DIVISIONS, STAGES, todayIso } from '../../utils/formatters';

interface LeadModalProps {
  initial?: Lead | null;
  clients: Client[];
  onSave: (lead: Lead) => void;
  onClose: () => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({ initial, clients, onSave, onClose }) => {
  const [form, setForm] = useState<Partial<Lead>>({
    id: initial?.id || `lead-${Date.now()}`,
    title: initial?.title || '',
    clientId: initial?.clientId || (clients[0]?.id || ''),
    division: initial?.division || 'Social Media Management',
    value: initial?.value || 0,
    stage: initial?.stage || 'Prospek',
    createdAt: initial?.createdAt || todayIso(),
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      setError('Judul proyek/peluang wajib diisi!');
      return;
    }
    if (!form.clientId) {
      setError('Pilih klien terkait!');
      return;
    }

    onSave({
      id: form.id!,
      title: form.title.trim(),
      clientId: form.clientId,
      division: form.division || 'Social Media Management',
      value: Number(form.value) || 0,
      stage: (form.stage as LeadStage) || 'Prospek',
      createdAt: form.createdAt || todayIso(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#1E293B] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-[#0F172A]">
          <div className="flex items-center gap-2">
            <Kanban className="text-blue-400" size={20} />
            <h2 className="text-base font-bold text-white">
              {initial ? 'Edit Lead Prospek' : 'Tambah Lead Pipeline Baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Judul Proyek / Deal *
            </label>
            <input
              type="text"
              placeholder="Contoh: Paket Reels 2 Bulan Moodco"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
              autoFocus
            />
            {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Building2 size={13} className="text-slate-400" />
              <span>Klien Terkait (CRM)</span>
            </label>
            <select
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company ? `${c.company} (${c.name || 'PIC'})` : c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Tag size={13} className="text-slate-400" />
                <span>Divisi</span>
              </label>
              <select
                value={form.division}
                onChange={(e) => setForm({ ...form, division: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
              >
                {DIVISIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Stage Pipeline
              </label>
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value as LeadStage })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <DollarSign size={13} className="text-emerald-400" />
              <span>Nilai Estimasi Proyek (Rp)</span>
            </label>
            <input
              type="number"
              placeholder="Contoh: 5000000"
              value={form.value || ''}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626] font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-950/40"
            >
              Simpan Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
