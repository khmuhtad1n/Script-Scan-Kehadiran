// Code.gs

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Sistem Scan Kehadiran')
    .setFaviconUrl('https://www.google.com/images/favicon.ico');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('QR Code Tools')
    .addItem('Generate Test Data', 'generateTestData')
    .addItem('Generate QR Codes', 'generateQRCodes')
    .addToUi();
}

function processAttendance(barcode) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Kehadiran');
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === barcode) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    return {
      success: false,
      message: 'Barcode tidak ditemukan!'
    };
  }
  
  const currentTime = new Date();
  const formattedDate = Utilities.formatDate(currentTime, Session.getScriptTimeZone(), "dd/MM/yyyy");
  const formattedTime = Utilities.formatDate(currentTime, Session.getScriptTimeZone(), "HH:mm:ss");
  
  sheet.getRange(rowIndex, 4).setValue('Hadir');
  sheet.getRange(rowIndex, 5).setValue(formattedDate);
  sheet.getRange(rowIndex, 6).setValue(formattedTime);
  
  return {
    success: true,
    message: 'Kehadiran berhasil dicatat',
    name: data[rowIndex-1][0],
    barcode: barcode,
    date: formattedDate,
    time: formattedTime
  };
}

function generateTestData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Kehadiran');
  
  // Hapus data yang ada (kecuali header)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  // Set header
  sheet.getRange(1, 1, 1, 6).setValues([['Nama', 'Barcode', 'QR Code', 'Status', 'Tanggal', 'Jam']]);
  
  // Data dummy
  const testData = [
    ['John Doe', 'ATT001', '', '', '', ''],
    ['Jane Smith', 'ATT002', '', '', '', ''],
    ['Bob Johnson', 'ATT003', '', '', '', ''],
    ['Alice Brown', 'ATT004', '', '', '', ''],
    ['Charlie Davis', 'ATT005', '', '', '', ''],
    ['Eva Wilson', 'ATT006', '', '', '', ''],
    ['Frank Miller', 'ATT007', '', '', '', ''],
    ['Grace Lee', 'ATT008', '', '', '', ''],
    ['Henry Taylor', 'ATT009', '', '', '', ''],
    ['Ivy Clark', 'ATT010', '', '', '', '']
  ];
  
  // Tambahkan data ke sheet
  sheet.getRange(2, 1, testData.length, 6).setValues(testData);
  
  // Generate QR codes
  generateQRCodes();
  
  return 'Data testing dan QR code berhasil dibuat!';
}

function generateQRCodes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Kehadiran');
  const data = sheet.getDataRange().getValues();
  
  // Sesuaikan lebar kolom untuk QR code
  sheet.setColumnWidth(3, 150);

  // Mulai dari baris 2 (skip header)
  for (let i = 1; i < data.length; i++) {
    const barcodeText = data[i][1]; // Barcode di kolom B
    if (barcodeText) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(barcodeText)}`;
      const qrFormula = `=IMAGE("${qrUrl}", 4, 150, 150)`;
      sheet.getRange(i + 1, 3).setFormula(qrFormula); // QR code di kolom C
    }
  }
}

function getTestBarcodes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Kehadiran');
  const data = sheet.getDataRange().getValues();
  
  // Ambil semua barcode (kolom B) kecuali header
  const testBarcodes = data.slice(1).map(row => row[1]).filter(Boolean);
  
  return testBarcodes;
}

function clearBarcodeImages() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Kehadiran');
  const lastRow = sheet.getLastRow();
  // Clear QR code images column
  sheet.getRange(2, 3, lastRow - 1, 1).clearContent();
}