import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  Users,
  Building2,
  Trash2,
  Edit2,
  Search,
} from 'lucide-react';
import { Meeting, Client, MeetingStatus } from '../../types';
import { formatDate } from '../../utils/formatters';

interface MeetingsViewProps {
  meetings: Meeting[];
  clients: Client[];
  onAddMeeting: () => void;
  onEditMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (meeting: Meeting) => void;
  onUpdateStatus: (meetingId: string, status: MeetingStatus) => void;
}

const STATUS_BADGES: Record<MeetingStatus, { bg: string; text: string }> = {
  'Terjadwal': { bg: 'bg-blue-950/60 border-blue-800', text: 'text-blue-300' },
  'Selesai': { bg: 'bg-emerald-950/60 border-emerald-800', text: 'text-emerald-300' },
  'Dibatalkan': { bg: 'bg-red-950/60 border-red-800', text: 'text-red-300' },
  'Dijadwal Ulang': { bg: 'bg-amber-950/60 border-amber-800', text: 'text-amber-300' },
};

export const MeetingsView: React.FC<MeetingsViewProps> = ({
  meetings,
  clients,
  onAddMeeting,
  onEditMeeting,
  onDeleteMeeting,
  onUpdateStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const getClientName = (cId: string) => {
    const c = clients.find((client) => client.id === cId);
    return c ? (c.company || c.name) : 'Internal Obee';
  };

  const filteredMeetings = meetings.filter((m) => {
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.title.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q) ||
      m.attendees.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="text-amber-400" size={20} />
            <span>Jadwal Meeting & Appointment</span>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {filteredMeetings.length} Agenda
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Pencatatan sesi konsultasi, presentasi penawaran, serta koordinasi shooting & project.
          </p>
        </div>

        <button
          onClick={onAddMeeting}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-950/40 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>+ Tambah Jadwal</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul meeting, lokasi, atau peserta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#DC2626]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['all', 'Terjadwal', 'Selesai', 'Dijadwal Ulang', 'Dibatalkan'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                ${filterStatus === st ? 'bg-[#DC2626] text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {st === 'all' ? 'Semua Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Meetings List Cards */}
      {filteredMeetings.length === 0 ? (
        <div className="p-12 text-center bg-[#1E293B] rounded-2xl border border-dashed border-slate-700 text-slate-400 space-y-2">
          <CalendarDays size={32} className="mx-auto text-slate-500 opacity-60" />
          <div className="text-sm font-bold text-white">Tidak ada jadwal meeting yang cocok</div>
          <p className="text-xs text-slate-400">
            Jadwal baru dapat ditambahkan untuk klien baru maupun diskusi internal tim.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeetings.map((m) => {
            const badge = STATUS_BADGES[m.status] || STATUS_BADGES['Terjadwal'];
            return (
              <div
                key={m.id}
                className="bg-[#1E293B] border border-[#1E293B] hover:border-slate-700 p-5 rounded-2xl shadow-sm flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                      {m.meetingType}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditMeeting(m)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Jadwal"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => onDeleteMeeting(m)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40"
                        title="Hapus Jadwal"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{m.title}</h3>
                    <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1.5 mt-1">
                      <Building2 size={12} className="text-slate-400" />
                      <span>{getClientName(m.clientId)}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-mono text-amber-400 font-semibold">
                      <CalendarDays size={13} />
                      <span>{formatDate(m.meetingDate)}</span>
                      {m.startTime && (
                        <span>· {m.startTime} - {m.endTime || 'selesai'}</span>
                      )}
                    </div>

                    {m.location && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin size={13} className="shrink-0 text-slate-400" />
                        <span className="truncate">{m.location}</span>
                      </div>
                    )}

                    {m.attendees && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Users size={13} className="shrink-0 text-slate-400" />
                        <span className="truncate">Peserta: {m.attendees}</span>
                      </div>
                    )}
                  </div>

                  {m.notes && (
                    <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      "{m.notes}"
                    </p>
                  )}
                </div>

                {/* Status Toggle Selector */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Status:</span>
                  <select
                    value={m.status}
                    onChange={(e) => onUpdateStatus(m.id, e.target.value as MeetingStatus)}
                    className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-none ${badge.bg} ${badge.text}`}
                  >
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dijadwal Ulang">Dijadwal Ulang</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
