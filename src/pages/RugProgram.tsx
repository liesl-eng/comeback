import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// ⚠️ PASTE YOUR RUG PROGRAM WEBHOOK URL HERE ⚠️
const WEBHOOK_URL = "https://hook.us2.make.com/REPLACE_WITH_YOUR_WEBHOOK_URL";

const sampleRugs = [
  { name: "Medallion Area Rug 8×10", style: "Traditional", msrp: 899, price: 189, discount: "79% below MSRP" },
  { name: "Abstract Geo Runner 2.5×8", style: "Modern", msrp: 349, price: 79, discount: "77% below MSRP" },
  { name: "Handwoven Jute 5×7", style: "Bohemian", msrp: 599, price: 139, discount: "77% below MSRP" },
  { name: "Solid Shag 6×9", style: "Solid/Neutral", msrp: 479, price: 109, discount: "77% below MSRP" },
  { name: "Indoor/Outdoor Stripe 5×7", style: "Outdoor", msrp: 399, price: 89, discount: "78% below MSRP" },
  { name: "Vintage Distressed 8×10", style: "Traditional", msrp: 749, price: 169, discount: "77% below MSRP" },
];

const rugGradients = [
  "from-amber-800/30 via-amber-600/20 to-amber-900/30",
  "from-slate-600/30 via-slate-400/20 to-slate-700/30",
  "from-yellow-700/30 via-yellow-500/20 to-yellow-800/30",
  "from-stone-500/30 via-stone-300/20 to-stone-600/30",
  "from-teal-700/30 via-teal-500/20 to-teal-800/30",
  "from-rose-800/30 via-rose-600/20 to-rose-900/30",
];

const volumeOptions = ["10–25 rugs/mo", "25–50 rugs/mo", "50–100 rugs/mo", "100+ rugs/mo", "Not sure yet"];
const styleOptions = ["Traditional", "Modern", "Bohemian", "Solid/Neutral", "Geometric", "Shag", "Outdoor", "Runner"];

const faqs = [
  {
    q: "What condition are the rugs in?",
    a: "All rugs are new or like-new from premium brand overstock. These are warehouse-direct items — never used, just excess inventory that brands need to move. Every rug is inspected before shipping.",
  },
  {
    q: "Can I choose specific styles, sizes, or colors?",
    a: "Absolutely. During onboarding, you'll share your preferences and we'll curate shipments to match. Need mostly 5×7 neutrals? Heavy on runners? We build your program around what sells in your business.",
  },
  {
    q: "What's the minimum commitment?",
    a: "We ask for a 3-month initial commitment so we can dial in your preferences. After that, you can adjust volume, pause, or cancel with 30 days notice.",
  },
  {
    q: "How does pricing work?",
    a: "Pricing depends on volume and mix. Most partners see 60–80% below MSRP. We'll provide a custom quote based on your volume tier and style preferences.",
  },
  {
    q: "How often do I receive shipments?",
    a: "Most partners receive monthly shipments, but we can do bi-weekly or quarterly depending on your needs. Flexible scheduling is part of the program.",
  },
  {
    q: "What brands do you carry?",
    a: "We source from a rotating mix of premium home brands. While specific brands vary by availability, everything meets our quality standards. We're happy to share current brand availability during your consultation.",
  },
];

const RugProgram = () => {
  const { totalItems } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    volume: "",
    styles: [] as string[],
    notes: "",
  });

  const toggleStyle = (style: string) => {
    setFormData((prev) => ({
      ...prev,
      styles: prev.styles.includes(style)
        ? prev.styles.filter((s) => s !== style)
        : [...prev.styles, style],
    }));
  };

  const isFormValid = formData.companyName.trim() && formData.email.trim() && formData.businessType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        styles: formData.styles.join(", "),
        timestamp: new Date().toISOString(),
        source: "rug-program",
      };

      const response = await fetch(WEBHOOK_URL, {
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
      console.error("Error submitting quote request:", error);
      // Show success anyway for demo if webhook URL is placeholder
      if (WEBHOOK_URL.includes("REPLACE")) {
        setSubmitted(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="container relative mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-28">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-accent text-accent-foreground border-0 text-sm px-4 py-1.5">
                New Program
              </Badge>
              <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground uppercase tracking-tight leading-tight">
                Rugs on Repeat.
                <br />
                <span className="text-accent">Built for Your Business.</span>
              </h1>
              <p className="mb-8 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Subscription-based rug sourcing from premium brands at 60–80% below MSRP. Consistent inventory, curated to your specs, delivered on schedule.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Button variant="default" size="lg" className="gap-2" onClick={() => scrollTo("quote-form")}>
                  Get a Custom Quote
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  onClick={() => scrollTo("how-it-works")}
                >
                  See How It Works
                </Button>
              </div>

              {/* Trust stats */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                {[
                  ["60–80%", "Below MSRP"],
                  ["New Condition", "Warehouse Direct"],
                  ["Flexible", "Pause Anytime"],
                ].map(([big, small]) => (
                  <div key={big} className="text-center">
                    <p className="text-xl md:text-2xl font-bold text-accent">{big}</p>
                    <p className="text-xs md:text-sm text-primary-foreground/70">{small}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ── */}
        <section className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-4xl font-bold mb-3">Built for Businesses That Move Volume</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our rug program is designed for organizations that need reliable, affordable rug inventory — without the sourcing headaches.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {[
                { icon: "🏪", title: "Boutique Stores", desc: "High-margin inventory your shoppers love" },
                { icon: "🏢", title: "Property Managers", desc: "Turnkey rug supply for unit turnover" },
                { icon: "🏡", title: "Short-Term Rentals", desc: "Refresh listings affordably at scale" },
                { icon: "🎨", title: "Stagers & Designers", desc: "Premium looks without premium cost" },
              ].map((card) => (
                <Card
                  key={card.title}
                  className="text-center p-6 border-2 border-transparent hover:border-accent/50 transition-colors cursor-default"
                >
                  <span className="text-4xl mb-3 block">{card.icon}</span>
                  <h3 className="font-bold text-xl md:text-2xl mb-1">{card.title}</h3>
                  <p className="text-base text-muted-foreground">{card.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-14 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 md:mb-14">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Tell Us What You Need",
                  desc: "Share your volume, style preferences, and size requirements. We'll tailor a program around your business.",
                },
                {
                  step: "02",
                  title: "We Source & Curate",
                  desc: "Our team pulls from premium brand overstock — area rugs, runners, and outdoor styles at 60–80% below MSRP.",
                },
                {
                  step: "03",
                  title: "Recurring Shipments",
                  desc: "Receive consistent, quality-inspected rug inventory on a schedule that works for you. Pause or adjust anytime.",
                },
              ].map((s) => (
                <div key={s.step} className="relative text-center">
                  <span className="text-7xl md:text-8xl font-black text-accent/15 select-none leading-none">
                    {s.step}
                  </span>
                  <h3 className="text-lg font-semibold -mt-4 mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SAMPLE INVENTORY ── */}
        <section className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-4xl font-bold mb-3">Sample Inventory</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Here's a taste of what lands in a typical shipment. Brands, styles, and sizes rotate based on availability.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              {sampleRugs.map((rug, i) => (
                <Card key={rug.name} className="overflow-hidden">
                  <div className={`h-44 bg-gradient-to-br ${rugGradients[i]} flex items-center justify-center`}>
                    <span className="text-4xl opacity-40">🪴</span>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      {rug.style}
                    </p>
                    <h3 className="font-semibold leading-tight">{rug.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold">${rug.price}</span>
                      <span className="text-sm text-muted-foreground line-through">${rug.msrp}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-accent text-accent-foreground border-0 text-xs">
                        {rug.discount}
                      </Badge>
                      <span className="text-xs text-muted-foreground">New — Warehouse Direct</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground italic mt-8 max-w-xl mx-auto">
              Actual inventory varies. Your program is curated to your preferences — these are representative examples.
            </p>
          </div>
        </section>

        {/* ── QUOTE FORM ── */}
        <section id="quote-form" className="py-14 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-bold mb-3">Get Your Custom Quote</h2>
              <p className="text-muted-foreground">
                Tell us about your business and rug needs. We'll put together a program and pricing tailored to you.
              </p>
            </div>

            <Card className="shadow-card">
              <CardContent className="p-6 md:p-8">
                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <CheckCircle2 className="h-16 w-16 mx-auto text-success" />
                    <h3 className="text-2xl font-bold">Request Received!</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      We'll review your details and get back to you within 1–2 business days with a custom program quote.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Row 1 */}
                    <div className="space-y-2">
                      <Label htmlFor="rp-company">Company Name *</Label>
                      <Input
                        id="rp-company"
                        placeholder="Your Company LLC"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                      />
                    </div>

                    {/* Row 2 */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rp-contact">Contact Name</Label>
                        <Input
                          id="rp-contact"
                          placeholder="Jane Doe"
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rp-email">Email *</Label>
                        <Input
                          id="rp-email"
                          type="email"
                          placeholder="jane@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rp-phone">Phone</Label>
                        <Input
                          id="rp-phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rp-biz">Business Type *</Label>
                        <Select
                          value={formData.businessType}
                          onValueChange={(v) => setFormData({ ...formData, businessType: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reseller">Reseller / Goodwill</SelectItem>
                            <SelectItem value="property-management">Property Management</SelectItem>
                            <SelectItem value="short-term-rental">Short-Term Rental</SelectItem>
                            <SelectItem value="stager-designer">Stager / Designer</SelectItem>
                            <SelectItem value="boutique-hotel">Boutique Hotel</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Volume */}
                    <div className="space-y-2">
                      <Label>Estimated Monthly Volume</Label>
                      <div className="flex gap-2 flex-wrap">
                        {volumeOptions.map((v) => (
                          <Button
                            key={v}
                            type="button"
                            size="sm"
                            variant={formData.volume === v ? "default" : "outline"}
                            className={formData.volume === v ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
                            onClick={() => setFormData({ ...formData, volume: v })}
                          >
                            {v}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Style Preferences */}
                    <div className="space-y-2">
                      <Label>Style Preferences</Label>
                      <div className="flex gap-2 flex-wrap">
                        {styleOptions.map((s) => (
                          <Button
                            key={s}
                            type="button"
                            size="sm"
                            variant={formData.styles.includes(s) ? "default" : "outline"}
                            className={formData.styles.includes(s) ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
                            onClick={() => toggleStyle(s)}
                          >
                            {s}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="rp-notes">Anything Else?</Label>
                      <Textarea
                        id="rp-notes"
                        rows={3}
                        placeholder="Tell us about your business, preferred sizes, special requirements…"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!isFormValid || isSubmitting}
                    >
                      {isSubmitting ? "Submitting…" : "Request Custom Quote"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      We'll respond within 1–2 business days. No commitment required.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4 bg-card">
                  <AccordionTrigger className="text-left font-semibold text-base hover:no-underline [&[data-state=open]>svg]:text-accent">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="py-14 md:py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to stop rug shopping and start rug sourcing?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join businesses that trust Comeback Goods for consistent, affordable rug inventory.
            </p>
            <Button
              variant="accent"
              size="lg"
              className="gap-2"
              onClick={() => scrollTo("quote-form")}
            >
              Get Your Custom Quote
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Comeback Goods. Almost Perfect. Always Loved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RugProgram;
