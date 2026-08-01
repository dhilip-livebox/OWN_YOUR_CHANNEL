/**
 * Ai ivb7 — Google Apps Script Web App
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

var SHEET_NAME_LEADS = 'AI-TV-Channel-Leads';
var SHEET_NAME_ORDERS = 'AI-TV-Channel-Orders';

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var spreadsheet = SpreadsheetApp.getActive();
    
    if (body.type === 'update_pricing') {
       var sheet = spreadsheet.getSheetByName('AI-TV-Channel-Pricing');
       if (!sheet) {
         sheet = spreadsheet.insertSheet('AI-TV-Channel-Pricing');
       }
       if (sheet.getMaxColumns() < 6) {
         sheet.insertColumnsAfter(sheet.getMaxColumns(), 6 - sheet.getMaxColumns());
       }
       if (sheet.getLastRow() > 0) {
         sheet.getDataRange().clearContent();
       }
       sheet.appendRow(["id", "name", "description", "monthlyPrice", "monthlyOfferPrice", "annualDiscountPercent"]);
       sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
       if (body.services && body.services.length > 0) {
         var data = body.services.map(function(s) {
           return [
             s.id, s.name, s.description || "",
             s.monthlyPrice === null || s.monthlyPrice === undefined ? "" : s.monthlyPrice,
             s.monthlyOfferPrice === null || s.monthlyOfferPrice === undefined ? "" : s.monthlyOfferPrice,
             s.annualDiscountPercent || 0
           ];
         });
         sheet.getRange(2, 1, data.length, 6).setValues(data);
       }
       return json({ ok: true });
    } else if (body.type === 'checkout') {
      var sheet = spreadsheet.getSheetByName(SHEET_NAME_ORDERS);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME_ORDERS);
      }
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          'Timestamp', 'Name', 'Email', 'Phone', 'Selected Services', 'Subtotal', 'GST', 'Total Amount', 'Billing Cycle'
        ]);
        sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
      } else if (sheet.getRange(1, 9).getValue() !== 'Billing Cycle') {
        sheet.getRange(1, 9).setValue('Billing Cycle').setFontWeight('bold');
      }
      sheet.appendRow([
        new Date(),
        body.name || '',
        body.email || '',
        body.phone || '',
        body.services || '',
        body.subTotal || 0,
        body.gst || 0,
        body.amount || 0,
        body.billingCycle || ''
      ]);
      return json({ ok: true });
    } else if (body.type === 'consultation' || !body.type) {
      var sheet = spreadsheet.getSheetByName(SHEET_NAME_LEADS);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME_LEADS);
      }
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          'Timestamp', 'Name', 'Phone', 'Email', 'Country', 'State', 'City', 'Language', 'Interest'
        ]);
        sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
      }
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
    } else {
      return json({ ok: false, error: 'Unknown request type' });
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    var action = e && e.parameter ? e.parameter.action : null;
    var spreadsheet = SpreadsheetApp.getActive();
    
    if (action === 'pricing') {
      var sheet = spreadsheet.getSheetByName('AI-TV-Channel-Pricing');
      if (!sheet) {
        sheet = spreadsheet.insertSheet('AI-TV-Channel-Pricing');
        var defaultServices = [
          [1, "Website Hosting Server", "Server to host built-in Websites, Apps, Streaming & Storage", 299, "", 0],
          [2, "Streaming Server", "Streaming Server to stream to 2 platforms", 499, "", 0],
          [3, "Multi-Platform Broadcasting Server", "with your own logo and name insertion or slide insertion on video player with 1000 GB bandwidth every month. Get your own control panel for managing your server.", 499, "", 0],
          [4, "Re-Streaming Server", "This server takes your feed and re-streams it to multiple servers.- you can also increase the bit rate - for example your internet is very low - this can take and stream even in 4k or full hd from the server.", 999, "", 0],
          [5, "AI Automated Live Streaming for streaming", "without any system and High Speed internet - used for automated Live TV Channel, Automated Scheduled live Streaming all without local system device and internet", 1999, "", 0],
          [6, "No Delay RTMP Server", "This Server is used for conducting Panel discussions", 899, "", 0],
          [7, "SRT Server", "To Stream to Jio OTT Platform etc.", 899, "", 0],
          [8, "RTSP Server", "To pull videos from IP Cameras", 899, "", 0],
          [9, "Streaming Server to push Local TV and Broadcast Receiver box", "Streaming Server to push to Local MSO through Broadcast receiver Box.", 499, "", 0],
          [10, "Playout Server Software", "with control for Local TV broadcast and TVs In Malls and other public places with control system", 499, "", 0],
          [11, "Local TV Broadcasting Control Panel and Monitoring Server", "Monitoring Multiple Broadcast Receiver Boxes at various MSOs", 499, "", 0],
          [12, "Live TV Websites for your Channel", "Live TV Website with your own Name and Logo", 299, "", 0],
          [13, "Live TV Andorid App", "Android App - APK with your own Name and Logo", 499, "", 0],
          [14, "Direct broadcast to Mobile App", "Direct to Mobile App with your own Name and logo - Broadcast direct to all Mobiles without any 3rd party controls", 899, "", 0],
          [15, "Storage", "50 GB (Rs.50 per GB)", 500, "", 0],
          [16, "Bandwidth", "3000 GB per month (Rs.1 per GB BW)", 500, "", 0],
          [17, "Server Analytics", "Shows each viewer location, time, duration and the bandwidth used for viewing with IP address", "", "", 0],
          [18, "Dual Control Panel", "3 levels of Controls", "", "", 0],
          [19, "White labeled Video Player", "Have your own logo for each program or also have it as a slide in between programs", 499, "", 0],
          [20, "IPTV & OTT Server", "", 7999, "", 0],
          [21, "Transcoding Server", "", 5999, "", 0],
          [22, "Radio Channel Single", "", 999, "", 0],
          [23, "Radio Station Multiple", "", 4999, "", 0]
        ];
        sheet.appendRow(["id", "name", "description", "monthlyPrice", "monthlyOfferPrice", "annualDiscountPercent"]);
        sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
        sheet.getRange(2, 1, defaultServices.length, 6).setValues(defaultServices);
      }
      if (sheet.getMaxColumns() < 6) {
        sheet.insertColumnsAfter(sheet.getMaxColumns(), 6 - sheet.getMaxColumns());
      }
      var lastRow = sheet.getLastRow();
      var rows = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 6).getValues() : [];
      var services = rows.map(function(r) {
        return {
          id: r[0],
          name: r[1],
          description: r[2],
          monthlyPrice: r[3] === "" ? null : Number(r[3]),
          monthlyOfferPrice: r[4] === "" ? null : Number(r[4]),
          annualDiscountPercent: r[5] === "" ? 0 : Number(r[5])
        };
      });
      return json({ services: services });
    }

    var sheet = spreadsheet.getSheetByName(SHEET_NAME_LEADS)
      || spreadsheet.getSheets()[0];
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
