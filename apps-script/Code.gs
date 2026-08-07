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
var SHEET_NAME_USERS = 'AI-TV-Channel-Users';
var USER_COLUMNS = 11;
var OTP_TTL_MS = 15 * 60 * 1000;
var MAX_LOGIN_ATTEMPTS = 5;
var LOGIN_LOCK_MS = 15 * 60 * 1000;
var MAX_OTP_ATTEMPTS = 5;

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
          'Timestamp', 'Name', 'Email', 'Phone', 'Selected Services', 'Subtotal', 'GST', 'Total Amount', 'Billing Cycle', 'Status'
        ]);
        sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
      } else {
        if (sheet.getRange(1, 9).getValue() !== 'Billing Cycle') {
          sheet.getRange(1, 9).setValue('Billing Cycle').setFontWeight('bold');
        }
        if (sheet.getRange(1, 10).getValue() !== 'Status') {
          sheet.getRange(1, 10).setValue('Status').setFontWeight('bold');
        }
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
        body.billingCycle || '',
        'Requested'
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
    } else if (body.type === 'register') {
      return handleRegister(spreadsheet, body);
    } else if (body.type === 'login') {
      return handleLogin(spreadsheet, body);
    } else if (body.type === 'request_password_reset') {
      return handleRequestPasswordReset(spreadsheet, body);
    } else if (body.type === 'verify_reset_otp') {
      return handleVerifyResetOtp(spreadsheet, body);
    } else if (body.type === 'reset_password') {
      return handleResetPassword(spreadsheet, body);
    } else if (body.type === 'update_profile') {
      return handleUpdateProfile(spreadsheet, body);
    } else if (body.type === 'change_password') {
      return handleChangePassword(spreadsheet, body);
    } else if (body.type === 'update_order_status') {
      var sheet = spreadsheet.getSheetByName(SHEET_NAME_ORDERS);
      if (!sheet) return json({ ok: false, error: 'No orders sheet' });
      var last = sheet.getLastRow();
      if (last < 2) return json({ ok: false, error: 'No orders found' });
      var rows = sheet.getRange(2, 1, last - 1, 10).getValues();
      var targetTimestampStr = String(body.timestamp);
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var rTs = r[0] instanceof Date ? r[0].toISOString() : String(r[0]);
        if (rTs === targetTimestampStr && r[2] === body.email) {
           sheet.getRange(i + 2, 10).setValue(body.status);
           return json({ ok: true });
        }
      }
      return json({ ok: false, error: 'Order not found' });
    } else if (body.type === 'get_my_orders') {
      var sheet = spreadsheet.getSheetByName(SHEET_NAME_ORDERS);
      if (!sheet) return json({ orders: [] });
      var lastRow = sheet.getLastRow();
      var rows = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 10).getValues() : [];
      var myOrders = rows.filter(function(r) { return String(r[2]).toLowerCase() === String(body.email).toLowerCase(); }).map(function(r) {
        return {
          timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
          name: r[1],
          email: r[2],
          phone: r[3],
          services: r[4],
          subTotal: Number(r[5]) || 0,
          gst: Number(r[6]) || 0,
          amount: Number(r[7]) || 0,
          billingCycle: r[8] || '',
          status: r[9] || 'Requested'
        };
      }).reverse();
      return json({ orders: myOrders });
    } else {
      return json({ ok: false, error: 'Unknown request type' });
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function sha256Hex(input) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input, Utilities.Charset.UTF_8);
  var hex = '';
  for (var i = 0; i < raw.length; i++) {
    var b = raw[i];
    if (b < 0) b += 256;
    var h = b.toString(16);
    if (h.length === 1) h = '0' + h;
    hex += h;
  }
  return hex;
}

function makeSalt() {
  return Utilities.getUuid();
}

// SHA-256 + salt with manual iteration — Apps Script has no bcrypt/PBKDF2, this is the
// practical ceiling available; 1000 rounds meaningfully raises offline-crack cost over a
// single hash even though it isn't a certified KDF.
function hashPassword(password, salt) {
  var value = String(password) + ':' + salt;
  for (var i = 0; i < 1000; i++) {
    value = sha256Hex(value + salt);
  }
  return value;
}

function makeOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function normalizeEmail(e) {
  return String(e || '').trim().toLowerCase();
}

// Strip everything but digits so "+91 98765 43210" (register) matches "9876543210" (login).
function normalizeMobile(m) {
  return String(m || '').replace(/\D/g, '');
}

function getUsersSheet() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_NAME_USERS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_USERS);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Mobile', 'PasswordHash', 'Salt', 'ResetOtp', 'ResetOtpExpiry', 'ResetOtpAttempts', 'FailedLoginAttempts', 'LockedUntil']);
    sheet.getRange(1, 1, 1, USER_COLUMNS).setFontWeight('bold');
  }
  if (sheet.getMaxColumns() < USER_COLUMNS) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), USER_COLUMNS - sheet.getMaxColumns());
  }
  return sheet;
}

function findUserRow(sheet, opts) {
  var last = sheet.getLastRow();
  if (last < 2) return null;
  var rows = sheet.getRange(2, 1, last - 1, USER_COLUMNS).getValues();
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (opts.email && normalizeEmail(r[2]) === opts.email) return { rowNumber: i + 2, data: r };
    if (opts.mobile && normalizeMobile(r[3]) === opts.mobile) return { rowNumber: i + 2, data: r };
  }
  return null;
}

function handleRegister(spreadsheet, body) {
  var name = String(body.name || '').trim();
  var email = normalizeEmail(body.email);
  var mobile = normalizeMobile(body.mobile);
  var password = String(body.password || '');

  if (!name || !email || !mobile || !password) {
    return json({ ok: false, error: 'All fields are required.' });
  }
  if (password.length < 8) {
    return json({ ok: false, error: 'Password must be at least 8 characters.' });
  }

  var sheet = getUsersSheet();
  if (findUserRow(sheet, { email: email })) {
    return json({ ok: false, error: 'An account with this email already exists.' });
  }
  if (findUserRow(sheet, { mobile: mobile })) {
    return json({ ok: false, error: 'An account with this mobile number already exists.' });
  }

  var salt = makeSalt();
  var hash = hashPassword(password, salt);
  sheet.appendRow([new Date(), name, email, mobile, hash, salt, '', '', 0, 0, '']);

  return json({ ok: true, customer: { name: name, email: email, mobile: mobile } });
}

function handleLogin(spreadsheet, body) {
  var identifier = String(body.identifier || '').trim();
  var password = String(body.password || '');
  if (!identifier || !password) {
    return json({ ok: false, error: 'Invalid credentials.' });
  }

  var sheet = getUsersSheet();
  var match = identifier.indexOf('@') !== -1
    ? findUserRow(sheet, { email: normalizeEmail(identifier) })
    : findUserRow(sheet, { mobile: normalizeMobile(identifier) });

  if (!match) {
    return json({ ok: false, error: 'Invalid credentials.' });
  }

  var row = match.data;
  var lockedUntil = row[10] ? new Date(row[10]) : null;
  if (lockedUntil && !isNaN(lockedUntil.getTime()) && lockedUntil.getTime() > Date.now()) {
    return json({ ok: false, error: 'Too many failed attempts. Please try again later.' });
  }

  var hash = hashPassword(password, row[5]);
  if (hash !== row[4]) {
    var attempts = (Number(row[9]) || 0) + 1;
    var lockValue = '';
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      lockValue = new Date(Date.now() + LOGIN_LOCK_MS);
      attempts = 0;
    }
    sheet.getRange(match.rowNumber, 10, 1, 2).setValues([[attempts, lockValue]]);
    return json({ ok: false, error: 'Invalid credentials.' });
  }

  sheet.getRange(match.rowNumber, 10, 1, 2).setValues([[0, '']]);
  return json({ ok: true, customer: { name: row[1], email: row[2], mobile: row[3] } });
}

function handleRequestPasswordReset(spreadsheet, body) {
  var email = normalizeEmail(body.email);
  if (!email) return json({ ok: false, error: 'Email is required.' });

  var sheet = getUsersSheet();
  var match = findUserRow(sheet, { email: email });
  if (!match) {
    return json({ ok: false, error: 'No account found with that email.' });
  }

  var otp = makeOtp();
  var expiry = new Date(Date.now() + OTP_TTL_MS);
  sheet.getRange(match.rowNumber, 7, 1, 3).setValues([[otp, expiry, 0]]);

  try {
    MailApp.sendEmail({
      to: match.data[2],
      subject: 'Your password reset code',
      body: 'Your password reset code is ' + otp + '. It expires in 15 minutes. If you did not request this, you can ignore this email.'
    });
  } catch (mailErr) {
    return json({ ok: false, error: 'Could not send reset email: ' + String(mailErr) });
  }

  return json({ ok: true });
}

function checkResetOtp(sheet, match, otp) {
  var storedOtp = match.data[6];
  var expiry = match.data[7] ? new Date(match.data[7]) : null;
  var attempts = Number(match.data[8]) || 0;

  if (!storedOtp || !expiry || isNaN(expiry.getTime()) || expiry.getTime() < Date.now()) {
    return { ok: false, error: 'Reset code has expired. Please request a new one.' };
  }
  if (attempts >= MAX_OTP_ATTEMPTS) {
    return { ok: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }
  if (String(otp) !== String(storedOtp)) {
    sheet.getRange(match.rowNumber, 9).setValue(attempts + 1);
    return { ok: false, error: 'Incorrect code.' };
  }
  return { ok: true };
}

function handleVerifyResetOtp(spreadsheet, body) {
  var email = normalizeEmail(body.email);
  var otp = String(body.otp || '');
  var sheet = getUsersSheet();
  var match = findUserRow(sheet, { email: email });
  if (!match) return json({ ok: false, error: 'No account found with that email.' });

  return json(checkResetOtp(sheet, match, otp));
}

function handleResetPassword(spreadsheet, body) {
  var email = normalizeEmail(body.email);
  var otp = String(body.otp || '');
  var newPassword = String(body.newPassword || '');

  if (newPassword.length < 8) {
    return json({ ok: false, error: 'Password must be at least 8 characters.' });
  }

  var sheet = getUsersSheet();
  var match = findUserRow(sheet, { email: email });
  if (!match) return json({ ok: false, error: 'No account found with that email.' });

  // Re-validate independently — never trust that verify_reset_otp was actually called first.
  var result = checkResetOtp(sheet, match, otp);
  if (!result.ok) return json(result);

  var salt = makeSalt();
  var hash = hashPassword(newPassword, salt);
  sheet.getRange(match.rowNumber, 5, 1, 2).setValues([[hash, salt]]);
  sheet.getRange(match.rowNumber, 7, 1, 3).setValues([['', '', 0]]);
  sheet.getRange(match.rowNumber, 10, 1, 2).setValues([[0, '']]);

  return json({ ok: true });
}

function handleUpdateProfile(spreadsheet, body) {
  var currentEmail = normalizeEmail(body.currentEmail);
  var name = String(body.name || '').trim();
  var newEmail = normalizeEmail(body.email);
  var newMobile = normalizeMobile(body.mobile);

  if (!currentEmail) return json({ ok: false, error: 'Missing account reference.' });
  if (!name || !newEmail || !newMobile) return json({ ok: false, error: 'All fields are required.' });

  var sheet = getUsersSheet();
  var match = findUserRow(sheet, { email: currentEmail });
  if (!match) return json({ ok: false, error: 'Account not found.' });

  // Only reject a collision with a DIFFERENT existing account — the user's own row is fine.
  if (newEmail !== currentEmail) {
    var emailOwner = findUserRow(sheet, { email: newEmail });
    if (emailOwner && emailOwner.rowNumber !== match.rowNumber) {
      return json({ ok: false, error: 'An account with this email already exists.' });
    }
  }
  if (newMobile !== normalizeMobile(match.data[3])) {
    var mobileOwner = findUserRow(sheet, { mobile: newMobile });
    if (mobileOwner && mobileOwner.rowNumber !== match.rowNumber) {
      return json({ ok: false, error: 'An account with this mobile number already exists.' });
    }
  }

  sheet.getRange(match.rowNumber, 2, 1, 3).setValues([[name, newEmail, newMobile]]);

  if (newEmail !== currentEmail) {
    var orderSheet = spreadsheet.getSheetByName(SHEET_NAME_ORDERS);
    if (orderSheet) {
      var lastOrderRow = orderSheet.getLastRow();
      if (lastOrderRow > 1) {
        var orderRows = orderSheet.getRange(2, 1, lastOrderRow - 1, 3).getValues();
        for (var j = 0; j < orderRows.length; j++) {
          if (normalizeEmail(orderRows[j][2]) === currentEmail) {
            orderSheet.getRange(j + 2, 3).setValue(newEmail);
          }
        }
      }
    }
  }

  return json({ ok: true, customer: { name: name, email: newEmail, mobile: newMobile } });
}

function handleChangePassword(spreadsheet, body) {
  var email = normalizeEmail(body.email);
  var currentPassword = String(body.currentPassword || '');
  var newPassword = String(body.newPassword || '');

  if (newPassword.length < 8) {
    return json({ ok: false, error: 'New password must be at least 8 characters.' });
  }

  var sheet = getUsersSheet();
  var match = findUserRow(sheet, { email: email });
  if (!match) return json({ ok: false, error: 'Account not found.' });

  var hash = hashPassword(currentPassword, match.data[5]);
  if (hash !== match.data[4]) {
    return json({ ok: false, error: 'Current password is incorrect.' });
  }

  var salt = makeSalt();
  var newHash = hashPassword(newPassword, salt);
  sheet.getRange(match.rowNumber, 5, 1, 2).setValues([[newHash, salt]]);
  return json({ ok: true });
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

    if (action === 'leads') {
      var sheet = spreadsheet.getSheetByName(SHEET_NAME_LEADS);
      var lastRow = sheet ? sheet.getLastRow() : 0;
      var rows = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 9).getValues() : [];
      var leads = rows.map(function(r) {
        return {
          timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
          name: r[1],
          phone: r[2],
          email: r[3],
          country: r[4],
          state: r[5],
          city: r[6],
          language: r[7],
          interest: r[8]
        };
      }).reverse();
      return json({ leads: leads });
    }

    if (action === 'orders') {
      var sheet = spreadsheet.getSheetByName(SHEET_NAME_ORDERS);
      var lastRow = sheet ? sheet.getLastRow() : 0;
      var rows = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 10).getValues() : [];
      var orders = rows.map(function(r) {
        return {
          timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
          name: r[1],
          email: r[2],
          phone: r[3],
          services: r[4],
          subTotal: Number(r[5]) || 0,
          gst: Number(r[6]) || 0,
          amount: Number(r[7]) || 0,
          billingCycle: r[8] || '',
          status: r[9] || 'Requested'
        };
      }).reverse();
      return json({ orders: orders });
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
