export interface PlannedFeature {
  id: string;
  title: string;
  category: 'Integrasi' | 'Otomatisasi' | 'Portal Klien' | 'Perpajakan' | 'AI & Konten';
  priority: 'High' | 'Medium' | 'Future';
  status: 'Menunggu Instruksi User';
  summary: string;
  technicalScope: string[];
  estimatedImpact: string;
}

/**
 * Catatan Resmi Roadmap Fitur Tambahan Agensi OBEECREATIVES
 * Seluruh item di bawah ini telah dicatat dan standby, menunggu instruksi resmi dari Anda sebelum diimplementasikan.
 */
export const FUTURE_FEATURES_ROADMAP: PlannedFeature[] = [
  {
    id: 'ft-google-calendar',
    title: 'Kalender Visual Interaktif & Sinkronisasi 2 Arah Google Calendar',
    category: 'Integrasi',
    priority: 'High',
    status: 'Menunggu Instruksi User',
    summary: 'Tampilan kalender visual bulanan/mingguan yang terhubung langsung dengan Google Calendar untuk jadwal shooting foto/video, meeting klien, dan deadline konten SMM.',
    technicalScope: [
      'Visual Grid Calendar bulanan, mingguan, dan agenda harian',
      'Sinkronisasi 2-arah agenda meeting dengan Google Calendar API',
      'Notifikasi pengingat otomatis ke smartphone tim produksi sebelum jam shooting'
    ],
    estimatedImpact: 'Menghindari jadwal bentrok antar crew produksi dan memudahkan klien memilih slot jadwal temu.'
  },
  {
    id: 'ft-client-portal',
    title: 'Portal Klien Publik & Link Approval Quotation Online (Tanpa Login)',
    category: 'Portal Klien',
    priority: 'High',
    status: 'Menunggu Instruksi User',
    summary: 'Link unik rahasia yang dapat dikirim ke klien (misal: via WhatsApp) untuk melihat quotation resmi dan langsung menyetujui (Approve / Reject) secara online dengan e-signature.',
    technicalScope: [
      'Halaman publik aman dengan token unik enkripsi per Quotation',
      'Fitur tanda tangan digital klien langsung di layar touchscreen HP/laptop',
      'Pemberitahuan otomatis ke tim Obeecreatives seketika klien menekan tombol Setuju'
    ],
    estimatedImpact: 'Mempercepat siklus closing penawaran proyek dari berhari-hari menjadi hitungan menit.'
  },
  {
    id: 'ft-drive-asset-vault',
    title: 'Integrasi Google Drive Asset Vault per Folder Klien',
    category: 'Integrasi',
    priority: 'Medium',
    status: 'Menunggu Instruksi User',
    summary: 'Akses instan ke link Google Drive folder master foto RAW, video edit, dan aset desain klien langsung dari kartu CRM klien.',
    technicalScope: [
      'Penyimpanan link folder master Google Drive per entitas Klien',
      'Folder otomatis berstruktur rapi: Master Foto, Master Video, Feed SMM, Faktur',
      'Tombol 1-klik buka Google Drive app / web browser'
    ],
    estimatedImpact: 'Menghilangkan kebingungan tim mencari link file aset saat meeting atau revisi klien.'
  },
  {
    id: 'ft-tax-pph23',
    title: 'Kalkulator Pajak PPh 23 (2%) & Otomatisasi Faktur B2B / Korporat',
    category: 'Perpajakan',
    priority: 'Medium',
    status: 'Menunggu Instruksi User',
    summary: 'Perhitungan otomatis pemotongan PPh 23 (2%) untuk klien berstatus PKP / Perusahaan (Corporate Lawyer, Jambu Luwuk, dll.) pada invoice dan faktur resmi.',
    technicalScope: [
      'Toggle opsi pemotongan PPh 23 Pasal 23 Jasa Kreatif (2%) pada pembuatan invoice',
      'Format rekapitulasi bukti potong pajak untuk keperluan SPT Tahunan',
      'Kalkulasi netto yang ditransfer klien setelah dipotong pajak'
    ],
    estimatedImpact: 'Memastikan kepatuhan pembukuan finansial agensi dan memudahkan rekonsiliasi kas bank.'
  },
  {
    id: 'ft-ai-proposal',
    title: 'AI Proposal & Copywriting Brief Generator (Powered by Gemini)',
    category: 'AI & Konten',
    priority: 'Future',
    status: 'Menunggu Instruksi User',
    summary: 'Asisten AI otomatis untuk menyusun draft penawaran paket SMM, deskripsi item pekerjaan kreatif, dan terms of reference berbasis brief klien.',
    technicalScope: [
      'Integrasi endpoint Gemini API untuk generate draft item quotation',
      'Template bahasa proposal persuasif untuk korporat, UMKM, dan perhotelan',
      'Auto-generate checklist deliverables konten per bulan'
    ],
    estimatedImpact: 'Menghemat waktu penyusunan proposal penawaran hingga 80% bagi tim account executive.'
  },
  {
    id: 'ft-push-telegram',
    title: 'Push Notification Browser & Alert Bot Telegram / WhatsApp Bisnis',
    category: 'Otomatisasi',
    priority: 'Future',
    status: 'Menunggu Instruksi User',
    summary: 'Notifikasi instan otomatis ke grup Telegram tim atau push notifikasi HP saat status pembayaran diverifikasi, klien menyetujui quotation, atau ada prospek baru.',
    technicalScope: [
      'Service Worker Web Push Notifications untuk HP & PC',
      'Webhook Telegram Bot pengirim ringkasan transaksi kas masuk harian',
      'Pemberitahuan real-time otomatis tanpa perlu reload aplikasi'
    ],
    estimatedImpact: 'Seluruh direksi dan kru selalu mendapatkan pembaruan kas masuk tercepat di lapangan.'
  }
];
