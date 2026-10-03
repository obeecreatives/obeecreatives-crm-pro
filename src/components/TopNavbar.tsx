import React from 'react';
import {
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Download,
  RefreshCw,
  Menu,
  Sparkles,
} from 'lucide-react';

interface TopNavbarProps {
  currentTab: string;
  isDark: boolean;
  onToggleTheme: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
  onSyncSheets: () => void;
  isSyncing: boolean;
  onOpenMobileMenu: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard Operasional', subtitle: 'Ringkasan pipeline, invoice, & follow-up klien' },
  clients: { title: 'CRM Clients Hub', subtitle: 'Source of truth direktori klien resmi obeecreatives' },
  pipeline: { title: 'Pipeline Leads', subtitle: 'Papan Kanban peluang & tracking deal' },
  meetings: { title: 'Jadwal Meeting', subtitle: 'Agenda appointment, presentasi, & site visit' },
  estimasi: { title: 'Estimasi Biaya (RAB)', subtitle: 'Kalkulator biaya produksi, infaq (2.5%) & saham (10%)' },
  quotations: { title: 'Quotation Penawaran', subtitle: 'Pembuatan surat penawaran & convert ke invoice' },
  invoices: { title: 'Invoice Tagihan', subtitle: 'Penerbitan faktur tagihan resmi & monitoring piutang' },
  payments: { title: 'Payment Confirmation', subtitle: 'Pencatatan bukti bayar masuk & auto-lunas invoice' },
  sync: { title: 'Integrasi Google Sheets', subtitle: 'Koneksi modular GAS V2 & backup database' },
  settings: { title: 'Pengaturan & Hak Akses (RBAC)', subtitle: 'Kelola hak akses pengguna, integrasi Google Spreadsheet V2 & cadangan data' },
};

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  isDark,
  onToggleTheme,
  isFullscreen,
  onToggleFullscreen,
  canInstallPwa,
  onInstallPwa,
  onSyncSheets,
  isSyncing,
  onOpenMobileMenu,
}) => {
  const tabInfo = TAB_TITLES[currentTab] || { title: 'CRM OBEECREATIVES', subtitle: 'Unified Workspace OS' };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#0F172A]/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-[#1E293B] px-4 lg:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg bg-[#1E293B] text-slate-200 hover:text-white"
          title="Buka Menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-red-400 bg-[rgba(69,10,10,0.6)] px-2 py-0.5 rounded border border-red-900/50">
              CRM HUB
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">/</span>
            <h1 className="text-sm md:text-base font-bold text-white tracking-tight truncate">
              {tabInfo.title}
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block truncate">
            {tabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions (Sync, Fullscreen, Install PWA, Theme Switcher) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Tarik Data Sheet Asli Button (Action Red #DC2626) */}
        <button
          onClick={onSyncSheets}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DC2626] hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          title="Tarik Data Sheet Asli dari Google Apps Script"
        >
          <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
          <span className="hidden md:inline">Tarik Data Sheet Asli</span>
          <span className="md:hidden">Sync</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Fullscreen)'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Install PWA Button */}
        {canInstallPwa && (
          <button
            onClick={onInstallPwa}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-amber-500/30 transition-all cursor-pointer"
            title="Install Web Apps di Komputer atau HP Anda"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
          title={isDark ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Active Engine Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#1E293B]/70 border border-[#1E293B] text-[10px] text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>GAS V2 Ready</span>
        </div>
      </div>
    </header>
  );
};
