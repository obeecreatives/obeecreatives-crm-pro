import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Kanban,
  CalendarDays,
  Plus,
  X,
  Calculator,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  Database,
  Settings,
  Layers,
  ShieldCheck,
  ExternalLink,
  Download,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import { UserRole } from '../types';
import { WORKSPACE_APPS_LIST } from '../data/initialData';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onQuickAdd: (type: 'client' | 'lead' | 'meeting' | 'estimasi' | 'quotation' | 'invoice') => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onInstallPwa?: () => void;
  isInstalled?: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  onQuickAdd,
  userRole,
  onChangeRole,
  onInstallPwa,
  isInstalled,
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Klien', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: Kanban },
    { id: 'meetings', label: 'Jadwal', icon: CalendarDays },
  ];

  const rawTabs = [
    { id: 'dashboard', label: 'Dashboard Operasional', icon: LayoutDashboard, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin', 'Staff Creator', 'Client Partner'] },
    { id: 'clients', label: 'Klien Hub (CRM)', icon: Users, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin', 'Staff Creator'] },
    { id: 'pipeline', label: 'Pipeline Leads', icon: Kanban, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin'] },
    { id: 'meetings', label: 'Jadwal Meeting', icon: CalendarDays, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin', 'Staff Creator', 'Client Partner'] },
    { id: 'estimasi', label: 'Estimasi Biaya (RAB)', icon: Calculator, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin', 'Staff Creator'] },
    { id: 'quotations', label: 'Quotation Penawaran', icon: FileSpreadsheet, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin', 'Client Partner'] },
    { id: 'invoices', label: 'Invoice Tagihan', icon: Receipt, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin'] },
    { id: 'payments', label: 'Payment Confirmation', icon: CreditCard, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin'] },
    { id: 'reports', label: 'Laporan & Ekspor Agensi', icon: BarChart3, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin'] },
    { id: 'guide', label: 'Panduan Staff (SOP)', icon: BookOpen, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin', 'Staff Creator'] },
    { id: 'settings', label: 'Pengaturan & Akses (RBAC)', icon: Settings, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin'] },
  ];

  const allTabs = rawTabs.filter((t) => t.roles.includes(userRole));

  return (
    <>
      {/* Bottom Bar for Mobile thumb navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-lg border-t border-[#1E293B] px-3 py-2 flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-colors cursor-pointer
                ${isActive ? 'text-[#EF4444]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Icon size={20} className={isActive ? 'text-[#DC2626]' : ''} />
              <span className={`text-[10px] ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Center Quick Action '+' Button */}
        <button
          onClick={() => setShowQuickMenu(!showQuickMenu)}
          className="w-10 h-10 -mt-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center shadow-lg shadow-red-900/50 hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
          title="Tambah Cepat"
        >
          <Plus size={22} className={showQuickMenu ? 'rotate-45 transition-transform' : ''} />
        </button>
      </nav>

      {/* Quick Action Bottom Sheet */}
      {showQuickMenu && (
        <>
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowQuickMenu(false)}
          />
          <div className="md:hidden fixed bottom-16 left-4 right-4 z-50 bg-[#1E293B] border border-slate-700 rounded-2xl p-4 shadow-2xl space-y-2 text-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Aksi Cepat Input
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAdd('client');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left font-semibold"
              >
                <Users size={16} className="text-red-400" />
                <span>+ Klien Baru</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAdd('lead');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left font-semibold"
              >
                <Kanban size={16} className="text-blue-400" />
                <span>+ Lead Prospek</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAdd('meeting');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left font-semibold"
              >
                <CalendarDays size={16} className="text-amber-400" />
                <span>+ Jadwal Meeting</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAdd('estimasi');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left font-semibold"
              >
                <Calculator size={16} className="text-emerald-400" />
                <span>+ Estimasi RAB</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAdd('quotation');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left font-semibold"
              >
                <FileSpreadsheet size={16} className="text-purple-400" />
                <span>+ Quotation</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAdd('invoice');
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left font-semibold"
              >
                <Receipt size={16} className="text-rose-400" />
                <span>+ Invoice</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Slide-over Mobile Drawer for all 9 modules */}
      {isOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <div className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#0B1120] border-r border-[#1E293B] p-4 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B0F17] to-[#1E293B] border border-[#1E293B] flex items-center justify-center">
                    <span className="font-extrabold text-[#E30000] text-xl">O</span>
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">
                      obee<span className="text-[#E30000]">creatives</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Unified Workspace OS</div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Module Nav Links */}
              <div className="py-4 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-1">
                  Modul CRM
                </div>
                {allTabs.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                        ${isActive ? 'bg-[#DC2626] text-white shadow-md' : 'text-slate-300 hover:bg-slate-800/80'}`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {/* Install App Button in Mobile Drawer */}
                {!isInstalled && onInstallPwa && (
                  <button
                    onClick={() => {
                      onClose();
                      onInstallPwa();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 transition-colors mt-2"
                  >
                    <Download size={16} className="text-[#EF4444]" />
                    <span>Install Aplikasi (HP & PC)</span>
                  </button>
                )}
              </div>

              {/* Ecosystem App Switcher Links */}
              <div className="pt-3 border-t border-[#1E293B] space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-1 flex items-center gap-1.5">
                  <Layers size={12} className="text-[#E30000]" />
                  <span>Aplikasi Ekosistem Lain</span>
                </div>
                {WORKSPACE_APPS_LIST.slice(1, 6).map((app) => (
                  <a
                    key={app.id}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800"
                  >
                    <span>{app.name}</span>
                    <ExternalLink size={12} className="text-slate-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Footer Role Badge */}
            <div className="pt-4 border-t border-[#1E293B]">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <ShieldCheck size={16} className="text-red-400" />
                <div className="text-left truncate">
                  <div className="text-xs font-bold text-slate-200 truncate">{userRole}</div>
                  <div className="text-[9px] text-slate-400">Hak Akses Aktif</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
