import ProgramMicrosite, { ProgramConfig } from "@/components/ProgramMicrosite";
import { ClipboardList, PackageSearch, CalendarClock } from "lucide-react";

const LIGHTING_MOQ = 4000; // adjust as needed

const config: ProgramConfig = {
  programName: "Lighting Program",
  shortName: "Lighting",
  slug: "lighting-program",
  moq: LIGHTING_MOQ,
  seo: {
    title: "Comeback Goods Lighting Program — Curated Lighting, Big Savings",
    description:
      "Curated lighting from premium brands at deep discounts. Inspected, ready-to-sell inventory delivered on your schedule.",
  },
  // Soft blue "twilight glow" — evokes ambient lighting
  heroBackground:
    'radial-gradient(ellipse at 50% 30%, hsl(210 70% 78%) 0%, hsl(212 55% 62%) 35%, hsl(218 45% 45%) 70%, hsl(222 40% 32%) 100%)',
  heroOverlay: false,
  heroSheen: true,
  hero: {
    badgeText: "Comeback Lighting Program",
    titleLine1: "Curated Lighting, ",
    titleLine2: "Big Savings",
    subhead: "Inspected, ready-to-display lighting inventory... delivered on your schedule.",
    bullets: [
      ["Premium Lighting, Big Savings", "up to 60% off wholesale."],
      ["Lighting You Can Count On", "inspected and ready for display."],
      ["Your Lot, Your Rules", "deliveries you can swap, pause, or adjust anytime."],
    ],
  },
  emailCapture: {
    heading: "Interested? Let's Talk Lighting.",
    subheading: "Drop in your email and we'll reach out with pricing and availability.",
    italicLine: "(No spam. Just lighting.)",
  },
  whoItsFor: {
    heading: "Stretch Your Budget, Not Your Standards.",
    subheading: "Reliable, affordable lighting inventory — without the sourcing headaches.",
    cards: [
      { icon: "🏪", title: "Specialty Stores", desc: "High-margin lighting your shoppers will love" },
      { icon: "🏢", title: "Property Managers", desc: "Turnkey lighting supply for unit turnover" },
      { icon: "🏡", title: "Short-Term Rentals", desc: "Refresh listings affordably at scale" },
      { icon: "🎨", title: "Stagers & Designers", desc: "Premium looks without premium cost" },
    ],
  },
  howItWorks: [
    {
      step: "01",
      title: "Tell Us What Lighting You Need",
      desc: "Set your volume, style, and category preferences — we'll curate a program built for your business or project.",
      Icon: ClipboardList,
    },
    {
      step: "02",
      title: "Curated, Ready-to-Display Lighting Inventory",
      desc: "Premium brand lighting, inspected and graded, priced up to 60% below wholesale.",
      Icon: PackageSearch,
    },
    {
      step: "03",
      title: "Predictable & Flexible Delivery",
      desc: "Receive consistent lighting shipments on your schedule — pause, swap, or adjust anytime.",
      Icon: CalendarClock,
    },
  ],
  faqs: [
    {
      q: "What condition is the lighting in?",
      a: "All pieces are in new or like-new condition. Every item is inspected by us before shipping.",
    },
    {
      q: "How does pricing work?",
      a: `Pricing depends on volume and mix. Our minimum order is $${LIGHTING_MOQ.toLocaleString()}, and most partners see up to 60–70% below wholesale. We'll provide a custom quote based on your volume tier and style preferences.`,
    },
    {
      q: "Can I choose specific styles, finishes, or categories?",
      a: "Absolutely. During onboarding, you'll share your preferences and we'll curate shipments to match — lamps, pendants, sconces, chandeliers, and more.",
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
      a: "We source from a rotating mix of premium home brands. Everything meets our quality standards and is evaluated by us before we ship. We're happy to share current brand availability during your consultation.",
    },
  ],
  showBackLink: true,
  hideHero: true,
  productGrid: {
    eyebrow: "LIGHTING PROGRAM",
    heading: "Shop Lighting",
    hideEyebrow: true,
    stickyHeader: true,
    subtext:
      "Designer lighting from Arteriors Home and Ferm Living — inspected, in stock, and priced 60% below retail.",
    brands: [
      {
        label: "Arteriors Home",
        displayBrand: "ARTERIORS HOME",
        tab: "Arteriors Home",
        filterName: (n) =>
          /(lamp|sconce|chandelier|pendant|flush mount|floor lamp)/i.test(n),
      },
      {
        label: "Ferm Living",
        displayBrand: "FERM LIVING",
        tab: "Ferm Living",
        fallback: [
          { name: "Meridian Lamp UL Cashmere", msrp: 265, unitsAvailable: 265 },
          { name: "Meridian Lamp UL Black", msrp: 265, unitsAvailable: 265 },
          { name: "Meridian Lamp UL Brushed Steel", msrp: 265, unitsAvailable: 265 },
          { name: "Meridian Lamp UL Brass", msrp: 265, unitsAvailable: 265 },
          { name: "Era Chandelier Black UL", msrp: 725, unitsAvailable: 725 },
          { name: "Era Chandelier Eggshell UL", msrp: 725, unitsAvailable: 725 },
        ],
      },
    ],
  },
};

const LightingProgram = () => <ProgramMicrosite config={config} />;

export default LightingProgram;
