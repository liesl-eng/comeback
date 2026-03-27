import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Heart, Check, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import { usePallet } from "@/contexts/PalletContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const savings = product.originalPrice - product.discountedPrice;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = usePallet();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToPallet = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-hover flex flex-col">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </Link>
        <Badge variant="accent" className="absolute right-2 bottom-2 text-[10px] px-1.5 py-0.5 font-semibold opacity-90">
          {product.discountPercentage}% OFF
        </Badge>
        <span className="absolute right-2 top-3 px-2 py-1 text-xs font-medium rounded bg-white/90 text-muted-foreground backdrop-blur-sm">
          New – Warehouse Direct
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-3 top-3 h-9 w-9 rounded-full bg-background/80 hover:bg-background"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite(product.id)
                ? "fill-accent text-accent"
                : "text-muted-foreground hover:text-accent"
            }`}
          />
        </Button>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${product.id}`}>
          <div className="mb-2">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {product.brand && (
                <Badge variant="secondary" className="text-xs">
                  {product.brand}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[2.5rem]">
              {product.description}
            </p>
          </div>
        </Link>
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(product.discountedPrice)}
            </span>
            <span className="text-sm text-muted-foreground">Each</span>
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-sm font-semibold text-success">
              Save {product.discountPercentage}%
            </span>
          </div>
          <div className="mt-1.5">
            <span className="text-sm text-muted-foreground">
              {product.quantity} units available
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button
          variant={justAdded ? "outline" : "accent"}
          className="w-full gap-2 transition-all"
          onClick={handleAddToPallet}
          disabled={justAdded}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added ✓
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add to Pallet
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          $10,000 order minimum
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
