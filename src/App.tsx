/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_CLIENTS,
  INITIAL_EQUIPMENT,
  INITIAL_LEADS,
  INITIAL_MEETINGS,
  INITIAL_ESTIMASI,
  INITIAL_QUOTATIONS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
} from './data/initialData';
import {
  Client,
  Lead,
  Meeting,
  EquipmentItem,
  Estimasi,
  Quotation,
  Invoice,
  PaymentConfirmation,
  UserRole,
  MeetingStatus,
  LeadStage,
  QuotationStatus,
  InvoiceStatus,
  PaymentStatus,
} from './types';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { MobileNav } from './components/MobileNav';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ClientsView } from './components/views/ClientsView';
import { PipelineView } from './components/views/PipelineView';
import { MeetingsView } from './components/views/MeetingsView';
import { EstimasiView } from './components/views/EstimasiView';
import { QuotationsView } from './components/views/QuotationsView';
import { InvoicesView } from './components/views/InvoicesView';
import { PaymentsView } from './components/views/PaymentsView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { ClientModal } from './components/modals/ClientModal';
import { LeadModal } from './components/modals/LeadModal';
import { MeetingModal } from './components/modals/MeetingModal';
import { EstimasiModal } from './components/modals/EstimasiModal';
import { QuotationModal } from './components/modals/QuotationModal';
import { InvoiceModal } from './components/modals/InvoiceModal';
import { PaymentModal } from './components/modals/PaymentModal';
import { DocumentPreviewModal } from './components/modals/DocumentPreviewModal';
import { GasScriptModal } from './components/modals/GasScriptModal';
import { ConfirmDeleteModal } from './components/modals/ConfirmDeleteModal';

import { DEFAULT_GAS_CRM_URL, testGasConnection, fetchAllSheetsData } from './utils/gasApi';

function safeLoadArray<T>(key: string, fallback: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Theme state: Default Dark Mode as requested
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('obee_theme');
      return saved !== null ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  // State with LocalStorage Persistence
  const [clients, setClients] = useState<Client[]>(() => safeLoadArray('obee_crm_clients', INITIAL_CLIENTS));
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(() => safeLoadArray('obee_equipment', INITIAL_EQUIPMENT));
  const [leads, setLeads] = useState<Lead[]>(() => safeLoadArray('obee_leads', INITIAL_LEADS));
  const [meetings, setMeetings] = useState<Meeting[]>(() => safeLoadArray('obee_meetings', INITIAL_MEETINGS));
  const [estimasiList, setEstimasiList] = useState<Estimasi[]>(() => safeLoadArray('obee_estimasi', INITIAL_ESTIMASI));
  const [quotations, setQuotations] = useState<Quotation[]>(() => safeLoadArray('obee_quotations', INITIAL_QUOTATIONS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => safeLoadArray('obee_invoices', INITIAL_INVOICES));
  const [payments, setPayments] = useState<PaymentConfirmation[]>(() => safeLoadArray('obee_payments', INITIAL_PAYMENTS));

  const [userRole, setUserRole] = useState<UserRole>('Super Admin / Project Manager');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  // PWA installability
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);

  // Modals active state
  const [clientModal, setClientModal] = useState<{ open: boolean; initial?: Client | null }>({ open: false });
  const [leadModal, setLeadModal] = useState<{ open: boolean; initial?: Lead | null }>({ open: false });
  const [meetingModal, setMeetingModal] = useState<{ open: boolean; initial?: Meeting | null }>({ open: false });
  const [estimasiModal, setEstimasiModal] = useState<{ open: boolean; initial?: Estimasi | null }>({ open: false });
  const [quotationModal, setQuotationModal] = useState<{ open: boolean; initial?: Quotation | null }>({ open: false });
  const [invoiceModal, setInvoiceModal] = useState<{ open: boolean; initial?: Invoice | null }>({ open: false });
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; initial?: PaymentConfirmation | null }>({ open: false });

  // Preview & Utility modals
  const [previewModal, setPreviewModal] = useState<{
    open: boolean;
    type: 'quotation' | 'invoice' | 'payment' | 'estimasi';
    data?: any;
    client?: Client;
  }>({ open: false, type: 'quotation' });

  const [gasScriptModalOpen, setGasScriptModalOpen] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    title: string;
    message: string;
    itemLabel?: string;
    onConfirm: () => void;
  }>({ open: false, title: '', message: '', onConfirm: () => {} });

  // Save changes to localStorage safely
  useEffect(() => {
    try { localStorage.setItem('obee_crm_clients', JSON.stringify(clients)); } catch {}
  }, [clients]);

  useEffect(() => {
    try { localStorage.setItem('obee_equipment', JSON.stringify(equipmentList)); } catch {}
  }, [equipmentList]);

  useEffect(() => {
    try { localStorage.setItem('obee_leads', JSON.stringify(leads)); } catch {}
  }, [leads]);

  useEffect(() => {
    try { localStorage.setItem('obee_meetings', JSON.stringify(meetings)); } catch {}
  }, [meetings]);

  useEffect(() => {
    try { localStorage.setItem('obee_estimasi', JSON.stringify(estimasiList)); } catch {}
  }, [estimasiList]);

  useEffect(() => {
    try { localStorage.setItem('obee_quotations', JSON.stringify(quotations)); } catch {}
  }, [quotations]);

  useEffect(() => {
    try { localStorage.setItem('obee_invoices', JSON.stringify(invoices)); } catch {}
  }, [invoices]);

  useEffect(() => {
    try { localStorage.setItem('obee_payments', JSON.stringify(payments)); } catch {}
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem('obee_theme', isDark ? 'dark' : 'light');
    } catch {}
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-[#0B0F17] text-slate-100 antialiased selection:bg-red-500/20 selection:text-[#EF4444]';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-[#F8FAFC] text-slate-900 antialiased selection:bg-red-500/20 selection:text-[#EF4444]';
    }
  }, [isDark]);

  // Toast notifier helper
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // PWA Service Worker & Install Listener
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch(() => {
          // SW registration failed gracefully
        });
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('Aplikasi berhasil diinstall di perangkat Anda!');
      setCanInstallPwa(false);
    }
    setDeferredPrompt(null);
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Sync Sheets handler
  const handleSyncSheets = async () => {
    setIsSyncing(true);
    showToast('Menghubungkan ke Google Apps Script...', 'info');

    const result = await fetchAllSheetsData(DEFAULT_GAS_CRM_URL);
    setIsSyncing(false);

    if (result.status === 'success' && result.data) {
      if (Array.isArray(result.data.clients)) {
        setClients(result.data.clients);
      }
      if (Array.isArray(result.data.leads)) {
        setLeads(result.data.leads);
      }
      if (Array.isArray(result.data.invoices)) {
        setInvoices(result.data.invoices);
      }
      if (Array.isArray(result.data.quotations)) {
        setQuotations(result.data.quotations);
      }
      if (Array.isArray(result.data.meetings)) {
        setMeetings(result.data.meetings);
      }
      if (Array.isArray(result.data.estimasi)) {
        setEstimasiList(result.data.estimasi);
      }
      if (Array.isArray(result.data.paymentConfirmations)) {
        setPayments(result.data.paymentConfirmations);
      }
      const clientCount = result.data.clients?.length || 0;
      const invoiceCount = result.data.invoices?.length || 0;
      const estimasiCount = result.data.estimasi?.length || 0;
      showToast(`Data sheet asli berhasil disinkronkan (${clientCount} klien, ${invoiceCount} invoice, ${estimasiCount} estimasi)!`, 'success');
    } else if (result.code === 'ACCESS_DENIED') {
      showToast('Akses Ditolak oleh Apps Script: ubah setting ke "Anyone" dan pasang skrip V2.', 'error');
      setGasScriptModalOpen(true);
    } else {
      showToast(result.message || 'Gagal menarik data dari Apps Script.', 'error');
      setGasScriptModalOpen(true);
    }
  };

  /* ================= CLIENT ACTIONS ================= */
  const handleSaveClient = (client: Client) => {
    setClients((prev) => {
      const exists = prev.some((c) => c.id === client.id);
      return exists ? prev.map((c) => (c.id === client.id ? client : c)) : [client, ...prev];
    });
    setClientModal({ open: false });
    showToast('Data klien berhasil disimpan!');
  };

  const handleDeleteClient = (client: Client) => {
    setConfirmDelete({
      open: true,
      title: 'Hapus Klien Ini?',
      message: 'Perhatian: Menghapus klien ini juga akan menghapus seluruh data pipeline leads, jadwal, estimasi, quotation, dan tagihan invoice yang terhubung (Cascade Delete).',
      itemLabel: client.company || client.name,
      onConfirm: () => {
        setClients((prev) => prev.filter((c) => c.id !== client.id));
        setLeads((prev) => prev.filter((l) => l.clientId !== client.id));
        setMeetings((prev) => prev.filter((m) => m.clientId !== client.id));
        setEstimasiList((prev) => prev.filter((e) => e.clientId !== client.id));
        setQuotations((prev) => prev.filter((q) => q.clientId !== client.id));
        setInvoices((prev) => prev.filter((i) => i.clientId !== client.id));
        setPayments((prev) => prev.filter((p) => p.clientId !== client.id));
        setConfirmDelete({ open: false, title: '', message: '', onConfirm: () => {} });
        showToast('Klien dan seluruh data terkait telah dihapus.');
      },
    });
  };

  /* ================= LEAD ACTIONS ================= */
  const handleSaveLead = (lead: Lead) => {
    setLeads((prev) => {
      const exists = prev.some((l) => l.id === lead.id);
      return exists ? prev.map((l) => (l.id === lead.id ? lead : l)) : [lead, ...prev];
    });
    setLeadModal({ open: false });
    showToast('Data pipeline lead berhasil disimpan!');
  };

  const handleDeleteLead = (lead: Lead) => {
    setConfirmDelete({
      open: true,
      title: 'Hapus Lead Ini?',
      message: 'Peluang proyek ini akan dihapus dari papan Kanban pipeline.',
      itemLabel: lead.title,
      onConfirm: () => {
        setLeads((prev) => prev.filter((l) => l.id !== lead.id));
        setConfirmDelete({ open: false, title: '', message: '', onConfirm: () => {} });
        showToast('Lead berhasil dihapus.');
      },
    });
  };

  const handleMoveStage = (leadId: string, stage: LeadStage) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage } : l)));
    showToast(`Lead dipindahkan ke stage ${stage}`);
  };

  /* ================= MEETING ACTIONS ================= */
  const handleSaveMeeting = (meeting: Meeting) => {
    setMeetings((prev) => {
      const exists = prev.some((m) => m.id === meeting.id);
      return exists ? prev.map((m) => (m.id === meeting.id ? meeting : m)) : [meeting, ...prev];
    });
    setMeetingModal({ open: false });
    showToast('Jadwal meeting berhasil dicatat!');
  };

  const handleDeleteMeeting = (meeting: Meeting) => {
    setConfirmDelete({
      open: true,
      title: 'Hapus Jadwal Meeting?',
      message: 'Jadwal ini akan dihapus permanen dari kalender agenda.',
      itemLabel: meeting.title,
      onConfirm: () => {
        setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
        setConfirmDelete({ open: false, title: '', message: '', onConfirm: () => {} });
        showToast('Jadwal meeting dihapus.');
      },
    });
  };

  const handleUpdateMeetingStatus = (meetingId: string, status: MeetingStatus) => {
    setMeetings((prev) => prev.map((m) => (m.id === meetingId ? { ...m, status } : m)));
    showToast(`Status meeting diubah ke ${status}`);
  };

  /* ================= ESTIMASI BIAYA (RAB) ACTIONS ================= */
  const handleSaveEstimasi = (estimasi: Estimasi) => {
    setEstimasiList((prev) => {
      const exists = prev.some((e) => e.id === estimasi.id);
      return exists ? prev.map((e) => (e.id === estimasi.id ? estimasi : e)) : [estimasi, ...prev];
    });
    showToast('Estimasi RAB berhasil disimpan!');
  };

  const handleDeleteEstimasi = (estimasi: Estimasi) => {
    setConfirmDelete({
      open: true,
      title: 'Hapus Estimasi RAB?',
      message: 'Dokumen estimasi ini akan dihapus dari sistem.',
      itemLabel: estimasi.jenisJasa,
      onConfirm: () => {
        setEstimasiList((prev) => prev.filter((e) => e.id !== estimasi.id));
        setConfirmDelete({ open: false, title: '', message: '', onConfirm: () => {} });
        showToast('Estimasi dihapus.');
      },
    });
  };

  // Convert Estimasi to Quotation
  const handleConvertEstimasiToQuotation = (estimasi: Estimasi) => {
    const client = clients.find((c) => c.id === estimasi.clientId);
    const newQuotation: Quotation = {
      id: `QUO-${Date.now().toString().slice(-6)}`,
      clientId: estimasi.clientId,
      quotationNumber: `60${Math.floor(Math.random() * 90 + 10)}/QUO/OV/OC/X/2026`,
      quotationDate: new Date().toISOString().slice(0, 10),
      paymentTerms: 'Bank Transfer (BCA)',
      purchaseOrder: '',
      orderNumber: '',
      proposeToName: client ? (client.company || client.name) : 'Klien',
      proposeToAttn: client ? client.name : '',
      servicePeriod: estimasi.jadwal || 'OKTOBER 2026',
      items: (estimasi.items || []).map((it) => ({
        productNumber: it.kategori,
        description: it.nama,
        qty: it.qty,
        unit: 'Package',
        unitPrice: it.hargaSatuan,
        taxRate: 0,
      })),
      discount: 0,
      status: 'Draft',
      notes: `Dibuat dari Estimasi Biaya (${estimasi.id}) untuk jasa: ${estimasi.jenisJasa}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setQuotations((prev) => [newQuotation, ...prev]);
    setEstimasiList((prev) =>
      prev.map((e) => (e.id === estimasi.id ? { ...e, status: 'Dikonversi ke Quotation', quotationId: newQuotation.id } : e))
    );
    showToast('Estimasi berhasil dikonversi menjadi Quotation baru!', 'success');
    setCurrentTab('quotations');
    setQuotationModal({ open: true, initial: newQuotation });
  };

  /* ================= QUOTATION ACTIONS ================= */
  const handleSaveQuotation = (quotation: Quotation) => {
    setQuotations((prev) => {
      const exists = prev.some((q) => q.id === quotation.id);
      return exists ? prev.map((q) => (q.id === quotation.id ? quotation : q)) : [quotation, ...prev];
    });
    showToast('Quotation penawaran berhasil disimpan!');
  };

  const handleDeleteQuotation = (quotation: Quotation) => {
    setConfirmDelete({
      open: true,
      title: 'Hapus Quotation?',
      message: 'Dokumen surat penawaran ini akan dihapus dari arsip.',
      itemLabel: quotation.quotationNumber,
      onConfirm: () => {
        setQuotations((prev) => prev.filter((q) => q.id !== quotation.id));
        setConfirmDelete({ open: false, title: '', message: '', onConfirm: () => {} });
        showToast('Quotation dihapus.');
      },
    });
  };

  const handleUpdateQuotationStatus = (quotationId: string, status: QuotationStatus) => {
    setQuotations((prev) => prev.map((q) => (q.id === quotationId ? { ...q, status } : q)));
    showToast(`Status quotation diubah ke ${status}`);
  };

  // Convert Quotation to Invoice
  const handleConvertQuotationToInvoice = (quotation: Quotation) => {
    const newInvoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      clientId: quotation.clientId,
      invoiceNumber: `70${Math.floor(Math.random() * 90 + 10)}/INV/BKR/OC/X/2026`,
      invoiceDate: new Date().toISOString().slice(0, 10),
      poNumber: quotation.purchaseOrder || '',
      orderNumber: quotation.orderNumber || '',
      paymentTerms: quotation.paymentTerms || 'Bank Transfer (BCA)',
      billToName: quotation.proposeToName,
      billToAddress: quotation.proposeToAttn || '',
      servicePeriod: quotation.servicePeriod,
      items: [...quotation.items],
      discount: quotation.discount,
      status: 'Belum Dibayar',
      notes: quotation.notes || 'Pembayaran via transfer BCA 0190448703 a/c Lalu Mahendra Ali Akbar.',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    showToast('Quotation berhasil disalin ke Invoice baru!', 'success');
    setCurrentTab('invoices');
    setInvoiceModal({ open: true, initial: newInvoice });
  };

  /* ================= INVOICE ACTIONS ================= */
  const handleSaveInvoice = (invoice: Invoice) => {
    setInvoices((prev) => {
      const exists = prev.some((i) => i.id === invoice.id);
      return exists ? prev.map((i) => (i.id === invoice.id ? invoice : i)) : [invoice, ...prev];
    });
    showToast('Faktur invoice berhasil disimpan!');
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setConfirmDelete({
      open: true,
      title: 'Hapus Faktur Invoice?',
      message: 'Invoice tagihan ini akan dihapus dari pembukuan piutang.',
      itemLabel: invoice.invoiceNumber,
      onConfirm: () => {
        setInvoices((prev) => prev.filter((i) => i.id !== invoice.id));
        setConfirmDelete({ open: false, title: '', message: '', onConfirm: () => {} });
        showToast('Invoice dihapus.');
      },
    });
  };

  const handleUpdateInvoiceStatus = (invoiceId: string, status: InvoiceStatus) => {
    setInvoices((prev) => prev.map((i) => (i.id === invoiceId ? { ...i, status } : i)));
    showToast(`Status invoice diubah ke ${status}`);
  };

  // Create Payment Confirmation from Invoice
  const handleCreatePaymentFromInvoice = (invoice: Invoice) => {
    const newPayment: PaymentConfirmation = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      clientId: invoice.clientId,
      invoiceId: invoice.id,
      confirmationNumber: `30${Math.floor(Math.random() * 90 + 10)}/PC/PH-OC/X/2026`,
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentMethod: 'Bank Transfer',
      confirmToName: invoice.billToName,
      confirmToAttn: '',
      serviceTerm: invoice.servicePeriod ? `Periode ${invoice.servicePeriod}` : 'Lunas',
      items: [...invoice.items],
      discount: invoice.discount,
      bankSource: 'BCA (Klien)',
      bankBenef: 'BCA 0190448703 a/c Lalu Mahendra',
      status: 'Paid Off',
      notes: `Pembayaran lunas untuk tagihan nomor ${invoice.invoiceNumber}.`,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setPayments((prev) => [newPayment, ...prev]);
    // Auto-update invoice status to Lunas
    setInvoices((prev) => prev.map((i) => (i.id === invoice.id ? { ...i, status: 'Lunas' } : i)));
    showToast('Bukti pembayaran dibuat & Invoice otomatis ditandai Lunas!', 'success');
    setCurrentTab('payments');
    setPaymentModal({ open: true, initial: newPayment });
  };

  /* ================= PAYMENT ACTIONS ================= */
  const handleSavePayment = (payment: PaymentConfirmation) => {
    setPayments((prev) => {
      const exists = prev.some((p) => p.id === payment.id);
      return exists ? prev.map((p) => (p.id === payment.id ? payment : p)) : [payment, ...prev];
    });

    // Auto-mark linked invoice as Lunas if Paid Off
    if (payment.invoiceId && payment.status === 'Paid Off') {
      setInvoices((prev) =>
        prev.map((i) => (i.id === payment.invoiceId ? { ...i, status: 'Lunas' } : i))
      );
    }

    showToast('Bukti konfirmasi pembayaran berhasil disimpan!');
  };

  const handleDeletePayment = (payment: PaymentConfirmation) => {
    setConfirmDelete({
      open: true,
      title: 'Hapus Bukti Pembayaran?',
      message: 'Catatan konfirmasi pembayaran ini akan dihapus dari arsip kas masuk.',
      itemLabel: payment.confirmationNumber,
      onConfirm: () => {
        setPayments((prev) => prev.filter((p) => p.id !== payment.id));
        setConfirmDelete({ open: false, title: '', message: '', onConfirm: () => {} });
        showToast('Bukti bayar dihapus.');
      },
    });
  };

  const handleUpdatePaymentStatus = (paymentId: string, status: PaymentStatus) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          if (p.invoiceId && status === 'Paid Off') {
            setInvoices((invs) => invs.map((i) => (i.id === p.invoiceId ? { ...i, status: 'Lunas' } : i)));
          }
          return { ...p, status };
        }
        return p;
      })
    );
    showToast(`Status pembayaran diubah ke ${status}`);
  };

  /* ================= BACKUP & RESTORE ================= */
  const handleExportBackup = () => {
    const backupData = {
      version: 'obee-crm-v2',
      exportedAt: new Date().toISOString(),
      clients,
      leads,
      meetings,
      estimasiList,
      quotations,
      invoices,
      payments,
      equipmentList,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_crm_obeecreatives_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Cadangan berkas JSON berhasil diunduh.');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.clients) setClients(json.clients);
        if (json.leads) setLeads(json.leads);
        if (json.meetings) setMeetings(json.meetings);
        if (json.estimasiList) setEstimasiList(json.estimasiList);
        if (json.quotations) setQuotations(json.quotations);
        if (json.invoices) setInvoices(json.invoices);
        if (json.payments) setPayments(json.payments);
        if (json.equipmentList) setEquipmentList(json.equipmentList);
        showToast('Data cadangan berhasil dipulihkan!');
      } catch (err) {
        showToast('Berkas JSON tidak valid atau rusak.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefault = () => {
    setConfirmDelete({
      open: true,
      title: 'Reset ke Data Awal Bawaan?',
      message: 'Tindakan ini akan mengembalikan data ke 10 Klien awal dan 130 Inventaris Equipment Hub asli.',
      onConfirm: () => {
        setClients(INITIAL_CLIENTS);
        setEquipmentList(INITIAL_EQUIPMENT);
        setLeads(INITIAL_LEADS);
        setMeetings(INITIAL_MEETINGS);
        setEstimasiList(INITIAL_ESTIMASI);
        setQuotations(INITIAL_QUOTATIONS);
        setInvoices(INITIAL_INVOICES);
        setPayments(INITIAL_PAYMENTS);
        setConfirmDelete({ open: false, title: '', message: '', onConfirm: () => {} });
        showToast('Database berhasil direset ke data awal resmi.');
      },
    });
  };

  const smmClientCount = clients.filter((c) => c.division === 'Social Media Management').length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0B0F17] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* Sidebar Rail (Desktop) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        userRole={userRole}
        onChangeRole={setUserRole}
        clientCount={clients.length}
        smmClientCount={smmClientCount}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 min-h-screen flex flex-col justify-between
          ${isSidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[250px]'}`}
      >
        <div>
          {/* Top Navbar */}
          <TopNavbar
            currentTab={currentTab}
            isDark={isDark}
            onToggleTheme={() => setIsDark(!isDark)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            canInstallPwa={canInstallPwa}
            onInstallPwa={handleInstallPwa}
            onSyncSheets={handleSyncSheets}
            isSyncing={isSyncing}
            onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          />

          {/* Main View Container */}
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-24 md:pb-12">
            {currentTab === 'dashboard' && (
              <DashboardView
                clients={clients}
                leads={leads}
                meetings={meetings}
                invoices={invoices}
                payments={payments}
                quotations={quotations}
                estimasiList={estimasiList}
                onNavigateTab={setCurrentTab}
                onOpenClient={(client) => setClientModal({ open: true, initial: client })}
                onNewClient={() => setClientModal({ open: true })}
                onNewMeeting={() => setMeetingModal({ open: true })}
              />
            )}

            {currentTab === 'clients' && (
              <ClientsView
                clients={clients}
                leads={leads}
                invoices={invoices}
                meetings={meetings}
                onAddClient={() => setClientModal({ open: true })}
                onEditClient={(client) => setClientModal({ open: true, initial: client })}
                onDeleteClient={handleDeleteClient}
              />
            )}

            {currentTab === 'pipeline' && (
              <PipelineView
                leads={leads}
                clients={clients}
                onAddLead={() => setLeadModal({ open: true })}
                onEditLead={(lead) => setLeadModal({ open: true, initial: lead })}
                onDeleteLead={handleDeleteLead}
                onMoveStage={handleMoveStage}
              />
            )}

            {currentTab === 'meetings' && (
              <MeetingsView
                meetings={meetings}
                clients={clients}
                onAddMeeting={() => setMeetingModal({ open: true })}
                onEditMeeting={(meeting) => setMeetingModal({ open: true, initial: meeting })}
                onDeleteMeeting={handleDeleteMeeting}
                onUpdateStatus={handleUpdateMeetingStatus}
              />
            )}

            {currentTab === 'estimasi' && (
              <EstimasiView
                estimasiList={estimasiList}
                clients={clients}
                onAddEstimasi={() => setEstimasiModal({ open: true })}
                onEditEstimasi={(est) => setEstimasiModal({ open: true, initial: est })}
                onDeleteEstimasi={handleDeleteEstimasi}
                onConvertQuotation={handleConvertEstimasiToQuotation}
                onPrintPreview={(est) => {
                  const client = clients.find((c) => c.id === est.clientId);
                  setPreviewModal({ open: true, type: 'estimasi', data: est, client });
                }}
              />
            )}

            {currentTab === 'quotations' && (
              <QuotationsView
                quotations={quotations}
                clients={clients}
                onAddQuotation={() => setQuotationModal({ open: true })}
                onEditQuotation={(quo) => setQuotationModal({ open: true, initial: quo })}
                onDeleteQuotation={handleDeleteQuotation}
                onConvertToInvoice={handleConvertQuotationToInvoice}
                onPrintPreview={(quo) => {
                  const client = clients.find((c) => c.id === quo.clientId);
                  setPreviewModal({ open: true, type: 'quotation', data: quo, client });
                }}
                onUpdateStatus={handleUpdateQuotationStatus}
              />
            )}

            {currentTab === 'invoices' && (
              <InvoicesView
                invoices={invoices}
                clients={clients}
                onAddInvoice={() => setInvoiceModal({ open: true })}
                onEditInvoice={(inv) => setInvoiceModal({ open: true, initial: inv })}
                onDeleteInvoice={handleDeleteInvoice}
                onCreatePayment={handleCreatePaymentFromInvoice}
                onPrintPreview={(inv) => {
                  const client = clients.find((c) => c.id === inv.clientId);
                  setPreviewModal({ open: true, type: 'invoice', data: inv, client });
                }}
                onUpdateStatus={handleUpdateInvoiceStatus}
              />
            )}

            {currentTab === 'payments' && (
              <PaymentsView
                payments={payments}
                clients={clients}
                invoices={invoices}
                onAddPayment={() => setPaymentModal({ open: true })}
                onEditPayment={(pay) => setPaymentModal({ open: true, initial: pay })}
                onDeletePayment={handleDeletePayment}
                onPrintPreview={(pay) => {
                  const client = clients.find((c) => c.id === pay.clientId);
                  setPreviewModal({ open: true, type: 'payment', data: pay, client });
                }}
                onUpdateStatus={handleUpdatePaymentStatus}
              />
            )}

            {(currentTab === 'settings' || currentTab === 'sync') && (
              <SettingsView
                userRole={userRole}
                onChangeRole={setUserRole}
                onSyncSheets={handleSyncSheets}
                isSyncing={isSyncing}
                onOpenScriptModal={() => setGasScriptModalOpen(true)}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                onResetDefault={handleResetDefault}
                clientCount={clients.length}
                equipmentCount={equipmentList.length}
              />
            )}
          </main>
        </div>

        {/* Quiet Professional Footer */}
        <footer className="px-6 py-4 border-t border-[#1E293B] text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-400">CRM OBEECREATIVES</span>
            <span>·</span>
            <span>Unified Workspace OS V2</span>
          </div>
          <div>
            Developed by <span className="font-semibold text-slate-400">lalumahendra/obeecreatives</span>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation & Drawer */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onQuickAdd={(type) => {
          if (type === 'client') setClientModal({ open: true });
          if (type === 'lead') setLeadModal({ open: true });
          if (type === 'meeting') setMeetingModal({ open: true });
          if (type === 'estimasi') setEstimasiModal({ open: true });
          if (type === 'quotation') setQuotationModal({ open: true });
          if (type === 'invoice') setInvoiceModal({ open: true });
        }}
        userRole={userRole}
        onChangeRole={setUserRole}
      />

      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 border
            ${
              toast.type === 'error'
                ? 'bg-red-600 text-white border-red-500'
                : toast.type === 'info'
                ? 'bg-[#1E293B] text-amber-300 border-amber-500/40'
                : 'bg-[#1E293B] text-white border-slate-700'
            }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="opacity-70 hover:opacity-100 ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Modals Mounting */}
      {clientModal.open && (
        <ClientModal
          initial={clientModal.initial}
          onSave={handleSaveClient}
          onClose={() => setClientModal({ open: false })}
        />
      )}

      {leadModal.open && (
        <LeadModal
          initial={leadModal.initial}
          clients={clients}
          onSave={handleSaveLead}
          onClose={() => setLeadModal({ open: false })}
        />
      )}

      {meetingModal.open && (
        <MeetingModal
          initial={meetingModal.initial}
          clients={clients}
          onSave={handleSaveMeeting}
          onClose={() => setMeetingModal({ open: false })}
        />
      )}

      {estimasiModal.open && (
        <EstimasiModal
          initial={estimasiModal.initial}
          clients={clients}
          equipmentList={equipmentList}
          onSave={handleSaveEstimasi}
          onClose={() => setEstimasiModal({ open: false })}
          onConvert={handleConvertEstimasiToQuotation}
          onPrintPreview={(est) => {
            const client = clients.find((c) => c.id === est.clientId);
            setPreviewModal({ open: true, type: 'estimasi', data: est, client });
          }}
        />
      )}

      {quotationModal.open && (
        <QuotationModal
          initial={quotationModal.initial}
          clients={clients}
          onSave={handleSaveQuotation}
          onClose={() => setQuotationModal({ open: false })}
          onConvertToInvoice={handleConvertQuotationToInvoice}
          onPrintPreview={(quo) => {
            const client = clients.find((c) => c.id === quo.clientId);
            setPreviewModal({ open: true, type: 'quotation', data: quo, client });
          }}
        />
      )}

      {invoiceModal.open && (
        <InvoiceModal
          initial={invoiceModal.initial}
          clients={clients}
          onSave={handleSaveInvoice}
          onClose={() => setInvoiceModal({ open: false })}
          onPrintPreview={(inv) => {
            const client = clients.find((c) => c.id === inv.clientId);
            setPreviewModal({ open: true, type: 'invoice', data: inv, client });
          }}
          onCreatePayment={handleCreatePaymentFromInvoice}
        />
      )}

      {paymentModal.open && (
        <PaymentModal
          initial={paymentModal.initial}
          clients={clients}
          invoices={invoices}
          onSave={handleSavePayment}
          onClose={() => setPaymentModal({ open: false })}
          onPrintPreview={(pay) => {
            const client = clients.find((c) => c.id === pay.clientId);
            setPreviewModal({ open: true, type: 'payment', data: pay, client });
          }}
        />
      )}

      {previewModal.open && previewModal.data && (
        <DocumentPreviewModal
          type={previewModal.type}
          data={previewModal.data}
          client={previewModal.client}
          onClose={() => setPreviewModal({ open: false, type: 'quotation' })}
        />
      )}

      {gasScriptModalOpen && (
        <GasScriptModal onClose={() => setGasScriptModalOpen(false)} />
      )}

      {confirmDelete.open && (
        <ConfirmDeleteModal
          title={confirmDelete.title}
          message={confirmDelete.message}
          itemLabel={confirmDelete.itemLabel}
          onConfirm={confirmDelete.onConfirm}
          onCancel={() => setConfirmDelete({ open: false, title: '', message: '', onConfirm: () => {} })}
        />
      )}
    </div>
  );
}
