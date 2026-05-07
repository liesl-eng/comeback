import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, Heart, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRugFavorites, SavedPattern } from "@/contexts/RugFavoritesContext";
import { getAvailability } from "@/lib/rugAvailability";
import {
  SIZE_BUCKETS,
  SizeBucket,
  Collection,
  SubDesign,
  SizeBreakdown,
  useRugInventory,
  rawSizeToBucket,
  PLACEHOLDER_IMG,
} from "@/lib/rugInventory";

const ComingSoon = ({ className }: { className?: string }) => (
  <div className={cn("w-full h-full flex items-center justify-center bg-muted text-muted-foreground", className)}>
    <span className="text-sm font-medium uppercase tracking-wider">Coming Soon</span>
  </div>
);

const isMissingImage = (src: string) => !src || src === PLACEHOLDER_IMG;

/* Re-exports kept for backward compatibility with consumers like RugOrderBuilder. */
export { rawSizeToBucket };
export type { Collection, SubDesign, SizeBreakdown };

const displaySize = (raw: string): string => raw;

const collectionMatchesBucket = (col: Collection, bucket: SizeBucket): boolean => {
  if (bucket === "All Sizes") return true;
  return col.sizeBuckets.includes(bucket);
};

const RugCollections = () => {
  const [activeSize, setActiveSize] = useState<SizeBucket>("All Sizes");
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);
  const { togglePattern, isSaved } = useRugFavorites();
  const { collections, loading, error } = useRugInventory();

  const filtered = collections
    .filter((c) => collectionMatchesBucket(c, activeSize))
    .sort((a, b) => b.totalUnits - a.totalUnits);

  const handleCardClick = (name: string) => {
    setExpandedCollection((prev) => (prev === name ? null : name));
  };

  return (
    <section id="collections" className="pt-6 md:pt-10 pb-6 md:pb-10 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-bold mb-3">Browse Collections</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click a collection to see designs and sizes.
          </p>
        </div>

        {/* Size Guide link */}
        <div className="text-center mb-6">
          <Link to="/size-guide">
            <Button variant="outline" size="default" className="font-semibold text-base px-8 h-11">
              View Size Guide <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Size filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-4xl mx-auto">
          {SIZE_BUCKETS.map((size) => (
            <button
              key={size}
              onClick={() => {
                setActiveSize(size);
                setExpandedCollection(null);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-lg font-medium transition-colors border",
                activeSize === size
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card text-muted-foreground border-border hover:border-accent/50 hover:text-foreground"
              )}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p className="text-sm">Loading latest inventory…</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="max-w-xl mx-auto bg-destructive/5 border border-destructive/30 rounded-lg p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">We couldn't load inventory right now</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please refresh the page in a moment, or contact us for the latest availability.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}

        {/* Collection grid */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {filtered.map((col) => {
              const isExpanded = expandedCollection === col.name;

              return (
                <div
                  key={col.name}
                  className={cn(
                    "transition-all duration-300",
                    isExpanded && "sm:col-span-2 lg:col-span-3"
                  )}
                >
                  <Card
                    className={cn(
                      "overflow-hidden cursor-pointer transition-shadow hover:shadow-md",
                      isExpanded && "ring-2 ring-accent"
                    )}
                    onClick={() => handleCardClick(col.name)}
                  >
                    {!isExpanded && (
                      <div className="h-52 overflow-hidden bg-muted">
                        <img
                          src={col.image}
                          alt={col.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardContent className={cn("p-4", isExpanded ? "pt-4" : "")}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg leading-tight">Collection: {col.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {col.designCount} {col.designCount === 1 ? "pattern" : "patterns"} · In Stock
                          </p>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Expanded sub-design panel */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isExpanded ? "max-h-[2000px] opacity-100 mt-6 mb-6" : "max-h-0 opacity-0"
                    )}
                  >
                    {isExpanded && (
                      <div className="bg-muted/50 border-2 border-accent/30 rounded-xl p-5 md:p-8 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
                          Collection: {col.name} — {col.designCount} {col.designCount === 1 ? "pattern" : "patterns"}
                        </p>
                        {col.subDesigns ? (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...col.subDesigns]
                              .sort((a, b) => b.units - a.units)
                              .map((design) => {
                                const patternId = `${col.name}::${design.name}`;
                                const saved = isSaved(patternId);
                                const patternData: SavedPattern = {
                                  id: patternId,
                                  collectionName: col.name,
                                  designName: design.name,
                                  image: design.image,
                                  sizes: design.sizes.map((s) => ({ size: displaySize(s.size), units: s.units })),
                                };
                                return (
                                  <div
                                    key={design.name}
                                    className="border rounded-lg overflow-hidden bg-background relative"
                                  >
                                    <button
                                      onClick={(e) => { e.stopPropagation(); togglePattern(patternData); }}
                                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors shadow-sm"
                                      aria-label={saved ? `Remove ${design.name} from saved` : `Save ${design.name}`}
                                    >
                                      <Heart className={cn("h-4 w-4 transition-colors", saved ? "text-red-500 fill-red-500" : "text-muted-foreground hover:text-red-400")} />
                                    </button>
                                    <div className="h-40 overflow-hidden bg-muted">
                                      <img
                                        src={design.image}
                                        alt={design.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                      />
                                    </div>
                                    <div className="p-3 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-sm">{design.name}</h4>
                                        <span className="text-xs font-medium text-muted-foreground">
                                          In Stock
                                        </span>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {design.sizes.map((s, idx) => {
                                          const avail = getAvailability(s.units);
                                          return (
                                            <div
                                              key={idx}
                                              className="flex flex-col items-center px-2 py-1 rounded-lg bg-muted text-center min-w-[60px]"
                                            >
                                              <span className="text-sm font-medium text-foreground">{displaySize(s.size)}</span>
                                              <span className={cn("text-xs font-medium", avail.color)}>
                                                {avail.label}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 py-4">
                            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
                              <img
                                src={col.image}
                                alt={col.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">{col.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                In Stock · {col.fallbackNote}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="mt-5 border-t border-accent/20 pt-1" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && (
          <p className="text-center text-sm text-muted-foreground italic mt-8 max-w-xl mx-auto">
            Pricing varies by volume and mix. Request a quote for current availability and rates.
          </p>
        )}
      </div>
    </section>
  );
};

export default RugCollections;
