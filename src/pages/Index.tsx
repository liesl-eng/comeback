import Navbar from "@/components/Navbar";
import StatsSection from "@/components/StatsSection";
import ValuePropSection from "@/components/ValuePropSection";
import BuyerSegmentSection from "@/components/BuyerSegmentSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-marketplace.jpg";


const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 opacity-10">
            <img
              src={heroImage}
              alt="Warehouse"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="container relative mx-auto px-4 md:px-6 pt-14 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="mb-4 md:mb-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-primary-foreground tracking-tight leading-[0.95] text-center" style={{ textShadow: "3px 3px 0 hsl(0 0% 0% / 0.55)" }}>
                Tiny Imperfections.{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Huge</span>
                  <span aria-hidden className="absolute left-0 right-0 bottom-1 h-3 md:h-4 bg-[hsl(15_75%_70%)] z-0" />
                </span>{" "}
                Savings.
              </h1>
              <p className="mb-2 md:mb-3 text-xl md:text-2xl lg:text-3xl text-primary-foreground/90 font-medium max-w-3xl mx-auto text-center">
                High quality home goods — priced <span className="underline underline-offset-4 decoration-2">30–60% below wholesale</span>.
              </p>
              <p className="mb-6 md:mb-8 text-xl md:text-2xl lg:text-3xl text-primary-foreground/90 font-medium text-center">
                Shop by SKU.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button
                  variant="accent"
                  size="lg"
                  className="gap-2"
                  onClick={() => navigate("/catalog")}
                >
                  Shop Catalog
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </Button>
              </div>
              
              {/* Category buttons */}
              <div className="mt-6 md:mt-8 flex flex-wrap gap-2 md:gap-3 justify-center">
                {["Lighting", "Mirrors", "Accessories", "Small Furniture", "Large Furniture", "Sofas", "Chairs"].map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground backdrop-blur-sm"
                    onClick={() => navigate(`/catalog?category=${encodeURIComponent(category)}`)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <StatsSection />

        {/* Stretch Your Budget headline */}
        <section className="pt-10 pb-1 md:pt-14 md:pb-2 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">Stretch Your Budget, Not Your Standards.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Reliable, affordable inventory — without the sourcing headaches.
            </p>
          </div>
        </section>

        {/* Value Prop Section */}
        <ValuePropSection />

        {/* Who It's For */}
        <BuyerSegmentSection />

        {/* CTA Section */}
        <section className="py-6 md:py-10 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 md:mb-8 text-lg md:text-2xl font-bold text-primary-foreground">
              Shop by SKU.
            </h2>
            <Button
              variant="accent"
              size="lg"
              className="gap-2"
              onClick={() => navigate("/catalog")}
            >
              Start Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Comeback Goods. Almost Perfect. Always Loved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
