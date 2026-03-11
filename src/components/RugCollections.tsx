import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Size bucket definitions ─── */
const SIZE_BUCKETS = [
  "All Sizes", "2×3", "3×5", "5×7", "7×10", "9×12", "Runners", "Round",
] as const;

type SizeBucket = (typeof SIZE_BUCKETS)[number];

/* ─── Sub-design type ─── */
interface SizeBreakdown {
  size: string;
  units: number;
}

interface SubDesign {
  name: string;
  units: number;
  image: string;
  sizes: SizeBreakdown[];
}

/* ─── Collection type ─── */
interface Collection {
  name: string;
  totalUnits: number;
  designCount: number;
  image: string;
  sizeBuckets: SizeBucket[];
  subDesigns: SubDesign[] | null; // null = no breakdown available
  fallbackNote?: string;
}

/* ─── Helper: which bucket does a raw size belong to? ─── */
const rawSizeToBucket = (raw: string): SizeBucket | null => {
  const s = raw.toLowerCase();
  if (s.includes("round")) return "Round";
  if (s.includes("runner") || s.includes("roll") || s.includes("cut")) return "Runners";
  if (s.includes("9'3\"×12'6\"") || s.includes("9'3\"x12'6\"")) return "9×12";
  if (
    s.includes("7'10\"×9'10\"") || s.includes("7'10\"×10'6\"") ||
    s.includes("6'7\"×9'3\"") || s.includes("6'7\"×9'6\"") ||
    s.includes("7'3\"×9'3\"") || s.includes("7'7\"×9'6\"") ||
    s.includes("7'10\"x9'10\"") || s.includes("7'10\"x10'6\"") ||
    s.includes("6'7\"x9'3\"") || s.includes("6'7\"x9'6\"") ||
    s.includes("7'3\"x9'3\"") || s.includes("7'7\"x9'6\"")
  ) return "7×10";
  if (
    s.includes("5'3\"×7'3\"") || s.includes("5'×7'") || s.includes("5'2\"×7'") ||
    s.includes("5'3\"x7'3\"") || s.includes("5'x7'") || s.includes("5'2\"x7'")
  ) return "5×7";
  if (
    s.includes("3'11\"×5'3\"") || s.includes("3'3\"×4'7\"") || s.includes("3'3\"×5'") ||
    s.includes("3'11\"x5'3\"") || s.includes("3'3\"x4'7\"") || s.includes("3'3\"x5'")
  ) return "3×5";
  if (
    s.includes("2'×3'11\"") || s.includes("2'3\"×3'11\"") || s.includes("2'×3'") ||
    s.includes("2'7\"×3'11\"") || s.includes("2'3\"×3'11\"") ||
    s.includes("2'x3'11\"") || s.includes("2'3\"x3'11\"") || s.includes("2'x3'") ||
    s.includes("2'7\"x3'11\"")
  ) return "2×3";
  return null;
};

/* ─── Check if a collection has inventory in a given bucket ─── */
const collectionMatchesBucket = (col: Collection, bucket: SizeBucket): boolean => {
  if (bucket === "All Sizes") return true;
  return col.sizeBuckets.includes(bucket);
};

/* ─── FULL COLLECTION DATA ─── */
const FALLBACK_NOTE = "Multiple sizes available. Contact us for details.";

const collections: Collection[] = [
  {
    name: "Lotus",
    totalUnits: 3987,
    designCount: 12,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-50CU5_W.jpg?v=1753642856",
    sizeBuckets: ["2×3", "3×5", "5×7", "7×10", "Runners"],
    subDesigns: [
      { name: "Ripon", units: 1286, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-50CU5_W.jpg?v=1753642856", sizes: [{ size: "5'3\"×7'3\"", units: 1170 }, { size: "3'11\"×5'3\"", units: 116 }] },
      { name: "Argonne", units: 689, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-232CU5_W.jpg?v=1753642856", sizes: [{ size: "3'11\"×5'3\"", units: 565 }, { size: "5'3\"×7'3\"", units: 73 }, { size: "2'×3'11\"", units: 49 }, { size: "6'7\"×9'3\"", units: 2 }] },
      { name: "Habra", units: 435, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-16CU5_W.jpg?v=1753642857", sizes: [{ size: "5'3\"×7'3\"", units: 435 }] },
      { name: "Menda", units: 383, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-36CU5_W.jpg?v=1753642857", sizes: [{ size: "7'10\"×9'10\"", units: 280 }, { size: "Runner", units: 101 }, { size: "3'11\"×5'3\"", units: 2 }] },
      { name: "Shasta", units: 367, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-79CU5_W.jpg?v=1753642851", sizes: [{ size: "2'×3'11\"", units: 246 }, { size: "Runner", units: 121 }] },
      { name: "Pomona", units: 203, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-62CU5_W.jpg?v=1753642857", sizes: [{ size: "5'3\"×7'3\"", units: 121 }, { size: "6'7\"×9'3\"", units: 75 }, { size: "3'11\"×5'3\"", units: 7 }] },
      { name: "Tonti", units: 156, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-170OH.jpg?v=1753642856", sizes: [{ size: "Runner", units: 124 }, { size: "7'10\"×9'10\"", units: 32 }] },
      { name: "Towne", units: 149, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-210OH.jpg?v=1742608637", sizes: [{ size: "Runner", units: 149 }] },
      { name: "Macon", units: 144, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-204CU5_W.jpg?v=1753642856", sizes: [{ size: "5'3\"×7'3\"", units: 144 }] },
      { name: "Cambria", units: 102, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-156CU5_W.jpg?v=1753642856", sizes: [{ size: "5'3\"×7'3\"", units: 102 }] },
      { name: "Amesti", units: 51, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-136CU5_W.jpg?v=1753642914", sizes: [{ size: "5'3\"×7'3\"", units: 51 }] },
      { name: "Ramon", units: 22, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-86OH.jpg?v=1742608792", sizes: [{ size: "Runner", units: 22 }] },
    ],
  },
  {
    name: "Dazzle",
    totalUnits: 2875,
    designCount: 1,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DZ-088x10CU5.jpg?v=1753643053",
    sizeBuckets: ["2×3", "3×5", "5×7", "7×10", "9×12", "Runners"],
    subDesigns: [
      { name: "Disa", units: 2875, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DZ-088x10CU5.jpg?v=1753643053", sizes: [{ size: "5'3\"×7'3\"", units: 1372 }, { size: "Runner", units: 570 }, { size: "2'3\"×7'3\" Runner", units: 325 }, { size: "7'10\"×9'10\"", units: 261 }, { size: "3'11\"×5'3\"", units: 150 }, { size: "9'3\"×12'6\"", units: 101 }, { size: "7'3\"×9'3\"", units: 95 }, { size: "2'×3'", units: 1 }] },
    ],
  },
  {
    name: "Kings Court",
    totalUnits: 2762,
    designCount: 9,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/6516_Runner_OH.jpg?v=1742600678",
    sizeBuckets: ["3×5", "5×7", "Runners"],
    subDesigns: [
      { name: "Brooklyn Trellis", units: 661, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/6516_Runner_OH.jpg?v=1742600678", sizes: [{ size: "20\"×5' Runner", units: 401 }, { size: "22\"×1' Cut", units: 217 }, { size: "Roll Runner", units: 42 }, { size: "3'3\"×4'7\"", units: 1 }] },
      { name: "Clover", units: 518, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KC-128OH.jpg?v=1751061609", sizes: [{ size: "20\"×5' Runner", units: 393 }, { size: "Runner", units: 125 }] },
      { name: "Kama", units: 151, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/KC-213OH.jpg?v=1742636552", sizes: [{ size: "5'×7'", units: 90 }, { size: "Runner", units: 44 }, { size: "3'3\"×4'7\"", units: 17 }] },
      { name: "Gene", units: 117, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/KC-1743x5OH.jpg?v=1742612716", sizes: [{ size: "5'×7'", units: 89 }, { size: "3'3\"×4'7\"", units: 28 }] },
      { name: "Zazzu", units: 54, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/KC-2012x5OH.jpg?v=1742636499", sizes: [{ size: "5'×7'", units: 49 }, { size: "Runner", units: 3 }, { size: "3'3\"×4'7\"", units: 1 }, { size: "Runner", units: 1 }] },
      { name: "Tabriz Red Traditional", units: 29, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/66302x5RunnerOH_0954979f-1b9b-4753-8a8d-3932c1b6a87d.jpg?v=1751061809", sizes: [{ size: "20\"×5' Runner", units: 29 }] },
      { name: "Florence Brown Traditional", units: 21, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KC-1083x5OH_c36dd545-fee3-4ddd-b2a9-73863b73b1c9.jpg?v=1751061818", sizes: [{ size: "Runner", units: 19 }, { size: "20\"×5' Runner", units: 2 }] },
      { name: "Warby", units: 20, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KC-02.jpg?v=1742596149", sizes: [{ size: "1'8\"×5'", units: 20 }] },
      { name: "Tabriz Black Traditional", units: 2, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/66332x5RunnerOH.jpg?v=1751061809", sizes: [{ size: "20\"×5' Runner", units: 2 }] },
    ],
  },
  {
    name: "Madison Shag",
    totalUnits: 2074,
    designCount: 5,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163",
    sizeBuckets: ["2×3", "3×5", "5×7", "7×10", "Runners", "Round"],
    subDesigns: null,
    fallbackNote: FALLBACK_NOTE,
  },
  {
    name: "Rodeo",
    totalUnits: 1318,
    designCount: 4,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-02_OH.jpg?v=1742601782",
    sizeBuckets: ["~2×3", "~5×7", "Runners"],
    subDesigns: [
      { name: "Otero", units: 970, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-02_OH.jpg?v=1742601782", sizes: [{ size: "2'3\"×3'11\"", units: 846 }, { size: "5'3\"×7'3\"", units: 124 }] },
      { name: "Virden", units: 342, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-94_OH.jpg?v=1742601909", sizes: [{ size: "2'3\"×7'3\" Runner", units: 178 }, { size: "Runner", units: 161 }, { size: "5'3\"×7'3\"", units: 3 }] },
      { name: "Chindi", units: 5, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-319OH.jpg?v=1742618345", sizes: [{ size: "Runner", units: 4 }, { size: "3'11\"×5'3\"", units: 1 }] },
      { name: "Elaine", units: 1, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-304OH.jpg?v=1742618173", sizes: [{ size: "Runner", units: 1 }] },
    ],
  },
  {
    name: "Elle Basics",
    totalUnits: 1074,
    designCount: 1,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/ELL-128x10OH.jpg?v=1742620397",
    sizeBuckets: ["~2×3", "~5×7", "~7×10", "Runners"],
    subDesigns: [
      { name: "Emerson", units: 1074, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/ELL-128x10OH.jpg?v=1742620397", sizes: [{ size: "Runner", units: 612 }, { size: "2'3\"×3'11\"", units: 450 }, { size: "6'7\"×9'6\"", units: 10 }, { size: "7'10\"×9'10\"", units: 1 }, { size: "5'3\"×7'3\"", units: 1 }] },
    ],
  },
  {
    name: "Dorado",
    totalUnits: 825,
    designCount: 8,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-512RS_S_01Graphic_1.jpg?v=1751060076",
    sizeBuckets: ["~3×5", "Runners"],
    subDesigns: [
      { name: "Mariah", units: 314, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-512RS_S_01Graphic_1.jpg?v=1751060076", sizes: [{ size: "Runner", units: 306 }, { size: "2'3\"×7'3\" Runner", units: 8 }] },
      { name: "Loewy", units: 194, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-424OH.jpg?v=1751060427", sizes: [{ size: "Runner", units: 116 }, { size: "3'11\"×5'3\"", units: 78 }] },
      { name: "Devotion", units: 107, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/SI-48_RS_RM45_02.jpg?v=1742596778", sizes: [{ size: "Runner", units: 107 }] },
      { name: "Neveh", units: 77, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-512RS_S_01Graphic_1.jpg?v=1751060076", sizes: [{ size: "Runner", units: 77 }] },
      { name: "Audun", units: 71, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-404RS_S_01Graphic_1.jpg?v=1744399351", sizes: [{ size: "Runner", units: 71 }] },
      { name: "Neema", units: 41, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-447OH.jpg?v=1751060445", sizes: [{ size: "Runner", units: 31 }, { size: "3'11\"×5'3\"", units: 10 }] },
      { name: "Arid", units: 18, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-504CU5_V2Graphic_9.jpg?v=1751060059", sizes: [{ size: "3'11\"×5'3\"", units: 18 }] },
      { name: "Cabo", units: 3, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-334RS_S_01Graphic_1.jpg?v=1751060076", sizes: [{ size: "Runner", units: 3 }] },
    ],
  },
  {
    name: "Money",
    totalUnits: 767,
    designCount: 4,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-01A8x10OH.jpg?v=1751059908",
    sizeBuckets: ["~5×7", "~7×10", "~9×12", "Runners", "Round"],
    subDesigns: null,
    fallbackNote: FALLBACK_NOTE,
  },
  {
    name: "Kennedy",
    totalUnits: 618,
    designCount: 3,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-14OH.jpg?v=1751232653",
    sizeBuckets: ["~3×5", "Runners", "Round"],
    subDesigns: [
      { name: "Triangles", units: 269, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-14OH.jpg?v=1751232653", sizes: [{ size: "Runner", units: 226 }, { size: "4' Round", units: 37 }, { size: "2'3\"×7'3\" Runner", units: 6 }] },
      { name: "Stars", units: 237, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-24OH.jpg?v=1751232653", sizes: [{ size: "Runner", units: 235 }, { size: "2'3\"×7'3\" Runner", units: 2 }] },
      { name: "Reeve", units: 112, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-34OH.jpg?v=1751232653", sizes: [{ size: "4' Round", units: 54 }, { size: "Runner", units: 38 }, { size: "2'3\"×7'3\" Runner", units: 19 }, { size: "3'11\"×5'3\"", units: 1 }] },
    ],
  },
  {
    name: "Dulcet",
    totalUnits: 613,
    designCount: 3,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/files/1940_RS_S_01_R1.jpg?v=1753643333",
    sizeBuckets: ["~2×3", "~3×5", "~5×7", "~9×12", "Runners"],
    subDesigns: [
      { name: "Granada", units: 164, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DU-84OH.jpg?v=1742616163", sizes: [{ size: "5'3\"×7'3\"", units: 72 }, { size: "2'3\"×7'3\" Runner", units: 47 }, { size: "3'11\"×5'3\"", units: 45 }] },
      { name: "Aosta", units: 104, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DU-1348x10OH.jpg?v=1742616099", sizes: [{ size: "5'3\"×7'3\"", units: 64 }, { size: "9'3\"×12'6\"", units: 25 }, { size: "3'11\"×5'3\"", units: 13 }, { size: "Runner", units: 2 }] },
      { name: "Trieste", units: 99, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DU-928x10OH.jpg?v=1742616209", sizes: [{ size: "3'11\"×5'3\"", units: 54 }, { size: "Runner", units: 36 }, { size: "5'3\"×7'3\"", units: 8 }, { size: "2'7\"×3'11\"", units: 1 }] },
    ],
  },
  {
    name: "Zazzle",
    totalUnits: 383,
    designCount: 1,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/files/ZAZ-23_8x10_OH_1.jpg?v=1742624393",
    sizeBuckets: ["~5×7", "Runners"],
    subDesigns: [
      { name: "Patras", units: 383, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/ZAZ-23_8x10_OH_1.jpg?v=1742624393", sizes: [{ size: "5'3\"×7'3\"", units: 272 }, { size: "2'3\"×7'3\" Runner", units: 64 }, { size: "Runner", units: 47 }] },
    ],
  },
  {
    name: "Mystic",
    totalUnits: 373,
    designCount: 4,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/files/MC-457OH.jpg?v=1751061979",
    sizeBuckets: ["~5×7", "~7×10", "Runners"],
    subDesigns: [
      { name: "Colette", units: 272, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/MC-457OH.jpg?v=1751061979", sizes: [{ size: "5'3\"×7'3\"", units: 218 }, { size: "Runner", units: 54 }] },
      { name: "Nova", units: 58, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/MC-307CU5.jpg?v=1753643163", sizes: [{ size: "Runner", units: 58 }] },
      { name: "Maddox", units: 31, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/MC-2748x10CU5.jpg?v=1753643163", sizes: [{ size: "Runner", units: 31 }] },
      { name: "Zoe", units: 12, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/MC-59_OH.jpg?v=1742595339", sizes: [{ size: "7'10\"×9'10\"", units: 9 }, { size: "Runner", units: 3 }] },
    ],
  },
  {
    name: "Apollo",
    totalUnits: 226,
    designCount: 3,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MR-04E2x4OH.jpg?v=1742627436",
    sizeBuckets: ["~2×3", "~3×5", "~5×7", "~7×10", "Runners"],
    subDesigns: null,
    fallbackNote: FALLBACK_NOTE,
  },
  {
    name: "Brielle",
    totalUnits: 211,
    designCount: 1,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/BRI-42RoundRS_S_01.jpg?v=1742611088",
    sizeBuckets: ["Round"],
    subDesigns: [
      { name: "Larissa", units: 211, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/BRI-42RoundRS_S_01.jpg?v=1742611088", sizes: [{ size: "4' Round", units: 211 }] },
    ],
  },
  {
    name: "Ell Basics",
    totalUnits: 162,
    designCount: 3,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-20Graphics_1.jpg?v=1751063157",
    sizeBuckets: ["~2×3", "~5×7", "~7×10", "Runners"],
    subDesigns: [
      { name: "Rendezvous", units: 74, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-20Graphics_1.jpg?v=1751063157", sizes: [{ size: "5'3\"×7'3\"", units: 73 }, { size: "2'3\"×7'3\"", units: 1 }] },
      { name: "Intrigue", units: 64, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-12Graphics_1.jpg?v=1751063149", sizes: [{ size: "7'10\"×9'10\"", units: 64 }] },
      { name: "Gala", units: 24, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-30Graphics_1.jpg?v=1751063678", sizes: [{ size: "5'3\"×7'3\"", units: 18 }, { size: "2'3\"×7'3\"", units: 3 }, { size: "7'10\"×9'10\"", units: 2 }, { size: "2'×3'", units: 1 }] },
    ],
  },
];

const RugCollections = () => {
  const [activeSize, setActiveSize] = useState<SizeBucket>("All Sizes");
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);

  const filtered = collections
    .filter((c) => collectionMatchesBucket(c, activeSize))
    .sort((a, b) => b.totalUnits - a.totalUnits);

  const handleCardClick = (name: string) => {
    setExpandedCollection((prev) => (prev === name ? null : name));
  };

  return (
    <section className="pt-6 md:pt-10 pb-6 md:pb-10 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-bold mb-3">Browse Available Collections</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our current closeout inventory. Click a collection to see designs and sizes.
          </p>
        </div>

        {/* Size filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-4xl mx-auto">
          {SIZE_BUCKETS.map((size) => (
            <button
              key={size}
              onClick={() => {
                setActiveSize(size);
                setExpandedCollection(null);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                activeSize === size
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card text-muted-foreground border-border hover:border-accent/50 hover:text-foreground"
              )}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Collection grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {filtered.map((col) => {
            const isExpanded = expandedCollection === col.name;

            return (
              <div
                key={col.name}
                className={cn(
                  "transition-all duration-300",
                  isExpanded && "sm:col-span-2 lg:col-span-3"
                )}
              >
                <Card
                  className={cn(
                    "overflow-hidden cursor-pointer transition-shadow hover:shadow-md",
                    isExpanded && "ring-2 ring-accent"
                  )}
                  onClick={() => handleCardClick(col.name)}
                >
                  {!isExpanded && (
                    <div className="h-52 overflow-hidden bg-muted">
                      <img
                        src={col.image}
                        alt={col.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <CardContent className={cn("p-4", isExpanded ? "pt-4" : "")}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">{col.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {col.designCount} {col.designCount === 1 ? "design" : "designs"} · {col.totalUnits.toLocaleString()} units available
                        </p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Expanded sub-design panel */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"
                  )}
                >
                  {isExpanded && (
                    <div className="bg-card border rounded-lg p-4 md:p-6">
                      {col.subDesigns ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[...col.subDesigns]
                            .sort((a, b) => b.units - a.units)
                            .map((design) => (
                              <div
                                key={design.name}
                                className="border rounded-lg overflow-hidden bg-background"
                              >
                                <div className="h-40 overflow-hidden bg-muted">
                                  <img
                                    src={design.image}
                                    alt={design.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="p-3 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-sm">{design.name}</h4>
                                    <span className="text-xs font-medium text-muted-foreground">
                                      {design.units.toLocaleString()} units
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {design.sizes.map((s, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                                      >
                                        {s.size}: {s.units.toLocaleString()}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 py-4">
                          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <img
                              src={col.image}
                              alt={col.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">{col.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {col.totalUnits.toLocaleString()} units · {col.fallbackNote}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground italic mt-8 max-w-xl mx-auto">
          Pricing varies by volume and mix. Request a quote for current availability and rates.
        </p>
      </div>
    </section>
  );
};

export default RugCollections;
