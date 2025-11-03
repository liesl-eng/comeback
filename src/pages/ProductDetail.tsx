import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, CheckCircle2, Package, Star } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();
  
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemCount={totalItems} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const savings = product.originalPrice - product.discountedPrice;

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <Badge variant="accent" className="absolute right-4 top-4 text-lg font-bold px-4 py-2">
              {product.discountPercentage}% OFF
            </Badge>
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">
                Last Season
              </p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-foreground">
                ${product.discountedPrice}
              </span>
              <span className="text-xl text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-base px-4 py-1">
                Save ${savings} ({product.discountPercentage}%)
              </Badge>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Condition</span>
                  <Badge variant="secondary" className="capitalize">
                    {product.condition.replace("-", " ")}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">In Stock</span>
                  <Badge variant="success">
                    <Package className="h-3 w-3 mr-1" />
                    {product.quantity} units
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Supplier</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{product.supplier.name}</span>
                    {product.supplier.verified && (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold">{product.supplier.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="accent"
                size="lg"
                className="flex-1 gap-2"
                onClick={() => addItem(product)}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  addItem(product);
                  navigate("/cart");
                }}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
