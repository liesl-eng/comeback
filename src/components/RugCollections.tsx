import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRugFavorites, SavedPattern } from "@/contexts/RugFavoritesContext";
import { getAvailability } from "@/lib/rugAvailability";

/* ─── Size bucket definitions ─── */
const SIZE_BUCKETS = [
  "All Sizes", "Accent", "Small-Medium", "Medium", "Large", "XL", "Runner", "Stair Tread", "Small Round", "Med Round", "Med Oval", "Large Round",
] as const;

type SizeBucket = (typeof SIZE_BUCKETS)[number];

/* ─── Display size — pass-through for short labels ─── */
const displaySize = (raw: string): string => raw;

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
  subDesigns: SubDesign[] | null;
  fallbackNote?: string;
}

/* ─── Size-to-bucket mapping ─── */
const rawSizeToBucket = (raw: string): SizeBucket | null => {
  const s = raw.toLowerCase().replace(/\s+/g, " ").trim();
  if (s === "custom cut") return "Custom Cut";
  if (s === "stair tread") return "Stair Tread";
  if (s === "5×7 oval") return "Med Oval";
  if (s.includes("runner") || s.includes("roll") || s.includes("cut") || s === "unspecified") return "Runner";
  if (s === "small round" || s === "4' round" || s === "3' round") return "Small Round";
  if (s === "med round" || s === "5' round" || s === "6' round") return "Med Round";
  if (s === "8' round") return "Large Round";
  // dimension-based
  if (["2×3", "2×4", "3×4"].some((x) => s === x)) return "Accent";
  if (["3×5", "4×5"].some((x) => s === x)) return "Small-Medium";
  if (s === "5×7") return "Medium";
  if (["7×9", "7×10", "8×10", "8×11"].some((x) => s === x)) return "Large";
  if (["9×13", "10×13"].some((x) => s === x)) return "XL";
  return null;
};

/* ─── Check if a collection has inventory in a given bucket ─── */
const collectionMatchesBucket = (col: Collection, bucket: SizeBucket): boolean => {
  if (bucket === "All Sizes") return true;
  return col.sizeBuckets.includes(bucket);
};

/* ─── FULL COLLECTION DATA (updated March 27, 2026) ─── */

const collections: Collection[] = [
  {
    name: "Lotus",
    totalUnits: 3567,
    designCount: 12,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-50CU5_W.jpg?v=1753642856",
    sizeBuckets: ["Accent", "Small-Medium", "Medium", "Large", "Runner"],
    subDesigns: [
      { name: "Ripon", units: 1068, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-50CU5_W.jpg?v=1753642856", sizes: [{ size: "5×7", units: 952 }, { size: "4×5", units: 116 }] },
      { name: "Argonne", units: 464, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-232CU5_W.jpg?v=1753642856", sizes: [{ size: "4×5", units: 344 }, { size: "5×7", units: 73 }, { size: "2×4", units: 43 }, { size: "7×9", units: 4 }] },
      { name: "Shasta", units: 437, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-79CU5_W.jpg?v=1753642851", sizes: [{ size: "2×4", units: 317 }, { size: "3×10 Runner", units: 120 }] },
      { name: "Habra", units: 399, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-16CU5_W.jpg?v=1753642857", sizes: [{ size: "5×7", units: 399 }] },
      { name: "Menda", units: 380, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-36CU5_W.jpg?v=1753642857", sizes: [{ size: "8×10", units: 279 }, { size: "3×10 Runner", units: 99 }, { size: "4×5", units: 2 }] },
      { name: "Pomona", units: 201, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-62CU5_W.jpg?v=1753642857", sizes: [{ size: "5×7", units: 120 }, { size: "7×9", units: 75 }, { size: "4×5", units: 6 }] },
      { name: "Tonti", units: 157, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-170OH.jpg?v=1753642856", sizes: [{ size: "3×10 Runner", units: 124 }, { size: "8×10", units: 33 }] },
      { name: "Towne", units: 149, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-210OH.jpg?v=1742608637", sizes: [{ size: "3×10 Runner", units: 149 }] },
      { name: "Macon", units: 138, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-204CU5_W.jpg?v=1753642856", sizes: [{ size: "5×7", units: 138 }] },
      { name: "Cambria", units: 100, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-156CU5_W.jpg?v=1753642856", sizes: [{ size: "5×7", units: 100 }] },
      { name: "Amesti", units: 52, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-136CU5_W.jpg?v=1753642914", sizes: [{ size: "5×7", units: 52 }] },
      { name: "Ramon", units: 22, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-86OH.jpg?v=1742608792", sizes: [{ size: "3×10 Runner", units: 22 }] },
    ],
  },
  {
    name: "Madison Shag",
    totalUnits: 1868,
    designCount: 5,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163",
    sizeBuckets: ["Accent", "Small-Medium", "Medium", "Large", "Runner", "Large Round"],
    subDesigns: [
      { name: "Cossima", units: 1193, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163", sizes: [{ size: "2×3", units: 605 }, { size: "3×10 Runner", units: 255 }, { size: "5×7", units: 192 }, { size: "4×5", units: 99 }, { size: "2×7 Runner", units: 42 }] },
      { name: "Piper", units: 300, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163", sizes: [{ size: "4×5", units: 300 }] },
      { name: "Moroccan Lattice", units: 277, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163", sizes: [{ size: "5×7", units: 188 }, { size: "4×5", units: 89 }] },
      { name: "Plain", units: 65, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/NO-34_FL2.jpg?v=1742596112", sizes: [{ size: "8' Round", units: 65 }] },
      { name: "Cole", units: 33, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163", sizes: [{ size: "8×10", units: 33 }] },
    ],
  },
  {
    name: "Kings Court",
    totalUnits: 1729,
    designCount: 9,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/6516_Runner_OH.jpg?v=1742600678",
    sizeBuckets: ["Small-Medium", "Medium", "Large", "Runner", "Stair Tread"],
    subDesigns: [
      { name: "Brooklyn Trellis", units: 817, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/6516_Runner_OH.jpg?v=1742600678", sizes: [{ size: "22\"×1' Cut", units: 239 }, { size: "2×5 Runner", units: 196 }, { size: "Stair Tread", units: 96 }, { size: "31\"×1' Cut", units: 90 }, { size: "31\"×100' Roll", units: 67 }, { size: "26\"×1' Cut", units: 44 }, { size: "27\"×100' Roll", units: 41 }, { size: "26\"×100' Roll", units: 21 }, { size: "3×10 Runner", units: 14 }, { size: "2×7 Runner", units: 3 }, { size: "3×5", units: 2 }, { size: "8×10", units: 1 }] },
      { name: "Clover", units: 510, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KC-128OH.jpg?v=1751061609", sizes: [{ size: "2×5 Runner", units: 385 }, { size: "3×10 Runner", units: 125 }] },
      { name: "Kama", units: 151, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/KC-213OH.jpg?v=1742636552", sizes: [{ size: "5×7", units: 90 }, { size: "3×10 Runner", units: 44 }, { size: "3×5", units: 17 }] },
      { name: "Gene", units: 120, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/KC-1743x5OH.jpg?v=1742612716", sizes: [{ size: "5×7", units: 90 }, { size: "3×5", units: 30 }] },
      { name: "Zazzu", units: 60, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/KC-2012x5OH.jpg?v=1742636499", sizes: [{ size: "5×7", units: 48 }, { size: "2×7 Runner", units: 5 }, { size: "3×10 Runner", units: 4 }, { size: "3×5", units: 3 }] },
      { name: "Tabriz Red Traditional", units: 29, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/66302x5RunnerOH_0954979f-1b9b-4753-8a8d-3932c1b6a87d.jpg?v=1751061809", sizes: [{ size: "2×5 Runner", units: 29 }] },
      { name: "Florence Brown Traditional", units: 20, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KC-1083x5OH_c36dd545-fee3-4ddd-b2a9-73863b73b1c9.jpg?v=1751061818", sizes: [{ size: "3×10 Runner", units: 18 }, { size: "2×5 Runner", units: 2 }] },
      { name: "Warby", units: 20, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KC-02.jpg?v=1742596149", sizes: [{ size: "2×5 Runner", units: 20 }] },
      { name: "Tabriz Black Traditional", units: 2, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/66332x5RunnerOH.jpg?v=1751061957", sizes: [{ size: "2×5 Runner", units: 2 }] },
    ],
  },
  {
    name: "Rodeo",
    totalUnits: 1301,
    designCount: 4,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-02_OH.jpg?v=1742601782",
    sizeBuckets: ["Accent", "Medium", "Runner"],
    subDesigns: [
      { name: "Otero", units: 954, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-02_OH.jpg?v=1742601782", sizes: [{ size: "2×4", units: 836 }, { size: "5×7", units: 118 }] },
      { name: "Virden", units: 341, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-94_OH.jpg?v=1742601909", sizes: [{ size: "2×7 Runner", units: 178 }, { size: "3×10 Runner", units: 160 }, { size: "5×7", units: 3 }] },
      { name: "Chindi", units: 5, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-319OH.jpg?v=1742618345", sizes: [{ size: "3×10 Runner", units: 4 }, { size: "4×5", units: 1 }] },
      { name: "Elaine", units: 1, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-304OH.jpg?v=1742618173", sizes: [{ size: "3×10 Runner", units: 1 }] },
    ],
  },
  {
    name: "Dazzle",
    totalUnits: 1006,
    designCount: 1,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DZ-088x10CU5.jpg?v=1753643053",
    sizeBuckets: ["Accent", "Small-Medium", "Medium", "Large", "XL", "Runner"],
    subDesigns: [
      { name: "Disa", units: 1006, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DZ-088x10CU5.jpg?v=1753643053", sizes: [{ size: "5×7", units: 332 }, { size: "3×10 Runner", units: 230 }, { size: "8×10", units: 195 }, { size: "2×7 Runner", units: 112 }, { size: "9×13", units: 78 }, { size: "7×9", units: 47 }, { size: "4×5", units: 11 }, { size: "2×3", units: 1 }] },
    ],
  },
  {
    name: "Dorado",
    totalUnits: 694,
    designCount: 8,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-512RS_S_01Graphic_1.jpg?v=1751060076",
    sizeBuckets: ["Small-Medium", "Runner"],
    subDesigns: [
      { name: "Mariah", units: 215, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-512RS_S_01Graphic_1.jpg?v=1751060076", sizes: [{ size: "3×10 Runner", units: 207 }, { size: "2×7 Runner", units: 8 }] },
      { name: "Devotion", units: 107, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/SI-48_RS_RM45_02.jpg?v=1742596778", sizes: [{ size: "3×10 Runner", units: 107 }] },
      { name: "Neveh", units: 87, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-512RS_S_01Graphic_1.jpg?v=1751060076", sizes: [{ size: "3×10 Runner", units: 87 }] },
      { name: "Loewy", units: 80, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-424OH.jpg?v=1751060427", sizes: [{ size: "4×5", units: 78 }, { size: "3×10 Runner", units: 2 }] },
      { name: "Audun", units: 77, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-404RS_S_01Graphic_1.jpg?v=1744399351", sizes: [{ size: "3×10 Runner", units: 77 }] },
      { name: "Cabo", units: 69, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-334RS_S_01Graphic_1.jpg?v=1753643053", sizes: [{ size: "3×10 Runner", units: 69 }] },
      { name: "Neema", units: 41, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-447OH.jpg?v=1751060445", sizes: [{ size: "3×10 Runner", units: 31 }, { size: "4×5", units: 10 }] },
      { name: "Arid", units: 18, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-504CU5_V2Graphic_9.jpg?v=1751060059", sizes: [{ size: "4×5", units: 18 }] },
    ],
  },
  {
    name: "Dulcet",
    totalUnits: 573,
    designCount: 4,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/files/1940_RS_S_01_R1.jpg?v=1753643333",
    sizeBuckets: ["Accent", "Small-Medium", "Medium", "Large", "XL", "Runner"],
    subDesigns: [
      { name: "Bingo", units: 278, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/1940_RS_S_01_R1.jpg?v=1753643333", sizes: [{ size: "3×10 Runner", units: 95 }, { size: "3×4", units: 92 }, { size: "8×10", units: 49 }, { size: "9×13", units: 38 }, { size: "5×7", units: 3 }, { size: "2×7 Runner", units: 1 }] },
      { name: "Granada", units: 133, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DU-84OH.jpg?v=1742616163", sizes: [{ size: "5×7", units: 85 }, { size: "4×5", units: 28 }, { size: "2×7 Runner", units: 20 }] },
      { name: "Trieste", units: 95, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DU-928x10OH.jpg?v=1742616209", sizes: [{ size: "4×5", units: 54 }, { size: "2×7 Runner", units: 33 }, { size: "5×7", units: 7 }, { size: "3×4", units: 1 }] },
      { name: "Aosta", units: 67, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DU-1348x10OH.jpg?v=1742616099", sizes: [{ size: "9×13", units: 47 }, { size: "5×7", units: 14 }, { size: "4×5", units: 5 }, { size: "2×7 Runner", units: 1 }] },
    ],
  },
  {
    name: "Money",
    totalUnits: 489,
    designCount: 4,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-01A8x10OH.jpg?v=1751059908",
    sizeBuckets: ["Medium", "Large", "XL", "Runner", "Small Round", "Med Round"],
    subDesigns: [
      { name: "Dollar Front", units: 453, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-01A8x10OH.jpg?v=1751059908", sizes: [{ size: "2×5 Runner", units: 439 }, { size: "10×13", units: 14 }] },
      { name: "Dollar Stacked", units: 20, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-05A8x10OH.jpg?v=1751059919", sizes: [{ size: "3×10 Runner", units: 8 }, { size: "2×7 Runner", units: 8 }, { size: "10×13", units: 2 }, { size: "8×10", units: 2 }] },
      { name: "Dollar Front 2006A", units: 14, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-03A8x10OH.jpg?v=1751059913", sizes: [{ size: "2×7 Runner", units: 7 }, { size: "3×10 Runner", units: 6 }, { size: "5×7", units: 1 }] },
      { name: "Bitcoin", units: 2, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-01A8x10OH.jpg?v=1751059908", sizes: [{ size: "Small Round", units: 1 }, { size: "Med Round", units: 1 }] },
    ],
  },
  {
    name: "Kennedy",
    totalUnits: 378,
    designCount: 3,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-14OH.jpg?v=1751232653",
    sizeBuckets: ["Small-Medium", "Runner", "Small Round"],
    subDesigns: [
      { name: "Triangles", units: 176, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-14OH.jpg?v=1751232653", sizes: [{ size: "3×10 Runner", units: 137 }, { size: "4' Round", units: 33 }, { size: "2×7 Runner", units: 6 }] },
      { name: "Stars", units: 139, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-24OH.jpg?v=1751232653", sizes: [{ size: "3×10 Runner", units: 137 }, { size: "2×7 Runner", units: 2 }] },
      { name: "Reeve", units: 63, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-34OH.jpg?v=1751232653", sizes: [{ size: "3×10 Runner", units: 27 }, { size: "2×7 Runner", units: 19 }, { size: "4' Round", units: 16 }, { size: "4×5", units: 1 }] },
    ],
  },
  {
    name: "Zazzle",
    totalUnits: 212,
    designCount: 1,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/files/ZAZ-23_8x10_OH_1.jpg?v=1742624393",
    sizeBuckets: ["Medium", "Runner"],
    subDesigns: [
      { name: "Patras", units: 212, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/ZAZ-23_8x10_OH_1.jpg?v=1742624393", sizes: [{ size: "5×7", units: 91 }, { size: "2×7 Runner", units: 73 }, { size: "3×10 Runner", units: 48 }] },
    ],
  },
  {
    name: "Elle Basics",
    totalUnits: 212,
    designCount: 1,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/ELL-128x10OH.jpg?v=1742620397",
    sizeBuckets: ["Accent", "Medium", "Large", "Runner"],
    subDesigns: [
      { name: "Emerson", units: 212, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/ELL-128x10OH.jpg?v=1742620397", sizes: [{ size: "2×4", units: 115 }, { size: "3×10 Runner", units: 85 }, { size: "7×10", units: 10 }, { size: "8×10", units: 1 }, { size: "5×7", units: 1 }] },
    ],
  },
  {
    name: "Brielle",
    totalUnits: 207,
    designCount: 1,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/BRI-42RoundRS_S_01.jpg?v=1742611088",
    sizeBuckets: ["Small Round"],
    subDesigns: [
      { name: "Larissa", units: 207, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/BRI-42RoundRS_S_01.jpg?v=1742611088", sizes: [{ size: "4' Round", units: 207 }] },
    ],
  },
  {
    name: "Mystic",
    totalUnits: 196,
    designCount: 4,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/files/MC-457OH.jpg?v=1751061979",
    sizeBuckets: ["Medium", "Large", "Runner"],
    subDesigns: [
      { name: "Colette", units: 96, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/MC-457OH.jpg?v=1751061979", sizes: [{ size: "5×7", units: 70 }, { size: "2×7 Runner", units: 26 }] },
      { name: "Nova", units: 56, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/MC-307CU5.jpg?v=1753643163", sizes: [{ size: "3×10 Runner", units: 56 }] },
      { name: "Maddox", units: 32, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/MC-2748x10CU5.jpg?v=1753643163", sizes: [{ size: "3×10 Runner", units: 32 }] },
      { name: "Zoe", units: 12, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/MC-59_OH.jpg?v=1742595339", sizes: [{ size: "8×10", units: 9 }, { size: "2×7 Runner", units: 3 }] },
    ],
  },
  {
    name: "Apollo",
    totalUnits: 182,
    designCount: 3,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MR-04E2x4OH.jpg?v=1742627436",
    sizeBuckets: ["Accent", "Small-Medium", "Medium", "Large", "Runner"],
    subDesigns: [
      { name: "Lattice", units: 153, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MR-04E2x4OH.jpg?v=1742627436", sizes: [{ size: "5×7", units: 62 }, { size: "3×5", units: 42 }, { size: "2×5 Runner", units: 27 }, { size: "3×10 Runner", units: 21 }, { size: "2×4", units: 1 }] },
      { name: "Anastasia Moroccan", units: 27, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MR-01ARS_S_02.jpg?v=1751060400", sizes: [{ size: "2×5 Runner", units: 27 }] },
      { name: "Bryn Moroccan", units: 2, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MR-02ACU5.jpg?v=1751060409", sizes: [{ size: "8×10", units: 2 }] },
    ],
  },
  {
    name: "Ell Basics",
    totalUnits: 155,
    designCount: 3,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-20Graphics_1.jpg?v=1751063157",
    sizeBuckets: ["Accent", "Medium", "Large", "Runner"],
    subDesigns: [
      { name: "Rendezvous", units: 74, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-20Graphics_1.jpg?v=1751063157", sizes: [{ size: "5×7", units: 73 }, { size: "2×7 Runner", units: 1 }] },
      { name: "Intrigue", units: 64, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-12Graphics_1.jpg?v=1751063149", sizes: [{ size: "8×10", units: 64 }] },
      { name: "Gala", units: 17, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-30Graphics_1.jpg?v=1751063678", sizes: [{ size: "5×7", units: 12 }, { size: "2×7 Runner", units: 3 }, { size: "8×10", units: 1 }, { size: "2×3", units: 1 }] },
    ],
  },
  {
    name: "Baldwin",
    totalUnits: 128,
    designCount: 2,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/BAL-77OH.jpg?v=1742619180",
    sizeBuckets: ["Custom Cut"],
    subDesigns: [
      { name: "Carter", units: 119, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/BAL-77OH.jpg?v=1742619180", sizes: [{ size: "Custom Cut", units: 119 }] },
      { name: "Levi", units: 9, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/BAL-54OH.jpg?v=1742619135", sizes: [{ size: "Custom Cut", units: 9 }] },
    ],
  },
  {
    name: "Omaha",
    totalUnits: 124,
    designCount: 4,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/OM-174_OH.jpg?v=1742601014",
    sizeBuckets: ["Small-Medium", "XL", "Runner"],
    subDesigns: [
      { name: "Alu", units: 58, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/OM-174_OH.jpg?v=1742601014", sizes: [{ size: "4×5", units: 39 }, { size: "3×10 Runner", units: 19 }] },
      { name: "Laslow", units: 46, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/OM-222_8x10_RS_S_01_V2_edited.jpg?v=1751063367", sizes: [{ size: "2×7 Runner", units: 46 }] },
      { name: "Camilla", units: 19, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/OM-214_Roll_OH_edited_a2d93a63-2059-490d-b974-ff03fe11c1c3.jpg?v=1751063276", sizes: [{ size: "Roll", units: 9 }, { size: "Cut", units: 6 }, { size: "2×7 Runner", units: 4 }] },
      { name: "Leon", units: 1, image: "https://cdn.shopify.com/s/files/1/0669/1123/files/OM-237_RS_S_01_c52673e1-4b1a-430f-9771-833b2b4cfb8e.jpg?v=1751063477", sizes: [{ size: "9×13", units: 1 }] },
    ],
  },
  {
    name: "Loop-De-Loop",
    totalUnits: 102,
    designCount: 4,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LDL-78_RS_S_01.jpg?v=1751060637",
    sizeBuckets: ["Medium", "Large", "Runner", "Small Round"],
    subDesigns: [
      { name: "Cruce", units: 96, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LDL-78_RS_S_01.jpg?v=1751060637", sizes: [{ size: "5×7", units: 78 }, { size: "3×9 Runner", units: 13 }, { size: "8×11", units: 3 }, { size: "4' Round", units: 2 }] },
      { name: "Kaya", units: 4, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LDL-39_OH.jpg?v=1742604952", sizes: [{ size: "2×7 Runner", units: 4 }] },
      { name: "Arbor", units: 1, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LDL-04_OH.jpg?v=1742604673", sizes: [{ size: "4' Round", units: 1 }] },
      { name: "Carina", units: 1, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LDL-1528x10OH.jpg?v=1753642915", sizes: [{ size: "2×7 Runner", units: 1 }] },
    ],
  },
  {
    name: "Serenity2",
    totalUnits: 102,
    designCount: 2,
    image: "https://cdn.shopify.com/s/files/1/0669/1123/products/SE-232OH.jpg?v=1753642912",
    sizeBuckets: ["Medium", "Large", "Runner"],
    subDesigns: [
      { name: "Darcy", units: 101, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/SE-232OH.jpg?v=1753642912", sizes: [{ size: "3×10 Runner", units: 97 }, { size: "5×7", units: 4 }] },
      { name: "Ada", units: 1, image: "https://cdn.shopify.com/s/files/1/0669/1123/products/SE-158OH.jpg?v=1742607404", sizes: [{ size: "8×10", units: 1 }] },
    ],
  },
];

export { collections, rawSizeToBucket };
export type { Collection, SubDesign, SizeBreakdown };

const RugCollections = () => {
  const [activeSize, setActiveSize] = useState<SizeBucket>("All Sizes");
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);
  const { togglePattern, isSaved } = useRugFavorites();

  const filtered = collections
    .filter((c) => collectionMatchesBucket(c, activeSize))
    .sort((a, b) => b.totalUnits - a.totalUnits);

  const handleCardClick = (name: string) => {
    setExpandedCollection((prev) => (prev === name ? null : name));
  };

  return (
    <section id="collections" className="pt-6 md:pt-10 pb-6 md:pb-10 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-bold mb-3">Browse Collections</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click a collection to see designs and sizes.
          </p>
        </div>

        {/* Size Guide link */}
        <div className="text-center mb-6">
          <Link to="/size-guide">
            <Button variant="outline" size="default" className="font-semibold text-base px-8 h-11">
              View Size Guide <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
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
                "px-4 py-2 rounded-full text-lg font-medium transition-colors border",
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
                        <h3 className="font-bold text-lg leading-tight">Collection: {col.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {col.designCount} {col.designCount === 1 ? "pattern" : "patterns"} · In Stock
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
                    isExpanded ? "max-h-[2000px] opacity-100 mt-6 mb-6" : "max-h-0 opacity-0"
                  )}
                >
                  {isExpanded && (
                    <div className="bg-muted/50 border-2 border-accent/30 rounded-xl p-5 md:p-8 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
                        Collection: {col.name} — {col.designCount} {col.designCount === 1 ? "pattern" : "patterns"}
                      </p>
                      {col.subDesigns ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[...col.subDesigns]
                            .sort((a, b) => b.units - a.units)
                            .map((design) => {
                                const patternId = `${col.name}::${design.name}`;
                                const saved = isSaved(patternId);
                                const patternData: SavedPattern = {
                                  id: patternId,
                                  collectionName: col.name,
                                  designName: design.name,
                                  image: design.image,
                                  sizes: design.sizes.map((s) => ({ size: displaySize(s.size), units: s.units })),
                                };
                                return (
                              <div
                                key={design.name}
                                className="border rounded-lg overflow-hidden bg-background relative"
                              >
                                <button
                                  onClick={(e) => { e.stopPropagation(); togglePattern(patternData); }}
                                  className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors shadow-sm"
                                  aria-label={saved ? `Remove ${design.name} from saved` : `Save ${design.name}`}
                                >
                                  <Heart className={cn("h-4 w-4 transition-colors", saved ? "text-red-500 fill-red-500" : "text-muted-foreground hover:text-red-400")} />
                                </button>
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
                                      In Stock
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                  {design.sizes.map((s, idx) => {
                                    const avail = getAvailability(s.units);
                                    return (
                                    <div
                                      key={idx}
                                      className="flex flex-col items-center px-2 py-1 rounded-lg bg-muted text-center min-w-[60px]"
                                    >
                                      <span className="text-sm font-medium text-foreground">{displaySize(s.size)}</span>
                                      <span className={cn("text-xs font-medium", avail.color)}>
                                        {avail.label}
                                      </span>
                                    </div>
                                    );
                                  })}
                                  </div>
                                </div>
                              </div>
                                );
                            })}
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
                              In Stock · {col.fallbackNote}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="mt-5 border-t border-accent/20 pt-1" />
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
