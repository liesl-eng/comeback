import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, RectangleVertical, Lightbulb, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

const programs = [
  {
    icon: RectangleVertical,
    title: "Mirror Program",
    desc:
      "Wall mirrors, floor mirrors, and statement pieces from Modus Furniture and Mercana. Up to 98% below MSRP.",
    badge: "43 SKUs · In Stock",
    cta: "Shop Mirrors",
    path: "/mirrors",
    accent: "from-slate-300 via-slate-400 to-slate-500",
  },
  {
    icon: Lightbulb,
    title: "Lighting Program",
    desc:
      "Table lamps, floor lamps, sconces, pendants, and chandeliers from Arteriors Home and Ferm Living. Up to 97% below MSRP.",
    badge: "96 SKUs · In Stock",
    cta: "Shop Lighting",
    path: "/lighting",
    accent: "from-accent via-accent to-amber-600",
  },
  {
    icon: Layers,
    title: "Rug Program",
    desc:
      "Flatwoven closeout rugs from Well Woven. Individually rolled, tagged, and pallet-ready.",
    badge: "500+ SKUs · In Stock",
    cta: "Shop Rugs",
    path: "/rugs",
    accent: "from-primary via-primary to-slate-800",
  },
];

const ProgramsSection = () => {
  const navigate = useNavigate();

  return (
    <section id="programs" className="py-12 md:py-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12 max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
            Our Programs
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Shop By Category
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Curated closeout inventory from premium brands — ready to order, priced below wholesale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {programs.map((p) => (
            <Card
              key={p.title}
              className="relative overflow-hidden flex flex-col p-6 hover:shadow-hover transition-shadow"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${p.accent}`} />
              <div className="p-3 rounded-full bg-accent/10 w-fit mb-4">
                <p.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-base mb-4 flex-1">{p.desc}</p>
              <span className="inline-block self-start text-xs font-semibold px-3 py-1 rounded-full bg-accent/15 text-accent-foreground mb-5">
                {p.badge}
              </span>
              <Button
                variant="accent"
                className="w-full gap-2"
                onClick={() => navigate(p.path)}
              >
                {p.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
