import ProgramMicrosite, { ProgramConfig } from "@/components/ProgramMicrosite";
import { ClipboardList, PackageSearch, CalendarClock } from "lucide-react";

const MIRROR_MOQ = 4000; // adjust as needed

const config: ProgramConfig = {
  programName: "Mirror Program",
  shortName: "Mirrors",
  slug: "mirror-program",
  moq: MIRROR_MOQ,
  seo: {
    title: "Comeback Goods Mirror Program — Curated Mirrors, Big Savings",
    description:
      "Curated mirrors from premium brands at deep discounts. Inspected, ready-to-sell inventory delivered on your schedule.",
  },
  // Brushed-silver / mirror-sheen background
  heroBackground:
    'linear-gradient(135deg, hsl(220 8% 18%) 0%, hsl(220 6% 32%) 35%, hsl(220 4% 58%) 55%, hsl(220 6% 38%) 75%, hsl(220 8% 22%) 100%)',
  heroOverlay: false,
  heroSheen: true,
  hero: {
    badgeText: "Comeback Mirror Program",
    titleLine1: "Curated Mirrors, ",
    titleLine2: "Big Savings",
    subhead: "Inspected, ready-to-display mirror inventory... delivered on your schedule.",
    bullets: [
      ["Premium Mirrors, Big Savings", "up to 60% off wholesale."],
      ["Mirrors You Can Count On", "inspected and ready for display."],
      ["Your Lot, Your Rules", "deliveries you can swap, pause, or adjust anytime."],
    ],
  },
  emailCapture: {
    heading: "Interested? Let's Talk Mirrors.",
    subheading: "Drop in your email and we'll reach out with pricing and availability.",
    italicLine: "(No spam. Just mirrors.)",
  },
  whoItsFor: {
    heading: "Stretch Your Budget, Not Your Standards.",
    subheading: "Reliable, affordable mirror inventory — without the sourcing headaches.",
    cards: [
      { icon: "🏪", title: "Specialty Stores", desc: "High-margin mirrors your shoppers will love" },
      { icon: "🏢", title: "Property Managers", desc: "Turnkey mirror supply for unit turnover" },
      { icon: "🏡", title: "Short-Term Rentals", desc: "Refresh listings affordably at scale" },
      { icon: "🎨", title: "Stagers & Designers", desc: "Premium looks without premium cost" },
    ],
  },
  howItWorks: [
    {
      step: "01",
      title: "Tell Us What Mirrors You Need",
      desc: "Set your volume, style, and size preferences — we'll curate a program built for your business or project.",
      Icon: ClipboardList,
    },
    {
      step: "02",
      title: "Curated, Ready-to-Display Mirror Inventory",
      desc: "Premium brand mirrors, inspected and graded, priced up to 60% below wholesale.",
      Icon: PackageSearch,
    },
    {
      step: "03",
      title: "Predictable & Flexible Delivery",
      desc: "Receive consistent mirror shipments on your schedule — pause, swap, or adjust anytime.",
      Icon: CalendarClock,
    },
  ],
  faqs: [
    {
      q: "What condition are the mirrors in?",
      a: "All mirrors are in new or like-new condition. Every piece is inspected by us before shipping.",
    },
    {
      q: "How does pricing work?",
      a: `Pricing depends on volume and mix. Our minimum order is $${MIRROR_MOQ.toLocaleString()}, and most partners see up to 60–70% below wholesale. We'll provide a custom quote based on your volume tier and style preferences.`,
    },
    {
      q: "Can I choose specific styles, sizes, or shapes?",
      a: "Absolutely. During onboarding, you'll share your preferences and we'll curate shipments to match — round, rectangular, arched, full-length, accent, and more.",
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
};

const MirrorProgram = () => <ProgramMicrosite config={config} />;

export default MirrorProgram;
