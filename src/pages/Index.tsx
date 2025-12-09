import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import StatsSection from "@/components/StatsSection";
import CategorySection from "@/components/CategorySection";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-marketplace.jpg";

const Index = () => {
  const { addItem, totalItems } = useCart();
  const navigate = useNavigate();

  // Get curated products by category with similar price ranges
  const getCategoryProducts = (categoryName: string, count: number = 4) => {
    const categoryProducts = mockProducts.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );
    
    // Sort by price and pick products from similar price ranges
    const sorted = [...categoryProducts].sort((a, b) => a.discountedPrice - b.discountedPrice);
    
    // Pick products from the middle price range for a cohesive look
    const midIndex = Math.floor(sorted.length / 3);
    const midRangeProducts = sorted.slice(midIndex, midIndex + count * 3);
    
    // Return evenly spaced products from the mid-range
    const step = Math.floor(midRangeProducts.length / count) || 1;
    const selected: typeof mockProducts = [];
    for (let i = 0; i < count && i * step < midRangeProducts.length; i++) {
      selected.push(midRangeProducts[i * step]);
    }
    
    return selected.slice(0, count);
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
              <p className="mb-4 md:mb-5 text-xl md:text-2xl text-primary-foreground/90 font-bold">
                Private Marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button
                  variant="accent"
                  size="default"
                  className="gap-2"
                  onClick={() => navigate("/products")}
                >
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <StatsSection />

        {/* Featured Products by Category */}
        <section className="py-6 md:py-8">
          <div className="container mx-auto px-4">
            <div className="mb-10 md:mb-14 text-center">
              <h2 className="mb-3 md:mb-4 text-3xl md:text-5xl font-black">
                Featured Products
              </h2>
              <p className="text-base md:text-xl text-muted-foreground">
                High-quality brands. Better-than-wholesale pricing.
              </p>
            </div>

            {/* Category Sections */}
            <div className="space-y-12 md:space-y-16">
              {featuredCategories.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                      {category.name}{" "}
                      <span className="text-muted-foreground font-normal text-base md:text-lg">
                        — {getCategoryCount(category.name).toLocaleString()} items
                      </span>
                    </h3>
                    <Link
                      to={`/products?category=${encodeURIComponent(category.name)}`}
                      className="text-sm md:text-base font-medium text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
                    >
                      View All <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {category.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addItem}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 md:mt-16">
              <Button
                variant="default"
                size="lg"
                className="gap-2"
                onClick={() => navigate("/products")}
              >
                View All {totalProductCount.toLocaleString()} Products
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <CategorySection />

        {/* CTA Section */}
        <section className="py-10 md:py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-3 md:mb-4 text-2xl md:text-4xl font-bold text-primary-foreground">
              Stretch your budget, not your standards.
            </h2>
            <p className="mb-6 md:mb-8 text-base md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of buyers discovering incredible deals on quality
              pieces.
            </p>
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