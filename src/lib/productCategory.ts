export const PRODUCT_CATEGORIES = [
  "Lighting",
  "Mirrors",
  "Accessories",
  "Small Furniture",
  "Beds",
  "Sofas",
  "Chairs",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

const SMALL_FURNITURE = ["nightstand", "bench", "console", "ottoman", "side table", "end table", "accent table", "coffee table", "dresser", "cabinet", "sideboard", "armoire", "wardrobe", "credenza", "buffet", "bookcase", "hutch"];
const BEDS = ["bed", "headboard"];
const SOFAS = ["sofa", "loveseat", "settee", "sectional"];
const CHAIRS = ["chair", "stool", "armchair", "recliner"];
const LIGHTING = ["lamp", "chandelier", "sconce", "pendant", "light", "lantern"];

export function categorizeProduct(name: string): ProductCategory {
  const n = (name || "").toLowerCase();
  // Accessories take priority over other matches
  if (n.includes("candle") || n.includes("clock")) return "Accessories";
  if (n.includes("mirror")) return "Mirrors";
  if (LIGHTING.some((k) => n.includes(k))) return "Lighting";
  if (SOFAS.some((k) => n.includes(k))) return "Sofas";
  if (CHAIRS.some((k) => n.includes(k))) return "Chairs";
  if (BEDS.some((k) => n.includes(k))) return "Beds";
  if (SMALL_FURNITURE.some((k) => n.includes(k))) return "Small Furniture";
  if (n.includes("table")) return "Small Furniture";
  return "Accessories";
}
