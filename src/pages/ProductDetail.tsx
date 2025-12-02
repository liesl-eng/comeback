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

          {/* Wholesale Ordering Table */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Wholesale Ordering</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold text-sm">Purchase Type</th>
                        <th className="text-left py-3 px-2 font-semibold text-sm">Unit Details</th>
                        <th className="text-left py-3 px-2 font-semibold text-sm">Price/Unit</th>
                        <th className="text-left py-3 px-2 font-semibold text-sm">MOQ</th>
                        <th className="text-center py-3 px-2 font-semibold text-sm">Quantity</th>
                        <th className="text-center py-3 px-2 font-semibold text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.wholesaleOptions?.map((option) => {
                        const qty = quantities[option.type] || option.moq;
                        return (
                          <tr key={option.type} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-4 px-2">
                              <span className="font-semibold capitalize">
                                {getPurchaseTypeLabel(option.type)}
                              </span>
                            </td>
                            <td className="py-4 px-2 text-sm text-muted-foreground">
                              {option.unitsPerPurchase === 1 
                                ? '1 unit'
                                : `${option.unitsPerPurchase} units/${option.type}`
                              }
                            </td>
                            <td className="py-4 px-2">
                              <div className="flex flex-col gap-1">
                                <span className="text-lg font-bold text-accent">
                                  ${option.pricePerUnit}
                                </span>
                                <span className="text-xs text-muted-foreground line-through">
                                  ${option.originalPricePerUnit}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <Badge variant="outline" className="text-xs">
                                {option.moq}
                              </Badge>
                            </td>
                            <td className="py-4 px-2">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(option.type, -option.unitsPerPurchase)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-semibold min-w-[3ch] text-center">
                                  {qty}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(option.type, option.unitsPerPurchase)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <Button
                                variant="accent"
                                size="sm"
                                className="w-full gap-1"
                                onClick={() => handleAddToCart(option)}
                              >
                                <ShoppingCart className="h-4 w-4" />
                                Add
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                      
                      {/* Fallback if no wholesale options */}
                      {(!product.wholesaleOptions || product.wholesaleOptions.length === 0) && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">
                            <div className="space-y-4">
                              <p>Standard pricing available</p>
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-3xl font-bold text-accent">
                                    ${product.discountedPrice}
                                  </span>
                                  <span className="text-lg text-muted-foreground line-through">
                                    ${product.originalPrice}
                                  </span>
                                </div>
                                <Button
                                  variant="accent"
                                  size="lg"
                                  className="gap-2"
                                  onClick={() => {
                                    addItem(product);
                                    toast.success(
                                      <div className="flex flex-col gap-2">
                                        <p className="font-semibold">Item added to order request!</p>
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
                                  }}
                                >
                                  <ShoppingCart className="h-5 w-5" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {product.wholesaleOptions && product.wholesaleOptions.length > 0 && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Larger quantities offer better per-unit pricing. 
                      All orders must meet minimum order quantities (MOQ).
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
