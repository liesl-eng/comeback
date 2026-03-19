import { Card } from "@/components/ui/card";

const segments = [
  { icon: "🏪", title: "Specialty Stores", desc: "High-margin inventory your shoppers will love" },
  { icon: "🏢", title: "Property Managers", desc: "Turnkey supply for unit turnover" },
  { icon: "🏡", title: "Short-Term Rentals", desc: "Refresh listings affordably at scale" },
  { icon: "🎨", title: "Stagers & Designers", desc: "Premium looks without premium cost" },
];

const BuyerSegmentSection = () => {
  return (
    <section className="py-14 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-bold mb-3">Stretch Your Budget, Not Your Standards.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Reliable, affordable inventory — without the sourcing headaches.
          </p>
        </div>
        <p className="text-base md:text-lg font-semibold uppercase tracking-widest text-accent text-center mb-6">Perfect For</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {segments.map((card) => (
            <Card
              key={card.title}
              className="text-center p-6 border-2 border-transparent hover:border-accent/50 transition-colors cursor-default"
            >
              <span className="text-4xl mb-3 block">{card.icon}</span>
              <h3 className="font-bold text-xl md:text-2xl mb-1">{card.title}</h3>
              <p className="text-base text-muted-foreground">{card.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuyerSegmentSection;
