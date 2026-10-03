export const RED_BRAND = '#E30000';
export const RED_ACTION = '#DC2626';
export const RED_HIGHLIGHT = '#EF4444';
export const COMMERCIAL_BADGE_BG = 'rgba(69, 10, 10, 0.6)';

export const INFAQ_RATE = 0.025; // 2.5%
export const SAHAM_RATE = 0.10;  // 10%

export const COMPANY_INFO = {
  name: 'obeecreatives visual maker',
  addressLine1: 'Griya obeecreatives',
  addressLine2: 'Jl. Batok 8 Kota Batu',
  addressLine3: 'Jawa Timur 65314',
  bankName: 'BCA',
  bankAccount: '0190448703',
  bankHolder: 'a/c Lalu Mahendra Ali Akbar',
  signatureName: 'Vita Belfi W.',
  website: 'www.obeecreatives.com',
};

export const DIVISIONS = [
  'Social Media Management',
  'Desain Grafis',
  'Photography',
  'Videography',
  'Workshop/Pelatihan',
];

export const STAGES: Array<{ id: string; label: string; color: string }> = [
  { id: 'Prospek', label: 'Prospek', color: '#9CA3AF' },
  { id: 'Kontak', label: 'Kontak', color: '#3B82F6' },
  { id: 'Proposal', label: 'Proposal', color: '#F59E0B' },
  { id: 'Deal', label: 'Deal', color: '#16A34A' },
  { id: 'Lost', label: 'Lost', color: '#6B7280' },
];

export const formatRupiah = (val: number | string | undefined | null): string => {
  const num = Number(val) || 0;
  return 'Rp ' + num.toLocaleString('id-ID');
};

export const formatDate = (val: string | undefined | null): string => {
  if (!val) return '-';
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const todayIso = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const sanitizeWhatsAppPhone = (phone: string | number | undefined | null): string => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  if (digits.startsWith('62')) {
    return digits;
  }
  if (digits.startsWith('8')) {
    return '62' + digits;
  }
  return digits;
};

export interface InvoiceTotals {
  net: number;
  tax: number;
  discount: number;
  grand: number;
}

export const computeDocumentTotals = (
  items: Array<{ qty?: number; unitPrice?: number; taxRate?: number }>,
  discount: number = 0
): InvoiceTotals => {
  let net = 0;
  let tax = 0;
  (items || []).forEach((it) => {
    const q = Number(it.qty) || 0;
    const p = Number(it.unitPrice) || 0;
    const tr = Number(it.taxRate) || 0;
    const lineNet = q * p;
    const lineTax = lineNet * (tr / 100);
    net += lineNet;
    tax += lineTax;
  });
  const disc = Number(discount) || 0;
  return {
    net,
    tax,
    discount: disc,
    grand: Math.max(0, net + tax - disc),
  };
};

export interface EstimasiSummary {
  byCategory: {
    'Biaya Peralatan': number;
    'Biaya Jasa': number;
    'Biaya Bahan': number;
  };
  totalBiaya: number;
  anggaran: number;
  skillset: number;
  labaKotor: number;
  infaq: number;
  labaBersih: number;
  saham: number;
}

export const computeEstimasiSummary = (
  items: Array<{ kategori?: string; qty?: number; hargaSatuan?: number }>,
  skillset: number = 0,
  anggaran: number = 0
): EstimasiSummary => {
  const byCategory = {
    'Biaya Peralatan': 0,
    'Biaya Jasa': 0,
    'Biaya Bahan': 0,
  };

  (items || []).forEach((it) => {
    const cat = it.kategori as keyof typeof byCategory;
    const lineTotal = (Number(it.qty) || 0) * (Number(it.hargaSatuan) || 0);
    if (byCategory[cat] !== undefined) {
      byCategory[cat] += lineTotal;
    } else {
      byCategory['Biaya Jasa'] += lineTotal;
    }
  });

  const sk = Number(skillset) || 0;
  const ang = Number(anggaran) || 0;
  const totalBiaya = byCategory['Biaya Peralatan'] + byCategory['Biaya Jasa'] + byCategory['Biaya Bahan'] + sk;
  const labaKotor = ang - totalBiaya;
  const infaq = labaKotor > 0 ? labaKotor * INFAQ_RATE : 0;
  const labaBersih = labaKotor - infaq;
  const saham = labaBersih > 0 ? labaBersih * SAHAM_RATE : 0;

  return {
    byCategory,
    totalBiaya,
    anggaran: ang,
    skillset: sk,
    labaKotor,
    infaq,
    labaBersih,
    saham,
  };
};

export const parseRupiahText = (text: string | number | undefined | null): number => {
  if (text === undefined || text === null) return 0;
  if (typeof text === 'number') return text;
  const cleaned = String(text)
    .replace(/Rp/gi, '')
    .replace(/\s+/g, '')
    .replace(/\./g, '')
    .replace(/-/g, '')
    .replace(/,/g, '.');
  return Number(cleaned) || 0;
};
