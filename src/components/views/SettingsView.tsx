import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Users,
  Check,
  X,
  Database,
  RefreshCw,
  FileCode2,
  Download,
  Upload,
  Key,
  Lock,
  Eye,
  Sliders,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Laptop,
  Share,
  PlusSquare,
  Clock,
} from 'lucide-react';
import { UserRole } from '../../types';
import { DEFAULT_GAS_CRM_URL, DEFAULT_GAS_EQUIPMENT_URL, testGasConnection } from '../../utils/gasApi';
import { FUTURE_FEATURES_ROADMAP } from '../../data/featureRoadmap';

interface SettingsViewProps {
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onSyncSheets: () => void;
  isSyncing: boolean;
  onOpenScriptModal: () => void;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDefault: () => void;
  clientCount: number;
  equipmentCount: number;
  onInstallPwa?: () => void;
  isInstalled?: boolean;
  isInstallable?: boolean;
}

interface RolePermission {
  module: string;
  superAdmin: boolean;
  webDev: boolean;
  admin: boolean;
  creator: boolean;
  client: boolean;
  note: string;
}

const PERMISSIONS_MATRIX: RolePermission[] = [
  { module: 'Dashboard Operasional', superAdmin: true, webDev: true, admin: true, creator: true, client: false, note: 'Ringkasan KPI, jadwal & piutang agensi' },
  { module: 'CRM Clients Hub', superAdmin: true, webDev: true, admin: true, creator: true, client: false, note: 'Akses penuh basis data kontak & PIC klien' },
  { module: 'Pipeline Leads (Kanban)', superAdmin: true, webDev: true, admin: true, creator: false, client: false, note: 'Peluang proyek dan prospek baru' },
  { module: 'Jadwal Meeting / Agenda', superAdmin: true, webDev: true, admin: true, creator: true, client: true, note: 'Jadwal temu & koordinasi produksi' },
  { module: 'Estimasi Biaya Produksi (RAB)', superAdmin: true, webDev: true, admin: true, creator: true, client: false, note: 'Kalkulasi inventaris alat, fee jasa, infaq & saham' },
  { module: 'Quotation (Surat Penawaran)', superAdmin: true, webDev: true, admin: true, creator: false, client: true, note: 'Pembuatan & persetujuan penawaran resmi' },
  { module: 'Invoice (Faktur Tagihan)', superAdmin: true, webDev: true, admin: true, creator: false, client: true, note: 'Penerbitan tagihan & riwayat pelunasan' },
  { module: 'Payment Confirmation (Kas Masuk)', superAdmin: true, webDev: true, admin: true, creator: false, client: false, note: 'Verifikasi bukti transfer & auto-lunas tagihan' },
  { module: 'Integrasi Google Sheets (GAS V2)', superAdmin: true, webDev: true, admin: false, creator: false, client: false, note: 'Sinkronisasi endpoint API & skrip backend' },
  { module: 'Manajemen Hak Akses (RBAC)', superAdmin: true, webDev: true, admin: false, creator: false, client: false, note: 'Konfigurasi peran dan hak akses pengguna' },
];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Aktif' | 'Pending';
}

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  { id: 'usr-1', name: 'Lalu Mahendra', email: 'loehendra@gmail.com', role: 'Super Admin / Project Manager', status: 'Aktif' },
  { id: 'usr-2', name: 'Developer Obee', email: 'obeetools@gmail.com', role: 'Web Dev / Site Engineer', status: 'Aktif' },
  { id: 'usr-3', name: 'Finance & Admin', email: 'obeecreatives@gmail.com', role: 'Admin', status: 'Aktif' },
  { id: 'usr-4', name: 'Creator Fotografi & Video', email: 'creator@obeecreatives.com', role: 'Staff Creator', status: 'Aktif' },
  { id: 'usr-5', name: 'Klien Mitra Partner', email: 'partner@klien.com', role: 'Client Partner', status: 'Aktif' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  userRole,
  onChangeRole,
  onSyncSheets,
  isSyncing,
  onOpenScriptModal,
  onExportBackup,
  onImportBackup,
  onResetDefault,
  clientCount,
  equipmentCount,
  onInstallPwa,
  isInstalled,
  isInstallable,
}) => {
  const [activeTab, setActiveTab] = useState<'rbac' | 'sheets' | 'backup' | 'pwa' | 'roadmap'>('rbac');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    status?: 'success' | 'error' | 'warning';
    code?: string;
    title?: string;
    message?: string;
    instruction?: string[];
    loading?: boolean;
  }>({ tested: false });

  const handleMemberRoleChange = (memberId: string, newRole: UserRole) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  };

  const handleTestConnection = async () => {
    setTestResult({ tested: true, loading: true });
    const res = await testGasConnection(DEFAULT_GAS_CRM_URL);
    setTestResult({
      tested: true,
      loading: false,
      status: res.status,
      code: res.code,
      title: res.title,
      message: res.message,
      instruction: res.instruction,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="text-[#DC2626]" size={22} />
          <span>Pengaturan Sistem & Hak Akses (RBAC)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Kelola peran pengguna, izin modul operasional, integrasi Google Spreadsheet V2, dan pencadangan data.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer
            ${activeTab === 'rbac' ? 'border-[#DC2626] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <ShieldCheck size={16} className={activeTab === 'rbac' ? 'text-[#DC2626]' : ''} />
          <span>Kelola Peran & Akses (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('sheets')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer
            ${activeTab === 'sheets' ? 'border-[#DC2626] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Database size={16} className={activeTab === 'sheets' ? 'text-[#DC2626]' : ''} />
          <span>Integrasi Google Sheets V2</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer
            ${activeTab === 'backup' ? 'border-[#DC2626] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Download size={16} className={activeTab === 'backup' ? 'text-[#DC2626]' : ''} />
          <span>Cadangan & Pemulihan Data</span>
        </button>

        <button
          onClick={() => setActiveTab('pwa')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer
            ${activeTab === 'pwa' ? 'border-[#DC2626] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Smartphone size={16} className={activeTab === 'pwa' ? 'text-[#DC2626]' : ''} />
          <span>Install Aplikasi (HP & PC)</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer
            ${activeTab === 'roadmap' ? 'border-amber-500 text-white' : 'border-transparent text-amber-400/80 hover:text-amber-300'}`}
        >
          <Clock size={16} className={activeTab === 'roadmap' ? 'text-amber-400' : ''} />
          <span>Catatan Fitur Mendatang</span>
        </button>
      </div>

      {/* TAB 1: KELOLA HAK AKSES & PERAN (RBAC) */}
      {activeTab === 'rbac' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Active Role Selector Card */}
          <div className="bg-[#1E293B] border border-[#1E293B] p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800 text-red-500 flex items-center justify-center shrink-0">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Peran Aktif Pengguna Saat Ini</h3>
                  <p className="text-xs text-slate-400">
                    Pilih peran untuk menguji tampilan antarmuka dan batasan hak akses sistem.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status Peran:</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded">
                  Simulasi Aktif
                </span>
              </div>
            </div>

            {/* Role Buttons Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(
                [
                  { role: 'Super Admin / Project Manager', desc: 'Akses penuh seluruh 11 modul, keuangan, dan peralatan', color: 'border-red-500 bg-red-950/30 text-red-400' },
                  { role: 'Web Dev / Site Engineer', desc: 'Akses teknis, integrasi API, sinkronisasi sheet & skrip', color: 'border-emerald-500 bg-emerald-950/30 text-emerald-400' },
                  { role: 'Admin', desc: 'Akses CRM Klien, Quotation, Invoices, dan bukti bayar', color: 'border-amber-500 bg-amber-950/30 text-amber-400' },
                  { role: 'Staff Creator', desc: 'Akses Project Control, Klien Hub, Jadwal & Estimasi RAB', color: 'border-blue-500 bg-blue-950/30 text-blue-400' },
                  { role: 'Client Partner', desc: 'Akses khusus read-only & approval dokumen proyek mereka', color: 'border-purple-500 bg-purple-950/30 text-purple-400' },
                ] as { role: UserRole; desc: string; color: string }[]
              ).map((item) => {
                const isSelected = userRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => onChangeRole(item.role)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between
                      ${isSelected ? `${item.color} shadow-md` : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{item.role}</span>
                        {isSelected && <span className="text-xs font-bold">✓</span>}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions Matrix Table */}
          <div className="bg-[#1E293B] border border-[#1E293B] p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-[#DC2626]" />
                <h3 className="text-sm font-bold text-white">Matriks Izin Modul per Peran (RBAC Matrix)</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">10 Modul Operasional</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F172A] text-slate-300 uppercase text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Modul Sistem</th>
                    <th className="py-2.5 px-2 text-center text-red-400">Super Admin</th>
                    <th className="py-2.5 px-2 text-center text-emerald-400">Web Dev</th>
                    <th className="py-2.5 px-2 text-center text-amber-400">Admin</th>
                    <th className="py-2.5 px-2 text-center text-blue-400">Creator</th>
                    <th className="py-2.5 px-2 text-center text-purple-400">Client</th>
                    <th className="py-2.5 px-3">Keterangan Akses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {PERMISSIONS_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">{row.module}</td>
                      <td className="py-2.5 px-2 text-center">
                        {row.superAdmin ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">-</span>}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {row.webDev ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">-</span>}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {row.admin ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">-</span>}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {row.creator ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">-</span>}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {row.client ? <span className="text-purple-400 font-bold">✓</span> : <span className="text-slate-600">-</span>}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-400">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Members Role Assignment Table */}
          <div className="bg-[#1E293B] border border-[#1E293B] p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#DC2626]" />
                <h3 className="text-sm font-bold text-white">Daftar Akun Anggota Tim & Penugasan Peran</h3>
              </div>
              <span className="text-[11px] text-slate-400">{teamMembers.length} Akun Terdaftar</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F172A] text-slate-300 uppercase text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Nama Anggota</th>
                    <th className="py-2.5 px-3">Email Google Akun</th>
                    <th className="py-2.5 px-3">Penugasan Peran (Role)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-white">{member.name}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{member.email}</td>
                      <td className="py-2.5 px-3">
                        <select
                          value={member.role}
                          onChange={(e) => handleMemberRoleChange(member.id, e.target.value as UserRole)}
                          className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#DC2626]"
                        >
                          <option value="Super Admin / Project Manager">Super Admin / Project Manager</option>
                          <option value="Web Dev / Site Engineer">Web Dev / Site Engineer</option>
                          <option value="Admin">Admin</option>
                          <option value="Staff Creator">Staff Creator</option>
                          <option value="Client Partner">Client Partner</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTEGRASI GOOGLE SHEETS V2 */}
      {activeTab === 'sheets' && (
        <div className="bg-[#1E293B] border border-[#1E293B] p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Status Endpoint Google Apps Script</h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Live Web App Deployment
              </span>
            </div>
            <button
              onClick={onOpenScriptModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <FileCode2 size={14} className="text-red-400" />
              <span>Lihat Skrip Apps Script V2</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                CRM Apps Script Exec URL (Aktif):
              </label>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all">
                {DEFAULT_GAS_CRM_URL}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Equipment Hub Exec URL (Inventaris Alat):
              </label>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all">
                {DEFAULT_GAS_EQUIPMENT_URL}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleTestConnection}
                disabled={testResult.loading}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={testResult.loading ? 'animate-spin' : ''} />
                <span>{testResult.loading ? 'Mengetes...' : 'Uji Koneksi Endpoint'}</span>
              </button>

              <button
                onClick={onSyncSheets}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-md shadow-red-950/40 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                <span>{isSyncing ? 'Menarik Data...' : 'Tarik Data Sheet Asli Sekarang'}</span>
              </button>
            </div>

            {testResult.tested && (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2
                  ${
                    testResult.status === 'success'
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : testResult.code === 'ACCESS_DENIED'
                      ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                      : 'bg-red-950/40 border-red-800 text-red-300'
                  }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {testResult.status === 'success' ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : (
                    <AlertCircle size={18} className={testResult.code === 'ACCESS_DENIED' ? 'text-amber-400' : 'text-red-400'} />
                  )}
                  <span>
                    {testResult.title ||
                      (testResult.status === 'success'
                        ? 'Koneksi JSON API Berhasil!'
                        : 'Kendala Koneksi Terdeteksi')}
                  </span>
                </div>
                <p className="text-slate-300 text-xs">{testResult.message}</p>

                {testResult.instruction && testResult.instruction.length > 0 && (
                  <div className="mt-3 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                    <span className="font-bold text-amber-300 text-xs block">
                      🛠️ Panduan Perbaikan di Google Apps Script:
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 text-[11.5px] text-slate-300">
                      {testResult.instruction.map((ins, i) => (
                        <li key={i}>{ins}</li>
                      ))}
                    </ol>

                    <div className="pt-2">
                      <button
                        onClick={onOpenScriptModal}
                        className="px-3.5 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <FileCode2 size={14} />
                        <span>Buka & Salin Skrip API Router V2</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="bg-[#1E293B] border border-[#1E293B] p-6 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Database Lokal & Backup Offline</h3>
              <span className="text-[11px] text-slate-400">
                Penyimpanan persisten di browser dengan perlindungan bebas offline.
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
              <Database size={13} className="text-emerald-400" />
              <span>{clientCount} Klien · {equipmentCount} Alat</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-white block">Cadangkan Data (Backup JSON)</span>
              <p className="text-slate-400 text-[11px]">
                Unduh seluruh database (Klien, Pipeline, Jadwal, Estimasi, Quotation, Invoice, Pembayaran) dalam 1 berkas.
              </p>
              <button
                onClick={onExportBackup}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
              >
                <Download size={13} />
                <span>Unduh Cadangan JSON</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-white block">Pulihkan Data (Restore)</span>
              <p className="text-slate-400 text-[11px]">
                Impor berkas cadangan JSON yang sebelumnya pernah diunduh.
              </p>
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer w-fit">
                <Upload size={13} />
                <span>Pilih Berkas JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <div className="text-slate-400 text-[11px]">
              Ingin mengembalikan ke 10 klien awal & 130 inventaris bawaan?
            </div>
            <button
              onClick={onResetDefault}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950/80 text-red-400 border border-red-900/40 font-semibold cursor-pointer"
            >
              Reset ke Data Awal
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: INSTALL APLIKASI (PWA) */}
      {activeTab === 'pwa' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Hero Install Banner */}
          <div className="bg-[#1E293B] border border-[#1E293B] p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800 text-red-500 flex items-center justify-center shrink-0">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Instalasi Aplikasi di HP & PC / Laptop</h3>
                  <p className="text-xs text-slate-400">
                    Gunakan CRM OBEECREATIVES seperti aplikasi bawaan (Native App) tanpa repot mengetik URL.
                  </p>
                </div>
              </div>

              {onInstallPwa && (
                <button
                  onClick={onInstallPwa}
                  className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all cursor-pointer shrink-0"
                >
                  <Download size={16} />
                  <span>{isInstalled ? 'Buka Panduan Install' : 'Install Aplikasi Sekarang'}</span>
                </button>
              )}
            </div>

            {/* PWA Verification Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Web App Manifest</span>
                  <span className="text-[11px] text-slate-400">Standalone & Ikon Maskable Siap</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Service Worker V2</span>
                  <span className="text-[11px] text-slate-400">Dukungan Akses & Cache Offline</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Kompatibilitas Penuh</span>
                  <span className="text-[11px] text-slate-400">Android, iOS, Windows, macOS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Device Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* HP / Mobile Guide */}
            <div className="bg-[#1E293B] border border-[#1E293B] p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm pb-2 border-b border-slate-800">
                <Smartphone size={18} className="text-red-400" />
                <span>Panduan Instalasi di HP (Smartphone)</span>
              </div>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">Android (Google Chrome / Edge):</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Tekan tombol menu titik tiga (<strong>⋮</strong>) di pojok kanan atas browser Chrome, lalu pilih <strong>"Instal aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="font-bold text-blue-400 block mb-1">iPhone / iPad (Safari):</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Buka di Safari, ketuk tombol <strong>Bagikan (Share)</strong> di bilah bawah, lalu pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* PC / Laptop Guide */}
            <div className="bg-[#1E293B] border border-[#1E293B] p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm pb-2 border-b border-slate-800">
                <Laptop size={18} className="text-amber-400" />
                <span>Panduan Instalasi di PC / Laptop</span>
              </div>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">Google Chrome & Microsoft Edge di Windows/Mac:</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Lihat pada <strong>Bilah Alamat (URL Bar)</strong> di pojok kanan atas. Klik ikon <strong>Install App</strong> yang berlogo komputer dengan tanda panah ke bawah, atau klik menu (⋮) ➔ <strong>Install CRM OBEECREATIVES</strong>.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                  <span className="font-bold text-purple-400 block mb-1">Mode Window Standalone:</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Setelah terinstall, aplikasi akan memiliki ikon sendiri di Desktop & Taskbar, dapat dibuka layaknya software desktop tanpa tab browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CATATAN FITUR MASA DEPAN (MENUNGGU INSTRUKSI USER) */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 leading-relaxed flex items-start gap-3">
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
