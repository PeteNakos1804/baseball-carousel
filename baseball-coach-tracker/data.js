// ─────────────────────────────────────────────────────────────
//  DATA CONFIGURATION
//  Replace SHEET_ID below with your actual Google Sheet ID.
//
//  Steps:
//  1. Create a Google Sheet with these exact column headers in row 1:
//       school | conf | status | coach | prev | from | date
//  2. File → Share → "Anyone with the link" → Viewer
//  3. Copy the Sheet ID from the URL:
//       https://docs.google.com/spreadsheets/d/SHEET_ID/edit
//  4. Paste it below and save.
// ─────────────────────────────────────────────────────────────

const SHEET_ID = "1SvClToAJCfuOkJcJDMpS9SUZudLf3cqBiuIV_wURKbU";

// The tab name inside your sheet (default is "Sheet1").
// Change this if you rename the tab.
const SHEET_TAB = "Sheet1";

// Built from the above — no need to edit this line.
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_TAB)}`;

// ESPN team ID map — used to pull logos automatically.
// Keys are lowercase school names as they appear in your sheet.
const SCHOOL_LOGO_IDS = {
  "air force": 2005, "alabama": 333, "appalachian state": 2026, "arizona": 12,
  "arizona state": 9, "arkansas": 8, "army": 349, "auburn": 2,
  "ball state": 2050, "baylor": 239, "boise state": 68, "boston college": 103,
  "brigham young": 252, "byu": 252, "cal": 25, "california": 25,
  "central florida": 2116, "ucf": 2116, "charlotte": 2429, "cincinnati": 2132,
  "clemson": 228, "coastal carolina": 324, "college of charleston": 232,
  "colorado": 38, "colorado state": 36, "connecticut": 41, "uconn": 41,
  "creighton": 156, "dallas baptist": 2199, "dartmouth": 334, "duke": 150,
  "east carolina": 151, "eastern kentucky": 2198, "florida": 57,
  "florida atlantic": 2226, "florida state": 52, "fresno state": 278,
  "georgia": 61, "georgia tech": 59, "grand canyon": 2253, "hawaii": 62,
  "houston": 248, "illinois": 356, "illinois state": 2210, "indiana": 84,
  "iowa": 2294, "iowa state": 66, "jacksonville state": 55, "kansas": 2305,
  "kansas state": 2306, "kentucky": 96, "liberty": 2335, "louisiana": 309,
  "louisiana tech": 2348, "louisville": 97, "lsu": 99, "maine": 311,
  "maryland": 120, "memphis": 235, "miami": 2390, "miami (fl)": 2390,
  "michigan": 130, "michigan state": 127, "middle tennessee": 2393,
  "minnesota": 135, "mississippi state": 344, "miss. state": 344,
  "missouri": 142, "navy": 2426, "nebraska": 158, "nevada": 2440,
  "new mexico": 167, "north carolina": 153, "nc state": 152,
  "north carolina state": 152, "notre dame": 87, "ohio state": 194,
  "oklahoma": 201, "oklahoma state": 197, "ole miss": 145,
  "oral roberts": 198, "oregon": 2483, "oregon state": 204, "penn state": 213,
  "pittsburgh": 221, "purdue": 2509, "rice": 242, "rutgers": 164,
  "sam houston": 2534, "south carolina": 2579, "south florida": 58,
  "usf": 58, "southeastern louisiana": 2545, "southern miss": 2572,
  "stanford": 24, "stetson": 56, "stony brook": 2583, "syracuse": 183,
  "tcu": 2628, "tennessee": 2633, "texas": 251, "texas a&m": 245,
  "texas state": 326, "texas tech": 2641, "troy": 2653, "tulane": 2655,
  "uab": 5, "uc irvine": 2628, "ucla": 26, "usc": 30,
  "utah": 254, "vanderbilt": 238, "villanova": 222, "virginia": 258,
  "virginia tech": 259, "wake forest": 154, "washington": 264,
  "west virginia": 277, "western carolina": 2717, "wichita state": 2724,
  "william & mary": 2725, "winthrop": 2733, "wofford": 2737,
  "wright state": 2737, "xavier": 2752
};
