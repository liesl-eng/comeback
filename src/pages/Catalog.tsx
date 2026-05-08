import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/productCategory";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string | null;
  image_url: string | null;
  price: number | null;
  msrp: number | null;
  units_available: number;
}

const ALL = "All";

function stockBadge(units: number) {
  if (units <= 0) return { label: "Out of Stock", variant: "secondary" as const };
  if (units < 10) return { label: "Low Stock", variant: "outline" as const };
  return { label: "In Stock", variant: "default" as const };
}

function fmtPrice(n: number | null) {
  if (n == null) return "—";
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brand, setBrand] = useState<string>(ALL);
  const [category, setCategory] = useState<string>(ALL);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id,name,brand,category,image_url,price,msrp,units_available")
        .order("units_available", { ascending: false })
        .order("brand")
        .limit(2000);
      if (error) setError(error.message);
      else setProducts(data ?? []);
      setLoading(false);
    })();
  }, []);

  const brands = useMemo(
    () => [ALL, ...Array.from(new Set(products.map((p) => p.brand))).sort()],
    [products],
  );

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (brand === ALL || p.brand === brand) &&
          (category === ALL || p.category === category),
      ),
    [products, brand, category],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Catalog</h1>
          <p className="text-muted-foreground">
            {filtered.length} {brand === ALL ? "products" : `${brand} products`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {brands.map((b) => (
            <Button
              key={b}
              size="sm"
              variant={brand === b ? "default" : "outline"}
              onClick={() => setBrand(b)}
            >
              {b}
            </Button>
          ))}
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
            const savings =
              p.msrp && p.price && p.msrp > p.price
                ? Math.round(((p.msrp - p.price) / p.msrp) * 100)
                : null;
            return (
              <div key={p.id} className="border rounded-lg overflow-hidden bg-card flex flex-col">
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
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
                </div>
                <div className="p-3 flex flex-col gap-1 flex-1">
                  <div className="text-xs text-muted-foreground">{p.brand}</div>
                  <div className="font-medium leading-tight line-clamp-2">{p.name}</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold">{fmtPrice(p.price)}</span>
                    {p.price != null && <span className="text-xs text-muted-foreground">Each</span>}
                    {p.msrp != null && p.msrp !== p.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {fmtPrice(p.msrp)}
                      </span>
                    )}
                    {savings !== null && (
                      <span className="text-xs font-semibold text-primary">−{savings}%</span>
                    )}
                  </div>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <Badge variant={sb.variant}>{sb.label}</Badge>
                    <span className="text-xs text-muted-foreground">{p.units_available} units</span>
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
