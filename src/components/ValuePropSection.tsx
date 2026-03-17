import { Tag, LayoutGrid, CalendarSync, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const valueProps = [
  {
    icon: Tag,
    title: "Real Savings, Clear Math",
    body: "Every item is priced 30–70% below MSRP. No mystery lots, no auction dynamics. You see what you're getting and what you're saving — before you commit.",
  },
  {
    icon: LayoutGrid,
    title: "Curated for How You Actually Buy",
    body: "Coordinated assortments, room-ready kits, and scheduled refresh programs. We do the curation work so you're not piecing together a room from 12 separate orders.",
  },
  {
    icon: CalendarSync,
    title: "Replenishment on Your Schedule",
    body: "Small-batch orders. Quick turns. Whether you're furnishing one unit or refreshing fifty rooms, we work around your procurement timeline.",
  },
  {
    icon: ShieldCheck,
    title: "Inspected at Our Crossdock",
    body: "We don't broker. We touch the product. Every item is graded and consolidated at our crossdock — overstock and closeout goods sourced responsibly, shipped confidently.",
  },
];

const ValuePropSection = () => {
  return (
    <section className="py-8 md:py-14 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {valueProps.map((prop) => (
            <Card key={prop.title} className="border-border/60 bg-card">
              <CardContent className="p-5 md:p-6 flex flex-col items-start gap-3">
                <div className="p-2.5 rounded-full bg-accent/10">
                  <prop.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{prop.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{prop.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropSection;
