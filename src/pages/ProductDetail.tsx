import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { mockProducts } from "@/data/mockProducts";
import { usePallet } from "@/contexts/PalletContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Minus, Plus, Heart, Check } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, totalItems } = usePallet();
  const { isFavorite, toggleFavorite } = useFavorites();
  const product = mockProducts.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToPallet = () => {
    addItem(product, quantity);
    setJustAdded(true);
    toast.success(
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Added {quantity} unit{quantity !== 1 ? "s" : ""} to your pallet!</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/products")}
            className="flex-1"
          >
            Continue Browsing
          </Button>
          <Button
            size="sm"
            variant="highlight"
            onClick={() => navigate("/pallet")}
            className="flex-1"
          >
            View Pallet
          </Button>
        </div>
      </div>,
      { duration: 5000 }
    );
    setTimeout(() => {
      setJustAdded(false);
      setQuantity(1);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-4 md:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/products")}
            className="gap-2 mb-3 md:mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            View The Catalog
          </Button>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{product.name}</h1>
            {product.brand && (
              <Badge variant="secondary" className="text-xs md:text-sm">
                {product.brand}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs md:text-sm">
              {product.category}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <Badge variant="accent" className="absolute right-4 top-4 text-lg font-bold px-4 py-2">
                {product.discountPercentage}% OFF
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-4 h-10 w-10 rounded-full bg-background/80 hover:bg-background"
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart
                  className={`h-6 w-6 transition-colors ${
                    isFavorite(product.id)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground hover:text-accent"
                  }`}
                />
              </Button>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Product Description</h2>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                {product.conditionDetails && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Condition Details</h3>
                    <p className="text-sm text-muted-foreground">{product.conditionDetails}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {product.brand && (
                    <div>
                      <p className="text-xs text-muted-foreground">Brand</p>
                      <p className="font-semibold">{product.brand}</p>
                    </div>
                  )}
                  {product.sku && (
                    <div>
                      <p className="text-xs text-muted-foreground">SKU</p>
                      <p className="font-semibold">{product.sku}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Condition</p>
                    <Badge variant="secondary" className="capitalize mt-1 text-base font-bold px-4 py-1.5">
                      {product.condition.replace("-", " ")}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Available</p>
                    <Badge variant="success" className="mt-1 text-base font-bold px-4 py-1.5">
                      <Package className="h-5 w-5 mr-1.5" />
                      {product.quantity} units
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Add to Pallet</h2>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Unit Price</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-accent">
                        {formatPrice(product.discountedPrice)}
                      </span>
                      <span className="text-xl text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-3 block">Quantity:</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <span className="text-2xl font-bold min-w-[4ch] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-3xl font-bold text-accent">
                        {formatPrice(quantity * product.discountedPrice)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant={justAdded ? "outline" : "accent"}
                    size="lg"
                    className="w-full gap-2 text-lg h-14 transition-all"
                    onClick={handleAddToPallet}
                    disabled={justAdded}
                  >
                    {justAdded ? (
                      <>
                        <Check className="h-5 w-5" />
                        Added to Pallet ✓
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        Add to Pallet
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    $10,000 order minimum
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
