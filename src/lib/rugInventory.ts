/**
 * Live rug inventory loader.
 *
 * Fetches CSV from a public Google Sheet on every page load (no caching) and
 * normalizes it into the Collection/SubDesign shape the UI already uses.
 *
 * CSV columns:
 *   image, No., Style #, Collection, Style, Color, Size, Size code,
 *   Inventory MM-DD-YYYY (column 9), [optional total in row 2]
 */

export const RUG_INVENTORY_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3PViyH2sx0t1nF0ZlxYF4xrbUOy-bQSi4XAOdU2dFEEzB5eLKFZS0uvvlgRYmnjBHKfVfP795FqRY/pub?gid=0&single=true&output=csv";

/* ─── Size bucket definitions (must match RugCollections) ─── */
export const SIZE_BUCKETS = [
  "All Sizes",
  "Accent",
  "Small-Medium",
  "Medium",
  "Large",
  "XL",
  "Runner",
  "Stair Tread",
  "Small Round",
  "Med Round",
  "Med Oval",
  "Large Round",
] as const;

export type SizeBucket = (typeof SIZE_BUCKETS)[number];

/* ─── Types ─── */
export interface SizeBreakdown {
  size: string;
  units: number;
}

export interface SubDesign {
  name: string;
  units: number;
  image: string;
  sizes: SizeBreakdown[];
}

export interface Collection {
  name: string;
  totalUnits: number;
  designCount: number;
  image: string;
  sizeBuckets: SizeBucket[];
  subDesigns: SubDesign[] | null;
  fallbackNote?: string;
}

/* ─── Placeholder for collections/patterns without images ─── */
export const PLACEHOLDER_IMG = "/placeholder.svg";

/* ─── Image lookups (preserved from previous hardcoded inventory) ───
 *  Keyed by collection name and "Collection::Pattern". Anything not
 *  listed falls back to the placeholder. */
const COLLECTION_IMAGES: Record<string, string> = {
  Lotus: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-50CU5_W.jpg?v=1753642856",
  Dazzle: "https://cdn.shopify.com/s/files/1/0669/1123/products/DZ-088x10CU5.jpg?v=1753643053",
  "Madison Shag": "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163",
  "Kings Court": "https://cdn.shopify.com/s/files/1/0669/1123/products/6516_Runner_OH.jpg?v=1742600678",
  Rodeo: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-02_OH.jpg?v=1742601782",
  "Elle Basics": "https://cdn.shopify.com/s/files/1/0669/1123/products/ELL-128x10OH.jpg?v=1742620397",
  Dulcet: "https://cdn.shopify.com/s/files/1/0669/1123/files/1940_RS_S_01_R1.jpg?v=1753643333",
  Dorado: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-512RS_S_01Graphic_1.jpg?v=1751060076",
  Kennedy: "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-14OH.jpg?v=1751232653",
  Money: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-01A8x10OH.jpg?v=1751059908",
  Zazzle: "https://cdn.shopify.com/s/files/1/0669/1123/files/ZAZ-23_8x10_OH_1.jpg?v=1742624393",
  Mystic: "https://cdn.shopify.com/s/files/1/0669/1123/files/MC-457OH.jpg?v=1751061979",
  Brielle: "https://cdn.shopify.com/s/files/1/0669/1123/products/BRI-42RoundRS_S_01.jpg?v=1742611088",
  "Ell Basics": "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-20Graphics_1.jpg?v=1751063157",
  "Loop-De-Loop": "https://cdn.shopify.com/s/files/1/0669/1123/products/LDL-78_RS_S_01.jpg?v=1751060637",
  Serenity2: "https://cdn.shopify.com/s/files/1/0669/1123/products/SE-232OH.jpg?v=1753642912",
  Malaga: "https://cdn.shopify.com/s/files/1/0669/1123/files/MG-152OH.jpg?v=1753642976",
  Horosan: "https://cdn.shopify.com/s/files/1/0669/1123/products/HR-11CU5.jpg?v=1751061258",
  Omaha: "https://cdn.shopify.com/s/files/1/0669/1123/products/OM-174_OH.jpg?v=1742601014",
  Maya: "https://cdn.shopify.com/s/files/1/0669/1123/products/MYA-27RS_S_01.jpg?v=1753642764",
};

const PATTERN_IMAGES: Record<string, string> = {
  // Lotus
  "Lotus::Ripon": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-50CU5_W.jpg?v=1753642856",
  "Lotus::Argonne": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-232CU5_W.jpg?v=1753642856",
  "Lotus::Shasta": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-79CU5_W.jpg?v=1753642851",
  "Lotus::Habra": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-16CU5_W.jpg?v=1753642857",
  "Lotus::Menda": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-36CU5_W.jpg?v=1753642857",
  "Lotus::Pomona": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-62CU5_W.jpg?v=1753642857",
  "Lotus::Tonti": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-170OH.jpg?v=1753642856",
  "Lotus::Towne": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-210OH.jpg?v=1742608637",
  "Lotus::Macon": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-204CU5_W.jpg?v=1753642856",
  "Lotus::Cambria": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-156CU5_W.jpg?v=1753642856",
  "Lotus::Amesti": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-136CU5_W.jpg?v=1753642914",
  "Lotus::Ramon": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-86OH.jpg?v=1742608792",
  "Lotus::Binita": "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-50CU5_W.jpg?v=1753642856",
  // Dazzle
  "Dazzle::Disa": "https://cdn.shopify.com/s/files/1/0669/1123/products/DZ-088x10CU5.jpg?v=1753643053",
  // Madison Shag
  "Madison Shag::Cossima": "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163",
  "Madison Shag::Piper": "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163",
  "Madison Shag::Moroccan Lattice": "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163",
  "Madison Shag::Cole": "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163",
  "Madison Shag::Plain": "https://cdn.shopify.com/s/files/1/0669/1123/products/NO-34_FL2.jpg?v=1742596112",
  // Kings Court
  "Kings Court::Brooklyn Trellis": "https://cdn.shopify.com/s/files/1/0669/1123/products/6516_Runner_OH.jpg?v=1742600678",
  "Kings Court::Clover": "https://cdn.shopify.com/s/files/1/0669/1123/products/KC-128OH.jpg?v=1751061609",
  "Kings Court::Kama": "https://cdn.shopify.com/s/files/1/0669/1123/files/KC-213OH.jpg?v=1742636552",
  "Kings Court::Gene": "https://cdn.shopify.com/s/files/1/0669/1123/files/KC-1743x5OH.jpg?v=1742612716",
  "Kings Court::Zazzu": "https://cdn.shopify.com/s/files/1/0669/1123/files/KC-2012x5OH.jpg?v=1742636499",
  "Kings Court::Florence Brown Traditional": "https://cdn.shopify.com/s/files/1/0669/1123/products/KC-1083x5OH_c36dd545-fee3-4ddd-b2a9-73863b73b1c9.jpg?v=1751061818",
  // Rodeo
  "Rodeo::Otero": "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-02_OH.jpg?v=1742601782",
  "Rodeo::Virden": "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-94_OH.jpg?v=1742601909",
  "Rodeo::Chindi": "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-319OH.jpg?v=1742618345",
  "Rodeo::Elaine": "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-304OH.jpg?v=1742618173",
  // Elle Basics
  "Elle Basics::Emerson": "https://cdn.shopify.com/s/files/1/0669/1123/products/ELL-128x10OH.jpg?v=1742620397",
  // Dulcet
  "Dulcet::Bingo": "https://cdn.shopify.com/s/files/1/0669/1123/files/1940_RS_S_01_R1.jpg?v=1753643333",
  "Dulcet::Granada": "https://cdn.shopify.com/s/files/1/0669/1123/products/DU-84OH.jpg?v=1742616163",
  "Dulcet::Aosta": "https://cdn.shopify.com/s/files/1/0669/1123/products/DU-1348x10OH.jpg?v=1742616099",
  "Dulcet::Trieste": "https://cdn.shopify.com/s/files/1/0669/1123/products/DU-928x10OH.jpg?v=1742616209",
  // Dorado
  "Dorado::Mariah": "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-512RS_S_01Graphic_1.jpg?v=1751060076",
  "Dorado::Neveh": "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-512RS_S_01Graphic_1.jpg?v=1751060076",
  "Dorado::Audun": "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-404RS_S_01Graphic_1.jpg?v=1744399351",
  "Dorado::Cabo": "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-334RS_S_01Graphic_1.jpg?v=1753643053",
  "Dorado::Loewy": "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-424OH.jpg?v=1751060427",
  // Kennedy
  "Kennedy::Triangles": "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-14OH.jpg?v=1751232653",
  "Kennedy::Stars": "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-24OH.jpg?v=1751232653",
  "Kennedy::Reeve": "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-34OH.jpg?v=1751232653",
  // Money
  "Money::Dollar Front": "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-01A8x10OH.jpg?v=1751059908",
  "Money::Dollar Stacked": "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-05A8x10OH.jpg?v=1751059919",
  "Money::Dollar Front 2006A": "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-03A8x10OH.jpg?v=1751059913",
  "Money::Bitcoin": "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-01A8x10OH.jpg?v=1751059908",
  // Zazzle
  "Zazzle::Patras": "https://cdn.shopify.com/s/files/1/0669/1123/files/ZAZ-23_8x10_OH_1.jpg?v=1742624393",
  // Mystic
  "Mystic::Colette": "https://cdn.shopify.com/s/files/1/0669/1123/files/MC-457OH.jpg?v=1751061979",
  "Mystic::Nova": "https://cdn.shopify.com/s/files/1/0669/1123/files/MC-307CU5.jpg?v=1753643163",
  "Mystic::Maddox": "https://cdn.shopify.com/s/files/1/0669/1123/products/MC-2748x10CU5.jpg?v=1753643163",
  "Mystic::Zoe": "https://cdn.shopify.com/s/files/1/0669/1123/products/MC-59_OH.jpg?v=1742595339",
  // Brielle
  "Brielle::Larissa": "https://cdn.shopify.com/s/files/1/0669/1123/products/BRI-42RoundRS_S_01.jpg?v=1742611088",
  // Ell Basics
  "Ell Basics::Rendezvous": "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-20Graphics_1.jpg?v=1751063157",
  "Ell Basics::Intrigue": "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-12Graphics_1.jpg?v=1751063149",
  "Ell Basics::Gala": "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-30Graphics_1.jpg?v=1751063678",
  // Loop-De-Loop
  "Loop-De-Loop::Cruce": "https://cdn.shopify.com/s/files/1/0669/1123/products/LDL-78_RS_S_01.jpg?v=1751060637",
  "Loop-De-Loop::Kaya": "https://cdn.shopify.com/s/files/1/0669/1123/products/LDL-39_OH.jpg?v=1742604952",
  // Serenity2
  "Serenity2::Darcy": "https://cdn.shopify.com/s/files/1/0669/1123/products/SE-232OH.jpg?v=1753642912",
  // Malaga
  "Malaga::Huron": "https://cdn.shopify.com/s/files/1/0669/1123/files/MG-152OH.jpg?v=1753642976",
  // Horosan
  "Horosan::Abstract": "https://cdn.shopify.com/s/files/1/0669/1123/products/HR-11CU5.jpg?v=1751061258",
  // Omaha
  "Omaha::Laslow": "https://cdn.shopify.com/s/files/1/0669/1123/files/OM-222_8x10_RS_S_01_V2_edited.jpg?v=1751063367",
  "Omaha::Alu": "https://cdn.shopify.com/s/files/1/0669/1123/products/OM-174_OH.jpg?v=1742601014",
  "Omaha::Camilla": "https://cdn.shopify.com/s/files/1/0669/1123/files/OM-214_Roll_OH_edited_a2d93a63-2059-490d-b974-ff03fe11c1c3.jpg?v=1751063276",
  "Omaha::Leon": "https://cdn.shopify.com/s/files/1/0669/1123/files/OM-237_RS_S_01_c52673e1-4b1a-430f-9771-833b2b4cfb8e.jpg?v=1751063477",
  // Maya
  "Maya::Odina": "https://cdn.shopify.com/s/files/1/0669/1123/products/MYA-27RS_S_01.jpg?v=1753642764",
  "Maya::Adriel": "https://cdn.shopify.com/s/files/1/0669/1123/products/MYA-112CU5.jpg?v=1753642766",
  "Maya::Nokomis": "https://cdn.shopify.com/s/files/1/0669/1123/products/MYA-17RS_S_01.jpg?v=1753642766",
  "Maya::Tallulah": "https://cdn.shopify.com/s/files/1/0669/1123/products/MYA-37RS_S_01.jpg?v=1753642764",
};

/* ─── Pattern-name → local asset (matches by Style/pattern name only) ───
 *  Used as a fallback when the live sheet's image column is empty so that
 *  any pattern named e.g. "Melody" picks up /rugs/Melody.jpg automatically. */
const PATTERN_NAME_IMAGES: Record<string, string> = {
  melody: "/rugs/Melody.jpg",
  eva: "/rugs/Eva.webp",
  salem: "/rugs/Salem.jpg",
  timeless: "/rugs/Timeless.webp",
  nile: "/rugs/Nile.jpg",
  opal: "/rugs/Opal.jpg",
  farah: "/rugs/Farah.webp",
  logan: "/rugs/Logan.webp",
  cabana: "/rugs/Cabana.jpg",
  celeste: "/rugs/Celeste.jpg",
  verity: "/rugs/Verity.jpg",
  gigi: "/rugs/Gigi.webp",
  harlow: "/rugs/Harlow.jpg",
  miro: "/rugs/Miro.jpg",
  lia: "/rugs/Lia.jpg",
  sydney: "/rugs/Sydney.webp",
  kasper: "/rugs/Kasper.webp",
};

/* ─── Size code → bucket + display label ─── */
interface SizeMapping {
  bucket: SizeBucket;
  label: string;
}

const SIZE_CODE_MAP: Record<string, SizeMapping> = {
  "2x3-2x4": { bucket: "Accent", label: "2×3" },
  "3x5-4x6": { bucket: "Small-Medium", label: "4×5" },
  "5x7-5x8": { bucket: "Medium", label: "5×7" },
  "6x9-7x9": { bucket: "Large", label: "7×9" },
  "8x10-8x11": { bucket: "Large", label: "8×10" },
  "4x10-4x12": { bucket: "Large", label: "4×10" },
  "9x13": { bucket: "XL", label: "9×13" },
  "2x5": { bucket: "Runner", label: "2×5 Runner" },
  "2x7-2x8": { bucket: "Runner", label: "2×7 Runner" },
  "3x10-3x12": { bucket: "Runner", label: "3×10 Runner" },
  "27 Roll": { bucket: "Runner", label: "Roll" },
  "31 Roll": { bucket: "Runner", label: "Roll" },
  StairTread: { bucket: "Stair Tread", label: "Stair Tread" },
  "3 Round": { bucket: "Small Round", label: "3' Round" },
  "4 Round": { bucket: "Small Round", label: "4' Round" },
  "5 Round": { bucket: "Med Round", label: "5' Round" },
  "6 Round": { bucket: "Med Round", label: "6' Round" },
  "8 Round": { bucket: "Large Round", label: "8' Round" },
  "5x7 Oval": { bucket: "Med Oval", label: "5×7 Oval" },
};

/* ─── Bucket lookup used by RugOrderBuilder when matching display
 *  labels back to buckets. Mirrors SIZE_CODE_MAP labels. */
export const rawSizeToBucket = (raw: string): SizeBucket | null => {
  const s = raw.trim();
  for (const m of Object.values(SIZE_CODE_MAP)) {
    if (m.label === s) return m.bucket;
  }
  // Fallback heuristics for legacy labels
  const lower = s.toLowerCase();
  if (lower.includes("runner") || lower.includes("roll")) return "Runner";
  if (lower.includes("stair")) return "Stair Tread";
  if (lower.endsWith("round")) {
    if (lower.startsWith("3") || lower.startsWith("4")) return "Small Round";
    if (lower.startsWith("5") || lower.startsWith("6")) return "Med Round";
    if (lower.startsWith("8")) return "Large Round";
  }
  if (lower.includes("oval")) return "Med Oval";
  return null;
};

/* ─── CSV parser (RFC 4180-ish, handles quoted commas) ─── */
const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c === "\r") {
        // ignore
      } else {
        field += c;
      }
    }
  }
  // Final field/row
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
};

/* ─── Build collections from raw CSV ─── */
export const buildCollectionsFromCSV = (csv: string): Collection[] => {
  const rows = parseCSV(csv);
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const colIdx = {
    collection: header.indexOf("collection"),
    style: header.indexOf("style"),
    size: header.indexOf("size"),
    sizeCode: header.indexOf("size code"),
    image: header.indexOf("image"),
  };
  // Inventory column is the 9th column (index 8) per the published sheet,
  // but its header is date-stamped — match by position fallback.
  let invIdx = header.findIndex((h) => h.startsWith("inventory"));
  if (invIdx === -1) invIdx = 8;

  if (colIdx.collection < 0 || colIdx.style < 0 || colIdx.sizeCode < 0) {
    throw new Error("CSV missing required columns");
  }

  // Aggregate: collection -> pattern -> { sizes, image }
  type PatternAgg = { sizes: Map<string, number>; image: string };
  const collMap = new Map<string, Map<string, PatternAgg>>();
  const collImage = new Map<string, string>();

  const cleanImg = (v: string): string => {
    const s = (v || "").trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s) || s.startsWith("/")) return s;
    return "";
  };

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || r.length === 0) continue;
    const collection = (r[colIdx.collection] || "").trim();
    const pattern = (r[colIdx.style] || "").trim();
    const sizeCode = (r[colIdx.sizeCode] || "").trim();
    const unitsStr = (r[invIdx] || "").trim();
    const units = parseInt(unitsStr.replace(/,/g, ""), 10);
    const rowImage = colIdx.image >= 0 ? cleanImg(r[colIdx.image] || "") : "";
    if (!collection || !pattern || !sizeCode || !Number.isFinite(units) || units <= 0) continue;
    if (!SIZE_CODE_MAP[sizeCode]) continue; // unknown size, skip

    if (!collMap.has(collection)) collMap.set(collection, new Map());
    const patterns = collMap.get(collection)!;
    if (!patterns.has(pattern)) patterns.set(pattern, { sizes: new Map(), image: "" });
    const agg = patterns.get(pattern)!;
    agg.sizes.set(sizeCode, (agg.sizes.get(sizeCode) || 0) + units);
    if (!agg.image && rowImage) agg.image = rowImage;
    if (!collImage.has(collection) && rowImage) collImage.set(collection, rowImage);
  }

  const collections: Collection[] = [];
  for (const [collectionName, patternMap] of collMap) {
    const subDesigns: SubDesign[] = [];
    const bucketSet = new Set<SizeBucket>();
    let totalUnits = 0;

    for (const [patternName, agg] of patternMap) {
      // Merge size codes that map to same display label (e.g., 27 Roll + 31 Roll -> "Roll")
      const labelMap = new Map<string, { units: number; bucket: SizeBucket }>();
      let patternUnits = 0;
      for (const [sizeCode, units] of agg.sizes) {
        const m = SIZE_CODE_MAP[sizeCode];
        if (!m) continue;
        const existing = labelMap.get(m.label);
        if (existing) {
          existing.units += units;
        } else {
          labelMap.set(m.label, { units, bucket: m.bucket });
        }
        bucketSet.add(m.bucket);
        patternUnits += units;
      }
      if (patternUnits <= 0) continue;

      const sizes: SizeBreakdown[] = [...labelMap.entries()]
        .map(([size, v]) => ({ size, units: v.units }))
        .sort((a, b) => b.units - a.units);

      subDesigns.push({
        name: patternName,
        units: patternUnits,
        image:
          agg.image ||
          PATTERN_IMAGES[`${collectionName}::${patternName}`] ||
          PATTERN_NAME_IMAGES[patternName.toLowerCase()] ||
          COLLECTION_IMAGES[collectionName] ||
          PLACEHOLDER_IMG,
        sizes,
      });
      totalUnits += patternUnits;
    }

    if (subDesigns.length === 0) continue;

    subDesigns.sort((a, b) => b.units - a.units);

    collections.push({
      name: collectionName,
      totalUnits,
      designCount: subDesigns.length,
      image:
        collImage.get(collectionName) ||
        COLLECTION_IMAGES[collectionName] ||
        subDesigns[0].image ||
        PLACEHOLDER_IMG,
      sizeBuckets: [...bucketSet],
      subDesigns,
    });
  }

  collections.sort((a, b) => b.totalUnits - a.totalUnits);
  return collections;
};

/* ─── Fetch & parse (no cache, fresh on every call) ─── */
export const fetchRugInventory = async (): Promise<Collection[]> => {
  const url = `${RUG_INVENTORY_CSV_URL}&_=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Inventory fetch failed (${res.status})`);
  }
  const csv = await res.text();
  return buildCollectionsFromCSV(csv);
};

/* ─── React hook ─── */
import { useEffect, useState } from "react";

export interface RugInventoryState {
  collections: Collection[];
  loading: boolean;
  error: string | null;
}

export const useRugInventory = (): RugInventoryState => {
  const [state, setState] = useState<RugInventoryState>({
    collections: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ collections: [], loading: true, error: null });
    fetchRugInventory()
      .then((collections) => {
        if (!cancelled) setState({ collections, loading: false, error: null });
      })
      .catch((err) => {
        console.error("[rugInventory] load failed:", err);
        if (!cancelled)
          setState({
            collections: [],
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load inventory",
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
