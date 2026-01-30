import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import StatsSection from "@/components/StatsSection";
import CategorySection from "@/components/CategorySection";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-marketplace.jpg";

const Index = () => {
  const { addItem, totalItems } = useCart();
  const navigate = useNavigate();

  // Premium price thresholds by category
  const premiumThresholds: Record<string, number> = {
    furniture: 400,
    decor: 100,
    lighting: 150,
  };

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get randomized premium Arhaus products by category
  const getCategoryProducts = (categoryName: string, count: number = 4) => {
    const categoryLower = categoryName.toLowerCase();
    const threshold = premiumThresholds[categoryLower] || 50;
    
    // Filter for Arhaus products in this category with valid images
    const arhausProducts = mockProducts.filter(
      (p) => p.category.toLowerCase() === categoryLower && 
             p.brand === "Arhaus" &&
             p.imageUrl && !p.imageUrl.includes("placeholder")
    );
    
    // Filter for premium items above threshold
    let premiumProducts = arhausProducts.filter(
      (p) => p.discountedPrice >= threshold
    );
    
    // Fallback to items $50+ if not enough premium items
    if (premiumProducts.length < count) {
      premiumProducts = arhausProducts.filter(
        (p) => p.discountedPrice >= 50
      );
    }
    
    // Final fallback to all Arhaus products in category
    if (premiumProducts.length < count) {
      premiumProducts = arhausProducts;
    }
    
    // Randomize selection from premium products
    const shuffled = shuffleArray(premiumProducts);
    
    return shuffled.slice(0, count);
  };

  const getCategoryCount = (categoryName: string) => {
    return mockProducts.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  const featuredCategories = [
    { name: "Furniture", products: getCategoryProducts("Furniture") },
    { name: "Decor", products: getCategoryProducts("Decor") },
    { name: "Lighting", products: getCategoryProducts("Lighting") },
  ];

  const totalProductCount = mockProducts.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />

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
          <div className="container relative mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-12 md:pb-10 lg:pt-14 lg:pb-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="mb-3 md:mb-5 text-3xl sm:text-4xl md:text-5xl font-black text-primary-foreground lg:text-6xl uppercase tracking-tight">
                TINY IMPERFECTIONS.{" "}
                <span className="text-accent">HUGE</span> SAVINGS.
              </h1>
              <p className="mb-4 md:mb-5 text-2xl md:text-4xl text-primary-foreground/90 font-bold">
                Private B2B Marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button
                  variant="accent"
                  size="lg"
                  className="gap-2"
                  onClick={() => navigate("/products")}
                >
                  Browse Individual Items
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="highlight"
                  size="lg"
                  className="gap-2"
                  onClick={() => navigate("/pallets")}
                >
                  <Lock className="h-[18px] w-[18px]" />
                  Pallet Program
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
                {["Furniture", "Decor", "Lighting", "Mirrors", "Pillows & Rugs", "Outdoor", "Home & Wellness Tech"].map((category) => (
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

        {/* Stats Banner */}
        <StatsSection />

        {/* Sub-header */}
        <section className="pt-6 pb-2 md:pt-8 md:pb-4 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg md:text-2xl text-muted-foreground font-medium">
              Stretch your budget, not your standards.
            </p>
          </div>
        </section>

        {/* Shop by Category */}
        <CategorySection />

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