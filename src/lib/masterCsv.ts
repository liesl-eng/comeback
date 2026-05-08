// Parser for the Master Product CSV.
// Expected headers (case-insensitive, order-flexible):
//   Name, Brand, Image URL, Units Available, Our Cost, MSRP,
//   Comeback Price, Pricing Rule, Our Margin $, Our Margin %
// Category is auto-derived from the product name.
import { categorizeProduct, ProductCategory } from "./productCategory";

export interface MasterRow {
  brand: string;
  name: string;
  category: ProductCategory;
  msrp: number | null;
  cost: number | null;
  comebackPrice: number | null;
  pricingRule: string | null;
  unitsAvailable: number;
  imageUrl: string | null;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; } else q = false;
      } else cur += c;
    } else {
      if (c === '"') q = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (c === "\r") {/* skip */}
      else cur += c;
    }
  }
  if (cur.length > 0 || row.length > 0) { row.push(cur); rows.push(row); }
  return rows;
}

function money(s: string | undefined): number | null {
  if (!s) return null;
  const t = s.trim();
  if (!t || /^n\/?a$/i.test(t)) return null;
  const n = parseFloat(t.replace(/[$,%]/g, "").replace(/each/i, "").trim());
  return Number.isFinite(n) ? n : null;
}

function intVal(s: string | undefined): number {
  if (!s) return 0;
  const n = parseInt(s.trim().replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function str(s: string | undefined): string | null {
  if (!s) return null;
  const t = s.trim();
  if (!t || /^n\/?a$/i.test(t)) return null;
  return t;
}

export function parseMasterCsv(text: string): { rows: MasterRow[]; errors: string[] } {
  const grid = parseCSV(text).filter((r) => r.some((c) => c && c.trim() !== ""));
  const errors: string[] = [];
  if (grid.length < 2) return { rows: [], errors: ["CSV is empty or missing data rows."] };

  const header = grid[0].map((h) => h.trim().toLowerCase());
  const idx = (...names: string[]) =>
    header.findIndex((h) => names.some((n) => n.toLowerCase() === h));

  const iName = idx("Name", "Product Name");
  const iBrand = idx("Brand");
  const iImage = idx("Image URL", "Image");
  const iUnits = idx("Units Available", "Units");
  const iCost = idx("Our Cost", "Cost");
  const iMsrp = idx("MSRP");
  const iCb = idx("Comeback Price", "Comeback Pricing");
  const iRule = idx("Pricing Rule");

  const required: Array<[string, number]> = [
    ["Name", iName], ["Brand", iBrand], ["Comeback Price", iCb], ["Image URL", iImage],
  ];
  for (const [n, i] of required) if (i < 0) errors.push(`Missing required column: ${n}`);
  if (errors.length) return { rows: [], errors };

  const rows: MasterRow[] = [];
  for (let i = 1; i < grid.length; i++) {
    const r = grid[i];
    const name = str(r[iName]);
    const brand = str(r[iBrand]);
    if (!name || !brand) continue;
    rows.push({
      brand,
      name,
      category: categorizeProduct(name),
      msrp: iMsrp >= 0 ? money(r[iMsrp]) : null,
      cost: iCost >= 0 ? money(r[iCost]) : null,
      comebackPrice: money(r[iCb]),
      pricingRule: iRule >= 0 ? str(r[iRule]) : null,
      unitsAvailable: iUnits >= 0 ? intVal(r[iUnits]) : 0,
      imageUrl: str(r[iImage]),
    });
  }
  return { rows, errors };
}
