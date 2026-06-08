import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ImageOff, ChevronLeft, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { fetchSheetTab, BrandTab, SheetRow } from "@/lib/productSheet";
import AddToOrderButton from "@/components/AddToOrderButton";
import { useFavorites } from "@/contexts/FavoritesContext";
import { cn } from "@/lib/utils";

export interface BrandSource {
  /** Display label on the toggle pill */
  label: string;
  /** Brand label shown in uppercase on each card */
  displayBrand: string;
  /** Sheet tab to pull from */
  tab: BrandTab;
  /** Optional filter on product name (case-insensitive). Returns true to keep. */
  filterName?: (name: string) => boolean;
  /** Hardcoded fallback if CSV fails or returns nothing for this brand */
  fallback?: Array<{ name: string; msrp: number; unitsAvailable: number; imageUrl?: string | null }>;
  /** Optional override for image URL keyed off product name. Returns a URL to use instead of the CSV image. */
  imageOverride?: (name: string) => string | undefined;
}

export interface ProgramProductGridConfig {
  eyebrow: string;            // e.g. "MIRROR PROGRAM"
  heading: string;            // e.g. "Shop Mirrors"
  subtext: string;
  brands: BrandSource[];      // 2 brand sources
  anchorId?: string;          // optional anchor id
  /** Hide the eyebrow label above the heading. */
  hideEyebrow?: boolean;
  /** Make the header (heading + brand toggles) sticky below the navbar. */
  stickyHeader?: boolean;
}

interface CardProduct {
  name: string;
  displayBrand: string;
  msrp: number;
  unitsAvailable: number;
  imageUrl: string | null;
}

function calcYourPrice(msrp: number): number {
  return Math.round(msrp * 0.4);
}

function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

const SkeletonCard = () => (
  <Card className="overflow-hidden flex flex-col">
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="p-4 space-y-3 flex-1">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-10 w-full" />
    </div>
  </Card>
);

const ProductImage = ({
  src,
  alt,
  bgClassName,
  blendMultiply,
}: {
  src: string | null;
  alt: string;
  bgClassName?: string;
  blendMultiply?: boolean;
}) => {
  const [failed, setFailed] = useState(false);
  const bg = bgClassName ?? "bg-muted";
  if (!src || failed) {
    return (
      <div className={cn("aspect-square w-full flex items-center justify-center", bg)}>
        <ImageOff className="h-10 w-10 text-muted-foreground/50" />
      </div>
    );
  }
  return (
    <div className={cn("aspect-square w-full overflow-hidden", bg)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          "w-full h-full object-cover",
          blendMultiply && "mix-blend-multiply"
        )}
        onError={() => setFailed(true)}
      />
    </div>
  );
};


const ProductCard = ({ p }: { p: CardProduct }) => {
  const yourPrice = calcYourPrice(p.msrp);
  const itemId = `${p.displayBrand}::${p.name}`.toLowerCase().replace(/\s+/g, "_");
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(itemId);
  const isArteriors = /arteriors/i.test(p.displayBrand);
  const imageBg = isArteriors ? "bg-[hsl(35,25%,93%)]" : undefined;
  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-hover transition-shadow">
      <div className="relative">
        <ProductImage src={p.imageUrl} alt={p.name} bgClassName={imageBg} />

        <button
          type="button"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(itemId, {
              name: p.name,
              brand: p.displayBrand,
              imageUrl: p.imageUrl,
              msrp: p.msrp,
              price: yourPrice,
            });
          }}
          className="absolute top-2 right-2 h-9 w-9 rounded-full bg-background/90 backdrop-blur border border-border shadow-sm flex items-center justify-center transition-colors hover:bg-background"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              favorited ? "fill-accent text-accent" : "text-muted-foreground"
            )}
          />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-bold tracking-widest text-accent uppercase mb-2">
          {p.displayBrand}
        </span>
        <h3 className="font-bold text-foreground text-base leading-snug mb-1 line-clamp-2">
          {p.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          {p.unitsAvailable >= 25 ? "25+ available" : `${p.unitsAvailable} in stock`}
        </p>
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground line-through">{formatUsd(p.msrp)}</span>
          <span className="text-xl font-bold text-foreground">{formatUsd(yourPrice)}</span>
        </div>
        
        <AddToOrderButton
          item={{
            id: itemId,
            productName: p.name,
            brand: p.displayBrand,
            imageUrl: p.imageUrl,
            msrp: p.msrp,
            yourPrice,
            unitsAvailable: p.unitsAvailable,
          }}
        />
      </div>
    </Card>
  );
};

const CATEGORY_NAV = [
  { label: "Lighting", to: "/lighting", match: ["/lighting"] },
  { label: "Mirrors", to: "/mirrors", match: ["/mirrors", "/mirror-program"] },
  
  { label: "Tables", to: "/tables", match: ["/tables"] },
  { label: "Beds", to: "/beds", match: ["/beds"] },
];

const ProgramProductGrid = ({ config }: { config: ProgramProductGridConfig }) => {
  const [selected, setSelected] = useState(0);
  const [rowsByBrand, setRowsByBrand] = useState<Record<number, SheetRow[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    Promise.all(config.brands.map((b) => fetchSheetTab(b.tab).catch(() => null)))
      .then((results) => {
        if (cancelled) return;
        const next: Record<number, SheetRow[]> = {};
        let anyFail = false;
        let latest: string | null = null;
        results.forEach((r, i) => {
          if (r == null) {
            anyFail = true;
            next[i] = [];
          } else {
            next[i] = r;
            for (const row of r) {
              if (row.sourceLastUpdated && (!latest || row.sourceLastUpdated > latest)) {
                latest = row.sourceLastUpdated;
              }
            }
          }
        });
        setRowsByBrand(next);
        setError(anyFail);
        setLastUpdated(latest);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [config]);

  const products: CardProduct[] = useMemo(() => {
    const brand = config.brands[selected];
    if (!brand) return [];
    const raw = rowsByBrand[selected] ?? [];
    const filtered = raw.filter((r) => {
      if (brand.filterName && !brand.filterName(r.name)) return false;
      if (!r.imageUrl) return false;
      if (r.unitsAvailable <= 0) return false;
      if (r.msrp == null) return false;
      return true;
    });
    let cards: CardProduct[] = filtered.map((r) => ({
      name: r.name,
      displayBrand: brand.displayBrand,
      msrp: r.msrp as number,
      unitsAvailable: r.unitsAvailable,
      imageUrl: brand.imageOverride?.(r.name) ?? r.imageUrl,
    }));
    if (cards.length === 0 && brand.fallback && brand.fallback.length > 0) {
      cards = brand.fallback.map((f) => ({
        name: f.name,
        displayBrand: brand.displayBrand,
        msrp: f.msrp,
        unitsAvailable: f.unitsAvailable,
        imageUrl: brand.imageOverride?.(f.name) ?? f.imageUrl ?? null,
      }));
    }
    cards.sort((a, b) => b.unitsAvailable - a.unitsAvailable);
    return cards;
  }, [config, rowsByBrand, selected]);

  const showFallbackBanner = error && products.length > 0;

  return (
    <section id={config.anchorId} className={(config.stickyHeader ? "pb-14 md:pb-20 " : "py-14 md:py-20 ") + "scroll-mt-20"}>
      <div className={config.stickyHeader ? "" : "container mx-auto px-4"}>
        {/* Header */}
        <div
          className={
            config.stickyHeader
              ? "sticky top-16 md:top-20 z-40 bg-primary text-primary-foreground border-b border-primary/20 shadow-sm mb-8 md:mb-10"
              : "text-center mb-8"
          }
        >
          {config.stickyHeader ? (
            <div className="container mx-auto px-4 py-3 md:py-4">
              <div className="relative flex items-center gap-3">
                <Link
                  to="/#programs"
                  className="flex-shrink-0 inline-flex items-center gap-1 text-sm text-primary-foreground/80 hover:text-accent transition-colors font-medium"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Link>

                {/* Category nav pills - scrollable on mobile */}
                <div className="relative flex-1 min-w-0">
                  <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
                    <div className="flex items-center justify-start md:justify-center gap-2 whitespace-nowrap">
                      {CATEGORY_NAV.map((c) => {
                        const active = c.match.some((p) => location.pathname.startsWith(p));
                        return (
                          <Link
                            key={c.to}
                            to={c.to}
                            className={
                              "px-4 py-1.5 rounded-full font-semibold text-sm transition-colors border flex-shrink-0 " +
                              (active
                                ? "bg-accent text-accent-foreground border-accent"
                                : "bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10")
                            }
                          >
                            {c.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  {/* Right-edge fade indicator (mobile/tablet only) */}
                  <div
                    aria-hidden
                    className="lg:hidden pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-primary to-transparent"
                  />
                </div>

                <div className="hidden md:flex flex-shrink-0 items-center gap-2">
                  <span className="text-xs font-medium text-primary-foreground/60 mr-1">Brand:</span>
                  {config.brands.map((b, i) => {
                    const active = i === selected;
                    return (
                      <button
                        key={b.label}
                        onClick={() => setSelected(i)}
                        className={
                          "px-3 py-1 rounded-full font-semibold text-xs transition-colors border " +
                          (active
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10")
                        }
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex md:hidden justify-center items-center gap-2 flex-wrap mt-3">
                <span className="text-xs font-medium text-primary-foreground/60">Brand:</span>
                {config.brands.map((b, i) => {
                  const active = i === selected;
                  return (
                    <button
                      key={b.label}
                      onClick={() => setSelected(i)}
                      className={
                        "px-3 py-1 rounded-full font-semibold text-xs transition-colors border " +
                        (active
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10")
                      }
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {!config.hideEyebrow && (
                <p className="text-sm font-bold tracking-widest text-accent uppercase mb-3">
                  {config.eyebrow}
                </p>
              )}
              <h2 className="text-3xl md:text-5xl text-center mb-4 font-bold">
                {config.heading}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto text-center">
                {config.subtext}
              </p>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                {lastUpdated
                  ? `Inventory last updated: ${lastUpdated}`
                  : "Updated daily at 2pm ET"}
              </p>
              <div className="flex justify-center gap-3 flex-wrap mt-6 mb-10">
                {config.brands.map((b, i) => {
                  const active = i === selected;
                  return (
                    <button
                      key={b.label}
                      onClick={() => setSelected(i)}
                      className={
                        "px-6 py-2.5 rounded-full font-semibold text-sm transition-colors border " +
                        (active
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-background text-foreground border-border hover:bg-muted")
                      }
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className={config.stickyHeader ? "container mx-auto px-4" : ""}>
          {showFallbackBanner && (
            <div className="max-w-2xl mx-auto mb-6 rounded-md border border-accent/30 bg-accent/10 px-4 py-2 text-center text-sm text-foreground">
              Showing last known inventory. Live data updates daily at 2pm ET.
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 max-w-xl mx-auto">
              <p className="text-muted-foreground mb-6">
                Inventory updates daily at 2pm ET. Check back soon or get in touch.
              </p>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
              >
                <a href="mailto:hello@comebackgoods.com">
                  Get In Contact <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <ProductCard key={`${p.displayBrand}-${p.name}-${i}`} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProgramProductGrid;
