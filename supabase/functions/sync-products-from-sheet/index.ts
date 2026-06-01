// Fetches each brand tab from the public Google Sheet and upserts rows into
// the `products` table. Designed for scheduled invocation (pg_cron) or manual
// trigger. Mercana is intentionally excluded because it requires uploaded
// images managed via the admin UI.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SHEET_ID = "1ItM29QVpYh85ESpMLWVJjg13RP-ACHkSPRcGtL21yl8";

const DEFAULT_BRANDS = [
  "Modus Furniture",
  "Arteriors Home",
  "Ferm Living",
  "Havenly",
  "Hem",
  "Vesta",
];

// --- categorize (mirrors src/lib/productCategory.ts) ---
const FURNITURE = ["nightstand","bench","console","ottoman","stool","side table","end table","accent table","coffee table","dresser","cabinet","sideboard","armoire","wardrobe","credenza","buffet","bookcase","hutch","table","desk"];
const BEDS = ["bed","headboard"];
const SOFAS = ["sofa","loveseat","settee","sectional"];
const CHAIRS = ["chair","armchair","recliner"];
const LIGHTING = ["lamp","chandelier","sconce","pendant","light","lantern"];
function categorize(name: string): string {
  const n = (name || "").toLowerCase();
  if (n.includes("candle") || n.includes("clock") || n.includes("pillow")) return "Accessories";
  if (n.includes("mirror")) return "Mirrors";
  if (LIGHTING.some(k=>n.includes(k))) return "Lighting";
  if (SOFAS.some(k=>n.includes(k))) return "Sofas";
  if (CHAIRS.some(k=>n.includes(k))) return "Chairs";
  if (BEDS.some(k=>n.includes(k))) return "Beds";
  if (FURNITURE.some(k=>n.includes(k))) return "Furniture";
  return "Accessories";
}
function normalizeName(name: string): string {
  return (name || "").toLowerCase()
    .replace(/\s*\(#\d+\)\s*$/g, "")
    .replace(/[()[\]]/g, " ")
    .replace(/[-–—_/\\,.]/g, " ")
    .replace(/['"`’]/g, "")
    .replace(/\s+/g, " ").trim();
}

// --- CSV ---
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i+1] === '"') { cur += '"'; i++; } else inQ = false;
      } else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (c === "\r") {}
      else cur += c;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
function cleanMoney(s?: string): number | null {
  if (!s) return null;
  const t = s.trim();
  if (!t || t.toUpperCase() === "N/A") return null;
  const n = parseFloat(t.replace(/[$,]/g, "").replace(/each/i, "").trim());
  return Number.isFinite(n) ? n : null;
}
function cleanInt(s?: string): number {
  if (!s) return 0;
  const t = s.trim();
  if (!t || t.toUpperCase() === "N/A") return 0;
  const n = parseInt(t.replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}
function cleanStr(s?: string): string | null {
  if (!s) return null;
  const t = s.trim();
  if (!t || t.toUpperCase() === "N/A") return null;
  return t;
}

interface SheetRow {
  name: string; brand: string; image_url: string | null;
  image_filename: string | null; price: number | null; msrp: number | null;
  units_available: number; source_last_updated: string | null;
}

async function fetchTab(tab: string): Promise<SheetRow[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}&_=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch ${tab} failed: HTTP ${res.status}`);
  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const header = rows[0].map(h => h.trim().toLowerCase());
  const idx = (k: string) => header.findIndex(h => h === k.toLowerCase());
  const iName = idx("Name"), iBrand = idx("Brand"), iImg = idx("Image URL"),
        iFile = idx("Image Filename"), iPrice = idx("Price"), iMsrp = idx("MSRP"),
        iUnits = idx("Units Available"), iUpd = idx("Last Updated");
  const out: SheetRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.every(c => !c || !c.trim())) continue;
    const name = cleanStr(r[iName]);
    if (!name) continue;
    out.push({
      name,
      brand: cleanStr(r[iBrand]) ?? tab,
      image_url: iImg >= 0 ? cleanStr(r[iImg]) : null,
      image_filename: iFile >= 0 ? cleanStr(r[iFile]) : null,
      price: iPrice >= 0 ? cleanMoney(r[iPrice]) : null,
      msrp: iMsrp >= 0 ? cleanMoney(r[iMsrp]) : null,
      units_available: iUnits >= 0 ? cleanInt(r[iUnits]) : 0,
      source_last_updated: iUpd >= 0 ? cleanStr(r[iUpd]) : null,
    });
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Optional shared-secret protection. If CRON_SECRET is set, require it.
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (cronSecret) {
    const provided = req.headers.get("x-cron-secret") ||
      (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (provided !== cronSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  const url = new URL(req.url);
  const brandsParam = url.searchParams.get("brands");
  const replace = url.searchParams.get("replace") === "true";
  const brands = brandsParam ? brandsParam.split(",").map(s => s.trim()).filter(Boolean) : DEFAULT_BRANDS;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const summary: Record<string, unknown> = { startedAt: new Date().toISOString(), brands: {} };

  for (const brand of brands) {
    const brandReport: Record<string, unknown> = {};
    try {
      const rows = await fetchTab(brand);
      brandReport.fetched = rows.length;

      const records = [];
      let skippedMissingPrice = 0;
      const nameCounts = new Map<string, number>();
      for (const r of rows) {
        if (r.price == null) { skippedMissingPrice++; continue; }
        const key = `${brand}|${normalizeName(r.name)}`;
        const count = (nameCounts.get(key) ?? 0) + 1;
        nameCounts.set(key, count);
        const name = count === 1 ? r.name : `${r.name} (#${count})`;
        records.push({
          name,
          brand,
          category: categorize(r.name),
          image_url: r.image_url,
          image_filename: r.image_filename,
          price: r.price,
          msrp: r.msrp,
          units_available: r.units_available,
          source_last_updated: r.source_last_updated
            ? new Date(r.source_last_updated.replace(" ", "T")).toISOString() : null,
        });
      }

      let deleted = 0;
      if (replace) {
        const { error: delErr, count } = await supabase
          .from("products").delete({ count: "exact" }).eq("brand", brand);
        if (delErr) throw new Error(`delete failed: ${delErr.message}`);
        deleted = count ?? 0;
      }

      let upserted = 0;
      const errors: string[] = [];
      const chunkSize = 200;
      for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);
        const { error } = await supabase.from("products")
          .upsert(chunk, { onConflict: "brand,name" });
        if (error) errors.push(error.message);
        else upserted += chunk.length;
      }
      brandReport.skippedMissingPrice = skippedMissingPrice;
      brandReport.deleted = deleted;
      brandReport.upserted = upserted;
      if (errors.length) brandReport.errors = errors;
    } catch (e) {
      brandReport.error = e instanceof Error ? e.message : String(e);
    }
    (summary.brands as Record<string, unknown>)[brand] = brandReport;
  }

  summary.finishedAt = new Date().toISOString();
  return new Response(JSON.stringify(summary, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
