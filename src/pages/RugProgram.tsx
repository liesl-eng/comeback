import { useState } from "react";
import { Helmet } from "react-helmet-async";
import RugProgramNavbar from "@/components/RugProgramNavbar";
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
import { ArrowRight, CheckCircle2, Sparkles, ClipboardList, PackageSearch, CalendarClock, ChevronRight, Lightbulb } from "lucide-react";
import RugCollections from "@/components/RugCollections";
import textureWoven from "@/assets/rugs/texture-woven-hero.jpg";
import meridianBrassShelf from "@/assets/lighting/meridian-brass-shelf.webp";

// ⚠️ PASTE YOUR RUG PROGRAM WEBHOOK URL HERE ⚠️
const WEBHOOK_URL = "https://hook.us2.make.com/REPLACE_WITH_YOUR_WEBHOOK_URL";


const volumeOptions = ["10–25 rugs/mo", "25–50 rugs/mo", "50–100 rugs/mo", "100+ rugs/mo", "Not sure yet"];
const styleOptions = ["Traditional", "Modern", "Bohemian", "Solid/Neutral", "Geometric", "Shag", "Outdoor", "Runner"];

const faqs = [
  {
    q: "What condition are the rugs in?",
    a: "Every rug is inspected by us before shipping.",
  },
  {
    q: "How does pricing work?",
    a: "We have a low MOQ but pricing depends on volume and mix. Most partners see up to 60–70% below wholesale. We'll provide a custom quote based on your volume tier and style preferences.",
  },
  {
    q: "Can I choose specific styles, sizes, or colors?",
    a: "Absolutely. During onboarding, you'll share your preferences and we'll curate shipments to match. Need mostly 5×7 neutrals? Heavy on runners? We build your program around what works for your business.",
  },
  {
    q: "What's the minimum commitment?",
    a: "We ask for a 3-month initial commitment so we can dial in your preferences. After that, you can adjust volume, pause, or cancel with 30 days notice.",
  },
  {
    q: "How often do I receive shipments?",
    a: "Most partners receive monthly shipments, but we can do bi-weekly or quarterly depending on your needs. Flexible scheduling is part of the program.",
  },
  {
    q: "What brands do you carry?",
    a: "We source from a rotating mix of premium home brands. While specific brands vary by availability, everything meets our quality standards and is evaluated by us before we ship. We're happy to share current brand availability during your consultation.",
  },
];

const RugProgram = () => {
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
      <Helmet>
        <title>Comeback Goods Rug Program — Curated Rugs, Big Savings</title>
        <meta name="description" content="Subscription-based rug sourcing from premium brands up to 60% below wholesale. Inspected, ready-to-sell inventory delivered on your schedule." />
        <meta property="og:title" content="Comeback Goods Rug Program — Curated Rugs, Big Savings" />
        <meta property="og:description" content="Subscription-based rug sourcing from premium brands up to 60% below wholesale. Inspected, ready-to-sell inventory delivered on your schedule." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Comeback Goods Rug Program — Curated Rugs, Big Savings" />
        <meta name="twitter:description" content="Subscription-based rug sourcing from premium brands up to 60% below wholesale. Inspected, ready-to-sell inventory delivered on your schedule." />
      </Helmet>
      <RugProgramNavbar onGetQuoteClick={() => scrollTo("get-a-quote")} onSeeRugsClick={() => scrollTo("rug-collections")} />

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

          <div className="relative z-10 mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20 lg:py-28">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-6 bg-[hsl(30_50%_55%)] text-[hsl(210_55%_10%)] text-base font-bold px-6 py-2.5 rounded-full">
                <Sparkles className="h-5 w-5" />
                Comeback Rug Program
              </div>
              <h1 className="mb-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.1] sm:leading-[0.95]">
                <span className="text-[hsl(0_0%_98%)]">Curated Rugs, </span>
                <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-[hsl(43_65%_55%)] to-[hsl(30_50%_65%)] bg-clip-text text-transparent">
                  Big Savings
                </span>
              </h1>
              <p className="mb-10 text-lg md:text-xl text-[hsl(0_0%_98%/0.75)] max-w-2xl mx-auto leading-relaxed">
                Inspected, ready-to-display rug inventory... delivered on your schedule.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(0_0%_98%/0.4)] text-[hsl(0_0%_98%)] bg-transparent hover:bg-[hsl(0_0%_98%/0.1)] hover:text-[hsl(0_0%_98%)] font-medium text-base px-8"
                  onClick={() => scrollTo("how-it-works")}
                >
                  How It Works
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(43_65%_55%/0.6)] text-[hsl(43_65%_55%)] bg-transparent hover:bg-[hsl(43_65%_55%/0.1)] hover:text-[hsl(43_65%_55%)] font-medium text-base px-8"
                  onClick={() => scrollTo("complete-the-room")}
                >
                  <Lightbulb className="h-5 w-5 mr-2" fill="currentColor" />Complete The Room With Lighting <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Hero bullet points */}
              <ul className="flex flex-col gap-3 max-w-xl mx-auto text-left">
                {[
                  ["Premium Rugs, Big Savings", "up to 60% off wholesale."],
                  ["Rugs You Can Count On", "graded and ready for display."],
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
                Reliable, affordable rug inventory — without the sourcing headaches.
              </p>
            </div>
            <p className="text-base md:text-lg font-semibold uppercase tracking-widest text-accent text-center mb-6">Perfect For</p>
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
        <section id="how-it-works" className="pt-14 md:pt-20 pb-0 scroll-mt-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 md:mb-14">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-0 max-w-5xl mx-auto items-stretch">
              {[
                {
                  step: "01",
                  title: "Tell Us What Rugs You Need",
                  desc: "Set your volume, style, and size preferences — we'll curate a program built for your business or project.",
                  Icon: ClipboardList,
                },
                {
                  step: "02",
                  title: "Curated, Ready-to-Display Rug Inventory",
                  desc: "Premium brand rugs, inspected and graded, priced up to 60% below wholesale.",
                  Icon: PackageSearch,
                },
                {
                  step: "03",
                  title: "Predictable & Flexible Delivery",
                  desc: "Receive consistent rug shipments on your schedule — pause, swap, or adjust anytime.",
                  Icon: CalendarClock,
                },
              ].map((s, i) => (
                <div key={s.step} className="flex items-stretch">
                  <Card className="relative text-center p-8 md:p-10 border border-border/60 bg-card/80 backdrop-blur-sm flex-1 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mb-5">
                      <s.Icon className="w-7 h-7 text-accent" />
                    </div>
                    <span className="text-sm font-bold tracking-widest text-accent uppercase mb-3">
                      Step {s.step}
                    </span>
                    <h3 className="text-xl md:text-2xl font-semibold mb-3">{s.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{s.desc}</p>
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

        {/* ── COLLECTIONS ── */}
        <RugCollections />

        {/* ── COMPLETE THE ROOM ── */}
        {/* ── COMPLETE THE ROOM ── */}
        <section id="complete-the-room" className="py-10 md:py-14 bg-muted/30 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-4xl font-bold mb-3">Complete The Room</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pair your rugs with premium lighting
              </p>
            </div>
            <a href="/rechargeable-table-lamps" className="block max-w-3xl mx-auto group">
              <Card className="overflow-hidden transition-shadow hover:shadow-xl">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5 h-56 sm:h-auto overflow-hidden bg-[hsl(30_20%_93%)] shrink-0">
                    <img
                      src={meridianBrassShelf}
                      alt="Ferm Living Meridian Rechargeable Lamps"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="sm:w-3/5 p-6 md:p-8 flex flex-col justify-center space-y-3">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Ferm Living · Featured Product</p>
                    <h3 className="text-xl md:text-2xl font-semibold leading-tight">Meridian Rechargeable Table Lamp</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      Designed by the design studio Regular Company for Ferm Living. The Meridian is a portable, dimmable LED table lamp built around three simple geometric forms — cone, arc, and cylinder. Cordless and rechargeable via USB-C, it delivers up to 12 hours of warm white light per charge. Compact enough for nightstands, shelves, and side tables — ideal for staging, rentals, and hospitality.
                    </p>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-2xl font-bold">$50</span>
                      <span className="text-base text-muted-foreground line-through">$265</span>
                      <Badge variant="accent" className="text-xs">81% off</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Warehouse Direct — New</p>
                    <p className="text-xs text-muted-foreground">4 finishes: Cashmere, Brass, Brushed Steel, Black</p>
                    <p className="text-base font-semibold text-accent group-hover:underline underline-offset-4 pt-1">
                      View Details →
                    </p>
                  </CardContent>
                </div>
              </Card>
            </a>
            <p className="text-center text-sm text-muted-foreground italic mt-8 max-w-xl mx-auto">
              Add lighting to your rug program quote — just mention it in your request.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="pt-6 md:pt-10 pb-14 md:pb-20 bg-muted/30">
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
      </main>

      <footer id="get-a-quote" className="py-12 bg-primary text-primary-foreground scroll-mt-20">
        <div className="container mx-auto px-4 text-center space-y-3">
          <p className="text-xl md:text-2xl font-semibold">
            Get in contact:{" "}
            <a href="mailto:liesl@comebackgoods.com" className="text-accent hover:underline underline-offset-4">
              liesl@comebackgoods.com
            </a>
          </p>
          <p className="text-sm text-primary-foreground/60">
            © 2025 Comeback Goods. Almost Perfect. Always Loved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RugProgram;
