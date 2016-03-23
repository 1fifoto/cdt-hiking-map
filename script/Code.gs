// The name of the spreadsheet from the browser location bar.
// Copy after 'key=' until before the next URL parameter beginning w/&
var SPREADSHEET_ID = '1xXi_mXYeqK0pmwkBmJvDJ1fXRiBCNc5Ba6cLYt5gsqM';

// The name of the sheet, displayed in a tab at the bottom of the spreadsheet.
// Default is 'Sheet1' if it's the first sheet.
var SHEET_NAME = 'Mileage Log';

function doGet(request) {
    var callback = request.parameters.jsonp;
    var range = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME).getDataRange();
    var json = callback + '(' + Utilities.jsonStringify(range.getValues()) + ')';
    return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

// Testing to see if the jsonp parameter is being used properly.
function testDoGet() {
    var request = {parameters: {jsonp: 'callback'}};
    var results = doGet(request);
    Logger.log(results.getContent());
}