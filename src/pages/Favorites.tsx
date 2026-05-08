import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { comebackPrice, isBuyerVisible, formatComebackPrice } from "@/lib/pricing";

interface Product {
  id: string;
  name: string;
  brand: string;
  image_url: string | null;
  price: number | null;
  msrp: number | null;
  units_available: number;
}

const Favorites = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (favorites.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("products")
        .select("id,name,brand,image_url,price,msrp,units_available")
        .in("id", favorites);
      setItems((data ?? []).filter(isBuyerVisible));
      setLoading(false);
    })();
  }, [favorites]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-accent fill-accent" />
            My Favorites
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {items.length} saved {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start saving products you love by clicking the heart icon.
            </p>
            <Button variant="accent" onClick={() => navigate("/catalog")} className="gap-2">
              Browse Catalog
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <div key={p.id} className="border rounded-lg overflow-hidden bg-card">
                <div className="aspect-square bg-muted">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground uppercase">
                      Image Coming Soon
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-xs text-muted-foreground">{p.brand}</div>
                  <div className="font-medium leading-tight line-clamp-2">{p.name}</div>
                  <div className="font-bold mt-1 flex items-baseline gap-2">
                    <span className="text-xs text-muted-foreground font-normal">Price</span>
                    {formatComebackPrice(comebackPrice(p.msrp, p.price))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
