// Buyer-facing pricing.
// The `price` column stores the Comeback Pricing — the only price shown to buyers.
// MSRP and Floorfound Pricing are stored but never displayed.

export function comebackPrice(
  msrp: number | null | undefined,
  price?: number | null | undefined,
): number | null {
  const p = price == null ? null : Number(price);
  if (p != null && Number.isFinite(p)) return Math.round(p * 100) / 100;
  const m = msrp == null ? null : Number(msrp);
  if (m != null && Number.isFinite(m)) return Math.round(m * 0.45 * 100) / 100;
  return null;
}

// All items with a price are buyer-visible.
export function isBuyerVisible(_p: { price: number | null; msrp: number | null }): boolean {
  return true;
}

export function formatComebackPrice(n: number | null): string {
  if (n == null) return "—";
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}
