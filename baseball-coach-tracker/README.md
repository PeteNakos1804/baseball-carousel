# College Baseball Coaching Carousel

On3-branded coaching carousel tracker. Pulls live data from a Google Sheet.

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure |
| `styles.css` | All styling |
| `app.js` | Fetch, parse, filter, render logic |
| `data.js` | **Your only config file** — Sheet ID goes here |

---

## Setup: Connect your Google Sheet

### 1. Create the sheet

Make a Google Sheet with these **exact column headers in row 1**:

| school | conf | status | coach | prev | from | date |
|--------|------|--------|-------|------|------|------|

- **school** — School name (e.g. `LSU`)
- **conf** — Conference (e.g. `SEC`)
- **status** — One of: `hired` / `open` / `search` / `departed`
- **coach** — Coach name, or `—` for vacancies
- **prev** — Previous school/role, or departure note for vacancies
- **from** — Where the new coach came from, or `—` for vacancies
- **date** — Date of move (e.g. `Apr 14`)

### 2. Make it public

File → Share → **Anyone with the link** → Viewer

### 3. Get the Sheet ID

From the URL:
```
https://docs.google.com/spreadsheets/d/SHEET_ID/edit
```
Copy everything between `/d/` and `/edit`.

### 4. Paste it into data.js

Open `data.js` and replace `YOUR_SHEET_ID_HERE`:

```js
const SHEET_ID = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms";
```

That's it. The page will now fetch live data on every load.

---

## Adding / editing moves

Just edit the Google Sheet. No code changes needed.

- Add a row → appears on next page load
- Delete a row → gone on next page load
- Change a status → badge updates automatically

---

## Deploying to WordPress

1. Open `index.html`
2. Copy everything from `<style>` through the closing `</div>` (the whole page minus the `<!DOCTYPE>` wrapper)
3. Paste into a **Custom HTML block** in Gutenberg

> **Note:** Because the page fetches from Google Sheets on load, WordPress's script stripping won't affect the data — only the display JS. If scripts are stripped, try inserting via **WPCode** instead.

---

## Running locally

Just open `index.html` in a browser.

> **CORS note:** Chrome blocks Google Sheets fetch requests from `file://` URLs. To test locally with real sheet data, run a simple server:
> ```
> npx serve .
> ```
> Then open `http://localhost:3000`. The sample data will display fine without a server.
