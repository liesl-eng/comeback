import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, RectangleVertical, Lightbulb, Armchair, Table2, BedDouble } from "lucide-react";
import { useNavigate } from "react-router-dom";

const programs = [
  {
    icon: Lightbulb,
    title: "Lighting",
    desc: "Table lamps, floor lamps, sconces, pendants, and chandeliers.",
    badge: "Lamps · Sconces · Pendants",
    cta: "Shop Lighting",
    path: "/lighting",
    accent: "from-accent via-accent to-amber-600",
  },
  {
    icon: RectangleVertical,
    title: "Mirrors",
    desc: "Wall mirrors, floor mirrors, and statement pieces.",
    badge: "Wall · Floor · Accent",
    cta: "Shop Mirrors",
    path: "/mirrors",
    accent: "from-slate-300 via-slate-400 to-slate-500",
  },
  {
    icon: Table2,
    title: "Tables",
    desc: "Coffee tables, side tables, dining tables, and consoles.",
    badge: "Coffee · Side · Dining",
    cta: "Shop Tables",
    path: "/tables",
    accent: "from-slate-300 via-slate-400 to-slate-500",
  },
];


const ProgramsSection = () => {
  const navigate = useNavigate();

  return (
    <section id="programs" className="pt-2 md:pt-4 pb-12 md:pb-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Shop By Category
          </h2>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {programs.map((p) => (
            <Card
              key={p.title}
              role="link"
              tabIndex={0}
              onClick={() => navigate(p.path)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(p.path);
                }
              }}
              className="relative overflow-hidden flex flex-col p-6 cursor-pointer hover:shadow-hover hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
                onClick={(e) => { e.stopPropagation(); navigate(p.path); }}
              >
                {p.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Rug Program band */}
      <div className="mt-12 md:mt-16 bg-gradient-hero max-w-6xl mx-4 md:mx-auto rounded-xl">
        <div className="px-6 md:px-10 py-10 md:py-14">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-2">
                Rug Program
              </p>
              <h3 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-2">
                Looking for rugs?
              </h3>
              <p className="text-primary-foreground/80 text-base md:text-lg">
                Visit the Comeback Rug Program — curated closeout rugs, pallet-ready and delivered on your schedule.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button
                variant="accent"
                size="lg"
                className="gap-2"
                onClick={() => navigate("/rugs")}
              >
                Visit Rug Program
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
