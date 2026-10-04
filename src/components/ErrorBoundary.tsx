import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.removeItem('obee_crm_clients');
      localStorage.removeItem('obee_equipment');
      localStorage.removeItem('obee_leads');
      localStorage.removeItem('obee_meetings');
      localStorage.removeItem('obee_estimasi');
      localStorage.removeItem('obee_quotations');
      localStorage.removeItem('obee_invoices');
      localStorage.removeItem('obee_payments');
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((r) => r.unregister());
        });
      }
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((k) => caches.delete(k));
        });
      }
    } catch (e) {
      console.warn('Reset cache error', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#1E293B] border border-red-900/60 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Terjadi Kendala Memuat Aplikasi
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aplikasi mengalami galat saat memuat data. Silakan muat ulang atau pulihkan data cache awal.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left font-mono text-[11px] text-red-300 max-h-32 overflow-y-auto break-all">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Muat Ulang Halaman</span>
              </button>
              <button
                onClick={this.handleResetCache}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                <Trash2 size={14} className="text-amber-400" />
                <span>Reset Cache & Data</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
