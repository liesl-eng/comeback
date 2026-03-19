import { Tag, LayoutGrid, CalendarSync, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const valueProps = [
  {
    icon: Tag,
    title: "Real Savings, Zero Waste",
    body: "Get items up to 70% below wholesale. No mystery lots or weird auction dynamics.",
  },
  {
    icon: LayoutGrid,
    title: "Curated for How You Actually Buy",
    body: "Build your own pallets. Room-ready kits and scheduled refresh programs.",
  },
  {
    icon: CalendarSync,
    title: "Replenishment on Your Schedule",
    body: "Small-batch orders and quick turns.",
  },
  {
    icon: ShieldCheck,
    title: "Inspected by Comeback",
    body: "We don't broker — every item is graded and consolidated at our facility. Sourced responsibly, shipped confidently.",
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
