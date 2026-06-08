import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { SheetRow } from "@/lib/productSheet";
import { useFavorites } from "@/contexts/FavoritesContext";
import { cn } from "@/lib/utils";

type SortKey = "default" | "price-asc" | "price-desc" | "qty-asc" | "qty-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "qty-asc", label: "Quantity: Low to High" },
  { value: "qty-desc", label: "Quantity: High to Low" },
];


const CATEGORY_NAV: { name: "Lighting" | "Mirrors" | "Tables"; path: string }[] = [
  { name: "Lighting", path: "/lighting" },
  { name: "Mirrors", path: "/mirrors" },
  { name: "Tables", path: "/tables" },
];

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
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("default");

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

  const visible = useMemo(() => {
    const base = activeBrand ? inCategory.filter((p) => p.brand === activeBrand) : inCategory;
    const arr = [...base];
    const num = (v: number | null | undefined, fallback: number) =>
      v == null || !Number.isFinite(v) ? fallback : v;
    if (sortKey === "default") {
      // Default: Arteriors Home (with images) first, then everything else by price asc.
      // Within Hem, lead with Dusk lamps, then Kuu.
      const hemRank = (p: SheetRow) => {
        if ((p.brand ?? "").toLowerCase() !== "hem") return 99;
        const n = p.name.toLowerCase();
        if (n.includes("dusk")) return 0;
        if (n.includes("kuu")) return 1;
        return 2;
      };
      arr.sort((a, b) => {
        const score = (p: SheetRow) => {
          const isArteriors = (p.brand ?? "").toLowerCase() === "arteriors home";
          const hasImage = !!p.imageUrl;
          if (isArteriors && hasImage) return 0;
          if (isArteriors) return 1;
          if (hasImage) return 2;
          return 3;
        };
        const sa = score(a);
        const sb = score(b);
        if (sa !== sb) return sa - sb;
        const ha = hemRank(a);
        const hb = hemRank(b);
        if (ha !== hb) return ha - hb;
        return num(a.price, Infinity) - num(b.price, Infinity);
      });
      return arr;
    }


    arr.sort((a, b) => {
      switch (sortKey) {
        case "price-asc":
          return num(a.price, Infinity) - num(b.price, Infinity);
        case "price-desc":
          return num(b.price, -Infinity) - num(a.price, -Infinity);
        case "qty-asc":
          return num(a.unitsAvailable, Infinity) - num(b.unitsAvailable, Infinity);
        case "qty-desc":
          return num(b.unitsAvailable, -Infinity) - num(a.unitsAvailable, -Infinity);
        default:
          return 0;
      }
    });
    return arr;
  }, [inCategory, activeBrand, sortKey]);



  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title} — Comeback Goods</title>
        {subtitle ? <meta name="description" content={subtitle} /> : null}
      </Helmet>
      <Navbar />

      <div className="sticky top-16 md:top-20 z-40 shadow-sm">
        {/* Dark navy category bar */}
        <div className="bg-[hsl(var(--primary))] text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <nav className="flex items-center gap-6 md:gap-10 h-12">
              {CATEGORY_NAV.map((c) => {
                const active = c.name === category;
                return (
                  <Link
                    key={c.name}
                    to={c.path}
                    className={cn(
                      "text-sm md:text-base font-bold tracking-wide uppercase transition-colors",
                      active
                        ? "text-accent border-b-2 border-accent pb-1"
                        : "text-primary-foreground/80 hover:text-primary-foreground",
                    )}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Light gray brand filter band */}
        {brands.length > 0 && (
          <div className="bg-muted/95 backdrop-blur border-b border-border">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl py-2 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground mr-1">
                Filter by Brand:
              </span>
              {brands.map((b) => {
                const active = activeBrand === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setActiveBrand(active ? null : b)}
                    className={cn(
                      "px-3 py-1 rounded-md text-sm font-medium border transition-colors",
                      active
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-background text-foreground border-border hover:border-accent/60",
                    )}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>


      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-muted-foreground max-w-2xl">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="border border-border bg-background text-foreground rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </header>

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
              const isMeridian = /meridian/i.test(p.name);
              const productId = `${p.brand}::${p.name}`;
              const fav = isFavorite(productId);
              return (
                <article
                  key={`${p.brand}-${p.name}-${i}`}
                  className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className={cn(
                      "relative aspect-square overflow-hidden",
                      category === "Lighting"
                        ? "bg-gradient-to-br from-muted/40 via-background to-muted/60 p-6"
                        : isMeridian
                          ? "bg-white p-6"
                          : "bg-muted",
                    )}
                  >
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        loading="lazy"
                        className={cn(
                          "w-full h-full group-hover:scale-[1.02] transition-transform duration-300",
                          category === "Lighting" || isMeridian ? "object-contain" : "object-cover",
                        )}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                    <button
                      type="button"
                      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(productId, {
                          name: p.name,
                          brand: p.brand,
                          imageUrl: p.imageUrl,
                          msrp: p.msrp,
                          price: p.price,
                        });
                      }}
                      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/90 backdrop-blur border border-border shadow-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5 transition-colors",
                          fav ? "fill-accent text-accent" : "text-foreground",
                        )}
                      />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <div className="text-sm uppercase tracking-widest text-accent font-bold">
                      {p.brand}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground line-clamp-2 min-h-[3.5rem] leading-snug">
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-auto pt-2">
                      <span className="text-xl font-bold text-foreground">
                        {formatMoney(p.price)}
                      </span>
                      {p.msrp != null && (p.price == null || p.msrp > p.price) && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatMoney(p.msrp)}
                        </span>
                      )}
                      {pct != null && pct > 0 && (
                        <span className="ml-auto text-sm font-semibold text-accent">
                          {pct}% off
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
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
