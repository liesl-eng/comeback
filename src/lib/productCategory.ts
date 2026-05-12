export const PRODUCT_CATEGORIES = [
  "Lighting",
  "Mirrors",
  "Accessories",
  "Furniture",
  "Beds",
  "Sofas",
  "Chairs",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

const FURNITURE = ["nightstand", "bench", "console", "ottoman", "stool", "side table", "end table", "accent table", "coffee table", "dresser", "cabinet", "sideboard", "armoire", "wardrobe", "credenza", "buffet", "bookcase", "hutch", "table", "desk"];
const BEDS = ["bed", "headboard"];
const SOFAS = ["sofa", "loveseat", "settee", "sectional"];
const CHAIRS = ["chair", "armchair", "recliner"];
const LIGHTING = ["lamp", "chandelier", "sconce", "pendant", "light", "lantern"];

export function categorizeProduct(name: string): ProductCategory {
  const n = (name || "").toLowerCase();
  // Accessories take priority over other matches
  if (n.includes("candle") || n.includes("clock") || n.includes("pillow")) return "Accessories";
  if (n.includes("mirror")) return "Mirrors";
  if (LIGHTING.some((k) => n.includes(k))) return "Lighting";
  if (SOFAS.some((k) => n.includes(k))) return "Sofas";
  if (CHAIRS.some((k) => n.includes(k))) return "Chairs";
  if (BEDS.some((k) => n.includes(k))) return "Beds";
  if (FURNITURE.some((k) => n.includes(k))) return "Furniture";
  return "Accessories";
}
