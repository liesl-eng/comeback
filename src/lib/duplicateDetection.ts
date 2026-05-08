// Normalization + duplicate detection for products.
// Two products are considered "the same" if their (brand, normalized name) match.

export function normalizeProductName(name: string): string {
  return (name || "")
    .toLowerCase()
    // strip our own dedupe suffix " (#2)", " (#3)", etc.
    .replace(/\s*\(#\d+\)\s*$/g, "")
    // strip parenthetical asides "(set of 2)" → keep content but drop punctuation later
    .replace(/[()[\]]/g, " ")
    // collapse common separators
    .replace(/[-–—_/\\,.]/g, " ")
    // drop apostrophes / quotes
    .replace(/['"`’]/g, "")
    // drop trailing "set of N" so set-size variants count as the same product family? NO —
    // sets are distinct SKUs, so keep them. Only collapse whitespace.
    .replace(/\s+/g, " ")
    .trim();
}

export function productKey(brand: string, name: string): string {
  return `${(brand || "").trim().toLowerCase()}|${normalizeProductName(name)}`;
}

export interface DuplicateGroup<T> {
  key: string;
  items: T[];
}

/** Group items by normalized (brand, name) and return only groups with >1 entries. */
export function findDuplicates<T extends { brand: string; name: string }>(
  items: T[],
): DuplicateGroup<T>[] {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const k = productKey(it.brand, it.name);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(it);
  }
  return Array.from(map.entries())
    .filter(([, arr]) => arr.length > 1)
    .map(([key, arr]) => ({ key, items: arr }));
}
