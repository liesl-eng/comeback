import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const savings = product.originalPrice - product.discountedPrice;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-hover">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <Badge variant="accent" className="absolute right-3 top-3 font-bold">
            {product.discountPercentage}% OFF
          </Badge>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${product.id}`}>
          <div className="mb-2">
            <Badge variant="outline" className="mb-2 text-xs">
              {product.category}
            </Badge>
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
        </Link>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              ${product.discountedPrice}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
            <span className="text-lg font-bold text-success">
              {product.discountPercentage}% OFF
            </span>
          </div>
          <div className="mt-1.5">
            <span className="text-xs text-muted-foreground">
              {product.quantity} units available
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="accent"
          className="w-full gap-2"
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart className="h-4 w-4" />
          Request to Order
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
