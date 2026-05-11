import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Heart } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/productCategory";
import { matchesSearchQuery } from "@/lib/searchSynonyms";
import { useFavorites } from "@/contexts/FavoritesContext";
import { X } from "lucide-react";
import { comebackPrice, isBuyerVisible, formatComebackPrice } from "@/lib/pricing";
import { useCatalogOrder } from "@/contexts/CatalogOrderContext";
import CatalogOrderBar from "@/components/CatalogOrderBar";
import { Plus, Minus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string | null;
  image_url: string | null;
  price: number | null;
  msrp: number | null;
  cost: number | null;
  units_available: number;
}

const ALL = "All";

function stockBadge(units: number) {
  if (units <= 0) return { label: "Out of Stock", variant: "secondary" as const };
  if (units < 10) return { label: "Low Stock", variant: "outline" as const };
  return { label: "In Stock", variant: "default" as const };
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCat = searchParams.get("category");
  const initialCat = (PRODUCT_CATEGORIES as readonly string[]).includes(urlCat ?? "")
    ? (urlCat as string)
    : PRODUCT_CATEGORIES[0];
  const [category, setCategory] = useState<string>(initialCat);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "qty-asc" | "qty-desc">("price-asc");
  const { isFavorite, toggleFavorite } = useFavorites();
  const { lines, increment, decrement, setQuantity } = useCatalogOrder();

  useEffect(() => {
    const c = searchParams.get("category");
    if (c && (PRODUCT_CATEGORIES as readonly string[]).includes(c) && c !== category) {
      setCategory(c);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function selectCategory(c: string) {
    setCategory(c);
    setSearchParams({ category: c }, { replace: true });
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id,name,brand,category,image_url,price,msrp,cost,units_available")
        .order("price", { ascending: true, nullsFirst: false })
        .order("brand")
        .limit(2000);
      if (error) setError(error.message);
      else setProducts(data ?? []);
      setLoading(false);
    })();
  }, []);

  const searchQuery = searchParams.get("search") ?? "";

  const filtered = useMemo(() => {
    // Show all items — pricing formula guarantees no item is sold below cost.
    let list = products.filter(isBuyerVisible);
    if (searchQuery.trim()) {
      list = list.filter((p) => matchesSearchQuery(p.name, searchQuery));
    } else {
      list = list.filter((p) => p.category === category);
    }
    const sorted = [...list].sort((a, b) => {
      if (sortBy.startsWith("price")) {
        const ap = comebackPrice(a.msrp, undefined, a.cost) ?? Infinity;
        const bp = comebackPrice(b.msrp, undefined, b.cost) ?? Infinity;
        return sortBy === "price-asc" ? ap - bp : bp - ap;
      }
      const aq = a.units_available ?? 0;
      const bq = b.units_available ?? 0;
      return sortBy === "qty-asc" ? aq - bq : bq - aq;
    });
    return sorted;
  }, [products, category, sortBy, searchQuery]);

  function clearSearch() {
    const next = new URLSearchParams(searchParams);
    next.delete("search");
    next.set("category", category);
    setSearchParams(next, { replace: true });
  }


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-3 pb-8">
        <div className="mb-3">
          <h1 className="text-3xl md:text-4xl font-bold">
            {searchQuery ? `Results for "${searchQuery}"` : "Catalog"}
          </h1>
          <p className="text-muted-foreground">
            {filtered.length} {searchQuery ? "matching" : category} products
          </p>
          {searchQuery && (
            <Button variant="outline" size="sm" className="mt-2 gap-1" onClick={clearSearch}>
              <X className="h-3.5 w-3.5" /> Clear search
            </Button>
          )}
        </div>

        <div className="sticky top-16 md:top-20 z-40 -mx-4 px-4 py-2 mb-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
          <div className="flex items-center gap-2 flex-wrap">
            {PRODUCT_CATEGORIES.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={category === c ? "default" : "outline"}
                onClick={() => selectCategory(c)}
              >
                {c}
              </Button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="qty-asc">Quantity: Low to High</option>
                <option value="qty-desc">Quantity: High to Low</option>
              </select>
            </div>
          </div>
        </div>


        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-muted-foreground">No products yet. Import from /admin/products.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const sb = stockBadge(p.units_available);
            const cb = comebackPrice(p.msrp, undefined, p.cost);
            return (
              <div key={p.id} className="border rounded-lg overflow-hidden bg-card flex flex-col">
                <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground uppercase">Image Coming Soon</span>
                  )}
                  <button
                    type="button"
                    aria-label={isFavorite(p.id) ? "Remove from favorites" : "Add to favorites"}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(p.id); }}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/90 hover:bg-background border flex items-center justify-center shadow-sm transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(p.id) ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                  </button>
                </div>
                <div className="p-3 flex flex-col gap-1 flex-1">
                  <div className="text-xs text-muted-foreground">{p.brand}</div>
                  <div className="font-medium leading-tight line-clamp-2">{p.name}</div>
                  <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">Price</span>
                    <span className="font-bold">{formatComebackPrice(cb)}</span>
                  </div>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <Badge variant={sb.variant}>{sb.label}</Badge>
                    <span className="text-sm font-semibold text-foreground">{p.units_available > 100 ? "100+" : p.units_available} units</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
