import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  Kanban,
  CalendarDays,
  Calculator,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  BarChart3,
  MessageSquare,
  Smartphone,
  Database,
  ExternalLink,
  Printer,
  Sparkles,
  Info,
  ChevronDown,
  ChevronRight,
  Shield,
  HelpCircle,
  Clock,
  Send,
  Layers,
  FileDown,
} from 'lucide-react';
import { UserRole } from '../../types';

interface StaffGuideViewProps {
  userRole: UserRole;
  onSelectTab: (tab: string) => void;
}

interface GuideSection {
  id: string;
  tabId?: string;
  title: string;
  category: 'Operasional' | 'Keuangan' | 'Penjualan' | 'Integrasi & Fitur';
  icon: any;
  color: string;
  badge: string;
  description: string;
  rolesAllowed: string[];
  steps: string[];
  keyFeatures: Array<{ name: string; desc: string }>;
  bestPractices: string[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'dashboard',
    tabId: 'dashboard',
    title: '1. Dashboard Operasional Agensi',
    category: 'Operasional',
    icon: Layers,
    color: 'text-red-500',
    badge: 'Pusat Kontrol',
    description: 'Pusat komando dan rangkuman aktivitas real-time agensi OBEECREATIVES. Menampilkan metrik KPI terpenting, transaksi kas masuk, piutang aktif, serta jadwal meeting hari ini.',
    rolesAllowed: ['Super Admin', 'Web Dev', 'Admin', 'Staff Creator'],
    steps: [
      'Buka menu Dashboard setiap awal jam kerja untuk meninjau jadwal agenda dan notifikasi follow-up klien.',
      'Gunakan kartu metrik atas untuk memantau "Total Klien Aktif", "Omset Deals", "Piutang Belum Dibayar", dan "Kas Masuk".',
      'Pada widget "Klien Hub Spotlight", gunakan tab pemfilter "Semua", "SMM", dan "Lainnya" untuk melihat status PIC klien dengan cepat.',
      'Periksa bagian "Agenda Jadwal Meeting" untuk memastikan persiapan lokasi dan alat shooting atau bahan presentasi sebelum waktu temu.',
      'Jika baru saja memperbarui data di Google Sheets, klik tombol merah "Tarik Data Sheet Asli" di navbar atas untuk sinkronisasi seketika.'
    ],
    keyFeatures: [
      { name: 'KPI Cards Interaktif', desc: 'Kartu ringkasan angka omset, kas masuk, piutang, dan estimasi laba bersih.' },
      { name: 'Agenda Rapat Terdekat', desc: 'Daftar jadwal pertemuan dengan penanda badge status Terjadwal/Selesai.' },
      { name: 'Quick Filter Divisi', desc: 'Memisahkan klien Social Media Management, Photography, dan Desain Grafis secara instan.' }
    ],
    bestPractices: [
      'Jadikan Dashboard sebagai halaman beranda utama setiap membuka web apps.',
      'Pastikan metrik "Piutang Belum Dibayar" ditekan seminimal mungkin dengan melakukan follow-up rutin.'
    ]
  },
  {
    id: 'clients',
    tabId: 'clients',
    title: '2. CRM Clients Hub (Direktori Klien)',
    category: 'Penjualan',
    icon: Users,
    color: 'text-blue-400',
    badge: 'Basis Data Klien',
    description: 'Direktori master seluruh kontak, PIC perusahaan, email, nomor WhatsApp, divisi layanan, dan catatan khusus dari setiap klien partner OBEECREATIVES.',
    rolesAllowed: ['Super Admin', 'Web Dev', 'Admin', 'Staff Creator'],
    steps: [
      'Untuk menambah klien baru: Klik tombol merah "+ Tambah Klien" di pojok kanan atas.',
      'Isi formulir lengkap: Nama Perusahaan/Brand, Nama PIC, Nomor Telepon/WhatsApp, Alamat Email, Divisi Layanan, dan Catatan Proyek.',
      'Gunakan kotak pencarian di bagian atas untuk menemukan klien berdasarkan nama brand, nomor telepon, atau nama PIC.',
      'Gunakan tombol filter divisi (Semua Divisi, Social Media Management, Desain Grafis, Photography, Videography) untuk mengelompokkan klien.',
      'Klik ikon hijau WhatsApp pada kartu klien untuk langsung membuka percakapan chat dengan PIC klien terkait.',
      'Klik tombol "Edit" untuk memperbarui data kontak atau "Hapus" jika klien dibatalkan (memerlukan konfirmasi).'
    ],
    keyFeatures: [
      { name: 'Auto-Format Nomor Telepon', desc: 'Sistem otomatis mengubah format nomor telepon (08xx) menjadi format internasional standar WhatsApp (62xx).' },
      { name: 'Klasifikasi Divisi Layanan', desc: 'Memudahkan pemilahan kontrak bulanan SMM vs proyek lepasan foto/desain.' },
      { name: 'Direct WhatsApp Chat', desc: '1-klik membuka WhatsApp Web di PC atau Aplikasi WhatsApp di smartphone.' }
    ],
    bestPractices: [
      'Selalu cantumkan nomor telepon PIC yang aktif WhatsApp untuk mempermudah pengiriman invoice dan reminder.',
      'Tulis catatan penting seperti gaya komunikasi klien, preferensi jadwal, atau PIC penagihan keuangan di kolom catatan.'
    ]
  },
  {
    id: 'pipeline',
    tabId: 'pipeline',
    title: '3. Pipeline Leads (Papan Kanban Prospek)',
    category: 'Penjualan',
    icon: Kanban,
    color: 'text-amber-400',
    badge: 'Tracking Peluang Proyek',
    description: 'Papan visual Kanban untuk melacak siklus konversi calon klien mulai dari tahap kontak awal hingga penutupan kesepakatan (Deal Closed) atau pembatalan (Lost).',
    rolesAllowed: ['Super Admin', 'Web Dev', 'Admin'],
    steps: [
      'Klik tombol "+ Tambah Lead" untuk mencatat prospek proyek baru dari klien.',
      'Pilih klien terkait, tulis judul peluang proyek (misal: "Kontrak SMM 6 Bulan"), tentukan divisi, estimasi nilai deal (Rp), dan pilih tahap awal.',
      'Tahapan alur proses prospek di OBEECREATIVES:\n  1. Prospek: Klien baru mengajukan minat atau bertanya tentang jasa.\n  2. Kontak: Tim telah menghubungi klien dan mendiskusikan kebutuhan awal.\n  3. Proposal: Surat penawaran (Quotation) / proposal telah dikirimkan ke klien.\n  4. Deal: Klien menyetujui penawaran dan proyek resmi berjalan.\n  5. Lost: Klien membatalkan atau tidak melanjutkan kerjasama.',
      'Pindahkan kartu prospek ke tahap berikutnya dengan menekan tombol panah maju/mundur pada kartu atau mengedit statusnya.',
      'Pantau "Total Nilai Pipeline" dan total prospek aktif pada bar informasi di atas papan.'
    ],
    keyFeatures: [
      { name: 'Papan Visual 5 Tahap', desc: 'Kolom visual yang memperlihatkan posisi setiap peluang proyek secara transparan.' },
      { name: 'Kalkulasi Estimasi Omset', desc: 'Otomatis menjumlahkan nilai nominal prospek yang sedang dalam negosiasi.' },
      { name: 'Quick Move Stage', desc: 'Kemudahan memindahkan kartu prospek dari satu kolom ke kolom lain hanya dengan satu klik.' }
    ],
    bestPractices: [
      'Jangan biarkan prospek berdiam di kolom "Kontak" lebih dari 3 hari tanpa tindak lanjut (follow-up).',
      'Jika prospek mencapai tahap "Deal", segera lanjutkan ke pembuatan Estimasi RAB dan Quotation resmi.'
    ]
  },
  {
    id: 'meetings',
    tabId: 'meetings',
    title: '4. Jadwal Meeting & Koordinasi Produksi',
    category: 'Operasional',
    icon: CalendarDays,
    color: 'text-emerald-400',
    badge: 'Agenda & Appointment',
    description: 'Manajemen jadwal janji temu, rapat koordinasi produksi, presentasi proposal, dan kunjungan lokasi shooting (site visit) bersama klien maupun kru internal.',
    rolesAllowed: ['Super Admin', 'Web Dev', 'Admin', 'Staff Creator', 'Client Partner'],
    steps: [
      'Klik "+ Buat Jadwal Rapat" untuk membuat agenda baru.',
      'Pilih klien yang bersangkutan, tentukan jenis pertemuan (Meeting, Call, Site Visit, Presentasi, atau Lainnya).',
      'Tentukan tanggal pertemuan, jam mulai, jam selesai, lokasi temu (misal: "Studio Batu", "Griya Obee", atau link Google Meet), dan daftar peserta.',
      'Setelah agenda dibuat, gunakan tombol hijau "Kirim WA" pada kartu jadwal untuk mengirimkan pesan pengingat resmi ke klien atau peserta.',
      'Pesan WhatsApp otomatis menyertakan agenda, tanggal, jam WIB, lokasi, dan daftar peserta.',
      'Setelah rapat selesai, ubah status dari "Terjadwal" menjadi "Selesai", atau "Dijadwal Ulang" jika ada penundaan waktu.'
    ],
    keyFeatures: [
      { name: 'Kirim Pengingat WhatsApp 1-Klik', desc: 'Otomatis menyusun draft konfirmasi jadwal yang rapi dan sopan untuk dikirimkan ke nomor PIC.' },
      { name: 'Klasifikasi Jenis Pertemuan', desc: 'Membedakan rapat daring (Call), presentasi proposal, koordinasi teknis, dan kunjungan lokasi shooting.' },
      { name: 'Penyimpanan Catatan Notulen', desc: 'Kolom catatan untuk menyimpan poin kesepakatan atau hasil rapat koordinasi.' }
    ],
    bestPractices: [
      'Kirim pengingat WhatsApp ke klien H-1 sebelum jadwal pertemuan agar konfirmasi kehadiran jelas.',
      'Selalu perbarui status menjadi "Selesai" agar agenda di Dashboard tidak menumpuk.'
    ]
  },
  {
    id: 'estimasi',
    tabId: 'estimasi',
    title: '5. Estimasi Biaya Produksi (RAB) & Kalkulator Laba',
    category: 'Keuangan',
    icon: Calculator,
    color: 'text-purple-400',
    badge: 'Kalkulator RAB & Profit',
    description: 'Kalkulator Rencana Anggaran Biaya (RAB) berstandar agensi untuk memperhitungkan biaya sewa alat studio, fee jasa kru, infaq sosial, hak saham mitra, dan laba bersih proyek.',
    rolesAllowed: ['Super Admin', 'Web Dev', 'Admin', 'Staff Creator'],
    steps: [
      'Klik "+ Buat Estimasi Baru" untuk menyusun RAB proyek kreatif.',
      'Pilih klien dan jenis jasa (misal: "Produksi Video Promosi Hotel", "Paket Foto Katalog Produk").',
      'Masukkan "Anggaran Klien / Target Nilai Proyek (Rp)".',
      'Tambahkan rincian item biaya produksi:\n  - Biaya Peralatan: Kamera, lensa, stabilizer, lighting kit, wireless mic (harga perolehan / sewa).\n  - Biaya Jasa: Fee fotografer, videografer, asisten, MUA, talent/model, editor visual.\n  - Biaya Bahan / Operasional: Konsumsi kru, bensin operasional, props studio.',
      'Perhatikan formula perhitungan otomatis di bagian bawah formulir:\n  • Total Biaya = Penjumlahan seluruh item alat, jasa, dan bahan.\n  • Laba Kotor = Anggaran Proyek - Total Biaya.\n  • Infaq Agensi (2.5%) = 2.5% x Laba Kotor.\n  • Hak Saham Mitra (10%) = 10% x Laba Kotor.\n  • Laba Bersih Agensi = Laba Kotor - Infaq - Saham.',
      'Klik "Simpan Estimasi".',
      'Setelah disetujui internal, gunakan tombol "→ Convert ke Quotation" untuk membuat surat penawaran resmi secara otomatis tanpa ketik ulang.'
    ],
    keyFeatures: [
      { name: 'Formula Infaq 2.5% & Saham 10%', desc: 'Perhitungan otomatis alokasi sosial dan dividen saham agensi secara transparan.' },
      { name: 'Preview & Cetak PDF RAB', desc: 'Mencetak lembar RAB resmi berstandar kop surat OBEECREATIVES.' },
      { name: '1-Klik Konversi ke Quotation', desc: 'Mentransfer item biaya dan nilai proyek menjadi Quotation siap kirim ke klien.' }
    ],
    bestPractices: [
      'Pastikan estimasi biaya memasukkan margin cadangan (kontingensi) minimal 5-10% untuk biaya tak terduga di lapangan.',
      'Cek ketersediaan inventaris kamera dan alat studio di Equipment Hub sebelum menetapkan biaya sewa.'
    ]
  },
  {
    id: 'quotations',
    tabId: 'quotations',
    title: '6. Quotation (Surat Penawaran Resmi)',
    category: 'Penjualan',
    icon: FileSpreadsheet,
    color: 'text-blue-400',
    badge: 'Dokumen Penawaran',
    description: 'Penerbitan surat penawaran harga resmi (Quotation) berstandar bisnis profesional, lengkap dengan penomoran dokumen, diskon, masa berlaku penawaran, dan terms.',
    rolesAllowed: ['Super Admin', 'Web Dev', 'Admin', 'Client Partner'],
    steps: [
      'Quotation dapat dibuat dengan dua cara:\n  A. Hasil konversi otomatis dari menu Estimasi RAB (Sangat Disarankan).\n  B. Dibuat manual dengan menekan tombol merah "+ Buat Quotation".',
      'Format nomor resmi: `[No]/QUO/[DIVISI]/OC/[BULAN ROMAWI]/[TAHUN]` (Contoh: `042/QUO/SMM/OC/X/2026`).',
      'Masukkan item layanan, kuantitas (qty), satuan, harga per unit, dan diskon jika ada.',
      'Tentukan syarat pembayaran (Terms) dan periode durasi layanan (misal: "1 Bulan", "1 Tahun").',
      'Klik ikon Printer pada kartu quotation untuk melihat "Preview Dokumen Resmi" berkop surat OBEECREATIVES dan cetak atau simpan sebagai PDF.',
      'Klik tombol "Kirim WA" untuk mengirimkan surat penawaran ke WhatsApp PIC klien dengan pesan profesional siap kirim.',
      'Jika klien telah menyetujui, ubah status menjadi "Disetujui" lalu klik tombol merah "→ Convert ke Invoice" untuk menerbitkan faktur tagihan.'
    ],
    keyFeatures: [
      { name: 'Kop Surat Resmi Agensi', desc: 'Desain layout dokumen elegan berstandar formal dengan identitas lengkap obeecreatives visual maker.' },
      { name: 'Kirim Penawaran WhatsApp', desc: 'Menghubungkan dokumen penawaran dengan pesan ramah dan persuasif langsung ke nomor klien.' },
      { name: 'Convert ke Faktur Tagihan', desc: 'Memindahkan seluruh item penawaran menjadi tagihan resmi hanya dengan satu klik.' }
    ],
    bestPractices: [
      'Kirimkan Quotation maksimal 1x24 jam setelah meeting pembahasan brief dengan calon klien.',
      'Sertakan batas masa berlaku penawaran (misal 14 hari) di kolom catatan agar klien segera memutuskan.'
    ]
  },
  {
    id: 'invoices',
    tabId: 'invoices',
    title: '7. Invoice (Faktur Tagihan Resmi) & Piutang',
    category: 'Keuangan',
    icon: Receipt,
    color: 'text-amber-400',
    badge: 'Penagihan & Piutang',
    description: 'Penerbitan dan pemantauan faktur tagihan resmi, monitoring piutang belum tertagih, penagihan berkala via WhatsApp, dan sinkronisasi pembayaran.',
    rolesAllowed: ['Super Admin', 'Web Dev', 'Admin'],
    steps: [
      'Invoice dibuat langsung dari hasil konversi Quotation yang disetujui, atau klik "+ Buat Invoice" untuk tagihan langsung.',
      'Format nomor faktur resmi: `[No]/INV/[DIVISI]/OC/[BULAN ROMAWI]/[TAHUN]` (Contoh: `705/INV/SMM/OC/VII/2026`).',
      'Pastikan alamat penagihan (Bill To) dan nama PIC terisi jelas.',
      'Rincian rekening agensi yang tertera pada faktur resmi:\n  🏦 Bank BCA\n  💳 No. Rekening: 0190448703\n  👤 a/c: Lalu Mahendra Ali Akbar',
      'Status tagihan yang tersedia: "Draft", "Belum Dibayar", dan "Lunas".',
      'Untuk menagih klien: Klik tombol "Kirim WA" pada kartu invoice. Sistem akan membuka draft pesan WhatsApp berisi rincian nomor invoice, total tagihan (Rp), rekening transfer BCA, dan permohonan konfirmasi.',
      'Setelah klien melakukan pembayaran dan mengirimkan bukti transfer, klik tombol hijau "+ Konfirmasi Bayar" pada invoice tersebut.'
    ],
    keyFeatures: [
      { name: 'Monitoring Total Belum Dibayar', desc: 'Badge penunjuk nominal piutang yang masih tertahan di tangan klien.' },
      { name: 'Kirim Tagihan & Reminder WA', desc: 'Pengingat sopan jatuh tempo tagihan langsung ke nomor telepon klien.' },
      { name: '1-Klik Konfirmasi Pembayaran', desc: 'Membuka form konfirmasi bayar otomatis terhubung dengan nomor invoice terkait.' }
    ],
    bestPractices: [
      'Kirimkan reminder invoice H-3 sebelum tanggal jatuh tempo, dan pada hari H jatuh tempo.',
      'Hindari mengubah data invoice yang sudah lunas terverifikasi untuk menjaga integritas pembukuan.'
    ]
  },
  {
    id: 'payments',
    tabId: 'payments',
    title: '8. Payment Confirmation (Verifikasi Kas Masuk)',
    category: 'Keuangan',
    icon: CreditCard,
    color: 'text-emerald-400',
    badge: 'Verifikasi Kas Masuk',
    description: 'Pencatatan bukti bayar resmi (kuitansi), rekonsiliasi kas bank masuk, perubahan status otomatis invoice menjadi lunas, dan pengiriman bukti tanda terima.',
    rolesAllowed: ['Super Admin', 'Web Dev', 'Admin'],
    steps: [
      'Saat bukti transfer dari klien diterima (misal struk mutasi BCA atau transfer bank lain):',
      'Klik "+ Catat Pembayaran Baru" atau klik "+ Konfirmasi Bayar" dari menu Invoice.',
      'Pilih invoice yang bersangkutan (sistem akan otomatis mengisi nama klien, item tagihan, dan nominal).',
      'Masukkan nomor referensi transaksi / confirmation number (misal: `PAY-2026-001`).',
      'Pilih metode pembayaran (Bank Transfer, Cash, QRIS) dan masukkan nama Bank Pengirim serta Bank Penerima (BCA Lalu Mahendra Ali Akbar).',
      'Pilih status: "Paid Off" (jika lunas penuh), "Partial" (jika uang muka / DP), atau "Pending".',
      'Saat status disimpan sebagai "Paid Off", status invoice terkait otomatis diperbarui menjadi "LUNAS".',
      'Klik tombol "Kirim WA" untuk mengirimkan bukti konfirmasi lunas resmi dan ucapan terima kasih ke WhatsApp klien.'
    ],
    keyFeatures: [
      { name: 'Auto-Update Status Invoice', desc: 'Invoice otomatis berubah menjadi Lunas Terverifikasi tanpa perlu edit manual.' },
      { name: 'Cetak Bukti Pembayaran PDF', desc: 'Dokumen kuitansi resmi bertanda tangan digital sebagai arsip pembukuan.' },
      { name: 'Kirim Tanda Terima WhatsApp', desc: 'Memberikan kepastian transaksi yang profesional kepada klien secara instan.' }
    ],
    bestPractices: [
      'Selalu cocokkan mutasi rekening bank BCA riil sebelum mengubah status pembayaran menjadi "Paid Off".',
      'Simpan nomor referensi transfer bank di kolom catatan untuk mempermudah audit akuntansi.'
    ]
  },
  {
    id: 'reports',
    tabId: 'reports',
    title: '9. Laporan Finansial & Pusat Ekspor Agensi',
    category: 'Operasional',
    icon: BarChart3,
    color: 'text-red-500',
    badge: 'Laporan & Ekspor Data',
    description: 'Pusat laporan performa bisnis menyeluruh, grafik omset per divisi agensi, monitoring alokasi infaq & dividen saham, serta unduhan data CSV/Excel 1-klik.',
    rolesAllowed: ['Super Admin', 'Web Dev', 'Admin'],
    steps: [
      'Buka menu "Laporan & Ekspor" dari bilah sidebar samping.',
      'Gunakan tab "Ikhtisar Finansial" untuk melihat rangkuman:\n  - Total Omset Kas Masuk Terverifikasi.\n  - Total Tagihan yang Telah Diterbitkan.\n  - Total Piutang Aktif yang Belum Dibayar.\n  - Proyeksi Anggaran & Laba Bersih RAB.\n  - Total Tabungan Infaq (2.5%) dan Saham (10%).',
      'Gunakan tab "Performa Divisi" untuk melihat kontribusi jumlah klien dan nilai omset dari masing-masing unit kreatif (SMM, Photography, Desain Grafis, Videography).',
      'Gunakan tab "Pusat Ekspor Data" untuk mengunduh laporan spreadsheet resmi:\n  1. Unduh CSV Invoices (Data tagihan dan status lunas).\n  2. Unduh CSV Kas Masuk (Riwayat transfer pembayaran).\n  3. Unduh CSV Estimasi RAB (Rincian anggaran & laba bersih).\n  4. Unduh CSV Data Klien (Direktori kontak seluruh klien aktif).',
      'File CSV yang diunduh menggunakan standar UTF-8 BOM, sehingga angka rupiah dan huruf Indonesia langsung rapi saat dibuka di Microsoft Excel atau Google Sheets.'
    ],
    keyFeatures: [
      { name: 'Standar CSV UTF-8 BOM', desc: 'Dapat dibuka di Microsoft Excel versi apa pun tanpa karakter rusak atau kolom berantakan.' },
      { name: 'Breakdown Finansial Divisi', desc: 'Mengetahui divisi mana yang menyumbang pendapatan terbesar bagi agensi.' },
      { name: 'Transparansi Infaq & Saham', desc: 'Rekapitulasi hak infaq sosial dan dividen saham pemegang modal agensi.' }
    ],
    bestPractices: [
      'Lakukan ekspor data CSV setiap akhir bulan sebagai arsip pembukuan offline agensi.',
      'Gunakan laporan performa divisi saat rapat evaluasi bulanan tim manajemen.'
    ]
  },
  {
    id: 'whatsapp-feature',
    title: '10. Panduan Fitur WhatsApp 1-Klik (HP & PC)',
    category: 'Integrasi & Fitur',
    icon: MessageSquare,
    color: 'text-emerald-400',
    badge: 'Komunikasi Otomatis',
    description: 'Fitur pengiriman pesan langsung via WhatsApp yang terintegrasi pada Invoice, Quotation, Jadwal Meeting, dan Konfirmasi Pembayaran tanpa perlu copy-paste manual.',
    rolesAllowed: ['Super Admin', 'Web Dev', 'Admin', 'Staff Creator'],
    steps: [
      'Tombol WhatsApp hijau (`Kirim WA` / ikon MessageSquare) tersedia pada kartu:\n  - Invoice: Mengirim draft tagihan atau reminder jatuh tempo beserta nomor rekening BCA.\n  - Quotation: Mengirim surat penawaran resmi dan rincian total nilai proyek.\n  - Meeting: Mengirim pengingat waktu, jam WIB, agenda, dan link lokasi pertemuan.\n  - Payment: Mengirimkan bukti konfirmasi pembayaran lunas terverifikasi.',
      'Saat tombol diklik, jendela dialog interaktif akan muncul.',
      'Sistem otomatis membaca nomor WhatsApp klien dari profil CRM dan memformatnya menjadi awalan 62.',
      'Anda dapat mengedit isi pesan di kotak teks sebelum dikirim jika ingin menambahkan sapaan khusus.',
      'Klik tombol "Buka & Kirim WhatsApp":\n  - Jika diakses dari PC/Laptop: Otomatis membuka WhatsApp Web di browser Anda.\n  - Jika diakses dari Smartphone (Android/iPhone): Otomatis membuka Aplikasi WhatsApp terpasang.',
      'Anda juga bisa menggunakan tombol "Salin Pesan" jika ingin menempelkan (paste) teks ke grup chat atau aplikasi lain.'
    ],
    keyFeatures: [
      { name: 'Kompatibilitas HP & PC', desc: 'Bekerja mulus baik di komputer desktop maupun ponsel pintar staf lapangan.' },
      { name: 'Draft Pesan Profesional', desc: 'Template bahasa bisnis yang sopan, rapi, dan mencantumkan identitas resmi obeecreatives.' },
      { name: 'Live Message Editor', desc: 'Fleksibilitas mengedit kata-kata sebelum pesan dikirimkan ke klien.' }
    ],
    bestPractices: [
      'Pastikan nomor WhatsApp klien selalu diawali kode negara atau format nomor yang valid.',
      'Cek kembali rincian nominal dan nama PIC sebelum menekan tombol kirim.'
    ]
  },
  {
    id: 'pwa-feature',
    title: '11. Panduan Instalasi Aplikasi (PWA HP & Laptop)',
    category: 'Integrasi & Fitur',
    icon: Smartphone,
    color: 'text-amber-400',
    badge: 'Mobile & Desktop App',
    description: 'Tata cara menginstal Web Apps CRM OBEECREATIVES ke layar utama smartphone (Android / iOS) dan komputer (Windows / macOS) agar dapat dibuka seperti aplikasi bawaan.',
    rolesAllowed: ['Semua Peran'],
    steps: [
      'Aplikasi ini berbasis Progressive Web App (PWA) modern: ringan, hemat memori, dan tidak memerlukan unduhan dari Google Play Store atau Apple App Store.',
      'Cara Instal di Komputer (PC / Laptop Windows, macOS, Linux):\n  1. Buka aplikasi menggunakan Google Chrome atau Microsoft Edge.\n  2. Klik tombol "Install App" di bilah navigasi atas (berwarna kuning keemasan).\n  3. Atau klik ikon komputer kecil dengan panah ke bawah di Address Bar browser pojok kanan atas.\n  4. Klik "Install". Aplikasi akan terbuka di jendela mandiri tanpa tab browser dan memiliki shortcut di Desktop & Taskbar.',
      'Cara Instal di Ponsel Android:\n  1. Buka aplikasi menggunakan Google Chrome.\n  2. Klik tombol menu titik tiga (⋮) di pojok kanan atas browser.\n  3. Pilih "Instal aplikasi" atau "Tambahkan ke Layar Utama".\n  4. Ikon CRM OBEECREATIVES akan muncul di menu aplikasi ponsel Anda.',
      'Cara Instal di iPhone / iPad (iOS):\n  1. Buka tautan aplikasi di browser Safari.\n  2. Ketuk tombol Bagikan (ikon kotak dengan panah ke atas di bilah bawah Safari).\n  3. Gulir ke bawah dan pilih "Tambahkan ke Layar Utama" (Add to Home Screen).\n  4. Ketuk "Tambah" di pojok kanan atas.',
      'Aplikasi kini dapat dibuka dengan 1 ketukan langsung dari layar depan perangkat Anda!'
    ],
    keyFeatures: [
      { name: 'Mendukung Mode Offline', desc: 'Dilengkapi indikator offline cerdas dan caching aset untuk koneksi internet tidak stabil.' },
      { name: 'Ikon Khusus High-Resolution', desc: 'Ikon brand OBEECREATIVES resmi yang tajam di layar Retina maupun AMOLED.' },
      { name: 'Standalone Window', desc: 'Membuka tanpa gangguan address bar browser sehingga area kerja lebih luas.' }
    ],
    bestPractices: [
      'Sarankan seluruh kru lapangan dan fotografer menginstal aplikasi ini di ponsel masing-masing untuk cek jadwal shooting.',
      'Gunakan aplikasi dalam mode instalasi di laptop kerja kantor agar fokus tanpa tab browser lain.'
    ]
  },
  {
    id: 'sheets-rbac',
    tabId: 'settings',
    title: '12. Integrasi Google Sheets V2 & Hak Akses Developer',
    category: 'Integrasi & Fitur',
    icon: Database,
    color: 'text-purple-400',
    badge: 'Backend & Akses Dev',
    description: 'Arsitektur sinkronisasi dua arah dengan Google Spreadsheet V2 via Google Apps Script (GAS) dan pembagian hak akses keamanan tingkat agensi.',
    rolesAllowed: ['Super Admin', 'Web Dev (Full Akses)', 'Admin (Operasional)'],
    steps: [
      'Aplikasi CRM ini terhubung dengan Spreadsheet Master OBEECREATIVES melalui endpoint Google Apps Script V2.',
      'Penarikan Data Sheet Asli:\n  - Tekan tombol merah "Tarik Data Sheet Asli" di navbar atas atau di menu Pengaturan.\n  - Sistem akan mengunduh data terbaru dari lembar Clients, Leads, Meetings, Estimasi, Invoices, dan Payments.',
      'Pencadangan & Pemulihan (Backup & Restore):\n  - Pada tab "Cadangan & Pemulihan Data", klik "Unduh Cadangan Lengkap (JSON)" untuk menyimpan arsip database lokal ke harddisk.\n  - Tombol "Pulihkan Cadangan" dapat digunakan untuk mengembalikan data jika terjadi kendala.',
      'Hak Akses Khusus Developer (Web Dev / Site Engineer & Super Admin):\n  - Memiliki akses penuh terhadap skrip Apps Script Backend (Code.gs Router V2).\n  - Berhak mengubah konfigurasi endpoint URL, token API, dan struktur database spreadsheet.\n  - Berhak mengatur matriks hak akses pengguna (RBAC).\n  - Peran Admin difokuskan pada manajemen operasional agensi, penagihan, klien, dan panduan staff tanpa dibebani teknis pemrograman backend.'
    ],
    keyFeatures: [
      { name: 'Koneksi Cepat GAS V2', desc: 'Proksi cerdas berkecepatan tinggi dengan caching otomatis dan toleransi timeout.' },
      { name: 'Full Backup JSON Agensi', desc: 'Penyimpanan seluruh database 8 tabel dalam satu file cadangan yang aman.' },
      { name: 'Keamanan Berlapis RBAC', desc: 'Pemisahan wewenang yang tegas antara Developer, Admin Operasional, Kru Kreator, dan Mitra.' }
    ],
    bestPractices: [
      'Hanya Developer dan Super Admin yang diizinkan memodifikasi skrip Code.gs di Google Apps Script.',
      'Lakukan backup JSON minimal satu kali seminggu sebelum melakukan sinkronisasi data massal.'
    ]
  }
];

export const StaffGuideView: React.FC<StaffGuideViewProps> = ({
  userRole,
  onSelectTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [expandedSection, setExpandedSection] = useState<string | null>('dashboard');

  const categories = ['Semua', 'Operasional', 'Keuangan', 'Penjualan', 'Integrasi & Fitur'];

  const filteredGuides = GUIDE_SECTIONS.filter((guide) => {
    const matchCategory = selectedCategory === 'Semua' || guide.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      guide.title.toLowerCase().includes(q) ||
      guide.description.toLowerCase().includes(q) ||
      guide.steps.some((s) => s.toLowerCase().includes(q)) ||
      guide.keyFeatures.some((f) => f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q));
    return matchCategory && matchSearch;
  });

  const isDeveloper = userRole === 'Web Dev / Site Engineer' || userRole === 'Super Admin / Project Manager';
  const isAdmin = userRole === 'Admin' || isDeveloper;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-red-600/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-red-950/70 border border-red-800 text-red-400 font-bold tracking-wider uppercase font-mono flex items-center gap-1.5">
                <BookOpen size={13} />
                <span>Buku Panduan Operasional Staff (SOP)</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 font-mono">
                Versi Lengkap V2
              </span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Panduan Lengkap Seluruh Fitur & Alur Kerja CRM OBEECREATIVES
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Dokumentasi resmi tata cara penggunaan seluruh menu, tombol aksi, formula finansial (RAB, Infaq, Saham), pengiriman dokumen WhatsApp, dan standar operasional agensi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-right md:text-left">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Peran Pengguna Aktif:
              </span>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>{userRole}</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {isDeveloper
                  ? '⭐ Hak Akses Penuh Developer (Full System Access)'
                  : isAdmin
                  ? '🛡️ Hak Akses Admin Operasional & Finansial'
                  : '👤 Akses Pelaksana Agensi'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Notice Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white block mb-0.5">Ketentuan Penempatan Akses Menu Panduan:</strong>
          Menu panduan staff ini ditempatkan secara permanen untuk peran <strong className="text-amber-400">Admin</strong> guna mendampingi seluruh aktivitas harian staf, dengan <strong className="text-emerald-400">Developer (Web Dev / Site Engineer & Super Admin)</strong> tetap memegang kontrol dan hak akses penuh terhadap seluruh fitur backend, skrip integrasi Google Sheets, dan konfigurasi sistem.
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari fitur, tombol, formula infaq/saham, WhatsApp, atau SOP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E293B] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#DC2626] transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#DC2626] text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Cards Accordion List */}
      <div className="space-y-4">
        {filteredGuides.length === 0 ? (
          <div className="p-12 text-center bg-[#1E293B] rounded-2xl border border-dashed border-slate-700 text-slate-400 space-y-2">
            <HelpCircle size={32} className="mx-auto text-slate-500" />
            <div className="text-sm font-bold text-white">Tidak ada panduan yang cocok dengan pencarian</div>
            <p className="text-xs text-slate-400">
              Coba gunakan kata kunci lain seperti "invoice", "quotation", "klien", "whatsapp", atau "formula".
            </p>
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const isExpanded = expandedSection === guide.id;
            const Icon = guide.icon;

            return (
              <div
                key={guide.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-[#1E293B] border-slate-600 shadow-xl'
                    : 'bg-[#1E293B]/80 hover:bg-[#1E293B] border-slate-800'
                }`}
              >
                {/* Header (Accordion Trigger) */}
                <div
                  onClick={() => setExpandedSection(isExpanded ? null : guide.id)}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                      <Icon size={20} className={guide.color} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm md:text-base font-bold text-white tracking-tight">
                          {guide.title}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 font-mono border border-slate-700">
                          {guide.badge}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 font-semibold border border-red-900/40">
                          {guide.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {guide.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {guide.tabId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTab(guide.tabId!);
                        }}
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                        title="Langsung menuju menu ini"
                      >
                        <span>Buka Menu</span>
                        <ExternalLink size={12} />
                      </button>
                    )}
                    <button
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                      title={isExpanded ? 'Tutup Rincian' : 'Buka Rincian'}
                    >
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content Body */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-5 animate-in fade-in duration-200">
                    {/* Module Overview Description */}
                    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2">
                      <strong className="text-white block font-bold flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-400" />
                        Tujuan & Fungsi Modul:
                      </strong>
                      <p>{guide.description}</p>
                      
                      <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 border-t border-slate-800">
                        <strong className="text-slate-300">Hak Akses Peran:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {guide.rolesAllowed.map((role, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step SOP Usage Guide */}
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>Tata Cara Penggunaan (SOP Langkah Demi Langkah):</span>
                      </h4>
                      <div className="space-y-2">
                        {guide.steps.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 text-xs text-slate-300"
                          >
                            <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="leading-relaxed whitespace-pre-line">{step}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Features & Action Buttons */}
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-400" />
                        <span>Fitur Kunci & Tombol Penting:</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {guide.keyFeatures.map((feat, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1"
                          >
                            <span className="font-bold text-slate-200 block text-xs">
                              {feat.name}
                            </span>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {feat.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Best Practices */}
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs space-y-1.5">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs">
                        <ShieldCheck size={14} />
                        Tips & Standar Operasional Agensi:
                      </span>
                      <ul className="text-slate-300 text-[11px] space-y-1 list-disc list-inside">
                        {guide.bestPractices.map((bp, idx) => (
                          <li key={idx}>{bp}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Direct Navigate Button at bottom of card */}
                    {guide.tabId && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => onSelectTab(guide.tabId!)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                        >
                          <span>Buka Modul {guide.title.split('.')[1] || guide.title}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Role-Based Permissions Reference Matrix Table */}
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield size={16} className="text-red-500" />
              <span>Matriks Ringkasan Hak Akses Peran (RBAC) Agensi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pembagian kewenangan akses pengguna untuk memastikan integritas data dan keamanan sistem.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800 self-start sm:self-auto">
            Developer Full Access
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Modul / Fitur</th>
                <th className="py-2.5 px-2 text-center text-red-400">Super Admin</th>
                <th className="py-2.5 px-2 text-center text-emerald-400">Web Dev</th>
                <th className="py-2.5 px-2 text-center text-amber-400">Admin</th>
                <th className="py-2.5 px-2 text-center text-blue-400">Creator</th>
                <th className="py-2.5 px-2 text-center text-purple-400">Client Partner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Dashboard & Klien Hub</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Lihat/Edit</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Pipeline Leads & Prospek</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Jadwal Meeting & WhatsApp Alert</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Jadwal</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Jadwal</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Estimasi Biaya Produksi (RAB)</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Hitung</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Quotation, Invoice & Pembayaran</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Lihat Quo</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Laporan & Ekspor Data CSV</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Buku Panduan Operasional Staff (SOP)</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Akses</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Integrasi Google Sheets V2 & Script API</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full Dev</td>
                <td className="py-2.5 px-2 text-center text-slate-500">Tarik Data Saja</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Konfigurasi Sistem & Matrix Hak Akses</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full</td>
                <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">✓ Full Dev</td>
                <td className="py-2.5 px-2 text-center text-slate-500">Lihat Saja</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
                <td className="py-2.5 px-2 text-center text-slate-600">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
