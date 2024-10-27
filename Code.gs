function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Attendance Scanning System')
    .setFaviconUrl('https://www.google.com/images/favicon.ico');
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

function generateQRCodes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Kehadiran');
  const data = sheet.getDataRange().getValues();
  
  sheet.setColumnWidth(3, 150);

  for (let i = 1; i < data.length; i++) {
    const barcodeText = data[i][1];
    if (barcodeText) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(barcodeText)}`;
      const qrFormula = `=IMAGE("${qrUrl}", 4, 150, 150)`;
      sheet.getRange(i + 1, 3).setFormula(qrFormula);
    }
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('QR Code Tools')
    .addItem('Generate QR Codes', 'generateQRCodes')
    .addToUi();
}