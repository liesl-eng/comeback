import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Trash2, Plus, CheckCircle2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

// ⚠️ PASTE YOUR RUG ORDER WEBHOOK URL HERE ⚠️
const RUG_ORDER_WEBHOOK_URL = "https://hook.us2.make.com/REPLACE_WITH_YOUR_ORDER_WEBHOOK_URL";

const MOQ = 6000;

/* ─── Size tiers with pricing ─── */
const SIZE_TIERS = [
  { id: "accent", label: "Accent (2×3)", price: 7 },
  { id: "small-medium", label: "Small-Medium (4×5)", price: 12 },
  { id: "runner", label: "Runner (3×10)", price: 20 },
  { id: "stair-tread", label: "Stair Tread", price: 20 },
  { id: "medium", label: "Medium (5×7)", price: 25 },
  { id: "large", label: "Large (8×10)", price: 38 },
  { id: "xl", label: "XL (9×13)", price: 58 },
  { id: "small-round", label: "Small Round (4')", price: 10 },
  { id: "med-round", label: "Med Round (6')", price: 18 },
  { id: "large-round", label: "Large Round (8')", price: 28 },
] as const;

/* ─── Collection → Pattern map (all 15 collections) ─── */
const COLLECTION_PATTERNS: Record<string, string[]> = {
  "Lotus": ["Ripon", "Argonne", "Habra", "Menda", "Shasta", "Pomona", "Tonti", "Towne", "Macon", "Cambria", "Amesti", "Ramon"],
  "Dazzle": ["Disa"],
  "Kings Court": ["Brooklyn Trellis", "Clover", "Kama", "Gene", "Zazzu", "Tabriz Red Traditional", "Florence Brown Traditional", "Warby", "Tabriz Black Traditional"],
  "Madison Shag": ["Cossima", "Piper", "Moroccan Lattice", "Plain", "Cole"],
  "Rodeo": ["Otero", "Virden", "Chindi", "Elaine"],
  "Elle Basics": ["Emerson"],
  "Dorado": ["Mariah", "Loewy", "Devotion", "Neveh", "Audun", "Neema", "Arid", "Cabo"],
  "Money": ["Dollar Front", "Dollar Front 2006A", "Dollar Stacked", "Bitcoin"],
  "Kennedy": ["Triangles", "Stars", "Reeve"],
  "Dulcet": ["Bingo", "Granada", "Aosta", "Trieste"],
  "Zazzle": ["Patras"],
  "Mystic": ["Colette", "Nova", "Maddox", "Zoe"],
  "Apollo": ["Lattice", "Anastasia Moroccan", "Bryn Moroccan"],
  "Brielle": ["Larissa"],
  "Ell Basics": ["Rendezvous", "Intrigue", "Gala"],
};

const COLLECTION_NAMES = Object.keys(COLLECTION_PATTERNS);

interface LineItem {
  id: string;
  collection: string;
  pattern: string;
  sizeTier: string;
  quantity: number;
}

const createLineItem = (): LineItem => ({
  id: crypto.randomUUID(),
  collection: "",
  pattern: "",
  sizeTier: "",
  quantity: 1,
});

const getLineTotal = (item: LineItem): number => {
  const tier = SIZE_TIERS.find((t) => t.id === item.sizeTier);
  return tier ? tier.price * item.quantity : 0;
};

const RugOrderBuilder = () => {
  const [lineItems, setLineItems] = useState<LineItem[]>([createLineItem()]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const orderTotal = lineItems.reduce((sum, item) => sum + getLineTotal(item), 0);
  const totalItems = lineItems.reduce((sum, item) => sum + (item.sizeTier ? item.quantity : 0), 0);
  const moqMet = orderTotal >= MOQ;
  const remaining = MOQ - orderTotal;
  const progress = Math.min((orderTotal / MOQ) * 100, 100);

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...updates };
        // Reset pattern when collection changes
        if (updates.collection && updates.collection !== item.collection) {
          updated.pattern = "";
        }
        return updated;
      })
    );
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addLineItem = () => {
    setLineItems((prev) => [...prev, createLineItem()]);
  };

  const isContactValid = contactForm.companyName.trim() && contactForm.email.trim();

  const handleSubmit = async () => {
    if (!isContactValid || !moqMet) return;
    setIsSubmitting(true);

    const payload = {
      lineItems: lineItems
        .filter((item) => item.collection && item.pattern && item.sizeTier)
        .map((item) => {
          const tier = SIZE_TIERS.find((t) => t.id === item.sizeTier);
          return {
            collection: item.collection,
            pattern: item.pattern,
            size: tier?.label || item.sizeTier,
            quantity: item.quantity,
            unitPrice: tier?.price || 0,
            lineTotal: getLineTotal(item),
          };
        }),
      orderTotal,
      totalItems,
      contact: contactForm,
      timestamp: new Date().toISOString(),
      source: "rug-order-builder",
    };

    try {
      const response = await fetch(RUG_ORDER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 200) {
        setSubmitted(true);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      if (RUG_ORDER_WEBHOOK_URL.includes("REPLACE")) {
        setSubmitted(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="order-builder" className="py-14 md:py-20 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="p-8 md:p-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Order Request Submitted!</h2>
            <p className="text-muted-foreground text-lg">
              We'll review your order and get back to you within 1–2 business days.
            </p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="order-builder" className="py-14 md:py-20 scroll-mt-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-bold mb-3">Build Your Order</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select patterns and sizes from our catalog. $6,000 minimum order.
          </p>
        </div>

        {/* Line Items */}
        <div className="space-y-4 mb-6">
          {lineItems.map((item, index) => (
            <Card key={item.id} className="border border-border/60">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:hidden">
                  <span className="text-sm font-semibold text-muted-foreground">Item {index + 1}</span>
                  {lineItems.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)} className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_80px_90px_40px] gap-3 items-end">
                  {/* Collection */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Collection</Label>
                    <Select value={item.collection} onValueChange={(v) => updateLineItem(item.id, { collection: v })}>
                      <SelectTrigger><SelectValue placeholder="Select collection" /></SelectTrigger>
                      <SelectContent>
                        {COLLECTION_NAMES.map((name) => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pattern */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Pattern</Label>
                    <Select
                      value={item.pattern}
                      onValueChange={(v) => updateLineItem(item.id, { pattern: v })}
                      disabled={!item.collection}
                    >
                      <SelectTrigger><SelectValue placeholder={item.collection ? "Select pattern" : "Pick collection first"} /></SelectTrigger>
                      <SelectContent>
                        {(COLLECTION_PATTERNS[item.collection] || []).map((name) => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size Tier */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Size</Label>
                    <Select value={item.sizeTier} onValueChange={(v) => updateLineItem(item.id, { sizeTier: v })}>
                      <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                      <SelectContent>
                        {SIZE_TIERS.map((tier) => (
                          <SelectItem key={tier.id} value={tier.id}>
                            {tier.label} — ${tier.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Qty</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="text-center"
                    />
                  </div>

                  {/* Line Total */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Total</Label>
                    <div className="h-10 flex items-center justify-end font-semibold text-sm">
                      ${getLineTotal(item).toLocaleString()}
                    </div>
                  </div>

                  {/* Remove */}
                  <div className="hidden md:flex items-end pb-0.5">
                    {lineItems.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)} className="h-10 w-10 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add line */}
        <Button variant="outline" onClick={addLineItem} className="mb-10">
          <Plus className="h-4 w-4 mr-2" /> Add Another Line
        </Button>

        {/* ── Sticky Summary Bar ── */}
        <div className="sticky bottom-0 z-30 -mx-4 px-4">
          <Card className="border-2 border-accent/40 shadow-lg bg-card/95 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Stats */}
                <div className="flex items-center gap-6 flex-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Items</p>
                    <p className="text-xl font-bold">{totalItems} rugs</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Order Total</p>
                    <p className="text-xl font-bold">${orderTotal.toLocaleString()}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex-1 space-y-1.5">
                  <Progress value={progress} className="h-3 bg-muted" />
                  {moqMet ? (
                    <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Minimum met!
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      You need <span className="font-semibold text-foreground">${remaining.toLocaleString()}</span> more to meet the $6,000 minimum
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  size="lg"
                  disabled={!moqMet}
                  onClick={() => setShowSubmitDialog(true)}
                  className={cn(
                    "font-semibold px-6",
                    moqMet
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : ""
                  )}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" /> Submit Order Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Submit Dialog ── */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Order Request</DialogTitle>
            <DialogDescription>
              {totalItems} rugs · ${orderTotal.toLocaleString()} total
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Company Name *</Label>
              <Input
                value={contactForm.companyName}
                onChange={(e) => setContactForm((p) => ({ ...p, companyName: e.target.value }))}
                placeholder="Your company"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Contact Name</Label>
              <Input
                value={contactForm.contactName}
                onChange={(e) => setContactForm((p) => ({ ...p, contactName: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                type="tel"
                value={contactForm.phone}
                onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="(555) 555-5555"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={contactForm.notes}
                onChange={(e) => setContactForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Any special requests or notes..."
                rows={3}
              />
            </div>
            <Button
              className="w-full font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
              disabled={!isContactValid || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting…" : "Submit Order Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default RugOrderBuilder;
