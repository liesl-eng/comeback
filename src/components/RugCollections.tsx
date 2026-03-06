import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const SIZE_FILTERS = [
  "All Sizes", "2'×3'", "3'×5'", "5'×7'", "6'×9'", "8'×10'", "9'×13'", "2'×7' Runner", "Round",
] as const;

type SizeFilter = (typeof SIZE_FILTERS)[number];

interface Collection {
  name: string;
  units: number;
  designs: number;
  sizes: string[];
  image: string;
}

const collections: Collection[] = [
  { name: "Lotus", units: 3987, designs: 12, sizes: ["2'×3'", "3'×5'", "5'×7'", "6'×9'", "8'×10'", "2'×7' Runner"], image: "https://cdn.shopify.com/s/files/1/0669/1123/products/LOT-50CU5_W.jpg?v=1753642856" },
  { name: "Dazzle", units: 2875, designs: 1, sizes: ["2'×3'", "3'×5'", "5'×7'", "6'×9'", "8'×10'", "9'×13'", "2'×7' Runner"], image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DZ-088x10CU5.jpg?v=1753643053" },
  { name: "Kings Court", units: 2762, designs: 9, sizes: ["3'×5'", "5'×7'", "8'×10'", "2'×7' Runner"], image: "https://cdn.shopify.com/s/files/1/0669/1123/products/6516_Runner_OH.jpg?v=1742600678" },
  { name: "Madison Shag", units: 2074, designs: 5, sizes: ["2'×3'", "3'×5'", "5'×7'", "8'×10'", "2'×7' Runner", "Round"], image: "https://cdn.shopify.com/s/files/1/0669/1123/products/7062_4_Round_073da78d-540d-4322-b43d-2db3328b4322.jpg?v=1753643163" },
  { name: "Rodeo", units: 1318, designs: 4, sizes: ["2'×3'", "3'×5'", "5'×7'", "2'×7' Runner"], image: "https://cdn.shopify.com/s/files/1/0669/1123/products/RO-02_OH.jpg?v=1742601782" },
  { name: "Elle Basics", units: 1074, designs: 1, sizes: ["2'×3'", "5'×7'", "6'×9'", "8'×10'", "2'×7' Runner"], image: "https://cdn.shopify.com/s/files/1/0669/1123/products/ELL-128x10OH.jpg?v=1742620397" },
  { name: "Dorado", units: 825, designs: 8, sizes: ["3'×5'", "2'×7' Runner"], image: "https://cdn.shopify.com/s/files/1/0669/1123/products/DO-512RS_S_01Graphic_1.jpg?v=1751060076" },
  { name: "Money", units: 767, designs: 4, sizes: ["5'×7'", "8'×10'", "9'×13'", "2'×7' Runner", "Round"], image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MN-01A8x10OH.jpg?v=1751059908" },
  { name: "Kennedy", units: 618, designs: 3, sizes: ["3'×5'", "2'×7' Runner", "Round"], image: "https://cdn.shopify.com/s/files/1/0669/1123/products/KEN-14OH.jpg?v=1751232653" },
  { name: "Dulcet", units: 613, designs: 4, sizes: ["2'×3'", "3'×5'", "5'×7'", "8'×10'", "9'×13'", "2'×7' Runner"], image: "https://cdn.shopify.com/s/files/1/0669/1123/files/1940_RS_S_01_R1.jpg?v=1753643333" },
  { name: "Zazzle", units: 383, designs: 1, sizes: ["5'×7'", "2'×7' Runner"], image: "https://cdn.shopify.com/s/files/1/0669/1123/files/ZAZ-23_8x10_OH_1.jpg?v=1742624393" },
  { name: "Mystic", units: 373, designs: 4, sizes: ["5'×7'", "8'×10'", "2'×7' Runner"], image: "https://cdn.shopify.com/s/files/1/0669/1123/files/MC-457OH.jpg?v=1751061979" },
  { name: "Apollo", units: 226, designs: 3, sizes: ["2'×3'", "3'×5'", "5'×7'", "8'×10'", "2'×7' Runner"], image: "https://cdn.shopify.com/s/files/1/0669/1123/products/W-MR-04E2x4OH.jpg?v=1742627436" },
  { name: "Brielle", units: 211, designs: 1, sizes: ["Round"], image: "https://cdn.shopify.com/s/files/1/0669/1123/products/BRI-42RoundRS_S_01.jpg?v=1742611088" },
  { name: "Ell Basics", units: 162, designs: 3, sizes: ["2'×3'", "5'×7'", "8'×10'", "2'×7' Runner"], image: "https://cdn.shopify.com/s/files/1/0669/1123/files/EBP-20Graphics_1.jpg?v=1751063157" },
];

const RugCollections = () => {
  const [activeSize, setActiveSize] = useState<SizeFilter>("All Sizes");

  const filtered = collections
    .filter((c) => activeSize === "All Sizes" || c.sizes.includes(activeSize))
    .sort((a, b) => b.units - a.units);

  return (
    <section className="pt-6 md:pt-10 pb-6 md:pb-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-bold mb-3">Browse Available Collections</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Filter by size to find what fits your needs. Brands, styles, and availability rotate.
          </p>
        </div>

        {/* Size filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-4xl mx-auto">
          {SIZE_FILTERS.map((size) => (
            <button
              key={size}
              onClick={() => setActiveSize(size)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeSize === size
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card text-muted-foreground border-border hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Collection grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {filtered.map((col) => (
            <Card key={col.name} className="overflow-hidden">
              <div className="h-52 overflow-hidden bg-muted">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4 space-y-1.5">
                <h3 className="font-semibold text-lg leading-tight">{col.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {col.designs} {col.designs === 1 ? "design" : "designs"} · {col.units.toLocaleString()} units available
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {col.sizes.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground italic mt-8 max-w-xl mx-auto">
          Pricing varies by volume and mix. Request a quote for current availability and rates.
        </p>
      </div>
    </section>
  );
};

export default RugCollections;
