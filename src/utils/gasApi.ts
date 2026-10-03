export const DEFAULT_GAS_CRM_URL =
  'https://script.google.com/macros/s/AKfycbynENAR5tCdM7h-e5ygYUUwJMyKxRTj4JLjCcrgFpfu2LUc0sf0d2_8JV72ojfhQxjuKw/exec';

export const DEFAULT_GAS_EQUIPMENT_URL =
  'https://script.google.com/macros/s/AKfycbyMneAOyNC9IXiplU4sLOHWjWJvjSWKIyJ1dmZOYxH48AbwNFddgydPgDLxXeuaO3ixlA/exec';

export interface GasProxyResponse {
  status: 'success' | 'error' | 'warning';
  code?: 'ACCESS_DENIED' | 'HTML_RESPONSE' | string;
  title?: string;
  message?: string;
  instruction?: string[];
  data?: any;
  rawSnippet?: string;
}

/**
 * 100% LENGKAP - Seluruh isi Code.gs untuk Spreadsheet CRM obeecreatives
 * Anda tinggal Ctrl+A (Select All) di Code.gs, hapus semua, lalu Paste kode ini.
 */
export const GAS_ROUTER_V2_SCRIPT = `/**
 * ====================================================================================
 * OBEE CREATIVES - MASTER CRM WORKSPACE OS BACKEND (Code.gs LENGKAP V2)
 * Sheets: Clients, Leads, Activities, Invoices, PaymentConfirmations, Quotations, Meetings, Estimasi
 * ====================================================================================
 * CARA PASANG:
 * 1. Buka Spreadsheet CRM Anda -> Extensions -> Apps Script.
 * 2. Buka file Code.gs -> Select All (Ctrl+A / Cmd+A) -> Hapus semua isinya.
 * 3. Paste seluruh kode ini ke dalam Code.gs -> Simpan (Ctrl+S / Cmd+S).
 * 4. Klik Deploy -> Manage deployments -> Klik ikon Pensil (Edit).
 * 5. PENTING: Pada "Who has access", pilih "Anyone" (Siapa saja).
 * 6. Pada dropdown Version, pilih "New version" -> Klik Deploy.
 * ====================================================================================
 */

var SHEET_CLIENTS = 'Clients';
var SHEET_LEADS = 'Leads';
var SHEET_ACTIVITIES = 'Activities';
var SHEET_INVOICES = 'Invoices';
var SHEET_PAYMENTS = 'PaymentConfirmations';
var SHEET_QUOTATIONS = 'Quotations';
var SHEET_MEETINGS = 'Meetings';
var SHEET_ESTIMASI = 'Estimasi';

// --- Equipment Hub (baca lintas-spreadsheet untuk inventaris studio & harga sewa) ---
var EQUIPMENT_HUB_ID = '1aKyHRlQLlJDCAvOFwFyxnJ-ATxyUBI_-X5fcb_LUhEk';
var EQUIPMENT_SHEET_NAME = 'Inventaris';
var EQUIPMENT_CACHE_SECONDS = 300; // 5 menit cache

// --- Formula Estimasi Biaya Produksi ---
var INFAQ_RATE = 0.025; // 2.5%
var SAHAM_RATE = 0.10;  // 10%

var CLIENT_HEADERS = ['id', 'name', 'company', 'phone', 'email', 'division', 'notes', 'createdAt'];
var LEAD_HEADERS = ['id', 'title', 'clientId', 'division', 'value', 'stage', 'createdAt'];
var ACTIVITY_HEADERS = ['id', 'clientId', 'type', 'note', 'date', 'followUpDate', 'followUpDone', 'createdAt'];
var INVOICE_HEADERS = [
  'id', 'clientId', 'invoiceNumber', 'invoiceDate', 'poNumber', 'orderNumber', 'paymentTerms',
  'billToName', 'billToAddress', 'servicePeriod', 'itemsJson', 'discount',
  'status', 'notes', 'createdAt'
];
var PAYMENT_HEADERS = [
  'id', 'clientId', 'invoiceId', 'confirmationNumber', 'paymentDate', 'paymentMethod',
  'confirmToName', 'confirmToAttn', 'serviceTerm', 'itemsJson', 'discount',
  'bankSource', 'bankBenef', 'status', 'notes', 'createdAt'
];
var QUOTATION_HEADERS = [
  'id', 'clientId', 'quotationNumber', 'quotationDate', 'paymentTerms', 'purchaseOrder', 'orderNumber',
  'proposeToName', 'proposeToAttn', 'servicePeriod', 'itemsJson', 'discount',
  'status', 'notes', 'createdAt'
];
var MEETING_HEADERS = [
  'id', 'clientId', 'title', 'meetingType', 'meetingDate', 'startTime', 'endTime',
  'location', 'attendees', 'status', 'notes', 'createdAt'
];
var ESTIMASI_HEADERS = [
  'id', 'clientId', 'jenisJasa', 'anggaran', 'jadwal', 'deadline', 'skillset',
  'itemsJson', 'totalBiaya', 'labaKotor', 'infaq', 'labaBersih', 'saham',
  'status', 'quotationId', 'notes', 'createdAt'
];

var COMPANY = {
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

/* ============================= API & WEB APP ENTRY ============================= */

/**
 * Handle GET Requests:
 * Jika ada parameter action, otomatis mengembalikan JSON API response berkecepatan tinggi.
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action).trim() : '';

  if (action !== '') {
    var result = {};
    try {
      if (action === 'ping') {
        result = { status: 'success', message: 'API Google Apps Script CRM V2 aktif dan terhubung!' };
      } else if (action === 'getAll') {
        result = { status: 'success', data: getAllData() };
      } else if (action === 'getClients') {
        result = { status: 'success', data: getClientsData() };
      } else if (action === 'getLeads') {
        result = { status: 'success', data: getLeadsData() };
      } else if (action === 'getMeetings') {
        result = { status: 'success', data: getMeetingsData() };
      } else if (action === 'getInvoices') {
        result = { status: 'success', data: getInvoicesData() };
      } else if (action === 'getQuotations') {
        result = { status: 'success', data: getQuotationsData() };
      } else if (action === 'getPayments') {
        result = { status: 'success', data: getPaymentConfirmationsData() };
      } else if (action === 'getEstimasi') {
        result = { status: 'success', data: getEstimasiData() };
      } else if (action === 'getEquipment') {
        result = { status: 'success', data: getEquipmentListData() };
      } else {
        result = { status: 'error', message: 'Action tidak dikenal: ' + action };
      }
    } catch (err) {
      result = { status: 'error', message: err.toString() };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Jika dibuka di browser biasa tanpa parameter API
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    service: 'CRM OBEECREATIVES API V2 (WORKSPACE OS)',
    timestamp: new Date().toISOString(),
    instruction: 'Gunakan parameter ?action=getAll atau ?action=getClients untuk mengambil data JSON.'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST Requests dari Web Apps:
 */
function doPost(e) {
  var result = {};
  try {
    var contents = JSON.parse(e.postData.contents);
    var action = contents.action;
    var payload = contents.payload;
    
    if (action === 'saveClient') {
      result = { status: 'success', data: saveClient(payload) };
    } else if (action === 'deleteClient') {
      result = { status: 'success', data: deleteClient(payload.id) };
    } else if (action === 'saveLead') {
      result = { status: 'success', data: saveLead(payload) };
    } else if (action === 'deleteLead') {
      result = { status: 'success', data: deleteLead(payload.id) };
    } else if (action === 'saveMeeting') {
      result = { status: 'success', data: saveMeeting(payload) };
    } else if (action === 'deleteMeeting') {
      result = { status: 'success', data: deleteMeeting(payload.id) };
    } else if (action === 'saveEstimasi') {
      result = { status: 'success', data: saveEstimasi(payload) };
    } else if (action === 'deleteEstimasi') {
      result = { status: 'success', data: deleteEstimasi(payload.id) };
    } else if (action === 'saveQuotation') {
      result = { status: 'success', data: saveQuotation(payload) };
    } else if (action === 'deleteQuotation') {
      result = { status: 'success', data: deleteQuotation(payload.id) };
    } else if (action === 'saveInvoice') {
      result = { status: 'success', data: saveInvoice(payload) };
    } else if (action === 'deleteInvoice') {
      result = { status: 'success', data: deleteInvoice(payload.id) };
    } else if (action === 'savePayment') {
      result = { status: 'success', data: savePaymentConfirmation(payload) };
    } else if (action === 'deletePayment') {
      result = { status: 'success', data: deletePaymentConfirmation(payload.id) };
    } else {
      result = { status: 'error', message: 'Action tidak didukung: ' + action };
    }
  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function ping() {
  return true;
}

function getCompanyInfo() {
  return COMPANY;
}

/* ============================= SETUP & TRIM SHEETS ============================= */

function setupSheets() {
  getOrCreateSheet_(SHEET_CLIENTS, CLIENT_HEADERS);
  getOrCreateSheet_(SHEET_LEADS, LEAD_HEADERS);
  getOrCreateSheet_(SHEET_ACTIVITIES, ACTIVITY_HEADERS);
  getOrCreateSheet_(SHEET_INVOICES, INVOICE_HEADERS);
  getOrCreateSheet_(SHEET_PAYMENTS, PAYMENT_HEADERS);
  getOrCreateSheet_(SHEET_QUOTATIONS, QUOTATION_HEADERS);
  getOrCreateSheet_(SHEET_MEETINGS, MEETING_HEADERS);
  getOrCreateSheet_(SHEET_ESTIMASI, ESTIMASI_HEADERS);
  return 'Sheets siap: Clients, Leads, Activities, Invoices, PaymentConfirmations, Quotations, Meetings, Estimasi';
}

function trimSheets() {
  var sheetHeaderPairs = [
    [SHEET_CLIENTS, CLIENT_HEADERS],
    [SHEET_LEADS, LEAD_HEADERS],
    [SHEET_ACTIVITIES, ACTIVITY_HEADERS],
    [SHEET_MEETINGS, MEETING_HEADERS],
    [SHEET_INVOICES, INVOICE_HEADERS],
    [SHEET_PAYMENTS, PAYMENT_HEADERS],
    [SHEET_QUOTATIONS, QUOTATION_HEADERS],
    [SHEET_ESTIMASI, ESTIMASI_HEADERS],
  ];
  var report = [];
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  sheetHeaderPairs.forEach(function (pair) {
    var name = pair[0];
    var headers = pair[1];
    var sheet = ss.getSheetByName(name);
    if (!sheet) return;

    var lastDataRow = getLastDataRow_(sheet);
    var keepUntilRow = lastDataRow + 1;
    var maxRows = sheet.getMaxRows();
    var rowsTrimmed = 0;
    if (maxRows > keepUntilRow) {
      rowsTrimmed = maxRows - keepUntilRow;
      sheet.deleteRows(keepUntilRow + 1, rowsTrimmed);
    }

    var lastDataCol = headers.length;
    var maxCols = sheet.getMaxColumns();
    var colsTrimmed = 0;
    if (maxCols > lastDataCol) {
      colsTrimmed = maxCols - lastDataCol;
      sheet.deleteColumns(lastDataCol + 1, colsTrimmed);
    }

    report.push(name + ': hapus ' + rowsTrimmed + ' baris kosong, ' + colsTrimmed + ' kolom kosong');
  });

  return report.join('\\n');
}

function getOrCreateSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/* ============================= GENERIC HELPERS ============================= */

function sanitizeForClient_(value) {
  if (value === null || value === undefined) return value;
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeForClient_);
  }
  if (typeof value === 'object') {
    var out = {};
    for (var key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        out[key] = sanitizeForClient_(value[key]);
      }
    }
    return out;
  }
  return value;
}

function sheetToObjects_(sheet, headers) {
  var lastRow = getLastDataRow_(sheet);
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  var out = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (row.join('') === '') continue;
    var obj = {};
    for (var c = 0; c < headers.length; c++) obj[headers[c]] = row[c];
    out.push(obj);
  }
  return out;
}

function getLastDataRow_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return lastRow;
  var idValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = idValues.length - 1; i >= 0; i--) {
    if (idValues[i][0] !== '' && idValues[i][0] !== null && idValues[i][0] !== undefined) {
      return i + 2;
    }
  }
  return 1;
}

function objectToRow_(obj, headers) {
  return headers.map(function (h) {
    return obj[h] !== undefined && obj[h] !== null ? obj[h] : '';
  });
}

function safeDeleteRow_(sheet, rowIdx) {
  if (sheet.getMaxRows() <= rowIdx) {
    sheet.insertRowAfter(rowIdx);
  }
  sheet.deleteRow(rowIdx);
}

function findRowIndexById_(sheet, headers, id) {
  var lastRow = getLastDataRow_(sheet);
  if (lastRow < 2) return -1;
  var idCol = headers.indexOf('id') + 1;
  var ids = sheet.getRange(2, idCol, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function deleteRowsWhere_(sheet, headers, key, value) {
  var lastRow = getLastDataRow_(sheet);
  if (lastRow < 2) return;
  var colIdx = headers.indexOf(key) + 1;
  var colValues = sheet.getRange(2, colIdx, lastRow - 1, 1).getValues();
  for (var i = colValues.length - 1; i >= 0; i--) {
    if (String(colValues[i][0]) === String(value)) safeDeleteRow_(sheet, i + 2);
  }
}

function newId_() {
  return Utilities.getUuid();
}

function todayIso_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

/* ============================= AGGREGATE READ ============================= */

function getAllData() {
  return sanitizeForClient_({
    clients: getClientsData(),
    leads: getLeadsData(),
    activities: getActivitiesData(),
    meetings: getMeetingsData(),
    invoices: getInvoicesData(),
    paymentConfirmations: getPaymentConfirmationsData(),
    quotations: getQuotationsData(),
    estimasi: getEstimasiData(),
  });
}

function getClientsData() {
  return sanitizeForClient_(sheetToObjects_(getOrCreateSheet_(SHEET_CLIENTS, CLIENT_HEADERS), CLIENT_HEADERS));
}
function getLeadsData() {
  return sanitizeForClient_(sheetToObjects_(getOrCreateSheet_(SHEET_LEADS, LEAD_HEADERS), LEAD_HEADERS));
}
function getActivitiesData() {
  return sanitizeForClient_(sheetToObjects_(getOrCreateSheet_(SHEET_ACTIVITIES, ACTIVITY_HEADERS), ACTIVITY_HEADERS));
}
function getMeetingsData() {
  return sanitizeForClient_(sheetToObjects_(getOrCreateSheet_(SHEET_MEETINGS, MEETING_HEADERS), MEETING_HEADERS));
}
function getInvoicesData() {
  return sanitizeForClient_(sheetToObjects_(getOrCreateSheet_(SHEET_INVOICES, INVOICE_HEADERS), INVOICE_HEADERS).map(parseInvoiceRow_));
}
function getPaymentConfirmationsData() {
  return sanitizeForClient_(sheetToObjects_(getOrCreateSheet_(SHEET_PAYMENTS, PAYMENT_HEADERS), PAYMENT_HEADERS).map(parsePaymentRow_));
}
function getQuotationsData() {
  return sanitizeForClient_(sheetToObjects_(getOrCreateSheet_(SHEET_QUOTATIONS, QUOTATION_HEADERS), QUOTATION_HEADERS).map(parseQuotationRow_));
}

/* ============================= CLIENTS CRUD ============================= */

function saveClient(client) {
  var sheet = getOrCreateSheet_(SHEET_CLIENTS, CLIENT_HEADERS);
  if (client.id) {
    var rowIdx = findRowIndexById_(sheet, CLIENT_HEADERS, client.id);
    if (rowIdx === -1) throw new Error('Klien tidak ditemukan: ' + client.id);
    sheet.getRange(rowIdx, 1, 1, CLIENT_HEADERS.length).setValues([objectToRow_(client, CLIENT_HEADERS)]);
  } else {
    client.id = newId_();
    client.createdAt = todayIso_();
    sheet.appendRow(objectToRow_(client, CLIENT_HEADERS));
  }
  return client;
}

function deleteClient(id) {
  var sheet = getOrCreateSheet_(SHEET_CLIENTS, CLIENT_HEADERS);
  var rowIdx = findRowIndexById_(sheet, CLIENT_HEADERS, id);
  if (rowIdx > -1) safeDeleteRow_(sheet, rowIdx);

  // Cascade delete related records
  deleteRowsWhere_(getOrCreateSheet_(SHEET_LEADS, LEAD_HEADERS), LEAD_HEADERS, 'clientId', id);
  deleteRowsWhere_(getOrCreateSheet_(SHEET_ACTIVITIES, ACTIVITY_HEADERS), ACTIVITY_HEADERS, 'clientId', id);
  deleteRowsWhere_(getOrCreateSheet_(SHEET_INVOICES, INVOICE_HEADERS), INVOICE_HEADERS, 'clientId', id);
  deleteRowsWhere_(getOrCreateSheet_(SHEET_PAYMENTS, PAYMENT_HEADERS), PAYMENT_HEADERS, 'clientId', id);
  deleteRowsWhere_(getOrCreateSheet_(SHEET_QUOTATIONS, QUOTATION_HEADERS), QUOTATION_HEADERS, 'clientId', id);
  deleteRowsWhere_(getOrCreateSheet_(SHEET_MEETINGS, MEETING_HEADERS), MEETING_HEADERS, 'clientId', id);
  deleteRowsWhere_(getOrCreateSheet_(SHEET_ESTIMASI, ESTIMASI_HEADERS), ESTIMASI_HEADERS, 'clientId', id);
  return { deleted: true, id: id };
}

/* ============================= LEADS CRUD ============================= */

function saveLead(lead) {
  var sheet = getOrCreateSheet_(SHEET_LEADS, LEAD_HEADERS);
  if (lead.id) {
    var rowIdx = findRowIndexById_(sheet, LEAD_HEADERS, lead.id);
    if (rowIdx === -1) throw new Error('Lead tidak ditemukan: ' + lead.id);
    sheet.getRange(rowIdx, 1, 1, LEAD_HEADERS.length).setValues([objectToRow_(lead, LEAD_HEADERS)]);
  } else {
    lead.id = newId_();
    lead.createdAt = todayIso_();
    sheet.appendRow(objectToRow_(lead, LEAD_HEADERS));
  }
  return lead;
}

function deleteLead(id) {
  var sheet = getOrCreateSheet_(SHEET_LEADS, LEAD_HEADERS);
  var rowIdx = findRowIndexById_(sheet, LEAD_HEADERS, id);
  if (rowIdx > -1) safeDeleteRow_(sheet, rowIdx);
  return { deleted: true, id: id };
}

function moveLeadStage(id, stage) {
  var sheet = getOrCreateSheet_(SHEET_LEADS, LEAD_HEADERS);
  var rowIdx = findRowIndexById_(sheet, LEAD_HEADERS, id);
  if (rowIdx === -1) throw new Error('Lead tidak ditemukan: ' + id);
  var stageCol = LEAD_HEADERS.indexOf('stage') + 1;
  sheet.getRange(rowIdx, stageCol).setValue(stage);
  return { id: id, stage: stage };
}

/* ============================= ACTIVITIES CRUD ============================= */

function saveActivity(activity) {
  var sheet = getOrCreateSheet_(SHEET_ACTIVITIES, ACTIVITY_HEADERS);
  if (activity.id) {
    var rowIdx = findRowIndexById_(sheet, ACTIVITY_HEADERS, activity.id);
    if (rowIdx === -1) throw new Error('Aktivitas tidak ditemukan: ' + activity.id);
    sheet.getRange(rowIdx, 1, 1, ACTIVITY_HEADERS.length).setValues([objectToRow_(activity, ACTIVITY_HEADERS)]);
  } else {
    activity.id = newId_();
    activity.createdAt = todayIso_();
    if (activity.followUpDone === undefined) activity.followUpDone = false;
    sheet.appendRow(objectToRow_(activity, ACTIVITY_HEADERS));
  }
  return activity;
}

function deleteActivity(id) {
  var sheet = getOrCreateSheet_(SHEET_ACTIVITIES, ACTIVITY_HEADERS);
  var rowIdx = findRowIndexById_(sheet, ACTIVITY_HEADERS, id);
  if (rowIdx > -1) safeDeleteRow_(sheet, rowIdx);
  return { deleted: true, id: id };
}

function toggleFollowUpDone(id, done) {
  var sheet = getOrCreateSheet_(SHEET_ACTIVITIES, ACTIVITY_HEADERS);
  var rowIdx = findRowIndexById_(sheet, ACTIVITY_HEADERS, id);
  if (rowIdx === -1) throw new Error('Aktivitas tidak ditemukan: ' + id);
  var col = ACTIVITY_HEADERS.indexOf('followUpDone') + 1;
  sheet.getRange(rowIdx, col).setValue(done);
  return { id: id, followUpDone: done };
}

/* ============================= INVOICES CRUD ============================= */

function parseInvoiceRow_(row) {
  var out = Object.assign({}, row);
  try {
    out.items = JSON.parse(row.itemsJson || '[]');
  } catch (e) {
    out.items = [];
  }
  delete out.itemsJson;
  return out;
}

function saveInvoice(invoice) {
  var sheet = getOrCreateSheet_(SHEET_INVOICES, INVOICE_HEADERS);
  var row = Object.assign({}, invoice);
  row.itemsJson = JSON.stringify(invoice.items || []);
  delete row.items;

  if (row.id) {
    var rowIdx = findRowIndexById_(sheet, INVOICE_HEADERS, row.id);
    if (rowIdx === -1) throw new Error('Invoice tidak ditemukan: ' + row.id);
    sheet.getRange(rowIdx, 1, 1, INVOICE_HEADERS.length).setValues([objectToRow_(row, INVOICE_HEADERS)]);
  } else {
    row.id = newId_();
    row.createdAt = todayIso_();
    if (!row.status) row.status = 'Belum Dibayar';
    sheet.appendRow(objectToRow_(row, INVOICE_HEADERS));
  }
  return parseInvoiceRow_(row);
}

function deleteInvoice(id) {
  var sheet = getOrCreateSheet_(SHEET_INVOICES, INVOICE_HEADERS);
  var rowIdx = findRowIndexById_(sheet, INVOICE_HEADERS, id);
  if (rowIdx > -1) safeDeleteRow_(sheet, rowIdx);
  return { deleted: true, id: id };
}

function setInvoiceStatus(id, status) {
  var sheet = getOrCreateSheet_(SHEET_INVOICES, INVOICE_HEADERS);
  var rowIdx = findRowIndexById_(sheet, INVOICE_HEADERS, id);
  if (rowIdx === -1) throw new Error('Invoice tidak ditemukan: ' + id);
  var col = INVOICE_HEADERS.indexOf('status') + 1;
  sheet.getRange(rowIdx, col).setValue(status);
  return { id: id, status: status };
}

/* ============================= MEETINGS CRUD ============================= */

function saveMeeting(meeting) {
  var sheet = getOrCreateSheet_(SHEET_MEETINGS, MEETING_HEADERS);
  if (meeting.id) {
    var rowIdx = findRowIndexById_(sheet, MEETING_HEADERS, meeting.id);
    if (rowIdx === -1) throw new Error('Jadwal tidak ditemukan: ' + meeting.id);
    sheet.getRange(rowIdx, 1, 1, MEETING_HEADERS.length).setValues([objectToRow_(meeting, MEETING_HEADERS)]);
  } else {
    meeting.id = newId_();
    meeting.createdAt = todayIso_();
    if (!meeting.status) meeting.status = 'Terjadwal';
    sheet.appendRow(objectToRow_(meeting, MEETING_HEADERS));
  }
  return meeting;
}

function deleteMeeting(id) {
  var sheet = getOrCreateSheet_(SHEET_MEETINGS, MEETING_HEADERS);
  var rowIdx = findRowIndexById_(sheet, MEETING_HEADERS, id);
  if (rowIdx > -1) safeDeleteRow_(sheet, rowIdx);
  return { deleted: true, id: id };
}

function setMeetingStatus(id, status) {
  var sheet = getOrCreateSheet_(SHEET_MEETINGS, MEETING_HEADERS);
  var rowIdx = findRowIndexById_(sheet, MEETING_HEADERS, id);
  if (rowIdx === -1) throw new Error('Jadwal tidak ditemukan: ' + id);
  var col = MEETING_HEADERS.indexOf('status') + 1;
  sheet.getRange(rowIdx, col).setValue(status);
  return { id: id, status: status };
}

/* ============================= EQUIPMENT HUB ============================= */

function getEquipmentListData() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('equipment_list_v2');
  if (cached) return JSON.parse(cached);

  var ss;
  try {
    ss = SpreadsheetApp.openById(EQUIPMENT_HUB_ID);
  } catch (e) {
    return [];
  }
  var sheet = ss.getSheetByName(EQUIPMENT_SHEET_NAME);
  if (!sheet) return [];

  var lastRow = getLastDataRow_(sheet);
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
  var items = [];
  values.forEach(function (row) {
    var id = row[0];
    var namaBarang = row[2];
    if (!id || !namaBarang) return;
    items.push({
      id: String(id).trim(),
      kategori: String(row[1] || '').trim(),
      namaBarang: String(namaBarang).trim(),
      satuan: String(row[4] || '').trim(),
      qtyTotal: Number(row[5] || 0),
      hargaSewa: Number(row[7] || 0),
      kondisi: String(row[9] || '').trim(),
    });
  });

  cache.put('equipment_list_v2', JSON.stringify(items), EQUIPMENT_CACHE_SECONDS);
  return items;
}

/* ============================= ESTIMASI BIAYA CRUD ============================= */

function parseEstimasiRow_(row) {
  var out = Object.assign({}, row);
  try {
    out.items = JSON.parse(row.itemsJson || '[]');
  } catch (e) {
    out.items = [];
  }
  delete out.itemsJson;
  return out;
}

function getEstimasiData() {
  return sanitizeForClient_(sheetToObjects_(getOrCreateSheet_(SHEET_ESTIMASI, ESTIMASI_HEADERS), ESTIMASI_HEADERS).map(parseEstimasiRow_));
}

function saveEstimasi(estimasi) {
  var sheet = getOrCreateSheet_(SHEET_ESTIMASI, ESTIMASI_HEADERS);
  var row = Object.assign({}, estimasi);
  row.itemsJson = JSON.stringify(estimasi.items || []);
  delete row.items;

  if (row.id) {
    var rowIdx = findRowIndexById_(sheet, ESTIMASI_HEADERS, row.id);
    if (rowIdx === -1) throw new Error('Estimasi tidak ditemukan: ' + row.id);
    sheet.getRange(rowIdx, 1, 1, ESTIMASI_HEADERS.length).setValues([objectToRow_(row, ESTIMASI_HEADERS)]);
  } else {
    row.id = newId_();
    row.createdAt = todayIso_();
    if (!row.status) row.status = 'Draft';
    sheet.appendRow(objectToRow_(row, ESTIMASI_HEADERS));
  }
  return parseEstimasiRow_(row);
}

function deleteEstimasi(id) {
  var sheet = getOrCreateSheet_(SHEET_ESTIMASI, ESTIMASI_HEADERS);
  var rowIdx = findRowIndexById_(sheet, ESTIMASI_HEADERS, id);
  if (rowIdx > -1) safeDeleteRow_(sheet, rowIdx);
  return { deleted: true, id: id };
}

function markEstimasiConverted(estimasiId, quotationId) {
  var sheet = getOrCreateSheet_(SHEET_ESTIMASI, ESTIMASI_HEADERS);
  var rowIdx = findRowIndexById_(sheet, ESTIMASI_HEADERS, estimasiId);
  if (rowIdx === -1) throw new Error('Estimasi tidak ditemukan: ' + estimasiId);
  var statusCol = ESTIMASI_HEADERS.indexOf('status') + 1;
  var quoCol = ESTIMASI_HEADERS.indexOf('quotationId') + 1;
  sheet.getRange(rowIdx, statusCol).setValue('Dikonversi ke Quotation');
  sheet.getRange(rowIdx, quoCol).setValue(quotationId);
  return { id: estimasiId, status: 'Dikonversi ke Quotation' };
}

/* ============================= QUOTATIONS CRUD ============================= */

function parseQuotationRow_(row) {
  var out = Object.assign({}, row);
  try {
    out.items = JSON.parse(row.itemsJson || '[]');
  } catch (e) {
    out.items = [];
  }
  delete out.itemsJson;
  return out;
}

function saveQuotation(quotation) {
  var sheet = getOrCreateSheet_(SHEET_QUOTATIONS, QUOTATION_HEADERS);
  var row = Object.assign({}, quotation);
  row.itemsJson = JSON.stringify(quotation.items || []);
  delete row.items;

  if (row.id) {
    var rowIdx = findRowIndexById_(sheet, QUOTATION_HEADERS, row.id);
    if (rowIdx === -1) throw new Error('Quotation tidak ditemukan: ' + row.id);
    sheet.getRange(rowIdx, 1, 1, QUOTATION_HEADERS.length).setValues([objectToRow_(row, QUOTATION_HEADERS)]);
  } else {
    row.id = newId_();
    row.createdAt = todayIso_();
    if (!row.status) row.status = 'Draft';
    sheet.appendRow(objectToRow_(row, QUOTATION_HEADERS));
  }
  return parseQuotationRow_(row);
}

function deleteQuotation(id) {
  var sheet = getOrCreateSheet_(SHEET_QUOTATIONS, QUOTATION_HEADERS);
  var rowIdx = findRowIndexById_(sheet, QUOTATION_HEADERS, id);
  if (rowIdx > -1) safeDeleteRow_(sheet, rowIdx);
  return { deleted: true, id: id };
}

function setQuotationStatus(id, status) {
  var sheet = getOrCreateSheet_(SHEET_QUOTATIONS, QUOTATION_HEADERS);
  var rowIdx = findRowIndexById_(sheet, QUOTATION_HEADERS, id);
  if (rowIdx === -1) throw new Error('Quotation tidak ditemukan: ' + id);
  var col = QUOTATION_HEADERS.indexOf('status') + 1;
  sheet.getRange(rowIdx, col).setValue(status);
  return { id: id, status: status };
}

/* ============================= PAYMENT CONFIRMATIONS CRUD ============================= */

function parsePaymentRow_(row) {
  var out = Object.assign({}, row);
  try {
    out.items = JSON.parse(row.itemsJson || '[]');
  } catch (e) {
    out.items = [];
  }
  delete out.itemsJson;
  return out;
}

function savePaymentConfirmation(payment) {
  var sheet = getOrCreateSheet_(SHEET_PAYMENTS, PAYMENT_HEADERS);
  var row = Object.assign({}, payment);
  row.itemsJson = JSON.stringify(payment.items || []);
  delete row.items;

  if (row.id) {
    var rowIdx = findRowIndexById_(sheet, PAYMENT_HEADERS, row.id);
    if (rowIdx === -1) throw new Error('Payment confirmation tidak ditemukan: ' + row.id);
    sheet.getRange(rowIdx, 1, 1, PAYMENT_HEADERS.length).setValues([objectToRow_(row, PAYMENT_HEADERS)]);
  } else {
    row.id = newId_();
    row.createdAt = todayIso_();
    if (!row.status) row.status = 'Paid Off';
    sheet.appendRow(objectToRow_(row, PAYMENT_HEADERS));
  }

  // Jika status Paid Off dan ada invoiceId, otomatis tandai invoice Lunas
  if (row.invoiceId && row.status === 'Paid Off') {
    try { setInvoiceStatus(row.invoiceId, 'Lunas'); } catch (e) { /* ignore */ }
  }

  return parsePaymentRow_(row);
}

function deletePaymentConfirmation(id) {
  var sheet = getOrCreateSheet_(SHEET_PAYMENTS, PAYMENT_HEADERS);
  var rowIdx = findRowIndexById_(sheet, PAYMENT_HEADERS, id);
  if (rowIdx > -1) safeDeleteRow_(sheet, rowIdx);
  return { deleted: true, id: id };
}

function setPaymentStatus(id, status) {
  var sheet = getOrCreateSheet_(SHEET_PAYMENTS, PAYMENT_HEADERS);
  var rowIdx = findRowIndexById_(sheet, PAYMENT_HEADERS, id);
  if (rowIdx === -1) throw new Error('Payment confirmation tidak ditemukan: ' + id);
  var col = PAYMENT_HEADERS.indexOf('status') + 1;
  sheet.getRange(rowIdx, col).setValue(status);

  if (status === 'Paid Off') {
    var invCol = PAYMENT_HEADERS.indexOf('invoiceId') + 1;
    var invoiceId = sheet.getRange(rowIdx, invCol).getValue();
    if (invoiceId) {
      try { setInvoiceStatus(invoiceId, 'Lunas'); } catch (e) { /* ignore */ }
    }
  }
  return { id: id, status: status };
}
`;

/**
 * Test connection using server-side proxy `/api/gas-proxy`.
 */
export async function testGasConnection(targetUrl: string = DEFAULT_GAS_CRM_URL): Promise<GasProxyResponse> {
  try {
    const proxyUrl = `/api/gas-proxy?url=${encodeURIComponent(targetUrl)}&action=ping`;
    const res = await fetch(proxyUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        status: 'error',
        message: `Server Proxy Error (${res.status}): ${errText.slice(0, 200)}`,
      };
    }

    const data: GasProxyResponse = await res.json();
    return data;
  } catch (err: unknown) {
    return {
      status: 'error',
      message: `Gagal memanggil endpoint: ${err instanceof Error ? err.message : String(err)}. Mode database lokal tetap aktif dengan aman.`,
    };
  }
}

/**
 * Fetch all sheets data from Google Apps Script via proxy
 */
export async function fetchAllSheetsData(targetUrl: string = DEFAULT_GAS_CRM_URL): Promise<GasProxyResponse> {
  try {
    const proxyUrl = `/api/gas-proxy?url=${encodeURIComponent(targetUrl)}&action=getAll`;
    const res = await fetch(proxyUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
