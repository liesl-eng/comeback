/* ─── Availability range helpers for rug inventory ─── */

export interface AvailabilityInfo {
  label: string;
  threshold: number;
  color: string; // tailwind text color class
}

export const getAvailability = (units: number): AvailabilityInfo => {
  if (units >= 500) return { label: "500+ available", threshold: 500, color: "text-green-600" };
  if (units >= 100) return { label: "100+ available", threshold: 100, color: "text-green-600" };
  if (units >= 50) return { label: "50+ available", threshold: 50, color: "text-green-600" };
  if (units >= 10) return { label: "In Stock", threshold: 10, color: "text-green-600" };
  return { label: "Low Stock", threshold: 5, color: "text-yellow-600" };
};

export const getQuantityWarning = (units: number, quantity: number): string | null => {
  if (units >= 500 && quantity > 500) {
    return "This pattern/size has 500+ units — we'll confirm exact availability in your quote.";
  }
  if (units >= 100 && quantity > 100) {
    return "This pattern/size has 100+ units — we'll confirm exact availability in your quote.";
  }
  if (units >= 50 && quantity > 50) {
    return "This pattern/size has 50+ units — we'll confirm exact availability in your quote.";
  }
  if (units >= 10 && quantity > 10) {
    return "Limited availability — we'll confirm in your quote.";
  }
  if (units < 10 && quantity > 5) {
    return "Very limited — we'll confirm in your quote.";
  }
  return null;
};
