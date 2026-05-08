// Buyer-facing pricing rules.
// "comeback_price" = MSRP × 0.45 (55% off MSRP). It is the only price
// shown to buyers. Items whose comeback_price does not exceed our cost
// (the `price` column) are hidden from the catalog entirely.

export function comebackPrice(msrp: number | null | undefined): number | null {
  if (msrp == null) return null;
  return Math.round(Number(msrp) * 0.45 * 100) / 100;
}

export function isBuyerVisible(p: {
  price: number | null;
  msrp: number | null;
}): boolean {
  const cb = comebackPrice(p.msrp);
  return cb != null && p.price != null && cb > p.price;
}

export function formatComebackPrice(n: number | null): string {
  if (n == null) return "—";
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}
