import React, { useState } from 'react';
import { X, Copy, Check, Code, FileCode2, ExternalLink } from 'lucide-react';
import { GAS_ROUTER_V2_SCRIPT, DEFAULT_GAS_CRM_URL } from '../../utils/gasApi';

interface GasScriptModalProps {
  onClose: () => void;
}

export const GasScriptModal: React.FC<GasScriptModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(GAS_ROUTER_V2_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#1E293B] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-[#0F172A]">
          <div className="flex items-center gap-2">
            <FileCode2 className="text-red-500" size={20} />
            <h2 className="text-base font-bold text-white">
              Skrip Google Apps Script V2 (JSON API Router)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <p className="font-semibold text-white">
              Panduan 3 Langkah Mengaktifkan JSON API di Spreadsheet CRM Anda:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>
                Buka Spreadsheet CRM Anda ➔ Klik menu <strong>Extensions (Ekstensi)</strong> ➔ <strong>Apps Script</strong>.
              </li>
              <li>
                Buka file <code className="text-red-400 font-mono">Code.gs</code> ➔ Tambahkan fungsi <code className="text-red-400 font-mono">doGet</code> dan <code className="text-red-400 font-mono">doPost</code> di bawah ini (atau ganti <code className="text-red-400 font-mono">doGet</code> lama yang me-return HTML).
              </li>
              <li>
                Klik <strong>Deploy</strong> ➔ <strong>Manage deployments</strong> ➔ Ikon pensil ➔ Version: <strong>New version</strong> ➔ Klik <strong>Deploy</strong>.
              </li>
            </ol>
          </div>

          <div className="relative">
            <div className="flex justify-between items-center pb-2">
              <span className="text-[11px] font-mono text-slate-400">Code.gs (Apps Script API Router)</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Tersalin!' : 'Salin Kode Skrip'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-72">
              {GAS_ROUTER_V2_SCRIPT}
            </pre>
          </div>
        </div>

        <div className="flex justify-end px-6 py-3 border-t border-slate-700 bg-[#0F172A]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
