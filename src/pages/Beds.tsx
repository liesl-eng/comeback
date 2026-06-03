import ProgramMicrosite, { ProgramConfig } from "@/components/ProgramMicrosite";

const BEDS_MOQ = 10000;
const BEDS_NAME_RE = /(bed|headboard|nightstand|dresser|chest)/i;

const config: ProgramConfig = {
  programName: "Beds",
  shortName: "Beds",
  slug: "beds",
  moq: BEDS_MOQ,
  seo: {
    title: "Shop Beds — Comeback Goods",
    description:
      "Beds, headboards, nightstands, and dressers from Modus Furniture. Up to 99% below MSRP.",
  },
  hero: {
    badgeText: "Beds",
    titleLine1: "Curated Beds, ",
    titleLine2: "Big Savings",
    subhead: "",
    bullets: [],
  },
  emailCapture: {
    heading: "Interested? Let's Talk Beds.",
    subheading: "Drop in your email and we'll reach out with pricing and availability.",
    italicLine: "(No spam. Just beds.)",
  },
  whoItsFor: { heading: "", subheading: "", cards: [] },
  howItWorks: [],
  faqs: [],
  hideHero: true,
  productGrid: {
    eyebrow: "BEDS",
    heading: "Shop Beds",
    hideEyebrow: true,
    stickyHeader: true,
    subtext:
      "Beds, headboards, nightstands, and dressers from Modus Furniture. Up to 99% below MSRP.",
    brands: [
      {
        label: "Modus Furniture",
        displayBrand: "MODUS FURNITURE",
        tab: "Modus Furniture",
        filterName: (n) =>
          BEDS_NAME_RE.test(n),
      },
    ],
  },
};

const Beds = () => <ProgramMicrosite config={config} />;
export default Beds;
