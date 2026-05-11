import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export interface OrderLine {
  productId: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  unitsAvailable: number;
}

interface CatalogOrderContextValue {
  lines: Record<string, OrderLine>;
  setQuantity: (productId: string, qty: number, meta: Omit<OrderLine, "quantity" | "productId">) => void;
  increment: (productId: string, meta: Omit<OrderLine, "quantity" | "productId">) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  totals: {
    items: number;
    grandTotal: number;
    byBrand: Array<{ brand: string; total: number; items: number; metMoq: boolean }>;
    anyBrandMet: boolean;
  };
}

const STORAGE_KEY = "comeback_catalog_order_v1";
export const BRAND_MOQ = 6000;

const Ctx = createContext<CatalogOrderContextValue | null>(null);

export function CatalogOrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Record<string, OrderLine>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch {}
  }, [lines]);

  const setQuantity = useCallback((productId: string, qty: number, meta: Omit<OrderLine, "quantity" | "productId">) => {
    setLines((prev) => {
      const next = { ...prev };
      if (qty <= 0) { delete next[productId]; return next; }
      next[productId] = { ...meta, productId, quantity: Math.min(qty, meta.unitsAvailable || qty) };
      return next;
    });
  }, []);

  const increment = useCallback((productId: string, meta: Omit<OrderLine, "quantity" | "productId">) => {
    setLines((prev) => {
      const cur = prev[productId]?.quantity ?? 0;
      const max = meta.unitsAvailable || cur + 1;
      const nextQty = Math.min(cur + 1, max);
      return { ...prev, [productId]: { ...meta, productId, quantity: nextQty } };
    });
  }, []);

  const decrement = useCallback((productId: string) => {
    setLines((prev) => {
      const cur = prev[productId];
      if (!cur) return prev;
      const next = { ...prev };
      if (cur.quantity <= 1) delete next[productId];
      else next[productId] = { ...cur, quantity: cur.quantity - 1 };
      return next;
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => { const n = { ...prev }; delete n[productId]; return n; });
  }, []);

  const clear = useCallback(() => setLines({}), []);

  const list = Object.values(lines);
  const items = list.reduce((s, l) => s + l.quantity, 0);
  const grandTotal = list.reduce((s, l) => s + l.quantity * l.unitPrice, 0);

  const brandMap = new Map<string, { total: number; items: number }>();
  for (const l of list) {
    const cur = brandMap.get(l.brand) ?? { total: 0, items: 0 };
    cur.total += l.quantity * l.unitPrice;
    cur.items += l.quantity;
    brandMap.set(l.brand, cur);
  }
  const byBrand = Array.from(brandMap.entries())
    .map(([brand, v]) => ({ brand, total: v.total, items: v.items, metMoq: v.total >= BRAND_MOQ }))
    .sort((a, b) => b.total - a.total);
  const anyBrandMet = byBrand.some((b) => b.metMoq);

  return (
    <Ctx.Provider value={{ lines, setQuantity, increment, decrement, remove, clear, totals: { items, grandTotal, byBrand, anyBrandMet } }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCatalogOrder() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCatalogOrder must be used within CatalogOrderProvider");
  return v;
}
