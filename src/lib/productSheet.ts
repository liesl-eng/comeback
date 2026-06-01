// Utilities for fetching & parsing the product Google Sheet (per-tab CSV).

export const PRODUCT_SHEET_ID = "1ItM29QVpYh85ESpMLWVJjg13RP-ACHkSPRcGtL21yl8";

export type BrandTab =
  | "Mercana"
  | "Modus Furniture"
  | "Arteriors Home"
  | "Ferm Living"
  | "Havenly"
  | "Hem"
  | "Vesta";

export const BRAND_TABS: BrandTab[] = [
  "Mercana",
  "Modus Furniture",
  "Arteriors Home",
  "Ferm Living",
  "Havenly",
  "Hem",
  "Vesta",
];

export interface SheetRow {
  name: string;
  brand: string;
  imageUrl: string | null;
  imageFilename: string | null;
  price: number | null;
  msrp: number | null;
  unitsAvailable: number;
  sourceLastUpdated: string | null;
}

// Robust CSV line parser supporting quoted fields with embedded commas/quotes.
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(cur);
        cur = "";
      } else if (c === "\n") {
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
      } else if (c === "\r") {
        // ignore
      } else {
        cur += c;
      }
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

function cleanMoney(raw: string | undefined): number | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s || s.toUpperCase() === "N/A") return null;
  const cleaned = s.replace(/[$,]/g, "").replace(/each/i, "").trim();
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function cleanInt(raw: string | undefined): number {
  if (!raw) return 0;
  const s = raw.trim();
  if (!s || s.toUpperCase() === "N/A") return 0;
  const n = parseInt(s.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function cleanStr(raw: string | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (!s || s.toUpperCase() === "N/A") return null;
  return s;
}

export async function fetchSheetTab(tab: BrandTab): Promise<SheetRow[]> {
  const url = `https://docs.google.com/spreadsheets/d/${PRODUCT_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    tab,
  )}&_=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch sheet "${tab}" (HTTP ${res.status})`);
  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (key: string) => header.findIndex((h) => h === key.toLowerCase());

  const iName = idx("Name");
  const iBrand = idx("Brand");
  const iImageUrl = idx("Image URL");
  const iImageFile = idx("Image Filename");
  const iPrice = idx("Price");
  const iMsrp = idx("MSRP");
  const iUnits = idx("Units Available");
  const iUpdated = idx("Last Updated");

  const out: SheetRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.every((c) => !c || !c.trim())) continue;
    const name = cleanStr(r[iName]);
    if (!name) continue;
    out.push({
      name,
      brand: cleanStr(r[iBrand]) ?? tab,
      imageUrl: iImageUrl >= 0 ? cleanStr(r[iImageUrl]) : null,
      imageFilename: iImageFile >= 0 ? cleanStr(r[iImageFile]) : null,
      price: iPrice >= 0 ? cleanMoney(r[iPrice]) : null,
      msrp: iMsrp >= 0 ? cleanMoney(r[iMsrp]) : null,
      unitsAvailable: iUnits >= 0 ? cleanInt(r[iUnits]) : 0,
      sourceLastUpdated: iUpdated >= 0 ? cleanStr(r[iUpdated]) : null,
    });
  }
  return out;
}
