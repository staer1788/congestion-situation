// HTMLテンプレートを返す
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('SOYO Festival 混雑状況確認サイト')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

// Googleスプレッドシートのデータを取得
function fetchSheetData() {
  const sheetRange = 'シート1!A2:D'; // 単一シートから取得
  
  const spreadsheet = SpreadsheetApp.openById('YOUR_SHEET_ID');
  const sheetData = getValidRows(spreadsheet.getRange(sheetRange).getValues());

  return sheetData; // 単一のデータ配列を返す
}

// 有効な行のみ取得
function getValidRows(data) {
  const validRows = [];
  for (let row of data) {
    if (row.every(cell => cell === '')) break;
    validRows.push(row);
  }
  return validRows;
}