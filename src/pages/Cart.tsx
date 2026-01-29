import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// ⚠️ PASTE YOUR GOOGLE SHEET WEBHOOK URL HERE ⚠️
const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbytxlbCL9kMy_ocw6ARCGjfZ-TlTrL29n-oJ_Q1Ib4AuTfhWCG87t0cLD4K8qxhpM8S/exec";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    deliveryAddress: "",
    notes: "",
  });

  const handleSubmitOrder = async () => {
    // Validate required fields
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const totalSavings = items.reduce(
        (sum, item) => sum + (item.product.originalPrice - item.product.discountedPrice) * item.quantity,
        0,
      );

      // Format cart items for Google Sheet
      const cartItems = items.map((item) => ({
        name: item.product.name,
        sku: item.product.id,
        quantity: item.quantity,
        price: item.product.discountedPrice,
      }));

      // Send to Google Sheet
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          businessType: formData.businessType,
          deliveryAddress: formData.deliveryAddress,
          notes: formData.notes,
          cartItems: JSON.stringify(cartItems),
          itemCount: totalItems,
          orderTotal: totalPrice,
          totalSavings: totalSavings,
        }),
      });
      const result = await response.text();

      if (result === "Accepted") {
        toast.success("Order request submitted! We'll contact you within 24 hours.");
        clearCart();
        setShowOrderForm(false);
        setFormData({
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          businessType: "",
          deliveryAddress: "",
          notes: "",
        });
        navigate("/products");
      } else {
        throw new Error(result || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartItemCount={totalItems} />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Start adding some great deals to your cart!</p>
          <Button variant="accent" onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const totalSavings = items.reduce(
    (sum, item) => sum + (item.product.originalPrice - item.product.discountedPrice) * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />

      <main className="container mx-auto px-4 py-6 md:py-8">
        <Button variant="ghost" onClick={() => navigate("/products")} className="mb-4 md:mb-6 gap-2 -ml-2">
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
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-base md:text-lg line-clamp-1">{item.product.name}</h3>
                          <p className="text-xs md:text-sm text-muted-foreground">{item.product.supplier.name}</p>
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
                          <span className="w-10 text-center font-semibold">{item.quantity}</span>
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
                <Button variant="accent" size="lg" className="w-full" onClick={() => setShowOrderForm(true)}>
                  Submit Order Request
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Order Request Form Modal */}
      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Order Request</DialogTitle>
            <DialogDescription>
              Fill in your business details and we'll contact you within 24 hours with pricing and availability.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="Your Company LLC"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                placeholder="John Doe"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => setFormData({ ...formData, businessType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retailer">Retailer</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                  <SelectItem value="interior-designer">Interior Designer</SelectItem>
                  <SelectItem value="home-stager">Home Stager</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Textarea
                id="deliveryAddress"
                placeholder="123 Main St, City, State, ZIP"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special requests or questions?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowOrderForm(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="accent" onClick={handleSubmitOrder} className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
