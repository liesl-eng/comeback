import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { SheetRow } from "@/lib/productSheet";
import { cn } from "@/lib/utils";

interface CategoryPageProps {
  category: "Lighting" | "Mirrors" | "Tables";
  title: string;
  subtitle?: string;
}

function formatMoney(n: number | null): string {
  if (n == null) return "—";
  return `$${n.toLocaleString(undefined, {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function computeDiscountPct(row: SheetRow): number | null {
  if (row.discountPct != null) return Math.round(row.discountPct);
  if (row.price != null && row.msrp && row.msrp > 0) {
    return Math.round((1 - row.price / row.msrp) * 100);
  }
  return null;
}

const CategoryPage = ({ category, title, subtitle }: CategoryPageProps) => {
  const { products, loading, error } = useCatalogProducts();
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  const inCategory = useMemo(
    () =>
      products.filter(
        (p) => (p.category ?? "").trim().toLowerCase() === category.toLowerCase(),
      ),
    [products, category],
  );

  const brands = useMemo(() => {
    const set = new Set<string>();
    for (const p of inCategory) if (p.brand) set.add(p.brand);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [inCategory]);

  const visible = useMemo(
    () => (activeBrand ? inCategory.filter((p) => p.brand === activeBrand) : inCategory),
    [inCategory, activeBrand],
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title} — Comeback Goods</title>
        {subtitle ? <meta name="description" content={subtitle} /> : null}
      </Helmet>
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-muted-foreground max-w-2xl">{subtitle}</p>
          ) : null}
        </header>

        {/* Brand filter pills */}
        {brands.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 sticky top-16 z-10 bg-background/95 backdrop-blur py-3 -mx-4 px-4 md:-mx-6 md:px-6 border-b">
            <button
              type="button"
              onClick={() => setActiveBrand(null)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                activeBrand === null
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground/40",
              )}
            >
              All ({inCategory.length})
            </button>
            {brands.map((b) => {
              const count = inCategory.filter((p) => p.brand === b).length;
              const active = activeBrand === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setActiveBrand(active ? null : b)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:border-foreground/40",
                  )}
                >
                  {b} ({count})
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center text-muted-foreground">Loading products…</div>
        ) : error ? (
          <div className="py-24 text-center text-destructive">{error}</div>
        ) : visible.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            No {category.toLowerCase()} available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map((p, i) => {
              const pct = computeDiscountPct(p);
              return (
                <article
                  key={`${p.brand}-${p.name}-${i}`}
                  className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square overflow-hidden" style={{ backgroundColor: "#F5F0E8" }}>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-contain p-4 group-hover:scale-[1.02] transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {p.brand}
                    </div>
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 min-h-[2.5rem]">
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-auto pt-2">
                      <span className="text-base font-semibold text-foreground">
                        {formatMoney(p.price)}
                      </span>
                      {p.msrp != null && (p.price == null || p.msrp > p.price) && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatMoney(p.msrp)}
                        </span>
                      )}
                      {pct != null && pct > 0 && (
                        <span className="ml-auto text-xs font-semibold text-accent">
                          {pct}% off
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.unitsAvailable} {p.unitsAvailable === 1 ? "unit" : "units"} available
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
