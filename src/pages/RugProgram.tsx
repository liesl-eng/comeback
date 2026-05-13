import { useState, useEffect, useRef, useCallback } from "react";

import { Helmet } from "react-helmet-async";
import RugProgramNavbar from "@/components/RugProgramNavbar";
import { RugFavoritesProvider, useRugFavorites } from "@/contexts/RugFavoritesContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { ArrowRight, CheckCircle2, Sparkles, ClipboardList, PackageSearch, CalendarClock, ChevronRight, ShoppingCart } from "lucide-react";
import RugCollections from "@/components/RugCollections";
import RugOrderBuilder from "@/components/RugOrderBuilder";
import textureWoven from "@/assets/rugs/texture-woven-hero.jpg";

// ⚠️ PASTE YOUR RUG PROGRAM WEBHOOK URL HERE ⚠️
const WEBHOOK_URL = "https://hook.us2.make.com/REPLACE_WITH_YOUR_WEBHOOK_URL";

// ⚠️ PASTE YOUR EMAIL CAPTURE WEBHOOK URL HERE ⚠️
const EMAIL_CAPTURE_WEBHOOK_URL = "https://hook.us2.make.com/REPLACE_WITH_YOUR_EMAIL_CAPTURE_WEBHOOK_URL";

const businessTypeOptions = [
  "Reseller/Thrift",
  "Property Management",
  "Short-Term Rental",
  "Stager/Designer",
  "Boutique Hotel",
  "Other",
];

const EmailCaptureSection = () => {
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      await fetch(EMAIL_CAPTURE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          businessType: businessType || null,
          timestamp: new Date().toISOString(),
          source: "rug-program-email-capture",
        }),
      });
    } catch (err) {
      console.error("Email capture submit failed:", err);
    } finally {
      setDone(true);
      setSubmitting(false);
    }
  };

  return (
    <section className="py-8 md:py-12 bg-accent/10 border-y border-accent/20">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-3">Interested? Let's Talk Rugs.</h2>
        <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-xl mx-auto">
          Drop your email and we'll reach out with pricing, availability, and a program tailored to your business.
        </p>
        {done ? (
          <div className="inline-flex items-center gap-2 text-lg md:text-xl font-semibold text-foreground">
            <CheckCircle2 className="h-6 w-6 text-accent" />
            Thanks! We'll be in touch shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
            <Input
              type="email"
              required
              placeholder="you@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              className="flex-1 h-11 bg-background"
            />
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger className="md:w-56 h-11 bg-background">
                <SelectValue placeholder="Business type (optional)" />
              </SelectTrigger>
              <SelectContent>
                {businessTypeOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-6"
            >
              {submitting ? "Sending..." : "Get in Touch"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};


const volumeOptions = ["10–25 rugs/mo", "25–50 rugs/mo", "50–100 rugs/mo", "100+ rugs/mo", "Not sure yet"];
const styleOptions = ["Traditional", "Modern", "Bohemian", "Solid/Neutral", "Geometric", "Shag", "Outdoor", "Runner"];

const faqs = [
  {
    q: "What condition are the rugs in?",
    a: "All rugs are in new or like-new condition. Every rug is inspected by us before shipping.",
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

const RugProgramInner = () => {
  const [submitted, setSubmitted] = useState(false);
  const { savedSummary, totalSaved } = useRugFavorites();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasPushedState = useRef(false);

  // Push a history state when user scrolls past the hero, so back button scrolls to top first
  useEffect(() => {
    const handleScroll = () => {
      const pastHero = window.scrollY > 200;
      if (pastHero && !hasPushedState.current) {
        window.history.pushState({ rugScrolled: true }, "");
        hasPushedState.current = true;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.rugScrolled || hasPushedState.current) {
        // They pressed back while scrolled down — scroll to top instead of navigating away
        if (window.scrollY > 50) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          hasPushedState.current = false;
        }
        // If already at top, allow normal back navigation (don't prevent it)
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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
      <RugProgramNavbar onGetQuoteClick={() => scrollTo("get-a-quote")} />

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

          <div className="relative z-10 mx-auto px-6 md:px-12 lg:px-20 pt-6 pb-4 md:pt-10 md:pb-8 lg:pt-14 lg:pb-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-4 bg-[hsl(30_50%_55%)] text-[hsl(210_55%_10%)] text-base font-bold px-6 py-2.5 rounded-full">
                <Sparkles className="h-5 w-5" />
                Comeback Rug Program
              </div>
              <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.1] sm:leading-[0.95]">
                <span className="text-[hsl(0_0%_98%)]">Curated Rugs, </span>
                <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-[hsl(43_65%_55%)] to-[hsl(30_50%_65%)] bg-clip-text text-transparent">
                  Big Savings
                </span>
              </h1>
              <p className="mb-6 text-lg md:text-xl text-[hsl(0_0%_98%/0.75)] max-w-2xl mx-auto leading-relaxed">
                Inspected, ready-to-display rug inventory... delivered on your schedule.
              </p>
              {/* Hero CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Button
                  size="lg"
                  onClick={() => scrollTo("collections")}
                  className="bg-[hsl(43_65%_55%)] text-[hsl(210_55%_10%)] hover:bg-[hsl(43_65%_50%)] font-semibold text-base px-8"
                >
                  See Current Rugs <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => scrollTo("order-builder")}
                  variant="outline"
                  className="border-[hsl(43_65%_55%)] text-[hsl(43_65%_55%)] bg-transparent hover:bg-[hsl(43_65%_55%/0.1)] font-semibold text-base px-8"
                >
                  Build Your Order <ShoppingCart className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(0_0%_98%/0.4)] text-[hsl(0_0%_98%)] bg-transparent hover:bg-[hsl(0_0%_98%/0.1)] hover:text-[hsl(0_0%_98%)] font-medium text-base px-8"
                  onClick={() => scrollTo("how-it-works")}
                >
                  How It Works
                </Button>
              </div>

              {/* Hero bullet points */}
              <ul className="flex flex-col gap-2 max-w-xl mx-auto text-left">
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

        {/* ── EMAIL CAPTURE ── */}
        <EmailCaptureSection />

        {/* ── COLLECTIONS ── */}
        <RugCollections />

        {/* ── ORDER BUILDER ── */}
        <RugOrderBuilder />

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
                { icon: "🏪", title: "Specialty Stores", desc: "High-margin inventory your shoppers will love" },
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
          {totalSaved > 0 && (
            <div className="bg-primary-foreground/10 rounded-lg px-4 py-3 max-w-2xl mx-auto mb-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">
                Your saved patterns ({totalSaved})
              </p>
              <p className="text-sm text-primary-foreground/80">
                {savedSummary}
              </p>
              <p className="text-xs text-primary-foreground/50 mt-1">
                Mention these in your email so we can include them in your quote.
              </p>
            </div>
          )}
          <p className="text-xl md:text-2xl font-semibold">
            Get in contact:{" "}
            <a
              href={`mailto:liesl@comebackgoods.com${totalSaved > 0 ? `?subject=Rug%20Program%20Quote%20Request&body=Hi%2C%20I'm%20interested%20in%20the%20following%20patterns%3A%0A${encodeURIComponent(savedSummary)}%0A%0A` : ''}`}
              className="text-accent hover:underline underline-offset-4"
            >
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

const RugProgram = () => (
  <RugFavoritesProvider>
    <RugProgramInner />
  </RugFavoritesProvider>
);

export default RugProgram;
