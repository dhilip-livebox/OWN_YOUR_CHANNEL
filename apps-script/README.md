# Google Apps Script — AI Live TV lead capture

The site's `/api/leads` endpoint and the `/admin` dashboard both talk to a single
Google Apps Script Web App backed by a Google Sheet. This is the whole
"backend" — no server database, no extra hosting.

## 1. Create the sheet

Create a Google Sheet named **AI-TV-Channel-Leads** with this exact header in
row 1:

```
Timestamp | Name | Phone | Email | Country | State | City | Language | Interest
```

## 2. Paste the script

1. In the Sheet: **Extensions → Apps Script**.
2. Replace the default `Code.gs` with the contents of [`Code.gs`](./Code.gs) from
   this repo.
3. Save.

## 3. Deploy as Web App

1. **Deploy → New deployment** → Type: **Web app**.
2. **Execute as:** *Me* (your Google account).
3. **Who has access:** *Anyone*.
4. Deploy and copy the resulting `/exec` URL. It looks like:

```
https://script.google.com/macros/s/XXXXXXXXXXXX/exec
```

## 4. Save the URL in the app

The site reads this URL from the `SHEETS_ENDPOINT` environment variable
(already configured for this project via Lovable secrets). If you deploy a new
Apps Script version and the URL changes, update the secret and the site picks
it up automatically.

## Exporting leads to Excel

You don't need any custom export code. In the sheet:

**File → Download → Microsoft Excel (.xlsx)**

## Endpoints

- `POST` — appends a lead row from the site's registration form.
- `GET` — returns aggregate stats (`total`, `today`, `week`, `month`, and a
  30-day daily series) for the admin dashboard.
