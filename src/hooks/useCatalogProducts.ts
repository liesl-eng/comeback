import { useEffect, useState } from "react";
import { fetchAllProducts, SheetRow } from "@/lib/productSheet";

type State = {
  products: SheetRow[];
  loading: boolean;
  error: string | null;
};

// Module-level cache so all category pages share one fetch per session.
let cache: SheetRow[] | null = null;
let inflight: Promise<SheetRow[]> | null = null;

export function useCatalogProducts(): State {
  const [state, setState] = useState<State>({
    products: cache ?? [],
    loading: !cache,
    error: null,
  });

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    if (!inflight) inflight = fetchAllProducts();
    inflight
      .then((rows) => {
        cache = rows;
        if (!cancelled) setState({ products: rows, loading: false, error: null });
      })
      .catch((e) => {
        if (!cancelled)
          setState({
            products: [],
            loading: false,
            error: e instanceof Error ? e.message : "Failed to load products",
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
