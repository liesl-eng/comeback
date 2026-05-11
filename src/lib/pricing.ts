// Buyer-facing pricing.
// Formula: comeback_price = max(msrp * 0.45, cost * 1.20)
//   - 55% off MSRP price floor
//   - 20% markup over cost margin floor
// MSRP and cost are stored but never displayed to buyers.

export function comebackPrice(
  msrp: number | null | undefined,
  _priceOrCost?: number | null | undefined,
  cost?: number | null | undefined,
): number | null {
  // Backward-compat: if called with (msrp, cost) two-arg form, treat second as cost.
  const c = cost != null ? Number(cost) : (_priceOrCost != null ? Number(_priceOrCost) : null);
  const m = msrp == null ? null : Number(msrp);

  const msrpFloor = m != null && Number.isFinite(m) ? m * 0.45 : null;
  const marginFloor = c != null && Number.isFinite(c) && c > 0 ? c * 1.20 : null;

  let result: number | null = null;
  if (msrpFloor != null && marginFloor != null) result = Math.max(msrpFloor, marginFloor);
  else if (msrpFloor != null) result = msrpFloor;
  else if (marginFloor != null) result = marginFloor;

  return result == null ? null : Math.round(result);
}

// All items are buyer-visible — pricing formula guarantees no item is sold below cost.
export function isBuyerVisible(_p: { price?: number | null; msrp?: number | null; cost?: number | null }): boolean {
  return true;
}

// Internal label for which floor is binding (never shown to buyers).
export function pricingRuleLabel(
  msrp: number | null | undefined,
  cost: number | null | undefined,
): "55% off MSRP" | "20% markup over cost" | null {
  const m = msrp == null ? null : Number(msrp);
  const c = cost == null ? null : Number(cost);
  if (m == null || !Number.isFinite(m)) return c != null && Number.isFinite(c) ? "20% markup over cost" : null;
  if (c == null || !Number.isFinite(c) || c <= 0) return "55% off MSRP";
  return m * 0.45 > c * 1.20 ? "55% off MSRP" : "20% markup over cost";
}

export function formatComebackPrice(n: number | null): string {
  if (n == null) return "—";
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}
