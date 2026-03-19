import Navbar from "@/components/Navbar";
import StatsSection from "@/components/StatsSection";
import CategorySection from "@/components/CategorySection";
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
              <h1 className="mb-4 md:mb-6 text-3xl sm:text-4xl md:text-5xl font-black text-primary-foreground lg:text-6xl tracking-tight">
                Tiny Imperfections. Huge Savings.
              </h1>
              <p className="mb-2 md:mb-3 text-lg md:text-xl text-primary-foreground/90 font-medium max-w-3xl mx-auto">
                High quality home goods — priced up to <span className="underline underline-offset-4 decoration-2">60% below wholesale</span>.
              </p>
              <p className="mb-6 md:mb-8 text-lg md:text-xl text-primary-foreground/90 font-medium">
                Shop by SKU. Build your own pallet.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button
                  variant="accent"
                  size="lg"
                  className="gap-2"
                  onClick={() => navigate("/products")}
                >
                  Build Your Pallet
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
                {["Furniture", "Decor", "Lighting", "Mirrors", "Pillows & Rugs", "Outdoor"].map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground backdrop-blur-sm"
                    onClick={() => navigate(`/products?category=${encodeURIComponent(category)}`)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Transition Line */}
        <section className="pt-6 pb-2 md:pt-8 md:pb-4 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xl md:text-3xl text-muted-foreground font-medium">
              Stretch your budget, not your standards.
            </p>
          </div>
        </section>

        {/* Stats Banner */}
        <StatsSection />

        {/* Value Prop Section */}
        <ValuePropSection />

        {/* Shop by Category */}
        <CategorySection />

        {/* Who It's For */}
        <BuyerSegmentSection />

        {/* CTA Section */}
        <section className="py-10 md:py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 md:mb-8 text-2xl md:text-4xl font-bold text-primary-foreground">
              High-quality brands. Less-than-wholesale pricing.
            </h2>
            <Button
              variant="accent"
              size="lg"
              className="gap-2"
              onClick={() => navigate("/products")}
            >
              Browse Products
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
