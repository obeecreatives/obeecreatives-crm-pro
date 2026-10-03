import React, { useState } from 'react';
import { X, Building2, User, Phone, Mail, FileText, Tag } from 'lucide-react';
import { Client } from '../../types';
import { DIVISIONS, todayIso } from '../../utils/formatters';

interface ClientModalProps {
  initial?: Client | null;
  onSave: (client: Client) => void;
  onClose: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState<Partial<Client>>({
    id: initial?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `client-${Date.now()}`),
    name: initial?.name || '',
    company: initial?.company || '',
    phone: initial?.phone || '',
    email: initial?.email || '',
    division: initial?.division || 'Social Media Management',
    notes: initial?.notes || '',
    createdAt: initial?.createdAt || todayIso(),
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company?.trim() && !form.name?.trim()) {
      setErrors({ name: 'Nama Perusahaan atau Nama Kontak wajib diisi!' });
      return;
    }

    onSave({
      id: form.id!,
      name: form.name?.trim() || '',
      company: form.company?.trim() || '',
      phone: form.phone?.trim() || '',
      email: form.email?.trim() || '',
      division: form.division || 'Social Media Management',
      notes: form.notes?.trim() || '',
      createdAt: form.createdAt || todayIso(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#1E293B] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-[#0F172A]">
          <div className="flex items-center gap-2">
            <Building2 className="text-[#DC2626]" size={20} />
            <h2 className="text-base font-bold text-white">
              {initial ? 'Edit Data Klien' : 'Tambah Klien Baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company (Prioritas Utama sesuai Blueprint) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Building2 size={13} className="text-[#DC2626]" />
              <span>Nama Perusahaan / Brand (Prioritas Utama)</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: MOODCO RUMAH COKELAT"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626] transition-colors"
              autoFocus
            />
            <p className="text-[11px] text-slate-400 mt-1">
              *Aplikasi memprioritaskan nama perusahaan sebagai display utama di seluruh modul.
            </p>
          </div>

          {/* Contact Person Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <User size={13} className="text-slate-400" />
              <span>Nama Kontak / PIC Klien</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Ibu Sasha / Bpk Denny"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626] transition-colors"
            />
            {errors.name && (
              <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400" />
                <span>No. WhatsApp / HP</span>
              </label>
              <input
                type="text"
                placeholder="81234567890 (tanpa spasi)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626] transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" />
                <span>Email Klien</span>
              </label>
              <input
                type="email"
                placeholder="klien@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>
          </div>

          {/* Division (Default SMM) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Tag size={13} className="text-slate-400" />
              <span>Divisi Layanan</span>
            </label>
            <select
              value={form.division}
              onChange={(e) => setForm({ ...form, division: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626] transition-colors"
            >
              {DIVISIONS.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText size={13} className="text-slate-400" />
              <span>Catatan / Preferensi Klien</span>
            </label>
            <textarea
              rows={3}
              placeholder="Catatan kebutuhan branding, jadwal upload, dll."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626] transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-colors"
            >
              {initial ? 'Simpan Perubahan' : 'Tambah Klien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
