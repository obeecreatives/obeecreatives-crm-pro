import React, { useState } from 'react';
import {
  RefreshCw,
  FileCode2,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import {
  DEFAULT_GAS_CRM_URL,
  DEFAULT_GAS_EQUIPMENT_URL,
  testGasConnection,
} from '../../utils/gasApi';

interface SyncSettingsViewProps {
  onSyncSheets: () => void;
  isSyncing: boolean;
  onOpenScriptModal: () => void;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDefault: () => void;
  clientCount: number;
  equipmentCount: number;
}

export const SyncSettingsView: React.FC<SyncSettingsViewProps> = ({
  onSyncSheets,
  isSyncing,
  onOpenScriptModal,
  onExportBackup,
  onImportBackup,
  onResetDefault,
  clientCount,
  equipmentCount,
}) => {
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success?: boolean;
    message?: string;
    isHtml?: boolean;
    loading?: boolean;
  }>({ tested: false });

  const handleTest = async () => {
    setTestResult({ tested: true, loading: true });
    const res = await testGasConnection(DEFAULT_GAS_CRM_URL);
    setTestResult({
      tested: true,
      loading: false,
      success: res.status === 'success',
      message: res.message,
      isHtml: res.code === 'HTML_RESPONSE' || res.code === 'ACCESS_DENIED',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Database className="text-[#DC2626]" size={20} />
          <span>Pengaturan Integrasi Google Sheets (GAS V2)</span>
        </h2>
        <p className="text-xs text-slate-400">
          Kelola jalur komunikasi data antara Web Apps modern dan Google Apps Script Spreadsheet.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="bg-[#1E293B] border border-[#1E293B] p-6 rounded-2xl shadow-sm space-y-4">
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
              onClick={handleTest}
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

          {/* Test Feedback Result */}
          {testResult.tested && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5
                ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : testResult.isHtml
                    ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                    : 'bg-red-950/40 border-red-800 text-red-300'
                }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {testResult.success ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={16} className={testResult.isHtml ? 'text-amber-400' : 'text-red-400'} />
                )}
                <span>
                  {testResult.success
                    ? 'Koneksi JSON API Berhasil!'
                    : testResult.isHtml
                    ? 'Pemberitahuan Format Endpoint (HTML vs JSON)'
                    : 'Kendala Koneksi Terdeteksi'}
                </span>
              </div>
              <p>{testResult.message}</p>
              {testResult.isHtml && (
                <div className="pt-2">
                  <button
                    onClick={onOpenScriptModal}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Buka Kode Skrip V2 untuk Dipasang di Apps Script
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Local Storage & Backup Management */}
      <div className="bg-[#1E293B] border border-[#1E293B] p-6 rounded-2xl shadow-sm space-y-4">
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
    </div>
  );
};
