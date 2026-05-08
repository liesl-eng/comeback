// Buyer-facing pricing rules.
// If MSRP × 0.45 > cost → price = MSRP × 0.45
// Otherwise → price = cost × 1.20
// All items are shown. No exclusions.

export function comebackPrice(
  msrp: number | null | undefined,
  cost?: number | null | undefined,
): number | null {
  const m = msrp == null ? null : Number(msrp);
  const c = cost == null ? null : Number(cost);
  let value: number | null = null;
  if (m != null && c != null) {
    const discounted = m * 0.45;
    value = discounted > c ? discounted : c * 1.2;
  } else if (m != null) {
    value = m * 0.45;
  } else if (c != null) {
    value = c * 1.2;
  }
  if (value == null) return null;
  return Math.round(value * 100) / 100;
}

// All items are buyer-visible now.
export function isBuyerVisible(_p: {
  price: number | null;
  msrp: number | null;
}): boolean {
  return true;
}

export function formatComebackPrice(n: number | null): string {
  if (n == null) return "—";
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}
