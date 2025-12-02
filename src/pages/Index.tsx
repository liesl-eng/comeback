import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { mockProducts } from "@/data/mockProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, TrendingDown, Package } from "lucide-react";
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
          <div className="container relative mx-auto px-4 py-12 lg:py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="mb-3 text-5xl font-black text-primary-foreground lg:text-7xl uppercase tracking-tight">
                TINY IMPERFECTIONS. <span className="text-accent">HUGE</span> SAVINGS.
              </h1>
              <p className="mb-6 text-2xl text-primary-foreground/80 font-medium">
                Private Marketplace.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="accent" size="lg" className="gap-2" onClick={() => navigate("/products")}>
                  Browse Products
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate("/products")}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <TrendingDown className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Average 55% Savings</h3>
                  <p className="text-muted-foreground">
                    Access deeply discounted inventory from verified suppliers across all categories
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Verified Suppliers</h3>
                  <p className="text-muted-foreground">
                    All suppliers are vetted and rated by our community of buyers
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Quality Guaranteed</h3>
                  <p className="text-muted-foreground">
                    All products are functional with transparent condition reporting
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">Featured Deals</h2>
              <p className="text-xl text-muted-foreground">
                Handpicked products with exceptional discounts
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