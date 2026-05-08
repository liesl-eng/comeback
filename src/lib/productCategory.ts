export const PRODUCT_CATEGORIES = [
  "Lighting",
  "Mirrors",
  "Accessories",
  "Small Furniture",
  "Large Furniture",
  "Sofas",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

const SMALL_FURNITURE = ["chair", "nightstand", "bench", "console", "stool", "ottoman", "side table", "end table", "accent table", "coffee table"];
const LARGE_FURNITURE = ["bed", "sofa", "sectional", "dresser", "cabinet", "sideboard", "armoire", "wardrobe", "credenza", "buffet", "bookcase", "hutch"];
const LIGHTING = ["lamp", "chandelier", "sconce", "pendant", "light", "lantern"];

export function categorizeProduct(name: string): ProductCategory {
  const n = (name || "").toLowerCase();
  if (n.includes("mirror")) return "Mirrors";
  if (LIGHTING.some((k) => n.includes(k))) return "Lighting";
  if (LARGE_FURNITURE.some((k) => n.includes(k))) return "Large Furniture";
  if (SMALL_FURNITURE.some((k) => n.includes(k))) return "Small Furniture";
  // generic "table" → small (after large-furniture check above so dining/console handled)
  if (n.includes("table")) return "Small Furniture";
  return "Accessories";
}
