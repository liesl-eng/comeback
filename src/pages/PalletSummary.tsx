import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { usePallet } from "@/contexts/PalletContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ArrowLeft, ArrowRight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice, formatPriceFixed } from "@/lib/utils";
import { toast } from "sonner";

const MINIMUM_ORDER = 10000;

const PalletSummary = () => {
  const { items, totalItems, totalPrice, amountToMinimum, isMinimumMet, removeItem, clearPallet } = usePallet();
  const navigate = useNavigate();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    deliveryAddress: "",
    notes: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const progressPercent = Math.min(100, (totalPrice / MINIMUM_ORDER) * 100);

  const palletSummaryText = items
    .map((item) => `${item.product.name} (SKU: ${item.product.sku || item.product.id}) x${item.quantity} — ${formatPrice(item.product.discountedPrice * item.quantity)}`)
    .join("\n");

  const handleSubmitQuote = async () => {
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        companyName: formData.companyName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        businessType: formData.businessType,
        deliveryAddress: formData.deliveryAddress,
        notes: formData.notes,
        cartItems: items.map((item) => ({
          name: item.product.name,
          sku: item.product.sku || item.product.id,
          quantity: item.quantity,
          price: item.product.discountedPrice,
          type: "pallet-build",
        })),
        itemCount: totalItems,
        orderTotal: totalPrice,
        palletSummary: palletSummaryText,
      };

      const response = await fetch("https://hook.us2.make.com/vldq5e2wbokwokg4kwqiysmvjh1rjng6", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      if (result === "Accepted") {
        toast.success("Quote request submitted! We'll contact you within 24 hours.");
        clearPallet();
        setShowQuoteForm(false);
        navigate("/products");
      } else {
        throw new Error(result || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast.error("Failed to submit quote request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your pallet is empty</h1>
          <p className="text-muted-foreground mb-6">Browse products and start building your pallet.</p>
          <Button variant="accent" onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const totalSavings = items.reduce(
    (sum, item) => sum + (item.product.originalPrice - item.product.discountedPrice) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:py-8">
        <Button variant="ghost" onClick={() => navigate("/products")} className="mb-4 gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Continue Browsing
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <Package className="h-7 w-7 text-highlight" />
          <h1 className="text-2xl md:text-3xl font-bold">Your Pallet</h1>
          <Badge variant="secondary" className="text-sm">{totalItems} items</Badge>
        </div>

        {/* Items Table */}
        <Card className="mb-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">SKU</TableHead>
                  <TableHead className="hidden md:table-cell">Condition</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Line Total</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.product.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded overflow-hidden bg-muted">
                        <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{item.product.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{item.product.sku || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {item.product.condition.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatPrice(item.product.discountedPrice)}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatPrice(item.product.discountedPrice * item.quantity)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Order Progress</h2>
              <div>
                <Progress
                  value={progressPercent}
                  className={`h-3 ${isMinimumMet ? "[&>div]:bg-success" : "[&>div]:bg-highlight"}`}
                />
                <p className={`text-sm mt-2 ${isMinimumMet ? "text-success font-semibold" : "text-muted-foreground"}`}>
                  {isMinimumMet
                    ? "✓ Ready to quote!"
                    : `${formatPrice(amountToMinimum)} more to reach $10,000 minimum`}
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatPriceFixed(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Savings</span>
                  <span className="font-semibold text-success">-{formatPriceFixed(totalSavings)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1 gap-2" onClick={() => navigate("/products")}>
                Continue Browsing
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant={isMinimumMet ? "highlight" : "outline"}
                className="flex-1 gap-2"
                disabled={!isMinimumMet}
                onClick={() => setShowQuoteForm(true)}
              >
                Request Quote
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Quote Form Dialog */}
      <Dialog open={showQuoteForm} onOpenChange={setShowQuoteForm}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request a Quote</DialogTitle>
            <DialogDescription>
              Fill in your details and we'll send you a quote within 24 hours.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" placeholder="Your Company LLC" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input id="contactName" placeholder="John Doe" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="john@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                <SelectTrigger><SelectValue placeholder="Select business type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="property-manager">Property Manager / STR Operator</SelectItem>
                  <SelectItem value="hotel">Boutique Hotel / Corporate Housing</SelectItem>
                  <SelectItem value="stager-designer">Stager / Designer</SelectItem>
                  <SelectItem value="retailer">Boutique Retailer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Textarea id="deliveryAddress" placeholder="123 Main St, City, State, ZIP" value={formData.deliveryAddress} onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Any special requests?" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
            </div>

            {/* Pallet Summary Preview */}
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">Pallet Summary ({totalItems} items)</p>
              <p className="text-xs text-muted-foreground whitespace-pre-line max-h-32 overflow-y-auto">{palletSummaryText}</p>
              <p className="text-sm font-bold mt-2">Total: {formatPriceFixed(totalPrice)}</p>
            </div>

            <Button className="w-full" variant="highlight" onClick={handleSubmitQuote} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Quote Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PalletSummary;
