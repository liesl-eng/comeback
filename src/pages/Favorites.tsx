import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const { addItem, totalItems } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const favoriteProducts = mockProducts.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-accent fill-accent" />
            My Favorites
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {favoriteProducts.length} saved {favoriteProducts.length === 1 ? "item" : "items"}
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start saving products you love by clicking the heart icon.
            </p>
            <Button variant="accent" onClick={() => navigate("/products")} className="gap-2">
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addItem}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
