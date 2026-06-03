import ProgramMicrosite, { ProgramConfig } from "@/components/ProgramMicrosite";

const TABLES_MOQ = 10000;
const TABLES_NAME_RE = /(table|console|desk)/i;

const config: ProgramConfig = {
  programName: "Tables",
  shortName: "Tables",
  slug: "tables",
  moq: TABLES_MOQ,
  seo: {
    title: "Shop Tables — Comeback Goods",
    description:
      "Coffee tables, side tables, dining tables, and consoles from Modus Furniture and Arteriors Home. Priced 60% below retail.",
  },
  hero: {
    badgeText: "Tables",
    titleLine1: "Curated Tables, ",
    titleLine2: "Big Savings",
    subhead: "",
    bullets: [],
  },
  emailCapture: {
    heading: "Interested? Let's Talk Tables.",
    subheading: "Drop in your email and we'll reach out with pricing and availability.",
    italicLine: "(No spam. Just tables.)",
  },
  whoItsFor: { heading: "", subheading: "", cards: [] },
  howItWorks: [],
  faqs: [],
  hideHero: true,
  productGrid: {
    eyebrow: "TABLES",
    heading: "Shop Tables",
    hideEyebrow: true,
    stickyHeader: true,
    subtext:
      "Coffee tables, side tables, dining tables, and consoles from Modus Furniture and Arteriors Home. Priced 60% below retail.",
    brands: [
      {
        label: "Modus Furniture",
        displayBrand: "MODUS FURNITURE",
        tab: "Modus Furniture",
        filterName: (n) => TABLES_NAME_RE.test(n),
      },
      {
        label: "Arteriors Home",
        displayBrand: "ARTERIORS HOME",
        tab: "Arteriors Home",
        filterName: (n) => TABLES_NAME_RE.test(n),
      },
    ],
  },
};

const Tables = () => <ProgramMicrosite config={config} />;
export default Tables;
