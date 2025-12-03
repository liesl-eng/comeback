import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toast.success("Order placed successfully! (Demo mode)");
    clearCart();
    navigate("/products");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemCount={totalItems} />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Start adding some great deals to your cart!
          </p>
          <Button variant="accent" onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const totalSavings = items.reduce(
    (sum, item) =>
      sum + (item.product.originalPrice - item.product.discountedPrice) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="mb-4 md:mb-6 gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
              <Button variant="ghost" onClick={clearCart} className="gap-2 self-start sm:self-auto">
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </Button>
            </div>

            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex gap-3 md:gap-4">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-base md:text-lg line-clamp-1">
                            {item.product.name}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {item.product.supplier.name}
                          </p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {item.product.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 md:mt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg md:text-xl font-bold">
                            {formatPrice(item.product.discountedPrice)}
                          </span>
                          <span className="text-xs md:text-sm text-muted-foreground line-through">
                            {formatPrice(item.product.originalPrice)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20 md:top-24">
              <CardContent className="p-4 md:p-6 space-y-4">
                <h2 className="text-lg md:text-xl font-bold">Order Summary</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items ({totalItems})</span>
                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Savings</span>
                    <span className="font-semibold text-success">-{formatPrice(totalSavings)}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <Badge variant="success" className="w-full justify-center py-2">
                  You're saving {formatPrice(totalSavings)} on this order!
                </Badge>
              </CardContent>
              
              <CardFooter className="p-4 md:p-6 pt-0">
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="w-full"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
