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
import { ArrowRight, CheckCircle2, Sparkles, ClipboardList, PackageSearch, CalendarClock, ChevronRight } from "lucide-react";
import textureWoven from "@/assets/rugs/texture-woven-hero.jpg";
import rugMoroccanBoho from "@/assets/rugs/rug-moroccan-boho.jpg";
import rugPersianBlue from "@/assets/rugs/rug-persian-blue.jpg";
import rugShagGray from "@/assets/rugs/rug-shag-gray.jpg";
import rugJuteDiamond from "@/assets/rugs/rug-jute-diamond.jpg";
import rugAntiquityNavy from "@/assets/rugs/rug-antiquity-navy.jpg";
import rugFloralPersian from "@/assets/rugs/rug-floral-persian.jpg";

// ⚠️ PASTE YOUR RUG PROGRAM WEBHOOK URL HERE ⚠️
const WEBHOOK_URL = "https://hook.us2.make.com/REPLACE_WITH_YOUR_WEBHOOK_URL";

const sampleRugs = [
  { name: "Moroccan Boho Vintage Diamond 8×10", style: "Bohemian", brand: "JONATHAN Y", msrp: 359, price: 108, discount: "70% below MSRP", image: rugMoroccanBoho },
  { name: "Buttercup Diamond Persian 7×10", style: "Traditional", brand: "Threshold", msrp: 200, price: 60, discount: "70% below MSRP", image: rugPersianBlue },
  { name: "Solid Eyelash Shag 5×7", style: "Solid/Shag", brand: "Threshold", msrp: 100, price: 30, discount: "70% below MSRP", image: rugShagGray },
  { name: "Jute Diamond Area Rug 5×7", style: "Natural", brand: "Threshold", msrp: 100, price: 30, discount: "70% below MSRP", image: rugJuteDiamond },
  { name: "Antiquity Hand Tufted 8×10", style: "Traditional", brand: "Safavieh", msrp: 713, price: 214, discount: "70% below MSRP", image: rugAntiquityNavy },
  { name: "Floral Persian Area Rug 7×10", style: "Traditional", brand: "Threshold", msrp: 200, price: 60, discount: "70% below MSRP", image: rugFloralPersian },
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
        <section className="relative overflow-hidden" style={{ background: 'var(--gradient-rug-hero)' }}>
          {/* Woven texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.07] mix-blend-luminosity"
            style={{ backgroundImage: `url(${textureWoven})`, backgroundSize: '400px', backgroundRepeat: 'repeat' }}
          />
          {/* Warm gradient accent glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[hsl(30_50%_55%/0.08)]" />

          <div className="relative z-10 mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 lg:py-36">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-6 bg-[hsl(30_50%_55%)] text-[hsl(210_55%_10%)] text-sm font-semibold px-4 py-1.5 rounded-full">
                <Sparkles className="h-4 w-4" />
                Subscription Program
              </div>
              <h1 className="mb-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]">
                <span className="text-[hsl(0_0%_98%)]">Curated Rugs, </span>
                <span className="bg-gradient-to-r from-[hsl(43_65%_55%)] to-[hsl(30_50%_65%)] bg-clip-text text-transparent">
                  Big Savings
                </span>
              </h1>
              <p className="mb-10 text-lg md:text-xl text-[hsl(0_0%_98%/0.75)] max-w-2xl mx-auto leading-relaxed">
                Inspected, ready-to-sell rug inventory delivered on your schedule.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(0_0%_98%/0.4)] text-[hsl(0_0%_98%)] bg-transparent hover:bg-[hsl(0_0%_98%/0.1)] hover:text-[hsl(0_0%_98%)] font-medium text-base px-8"
                  onClick={() => scrollTo("how-it-works")}
                >
                  See How It Works
                </Button>
              </div>

              {/* Hero bullet points */}
              <ul className="flex flex-col gap-3 max-w-xl mx-auto text-left">
                {[
                  ["Premium Rugs, Big Savings", "curated rugs up to 80% off retail."],
                  ["Rugs You Can Count On", "inspected, graded, and ready to display."],
                  ["Your Lot, Your Rules", "monthly or quarterly, swap, pause, or adjust anytime."],
                ].map(([label, desc]) => (
                  <li key={label} className="flex items-start gap-3 text-[hsl(0_0%_98%/0.85)] text-base md:text-lg">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-[hsl(43_65%_55%)]" />
                    <span><span className="font-bold text-[hsl(0_0%_98%)] whitespace-nowrap">{label}</span> — {desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ── */}
        <section className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-4xl font-bold mb-3">Stretch Your Budget, Not Your Standards.</h2>
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
            <div className="grid md:grid-cols-3 gap-0 max-w-5xl mx-auto items-stretch">
              {[
                {
                  step: "01",
                  title: "Tell Us What You Need",
                  desc: "Set your volume, style, and size preferences — we'll curate a program built for your business or project.",
                  Icon: ClipboardList,
                },
                {
                  step: "02",
                  title: "Curated, Ready-to-Use Inventory",
                  desc: "Premium brand rugs, inspected and graded, priced 60–80% below retail.",
                  Icon: PackageSearch,
                },
                {
                  step: "03",
                  title: "Predictable & Flexible Delivery",
                  desc: "Receive consistent shipments on your schedule — pause, swap, or adjust anytime.",
                  Icon: CalendarClock,
                },
              ].map((s, i) => (
                <div key={s.step} className="flex items-stretch">
                  <Card className="relative text-center p-6 md:p-8 border border-border/60 bg-card/80 backdrop-blur-sm flex-1 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mb-4">
                      <s.Icon className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-accent uppercase mb-3">
                      Step {s.step}
                    </span>
                    <h3 className="text-lg font-semibold mb-3">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </Card>
                  {i < 2 && (
                    <div className="hidden md:flex items-center justify-center px-2">
                      <ChevronRight className="w-5 h-5 text-accent/60" />
                    </div>
                  )}
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
              {sampleRugs.map((rug) => (
                <Card key={rug.name} className="overflow-hidden">
                  <div className="h-44 overflow-hidden">
                    <img src={rug.image} alt={rug.name} className="w-full h-full object-cover" />
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
