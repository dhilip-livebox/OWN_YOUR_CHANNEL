/**
 * AI Live TV — Google Apps Script Web App
 * ----------------------------------------
 * Backs the /api/leads endpoint (POST append) and the /admin dashboard (GET stats).
 *
 * SETUP
 *   1. Create a Google Sheet named "AI-TV-Channel-Leads".
 *   2. Add this header row in row 1:
 *      Timestamp | Name | Phone | Email | Country | State | City | Language | Interest
 *   3. Extensions → Apps Script → paste this file → Save.
 *   4. Deploy → New deployment → Type: Web app.
 *        Execute as: Me
 *        Who has access: Anyone
 *   5. Copy the /exec URL and store it in the app as SHEETS_ENDPOINT.
 */

var SHEET_NAME = 'AI-TV-Channel-Leads';

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActive().getSheets()[0];
    sheet.appendRow([
      new Date(),
      body.name || '',
      body.phone || '',
      body.email || '',
      body.country || '',
      body.state || '',
      body.city || '',
      body.language || '',
      body.interest || '',
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  try {
    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActive().getSheets()[0];
    var last = sheet.getLastRow();
    var rows = last > 1 ? sheet.getRange(2, 1, last - 1, 1).getValues() : [];

    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay()); // Sunday
    var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    var total = 0, today = 0, week = 0, month = 0;
    var byDay = {}; // 'YYYY-MM-DD' -> count

    // seed last 30 days
    for (var i = 29; i >= 0; i--) {
      var d = new Date(startOfToday);
      d.setDate(startOfToday.getDate() - i);
      byDay[isoDate(d)] = 0;
    }

    rows.forEach(function (r) {
      var ts = r[0];
      if (!(ts instanceof Date)) ts = new Date(ts);
      if (isNaN(ts.getTime())) return;
      total++;
      if (ts >= startOfToday) today++;
      if (ts >= startOfWeek) week++;
      if (ts >= startOfMonth) month++;

      var key = isoDate(ts);
      if (byDay.hasOwnProperty(key)) byDay[key]++;
    });

    var daily = Object.keys(byDay).sort().map(function (k) {
      return { date: k, count: byDay[k] };
    });

    return json({ total: total, today: today, week: week, month: month, daily: daily });
  } catch (err) {
    return json({ error: String(err) });
  }
}

function isoDate(d) {
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
