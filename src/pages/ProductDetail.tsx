import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Package, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { WholesaleOption } from "@/types/product";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();
  
  const product = mockProducts.find((p) => p.id === id);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

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

  const updateQuantity = (optionType: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[optionType] || 0;
      const newValue = Math.max(0, current + delta);
      return { ...prev, [optionType]: newValue };
    });
  };

  const handleAddToCart = (option: WholesaleOption) => {
    const qty = quantities[option.type] || option.moq;
    if (qty < option.moq) {
      toast.error(`Minimum order quantity is ${option.moq} units`);
      return;
    }

    // Add items to cart based on quantity
    for (let i = 0; i < qty; i++) {
      addItem(product);
    }

    toast.success(
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Added {qty} units to order request!</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/products")}
            className="flex-1"
          >
            Continue Shopping
          </Button>
          <Button
            size="sm"
            variant="accent"
            onClick={() => navigate("/cart")}
            className="flex-1"
          >
            View Cart
          </Button>
        </div>
      </div>,
      { duration: 5000 }
    );

    setQuantities(prev => ({ ...prev, [option.type]: option.moq }));
  };

  const getPurchaseTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1) + 's';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/products")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Catalog
          </Button>
          
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            <Badge variant="outline" className="text-sm">
              {product.category}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Section */}
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

          {/* Wholesale Ordering Section */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Wholesale Ordering</h2>
                
                <div className="space-y-6">
                  {/* Price Display */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Unit Price</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-accent">
                        ${product.discountedPrice}
                      </span>
                      <span className="text-xl text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div>
                    <label className="text-sm font-semibold mb-3 block">Quantity:</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => {
                          const currentQty = quantities['default'] || 1;
                          setQuantities(prev => ({ ...prev, default: Math.max(1, currentQty - 1) }));
                        }}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <span className="text-2xl font-bold min-w-[4ch] text-center">
                        {quantities['default'] || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={() => {
                          const currentQty = quantities['default'] || 1;
                          setQuantities(prev => ({ ...prev, default: currentQty + 1 }));
                        }}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Total Display */}
                  <div className="pt-4 border-t">
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-3xl font-bold text-accent">
                        ${((quantities['default'] || 1) * product.discountedPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Button */}
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full gap-2 text-lg h-14"
                    onClick={() => {
                      const qty = quantities['default'] || 1;
                      for (let i = 0; i < qty; i++) {
                        addItem(product);
                      }
                      toast.success(
                        <div className="flex flex-col gap-2">
                          <p className="font-semibold">Added {qty} units to order request!</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate("/products")}
                              className="flex-1"
                            >
                              Continue Shopping
                            </Button>
                            <Button
                              size="sm"
                              variant="accent"
                              onClick={() => navigate("/cart")}
                              className="flex-1"
                            >
                              View Cart
                            </Button>
                          </div>
                        </div>,
                        { duration: 5000 }
                      );
                      setQuantities(prev => ({ ...prev, default: 1 }));
                    }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Request to Order
                  </Button>

                  {/* Optional Minimum Order Note */}
                  <p className="text-sm text-muted-foreground text-center">
                    $2,000 minimum per brand (Arhaus, Mercana, etc.)
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
