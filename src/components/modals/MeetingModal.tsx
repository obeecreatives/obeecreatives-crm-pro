import React, { useState } from 'react';
import { X, CalendarDays, Clock, MapPin, Users, Building2 } from 'lucide-react';
import { Meeting, Client, MeetingType, MeetingStatus } from '../../types';
import { todayIso } from '../../utils/formatters';

interface MeetingModalProps {
  initial?: Meeting | null;
  clients: Client[];
  onSave: (meeting: Meeting) => void;
  onClose: () => void;
}

const MEETING_TYPES: MeetingType[] = ['Meeting', 'Call', 'Site Visit', 'Presentasi', 'Lainnya'];
const MEETING_STATUSES: MeetingStatus[] = ['Terjadwal', 'Selesai', 'Dibatalkan', 'Dijadwal Ulang'];

export const MeetingModal: React.FC<MeetingModalProps> = ({ initial, clients, onSave, onClose }) => {
  const [form, setForm] = useState<Partial<Meeting>>({
    id: initial?.id || `meet-${Date.now()}`,
    clientId: initial?.clientId || (clients[0]?.id || ''),
    title: initial?.title || '',
    meetingType: initial?.meetingType || 'Meeting',
    meetingDate: initial?.meetingDate || todayIso(),
    startTime: initial?.startTime || '10:00',
    endTime: initial?.endTime || '11:30',
    location: initial?.location || 'Studio Obeecreatives, Batu',
    attendees: initial?.attendees || '',
    status: initial?.status || 'Terjadwal',
    notes: initial?.notes || '',
    createdAt: initial?.createdAt || todayIso(),
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      setError('Judul meeting/agenda wajib diisi!');
      return;
    }
    if (!form.meetingDate) {
      setError('Tanggal agenda wajib diisi!');
      return;
    }

    onSave({
      id: form.id!,
      clientId: form.clientId || '',
      title: form.title.trim(),
      meetingType: form.meetingType as MeetingType,
      meetingDate: form.meetingDate,
      startTime: form.startTime || '',
      endTime: form.endTime || '',
      location: form.location?.trim() || '',
      attendees: form.attendees?.trim() || '',
      status: form.status as MeetingStatus,
      notes: form.notes?.trim() || '',
      createdAt: form.createdAt || todayIso(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#1E293B] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-[#0F172A]">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-amber-400" size={20} />
            <h2 className="text-base font-bold text-white">
              {initial ? 'Edit Jadwal Meeting' : 'Tambah Agenda Meeting Baru'}
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
              Judul Agenda / Diskusi *
            </label>
            <input
              type="text"
              placeholder="Contoh: Diskusi Moodboard & Konsep Visual Kampanye"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
              autoFocus
            />
            {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 size={13} className="text-slate-400" />
                <span>Klien / Calon Klien</span>
              </label>
              <select
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
              >
                <option value="">— Internal / Tanpa Klien —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company ? `${c.company} (${c.name || 'PIC'})` : c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jenis Pertemuan
              </label>
              <select
                value={form.meetingType}
                onChange={(e) => setForm({ ...form, meetingType: e.target.value as MeetingType })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
              >
                {MEETING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <CalendarDays size={13} className="text-slate-400" />
                <span>Tanggal *</span>
              </label>
              <input
                type="date"
                value={form.meetingDate}
                onChange={(e) => setForm({ ...form, meetingDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock size={13} className="text-slate-400" />
                <span>Mulai</span>
              </label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock size={13} className="text-slate-400" />
                <span>Selesai</span>
              </label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin size={13} className="text-slate-400" />
              <span>Lokasi / Tautan Google Meet</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Studio Obeecreatives / https://meet.google.com/..."
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Users size={13} className="text-slate-400" />
                <span>Peserta / Tim Terlibat</span>
              </label>
              <input
                type="text"
                placeholder="Bimo, Reza, Bu Moodco"
                value={form.attendees}
                onChange={(e) => setForm({ ...form, attendees: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status Agenda
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as MeetingStatus })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
              >
                {MEETING_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Catatan / Hal yang Perlu Disiapkan
            </label>
            <textarea
              rows={2}
              placeholder="Bawa kamera Sony A6400, sampel kemasan, dll."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#DC2626]"
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
              Simpan Jadwal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
