// ─────────────────────────────────────────────────────────────
//  app.js — College Baseball Coaching Carousel
//  Fetches from Google Sheets CSV, parses, and renders.
// ─────────────────────────────────────────────────────────────

var allMoves = [];
var currentFilter = "all";

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  loadData();
});

// ── Fetch & parse Google Sheets CSV ───────────────────────────
function loadData() {
  var entriesEl = document.getElementById("entries");
  entriesEl.innerHTML = '<div class="loading-msg">Loading data…</div>';

  if (SHEET_ID === "YOUR_SHEET_ID_HERE") {
    // Dev fallback: use sample data so the page works before the sheet is connected
    allMoves = getSampleData();
    finishLoad("Sample data (sheet not yet connected)");
    return;
  }

  fetch(SHEET_CSV_URL)
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    })
    .then(function (csv) {
      allMoves = parseCSV(csv);
      var now = new Date();
      finishLoad("Updated " + now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    })
    .catch(function (err) {
      entriesEl.innerHTML =
        '<div class="error-msg">Could not load sheet data. Make sure the sheet is public and the SHEET_ID is correct.<br><small>' +
        err.message +
        "</small></div>";
    });
}

function finishLoad(subtitle) {
  document.getElementById("last-updated").textContent = "2026 offseason · " + subtitle;
  updateCounts();
  render();
}

// ── CSV parser ────────────────────────────────────────────────
// Handles Google Sheets CSV export (quoted fields, commas inside quotes)
function parseCSV(text) {
  var lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  // Parse header row to find column indices (case-insensitive, trimmed)
  var headers = splitCSVLine(lines[0]).map(function (h) {
    return h.toLowerCase().trim();
  });

  var colIndex = function (name) {
    return headers.indexOf(name);
  };

  var iSchool  = colIndex("school");
  var iConf    = colIndex("conf");
  var iStatus  = colIndex("status");
  var iCoach   = colIndex("coach");
  var iNotes   = colIndex("notes");
  var iDate    = colIndex("date");
  var iLink    = colIndex("link");

  var moves = [];

  for (var i = 1; i < lines.length; i++) {
    var cols = splitCSVLine(lines[i]);
    if (!cols.length || !cols[iSchool]) continue; // skip blank rows

    var status = (cols[iStatus] || "").toLowerCase().trim();
    if (!["hired", "open", "search", "departed"].includes(status)) continue;

    moves.push({
      school: clean(cols[iSchool]),
      conf:   clean(cols[iConf]),
      status: status,
      coach:  clean(cols[iCoach]) || "—",
      notes:  clean(cols[iNotes]) || "",
      date:   clean(cols[iDate])  || "",
      link:   clean(cols[iLink])  || "",
    });
  }

  return moves;
}

// Split a single CSV line respecting quoted fields
function splitCSVLine(line) {
  var result = [];
  var current = "";
  var inQuotes = false;

  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (ch === '"') {
      // Handle escaped quotes ("")
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function clean(val) {
  return (val || "").trim().replace(/^"|"$/g, "");
}

// ── Filter & search ───────────────────────────────────────────
function setFilter(type, btn) {
  currentFilter = type;
  document.querySelectorAll(".fbtn").forEach(function (b) {
    b.classList.remove("active");
  });
  btn.classList.add("active");
  render();
}

// ── Render ────────────────────────────────────────────────────
function render() {
  var q = document.getElementById("search-box").value.toLowerCase();

  var filtered = allMoves.filter(function (m) {
    var matchFilter = (currentFilter === "all" && m.status !== "departed") ||
      (currentFilter === "open" && (m.status === "open" || m.status === "search")) ||
      (currentFilter !== "all" && currentFilter !== "open" && m.status === currentFilter);
    var matchSearch =
      !q ||
      m.school.toLowerCase().indexOf(q) > -1 ||
      m.coach.toLowerCase().indexOf(q) > -1 ||
      m.conf.toLowerCase().indexOf(q) > -1 ||
      m.notes.toLowerCase().indexOf(q) > -1;
    return matchFilter && matchSearch;
  });

  var el = document.getElementById("entries");

  if (!filtered.length) {
    el.innerHTML = '<div class="empty-msg">No results found.</div>';
    return;
  }

  el.innerHTML = filtered
    .map(function (m) {
      var linkHtml = m.link ? ' <a class="intel-link" href="' + esc(m.link) + '" target="_blank" rel="noopener">📰 Latest intel</a>' : "";
      var notesHtml = m.notes ? '<div class="entry-notes">' + esc(m.notes) + linkHtml + "</div>" : (m.link ? '<div class="entry-notes">' + linkHtml + "</div>" : "");
      var logoHtml = schoolLogo(m.school);
      return (
        '<div class="entry">' +
        '  <div class="school-cell">' + logoHtml + '<div><div class="school-name">' + esc(m.school) + '</div><div class="conf">' + esc(m.conf) + "</div></div></div>" +
        '  <div><div class="coach-name">' + esc(m.coach) + "</div></div>" +
        '  <div>' + badge(m.status) + "</div>" +
        '  <div class="entry-date">' + esc(m.date) + "</div>" +
        notesHtml +
        "</div>"
      );
    })
    .join("");
}

function badge(status) {
  var map = {
    hired:    ["b-hired",    "Hired"],
    open:     ["b-open",     "Opening"],
    search:   ["b-open",     "Opening"],
    departed: ["b-departed", "Departed"],
  };
  var r = map[status] || ["", status];
  var pill = '<span class="badge ' + r[0] + '">' + r[1] + "</span>";
  if (status === "open" || status === "search") {
    return '<div class="live-wrap"><span class="live-dot"></span>' + pill + "</div>";
  }
  return pill;
}

function schoolLogo(name) {
  var id = SCHOOL_LOGO_IDS[name.toLowerCase().trim()];
  var initials = name.replace(/[^A-Za-z ]/g, "").trim().split(/\s+/).map(function(w){ return w[0]; }).join("").slice(0,2).toUpperCase();
  if (id) {
    var url = "https://a.espncdn.com/i/teamlogos/ncaa/500/" + id + ".png";
    return '<img class="school-logo" src="' + url + '" alt="' + esc(name) + '" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'">' +
           '<div class="school-monogram" style="display:none">' + initials + "</div>";
  }
  return '<div class="school-monogram">' + initials + "</div>";
}

function esc(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Counts ────────────────────────────────────────────────────
function updateCounts() {
  var h = 0, o = 0, total = 0;
  allMoves.forEach(function (m) {
    if (m.status === "departed") return;
    total++;
    if (m.status === "hired") h++;
    else if (m.status === "open" || m.status === "search") o++;
  });
  document.getElementById("c-hired").textContent = h;
  document.getElementById("c-open").textContent  = o;
  document.getElementById("c-total").textContent  = total;
}

// ── Sample data (used before the sheet is connected) ──────────
function getSampleData() {
  return [
    {school:"LSU",         conf:"SEC",     status:"hired",    coach:"Jay Johnson",   prev:"Arizona",           from:"Arizona",     date:"Apr 14"},
    {school:"Vanderbilt",  conf:"SEC",     status:"hired",    coach:"Chris Lemonis", prev:"Indiana",           from:"Indiana",     date:"Apr 2"},
    {school:"Florida State",conf:"ACC",   status:"hired",    coach:"Link Jarrett",  prev:"Notre Dame",        from:"Notre Dame",  date:"Mar 27"},
    {school:"TCU",         conf:"Big 12",  status:"hired",    coach:"Kirk Saarloos", prev:"Cal",               from:"Cal",         date:"Mar 19"},
    {school:"Miss. State", conf:"SEC",     status:"hired",    coach:"Cody Malzahn",  prev:"Texas A&M",         from:"Texas A&M",   date:"Apr 8"},
    {school:"Georgia Tech",conf:"ACC",    status:"hired",    coach:"James Ramsey",  prev:"Louisville",        from:"Louisville",  date:"Mar 31"},
    {school:"Stanford",    conf:"ACC",     status:"hired",    coach:"David Esquer",  prev:"Michigan",          from:"Michigan",    date:"May 1"},
    {school:"Notre Dame",  conf:"ACC",     status:"search",   coach:"—",             prev:"Link Jarrett departed", from:"—",       date:"Mar 27"},
    {school:"Arizona",     conf:"Pac-12",  status:"search",   coach:"—",             prev:"Jay Johnson departed",  from:"—",       date:"Apr 14"},
    {school:"Louisville",  conf:"ACC",     status:"search",   coach:"—",             prev:"James Ramsey departed", from:"—",       date:"Mar 31"},
    {school:"Cal",         conf:"Pac-12",  status:"open",     coach:"—",             prev:"Saarloos departed", from:"—",           date:"Mar 19"},
    {school:"Indiana",     conf:"Big Ten", status:"open",     coach:"—",             prev:"Lemonis departed",  from:"—",           date:"Apr 2"},
    {school:"Texas A&M",   conf:"SEC",     status:"open",     coach:"—",             prev:"Malzahn departed",  from:"—",           date:"Apr 8"},
    {school:"Michigan",    conf:"Big Ten", status:"open",     coach:"—",             prev:"Esquer departed",   from:"—",           date:"May 1"},
    {school:"Oklahoma",    conf:"SEC",     status:"departed", coach:"Skip Johnson",  prev:"Resigned",          from:"Oklahoma",    date:"Feb 12"},
  ];
}
