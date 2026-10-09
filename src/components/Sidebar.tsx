import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Kanban,
  CalendarDays,
  Calculator,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  ShieldCheck,
  Download,
  BarChart3,
} from 'lucide-react';
import { UserRole } from '../types';
import { WORKSPACE_APPS_LIST } from '../data/initialData';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  clientCount: number;
  smmClientCount: number;
  onInstallPwa?: () => void;
  isInstalled?: boolean;
}

const ROLE_COLORS: Record<UserRole, { bg: string; text: string; border: string }> = {
  'Super Admin / Project Manager': { bg: 'bg-red-500/15', text: 'text-red-500', border: 'border-red-500/30' },
  'Web Dev / Site Engineer': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Admin': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Staff Creator': { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Client Partner': { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  userRole,
  onChangeRole,
  smmClientCount,
  onInstallPwa,
  isInstalled,
}) => {
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin', 'Staff Creator', 'Client Partner'] },
    { id: 'clients', label: 'Klien Hub', icon: Users, badge: smmClientCount > 0 ? `${smmClientCount} SMM` : undefined, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin', 'Staff Creator'] },
    { id: 'pipeline', label: 'Pipeline Leads', icon: Kanban, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin'] },
    { id: 'meetings', label: 'Jadwal Meeting', icon: CalendarDays, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin', 'Staff Creator', 'Client Partner'] },
    { id: 'estimasi', label: 'Estimasi RAB', icon: Calculator, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin', 'Staff Creator'] },
    { id: 'quotations', label: 'Quotation', icon: FileSpreadsheet, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin', 'Client Partner'] },
    { id: 'invoices', label: 'Invoice', icon: Receipt, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin'] },
    { id: 'payments', label: 'Pembayaran', icon: CreditCard, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin'] },
    { id: 'reports', label: 'Laporan & Ekspor', icon: BarChart3, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin'] },
    { id: 'settings', label: 'Pengaturan & Akses', icon: Settings, roles: ['Super Admin / Project Manager', 'Web Dev / Site Engineer', 'Admin'] },
  ];

  const navItems = allNavItems.filter((item) => item.roles.includes(userRole));

  const roleStyles = ROLE_COLORS[userRole] || ROLE_COLORS['Super Admin / Project Manager'];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 flex flex-col justify-between
        bg-[#0B1120] dark:bg-[#0B1120] border-r border-[#1E293B]
        ${isCollapsed ? 'w-[74px]' : 'w-[268px]'}
        hidden md:flex`}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Top Header */}
      <div>
        <div className="h-16 flex items-center px-4 justify-between border-b border-[#1E293B]">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* O Logo Brand Mark in Primary Red #E30000 */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B0F17] to-[#1E293B] border border-[#1E293B] flex items-center justify-center shrink-0 shadow-inner">
              <span className="font-black text-[#E30000] text-2xl tracking-tighter">O</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-white text-[17px] tracking-tight flex items-center gap-1">
                  obee<span className="text-[#E30000]">creatives</span>
                </span>
                <span className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase">
                  CRM · Workspace OS
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Perluas Sidebar' : 'Kecilkan Sidebar'}
            className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Quick App Switcher trigger */}
        <div className="p-3 border-b border-[#1E293B]/80 relative">
          <button
            onClick={() => setShowAppSwitcher(!showAppSwitcher)}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer
              ${showAppSwitcher ? 'bg-[#DC2626] text-white shadow-md' : 'bg-[#1E293B]/70 text-slate-200 hover:bg-[#1E293B] hover:text-white'}
              ${isCollapsed ? 'justify-center p-2.5' : 'justify-between'}`}
            title="Buka Aplikasi Workspace Lainnya"
          >
            <div className="flex items-center gap-2.5">
              <Layers size={18} className={showAppSwitcher ? 'text-white' : 'text-[#E30000]'} />
              {!isCollapsed && <span>Switch App</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[11px] font-mono opacity-90 bg-black/40 px-2 py-0.5 rounded text-slate-300">
                OS
              </span>
            )}
          </button>

          {/* Switcher Dropdown Modal */}
          {showAppSwitcher && (
            <>
              <div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
                onClick={() => setShowAppSwitcher(false)}
              />
              <div className="absolute left-3 top-16 w-68 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl z-50 p-2.5 text-slate-200">
                <div className="px-2.5 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between items-center">
                  <span>Workspace OS Ecosystem</span>
                  <span className="text-[#E30000] font-mono">11 Modul</span>
                </div>
                <div className="max-h-64 overflow-y-auto py-1.5 space-y-1">
                  {WORKSPACE_APPS_LIST.map((app) => (
                    <a
                      key={app.id}
                      href={app.url === '#' ? undefined : app.url}
                      target={app.url === '#' ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (app.current) setShowAppSwitcher(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors
                        ${app.current ? 'bg-[rgba(69,10,10,0.6)] text-[#EF4444] font-bold border border-red-900/40' : 'hover:bg-slate-800 text-slate-300'}`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{app.name}</span>
                        <span className="text-[10px] text-slate-400">{app.category}</span>
                      </div>
                      {app.current ? (
                        <span className="text-[10px] bg-red-600/30 text-red-300 px-1.5 py-0.5 rounded font-mono font-bold">
                          AKTIF
                        </span>
                      ) : (
                        <ExternalLink size={13} className="text-slate-400" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation Rail Items with Increased Font Size (text-sm font-semibold) */}
        <nav className="p-2.5 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative group cursor-pointer
                  ${
                    isActive
                      ? 'bg-[#DC2626] text-white shadow-md shadow-red-950/40 font-bold'
                      : 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}
              >
                <Icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {!isCollapsed && (
                  <span className="truncate tracking-normal flex-1 text-left">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[rgba(69,10,10,0.6)] border border-red-900/40 text-red-300 font-bold shrink-0">
                    {item.badge}
                  </span>
                )}
                {/* Tooltip in collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Install PWA Button (PC & Mobile) */}
      {!isInstalled && onInstallPwa && (
        <div className="px-3 pt-2">
          <button
            onClick={onInstallPwa}
            className={`w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`}
            title="Install CRM di PC/Laptop atau HP"
          >
            <Download size={15} className="text-[#EF4444] shrink-0" />
            {!isCollapsed && <span className="truncate">Install di HP & PC</span>}
          </button>
        </div>
      )}

      {/* Role Badges & User Footer */}
      <div className="p-3 border-t border-[#1E293B] relative">
        <button
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${roleStyles.bg} ${roleStyles.border}
            ${isCollapsed ? 'justify-center p-2.5' : 'justify-between'}`}
          title="Ganti Hak Akses / User Role"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${roleStyles.bg} ${roleStyles.text}`}>
              <ShieldCheck size={16} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left truncate">
                <span className={`text-xs font-bold truncate ${roleStyles.text}`}>
                  {userRole}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Klik ganti peran (RBAC)</span>
              </div>
            )}
          </div>
        </button>

        {/* Role Menu Selector Popup */}
        {showRoleMenu && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setShowRoleMenu(false)}
            />
            <div className="absolute left-3 bottom-16 w-68 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl z-50 p-2.5 text-slate-200">
              <div className="px-2.5 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between items-center">
                <span>Pilih Hak Akses</span>
                <span className="text-red-400 text-[10px] font-mono">RBAC</span>
              </div>
              <div className="py-1.5 space-y-1">
                {(
                  [
                    'Super Admin / Project Manager',
                    'Web Dev / Site Engineer',
                    'Admin',
                    'Staff Creator',
                    'Client Partner',
                  ] as UserRole[]
                ).map((role) => {
                  const active = userRole === role;
                  const c = ROLE_COLORS[role];
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        onChangeRole(role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer
                        ${active ? 'bg-slate-800 font-bold' : 'hover:bg-slate-800/60'}`}
                    >
                      <span className={c.text}>{role}</span>
                      {active && <span className="text-xs text-emerald-400 font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
