import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { useRugFavorites } from "@/contexts/RugFavoritesContext";
import { cn } from "@/lib/utils";

const SavedPatternsDrawer = () => {
  const { savedPatterns, totalSaved, togglePattern, clearAll } = useRugFavorites();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative md:h-10 md:px-3">
          <Heart
            className={cn(
              "h-5 w-5",
              totalSaved > 0 ? "text-red-500 fill-red-500" : "text-muted-foreground"
            )}
          />
          {totalSaved > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalSaved}
            </span>
          )}
          <span className="sr-only">Saved Patterns</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            Saved Patterns ({totalSaved})
          </SheetTitle>
        </SheetHeader>

        {totalSaved === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm">No saved patterns yet.</p>
            <p className="text-muted-foreground text-xs mt-1">
              Browse collections and tap the heart icon to save patterns.
            </p>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {savedPatterns.map((pattern) => (
              <div
                key={pattern.id}
                className="flex gap-3 border rounded-lg p-3 bg-card"
              >
                <div className="h-20 w-20 shrink-0 rounded-md overflow-hidden bg-muted">
                  <img
                    src={pattern.image}
                    alt={pattern.designName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-semibold text-sm truncate">{pattern.designName}</h4>
                  <p className="text-xs text-muted-foreground">Collection: {pattern.collectionName}</p>
                  <div className="flex flex-wrap gap-1">
                    {pattern.sizes.map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium"
                      >
                        {s.size}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => togglePattern(pattern)}
                  className="shrink-0 self-start p-1 text-red-400 hover:text-red-600 transition-colors"
                  aria-label={`Remove ${pattern.designName}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="w-full mt-2 text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SavedPatternsDrawer;
