import { Tag, LayoutGrid, CalendarSync } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import comebackBadge from "@/assets/comeback-goods-badge.png";

const valueProps = [
  {
    icon: Tag,
    title: "Real Savings, Zero Waste",
    body: "Get items up to 70% below wholesale. No mystery lots or weird auction dynamics.",
    useLogo: false,
  },
  {
    icon: LayoutGrid,
    title: "Curated for How You Actually Buy",
    body: "Build your own pallets. Room-ready kits and scheduled refresh programs.",
    useLogo: false,
  },
  {
    icon: CalendarSync,
    title: "Replenishment on Your Schedule",
    body: "Small-batch orders and quick turns.",
    useLogo: false,
  },
  {
    icon: null,
    title: "Inspected by Comeback Goods",
    body: "We don't broker — every item is graded and consolidated at our facility. Sourced responsibly, shipped confidently.",
    useLogo: true,
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
                {prop.useLogo ? (
                  <img src={comebackBadge} alt="Comeback Goods" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="p-2.5 rounded-full bg-accent/10">
                    <prop.icon className="h-6 w-6 text-accent" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground">{prop.title}</h3>
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
