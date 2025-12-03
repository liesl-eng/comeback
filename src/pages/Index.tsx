import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-marketplace.jpg";
const Index = () => {
  const {
    addItem,
    totalItems
  } = useCart();
  const navigate = useNavigate();
  const featuredProducts = mockProducts.slice(0, 4);
  return <div className="min-h-screen bg-background">
      <Navbar cartItemCount={totalItems} />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 opacity-10">
            <img src={heroImage} alt="Warehouse" className="h-full w-full object-cover" />
          </div>
          <div className="container relative mx-auto px-6 py-10 lg:py-14">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6 text-5xl font-black text-primary-foreground lg:text-7xl uppercase tracking-tight">
                TINY IMPERFECTIONS. <span className="text-accent">HUGE</span> SAVINGS.
              </h1>
              <p className="mb-6 text-2xl text-primary-foreground/90 font-bold">
                Private Marketplace.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="accent" size="lg" className="gap-2" onClick={() => navigate("/products")}>
                  Browse Products
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate("/about")}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-5xl font-black">Featured Products</h2>
              <p className="text-xl text-muted-foreground">
                High quality brands. Better-than-wholesale pricing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={addItem} />)}
            </div>

            <div className="text-center">
              <Button variant="default" size="lg" onClick={() => navigate("/products")}>
                View All Products
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-foreground">
              Ready to Start Saving?
            </h2>
            <p className="mb-8 text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of buyers discovering incredible deals on quality inventory
            </p>
            <Button variant="accent" size="lg" className="gap-2" onClick={() => navigate("/products")}>
              Explore Marketplace
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Comeback Goods. Tiny imperfections, huge savings.</p>
        </div>
      </footer>
    </div>;
};
export default Index;