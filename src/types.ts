export type DivisionType = 
  | 'Social Media Management' 
  | 'Desain Grafis' 
  | 'Photography' 
  | 'Videography' 
  | 'Workshop/Pelatihan';

export interface Client {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  division: string;
  notes: string;
  createdAt: string;
}

export type LeadStage = 'Prospek' | 'Kontak' | 'Proposal' | 'Deal' | 'Lost';

export interface Lead {
  id: string;
  title: string;
  clientId: string;
  division: string;
  value: number;
  stage: LeadStage;
  createdAt: string;
}

export interface Activity {
  id: string;
  clientId: string;
  type: 'whatsapp' | 'call' | 'email' | 'meeting';
  note: string;
  date: string;
  followUpDate: string;
  followUpDone: boolean;
  createdAt: string;
}

export type MeetingType = 'Meeting' | 'Call' | 'Site Visit' | 'Presentasi' | 'Lainnya';
export type MeetingStatus = 'Terjadwal' | 'Selesai' | 'Dibatalkan' | 'Dijadwal Ulang';

export interface Meeting {
  id: string;
  clientId: string;
  title: string;
  meetingType: MeetingType;
  meetingDate: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string;
  status: MeetingStatus;
  notes: string;
  createdAt: string;
}

export interface EquipmentItem {
  id: string;
  kategori: string;
  namaBarang: string;
  noSeri: string;
  satuan: string;
  qtyTotal: number;
  hargaPerolehan: number;
  hargaSewa: number;
  lokasiSimpan: string;
  kondisiAlat: string;
  keterangan: string;
}

export interface EstimasiItem {
  nama: string;
  kategori: 'Biaya Peralatan' | 'Biaya Jasa' | 'Biaya Bahan';
  hargaSatuan: number;
  qty: number;
}

export type EstimasiStatus = 'Draft' | 'Dikonversi ke Quotation';

export interface Estimasi {
  id: string;
  clientId: string;
  jenisJasa: string;
  anggaran: number;
  jadwal: string;
  deadline: string;
  skillset: number;
  items: EstimasiItem[];
  totalBiaya: number;
  labaKotor: number;
  infaq: number;
  labaBersih: number;
  saham: number;
  status: EstimasiStatus;
  quotationId?: string;
  notes: string;
  createdAt: string;
}

export interface DocumentLineItem {
  productNumber: string;
  description: string;
  qty: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
}

export type QuotationStatus = 'Draft' | 'Terkirim' | 'Disetujui' | 'Ditolak';

export interface Quotation {
  id: string;
  clientId: string;
  quotationNumber: string;
  quotationDate: string;
  paymentTerms: string;
  purchaseOrder: string;
  orderNumber: string;
  proposeToName: string;
  proposeToAttn: string;
  servicePeriod: string;
  items: DocumentLineItem[];
  discount: number;
  status: QuotationStatus;
  notes: string;
  createdAt: string;
}

export type InvoiceStatus = 'Draft' | 'Belum Dibayar' | 'Lunas';

export interface Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  poNumber: string;
  orderNumber: string;
  paymentTerms: string;
  billToName: string;
  billToAddress: string;
  servicePeriod: string;
  items: DocumentLineItem[];
  discount: number;
  status: InvoiceStatus;
  notes: string;
  createdAt: string;
}

export type PaymentStatus = 'Paid Off' | 'Partial' | 'Pending';

export interface PaymentConfirmation {
  id: string;
  clientId: string;
  invoiceId: string;
  confirmationNumber: string;
  paymentDate: string;
  paymentMethod: string;
  confirmToName: string;
  confirmToAttn: string;
  serviceTerm: string;
  items: DocumentLineItem[];
  discount: number;
  bankSource: string;
  bankBenef: string;
  status: PaymentStatus;
  notes: string;
  createdAt: string;
}

export type UserRole = 
  | 'Super Admin / Project Manager'
  | 'Web Dev / Site Engineer'
  | 'Admin'
  | 'Staff Creator'
  | 'Client Partner';

export interface WorkspaceApp {
  id: string;
  name: string;
  category: 'Core Operations' | 'Finance & Legal' | 'Creative & Assets' | 'People & Talent';
  url: string;
  current?: boolean;
}
