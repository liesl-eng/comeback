import { Building2, Hotel, Palette, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const segments = [
  {
    icon: Building2,
    title: "Property Managers & STR Operators",
    body: "Furnish and refresh units at wholesale cost. Consistent quality, low minimums, and no retail markup surprises.",
  },
  {
    icon: Hotel,
    title: "Boutique Hotels & Corporate Housing",
    body: "Curated room kits and scheduled refreshes. We handle the sourcing coordination; you handle the guests.",
  },
  {
    icon: Palette,
    title: "Stagers & Designers",
    body: "Overstock product from brands you actually use — priced for project margins, not retail markups.",
  },
  {
    icon: Store,
    title: "Boutique Retailers",
    body: "Closeout inventory with real brand provenance. Differentiated product at margins that work for your floor.",
  },
];

const BuyerSegmentSection = () => {
  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8 md:mb-10">
          Who It's For
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {segments.map((seg) => (
            <Card key={seg.title} className="border-border/60 bg-card">
              <CardContent className="p-5 md:p-6 flex flex-col items-start gap-3">
                <div className="p-2.5 rounded-full bg-accent/10">
                  <seg.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{seg.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{seg.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuyerSegmentSection;
