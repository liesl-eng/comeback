import { Tag, LayoutGrid, CalendarSync, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import comebackBadge from "@/assets/comeback-goods-badge.png";

const valueProps = [
  {
    icon: Tag,
    title: "Real Savings, Zero Waste",
    body: "30–60% below wholesale. SKU-level ordering — no mystery lots.",
    showStamp: false,
  },
  {
    icon: LayoutGrid,
    title: "Curated for How You Actually Buy",
    body: "Build your own pallets. Room-ready kits and scheduled refresh programs.",
    showStamp: false,
  },
  {
    icon: CalendarSync,
    title: "Replenishment on Your Schedule",
    body: "Small batch orders with fast, reliable shipping. Procurement-ready and operationally easy.",
    showStamp: false,
  },
  {
    icon: ShieldCheck,
    title: "Inspected by Comeback",
    body: "We don't broker — every item is graded and consolidated at our facility.",
    showStamp: true,
  },
];

const ValuePropSection = () => {
  return (
    <section className="pt-4 pb-2 md:pt-6 md:pb-4 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {valueProps.map((prop) => (
            <Card key={prop.title} className="border-border/60 bg-card">
              <CardContent className="p-5 md:p-6 flex flex-col items-start gap-3">
                <div className="p-3 rounded-full bg-accent/10">
                  <prop.icon className="h-8 w-8 text-accent" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-foreground">{prop.title}</h3>
                  {prop.showStamp && (
                    <img src={comebackBadge} alt="Comeback Goods" className="h-8 w-8 rounded-full object-cover flex-shrink-0" />
                  )}
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">{prop.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropSection;
