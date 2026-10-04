import React from 'react';
import {
  Download,
  X,
  Smartphone,
  Laptop,
  CheckCircle2,
  Share,
  PlusSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isMobile: boolean;
  onDirectInstall: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  isIOS,
  isMobile,
  onDirectInstall,
}) => {
  const [activeTab, setActiveTab] = React.useState<'mobile' | 'pc'>(isMobile ? 'mobile' : 'pc');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 text-[#DC2626] border border-red-900/30">
              <Download size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Install CRM OBEECREATIVES
              </h2>
              <p className="text-[11px] text-slate-400">
                Pasang sebagai aplikasi mandiri di HP, Tablet, & Laptop / PC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-200 text-xs sm:text-sm">
          {/* Status Banner */}
          {isInstalled ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-emerald-300 block">Aplikasi Sudah Terpasang!</span>
                <span className="text-[11px] text-emerald-400/80">
                  Anda telah menginstall aplikasi ini di perangkat. Anda dapat membukanya langsung dari Home Screen atau Desktop.
                </span>
              </div>
            </div>
          ) : isInstallable ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" />
                  Perangkat Siap Pasang Langsung
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/50">
                  1-Click Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Browser Anda mendukung instalasi instan. Klik tombol di bawah untuk memasang aplikasi ke desktop atau menu aplikasi utama.
              </p>
              <button
                onClick={onDirectInstall}
                className="w-full py-2.5 px-4 rounded-xl bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all cursor-pointer"
              >
                <Download size={16} />
                <span>Install Aplikasi Sekarang</span>
              </button>
            </div>
          ) : null}

          {/* Device Tabs Selector */}
          <div>
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
              <button
                onClick={() => setActiveTab('mobile')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'mobile'
                    ? 'bg-[#DC2626] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone size={15} />
                <span>Smartphone / Tablet (HP)</span>
              </button>
              <button
                onClick={() => setActiveTab('pc')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  activeTab === 'pc'
                    ? 'bg-[#DC2626] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Laptop size={15} />
                <span>Laptop & Komputer (PC)</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Mobile (Android & iOS) */}
          {activeTab === 'mobile' && (
            <div className="space-y-4">
              {/* Android Guide */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                    A
                  </div>
                  <span className="font-bold text-white text-xs">Untuk HP Android (Google Chrome):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 pl-1">
                  <li>Buka website ini di Google Chrome HP Anda.</li>
                  <li>
                    Tekan tombol menu titik tiga (<strong>⋮</strong>) di pojok kanan atas browser.
                  </li>
                  <li>
                    Pilih menu <strong className="text-white">"Instal aplikasi"</strong> atau <strong className="text-white">"Tambahkan ke Layar Utama"</strong>.
                  </li>
                  <li>Tekan <strong>Install / Tambahkan</strong>. Ikon ObeeCRM akan muncul di layar HP Anda.</li>
                </ol>
              </div>

              {/* iOS Guide */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                    🍎
                  </div>
                  <span className="font-bold text-white text-xs">Untuk iPhone & iPad (Safari):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 pl-1">
                  <li>Buka website ini menggunakan browser <strong>Safari</strong>.</li>
                  <li>
                    Ketuk tombol <strong>Share / Bagikan</strong> (<Share size={12} className="inline mx-1 text-blue-400" /> di bagian bawah layar).
                  </li>
                  <li>
                    Gulir ke bawah dan pilih <strong className="text-white">"Add to Home Screen"</strong> (<PlusSquare size={12} className="inline mx-1 text-slate-400" /> Tambah ke Layar Utama).
                  </li>
                  <li>Ketuk <strong>Add (Tambah)</strong> di pojok kanan atas.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Tab 2: PC / Laptop (Windows, Mac, Linux) */}
          {activeTab === 'pc' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-[10px]">
                    💻
                  </div>
                  <span className="font-bold text-white text-xs">Untuk Google Chrome & Microsoft Edge di PC:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300 pl-1">
                  <li>
                    Lihat pada <strong>Bilah Alamat (Address Bar / URL)</strong> di pojok kanan atas browser Anda.
                  </li>
                  <li>
                    Klik ikon <strong className="text-amber-400">Install App / Komputer Berpanah</strong> (<Download size={12} className="inline mx-1 text-amber-400" />) yang muncul di bilah URL.
                  </li>
                  <li>
                    Atau klik menu titik tiga (<strong>⋮</strong>) di Chrome/Edge ➔ pilih <strong className="text-white">"Install CRM OBEECREATIVES..."</strong>.
                  </li>
                  <li>
                    Aplikasi akan terpasang di desktop / Start Menu Windows & Launchpad Mac, dan berjalan mandiri tanpa tab browser!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Keuntungan Fitur PWA */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Keuntungan Menginstall:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                <span>Tampilan Layar Penuh Native</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                <span>Akses 1-Klik dari Desktop/HP</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                <span>Ringan & Caching Offline</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                <span>Bebas dari Bilah Navigasi Browser</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">PWA Standard · Service Worker V2</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
